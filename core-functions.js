// 核心功能模块

// 本地存储操作函数
function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error getting item ${key} from localStorage:`, error);
        return defaultValue;
    }
}

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error saving item ${key} to localStorage:`, error);
        return false;
    }
}

// 用户权限管理
function getCurrentUser() {
    return getFromLocalStorage('currentUser', null);
}

function setCurrentUser(user) {
    saveToLocalStorage('currentUser', user);
}

function checkPermission(permission) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    // 权限映射表
    const permissions = {
        admin: {
            canAccessFileRegistration: true,
            canAccessFileInformation: true,
            canAccessFileProcessing: true,
            canAccessSettings: true,
            canManageUsers: true,
            canEditFiles: true,
            canDeleteFiles: true,
            canExportFiles: true
        },
        normalAdmin: {
            canAccessFileRegistration: true,
            canAccessFileInformation: true,
            canAccessFileProcessing: true,
            canAccessSettings: false,
            canManageUsers: false,
            canEditFiles: true,
            canDeleteFiles: true,
            canExportFiles: true
        },
        normalUser: {
            canAccessFileRegistration: true,
            canAccessFileInformation: true,
            canAccessFileProcessing: false,
            canAccessSettings: false,
            canManageUsers: false,
            canEditFiles: false,
            canDeleteFiles: false,
            canExportFiles: false
        }
    };
    
    return permissions[currentUser.role]?.[permission] || false;
}

// 获取角色显示名称
function getRoleDisplayName(role) {
    const roleMap = {
        'admin': '总管理员',
        'normalAdmin': '普通管理员',
        'normalUser': '普通账号'
    };
    return roleMap[role] || role;
}

// 文件类型管理
function getFileTypes() {
    const defaultTypes = [
        '采购计划审批表', '合同（协议）签订审批表', '付款申请单', '用印审批表',
        '付款单+用印审批（仅限验收报告）', '工作联系单', '固定资产验收单', '会议议题',
        '借印审批表', '请假申请表', '差旅申请表', '其他'
    ];
    return getFromLocalStorage('fileTypes', defaultTypes);
}

function addFileType(fileType) {
    const fileTypes = getFileTypes();
    if (fileTypes.includes(fileType)) {
        return { success: false, message: '文件类型已存在' };
    }
    
    fileTypes.push(fileType);
    if (saveToLocalStorage('fileTypes', fileTypes)) {
        logOperation(`添加文件类型: ${fileType}`);
        return { success: true, message: '文件类型添加成功' };
    }
    return { success: false, message: '文件类型添加失败' };
}

function removeFileType(fileType) {
    const fileTypes = getFileTypes();
    const index = fileTypes.indexOf(fileType);
    if (index === -1) {
        return { success: false, message: '文件类型不存在' };
    }
    
    fileTypes.splice(index, 1);
    if (saveToLocalStorage('fileTypes', fileTypes)) {
        logOperation(`删除文件类型: ${fileType}`);
        return { success: true, message: '文件类型删除成功' };
    }
    return { success: false, message: '文件类型删除失败' };
}

// 部门管理
function getDepartments() {
    const defaultDepartments = [
        '前厅FO', '客房HSKP', '西餐厅', '中餐厅', '大堂吧', '宴会厅', '迷你吧',
        '餐饮办公室', '管事部', '饼房', '财务FIN', '行政EO', '人事HR',
        '员工餐厅', '销售S&M', '工程ENG'
    ];
    return getFromLocalStorage('departments', defaultDepartments);
}

function addDepartment(department) {
    const departments = getDepartments();
    if (departments.includes(department)) {
        return { success: false, message: '部门已存在' };
    }
    
    departments.push(department);
    if (saveToLocalStorage('departments', departments)) {
        logOperation(`添加部门: ${department}`);
        return { success: true, message: '部门添加成功' };
    }
    return { success: false, message: '部门添加失败' };
}

function removeDepartment(department) {
    const departments = getDepartments();
    const index = departments.indexOf(department);
    if (index === -1) {
        return { success: false, message: '部门不存在' };
    }
    
    departments.splice(index, 1);
    if (saveToLocalStorage('departments', departments)) {
        logOperation(`删除部门: ${department}`);
        return { success: true, message: '部门删除成功' };
    }
    return { success: false, message: '部门删除失败' };
}

// 计量单位管理
function getUnits() {
    const defaultUnits = [
        '/', '批', '个（支）', '件', '套', '份', '只', '台', '桶', '次', '块',
        '人', '盒', '瓶', '双', '张', '月', '年', '克（g）', '千克（kg）', '箱',
        '米', '平方米', '包', '袋', '家', 'PCS', 'PAC', '佣金（%）', '其他'
    ];
    return getFromLocalStorage('units', defaultUnits);
}

function addUnit(unit) {
    const units = getUnits();
    if (units.includes(unit)) {
        return { success: false, message: '计量单位已存在' };
    }
    
    units.push(unit);
    if (saveToLocalStorage('units', units)) {
        logOperation(`添加计量单位: ${unit}`);
        return { success: true, message: '计量单位添加成功' };
    }
    return { success: false, message: '计量单位添加失败' };
}

function removeUnit(unit) {
    const units = getUnits();
    const index = units.indexOf(unit);
    if (index === -1) {
        return { success: false, message: '计量单位不存在' };
    }
    
    units.splice(index, 1);
    if (saveToLocalStorage('units', units)) {
        logOperation(`删除计量单位: ${unit}`);
        return { success: true, message: '计量单位删除成功' };
    }
    return { success: false, message: '计量单位删除失败' };
}

// 送签状态管理
function getSendStatuses() {
    const defaultStatuses = [
        '完毕', '总秘（酒店总经理）', '待送集团', '业主代表', 
        '陆总及彭总（盖章处）', '集团审核', '集团经理待签', '退回',
        '未盖章', '重签', '作废', '资产管理部', '招采办',
        '酒店内部走签', '急单', '已签未付'
    ];
    return getFromLocalStorage('sendStatuses', defaultStatuses);
}

function addSendStatus(status) {
    const statuses = getSendStatuses();
    if (statuses.includes(status)) {
        return { success: false, message: '送签状态已存在' };
    }
    
    statuses.push(status);
    if (saveToLocalStorage('sendStatuses', statuses)) {
        logOperation(`添加送签状态: ${status}`);
        return { success: true, message: '送签状态添加成功' };
    }
    return { success: false, message: '送签状态添加失败' };
}

function removeSendStatus(status) {
    const statuses = getSendStatuses();
    const index = statuses.indexOf(status);
    if (index === -1) {
        return { success: false, message: '送签状态不存在' };
    }
    
    statuses.splice(index, 1);
    if (saveToLocalStorage('sendStatuses', statuses)) {
        logOperation(`删除送签状态: ${status}`);
        return { success: true, message: '送签状态删除成功' };
    }
    return { success: false, message: '送签状态删除失败' };
}

// 付款单位简称管理
function getPaymentCompanies() {
    const defaultCompanies = [
        '一泽', '置合', '鼎舒盛', '卉好', '晓逸', '青美源', '国方',
        '景地', '天果', '琪茗享', '荣世悦', '万好', '邦扣', '海尚鲜',
        '全季', '锦泰', '琛宓', '捷亚', '聚百味', '统乐', '凯普盛惠',
        '喜福恩', '圣皮尔', '银蕨', '橙宝', '金莱', '其他'
    ];
    return getFromLocalStorage('paymentCompanies', defaultCompanies);
}

function addPaymentCompany(company) {
    const companies = getPaymentCompanies();
    if (companies.includes(company)) {
        return { success: false, message: '付款单位简称已存在' };
    }
    
    companies.push(company);
    if (saveToLocalStorage('paymentCompanies', companies)) {
        logOperation(`添加付款单位简称: ${company}`);
        return { success: true, message: '付款单位简称添加成功' };
    }
    return { success: false, message: '付款单位简称添加失败' };
}

function removePaymentCompany(company) {
    const companies = getPaymentCompanies();
    const index = companies.indexOf(company);
    if (index === -1) {
        return { success: false, message: '付款单位简称不存在' };
    }
    
    companies.splice(index, 1);
    if (saveToLocalStorage('paymentCompanies', companies)) {
        logOperation(`删除付款单位简称: ${company}`);
        return { success: true, message: '付款单位简称删除成功' };
    }
    return { success: false, message: '付款单位简称删除失败' };
}

// 支付类型管理
function getPaymentTypes() {
    const defaultPaymentTypes = [
        { name: '货款', needPercentage: false },
        { name: '费用', needPercentage: false },
        { name: '款项', needPercentage: false },
        { name: '预付款', needPercentage: true },
        { name: '验收款', needPercentage: true },
        { name: '尾款', needPercentage: true },
        { name: '其他', needPercentage: false }
    ];
    return getFromLocalStorage('paymentTypes', defaultPaymentTypes);
}

function addPaymentType(paymentType, needPercentage = false) {
    const paymentTypes = getPaymentTypes();
    if (paymentTypes.some(type => type.name === paymentType)) {
        return { success: false, message: '支付类型已存在' };
    }
    
    paymentTypes.push({ name: paymentType, needPercentage });
    if (saveToLocalStorage('paymentTypes', paymentTypes)) {
        logOperation(`添加支付类型: ${paymentType} (需要百分比: ${needPercentage ? '是' : '否'})`);
        return { success: true, message: '支付类型添加成功' };
    }
    return { success: false, message: '支付类型添加失败' };
}

function removePaymentType(paymentType) {
    const paymentTypes = getPaymentTypes();
    const index = paymentTypes.findIndex(type => type.name === paymentType);
    if (index === -1) {
        return { success: false, message: '支付类型不存在' };
    }
    
    paymentTypes.splice(index, 1);
    if (saveToLocalStorage('paymentTypes', paymentTypes)) {
        logOperation(`删除支付类型: ${paymentType}`);
        return { success: true, message: '支付类型删除成功' };
    }
    return { success: false, message: '支付类型删除失败' };
}

// 用户管理
function initializeUsers() {
    const existingUsers = getFromLocalStorage('users');
    if (existingUsers && existingUsers.length > 0) {
        return; // 已经有用户数据，不需要初始化
    }
    
    // 默认用户列表
    const defaultUsers = [
        { username: 'TYL2025', password: '941314aA', name: '总管理员', role: 'admin', needChangePassword: false },
        { username: '8888', password: '8888', name: '普通管理员', role: 'normalAdmin', needChangePassword: false },
        { username: '1001', password: '1001', name: '普通用户', role: 'normalUser', needChangePassword: false }
    ];
    
    saveToLocalStorage('users', defaultUsers);
}

function getUserByUsername(username) {
    const users = getFromLocalStorage('users', []);
    return users.find(user => user.username === username);
}

function addUser(username, password, name, role, needChangePassword) {
    const users = getFromLocalStorage('users', []);
    
    // 检查用户名是否已存在
    if (users.some(user => user.username === username)) {
        return { success: false, message: '用户名已存在' };
    }
    
    // 检查密码复杂度（简单验证）
    if (password.length < 6) {
        return { success: false, message: '密码长度至少为6位' };
    }
    
    // 添加新用户
    users.push({
        username,
        password,
        name,
        role,
        needChangePassword
    });
    
    if (saveToLocalStorage('users', users)) {
        logOperation(`添加用户: ${username} (${name})`);
        return { success: true, message: '用户添加成功' };
    }
    return { success: false, message: '用户添加失败' };
}

function updateUser(username, name, role, needChangePassword) {
    const users = getFromLocalStorage('users', []);
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex === -1) {
        return { success: false, message: '用户不存在' };
    }
    
    // 更新用户信息
    users[userIndex].name = name;
    users[userIndex].role = role;
    users[userIndex].needChangePassword = needChangePassword;
    
    if (saveToLocalStorage('users', users)) {
        logOperation(`更新用户: ${username} (${name})`);
        return { success: true, message: '用户更新成功' };
    }
    return { success: false, message: '用户更新失败' };
}

function changeUserPassword(username, oldPassword, newPassword) {
    const users = getFromLocalStorage('users', []);
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex === -1) {
        return { success: false, message: '用户不存在' };
    }
    
    // 验证旧密码
    if (users[userIndex].password !== oldPassword) {
        return { success: false, message: '旧密码不正确' };
    }
    
    // 检查新密码复杂度
    if (newPassword.length < 6) {
        return { success: false, message: '新密码长度至少为6位' };
    }
    
    // 更新密码
    users[userIndex].password = newPassword;
    users[userIndex].needChangePassword = false; // 修改密码后重置标志
    
    if (saveToLocalStorage('users', users)) {
        logOperation(`修改密码: ${username}`);
        return { success: true, message: '密码修改成功' };
    }
    return { success: false, message: '密码修改失败' };
}

function deleteUser(username) {
    const users = getFromLocalStorage('users', []);
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex === -1) {
        return { success: false, message: '用户不存在' };
    }
    
    // 不允许删除自己
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.username === username) {
        return { success: false, message: '不允许删除当前登录的用户' };
    }
    
    // 删除用户
    const deletedUser = users.splice(userIndex, 1)[0];
    
    if (saveToLocalStorage('users', users)) {
        logOperation(`删除用户: ${username} (${deletedUser.name})`);
        return { success: true, message: '用户删除成功' };
    }
    return { success: false, message: '用户删除失败' };
}

// 文件管理
function getAllFiles() {
    return getFromLocalStorage('files', []);
}

function saveFile(fileData) {
    const files = getAllFiles();
    
    // 生成唯一ID
    const id = 'file_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    
    // 构造完整的文件对象
    const file = {
        id,
        ...fileData,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        submitter: getCurrentUser().username,
        details: fileData.details || []
    };
    
    files.push(file);
    
    if (saveToLocalStorage('files', files)) {
        logOperation(`提交文件: ${file.fileType} (${file.applicant})`);
        return { success: true, message: '文件提交成功', fileId: id };
    }
    return { success: false, message: '文件提交失败' };
}

function updateFile(fileId, fileData) {
    const files = getAllFiles();
    const fileIndex = files.findIndex(file => file.id === fileId);
    
    if (fileIndex === -1) {
        return { success: false, message: '文件不存在' };
    }
    
    // 更新文件信息
    files[fileIndex] = {
        ...files[fileIndex],
        ...fileData,
        updateTime: new Date().toISOString()
    };
    
    if (saveToLocalStorage('files', files)) {
        logOperation(`更新文件: ${files[fileIndex].fileType} (ID: ${fileId})`);
        return { success: true, message: '文件更新成功' };
    }
    return { success: false, message: '文件更新失败' };
}

function deleteFile(fileId) {
    const files = getAllFiles();
    const fileIndex = files.findIndex(file => file.id === fileId);
    
    if (fileIndex === -1) {
        return { success: false, message: '文件不存在' };
    }
    
    // 删除文件
    const deletedFile = files.splice(fileIndex, 1)[0];
    
    if (saveToLocalStorage('files', files)) {
        logOperation(`删除文件: ${deletedFile.fileType} (ID: ${fileId})`);
        return { success: true, message: '文件删除成功' };
    }
    return { success: false, message: '文件删除失败' };
}

// 文件筛选
function filterFiles(filters) {
    let files = getAllFiles();
    
    if (!filters) return files;
    
    // 按关键词筛选
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
    
    // 按文件类型筛选
    if (filters.fileType) {
        files = files.filter(file => file.fileType === filters.fileType);
    }
    
    // 按部门筛选
    if (filters.department) {
        files = files.filter(file => file.department === filters.department);
    }
    
    // 按送签状态筛选
    if (filters.sendStatus) {
        files = files.filter(file => file.sendStatus === filters.sendStatus);
    }
    
    // 按日期范围筛选
    if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        files = files.filter(file => new Date(file.date) >= startDate);
    }
    
    if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        // 包含结束日期当天
        endDate.setHours(23, 59, 59, 999);
        files = files.filter(file => new Date(file.date) <= endDate);
    }
    
    // 按提交时间降序排列
    return files.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
}

// 验证文件数据
function validateFileData(fileData) {
    const errors = [];
    
    if (!fileData.date) {
        errors.push('请选择日期');
    }
    
    if (!fileData.fileType) {
        errors.push('请选择文件类型');
    }
    
    if (!fileData.department) {
        errors.push('请选择申请部门');
    }
    
    if (!fileData.applicant) {
        errors.push('请输入申请人');
    }
    
    if (!fileData.content) {
        errors.push('请输入文件内容');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

// 操作日志
function logOperation(action) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const logs = getFromLocalStorage('operationLogs', []);
    
    logs.push({
        userName: currentUser.name,
        userRole: getRoleDisplayName(currentUser.role),
        timestamp: new Date().toISOString(),
        action
    });
    
    // 限制日志数量，只保留最近1000条
    if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
    }
    
    saveToLocalStorage('operationLogs', logs);
}

function getOperationLogs() {
    return getFromLocalStorage('operationLogs', []);
}

// Excel导出功能
function exportFilesToExcel(filters) {
    try {
        const files = filterFiles(filters);
        
        // 创建一个临时的表格元素
        const table = document.createElement('table');
        
        // 创建表头
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        // 表头列
        const headers = ['序号', '日期', '文件类型', '文件编号', '申请部门', '申请人', '文件内容', '计量单位', '数量', '金额', '送签状态', '退回原因', '提交时间'];
        
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // 创建表格主体
        const tbody = document.createElement('tbody');
        
        files.forEach((file, index) => {
            const row = document.createElement('tr');
            
            // 序号
            const indexCell = document.createElement('td');
            indexCell.textContent = index + 1;
            row.appendChild(indexCell);
            
            // 日期
            const dateCell = document.createElement('td');
            dateCell.textContent = file.date || '';
            row.appendChild(dateCell);
            
            // 文件类型
            const fileTypeCell = document.createElement('td');
            fileTypeCell.textContent = file.fileType || '';
            row.appendChild(fileTypeCell);
            
            // 文件编号
            const fileNumberCell = document.createElement('td');
            fileNumberCell.textContent = file.fileNumber || '';
            row.appendChild(fileNumberCell);
            
            // 申请部门
            const departmentCell = document.createElement('td');
            departmentCell.textContent = file.department || '';
            row.appendChild(departmentCell);
            
            // 申请人
            const applicantCell = document.createElement('td');
            applicantCell.textContent = file.applicant || '';
            row.appendChild(applicantCell);
            
            // 文件内容
            const contentCell = document.createElement('td');
            contentCell.textContent = file.content || '';
            row.appendChild(contentCell);
            
            // 处理文件明细（如果有）
            if (file.details && file.details.length > 0) {
                // 对于第一个明细项，正常显示
                const firstDetail = file.details[0];
                
                // 计量单位
                const unitCell = document.createElement('td');
                unitCell.textContent = firstDetail.unit || '';
                row.appendChild(unitCell);
                
                // 数量
                const quantityCell = document.createElement('td');
                quantityCell.textContent = firstDetail.quantity || 0;
                row.appendChild(quantityCell);
                
                // 金额
                const amountCell = document.createElement('td');
                amountCell.textContent = firstDetail.amount || 0;
                row.appendChild(amountCell);
                
                // 如果有多个明细项，创建额外的行
                for (let i = 1; i < file.details.length; i++) {
                    const detailRow = document.createElement('tr');
                    const detail = file.details[i];
                    
                    // 空白单元格（序号列）
                    detailRow.appendChild(document.createElement('td'));
                    
                    // 空白单元格（日期列）
                    detailRow.appendChild(document.createElement('td'));
                    
                    // 空白单元格（文件类型列）
                    detailRow.appendChild(document.createElement('td'));
                    
                    // 空白单元格（文件编号列）
                    detailRow.appendChild(document.createElement('td'));
                    
                    // 空白单元格（申请部门列）
                    detailRow.appendChild(document.createElement('td'));
                    
                    // 空白单元格（申请人列）
                    detailRow.appendChild(document.createElement('td'));
                    
                    // 空白单元格（文件内容列）
                    detailRow.appendChild(document.createElement('td'));
                    
                    // 计量单位
                    const unitCell = document.createElement('td');
                    unitCell.textContent = detail.unit || '';
                    detailRow.appendChild(unitCell);
                    
                    // 数量
                    const quantityCell = document.createElement('td');
                    quantityCell.textContent = detail.quantity || 0;
                    detailRow.appendChild(quantityCell);
                    
                    // 金额
                    const amountCell = document.createElement('td');
                    amountCell.textContent = detail.amount || 0;
                    detailRow.appendChild(amountCell);
                    
                    // 空白单元格（送签状态列）
                    detailRow.appendChild(document.createElement('td'));
                    
                    // 空白单元格（退回原因列）
                    detailRow.appendChild(document.createElement('td'));
                    
                    // 空白单元格（提交时间列）
                    detailRow.appendChild(document.createElement('td'));
                    
                    tbody.appendChild(detailRow);
                }
            } else {
                // 如果没有明细，显示空白单元格
                row.appendChild(document.createElement('td'));
                row.appendChild(document.createElement('td'));
                row.appendChild(document.createElement('td'));
            }
            
            // 送签状态
            const statusCell = document.createElement('td');
            statusCell.textContent = file.sendStatus || '';
            row.appendChild(statusCell);
            
            // 退回原因
            const rejectReasonCell = document.createElement('td');
            rejectReasonCell.textContent = file.rejectReason || '';
            row.appendChild(rejectReasonCell);
            
            // 提交时间
            const createTimeCell = document.createElement('td');
            createTimeCell.textContent = file.createTime ? formatDate(file.createTime, 'YYYY-MM-DD HH:mm:ss') : '';
            row.appendChild(createTimeCell);
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        
        // 创建一个临时的HTML文件
        const html = `
            <html>
            <head><meta charset="UTF-8"><title>文件信息导出</title></head>
            <body>
                ${table.outerHTML}
            </body>
            </html>
        `;
        
        // 创建Blob对象
        const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        
        // 创建下载链接
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `文件信息_${formatDate(new Date(), 'YYYY-MM-DD')}.xls`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 释放URL对象
        URL.revokeObjectURL(url);
        
        logOperation('导出文件信息Excel');
        showToast('文件导出成功');
        
        return { success: true };
    } catch (error) {
        console.error('导出Excel失败:', error);
        return { success: false, message: '文件导出失败' };
    }
}

// 日期格式化函数
function formatDate(date, format) {
    if (!date) return '';
    
    // 如果date是字符串，转换为Date对象
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    // 格式化函数
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // 替换格式字符串
    let formattedDate = format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
    
    return formattedDate;
}

// 显示提示信息
function showToast(message, type = 'success') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
    
    // 设置样式根据类型
    if (type === 'success') {
        toast.classList.add('bg-green-500', 'text-white');
    } else if (type === 'error') {
        toast.classList.add('bg-red-500', 'text-white');
    } else {
        toast.classList.add('bg-blue-500', 'text-white');
    }
    
    // 设置消息内容
    toast.textContent = message;
    
    // 添加到文档
    document.body.appendChild(toast);
    
    // 显示toast
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);
    
    // 3秒后隐藏toast
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 应用初始化函数
function initApp() {
    // 初始化用户数据
    initializeUsers();
    
    // 检查当前用户
    const currentUser = getCurrentUser();
    
    // 如果没有登录用户，跳转到登录页面
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // 加载页面内容
    loadPageContent();
}

// 加载页面内容
function loadPageContent() {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'file-registration';
    
    // 显示对应的页面
    showPage(page);
    
    // 更新导航菜单
    updateNavigation(page);
}

// 显示指定页面
function showPage(page) {
    // 隐藏所有页面
    document.querySelectorAll('.page-content').forEach(el => {
        el.classList.add('hidden');
    });
    
    // 显示指定页面
    const pageElement = document.getElementById(`${page}-page`);
    if (pageElement) {
        pageElement.classList.remove('hidden');
        
        // 加载页面数据
        switch (page) {
            case 'file-registration':
                loadFileRegistrationPage();
                break;
            case 'file-information':
                loadFileInformationPage();
                break;
            case 'file-processing':
                loadFileProcessingPage();
                break;
            case 'system-settings':
                loadSystemSettingsPage();
                break;
        }
    }
}

// 更新导航菜单
function updateNavigation(activePage) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // 清空导航菜单
    const navigation = document.getElementById('main-navigation');
    if (!navigation) return;
    
    navigation.innerHTML = '';
    
    // 根据权限添加导航项
    if (checkPermission('canAccessFileRegistration')) {
        navigation.appendChild(createNavItem('文件登记', 'file-registration', activePage));
    }
    
    if (checkPermission('canAccessFileInformation')) {
        navigation.appendChild(createNavItem('文件信息', 'file-information', activePage));
    }
    
    if (checkPermission('canAccessFileProcessing')) {
        navigation.appendChild(createNavItem('文件处理', 'file-processing', activePage));
    }
    
    if (checkPermission('canAccessSettings')) {
        navigation.appendChild(createNavItem('系统设置', 'system-settings', activePage));
    }
    
    // 添加用户信息和退出按钮
    const userSection = document.createElement('div');
    userSection.className = 'ml-auto flex items-center space-x-4';
    
    // 用户信息
    const userInfo = document.createElement('div');
    userInfo.className = 'text-sm text-gray-600';
    userInfo.innerHTML = `欢迎，${currentUser.name} (${getRoleDisplayName(currentUser.role)})`;
    userSection.appendChild(userInfo);
    
    // 修改密码按钮
    const changePasswordButton = document.createElement('button');
    changePasswordButton.className = 'bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-lg text-sm transition duration-200';
    changePasswordButton.textContent = '修改密码';
    changePasswordButton.addEventListener('click', () => {
        showChangePasswordModal();
    });
    userSection.appendChild(changePasswordButton);
    
    // 退出按钮
    const logoutButton = document.createElement('button');
    logoutButton.className = 'bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg text-sm transition duration-200';
    logoutButton.textContent = '退出登录';
    logoutButton.addEventListener('click', () => {
        logout();
    });
    userSection.appendChild(logoutButton);
    
    navigation.appendChild(userSection);
}

// 创建导航项
function createNavItem(text, pageId, activePage) {
    const navItem = document.createElement('a');
    navItem.href = `index.html?page=${pageId}`;
    navItem.className = `px-4 py-2 font-medium rounded-lg transition duration-200 ${activePage === pageId ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`;
    navItem.textContent = text;
    
    // 阻止默认跳转行为，使用JavaScript处理
    navItem.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(pageId);
        updateNavigation(pageId);
        // 更新URL但不刷新页面
        history.pushState(null, '', `index.html?page=${pageId}`);
    });
    
    return navItem;
}

// 退出登录
function logout() {
    setCurrentUser(null);
    window.location.href = 'login.html';
}

// 显示修改密码弹窗
function showChangePasswordModal() {
    // 创建弹窗HTML
    const modalHTML = `
        <div id="change-password-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div class="p-4 border-b">
                    <h3 class="text-lg font-medium">修改密码</h3>
                </div>
                <div class="p-4">
                    <form id="change-password-form">
                        <div class="mb-4">
                            <label for="old-password" class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
                            <input type="password" id="old-password" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                        </div>
                        <div class="mb-4">
                            <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                            <input type="password" id="new-password" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                            <p class="text-xs text-gray-500 mt-1">密码长度至少为6位</p>
                        </div>
                        <div class="mb-4">
                            <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                            <input type="password" id="confirm-password" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                        </div>
                        <div class="text-red-500 text-sm mb-4 hidden" id="password-error"></div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" id="cancel-change-password" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition duration-200">
                                取消
                            </button>
                            <button type="submit" id="submit-change-password" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition duration-200">
                                确认修改
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // 创建临时容器
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = modalHTML;
    
    // 添加到文档
    document.body.appendChild(tempContainer.firstElementChild);
    
    // 获取弹窗元素
    const modal = document.getElementById('change-password-modal');
    const form = document.getElementById('change-password-form');
    const cancelButton = document.getElementById('cancel-change-password');
    
    // 绑定取消按钮事件
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // 绑定表单提交事件
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleChangePassword();
    });
    
    // 点击弹窗外区域关闭弹窗
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// 处理修改密码
function handleChangePassword() {
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorElement = document.getElementById('password-error');
    
    // 验证新密码和确认密码是否一致
    if (newPassword !== confirmPassword) {
        errorElement.textContent = '两次输入的新密码不一致';
        errorElement.classList.remove('hidden');
        return;
    }
    
    // 验证密码复杂度
    if (newPassword.length < 6) {
        errorElement.textContent = '新密码长度至少为6位';
        errorElement.classList.remove('hidden');
        return;
    }
    
    // 获取当前用户
    const currentUser = getCurrentUser();
    if (!currentUser) {
        errorElement.textContent = '请先登录';
        errorElement.classList.remove('hidden');
        return;
    }
    
    // 调用修改密码函数
    const result = changeUserPassword(currentUser.username, oldPassword, newPassword);
    
    if (result.success) {
        // 关闭弹窗
        document.body.removeChild(document.getElementById('change-password-modal'));
        showToast(result.message);
    } else {
        errorElement.textContent = result.message;
        errorElement.classList.remove('hidden');
    }
}

// 暴露必要的函数给全局使用
window.CoreFunctions = {
    getFromLocalStorage,
    saveToLocalStorage,
    getCurrentUser,
    setCurrentUser,
    checkPermission,
    getRoleDisplayName,
    getFileTypes,
    addFileType,
    removeFileType,
    getDepartments,
    addDepartment,
    removeDepartment,
    getUnits,
    addUnit,
    removeUnit,
    getSendStatuses,
    addSendStatus,
    removeSendStatus,
    getPaymentCompanies,
    addPaymentCompany,
    removePaymentCompany,
    getPaymentTypes,
    addPaymentType,
    removePaymentType,
    initializeUsers,
    getUserByUsername,
    addUser,
    updateUser,
    changeUserPassword,
    deleteUser,
    getAllFiles,
    saveFile,
    updateFile,
    deleteFile,
    filterFiles,
    validateFileData,
    logOperation,
    getOperationLogs,
    exportFilesToExcel,
    formatDate,
    showToast,
    initApp,
    loadPageContent,
    showPage,
    updateNavigation,
    logout,
    showChangePasswordModal,
    handleChangePassword
};