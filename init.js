// 初始化数据脚本

// 存储键名
const STORAGE_KEYS = {
    USERS: 'file_registration_users',
    FILES: 'file_registration_files',
    SYSTEM_SETTINGS: 'file_registration_settings',
    OPERATIONAL_LOGS: 'file_registration_logs',
    CURRENT_USER: 'file_registration_current_user'
};

// 初始化系统数据
function initSystemData() {
    // 检查是否已经初始化过
    if (localStorage.getItem(STORAGE_KEYS.USERS)) {
        console.log('系统数据已初始化，跳过初始化过程');
        return;
    }
    
    console.log('开始初始化系统数据...');
    
    // 初始化用户账号
    initUsers();
    
    // 初始化系统设置
    initSystemSettings();
    
    // 初始化示例文件数据
    initSampleFiles();
    
    // 初始化操作日志
    initLogs();
    
    console.log('系统数据初始化完成！');
}

// 初始化用户账号
function initUsers() {
    const users = [
        {
            id: 1,
            username: 'TYL2025',
            password: '941314aA',
            role: 'admin',
            firstLogin: false
        },
        {
            id: 2,
            username: '8888',
            password: '8888',
            role: 'manager',
            firstLogin: true
        },
        {
            id: 3,
            username: '1001',
            password: '1001',
            role: 'user',
            firstLogin: true
        }
    ];
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    console.log('用户账号初始化完成');
}

// 初始化系统设置
function initSystemSettings() {
    const settings = {
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
        statuses: [
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
        paymentUnits: [
            '一泽',
            '鼎舒盛',
            '卉好',
            '晓逸',
            '其他'
        ],
        paymentTypes: [
            '货款',
            '费用',
            '全款',
            '预付款',
            '验收款',
            '尾款',
            '其他'
        ]
    };
    
    localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(settings));
    console.log('系统设置初始化完成');
}

// 初始化示例文件数据
function initSampleFiles() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const files = [
        {
            id: 1,
            date: formatDate(yesterday),
            fileType: '采购计划审批表',
            department: '前厅FO',
            applicant: '张三',
            fileNumber: 'TBTC-2024001',
            status: '完毕',
            statusUpdateTime: new Date().toISOString(),
            rejectReason: '',
            endDate: formatDate(today),
            contents: [
                {
                    content: '前厅办公用品采购',
                    unit: '批',
                    quantity: 1,
                    amount: 2500
                }
            ]
        },
        {
            id: 2,
            date: formatDate(twoDaysAgo),
            fileType: '合同（协议）签订审批表',
            department: '财务FIN',
            applicant: '李四',
            fileNumber: 'TBTC-FIN-2024001',
            status: '集团审核',
            statusUpdateTime: new Date().toISOString(),
            rejectReason: '',
            endDate: null,
            contents: [
                {
                    content: '年度财务审计服务合同',
                    unit: '份',
                    quantity: 1,
                    amount: 50000
                }
            ]
        },
        {
            id: 3,
            date: formatDate(yesterday),
            fileType: '付款申请单',
            department: '餐饮办公室',
            applicant: '王五',
            fileNumber: '2024001',
            status: '退回',
            statusUpdateTime: new Date().toISOString(),
            rejectReason: '请补充供应商发票',
            endDate: null,
            contents: [
                {
                    content: '支付-食材采购-货款--(2024年05月--一泽)',
                    unit: '批',
                    quantity: 1,
                    amount: 15000
                }
            ]
        },
        {
            id: 4,
            date: formatDate(today),
            fileType: '工作联系单',
            department: '工程ENG',
            applicant: '赵六',
            fileNumber: '',
            status: '酒店内部走签',
            statusUpdateTime: new Date().toISOString(),
            rejectReason: '',
            endDate: null,
            contents: [
                {
                    content: '客房空调维修申请',
                    unit: '次',
                    quantity: 3,
                    amount: 1200
                }
            ]
        },
        {
            id: 5,
            date: formatDate(yesterday),
            fileType: '固定资产验收单',
            department: '行政EO',
            applicant: '钱七',
            fileNumber: '',
            status: '完毕',
            statusUpdateTime: new Date().toISOString(),
            rejectReason: '',
            endDate: formatDate(today),
            contents: [
                {
                    content: '新购办公电脑',
                    unit: '台',
                    quantity: 2,
                    amount: 8000
                },
                {
                    content: '办公打印机',
                    unit: '台',
                    quantity: 1,
                    amount: 3500
                }
            ]
        }
    ];
    
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    console.log('示例文件数据初始化完成');
}

// 初始化操作日志
function initLogs() {
    const logs = [
        {
            time: new Date().toISOString(),
            action: '系统初始化完成',
            user: '系统'
        },
        {
            time: new Date().toISOString(),
            action: '创建了初始用户账号',
            user: '系统'
        },
        {
            time: new Date().toISOString(),
            action: '设置了系统初始参数',
            user: '系统'
        }
    ];
    
    localStorage.setItem(STORAGE_KEYS.OPERATIONAL_LOGS, JSON.stringify(logs));
    console.log('操作日志初始化完成');
}

// 重置系统数据
function resetSystemData() {
    if (confirm('警告：这将重置所有系统数据，包括用户账号、文件信息等，确定要继续吗？')) {
        // 清空所有本地存储数据
        localStorage.removeItem(STORAGE_KEYS.USERS);
        localStorage.removeItem(STORAGE_KEYS.FILES);
        localStorage.removeItem(STORAGE_KEYS.SYSTEM_SETTINGS);
        localStorage.removeItem(STORAGE_KEYS.OPERATIONAL_LOGS);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        
        console.log('系统数据已清空');
        
        // 重新初始化数据
        initSystemData();
        
        // 刷新页面
        window.location.reload();
    }
}

// 导出系统数据
function exportSystemData() {
    const data = {
        users: JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
        files: JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES) || '[]'),
        settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS) || '{}'),
        logs: JSON.parse(localStorage.getItem(STORAGE_KEYS.OPERATIONAL_LOGS) || '[]'),
        exportTime: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `file_registration_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log('系统数据导出完成');
}

// 导入系统数据
function importSystemData(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // 验证数据格式
            if (!data.users || !data.files || !data.settings || !data.logs) {
                alert('数据格式不正确，导入失败');
                return;
            }
            
            if (confirm('警告：这将覆盖所有现有系统数据，确定要继续吗？')) {
                // 保存数据到本地存储
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
                localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(data.files));
                localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(data.settings));
                localStorage.setItem(STORAGE_KEYS.OPERATIONAL_LOGS, JSON.stringify(data.logs));
                localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
                
                console.log('系统数据导入完成');
                
                // 刷新页面
                window.location.reload();
            }
        } catch (error) {
            alert('数据解析失败，导入失败');
            console.error('数据导入错误:', error);
        }
    };
    
    reader.readAsText(file);
}

// 暴露函数给全局
try {
    window.initSystemData = initSystemData;
    window.resetSystemData = resetSystemData;
    window.exportSystemData = exportSystemData;
    window.importSystemData = importSystemData;
} catch (e) {
    console.warn('无法暴露函数到全局作用域');
}

// 如果在浏览器环境中运行，自动初始化数据
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', initSystemData);
}