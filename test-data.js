// 测试数据生成脚本

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已经初始化过测试数据
    const hasTestData = localStorage.getItem('hasTestData') === 'true';
    
    // 只有在没有初始化过测试数据的情况下才执行初始化
    if (!hasTestData && typeof window.CoreFunctions !== 'undefined') {
        // 初始化测试数据
        initializeTestData();
        
        // 标记已初始化
        localStorage.setItem('hasTestData', 'true');
    }
});

// 初始化测试数据
function initializeTestData() {
    try {
        // 确保CoreFunctions已加载
        if (typeof window.CoreFunctions === 'undefined') {
            console.error('CoreFunctions未加载，无法初始化测试数据');
            return;
        }
        
        const core = window.CoreFunctions;
        
        // 初始化用户数据（这在core-functions.js中已经处理）
        core.initializeUsers();
        
        // 生成一些测试文件数据
        generateTestFiles();
        
        console.log('测试数据初始化成功');
    } catch (error) {
        console.error('初始化测试数据失败:', error);
    }
}

// 生成测试文件数据
function generateTestFiles() {
    const core = window.CoreFunctions;
    
    // 模拟当前用户
    const mockUser = { username: '8888', role: 'normalAdmin', name: '普通管理员' };
    core.setCurrentUser(mockUser);
    
    // 测试文件数据
    const testFiles = [
        {
            date: new Date().toISOString().split('T')[0],
            fileType: '采购计划审批表',
            department: '前厅FO',
            applicant: '张三',
            content: '采购前厅办公用品一批',
            fileNumber: 'TBTC-001',
            sendStatus: '完毕',
            details: [
                { unit: '批', quantity: 1, amount: 2500 }
            ]
        },
        {
            date: new Date().toISOString().split('T')[0],
            fileType: '合同（协议）签订审批表',
            department: '销售S&M',
            applicant: '李四',
            content: '与XX公司签订销售合同',
            fileNumber: 'TBTC-S&M-001',
            sendStatus: '集团审核',
            details: [
                { unit: '份', quantity: 1, amount: 50000 }
            ]
        },
        {
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            fileType: '付款申请单',
            department: '财务FIN',
            applicant: '王五',
            content: '支付办公用品采购款',
            fileNumber: '2023001',
            sendStatus: '已签未付',
            details: [
                { unit: '台', quantity: 2, amount: 8000 },
                { unit: '件', quantity: 10, amount: 2000 }
            ]
        },
        {
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
            fileType: '用印审批表',
            department: '行政EO',
            applicant: '赵六',
            content: '劳动合同盖章',
            sendStatus: '完毕',
            details: [
                { unit: '份', quantity: 5, amount: 0 }
            ]
        },
        {
            date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
            fileType: '工作联系单',
            department: '工程ENG',
            applicant: '孙七',
            content: '维修客房空调设备',
            sendStatus: '酒店内部走签',
            details: [
                { unit: '次', quantity: 3, amount: 1500 }
            ]
        },
        {
            date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
            fileType: '固定资产验收单',
            department: '客房HSKP',
            applicant: '周八',
            content: '新购客房家具验收',
            sendStatus: '完毕',
            details: [
                { unit: '套', quantity: 10, amount: 50000 }
            ]
        },
        {
            date: new Date(Date.now() - 432000000).toISOString().split('T')[0],
            fileType: '付款单+用印审批（仅限验收报告）',
            department: '餐饮办公室',
            applicant: '吴九',
            content: '支付餐饮设备采购款',
            fileNumber: '2023002',
            sendStatus: '总秘（酒店总经理）',
            details: [
                { unit: '台', quantity: 1, amount: 15000 }
            ]
        },
        {
            date: new Date(Date.now() - 518400000).toISOString().split('T')[0],
            fileType: '会议议题',
            department: '人事HR',
            applicant: '郑十',
            content: '讨论员工培训计划',
            sendStatus: '业主代表',
            details: [
                { unit: '项', quantity: 1, amount: 0 }
            ]
        }
    ];
    
    // 保存测试文件数据
    testFiles.forEach(fileData => {
        core.saveFile(fileData);
    });
    
    // 恢复当前用户
    core.setCurrentUser(null);
};

// 暴露函数给全局使用
window.TestDataGenerator = {
    initializeTestData,
    generateTestFiles
};