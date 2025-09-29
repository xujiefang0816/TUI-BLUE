/**
 * 系统设置模块
 */
import { saveToLocalStorage, getFromLocalStorage, generateId } from './utils.js';

// 存储键名常量
const SETTINGS_KEY = 'file_registration_system_settings';
const LOGS_KEY = 'file_registration_system_logs';

// 默认设置数据
const defaultSettings = {
    fileTypes: [
        '采购计划审批表',
        '合同（协议）签订审批表', 
        '付款申请单',
        '用印审批表',
        '付款单+用印审批（仅限验收报告）',
        '工作联系单',
        '固定资产验收单',
        '会议议题',
        '借印审批表',
        '请假申请表',
        '差旅申请表',
        '其他'
    ],
    departments: [
        '前厅FO',
        '客房HSKP',
        '西餐厅',
        '中餐厅',
        '大堂吧',
        '宴会厅',
        '迷你吧',
        '餐饮办公室',
        '管事部',
        '饼房',
        '财务FIN',
        '行政EO',
        '人事HR',
        '员工餐厅',
        '销售S&M',
        '工程ENG'
    ],
    units: [
        '/',
        '批',
        '个（支）',
        '件',
        '套',
        '份',
        '只',
        '台',
        '桶',
        '次',
        '块',
        '人',
        '盒',
        '瓶',
        '双',
        '张',
        '月',
        '年',
        '克（g）',
        '千克（kg）',
        '箱',
        '米',
        '平方米',
        '包',
        '袋',
        '家',
        'PCS',
        'PAC',
        '佣金（%）',
        '其他'
    ],
    sendStatuses: [
        '完毕',
        '总秘（酒店总经理）',
        '待送集团',
        '业主代表',
        '陆总及彭总（盖章处）',
        '集团审核',
        '集团经理待签',
        '退回',
        '未盖章',
        '重签',
        '作废',
        '资产管理部',
        '招采办',
        '酒店内部走签',
        '急单',
        '已签未付'
    ],
    paymentCompanies: [
        '一泽',
        '置合',
        '鼎舒盛',
        '卉好',
        '晓逸',
        '青美源',
        '国方',
        '景地',
        '天果',
        '琪茗享',
        '荣世悦',
        '万好',
        '邦扣',
        '海尚鲜',
        '全季',
        '锦泰',
        '琛宓',
        '捷亚',
        '聚百味',
        '统乐',
        '凯普盛惠',
        '喜福恩',
        '圣皮尔',
        '银蕨',
        '橙宝',
        '金莱',
        '其他'
    ],
    paymentTypes: [
        { name: '货款' },
        { name: '费用' },
        { name: '款项' },
        { name: '预付款', needPercentage: true },
        { name: '验收款', needPercentage: true },
        { name: '尾款', needPercentage: true },
        { name: '其他' }
    ],
    paymentProjects: [
        '外包-保安员',
        '外包-保洁员（PA）',
        '外包-客房服务员（楼层）',
        '外包-管事部清洁',
        '外包-餐饮小时工',
        '外包-实习生',
        '绿植租摆',
        '鲜花购买',
        '客房布草及制服洗涤',
        '餐饮布草洗涤',
        '控虫消杀',
        '垃圾清运',
        '员工宿舍租赁',
        '建筑消防设施维护',
        '油烟管道清洗',
        '水箱处理及水质检测',
        '空调水处理',
        '打印机租赁（销售、财务部1台）',
        '打印机租赁（人事、采购部2台）',
        '蔬菜水果',
        '肉禽',
        '冻品',
        '海产品',
        '调味品',
        '酒水',
        '冰淇淋',
        '咖啡豆',
        '果汁',
        '员工饮用水',
        '定制矿泉水',
        '客人一次性用品',
        '部门杂项',
        '办公用品',
        '固定资产',
        '其他'
    ]
};

// 初始化设置
export function initSettings() {
    const settings = getFromLocalStorage(SETTINGS_KEY);
    if (!settings) {
        saveToLocalStorage(SETTINGS_KEY, defaultSettings);
        return defaultSettings;
    }
    return settings;
}

// 获取所有设置
export function getAllSettings() {
    return getFromLocalStorage(SETTINGS_KEY) || defaultSettings;
}

// 获取文件类型
export function getFileTypes() {
    const settings = getFromLocalStorage(SETTINGS_KEY);
    return settings?.fileTypes || defaultSettings.fileTypes;
}

// 添加文件类型
export function addFileType(type) {
    const settings = getAllSettings();
    if (!settings.fileTypes.includes(type)) {
        settings.fileTypes.push(type);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 删除文件类型
export function removeFileType(type) {
    const settings = getAllSettings();
    const index = settings.fileTypes.indexOf(type);
    if (index !== -1) {
        settings.fileTypes.splice(index, 1);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 获取部门列表
export function getDepartments() {
    const settings = getFromLocalStorage(SETTINGS_KEY);
    return settings?.departments || defaultSettings.departments;
}

// 添加部门
export function addDepartment(dept) {
    const settings = getAllSettings();
    if (!settings.departments.includes(dept)) {
        settings.departments.push(dept);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 删除部门
export function removeDepartment(dept) {
    const settings = getAllSettings();
    const index = settings.departments.indexOf(dept);
    if (index !== -1) {
        settings.departments.splice(index, 1);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 获取计量单位
export function getUnits() {
    const settings = getFromLocalStorage(SETTINGS_KEY);
    return settings?.units || defaultSettings.units;
}

// 添加计量单位
export function addUnit(unit) {
    const settings = getAllSettings();
    if (!settings.units.includes(unit)) {
        settings.units.push(unit);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 删除计量单位
export function removeUnit(unit) {
    const settings = getAllSettings();
    const index = settings.units.indexOf(unit);
    if (index !== -1) {
        settings.units.splice(index, 1);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 获取送签状态
export function getSendStatuses() {
    const settings = getFromLocalStorage(SETTINGS_KEY);
    return settings?.sendStatuses || defaultSettings.sendStatuses;
}

// 添加送签状态
export function addSendStatus(status) {
    const settings = getAllSettings();
    if (!settings.sendStatuses.includes(status)) {
        settings.sendStatuses.push(status);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 删除送签状态
export function removeSendStatus(status) {
    const settings = getAllSettings();
    const index = settings.sendStatuses.indexOf(status);
    if (index !== -1) {
        settings.sendStatuses.splice(index, 1);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 获取付款单位
export function getPaymentCompanies() {
    const settings = getFromLocalStorage(SETTINGS_KEY);
    return settings?.paymentCompanies || defaultSettings.paymentCompanies;
}

// 添加付款单位
export function addPaymentCompany(company) {
    const settings = getAllSettings();
    if (!settings.paymentCompanies.includes(company)) {
        settings.paymentCompanies.push(company);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 删除付款单位
export function removePaymentCompany(company) {
    const settings = getAllSettings();
    const index = settings.paymentCompanies.indexOf(company);
    if (index !== -1) {
        settings.paymentCompanies.splice(index, 1);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 获取支付类型
export function getPaymentTypes() {
    const settings = getFromLocalStorage(SETTINGS_KEY);
    return settings?.paymentTypes || defaultSettings.paymentTypes;
}

// 添加支付类型
export function addPaymentType(type, needPercentage = false) {
    const settings = getAllSettings();
    const exists = settings.paymentTypes.some(t => t.name === type);
    if (!exists) {
        settings.paymentTypes.push({ name: type, needPercentage });
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 删除支付类型
export function removePaymentType(type) {
    const settings = getAllSettings();
    const index = settings.paymentTypes.findIndex(t => t.name === type);
    if (index !== -1) {
        settings.paymentTypes.splice(index, 1);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 获取支付项目
export function getPaymentProjects() {
    const settings = getFromLocalStorage(SETTINGS_KEY);
    return settings?.paymentProjects || defaultSettings.paymentProjects;
}

// 添加支付项目
export function addPaymentProject(project) {
    const settings = getAllSettings();
    if (!settings.paymentProjects.includes(project)) {
        settings.paymentProjects.push(project);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 删除支付项目
export function removePaymentProject(project) {
    const settings = getAllSettings();
    const index = settings.paymentProjects.indexOf(project);
    if (index !== -1) {
        settings.paymentProjects.splice(index, 1);
        saveToLocalStorage(SETTINGS_KEY, settings);
        return true;
    }
    return false;
}

// 记录操作日志
export function logOperation(username, action) {
    const logs = getFromLocalStorage(LOGS_KEY) || [];
    const log = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        username,
        action
    };
    logs.push(log);
    
    // 限制日志数量，只保留最近1000条
    if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
    }
    
    saveToLocalStorage(LOGS_KEY, logs);
    return log;
}

// 获取操作日志
export function getOperationLogs() {
    return getFromLocalStorage(LOGS_KEY) || [];
}

// 清空操作日志
export function clearOperationLogs() {
    saveToLocalStorage(LOGS_KEY, []);
    return true;
}

// 导出设置
export function exportSettings() {
    const settings = getAllSettings();
    const logs = getOperationLogs();
    const data = {
        settings,
        logs,
        exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `file_registration_system_settings_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 导入设置
export function importSettings(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.settings) {
                    saveToLocalStorage(SETTINGS_KEY, data.settings);
                }
                if (data.logs) {
                    saveToLocalStorage(LOGS_KEY, data.logs);
                }
                resolve(true);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => {
            reject(new Error('文件读取失败'));
        };
        reader.readAsText(file);
    });
}

// 重置设置到默认值
export function resetSettings() {
    if (confirm('确定要重置所有设置到默认值吗？此操作不可恢复！')) {
        saveToLocalStorage(SETTINGS_KEY, defaultSettings);
        return true;
    }
    return false;
}