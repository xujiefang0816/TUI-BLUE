/**
 * 文件管理模块
 */
import { saveToLocalStorage, getFromLocalStorage, generateId, formatDate, exportToExcel } from './utils.js';
import { logOperation } from './settings.js';
import { getCurrentUser } from './users.js';

// 存储键名常量
const FILES_KEY = 'file_registration_system_files';
const EXPORTED_FILES_KEY = 'file_registration_system_exported_files';

// 初始化文件数据
export function initFiles() {
    const files = getFromLocalStorage(FILES_KEY);
    if (!files) {
        saveToLocalStorage(FILES_KEY, []);
        return [];
    }
    return files;
}

// 获取所有文件
export function getAllFiles() {
    return getFromLocalStorage(FILES_KEY) || [];
}

// 根据ID获取文件
export function getFileById(id) {
    const files = getAllFiles();
    return files.find(file => file.id === id);
}

// 添加文件
export function addFile(fileData) {
    const files = getAllFiles();
    const currentUser = getCurrentUser();
    
    const newFile = {
        id: generateId(),
        ...fileData,
        createTime: new Date().toISOString(),
        createUser: currentUser?.username || 'system',
        sendStatus: '未处理',
        sendStatusUpdateTime: null,
        endDate: null,
        rejectReason: null,
        fileNumber: null
    };
    
    files.push(newFile);
    saveToLocalStorage(FILES_KEY, files);
    
    // 记录操作日志
    logOperation(currentUser?.username || 'system', `添加文件记录，文件类型：${fileData.fileType}`);
    
    return newFile;
}

// 更新文件
export function updateFile(fileId, updates) {
    const files = getAllFiles();
    const currentUser = getCurrentUser();
    const index = files.findIndex(file => file.id === fileId);
    
    if (index === -1) {
        return { success: false, message: '文件不存在' };
    }
    
    // 保存原始信息用于日志
    const oldFile = { ...files[index] };
    
    // 更新文件信息
    files[index] = { ...files[index], ...updates };
    
    // 如果更新了送签状态，记录更新时间
    if (updates.sendStatus && updates.sendStatus !== oldFile.sendStatus) {
        files[index].sendStatusUpdateTime = new Date().toISOString();
        
        // 如果送签状态为'完毕'，设置结束日期
        if (updates.sendStatus === '完毕') {
            files[index].endDate = new Date().toISOString();
        }
    }
    
    saveToLocalStorage(FILES_KEY, files);
    
    // 记录操作日志
    let logMessage = `更新文件记录，ID：${fileId}`;
    if (updates.sendStatus && updates.sendStatus !== oldFile.sendStatus) {
        logMessage += `，送签状态从 ${oldFile.sendStatus} 改为 ${updates.sendStatus}`;
    }
    logOperation(currentUser?.username || 'system', logMessage);
    
    return { success: true, message: '文件更新成功', file: files[index] };
}

// 删除文件
export function deleteFile(fileId) {
    const files = getAllFiles();
    const currentUser = getCurrentUser();
    const index = files.findIndex(file => file.id === fileId);
    
    if (index === -1) {
        return { success: false, message: '文件不存在' };
    }
    
    // 保存要删除的文件信息用于日志
    const deletedFile = files[index];
    
    // 删除文件
    files.splice(index, 1);
    saveToLocalStorage(FILES_KEY, files);
    
    // 记录操作日志
    logOperation(currentUser?.username || 'system', `删除文件记录，ID：${fileId}，文件类型：${deletedFile.fileType}`);
    
    return { success: true, message: '文件删除成功' };
}

// 批量删除文件
export function batchDeleteFiles(fileIds) {
    const files = getAllFiles();
    const currentUser = getCurrentUser();
    const remainingFiles = files.filter(file => !fileIds.includes(file.id));
    
    // 记录要删除的文件数量用于日志
    const deletedCount = files.length - remainingFiles.length;
    
    saveToLocalStorage(FILES_KEY, remainingFiles);
    
    // 记录操作日志
    logOperation(currentUser?.username || 'system', `批量删除文件记录，共删除 ${deletedCount} 条`);
    
    return { success: true, message: `成功删除 ${deletedCount} 条文件记录` };
}

// 批量更新送签状态
export function batchUpdateSendStatus(fileIds, sendStatus, rejectReason = null) {
    const files = getAllFiles();
    const currentUser = getCurrentUser();
    let updatedCount = 0;
    
    files.forEach(file => {
        if (fileIds.includes(file.id)) {
            file.sendStatus = sendStatus;
            file.sendStatusUpdateTime = new Date().toISOString();
            
            if (sendStatus === '退回' && rejectReason) {
                file.rejectReason = rejectReason;
            } else if (sendStatus !== '退回') {
                file.rejectReason = null;
            }
            
            // 如果送签状态为'完毕'，设置结束日期
            if (sendStatus === '完毕') {
                file.endDate = new Date().toISOString();
            }
            
            updatedCount++;
        }
    });
    
    saveToLocalStorage(FILES_KEY, files);
    
    // 记录操作日志
    logOperation(currentUser?.username || 'system', `批量更新文件送签状态为 ${sendStatus}，共更新 ${updatedCount} 条`);
    
    return { success: true, message: `成功更新 ${updatedCount} 条文件的送签状态` };
}

// 生成文件编号
export function generateFileNumber(fileType, department, currentNumber = null) {
    // 根据文件类型和部门生成不同格式的编号
    switch (fileType) {
        case '采购计划审批表':
            // TBTC-编号
            return `TBTC-${currentNumber || generateSequenceNumber('purchase')}`;
            
        case '合同（协议）签订审批表':
            // TBTC-部门-编号
            let deptCode = 'MISC'; // 默认部门代码
            if (department.includes('财务')) deptCode = 'FIN';
            else if (department.includes('前厅')) deptCode = 'FO';
            else if (department.includes('行政')) deptCode = 'EO';
            else if (department.includes('人事')) deptCode = 'HR';
            else if (department.includes('客房')) deptCode = 'HKSP';
            else if (department.includes('销售')) deptCode = 'S&M';
            else if (department.includes('工程')) deptCode = 'ENG';
            else if (department.includes('工会')) deptCode = 'TU';
            else if (department.includes('食材')) deptCode = 'FOOD';
            else if (department.includes('酒水')) deptCode = 'BEVERAGE';
            
            return `TBTC-${deptCode}-${currentNumber || generateSequenceNumber('contract')}`;
            
        case '付款申请单':
        case '付款单+用印审批（仅限验收报告）':
            // 7位数字编号
            return currentNumber || generateSequenceNumber('payment', 7);
            
        default:
            // 其他文件类型使用通用编号格式
            return `DOC-${generateSequenceNumber('doc')}`;
    }
}

// 生成序列号
export function generateSequenceNumber(type, length = 4) {
    const key = `sequence_${type}`;
    let sequence = getFromLocalStorage(key) || 0;
    sequence++;
    
    // 保存更新后的序列号
    saveToLocalStorage(key, sequence);
    
    // 格式化为指定长度的字符串，前面补零
    return sequence.toString().padStart(length, '0');
}

// 搜索和筛选文件
export function searchFiles(filters = {}) {
    let files = getAllFiles();
    
    // 如果有搜索关键词，进行模糊搜索
    if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        files = files.filter(file => 
            (file.fileType && file.fileType.toLowerCase().includes(keyword)) ||
            (file.department && file.department.toLowerCase().includes(keyword)) ||
            (file.applicant && file.applicant.toLowerCase().includes(keyword)) ||
            (file.content && file.content.toLowerCase().includes(keyword)) ||
            (file.fileNumber && file.fileNumber.toLowerCase().includes(keyword))
        );
    }
    
    // 按日期筛选
    if (filters.startDate) {
        files = files.filter(file => new Date(file.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
        files = files.filter(file => new Date(file.date) <= new Date(filters.endDate));
    }
    
    // 按文件类型筛选
    if (filters.fileType && filters.fileType !== '全部') {
        files = files.filter(file => file.fileType === filters.fileType);
    }
    
    // 按部门筛选
    if (filters.department && filters.department !== '全部') {
        files = files.filter(file => file.department === filters.department);
    }
    
    // 按送签状态筛选
    if (filters.sendStatus && filters.sendStatus !== '全部') {
        files = files.filter(file => file.sendStatus === filters.sendStatus);
    }
    
    // 按创建用户筛选
    if (filters.createUser && filters.createUser !== '全部') {
        files = files.filter(file => file.createUser === filters.createUser);
    }
    
    // 排序
    if (filters.sortBy && filters.sortOrder) {
        files.sort((a, b) => {
            let aValue = a[filters.sortBy];
            let bValue = b[filters.sortBy];
            
            if (aValue instanceof Date || (typeof aValue === 'string' && !isNaN(new Date(aValue).getTime()))) {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }
            
            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();
            
            if (filters.sortOrder === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });
    } else {
        // 默认按创建时间倒序排序
        files.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    }
    
    return files;
}

// 导出文件数据为Excel
export function exportFilesToExcel(files = null, filename = '文件数据') {
    // 如果没有传入文件列表，获取所有文件
    if (!files) {
        files = getAllFiles();
    }
    
    // 准备表格数据
    const tableData = files.map(file => {
        const exportFile = {
            日期: file.date ? formatDate(file.date, 'YYYY-MM-DD') : '-',
            文件类型: file.fileType || '-',
            文件编号: file.fileNumber || '-',
            申请部门: file.department || '-',
            申请人: file.applicant || '-',
            文件内容: file.content || '-',
            计量单位: file.unit || '-',
            数量: file.quantity || '-',
            金额: file.amount || '-',
            结束日期: file.endDate ? formatDate(file.endDate, 'YYYY-MM-DD') : '-',
            送签状态: file.sendStatus || '-',
            状态更新时间: file.sendStatusUpdateTime ? formatDate(file.sendStatusUpdateTime, 'YYYY-MM-DD HH:mm:ss') : '-',
            创建用户: file.createUser || '-',
            创建时间: file.createTime ? formatDate(file.createTime, 'YYYY-MM-DD HH:mm:ss') : '-'
        };
        
        // 如果有退回原因，添加到导出数据
        if (file.rejectReason) {
            exportFile['退回原因'] = file.rejectReason;
        }
        
        return exportFile;
    });
    
    // 创建临时表格用于导出
    const tableId = 'temp-export-table';
    let table = document.getElementById(tableId);
    
    // 如果表格已存在，先删除
    if (table) {
        table.remove();
    }
    
    // 创建新表格
    table = document.createElement('table');
    table.id = tableId;
    table.style.display = 'none';
    document.body.appendChild(table);
    
    // 创建表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = Object.keys(tableData[0] || {});
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 创建表格内容
    const tbody = document.createElement('tbody');
    tableData.forEach(rowData => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = rowData[header] || '';
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    
    // 调用导出函数
    exportToExcel(tableId, filename);
    
    // 删除临时表格
    setTimeout(() => {
        table.remove();
    }, 100);
    
    // 记录导出日志
    const currentUser = getCurrentUser();
    logOperation(currentUser?.username || 'system', `导出文件数据，共 ${tableData.length} 条记录`);
    
    // 记录导出历史
    const exportedFiles = getFromLocalStorage(EXPORTED_FILES_KEY) || [];
    exportedFiles.push({
        id: generateId(),
        filename: `${filename}.csv`,
        exportTime: new Date().toISOString(),
        exportUser: currentUser?.username || 'system',
        recordCount: tableData.length
    });
    saveToLocalStorage(EXPORTED_FILES_KEY, exportedFiles);
}

// 获取导出历史
export function getExportHistory() {
    return getFromLocalStorage(EXPORTED_FILES_KEY) || [];
}

// 清空导出历史
export function clearExportHistory() {
    saveToLocalStorage(EXPORTED_FILES_KEY, []);
    
    // 记录操作日志
    const currentUser = getCurrentUser();
    logOperation(currentUser?.username || 'system', '清空导出历史');
    
    return true;
}

// 生成摘要内容
export function generateSummaryContent(paymentType, paymentProject, paymentOption, period, company, percentage = null, otherRemark = null) {
    let summary = '';
    
    // 添加支付或报销选项
    summary += paymentOption === '支付' ? '支付：' : '报销：';
    
    // 添加支付项目
    if (paymentProject === '其他' && otherRemark) {
        summary += otherRemark + '，';
    } else {
        summary += paymentProject + '，';
    }
    
    // 添加支付类型
    summary += paymentType.name;
    if (paymentType.needPercentage && percentage) {
        summary += `(${percentage}%)`;
    }
    summary += '，';
    
    // 添加期间和单位简称
    summary += `(${period}--${company})`;
    
    return summary;
}

// 获取统计数据
export function getStatistics() {
    const files = getAllFiles();
    
    // 按文件类型统计
    const typeStats = {};
    files.forEach(file => {
        if (file.fileType) {
            typeStats[file.fileType] = (typeStats[file.fileType] || 0) + 1;
        }
    });
    
    // 按部门统计
    const deptStats = {};
    files.forEach(file => {
        if (file.department) {
            deptStats[file.department] = (deptStats[file.department] || 0) + 1;
        }
    });
    
    // 按送签状态统计
    const statusStats = {};
    files.forEach(file => {
        if (file.sendStatus) {
            statusStats[file.sendStatus] = (statusStats[file.sendStatus] || 0) + 1;
        }
    });
    
    // 计算总金额
    const totalAmount = files.reduce((sum, file) => {
        const amount = parseFloat(file.amount) || 0;
        return sum + amount;
    }, 0);
    
    // 本月新增
    const thisMonth = new Date().getMonth();
    const thisMonthYear = new Date().getFullYear();
    const thisMonthFiles = files.filter(file => {
        const fileDate = new Date(file.date);
        return fileDate.getMonth() === thisMonth && fileDate.getFullYear() === thisMonthYear;
    });
    
    return {
        totalFiles: files.length,
        totalAmount,
        typeStats,
        deptStats,
        statusStats,
        thisMonthFiles: thisMonthFiles.length
    };
}

// 验证文件数据
export function validateFileData(fileData) {
    const errors = [];
    
    // 验证必填字段
    if (!fileData.date) {
        errors.push('日期不能为空');
    }
    
    if (!fileData.fileType) {
        errors.push('文件类型不能为空');
    }
    
    if (!fileData.department) {
        errors.push('申请部门不能为空');
    }
    
    if (!fileData.applicant) {
        errors.push('申请人不能为空');
    }
    
    if (!fileData.content) {
        errors.push('文件内容不能为空');
    }
    
    // 验证数量和金额
    if (fileData.quantity !== undefined && fileData.quantity !== null && fileData.quantity !== '') {
        const quantity = parseFloat(fileData.quantity);
        if (isNaN(quantity)) {
            errors.push('数量必须是数字');
        }
    }
    
    if (fileData.amount !== undefined && fileData.amount !== null && fileData.amount !== '') {
        const amount = parseFloat(fileData.amount);
        if (isNaN(amount)) {
            errors.push('金额必须是数字');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}