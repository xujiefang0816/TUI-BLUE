/**
 * 在线文件信息登记系统 - 核心 JavaScript 文件
 */

// 数据存储键名
const STORAGE_KEYS = {
    USERS: 'file_system_users',
    FILES: 'file_system_files',
    SYSTEM_SETTINGS: 'file_system_settings',
    OPERATIONAL_LOGS: 'file_system_logs',
    CURRENT_USER: 'file_system_current_user'
};

// 应用状态
const appState = {
    currentUser: null,
    settings: {
        fileTypes: [],
        departments: [],
        units: [],
        statuses: [],
        paymentUnits: [],
        paymentTypes: []
    },
    files: [],
    logs: []
};

// DOM 元素
const elements = {
    // 登录页面
    loginPage: document.getElementById('login-page'),
    loginForm: document.getElementById('login-form'),
    loginUsername: document.getElementById('login-username'),
    loginPassword: document.getElementById('login-password'),
    togglePassword: document.getElementById('toggle-password'),
    loginError: document.getElementById('login-error'),
    loginErrorMessage: document.getElementById('login-error-message'),
    forgotPasswordBtn: document.getElementById('forgot-password-btn'),
    
    // 系统头部
    header: document.getElementById('header'),
    systemTitle: document.getElementById('system-title'),
    currentUser: document.getElementById('current-user'),
    usernameDisplay: document.getElementById('username-display'),
    changePasswordBtn: document.getElementById('change-password-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    navMenu: document.getElementById('nav-menu'),
    navFileRegister: document.getElementById('nav-file-register'),
    navFileInfo: document.getElementById('nav-file-info'),
    navFileProcess: document.getElementById('nav-file-process'),
    navSystemSettings: document.getElementById('nav-system-settings'),
    
    // 主内容页面
    mainContent: document.getElementById('main-content'),
    fileRegisterPage: document.getElementById('file-register-page'),
    fileInfoPage: document.getElementById('file-info-page'),
    fileProcessPage: document.getElementById('file-process-page'),
    systemSettingsPage: document.getElementById('system-settings-page'),
    
    // 文件登记页面
    fileRegisterForm: document.getElementById('file-register-form'),
    registerDate: document.getElementById('register-date'),
    registerFileType: document.getElementById('register-file-type'),
    registerDepartment: document.getElementById('register-department'),
    registerApplicant: document.getElementById('register-applicant'),
    fileContentContainer: document.getElementById('file-content-container'),
    addContentRow: document.getElementById('add-content-row'),
    registerResetBtn: document.getElementById('register-reset-btn'),
    
    // 文件信息页面
    fileInfoSearch: document.getElementById('file-info-search'),
    fileInfoRefresh: document.getElementById('file-info-refresh'),
    fileInfoTable: document.getElementById('file-info-table'),
    fileInfoBody: document.getElementById('file-info-body'),
    fileInfoLoading: document.getElementById('file-info-loading'),
    fileInfoEmpty: document.getElementById('file-info-empty'),
    filterToggle: document.getElementById('filter-toggle'),
    filterDropdown: document.getElementById('filter-dropdown'),
    filterDateStart: document.getElementById('filter-date-start'),
    filterDateEnd: document.getElementById('filter-date-end'),
    filterFileType: document.getElementById('filter-file-type'),
    filterDepartment: document.getElementById('filter-department'),
    filterStatus: document.getElementById('filter-status'),
    filterReset: document.getElementById('filter-reset'),
    filterApply: document.getElementById('filter-apply'),
    
    // 文件处理页面
    batchDeleteBtn: document.getElementById('batch-delete-btn'),
    batchStatusSelect: document.getElementById('batch-status-select'),
    exportExcelBtn: document.getElementById('export-excel-btn'),
    fileProcessRefresh: document.getElementById('file-process-refresh'),
    fileProcessTable: document.getElementById('file-process-table'),
    fileProcessBody: document.getElementById('file-process-body'),
    fileProcessLoading: document.getElementById('file-process-loading'),
    fileProcessEmpty: document.getElementById('file-process-empty'),
    selectAll: document.getElementById('select-all'),
    
    // 系统设置页面
    fileTypesContainer: document.getElementById('file-types-container'),
    departmentsContainer: document.getElementById('departments-container'),
    unitsContainer: document.getElementById('units-container'),
    statusesContainer: document.getElementById('statuses-container'),
    paymentUnitsContainer: document.getElementById('payment-units-container'),
    paymentTypesContainer: document.getElementById('payment-types-container'),
    accountsTable: document.getElementById('accounts-table'),
    accountsBody: document.getElementById('accounts-body'),
    addAccountBtn: document.getElementById('add-account-btn'),
    logsTable: document.getElementById('logs-table'),
    logsBody: document.getElementById('logs-body'),
    
    // 修改密码模态框
    changePasswordModal: document.getElementById('change-password-modal'),
    changePasswordForm: document.getElementById('change-password-form'),
    currentPassword: document.getElementById('current-password'),
    newPassword: document.getElementById('new-password'),
    confirmPassword: document.getElementById('confirm-password'),
    closeChangePasswordModal: document.getElementById('close-change-password-modal'),
    cancelChangePassword: document.getElementById('cancel-change-password'),
    changePasswordError: document.getElementById('change-password-error'),
    changePasswordErrorMessage: document.getElementById('change-password-error-message'),
    changePasswordSuccess: document.getElementById('change-password-success'),
    
    // 编辑文件信息模态框
    editFileModal: document.getElementById('edit-file-modal'),
    editFileForm: document.getElementById('edit-file-form'),
    editFileId: document.getElementById('edit-file-id'),
    editDate: document.getElementById('edit-date'),
    editFileType: document.getElementById('edit-file-type'),
    editDepartment: document.getElementById('edit-department'),
    editApplicant: document.getElementById('edit-applicant'),
    editFileNumber: document.getElementById('edit-file-number'),
    editStatus: document.getElementById('edit-status'),
    editFileContentContainer: document.getElementById('edit-file-content-container'),
    editContentBody: document.getElementById('edit-content-body'),
    editRejectReasonContainer: document.getElementById('edit-reject-reason-container'),
    editRejectReason: document.getElementById('edit-reject-reason'),
    closeEditFileModal: document.getElementById('close-edit-file-modal'),
    cancelEditFile: document.getElementById('cancel-edit-file'),
    editFileError: document.getElementById('edit-file-error'),
    editFileErrorMessage: document.getElementById('edit-file-error-message'),
    
    // 新增账号模态框
    addAccountModal: document.getElementById('add-account-modal'),
    addAccountForm: document.getElementById('add-account-form'),
    newUsername: document.getElementById('new-username'),
    newAccountPassword: document.getElementById('new-account-password'),
    newAccountRole: document.getElementById('new-account-role'),
    closeAddAccountModal: document.getElementById('close-add-account-modal'),
    cancelAddAccount: document.getElementById('cancel-add-account'),
    addAccountError: document.getElementById('add-account-error'),
    addAccountErrorMessage: document.getElementById('add-account-error-message'),
    addAccountSuccess: document.getElementById('add-account-success'),
    
    // 确认删除模态框
    confirmDeleteModal: document.getElementById('confirm-delete-modal'),
    cancelDelete: document.getElementById('cancel-delete'),
    confirmDelete: document.getElementById('confirm-delete'),
    
    // 消息提示框
    toast: document.getElementById('toast'),
    toastIcon: document.getElementById('toast-icon'),
    toastMessage: document.getElementById('toast-message')
};

// 初始化函数
function initApp() {
    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    elements.registerDate.value = today;
    
    // 初始化数据
    initializeData();
    
    // 加载用户数据
    loadUserData();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 检查是否有已登录用户
    checkLoggedInUser();
}

// 初始化数据
function initializeData() {
    // 初始化用户数据
    let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    if (users.length === 0) {
        users = [
            { id: 1, username: 'TYL2025', password: '941314aA', role: 'admin', firstLogin: false },
            { id: 2, username: '8888', password: '8888', role: 'manager', firstLogin: true },
            { id: 3, username: '1001', password: '1001', role: 'user', firstLogin: true }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    
    // 初始化系统设置
    let settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS)) || {};
    if (!settings.fileTypes || settings.fileTypes.length === 0) {
        settings.fileTypes = [
            '采购计划审批表', '合同（协议）签订审批表', '付款申请单', 
            '用印审批表', '付款单+用印审批（仅限验收报告）', '工作联系单', 
            '固定资产验收单', '会议议题', '借印审批表', '请假申请表', 
            '差旅申请表', '其他'
        ];
    }
    if (!settings.departments || settings.departments.length === 0) {
        settings.departments = [
            '前厅FO', '客房HSKP', '西餐厅', '中餐厅', '大堂吧', '宴会厅', 
            '迷你吧', '餐饮办公室', '管事部', '饼房', '财务FIN', '行政EO', 
            '人事HR', '员工餐厅', '销售S&M', '工程ENG'
        ];
    }
    if (!settings.units || settings.units.length === 0) {
        settings.units = [
            '/', '批', '个（支）', '件', '套', '份', '只', '台', '桶', '次', 
            '块', '人', '盒', '瓶', '双', '张', '月', '年', '克（g）', '千克（kg）', 
            '箱', '米', '平方米', '包', '袋', '家', 'PCS', 'PAC', '佣金（%）', '其他'
        ];
    }
    if (!settings.statuses || settings.statuses.length === 0) {
        settings.statuses = [
            '完毕', '总秘（酒店总经理）', '待送集团', '业主代表', 
            '陆总及彭总（盖章处）', '集团审核', '集团经理待签', '退回', 
            '未盖章', '重签', '作废', '资产管理部', '招采办', 
            '酒店内部走签', '急单', '已签未付'
        ];
    }
    if (!settings.paymentUnits || settings.paymentUnits.length === 0) {
        settings.paymentUnits = [
            '一泽', '鼎舒盛', '卉好', '晓逸', '其他'
        ];
    }
    if (!settings.paymentTypes || settings.paymentTypes.length === 0) {
        settings.paymentTypes = [
            '货款', '费用', '全款', '预付款', '验收款', '尾款', '其他'
        ];
    }
    localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(settings));
    appState.settings = settings;
    
    // 初始化操作日志
    let logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPERATIONAL_LOGS)) || [];
    appState.logs = logs;
}

// 加载用户数据
function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    if (currentUser) {
        appState.currentUser = currentUser;
    }
    
    // 加载文件数据
    const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES)) || [];
    appState.files = files;
}

// 检查已登录用户
function checkLoggedInUser() {
    if (appState.currentUser) {
        showDashboard();
    } else {
        showLoginPage();
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 登录表单提交
    elements.loginForm.addEventListener('submit', handleLogin);
    
    // 切换密码可见性
    elements.togglePassword.addEventListener('click', togglePasswordVisibility);
    
    // 修改密码按钮
    elements.forgotPasswordBtn.addEventListener('click', openChangePasswordModal);
    elements.changePasswordBtn.addEventListener('click', openChangePasswordModal);
    
    // 退出登录
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // 导航菜单点击
    elements.navFileRegister.addEventListener('click', () => showPage('file-register'));
    elements.navFileInfo.addEventListener('click', () => {
        showPage('file-info');
        loadFileInfoData();
    });
    elements.navFileProcess.addEventListener('click', () => {
        showPage('file-process');
        loadFileProcessData();
    });
    elements.navSystemSettings.addEventListener('click', () => {
        showPage('system-settings');
        loadSystemSettingsData();
    });
    
    // 文件登记表单
    elements.fileRegisterForm.addEventListener('submit', handleFileRegister);
    elements.registerResetBtn.addEventListener('click', resetFileRegisterForm);
    elements.addContentRow.addEventListener('click', addContentRow);
    elements.registerFileType.addEventListener('change', handleFileTypeChange);
    
    // 文件信息页面
    elements.fileInfoRefresh.addEventListener('click', loadFileInfoData);
    elements.fileInfoSearch.addEventListener('input', handleFileInfoSearch);
    
    // 文件处理页面
    elements.fileProcessRefresh.addEventListener('click', loadFileProcessData);
    elements.selectAll.addEventListener('change', handleSelectAll);
    elements.batchDeleteBtn.addEventListener('click', handleBatchDelete);
    elements.batchStatusSelect.addEventListener('change', handleBatchStatusChange);
    elements.exportExcelBtn.addEventListener('click', handleExportExcel);
    
    // 筛选功能
    elements.filterToggle.addEventListener('click', toggleFilterDropdown);
    elements.filterReset.addEventListener('click', resetFilters);
    elements.filterApply.addEventListener('click', applyFilters);
    
    // 修改密码模态框
    elements.changePasswordForm.addEventListener('submit', handleChangePassword);
    elements.closeChangePasswordModal.addEventListener('click', closeChangePasswordModal);
    elements.cancelChangePassword.addEventListener('click', closeChangePasswordModal);
    
    // 编辑文件模态框
    elements.editFileForm.addEventListener('submit', handleEditFile);
    elements.closeEditFileModal.addEventListener('click', closeEditFileModal);
    elements.cancelEditFile.addEventListener('click', closeEditFileModal);
    elements.editStatus.addEventListener('change', handleEditStatusChange);
    
    // 新增账号模态框
    elements.addAccountForm.addEventListener('submit', handleAddAccount);
    elements.closeAddAccountModal.addEventListener('click', closeAddAccountModal);
    elements.cancelAddAccount.addEventListener('click', closeAddAccountModal);
    elements.addAccountBtn.addEventListener('click', openAddAccountModal);
    
    // 确认删除模态框
    elements.cancelDelete.addEventListener('click', closeConfirmDeleteModal);
    elements.confirmDelete.addEventListener('click', confirmDeleteAction);
    
    // 初始设置中的添加项按钮
    document.querySelectorAll('.add-item-btn').forEach(btn => {
        btn.addEventListener('click', handleAddSystemItem);
    });
}

// 显示登录页面
function showLoginPage() {
    elements.loginPage.classList.remove('hidden');
    elements.fileRegisterPage.classList.add('hidden');
    elements.fileInfoPage.classList.add('hidden');
    elements.fileProcessPage.classList.add('hidden');
    elements.systemSettingsPage.classList.add('hidden');
    elements.navMenu.classList.add('hidden');
    elements.currentUser.classList.add('hidden');
    elements.changePasswordBtn.classList.add('hidden');
    elements.logoutBtn.classList.add('hidden');
}

// 显示仪表盘
function showDashboard() {
    elements.loginPage.classList.add('hidden');
    elements.navMenu.classList.remove('hidden');
    elements.currentUser.classList.remove('hidden');
    elements.changePasswordBtn.classList.remove('hidden');
    elements.logoutBtn.classList.remove('hidden');
    elements.usernameDisplay.textContent = appState.currentUser.username;
    
    // 根据用户权限显示相应的导航项
    updateNavigationByRole();
    
    // 默认显示文件登记页面
    showPage('file-register');
    
    // 如果是首次登录，强制修改密码
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const currentUser = users.find(user => user.username === appState.currentUser.username);
    if (currentUser && currentUser.firstLogin && appState.currentUser.role !== 'admin') {
        openChangePasswordModal();
    }
}

// 根据用户角色更新导航菜单
function updateNavigationByRole() {
    const role = appState.currentUser.role;
    
    // 重置所有导航项
    elements.navFileRegister.classList.remove('hidden');
    elements.navFileInfo.classList.remove('hidden');
    elements.navFileProcess.classList.remove('hidden');
    elements.navSystemSettings.classList.remove('hidden');
    
    // 根据角色隐藏相应的导航项
    if (role === 'user') {
        elements.navFileProcess.classList.add('hidden');
        elements.navSystemSettings.classList.add('hidden');
    } else if (role === 'manager') {
        elements.navSystemSettings.classList.add('hidden');
    }
}

// 显示特定页面
function showPage(pageName) {
    // 隐藏所有页面
    elements.fileRegisterPage.classList.add('hidden');
    elements.fileInfoPage.classList.add('hidden');
    elements.fileProcessPage.classList.add('hidden');
    elements.systemSettingsPage.classList.add('hidden');
    
    // 显示选中页面
    switch (pageName) {
        case 'file-register':
            elements.fileRegisterPage.classList.remove('hidden');
            populateFileRegisterForm();
            break;
        case 'file-info':
            elements.fileInfoPage.classList.remove('hidden');
            populateFileInfoFilters();
            break;
        case 'file-process':
            elements.fileProcessPage.classList.remove('hidden');
            populateFileProcessForm();
            break;
        case 'system-settings':
            elements.systemSettingsPage.classList.remove('hidden');
            break;
    }
}

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    
    const username = elements.loginUsername.value.trim();
    const password = elements.loginPassword.value;
    
    // 获取用户数据
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // 保存当前用户
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        appState.currentUser = user;
        
        // 添加登录日志
        addLog(`${username} 登录系统`);
        
        // 显示仪表盘
        showDashboard();
        showToast('success', '登录成功');
    } else {
        // 显示错误信息
        elements.loginError.classList.remove('hidden');
        elements.loginErrorMessage.textContent = '账号或密码错误';
        setTimeout(() => {
            elements.loginError.classList.add('hidden');
        }, 3000);
    }
}

// 处理退出登录
function handleLogout() {
    // 添加退出日志
    addLog(`${appState.currentUser.username} 退出系统`);
    
    // 清除当前用户
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    appState.currentUser = null;
    
    // 显示登录页面
    showLoginPage();
    showToast('info', '已成功退出登录');
}

// 切换密码可见性
function togglePasswordVisibility() {
    const type = elements.loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    elements.loginPassword.setAttribute('type', type);
    elements.togglePassword.innerHTML = type === 'password' ? '<i class="fa fa-eye-slash"></i>' : '<i class="fa fa-eye"></i>';
}

// 打开修改密码模态框
function openChangePasswordModal() {
    elements.changePasswordModal.classList.remove('hidden');
    elements.currentPassword.value = '';
    elements.newPassword.value = '';
    elements.confirmPassword.value = '';
    elements.changePasswordError.classList.add('hidden');
    elements.changePasswordSuccess.classList.add('hidden');
}

// 关闭修改密码模态框
function closeChangePasswordModal() {
    elements.changePasswordModal.classList.add('hidden');
}

// 处理修改密码
function handleChangePassword(e) {
    e.preventDefault();
    
    const currentPassword = elements.currentPassword.value;
    const newPassword = elements.newPassword.value;
    const confirmPassword = elements.confirmPassword.value;
    
    // 验证密码
    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        elements.changePasswordError.classList.remove('hidden');
        elements.changePasswordErrorMessage.textContent = '新密码长度至少8位，包含字母和数字';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        elements.changePasswordError.classList.remove('hidden');
        elements.changePasswordErrorMessage.textContent = '两次输入的密码不一致';
        return;
    }
    
    // 获取用户数据
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const userIndex = users.findIndex(u => u.username === appState.currentUser.username && u.password === currentPassword);
    
    if (userIndex !== -1) {
        // 更新密码
        users[userIndex].password = newPassword;
        users[userIndex].firstLogin = false;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        // 更新当前用户
        appState.currentUser.password = newPassword;
        appState.currentUser.firstLogin = false;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(appState.currentUser));
        
        // 添加日志
        addLog(`${appState.currentUser.username} 修改了密码`);
        
        // 显示成功信息
        elements.changePasswordError.classList.add('hidden');
        elements.changePasswordSuccess.classList.remove('hidden');
        
        setTimeout(() => {
            closeChangePasswordModal();
        }, 1500);
        
        showToast('success', '密码修改成功');
    } else {
        elements.changePasswordError.classList.remove('hidden');
        elements.changePasswordErrorMessage.textContent = '当前密码不正确';
    }
}

// 填充文件登记表单
function populateFileRegisterForm() {
    // 填充文件类型
    populateSelectOptions(elements.registerFileType, appState.settings.fileTypes);
    
    // 填充部门
    populateSelectOptions(elements.registerDepartment, appState.settings.departments);
    
    // 确保至少有一行内容
    if (elements.fileContentContainer.querySelectorAll('.content-row').length === 0) {
        addContentRow();
    }
    
    // 填充现有行的计量单位
    document.querySelectorAll('.content-row select.unit').forEach(select => {
        populateSelectOptions(select, appState.settings.units);
    });
}

// 添加内容行
function addContentRow() {
    const rows = elements.fileContentContainer.querySelectorAll('.content-row');
    const newIndex = rows.length;
    
    const newRow = document.createElement('div');
    newRow.className = 'content-row space-y-4';
    newRow.dataset.index = newIndex;
    
    newRow.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">文件内容 <span class="text-red-500">*</span></label>
                <div id="content-input-container-${newIndex}">
                    <textarea rows="2" class="file-content block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm input-focus" placeholder="请输入文件内容" required></textarea>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">计量单位 <span class="text-red-500">*</span></label>
                <select class="unit block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm input-focus" required>
                    <option value="">请选择计量单位</option>
                    ${appState.settings.units.map(unit => `<option value="${unit}">${unit}</option>`).join('')}
                </select>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">数量</label>
                    <input type="number" step="0.01" class="quantity block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm input-focus" placeholder="0.00">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">金额</label>
                    <input type="number" step="0.01" class="amount block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm input-focus" placeholder="0.00">
                </div>
            </div>
        </div>
        ${newIndex > 0 ? `<button type="button" class="remove-content-row text-red-500 hover:text-red-700 text-sm flex items-center justify-end" data-index="${newIndex}">
            <i class="fa fa-trash mr-1"></i>
            <span>删除此行</span>
        </button>` : ''}
    `;
    
    elements.fileContentContainer.appendChild(newRow);
    
    // 添加删除按钮事件
    if (newIndex > 0) {
        newRow.querySelector('.remove-content-row').addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            document.querySelector(`.content-row[data-index="${index}"]`).remove();
            
            // 更新剩余行的索引
            updateContentRowIndexes();
        });
    }
    
    // 检查文件类型，如果是付款相关的，更新输入框
    const fileType = elements.registerFileType.value;
    if (fileType === '付款申请单' || fileType === '付款单+用印审批（仅限验收报告）') {
        updateContentInput(newIndex, fileType);
    }
}

// 更新内容行索引
function updateContentRowIndexes() {
    const rows = elements.fileContentContainer.querySelectorAll('.content-row');
    rows.forEach((row, index) => {
        row.dataset.index = index;
        const removeBtn = row.querySelector('.remove-content-row');
        if (removeBtn) {
            removeBtn.dataset.index = index;
        }
    });
}

// 处理文件类型变化
function handleFileTypeChange() {
    const fileType = this.value;
    const rows = elements.fileContentContainer.querySelectorAll('.content-row');
    
    rows.forEach((row, index) => {
        updateContentInput(index, fileType);
    });
}

// 更新内容输入框
function updateContentInput(index, fileType) {
    const container = document.getElementById(`content-input-container-${index}`);
    
    if (fileType === '付款申请单' || fileType === '付款单+用印审批（仅限验收报告）') {
        container.innerHTML = `
            <div class="space-y-2">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs font-medium text-gray-500">类型</label>
                        <div class="flex space-x-2">
                            <label class="inline-flex items-center">
                                <input type="radio" name="payment-type-${index}" value="支付" class="payment-type-radio" checked>
                                <span class="ml-1 text-sm">支付</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input type="radio" name="payment-type-${index}" value="报销" class="payment-type-radio">
                                <span class="ml-1 text-sm">报销</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-500">支付项目</label>
                        <input type="text" class="payment-item w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm input-focus" placeholder="请输入支付项目">
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs font-medium text-gray-500">支付类型</label>
                        <select class="payment-type w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm input-focus">
                            ${appState.settings.paymentTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                        </select>
                    </div>
                    <div class="payment-percentage-container hidden">
                        <label class="block text-xs font-medium text-gray-500">百分比</label>
                        <input type="number" min="0" max="100" class="payment-percentage w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm input-focus" placeholder="0-100">
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs font-medium text-gray-500">期间</label>
                        <input type="month" class="payment-period w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm input-focus">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-500">付款单位简称</label>
                        <select class="payment-unit w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm input-focus">
                            ${appState.settings.paymentUnits.map(unit => `<option value="${unit}">${unit}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>
        `;
        
        // 添加支付类型变化事件
        const paymentTypeSelect = container.querySelector('.payment-type');
        const percentageContainer = container.querySelector('.payment-percentage-container');
        
        paymentTypeSelect.addEventListener('change', function() {
            if (this.value === '预付款' || this.value === '验收款' || this.value === '尾款') {
                percentageContainer.classList.remove('hidden');
            } else {
                percentageContainer.classList.add('hidden');
            }
        });
        
        // 初始化支付类型
        if (paymentTypeSelect.value === '预付款' || paymentTypeSelect.value === '验收款' || paymentTypeSelect.value === '尾款') {
            percentageContainer.classList.remove('hidden');
        }
    } else {
        container.innerHTML = `
            <textarea rows="2" class="file-content block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm input-focus" placeholder="请输入文件内容" required></textarea>
        `;
    }
}

// 重置文件登记表单
function resetFileRegisterForm() {
    elements.fileRegisterForm.reset();
    const today = new Date().toISOString().split('T')[0];
    elements.registerDate.value = today;
    
    // 保留第一行内容，清空其余行
    const rows = elements.fileContentContainer.querySelectorAll('.content-row');
    if (rows.length > 1) {
        for (let i = rows.length - 1; i > 0; i--) {
            rows[i].remove();
        }
    }
    
    // 清空第一行内容
    const firstRow = rows[0];
    if (firstRow) {
        const inputs = firstRow.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type !== 'radio' && input.type !== 'checkbox') {
                input.value = '';
            } else if (input.name && input.name.startsWith('payment-type-')) {
                input.checked = input.value === '支付';
            }
        });
    }
    
    // 重置文件类型相关的输入框
    handleFileTypeChange.call(elements.registerFileType);
}

// 处理文件登记提交
function handleFileRegister(e) {
    e.preventDefault();
    
    const date = elements.registerDate.value;
    const fileType = elements.registerFileType.value;
    const department = elements.registerDepartment.value;
    const applicant = elements.registerApplicant.value;
    
    // 验证必填字段
    if (!date || !fileType || !department || !applicant) {
        showToast('error', '请填写所有必填字段');
        return;
    }
    
    // 收集文件内容
    const contents = [];
    const rows = elements.fileContentContainer.querySelectorAll('.content-row');
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        let contentText = '';
        
        // 检查是否是付款相关的文件类型
        if (fileType === '付款申请单' || fileType === '付款单+用印审批（仅限验收报告）') {
            const paymentTypeRadio = row.querySelector(`input[name="payment-type-${i}"]:checked`);
            const paymentItem = row.querySelector('.payment-item').value;
            const paymentType = row.querySelector('.payment-type').value;
            const paymentPercentage = row.querySelector('.payment-percentage')?.value;
            const paymentPeriod = row.querySelector('.payment-period').value;
            const paymentUnit = row.querySelector('.payment-unit').value;
            
            // 构建摘要
            contentText = `${paymentTypeRadio?.value || ''}${paymentItem ? ' ' + paymentItem : ''}${paymentType ? ' ' + paymentType : ''}`;
            
            if (paymentPercentage) {
                contentText += ` ${paymentPercentage}%`;
            }
            
            if (paymentPeriod && paymentUnit) {
                contentText += ` （${paymentPeriod}--${paymentUnit}）`;
            }
        } else {
            const textarea = row.querySelector('.file-content');
            contentText = textarea?.value || '';
        }
        
        const unit = row.querySelector('.unit').value;
        const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
        const amount = parseFloat(row.querySelector('.amount').value) || 0;
        
        if (!contentText || !unit) {
            showToast('error', `第 ${i + 1} 行的文件内容和计量单位为必填项`);
            return;
        }
        
        contents.push({
            content: contentText,
            unit: unit,
            quantity: quantity,
            amount: amount
        });
    }
    
    // 创建新文件记录
    const newFile = {
        id: Date.now(),
        date: date,
        fileType: fileType,
        fileNumber: '',
        department: department,
        applicant: applicant,
        contents: contents,
        status: '',
        statusUpdateTime: null,
        endDate: null,
        rejectReason: '',
        createdBy: appState.currentUser.username,
        createdAt: new Date().toISOString()
    };
    
    // 保存到 localStorage
    appState.files.push(newFile);
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(appState.files));
    
    // 添加日志
    addLog(`${appState.currentUser.username} 登记了新文件: ${fileType}`);
    
    // 重置表单
    resetFileRegisterForm();
    
    // 显示成功消息
    showToast('success', '文件登记成功');
}

// 加载文件信息数据
function loadFileInfoData() {
    elements.fileInfoLoading.classList.remove('hidden');
    elements.fileInfoEmpty.classList.add('hidden');
    elements.fileInfoBody.innerHTML = '';
    
    // 模拟加载延迟
    setTimeout(() => {
        const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES)) || [];
        appState.files = files;
        
        if (files.length === 0) {
            elements.fileInfoEmpty.classList.remove('hidden');
        } else {
            // 按日期降序排序
            const sortedFiles = [...files].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            sortedFiles.forEach(file => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50 transition-colors duration-150';
                
                // 格式化日期
                const formattedDate = formatDate(file.date);
                const formattedEndDate = file.endDate ? formatDate(file.endDate) : '';
                const formattedUpdateTime = file.statusUpdateTime ? formatDateTime(file.statusUpdateTime) : '';
                
                row.innerHTML = `
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${formattedDate}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.fileType}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.fileNumber || '-'}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.department}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.applicant}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate" title="${file.contents.map(c => c.content).join(', ')}">${file.contents.map(c => c.content).join(', ')}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.contents.map(c => c.unit).join(', ')}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.contents.map(c => c.quantity || '/').join(', ')}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.contents.map(c => c.amount.toFixed(2)).join(', ')}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${formattedEndDate}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            ${file.status || '-'}
                        </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${formattedUpdateTime}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 max-w-[150px] truncate" title="${file.rejectReason}">${file.rejectReason || '-'}</td>
                `;
                
                elements.fileInfoBody.appendChild(row);
            });
        }
        
        elements.fileInfoLoading.classList.add('hidden');
    }, 500);
}

// 填充文件信息筛选框
function populateFileInfoFilters() {
    populateSelectOptions(elements.filterFileType, appState.settings.fileTypes);
    populateSelectOptions(elements.filterDepartment, appState.settings.departments);
    populateSelectOptions(elements.filterStatus, appState.settings.statuses);
}

// 切换筛选下拉框
function toggleFilterDropdown() {
    elements.filterDropdown.classList.toggle('hidden');
}

// 重置筛选条件
function resetFilters() {
    elements.filterDateStart.value = '';
    elements.filterDateEnd.value = '';
    elements.filterFileType.value = '';
    elements.filterDepartment.value = '';
    elements.filterStatus.value = '';
    
    // 重新加载数据
    loadFileInfoData();
}

// 应用筛选条件
function applyFilters() {
    const dateStart = elements.filterDateStart.value;
    const dateEnd = elements.filterDateEnd.value;
    const fileType = elements.filterFileType.value;
    const department = elements.filterDepartment.value;
    const status = elements.filterStatus.value;
    
    elements.fileInfoLoading.classList.remove('hidden');
    elements.fileInfoBody.innerHTML = '';
    
    // 模拟加载延迟
    setTimeout(() => {
        let filteredFiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES)) || [];
        
        // 应用筛选条件
        filteredFiles = filteredFiles.filter(file => {
            if (dateStart && new Date(file.date) < new Date(dateStart)) return false;
            if (dateEnd && new Date(file.date) > new Date(dateEnd)) return false;
            if (fileType && file.fileType !== fileType) return false;
            if (department && file.department !== department) return false;
            if (status && file.status !== status) return false;
            return true;
        });
        
        if (filteredFiles.length === 0) {
            elements.fileInfoEmpty.classList.remove('hidden');
        } else {
            // 按日期降序排序
            const sortedFiles = [...filteredFiles].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            sortedFiles.forEach(file => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50 transition-colors duration-150';
                
                // 格式化日期
                const formattedDate = formatDate(file.date);
                const formattedEndDate = file.endDate ? formatDate(file.endDate) : '';
                const formattedUpdateTime = file.statusUpdateTime ? formatDateTime(file.statusUpdateTime) : '';
                
                row.innerHTML = `
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${formattedDate}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.fileType}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.fileNumber || '-'}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.department}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.applicant}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate" title="${file.contents.map(c => c.content).join(', ')}">${file.contents.map(c => c.content).join(', ')}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.contents.map(c => c.unit).join(', ')}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.contents.map(c => c.quantity || '/').join(', ')}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.contents.map(c => c.amount.toFixed(2)).join(', ')}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${formattedEndDate}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            ${file.status || '-'}
                        </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${formattedUpdateTime}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 max-w-[150px] truncate" title="${file.rejectReason}">${file.rejectReason || '-'}</td>
                `;
                
                elements.fileInfoBody.appendChild(row);
            });
        }
        
        elements.fileInfoLoading.classList.add('hidden');
        elements.filterDropdown.classList.add('hidden');
    }, 500);
}

// 处理文件信息搜索
function handleFileInfoSearch() {
    const searchTerm = this.value.toLowerCase();
    
    elements.fileInfoBody.innerHTML = '';
    
    const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES)) || [];
    const filteredFiles = files.filter(file => {
        const searchableText = `${file.fileType} ${file.department} ${file.applicant} ${file.contents.map(c => c.content).join(' ')} ${file.fileNumber}`.toLowerCase();
        return searchableText.includes(searchTerm);
    });
    
    if (filteredFiles.length === 0) {
        elements.fileInfoEmpty.classList.remove('hidden');
    } else {
        elements.fileInfoEmpty.classList.add('hidden');
        
        // 按日期降序排序
        const sortedFiles = [...filteredFiles].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedFiles.forEach(file => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors duration-150';
            
            // 格式化日期
            const formattedDate = formatDate(file.date);
            const formattedEndDate = file.endDate ? formatDate(file.endDate) : '';
            const formattedUpdateTime = file.statusUpdateTime ? formatDateTime(file.statusUpdateTime) : '';
            
            row.innerHTML = `
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${formattedDate}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.fileType}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.fileNumber || '-'}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.department}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.applicant}</td>
                <td class="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate" title="${file.contents.map(c => c.content).join(', ')}">${file.contents.map(c => c.content).join(', ')}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.contents.map(c => c.unit).join(', ')}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.contents.map(c => c.quantity || '/').join(', ')}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.contents.map(c => c.amount.toFixed(2)).join(', ')}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${formattedEndDate}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        ${file.status || '-'}
                    </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${formattedUpdateTime}</td>
                <td class="px-4 py-3 text-sm text-gray-900 max-w-[150px] truncate" title="${file.rejectReason}">${file.rejectReason || '-'}</td>
            `;
            
            elements.fileInfoBody.appendChild(row);
        });
    }
}

// 加载文件处理数据
function loadFileProcessData() {
    elements.fileProcessLoading.classList.remove('hidden');
    elements.fileProcessEmpty.classList.add('hidden');
    elements.fileProcessBody.innerHTML = '';
    
    // 模拟加载延迟
    setTimeout(() => {
        const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES)) || [];
        appState.files = files;
        
        if (files.length === 0) {
            elements.fileProcessEmpty.classList.remove('hidden');
        } else {
            // 按日期降序排序
            const sortedFiles = [...files].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            sortedFiles.forEach(file => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50 transition-colors duration-150';
                row.dataset.fileId = file.id;
                
                // 格式化日期
                const formattedDate = formatDate(file.date);
                
                row.innerHTML = `
                    <td class="px-4 py-3 whitespace-nowrap">
                        <input type="checkbox" class="file-checkbox rounded border-gray-300 text-primary focus:ring-primary/30" data-id="${file.id}">
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${formattedDate}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.fileType}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.fileNumber || '-'}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.department}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.applicant}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 max-w-[150px] truncate" title="${file.contents.map(c => c.content).join(', ')}">${file.contents.map(c => c.content).join(', ')}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.contents.map(c => c.unit).join(', ')}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.contents.map(c => c.quantity || '/').join(', ')}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${file.contents.map(c => c.amount.toFixed(2)).join(', ')}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(file.status)}">
                            ${file.status || '-'}
                        </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button class="text-primary hover:text-primary/80 edit-file-btn mr-3" data-id="${file.id}">
                            <i class="fa fa-pencil"></i> 编辑
                        </button>
                        <button class="text-danger hover:text-danger/80 delete-file-btn" data-id="${file.id}">
                            <i class="fa fa-trash"></i> 删除
                        </button>
                    </td>
                `;
                
                elements.fileProcessBody.appendChild(row);
            });
            
            // 添加编辑和删除按钮事件
            document.querySelectorAll('.edit-file-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const fileId = parseInt(this.dataset.id);
                    openEditFileModal(fileId);
                });
            });
            
            document.querySelectorAll('.delete-file-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const fileId = parseInt(this.dataset.id);
                    openConfirmDeleteModal('file', fileId);
                });
            });
            
            // 添加复选框事件
            document.querySelectorAll('.file-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', handleFileCheckboxChange);
            });
        }
        
        elements.fileProcessLoading.classList.add('hidden');
    }, 500);
}

// 填充文件处理表单
function populateFileProcessForm() {
    populateSelectOptions(elements.batchStatusSelect, appState.settings.statuses, '批量修改状态');
}

// 处理全选
function handleSelectAll() {
    const isChecked = this.checked;
    document.querySelectorAll('.file-checkbox').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    updateBatchButtonsState();
}

// 处理文件复选框变化
function handleFileCheckboxChange() {
    const checkedCount = document.querySelectorAll('.file-checkbox:checked').length;
    const totalCount = document.querySelectorAll('.file-checkbox').length;
    
    elements.selectAll.checked = checkedCount === totalCount && totalCount > 0;
    elements.selectAll.indeterminate = checkedCount > 0 && checkedCount < totalCount;
    
    updateBatchButtonsState();
}

// 更新批量操作按钮状态
function updateBatchButtonsState() {
    const checkedCount = document.querySelectorAll('.file-checkbox:checked').length;
    elements.batchDeleteBtn.disabled = checkedCount === 0;
    elements.batchStatusSelect.disabled = checkedCount === 0;
}

// 处理批量删除
function handleBatchDelete() {
    const checkedIds = Array.from(document.querySelectorAll('.file-checkbox:checked')).map(checkbox => parseInt(checkbox.dataset.id));
    
    if (checkedIds.length > 0) {
        openConfirmDeleteModal('batch', checkedIds);
    }
}

// 处理批量修改状态
function handleBatchStatusChange() {
    const status = this.value;
    if (!status) return;
    
    const checkedIds = Array.from(document.querySelectorAll('.file-checkbox:checked')).map(checkbox => parseInt(checkbox.dataset.id));
    
    if (checkedIds.length > 0) {
        const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES)) || [];
        
        files.forEach(file => {
            if (checkedIds.includes(file.id)) {
                file.status = status;
                file.statusUpdateTime = new Date().toISOString();
                
                // 如果状态为完毕，设置结束日期
                if (status === '完毕') {
                    file.endDate = new Date().toISOString().split('T')[0];
                } else if (file.endDate) {
                    // 如果状态不是完毕，清除结束日期
                    file.endDate = null;
                }
                
                // 如果状态不是退回，清除退回原因
                if (status !== '退回') {
                    file.rejectReason = '';
                }
            }
        });
        
        localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
        appState.files = files;
        
        // 添加日志
        addLog(`${appState.currentUser.username} 批量修改了 ${checkedIds.length} 个文件的状态为: ${status}`);
        
        // 重新加载数据
        loadFileProcessData();
        showToast('success', `已成功修改 ${checkedIds.length} 个文件的状态`);
        
        // 重置选择框
        this.value = '';
    }
}

// 处理导出Excel
function handleExportExcel() {
    const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES)) || [];
    
    if (files.length === 0) {
        showToast('warning', '暂无数据可导出');
        return;
    }
    
    // 构建CSV内容
    let csvContent = '\uFEFF'; // BOM for UTF-8
    csvContent += '日期,文件类型,文件编号,申请部门,申请人,文件内容,计量单位,数量,金额,送签状态,更新时间\n';
    
    files.forEach(file => {
        const date = formatDate(file.date);
        const contents = file.contents.map(c => c.content).join('; ');
        const units = file.contents.map(c => c.unit).join('; ');
        const quantities = file.contents.map(c => c.quantity || '/').join('; ');
        const amounts = file.contents.map(c => c.amount.toFixed(2)).join('; ');
        const updateTime = file.statusUpdateTime ? formatDateTime(file.statusUpdateTime) : '';
        
        // 转义CSV中的特殊字符
        const escape = value => `"${value.replace(/"/g, '""')}"`;
        
        csvContent += `${escape(date)},${escape(file.fileType)},${escape(file.fileNumber || '')},${escape(file.department)},${escape(file.applicant)},${escape(contents)},${escape(units)},${escape(quantities)},${escape(amounts)},${escape(file.status || '')},${escape(updateTime)}
`;
    });
    
    // 创建Blob并下载
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `文件信息_${formatDate(new Date().toISOString().split('T')[0])}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 添加日志
    addLog(`${appState.currentUser.username} 导出了文件信息`);
    showToast('success', '数据导出成功');
}

// 打开编辑文件模态框
function openEditFileModal(fileId) {
    const file = appState.files.find(f => f.id === fileId);
    
    if (file) {
        elements.editFileId.value = file.id;
        elements.editDate.value = file.date;
        
        // 填充下拉框
        populateSelectOptions(elements.editFileType, appState.settings.fileTypes, file.fileType);
        populateSelectOptions(elements.editDepartment, appState.settings.departments, file.department);
        populateSelectOptions(elements.editStatus, appState.settings.statuses, file.status);
        
        elements.editApplicant.value = file.applicant;
        elements.editFileNumber.value = file.fileNumber || '';
        elements.editRejectReason.value = file.rejectReason || '';
        
        // 显示/隐藏退回原因
        if (file.status === '退回') {
            elements.editRejectReasonContainer.classList.remove('hidden');
        } else {
            elements.editRejectReasonContainer.classList.add('hidden');
        }
        
        // 填充文件内容
        elements.editContentBody.innerHTML = '';
        
        file.contents.forEach((content, index) => {
            const contentRow = document.createElement('div');
            contentRow.className = 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-3';
            
            contentRow.innerHTML = `
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">文件内容 <span class="text-red-500">*</span></label>
                    <textarea rows="2" class="edit-file-content block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm input-focus" placeholder="请输入文件内容" required>${content.content}</textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">计量单位 <span class="text-red-500">*</span></label>
                    <select class="edit-unit block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm input-focus" required>
                        ${appState.settings.units.map(unit => `<option value="${unit}" ${unit === content.unit ? 'selected' : ''}>${unit}</option>`).join('')}
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">数量</label>
                        <input type="number" step="0.01" class="edit-quantity block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm input-focus" placeholder="0.00" value="${content.quantity || ''}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">金额</label>
                        <input type="number" step="0.01" class="edit-amount block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm input-focus" placeholder="0.00" value="${content.amount}">
                    </div>
                </div>
            `;
            
            elements.editContentBody.appendChild(contentRow);
        });
        
        // 显示模态框
        elements.editFileModal.classList.remove('hidden');
        elements.editFileError.classList.add('hidden');
    }
}

// 关闭编辑文件模态框
function closeEditFileModal() {
    elements.editFileModal.classList.add('hidden');
}

// 处理编辑状态变化
function handleEditStatusChange() {
    const status = this.value;
    if (status === '退回') {
        elements.editRejectReasonContainer.classList.remove('hidden');
    } else {
        elements.editRejectReasonContainer.classList.add('hidden');
        elements.editRejectReason.value = '';
    }
    
    // 如果状态为完毕，设置结束日期
    if (status === '完毕') {
        const fileId = parseInt(elements.editFileId.value);
        const file = appState.files.find(f => f.id === fileId);
        if (file && !file.endDate) {
            // 文件没有结束日期，设置为今天
            file.endDate = new Date().toISOString().split('T')[0];
        }
    }
}

// 处理编辑文件提交
function handleEditFile(e) {
    e.preventDefault();
    
    const fileId = parseInt(elements.editFileId.value);
    const date = elements.editDate.value;
    const fileType = elements.editFileType.value;
    const department = elements.editDepartment.value;
    const applicant = elements.editApplicant.value;
    const fileNumber = elements.editFileNumber.value;
    const status = elements.editStatus.value;
    const rejectReason = elements.editRejectReason.value;
    
    // 验证必填字段
    if (!date || !fileType || !department || !applicant) {
        elements.editFileError.classList.remove('hidden');
        elements.editFileErrorMessage.textContent = '请填写所有必填字段';
        return;
    }
    
    // 收集文件内容
    const contents = [];
    const contentRows = elements.editContentBody.querySelectorAll('.grid');
    
    for (let i = 0; i < contentRows.length; i++) {
        const row = contentRows[i];
        const content = row.querySelector('.edit-file-content').value;
        const unit = row.querySelector('.edit-unit').value;
        const quantity = parseFloat(row.querySelector('.edit-quantity').value) || 0;
        const amount = parseFloat(row.querySelector('.edit-amount').value) || 0;
        
        if (!content || !unit) {
            elements.editFileError.classList.remove('hidden');
            elements.editFileErrorMessage.textContent = `第 ${i + 1} 行的文件内容和计量单位为必填项`;
            return;
        }
        
        contents.push({
            content: content,
            unit: unit,
            quantity: quantity,
            amount: amount
        });
    }
    
    // 更新文件
    const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES)) || [];
    const fileIndex = files.findIndex(f => f.id === fileId);
    
    if (fileIndex !== -1) {
        files[fileIndex].date = date;
        files[fileIndex].fileType = fileType;
        files[fileIndex].department = department;
        files[fileIndex].applicant = applicant;
        files[fileIndex].fileNumber = fileNumber;
        files[fileIndex].status = status;
        files[fileIndex].statusUpdateTime = new Date().toISOString();
        files[fileIndex].rejectReason = rejectReason;
        files[fileIndex].contents = contents;
        
        // 如果状态为完毕，设置结束日期
        if (status === '完毕') {
            files[fileIndex].endDate = new Date().toISOString().split('T')[0];
        } else if (files[fileIndex].endDate) {
            // 如果状态不是完毕，清除结束日期
            files[fileIndex].endDate = null;
        }
        
        localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
        appState.files = files;
        
        // 添加日志
        addLog(`${appState.currentUser.username} 编辑了文件: ${fileType} (ID: ${fileId})`);
        
        // 关闭模态框
        closeEditFileModal();
        
        // 重新加载数据
        loadFileProcessData();
        showToast('success', '文件更新成功');
    }
}

// 打开新增账号模态框
function openAddAccountModal() {
    elements.addAccountModal.classList.remove('hidden');
    elements.newUsername.value = '';
    elements.newAccountPassword.value = '';
    elements.newAccountRole.value = 'user';
    elements.addAccountError.classList.add('hidden');
    elements.addAccountSuccess.classList.add('hidden');
}

// 关闭新增账号模态框
function closeAddAccountModal() {
    elements.addAccountModal.classList.add('hidden');
}

// 处理新增账号
function handleAddAccount(e) {
    e.preventDefault();
    
    const username = elements.newUsername.value.trim();
    const password = elements.newAccountPassword.value;
    const role = elements.newAccountRole.value;
    
    // 验证输入
    if (!username || !password) {
        elements.addAccountError.classList.remove('hidden');
        elements.addAccountErrorMessage.textContent = '请填写用户名和密码';
        return;
    }
    
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        elements.addAccountError.classList.remove('hidden');
        elements.addAccountErrorMessage.textContent = '密码长度至少8位，包含字母和数字';
        return;
    }
    
    // 检查用户名是否已存在
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const existingUser = users.find(u => u.username === username);
    
    if (existingUser) {
        elements.addAccountError.classList.remove('hidden');
        elements.addAccountErrorMessage.textContent = '用户名已存在';
        return;
    }
    
    // 创建新用户
    const newUser = {
        id: Date.now(),
        username: username,
        password: password,
        role: role,
        firstLogin: true
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // 添加日志
    addLog(`${appState.currentUser.username} 创建了新账号: ${username} (角色: ${role})`);
    
    // 显示成功信息
    elements.addAccountError.classList.add('hidden');
    elements.addAccountSuccess.classList.remove('hidden');
    
    // 重置表单
    elements.newUsername.value = '';
    elements.newAccountPassword.value = '';
    elements.newAccountRole.value = 'user';
    
    // 重新加载系统设置数据
    loadSystemSettingsData();
    
    setTimeout(() => {
        closeAddAccountModal();
    }, 1500);
    
    showToast('success', '账号创建成功');
}

// 打开确认删除模态框
function openConfirmDeleteModal(type, id) {
    elements.confirmDeleteModal.classList.remove('hidden');
    elements.confirmDelete.dataset.type = type;
    elements.confirmDelete.dataset.id = JSON.stringify(id);
}

// 关闭确认删除模态框
function closeConfirmDeleteModal() {
    elements.confirmDeleteModal.classList.add('hidden');
    elements.confirmDelete.dataset.type = '';
    elements.confirmDelete.dataset.id = '';
}

// 确认删除操作
function confirmDeleteAction() {
    const type = this.dataset.type;
    const id = JSON.parse(this.dataset.id);
    
    if (type === 'file') {
        // 删除单个文件
        const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES)) || [];
        const updatedFiles = files.filter(file => file.id !== id);
        
        localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(updatedFiles));
        appState.files = updatedFiles;
        
        // 添加日志
        const deletedFile = files.find(file => file.id === id);
        if (deletedFile) {
            addLog(`${appState.currentUser.username} 删除了文件: ${deletedFile.fileType} (ID: ${id})`);
        }
        
        // 重新加载数据
        loadFileProcessData();
        showToast('success', '文件删除成功');
    } else if (type === 'batch') {
        // 批量删除文件
        const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.FILES)) || [];
        const updatedFiles = files.filter(file => !id.includes(file.id));
        
        localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(updatedFiles));
        appState.files = updatedFiles;
        
        // 添加日志
        addLog(`${appState.currentUser.username} 批量删除了 ${id.length} 个文件`);
        
        // 重新加载数据
        loadFileProcessData();
        showToast('success', `已成功删除 ${id.length} 个文件`);
    } else if (type === 'account') {
        // 删除账号
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        
        // 不能删除自己
        if (id === appState.currentUser.id) {
            showToast('error', '不能删除当前登录的账号');
            closeConfirmDeleteModal();
            return;
        }
        
        const updatedUsers = users.filter(user => user.id !== id);
        
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
        
        // 添加日志
        const deletedUser = users.find(user => user.id === id);
        if (deletedUser) {
            addLog(`${appState.currentUser.username} 删除了账号: ${deletedUser.username}`);
        }
        
        // 重新加载数据
        loadSystemSettingsData();
        showToast('success', '账号删除成功');
    } else if (type === 'setting') {
        // 删除系统设置项
        const [settingType, itemId] = id.split(':');
        const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS)) || {};
        
        if (settings[settingType] && Array.isArray(settings[settingType])) {
            settings[settingType] = settings[settingType].filter(item => item !== itemId);
            localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(settings));
            appState.settings = settings;
            
            // 添加日志
            addLog(`${appState.currentUser.username} 删除了${getSettingTypeName(settingType)}: ${itemId}`);
            
            // 重新加载数据
            loadSystemSettingsData();
            showToast('success', '设置项删除成功');
        }
    }
    
    // 关闭模态框
    closeConfirmDeleteModal();
}

// 处理添加系统设置项
function handleAddSystemItem() {
    const settingType = this.dataset.type;
    const settingTypeName = getSettingTypeName(settingType);
    
    const itemName = prompt(`请输入新的${settingTypeName}:`);
    
    if (itemName && itemName.trim()) {
        const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS)) || {};
        
        if (!settings[settingType]) {
            settings[settingType] = [];
        }
        
        // 检查是否已存在
        if (settings[settingType].includes(itemName.trim())) {
            showToast('warning', `${settingTypeName}已存在`);
            return;
        }
        
        // 添加新项
        settings[settingType].push(itemName.trim());
        localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(settings));
        appState.settings = settings;
        
        // 添加日志
        addLog(`${appState.currentUser.username} 添加了${settingTypeName}: ${itemName.trim()}`);
        
        // 重新加载数据
        loadSystemSettingsData();
        showToast('success', `${settingTypeName}添加成功`);
    }
}

// 获取设置类型名称
function getSettingTypeName(type) {
    const typeNames = {
        fileTypes: '文件类型',
        departments: '部门',
        units: '计量单位',
        statuses: '送签状态',
        paymentUnits: '付款单位简称',
        paymentTypes: '支付类型'
    };
    
    return typeNames[type] || type;
}

// 加载系统设置数据
function loadSystemSettingsData() {
    // 加载系统设置项
    loadSettingItems('fileTypes', elements.fileTypesContainer);
    loadSettingItems('departments', elements.departmentsContainer);
    loadSettingItems('units', elements.unitsContainer);
    loadSettingItems('statuses', elements.statusesContainer);
    loadSettingItems('paymentUnits', elements.paymentUnitsContainer);
    loadSettingItems('paymentTypes', elements.paymentTypesContainer);
    
    // 加载账号列表
    loadAccountsList();
    
    // 加载操作日志
    loadOperationLogs();
}

// 加载设置项
function loadSettingItems(settingType, container) {
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS)) || {};
    const items = settings[settingType] || [];
    
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm">暂无数据</p>';
    } else {
        const list = document.createElement('div');
        list.className = 'flex flex-wrap gap-2';
        
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800';
            
            itemElement.innerHTML = `
                <span>${item}</span>
                <button type="button" class="ml-2 text-gray-500 hover:text-gray-700 delete-setting-item" data-type="${settingType}" data-id="${item}">
                    <i class="fa fa-times"></i>
                </button>
            `;
            
            list.appendChild(itemElement);
        });
        
        container.appendChild(list);
        
        // 添加删除按钮事件
        document.querySelectorAll('.delete-setting-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.dataset.type;
                const id = this.dataset.id;
                openConfirmDeleteModal('setting', `${type}:${id}`);
            });
        });
    }
}

// 加载账号列表
function loadAccountsList() {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    elements.accountsBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors duration-150';
        
        // 获取角色名称
        const roleName = user.role === 'admin' ? '总管理员' : user.role === 'manager' ? '普通管理员' : '普通账号';
        
        row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${user.username}</td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColorClass(user.role)}">
                    ${roleName}
                </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${user.firstLogin ? '是' : '否'}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button class="text-primary hover:text-primary/80 edit-account-role mr-3" data-id="${user.id}" data-role="${user.role}">
                    <i class="fa fa-cog"></i> 修改权限
                </button>
                <button class="text-danger hover:text-danger/80 delete-account-btn" data-id="${user.id}">
                    <i class="fa fa-trash"></i> 删除
                </button>
            </td>
        `;
        
        elements.accountsBody.appendChild(row);
    });
    
    // 添加修改权限按钮事件
    document.querySelectorAll('.edit-account-role').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = parseInt(this.dataset.id);
            const currentRole = this.dataset.role;
            editAccountRole(userId, currentRole);
        });
    });
    
    // 添加删除账号按钮事件
    document.querySelectorAll('.delete-account-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = parseInt(this.dataset.id);
            openConfirmDeleteModal('account', userId);
        });
    });
}

// 编辑账号权限
function editAccountRole(userId, currentRole) {
    const roleOptions = [
        { value: 'user', label: '普通账号' },
        { value: 'manager', label: '普通管理员' },
        { value: 'admin', label: '总管理员' }
    ];
    
    // 排除当前角色
    const options = roleOptions.filter(option => option.value !== currentRole);
    
    // 构建选项
    let optionsHtml = '';
    options.forEach(option => {
        optionsHtml += `<option value="${option.value}">${option.label}</option>`;
    });
    
    const newRole = prompt(`请选择新的角色:\n${options.map(option => `- ${option.label}`).join('\n')}`);
    
    if (newRole && ['user', 'manager', 'admin'].includes(newRole)) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
            const oldRole = users[userIndex].role;
            users[userIndex].role = newRole;
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            
            // 如果修改的是当前登录用户的角色，更新当前用户
            if (appState.currentUser && appState.currentUser.id === userId) {
                appState.currentUser.role = newRole;
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(appState.currentUser));
                
                // 更新导航菜单
                updateNavigationByRole();
            }
            
            // 添加日志
            const username = users[userIndex].username;
            addLog(`${appState.currentUser.username} 修改了账号 ${username} 的权限: ${oldRole} -> ${newRole}`);
            
            // 重新加载数据
            loadAccountsList();
            showToast('success', '账号权限修改成功');
        }
    } else if (newRole) {
        showToast('error', '无效的角色选择');
    }
}

// 加载操作日志
function loadOperationLogs() {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.OPERATIONAL_LOGS)) || [];
    appState.logs = logs;
    elements.logsBody.innerHTML = '';
    
    // 按时间倒序排序
    const sortedLogs = [...logs].sort((a, b) => new Date(b.time) - new Date(a.time));
    
    if (sortedLogs.length === 0) {
        elements.logsBody.innerHTML = '<tr><td colspan="3" class="px-4 py-3 text-center text-gray-500">暂无操作日志</td></tr>';
    } else {
        // 只显示最近50条日志
        const recentLogs = sortedLogs.slice(0, 50);
        
        recentLogs.forEach(log => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors duration-150';
            
            const formattedTime = formatDateTime(log.time);
            
            row.innerHTML = `
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${formattedTime}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${log.action}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${log.user}</td>
            `;
            
            elements.logsBody.appendChild(row);
        });
    }
}

// 添加操作日志
function addLog(action) {
    const log = {
        time: new Date().toISOString(),
        action: action,
        user: appState.currentUser ? appState.currentUser.username : '系统'
    };
    
    appState.logs.push(log);
    
    // 限制日志数量为1000条
    if (appState.logs.length > 1000) {
        appState.logs = appState.logs.slice(-1000);
    }
    
    localStorage.setItem(STORAGE_KEYS.OPERATIONAL_LOGS, JSON.stringify(appState.logs));
}

// 显示提示消息
function showToast(type, message) {
    const toast = elements.toast;
    const toastIcon = elements.toastIcon;
    const toastMessage = elements.toastMessage;
    
    // 设置图标和颜色
    switch (type) {
        case 'success':
            toast.className = 'fixed top-4 right-4 bg-green-50 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center transform transition-all duration-300 translate-x-full';
            toastIcon.className = 'fa fa-check-circle mr-2';
            break;
        case 'error':
            toast.className = 'fixed top-4 right-4 bg-red-50 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center transform transition-all duration-300 translate-x-full';
            toastIcon.className = 'fa fa-times-circle mr-2';
            break;
        case 'warning':
            toast.className = 'fixed top-4 right-4 bg-yellow-50 text-yellow-800 px-4 py-3 rounded-lg shadow-lg flex items-center transform transition-all duration-300 translate-x-full';
            toastIcon.className = 'fa fa-exclamation-triangle mr-2';
            break;
        case 'info':
            toast.className = 'fixed top-4 right-4 bg-blue-50 text-blue-800 px-4 py-3 rounded-lg shadow-lg flex items-center transform transition-all duration-300 translate-x-full';
            toastIcon.className = 'fa fa-info-circle mr-2';
            break;
    }
    
    // 设置消息
    toastMessage.textContent = message;
    
    // 显示提示
    document.body.appendChild(toast);
    
    // 强制回流
    void toast.offsetWidth;
    
    // 显示动画
    toast.classList.remove('translate-x-full');
    toast.classList.add('translate-x-0');
    
    // 3秒后自动隐藏
    setTimeout(() => {
        toast.classList.remove('translate-x-0');
        toast.classList.add('translate-x-full');
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 填充选择框选项
function populateSelectOptions(selectElement, options, selectedValue = '') {
    selectElement.innerHTML = '';
    
    // 添加空选项
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '请选择';
    selectElement.appendChild(emptyOption);
    
    // 添加选项
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        
        // 设置默认选中
        if (option === selectedValue) {
            optionElement.selected = true;
        }
        
        selectElement.appendChild(optionElement);
    });
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// 格式化日期时间
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 获取状态颜色类
function getStatusColorClass(status) {
    const statusColors = {
        '完毕': 'bg-green-100 text-green-800',
        '退回': 'bg-red-100 text-red-800',
        '未盖章': 'bg-yellow-100 text-yellow-800',
        '作废': 'bg-gray-100 text-gray-800',
        '急单': 'bg-orange-100 text-orange-800'
    };
    
    return statusColors[status] || 'bg-blue-100 text-blue-800';
}

// 获取角色颜色类
function getRoleColorClass(role) {
    const roleColors = {
        'admin': 'bg-purple-100 text-purple-800',
        'manager': 'bg-blue-100 text-blue-800',
        'user': 'bg-green-100 text-green-800'
    };
    
    return roleColors[role] || 'bg-gray-100 text-gray-800';
}

// 初始化应用
window.addEventListener('DOMContentLoaded', initApp);