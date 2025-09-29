/**
 * 主应用脚本
 */
import { 
    formatDate, getCurrentDate, showToast, 
    exportToExcel, saveToLocalStorage, getFromLocalStorage
} from './utils.js';
import { 
    initSettings, getAllSettings, getFileTypes, getDepartments, 
    getUnits, getSendStatuses, getPaymentCompanies, getPaymentTypes, 
    getPaymentProjects, addFileType, removeFileType, addDepartment, 
    removeDepartment, addUnit, removeUnit, addSendStatus, removeSendStatus, 
    addPaymentCompany, removePaymentCompany, addPaymentType, removePaymentType, 
    addPaymentProject, removePaymentProject, getOperationLogs, logOperation
} from './settings.js';
import { 
    initUsers, login, logout, getCurrentUser, changePassword, 
    addUser, deleteUser, updateUser, canAccessPage, getRoleDisplayName,
    checkPermission
} from './users.js';
import { 
    initFiles, addFile, getAllFiles, updateFile, deleteFile, 
    batchDeleteFiles, batchUpdateSendStatus, searchFiles, 
    exportFilesToExcel, generateFileNumber, generateSummaryContent,
    validateFileData
} from './files.js';

// DOM 元素引用
const loginPage = document.getElementById('login-page');
const appPage = document.getElementById('app-page');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const loginError = document.getElementById('login-error');
const userInfo = document.getElementById('user-info');
const logoutButton = document.getElementById('logout-button');
const mainMenu = document.getElementById('main-menu');
const changePasswordButton = document.getElementById('change-password-button');
const changePasswordModal = document.getElementById('change-password-modal');
const closeChangePassword = document.getElementById('close-change-password');
const changePasswordForm = document.getElementById('change-password-form');
const currentPasswordInput = document.getElementById('current-password');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const changePasswordError = document.getElementById('change-password-error');
const changePasswordSuccess = document.getElementById('change-password-success');
const editFileModal = document.getElementById('edit-file-modal');
const closeEditFile = document.getElementById('close-edit-file');
const editFileForm = document.getElementById('edit-file-form');
const editFileError = document.getElementById('edit-file-error');
const refreshFileInfo = document.getElementById('refresh-file-info');
const refreshFileProcessing = document.getElementById('refresh-file-processing');
const exportToExcelButton = document.getElementById('export-to-excel');

// 页面元素
const fileRegistrationPage = document.getElementById('file-registration-page');
const fileInfoPage = document.getElementById('file-info-page');
const fileProcessingPage = document.getElementById('file-processing-page');
const systemSettingsPage = document.getElementById('system-settings-page');
const fileRegistrationForm = document.getElementById('file-registration-form');
const fileInfoFilters = document.getElementById('file-info-filters');
const fileInfoHeader = document.getElementById('file-info-header');
const fileInfoBody = document.getElementById('file-info-body');
const fileProcessingFilters = document.getElementById('file-processing-filters');
const fileProcessingHeader = document.getElementById('file-processing-header');
const fileProcessingBody = document.getElementById('file-processing-body');
const fileTypeSettings = document.getElementById('file-type-settings');
const departmentSettings = document.getElementById('department-settings');
const unitSettings = document.getElementById('unit-settings');
const statusSettings = document.getElementById('status-settings');
const companySettings = document.getElementById('company-settings');
const paymentTypeSettings = document.getElementById('payment-type-settings');
const userManagement = document.getElementById('user-management');
const operationLogs = document.getElementById('operation-logs');
const fileProcessingBatchActions = document.getElementById('file-processing-batch-actions');

// 应用初始化
function initApp() {
    // 初始化数据
    initSettings();
    initUsers();
    initFiles();
    
    // 检查用户登录状态
    const currentUser = getCurrentUser();
    if (currentUser) {
        showApp();
    } else {
        showLoginPage();
    }
    
    // 绑定事件监听器
    bindEventListeners();
}

// 绑定事件监听器
function bindEventListeners() {
    // 登录事件
    loginButton.addEventListener('click', handleLogin);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    // 登出事件
    logoutButton.addEventListener('click', handleLogout);
    
    // 修改密码事件
    changePasswordButton.addEventListener('click', () => {
        showChangePasswordModal();
    });
    closeChangePassword.addEventListener('click', () => {
        hideChangePasswordModal();
    });
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleChangePassword();
    });
    
    // 文件登记表单提交
    fileRegistrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFileRegistration();
    });
    
    // 刷新按钮事件
    refreshFileInfo.addEventListener('click', loadFileInfoList);
    refreshFileProcessing.addEventListener('click', loadFileProcessingList);
    
    // 导出Excel按钮事件
    exportToExcelButton.addEventListener('click', handleExportToExcel);
    
    // 关闭编辑文件弹窗
    closeEditFile.addEventListener('click', hideEditFileModal);
    
    // 编辑文件表单提交
    editFileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleEditFileSubmit();
    });
}

// 显示登录页面
function showLoginPage() {
    loginPage.classList.remove('hidden');
    appPage.classList.add('hidden');
}

// 显示应用页面
function showApp() {
    loginPage.classList.add('hidden');
    appPage.classList.remove('hidden');
    
    // 更新用户信息
    const currentUser = getCurrentUser();
    if (currentUser) {
        userInfo.textContent = `${currentUser.name} (${getRoleDisplayName(currentUser.role)})`;
        
        // 如果需要修改密码，强制用户修改
        if (currentUser.needChangePassword) {
            showChangePasswordModal(true);
        }
    }
    
    // 加载菜单项
    loadMenuItems();
    
    // 默认显示文件登记页面
    showPage('fileRegistration');
}

// 加载菜单项
function loadMenuItems() {
    mainMenu.innerHTML = '';
    
    const menuItems = [
        {
            id: 'fileRegistration',
            name: '文件登记',
            icon: 'fa-file-text-o'
        },
        {
            id: 'fileInfo',
            name: '文件信息',
            icon: 'fa-list-alt'
        },
        {
            id: 'fileProcessing',
            name: '文件处理',
            icon: 'fa-cogs'
        },
        {
            id: 'systemSettings',
            name: '系统设置',
            icon: 'fa-cog'
        }
    ];
    
    menuItems.forEach(item => {
        if (canAccessPage(item.id)) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.id = `menu-${item.id}`;
            a.innerHTML = `<i class="fa ${item.icon} mr-2"></i> ${item.name}`;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                showPage(item.id);
            });
            li.appendChild(a);
            mainMenu.appendChild(li);
        }
    });
}

// 显示指定页面
function showPage(pageId) {
    // 隐藏所有页面
    fileRegistrationPage.classList.add('hidden');
    fileInfoPage.classList.add('hidden');
    fileProcessingPage.classList.add('hidden');
    systemSettingsPage.classList.add('hidden');
    
    // 移除所有菜单项的活动状态
    document.querySelectorAll('#main-menu a').forEach(menu => {
        menu.classList.remove('active');
    });
    
    // 显示指定页面
    switch (pageId) {
        case 'fileRegistration':
            fileRegistrationPage.classList.remove('hidden');
            loadFileRegistrationForm();
            break;
        case 'fileInfo':
            fileInfoPage.classList.remove('hidden');
            loadFileInfoFilters();
            loadFileInfoList();
            break;
        case 'fileProcessing':
            fileProcessingPage.classList.remove('hidden');
            loadFileProcessingFilters();
            loadFileProcessingBatchActions();
            loadFileProcessingList();
            break;
        case 'systemSettings':
            systemSettingsPage.classList.remove('hidden');
            loadSystemSettings();
            loadUserManagement();
            loadOperationLogs();
            break;
    }
    
    // 设置菜单项活动状态
    const activeMenu = document.getElementById(`menu-${pageId}`);
    if (activeMenu) {
        activeMenu.classList.add('active');
    }
}

// 处理登录
function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (!username || !password) {
        showLoginError('请输入账号和密码');
        return;
    }
    
    const result = login(username, password);
    if (result.success) {
        showApp();
        showToast('登录成功');
    } else {
        showLoginError(result.message);
    }
}

// 显示登录错误
function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
    setTimeout(() => {
        loginError.classList.add('hidden');
    }, 3000);
}

// 处理登出
function handleLogout() {
    logout();
    showLoginPage();
    showToast('已成功退出登录');
    
    // 清空登录表单
    usernameInput.value = '';
    passwordInput.value = '';
}

// 显示修改密码弹窗
function showChangePasswordModal(forceChange = false) {
    // 清空表单和提示信息
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
    changePasswordError.classList.add('hidden');
    changePasswordSuccess.classList.add('hidden');
    
    // 显示弹窗
    changePasswordModal.classList.remove('hidden');
    
    // 如果是强制修改密码，隐藏取消按钮
    if (forceChange) {
        changePasswordModal.querySelector('.fa-times').parentElement.classList.add('hidden');
    }
}

// 隐藏修改密码弹窗
function hideChangePasswordModal() {
    changePasswordModal.classList.add('hidden');
}

// 处理修改密码
function handleChangePassword() {
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const currentUser = getCurrentUser();
    
    // 验证输入
    if (!currentPassword || !newPassword || !confirmPassword) {
        showChangePasswordError('请填写所有密码字段');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showChangePasswordError('两次输入的新密码不一致');
        return;
    }
    
    if (newPassword.length < 6) {
        showChangePasswordError('新密码长度不能少于6位');
        return;
    }
    
    // 调用修改密码函数
    const result = changePassword(currentUser.username, currentPassword, newPassword);
    if (result.success) {
        showChangePasswordSuccess(result.message);
        
        // 3秒后关闭弹窗
        setTimeout(() => {
            hideChangePasswordModal();
        }, 3000);
    } else {
        showChangePasswordError(result.message);
    }
}

// 显示修改密码错误
function showChangePasswordError(message) {
    changePasswordError.textContent = message;
    changePasswordError.classList.remove('hidden');
    changePasswordSuccess.classList.add('hidden');
}

// 显示修改密码成功
function showChangePasswordSuccess(message) {
    changePasswordSuccess.textContent = message;
    changePasswordSuccess.classList.remove('hidden');
    changePasswordError.classList.add('hidden');
}

// 加载文件登记表单
function loadFileRegistrationForm() {
    fileRegistrationForm.innerHTML = '';
    
    // 获取设置数据
    const fileTypes = getFileTypes();
    const departments = getDepartments();
    const units = getUnits();
    const paymentTypes = getPaymentTypes();
    const paymentProjects = getPaymentProjects();
    const paymentCompanies = getPaymentCompanies();
    
    // 创建表单内容
    const formContent = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="date" class="block text-sm font-medium text-gray-700 mb-1">日期 <span class="text-red-500">*</span></label>
                <input type="date" id="date" name="date" value="${getCurrentDate()}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
            </div>
            
            <div>
                <label for="fileType" class="block text-sm font-medium text-gray-700 mb-1">文件类型 <span class="text-red-500">*</span></label>
                <select id="fileType" name="fileType" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                    <option value="">请选择文件类型</option>
                    ${fileTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label for="department" class="block text-sm font-medium text-gray-700 mb-1">申请部门 <span class="text-red-500">*</span></label>
                <select id="department" name="department" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                    <option value="">请选择申请部门</option>
                    ${departments.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label for="applicant" class="block text-sm font-medium text-gray-700 mb-1">申请人 <span class="text-red-500">*</span></label>
                <input type="text" id="applicant" name="applicant" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入申请人姓名" required>
            </div>
        </div>
        
        <!-- 文件内容区域 -->
        <div class="mt-4">
            <div id="normal-content-section">
                <label for="content" class="block text-sm font-medium text-gray-700 mb-1">文件内容 <span class="text-red-500">*</span></label>
                <textarea id="content" name="content" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入文件内容" required></textarea>
            </div>
            
            <div id="summary-content-section" class="hidden">
                <h4 class="font-medium text-gray-700 mb-2">摘要信息</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="paymentOption" class="block text-sm font-medium text-gray-700 mb-1">支付/报销 <span class="text-red-500">*</span></label>
                        <select id="paymentOption" name="paymentOption" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                            <option value="支付">支付（单位）</option>
                            <option value="报销">报销（个人）</option>
                        </select>
                    </div>
                    
                    <div>
                        <label for="paymentProject" class="block text-sm font-medium text-gray-700 mb-1">支付项目 <span class="text-red-500">*</span></label>
                        <select id="paymentProject" name="paymentProject" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                            <option value="">请选择支付项目</option>
                            ${paymentProjects.map(project => `<option value="${project}">${project}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div id="other-project-container" class="hidden">
                        <label for="otherProject" class="block text-sm font-medium text-gray-700 mb-1">其他项目说明 <span class="text-red-500">*</span></label>
                        <input type="text" id="otherProject" name="otherProject" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入其他项目说明">
                    </div>
                    
                    <div>
                        <label for="paymentType" class="block text-sm font-medium text-gray-700 mb-1">支付类型 <span class="text-red-500">*</span></label>
                        <select id="paymentType" name="paymentType" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                            <option value="">请选择支付类型</option>
                            ${paymentTypes.map(type => `<option value="${type.name}" data-need-percentage="${type.needPercentage}">${type.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div id="percentage-container" class="hidden">
                        <label for="percentage" class="block text-sm font-medium text-gray-700 mb-1">百分比</label>
                        <input type="number" id="percentage" name="percentage" min="0" max="100" step="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="0-100">
                    </div>
                    
                    <div>
                        <label for="periodType" class="block text-sm font-medium text-gray-700 mb-1">期间类型</label>
                        <select id="periodType" name="periodType" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            <option value="single">单期间</option>
                            <option value="range">期间区间</option>
                        </select>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div id="single-period-container">
                        <label for="singlePeriod" class="block text-sm font-medium text-gray-700 mb-1">期间 <span class="text-red-500">*</span></label>
                        <input type="month" id="singlePeriod" name="singlePeriod" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                    
                    <div id="range-period-container" class="hidden">
                        <label for="startPeriod" class="block text-sm font-medium text-gray-700 mb-1">开始期间 <span class="text-red-500">*</span></label>
                        <input type="month" id="startPeriod" name="startPeriod" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                    
                    <div id="end-period-container" class="hidden md:col-span-2">
                        <label for="endPeriod" class="block text-sm font-medium text-gray-700 mb-1">结束期间 <span class="text-red-500">*</span></label>
                        <input type="month" id="endPeriod" name="endPeriod" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>
                    
                    <div>
                        <label for="paymentCompany" class="block text-sm font-medium text-gray-700 mb-1">付款单位简称 <span class="text-red-500">*</span></label>
                        <select id="paymentCompany" name="paymentCompany" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                            <option value="">请选择付款单位</option>
                            ${paymentCompanies.map(company => `<option value="${company}">${company}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div id="other-company-container" class="hidden">
                        <label for="otherCompany" class="block text-sm font-medium text-gray-700 mb-1">其他单位说明 <span class="text-red-500">*</span></label>
                        <input type="text" id="otherCompany" name="otherCompany" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入其他单位说明">
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 文件明细区域 -->
        <div class="mt-4" id="file-details-container">
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-700">文件明细</h4>
                <button type="button" id="add-detail-button" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition duration-200 text-sm">
                    <i class="fa fa-plus mr-1"></i> 添加明细
                </button>
            </div>
            
            <div id="file-detail-0" class="file-detail bg-gray-50 p-4 rounded-lg mb-2">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label for="unit-0" class="block text-sm font-medium text-gray-700 mb-1">计量单位 <span class="text-red-500">*</span></label>
                        <select id="unit-0" name="unit-0" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                            <option value="">请选择计量单位</option>
                            ${units.map(unit => `<option value="${unit}">${unit}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label for="quantity-0" class="block text-sm font-medium text-gray-700 mb-1">数量</label>
                        <input type="number" id="quantity-0" name="quantity-0" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入数量">
                    </div>
                    
                    <div>
                        <label for="amount-0" class="block text-sm font-medium text-gray-700 mb-1">金额</label>
                        <input type="number" id="amount-0" name="amount-0" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入金额">
                    </div>
                </div>
                
                <div id="other-unit-container-0" class="hidden mt-2">
                    <label for="otherUnit-0" class="block text-sm font-medium text-gray-700 mb-1">其他计量单位说明 <span class="text-red-500">*</span></label>
                    <input type="text" id="otherUnit-0" name="otherUnit-0" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入其他计量单位说明">
                </div>
            </div>
        </div>
        
        <!-- 表单操作按钮 -->
        <div class="mt-6 flex justify-end space-x-4">
            <button type="reset" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200">
                重置
            </button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                提交文件
            </button>
        </div>
    `;
    
    fileRegistrationForm.innerHTML = formContent;
    
    // 绑定文件类型变更事件
    const fileTypeSelect = document.getElementById('fileType');
    const normalContentSection = document.getElementById('normal-content-section');
    const summaryContentSection = document.getElementById('summary-content-section');
    
    fileTypeSelect.addEventListener('change', () => {
        const selectedType = fileTypeSelect.value;
        if (selectedType === '付款申请单' || selectedType === '付款单+用印审批（仅限验收报告）') {
            normalContentSection.classList.add('hidden');
            summaryContentSection.classList.remove('hidden');
        } else {
            normalContentSection.classList.remove('hidden');
            summaryContentSection.classList.add('hidden');
        }
    });
    
    // 绑定支付项目变更事件
    const paymentProjectSelect = document.getElementById('paymentProject');
    const otherProjectContainer = document.getElementById('other-project-container');
    
    paymentProjectSelect.addEventListener('change', () => {
        otherProjectContainer.classList.toggle('hidden', paymentProjectSelect.value !== '其他');
    });
    
    // 绑定支付类型变更事件
    const paymentTypeSelect = document.getElementById('paymentType');
    const percentageContainer = document.getElementById('percentage-container');
    
    paymentTypeSelect.addEventListener('change', () => {
        const selectedOption = paymentTypeSelect.options[paymentTypeSelect.selectedIndex];
        const needPercentage = selectedOption.getAttribute('data-need-percentage') === 'true';
        percentageContainer.classList.toggle('hidden', !needPercentage);
    });
    
    // 绑定期间类型变更事件
    const periodTypeSelect = document.getElementById('periodType');
    const singlePeriodContainer = document.getElementById('single-period-container');
    const rangePeriodContainer = document.getElementById('range-period-container');
    const endPeriodContainer = document.getElementById('end-period-container');
    
    periodTypeSelect.addEventListener('change', () => {
        if (periodTypeSelect.value === 'single') {
            singlePeriodContainer.classList.remove('hidden');
            rangePeriodContainer.classList.add('hidden');
            endPeriodContainer.classList.add('hidden');
        } else {
            singlePeriodContainer.classList.add('hidden');
            rangePeriodContainer.classList.remove('hidden');
            endPeriodContainer.classList.remove('hidden');
        }
    });
    
    // 绑定付款单位变更事件
    const paymentCompanySelect = document.getElementById('paymentCompany');
    const otherCompanyContainer = document.getElementById('other-company-container');
    
    paymentCompanySelect.addEventListener('change', () => {
        otherCompanyContainer.classList.toggle('hidden', paymentCompanySelect.value !== '其他');
    });
    
    // 绑定添加明细按钮事件
    const addDetailButton = document.getElementById('add-detail-button');
    const fileDetailsContainer = document.getElementById('file-details-container');
    let detailCount = 1;
    
    addDetailButton.addEventListener('click', () => {
        const newDetailId = `file-detail-${detailCount}`;
        const newDetail = `
            <div id="${newDetailId}" class="file-detail bg-gray-50 p-4 rounded-lg mb-2">
                <div class="flex justify-between items-start mb-2">
                    <h5 class="text-sm font-medium text-gray-700">明细 ${detailCount + 1}</h5>
                    <button type="button" class="remove-detail-button text-red-500 hover:text-red-700" data-id="${detailCount}">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label for="unit-${detailCount}" class="block text-sm font-medium text-gray-700 mb-1">计量单位 <span class="text-red-500">*</span></label>
                        <select id="unit-${detailCount}" name="unit-${detailCount}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                            <option value="">请选择计量单位</option>
                            ${units.map(unit => `<option value="${unit}">${unit}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label for="quantity-${detailCount}" class="block text-sm font-medium text-gray-700 mb-1">数量</label>
                        <input type="number" id="quantity-${detailCount}" name="quantity-${detailCount}" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入数量">
                    </div>
                    
                    <div>
                        <label for="amount-${detailCount}" class="block text-sm font-medium text-gray-700 mb-1">金额</label>
                        <input type="number" id="amount-${detailCount}" name="amount-${detailCount}" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入金额">
                    </div>
                </div>
                
                <div id="other-unit-container-${detailCount}" class="hidden mt-2">
                    <label for="otherUnit-${detailCount}" class="block text-sm font-medium text-gray-700 mb-1">其他计量单位说明 <span class="text-red-500">*</span></label>
                    <input type="text" id="otherUnit-${detailCount}" name="otherUnit-${detailCount}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入其他计量单位说明">
                </div>
            </div>
        `;
        
        fileDetailsContainer.insertAdjacentHTML('beforeend', newDetail);
        
        // 绑定新添加明细的删除按钮事件
        const removeButton = document.querySelector(`.remove-detail-button[data-id="${detailCount}"]`);
        removeButton.addEventListener('click', () => {
            document.getElementById(newDetailId).remove();
        });
        
        // 绑定计量单位变更事件
        const unitSelect = document.getElementById(`unit-${detailCount}`);
        const otherUnitContainer = document.getElementById(`other-unit-container-${detailCount}`);
        
        unitSelect.addEventListener('change', () => {
            otherUnitContainer.classList.toggle('hidden', unitSelect.value !== '其他');
        });
        
        detailCount++;
    });
    
    // 绑定第一个明细的计量单位变更事件
    const firstUnitSelect = document.getElementById('unit-0');
    const firstOtherUnitContainer = document.getElementById('other-unit-container-0');
    
    firstUnitSelect.addEventListener('change', () => {
        firstOtherUnitContainer.classList.toggle('hidden', firstUnitSelect.value !== '其他');
    });
}

// 处理文件登记
function handleFileRegistration() {
    // 获取表单数据
    const date = document.getElementById('date').value;
    const fileType = document.getElementById('fileType').value;
    const department = document.getElementById('department').value;
    const applicant = document.getElementById('applicant').value;
    
    // 获取文件内容
    let content = '';
    if (fileType === '付款申请单' || fileType === '付款单+用印审批（仅限验收报告）') {
        const paymentOption = document.getElementById('paymentOption').value;
        const paymentProject = document.getElementById('paymentProject').value;
        const otherProject = document.getElementById('otherProject').value;
        const paymentTypeName = document.getElementById('paymentType').value;
        const percentage = document.getElementById('percentage').value;
        const periodType = document.getElementById('periodType').value;
        const paymentCompany = document.getElementById('paymentCompany').value;
        const otherCompany = document.getElementById('otherCompany').value;
        
        // 获取支付类型对象
        const paymentTypes = getPaymentTypes();
        const paymentType = paymentTypes.find(type => type.name === paymentTypeName) || { name: paymentTypeName, needPercentage: false };
        
        // 处理期间
        let period = '';
        if (periodType === 'single') {
            const singlePeriod = document.getElementById('singlePeriod').value;
            if (singlePeriod) {
                const [year, month] = singlePeriod.split('-');
                period = `${year}年${month}月`;
            }
        } else {
            const startPeriod = document.getElementById('startPeriod').value;
            const endPeriod = document.getElementById('endPeriod').value;
            if (startPeriod && endPeriod) {
                const [startYear, startMonth] = startPeriod.split('-');
                const [endYear, endMonth] = endPeriod.split('-');
                period = `${startYear}年${startMonth}月-${endYear}年${endMonth}月`;
            }
        }
        
        // 处理公司名称
        let company = paymentCompany;
        if (paymentCompany === '其他' && otherCompany) {
            company = otherCompany;
        }
        
        // 生成摘要内容
        content = generateSummaryContent(
            paymentType,
            paymentProject === '其他' && otherProject ? otherProject : paymentProject,
            paymentOption,
            period,
            company,
            percentage
        );
    } else {
        content = document.getElementById('content').value;
    }
    
    // 获取文件明细
    const details = [];
    const detailElements = document.querySelectorAll('.file-detail');
    
    detailElements.forEach((detail, index) => {
        const unitSelect = document.getElementById(`unit-${index}`);
        let unit = unitSelect.value;
        
        // 如果选择其他计量单位，获取其他说明
        if (unit === '其他') {
            const otherUnit = document.getElementById(`otherUnit-${index}`).value;
            if (otherUnit) {
                unit = otherUnit;
            }
        }
        
        const quantity = document.getElementById(`quantity-${index}`).value || 0;
        const amount = document.getElementById(`amount-${index}`).value || 0;
        
        details.push({
            unit,
            quantity,
            amount
        });
    });
    
    // 验证文件数据
    const validation = validateFileData({ date, fileType, department, applicant, content });
    if (!validation.isValid) {
        showToast(validation.errors[0], 'error');
        return;
    }
    
    // 创建文件数据
    const fileData = {
        date,
        fileType,
        department,
        applicant,
        content,
        details
    };
    
    // 添加文件
    const newFile = addFile(fileData);
    
    if (newFile) {
        showToast('文件登记成功');
        // 重置表单
        fileRegistrationForm.reset();
        // 重新加载文件登记表单以恢复默认状态
        loadFileRegistrationForm();
    } else {
        showToast('文件登记失败，请重试', 'error');
    }
}

// 加载文件信息筛选条件
function loadFileInfoFilters() {
    fileInfoFilters.innerHTML = '';
    
    // 获取设置数据
    const fileTypes = getFileTypes();
    const departments = getDepartments();
    const sendStatuses = getSendStatuses();
    
    // 创建筛选表单
    const filtersContent = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label for="info-keyword" class="block text-sm font-medium text-gray-700 mb-1">关键词搜索</label>
                <input type="text" id="info-keyword" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入关键词">
            </div>
            
            <div>
                <label for="info-file-type" class="block text-sm font-medium text-gray-700 mb-1">文件类型</label>
                <select id="info-file-type" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="全部">全部</option>
                    ${fileTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label for="info-department" class="block text-sm font-medium text-gray-700 mb-1">申请部门</label>
                <select id="info-department" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="全部">全部</option>
                    ${departments.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label for="info-status" class="block text-sm font-medium text-gray-700 mb-1">送签状态</label>
                <select id="info-status" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="全部">全部</option>
                    ${sendStatuses.map(status => `<option value="${status}">${status}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label for="info-start-date" class="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                <input type="date" id="info-start-date" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            </div>
            
            <div>
                <label for="info-end-date" class="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
                <input type="date" id="info-end-date" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            </div>
        </div>
        
        <div class="mt-4 flex justify-end space-x-2">
            <button type="button" id="info-reset-filters" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg transition duration-200">
                重置
            </button>
            <button type="button" id="info-search" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition duration-200">
                <i class="fa fa-search mr-1"></i> 搜索
            </button>
        </div>
    `;
    
    fileInfoFilters.innerHTML = filtersContent;
    
    // 绑定搜索按钮事件
    const infoSearchButton = document.getElementById('info-search');
    infoSearchButton.addEventListener('click', loadFileInfoList);
    
    // 绑定重置按钮事件
    const infoResetFiltersButton = document.getElementById('info-reset-filters');
    infoResetFiltersButton.addEventListener('click', () => {
        document.getElementById('info-keyword').value = '';
        document.getElementById('info-file-type').value = '全部';
        document.getElementById('info-department').value = '全部';
        document.getElementById('info-status').value = '全部';
        document.getElementById('info-start-date').value = '';
        document.getElementById('info-end-date').value = '';
        loadFileInfoList();
    });
}

// 加载文件信息列表
function loadFileInfoList() {
    // 获取筛选条件
    const keyword = document.getElementById('info-keyword').value.trim();
    const fileType = document.getElementById('info-file-type').value;
    const department = document.getElementById('info-department').value;
    const status = document.getElementById('info-status').value;
    const startDate = document.getElementById('info-start-date').value;
    const endDate = document.getElementById('info-end-date').value;
    
    // 构建筛选条件对象
    const filters = {
        keyword,
        fileType: fileType === '全部' ? '' : fileType,
        department: department === '全部' ? '' : department,
        sendStatus: status === '全部' ? '' : status,
        startDate,
        endDate
    };
    
    // 搜索文件
    const files = searchFiles(filters);
    
    // 创建表头
    fileInfoHeader.innerHTML = `
        <th>日期</th>
        <th>文件类型</th>
        <th>文件编号</th>
        <th>申请部门</th>
        <th>申请人</th>
        <th>文件内容</th>
        <th>计量单位</th>
        <th>数量</th>
        <th>金额</th>
        <th>结束日期</th>
        <th>送签状态</th>
        <th>状态更新时间</th>
        <th>退回原因</th>
    `;
    
    // 创建表格内容
    fileInfoBody.innerHTML = '';
    
    if (files.length === 0) {
        fileInfoBody.innerHTML = `
            <tr>
                <td colspan="13" class="text-center py-4 text-gray-500">暂无数据</td>
            </tr>
        `;
        return;
    }
    
    files.forEach(file => {
        // 处理明细数据，合并显示
        let units = [];
        let quantities = [];
        let amounts = [];
        
        if (file.details && Array.isArray(file.details)) {
            file.details.forEach(detail => {
                units.push(detail.unit || '-');
                quantities.push(detail.quantity || 0);
                amounts.push(detail.amount || 0);
            });
        } else {
            // 兼容旧数据格式
            units.push(file.unit || '-');
            quantities.push(file.quantity || 0);
            amounts.push(file.amount || 0);
        }
        
        // 格式化数量，0值显示为'/'
        const formattedQuantities = quantities.map(q => parseFloat(q) === 0 ? '/' : q).join('<br>');
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${file.date ? formatDate(file.date, 'YYYY-MM-DD') : '-'}</td>
            <td>${file.fileType || '-'}</td>
            <td>${file.fileNumber || '-'}</td>
            <td>${file.department || '-'}</td>
            <td>${file.applicant || '-'}</td>
            <td class="max-w-xs truncate" title="${file.content || ''}">${file.content || '-'}</td>
            <td>${units.join('<br>')}</td>
            <td>${formattedQuantities}</td>
            <td>${amounts.join('<br>')}</td>
            <td>${file.endDate ? formatDate(file.endDate, 'YYYY-MM-DD') : '-'}</td>
            <td>
                <span class="tag ${getStatusTagClass(file.sendStatus)}">${file.sendStatus || '-'}</span>
            </td>
            <td>${file.sendStatusUpdateTime ? formatDate(file.sendStatusUpdateTime, 'YYYY-MM-DD HH:mm:ss') : '-'}</td>
            <td class="max-w-xs truncate" title="${file.rejectReason || ''}">${file.rejectReason || '-'}</td>
        `;
        
        fileInfoBody.appendChild(row);
    });
}

// 获取状态标签样式类
function getStatusTagClass(status) {
    const statusClasses = {
        '完毕': 'tag-success',
        '退回': 'tag-danger',
        '作废': 'tag-danger',
        '未处理': 'tag-info',
        '总秘（酒店总经理）': 'tag-warning',
        '待送集团': 'tag-warning',
        '业主代表': 'tag-warning',
        '陆总及彭总（盖章处）': 'tag-warning',
        '集团审核': 'tag-warning',
        '集团经理待签': 'tag-warning',
        '未盖章': 'tag-warning',
        '重签': 'tag-warning',
        '资产管理部': 'tag-warning',
        '招采办': 'tag-warning',
        '酒店内部走签': 'tag-warning',
        '急单': 'tag-warning',
        '已签未付': 'tag-warning'
    };
    
    return statusClasses[status] || 'tag-primary';
}

// 加载文件处理筛选条件
function loadFileProcessingFilters() {
    fileProcessingFilters.innerHTML = '';
    
    // 获取设置数据
    const fileTypes = getFileTypes();
    const departments = getDepartments();
    const sendStatuses = getSendStatuses();
    
    // 创建筛选表单
    const filtersContent = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label for="processing-keyword" class="block text-sm font-medium text-gray-700 mb-1">关键词搜索</label>
                <input type="text" id="processing-keyword" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入关键词">
            </div>
            
            <div>
                <label for="processing-file-type" class="block text-sm font-medium text-gray-700 mb-1">文件类型</label>
                <select id="processing-file-type" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="全部">全部</option>
                    ${fileTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label for="processing-department" class="block text-sm font-medium text-gray-700 mb-1">申请部门</label>
                <select id="processing-department" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="全部">全部</option>
                    ${departments.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label for="processing-status" class="block text-sm font-medium text-gray-700 mb-1">送签状态</label>
                <select id="processing-status" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="全部">全部</option>
                    ${sendStatuses.map(status => `<option value="${status}">${status}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label for="processing-start-date" class="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                <input type="date" id="processing-start-date" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            </div>
            
            <div>
                <label for="processing-end-date" class="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
                <input type="date" id="processing-end-date" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            </div>
        </div>
        
        <div class="mt-4 flex justify-end space-x-2">
            <button type="button" id="processing-reset-filters" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg transition duration-200">
                重置
            </button>
            <button type="button" id="processing-search" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition duration-200">
                <i class="fa fa-search mr-1"></i> 搜索
            </button>
        </div>
    `;
    
    fileProcessingFilters.innerHTML = filtersContent;
    
    // 绑定搜索按钮事件
    const processingSearchButton = document.getElementById('processing-search');
    processingSearchButton.addEventListener('click', loadFileProcessingList);
    
    // 绑定重置按钮事件
    const processingResetFiltersButton = document.getElementById('processing-reset-filters');
    processingResetFiltersButton.addEventListener('click', () => {
        document.getElementById('processing-keyword').value = '';
        document.getElementById('processing-file-type').value = '全部';
        document.getElementById('processing-department').value = '全部';
        document.getElementById('processing-status').value = '全部';
        document.getElementById('processing-start-date').value = '';
        document.getElementById('processing-end-date').value = '';
        loadFileProcessingList();
    });
}

// 加载文件处理批量操作按钮
function loadFileProcessingBatchActions() {
    if (!checkPermission('canBatchProcess')) {
        fileProcessingBatchActions.innerHTML = '';
        return;
    }
    
    // 获取送签状态
    const sendStatuses = getSendStatuses();
    
    fileProcessingBatchActions.innerHTML = `
        <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex flex-col md:flex-row md:items-center gap-4">
                <div class="flex items-center">
                    <input type="checkbox" id="select-all" class="mr-2">
                    <label for="select-all" class="text-sm font-medium text-gray-700">全选</label>
                </div>
                
                <div class="flex flex-col md:flex-row gap-2 flex-grow">
                    <select id="batch-status" class="px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="">请选择送签状态</option>
                        ${sendStatuses.map(status => `<option value="${status}">${status}</option>`).join('')}
                    </select>
                    
                    <div id="batch-reject-reason-container" class="hidden w-full">
                        <input type="text" id="batch-reject-reason" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入退回原因">
                    </div>
                    
                    <button type="button" id="batch-update-status" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition duration-200">
                        批量更新状态
                    </button>
                </div>
                
                <button type="button" id="batch-delete" class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition duration-200">
                    <i class="fa fa-trash mr-1"></i> 批量删除
                </button>
            </div>
        </div>
    `;
    
    // 绑定全选按钮事件
    const selectAllCheckbox = document.getElementById('select-all');
    selectAllCheckbox.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('input[name="file-checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });
    
    // 绑定批量更新状态按钮事件
    const batchUpdateStatusButton = document.getElementById('batch-update-status');
    batchUpdateStatusButton.addEventListener('click', handleBatchUpdateStatus);
    
    // 绑定批量删除按钮事件
    const batchDeleteButton = document.getElementById('batch-delete');
    batchDeleteButton.addEventListener('click', handleBatchDelete);
    
    // 绑定批量状态选择变更事件
    const batchStatusSelect = document.getElementById('batch-status');
    const batchRejectReasonContainer = document.getElementById('batch-reject-reason-container');
    
    batchStatusSelect.addEventListener('change', () => {
        batchRejectReasonContainer.classList.toggle('hidden', batchStatusSelect.value !== '退回');
    });
}

// 处理批量更新状态
function handleBatchUpdateStatus() {
    const batchStatusSelect = document.getElementById('batch-status');
    const selectedStatus = batchStatusSelect.value;
    
    if (!selectedStatus) {
        showToast('请选择送签状态', 'error');
        return;
    }
    
    // 获取选中的文件ID
    const selectedFileIds = [];
    const checkboxes = document.querySelectorAll('input[name="file-checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        selectedFileIds.push(checkbox.value);
    });
    
    if (selectedFileIds.length === 0) {
        showToast('请至少选择一条记录', 'error');
        return;
    }
    
    // 获取退回原因（如果状态是退回）
    let rejectReason = null;
    if (selectedStatus === '退回') {
        rejectReason = document.getElementById('batch-reject-reason').value.trim();
        if (!rejectReason) {
            showToast('请输入退回原因', 'error');
            return;
        }
    }
    
    // 批量更新状态
    const result = batchUpdateSendStatus(selectedFileIds, selectedStatus, rejectReason);
    
    if (result.success) {
        showToast(result.message);
        loadFileProcessingList();
        // 重置全选框
        document.getElementById('select-all').checked = false;
    } else {
        showToast(result.message, 'error');
    }
}

// 处理批量删除
function handleBatchDelete() {
    // 获取选中的文件ID
    const selectedFileIds = [];
    const checkboxes = document.querySelectorAll('input[name="file-checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        selectedFileIds.push(checkbox.value);
    });
    
    if (selectedFileIds.length === 0) {
        showToast('请至少选择一条记录', 'error');
        return;
    }
    
    if (confirm(`确定要删除选中的 ${selectedFileIds.length} 条记录吗？此操作不可恢复！`)) {
        // 批量删除
        const result = batchDeleteFiles(selectedFileIds);
        
        if (result.success) {
            showToast(result.message);
            loadFileProcessingList();
            // 重置全选框
            document.getElementById('select-all').checked = false;
        } else {
            showToast(result.message, 'error');
        }
    }
}

// 加载文件处理列表
function loadFileProcessingList() {
    // 获取筛选条件
    const keyword = document.getElementById('processing-keyword').value.trim();
    const fileType = document.getElementById('processing-file-type').value;
    const department = document.getElementById('processing-department').value;
    const status = document.getElementById('processing-status').value;
    const startDate = document.getElementById('processing-start-date').value;
    const endDate = document.getElementById('processing-end-date').value;
    
    // 构建筛选条件对象
    const filters = {
        keyword,
        fileType: fileType === '全部' ? '' : fileType,
        department: department === '全部' ? '' : department,
        sendStatus: status === '全部' ? '' : status,
        startDate,
        endDate
    };
    
    // 搜索文件
    const files = searchFiles(filters);
    
    // 创建表头
    fileProcessingHeader.innerHTML = `
        <th><input type="checkbox" id="select-all-processing" class="mr-2"></th>
        <th>日期</th>
        <th>文件类型</th>
        <th>文件编号</th>
        <th>申请部门</th>
        <th>申请人</th>
        <th>文件内容</th>
        <th>计量单位</th>
        <th>数量</th>
        <th>金额</th>
        <th>结束日期</th>
        <th>送签状态</th>
        <th>操作</th>
    `;
    
    // 创建表格内容
    fileProcessingBody.innerHTML = '';
    
    if (files.length === 0) {
        fileProcessingBody.innerHTML = `
            <tr>
                <td colspan="13" class="text-center py-4 text-gray-500">暂无数据</td>
            </tr>
        `;
        return;
    }
    
    files.forEach(file => {
        // 处理明细数据，合并显示
        let units = [];
        let quantities = [];
        let amounts = [];
        
        if (file.details && Array.isArray(file.details)) {
            file.details.forEach(detail => {
                units.push(detail.unit || '-');
                quantities.push(detail.quantity || 0);
                amounts.push(detail.amount || 0);
            });
        } else {
            // 兼容旧数据格式
            units.push(file.unit || '-');
            quantities.push(file.quantity || 0);
            amounts.push(file.amount || 0);
        }
        
        // 格式化数量，0值显示为'/'
        const formattedQuantities = quantities.map(q => parseFloat(q) === 0 ? '/' : q).join('<br>');
        
        // 构建操作按钮
        let actionButtons = '';
        if (checkPermission('canDeleteFiles')) {
            actionButtons = `
                <div class="flex space-x-1">
                    <button type="button" class="edit-file-btn bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs" data-id="${file.id}">
                        <i class="fa fa-pencil mr-1"></i> 编辑
                    </button>
                    <button type="button" class="delete-file-btn bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs" data-id="${file.id}">
                        <i class="fa fa-trash mr-1"></i> 删除
                    </button>
                </div>
            `;
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" name="file-checkbox" value="${file.id}"></td>
            <td>${file.date ? formatDate(file.date, 'YYYY-MM-DD') : '-'}</td>
            <td>${file.fileType || '-'}</td>
            <td>${file.fileNumber || '-'}</td>
            <td>${file.department || '-'}</td>
            <td>${file.applicant || '-'}</td>
            <td class="max-w-xs truncate" title="${file.content || ''}">${file.content || '-'}</td>
            <td>${units.join('<br>')}</td>
            <td>${formattedQuantities}</td>
            <td>${amounts.join('<br>')}</td>
            <td>${file.endDate ? formatDate(file.endDate, 'YYYY-MM-DD') : '-'}</td>
            <td>
                <span class="tag ${getStatusTagClass(file.sendStatus)}">${file.sendStatus || '-'}</span>
            </td>
            <td>${actionButtons}</td>
        `;
        
        fileProcessingBody.appendChild(row);
    });
    
    // 绑定编辑按钮事件
    document.querySelectorAll('.edit-file-btn').forEach(button => {
        button.addEventListener('click', () => {
            const fileId = button.getAttribute('data-id');
            showEditFileModal(fileId);
        });
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-file-btn').forEach(button => {
        button.addEventListener('click', () => {
            const fileId = button.getAttribute('data-id');
            handleDeleteFile(fileId);
        });
    });
    
    // 绑定全选按钮事件
    const selectAllCheckbox = document.getElementById('select-all-processing');
    selectAllCheckbox.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('input[name="file-checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });
}

// 显示编辑文件弹窗
function showEditFileModal(fileId) {
    const file = getFileById(fileId);
    if (!file) {
        showToast('文件不存在', 'error');
        return;
    }
    
    // 获取设置数据
    const fileTypes = getFileTypes();
    const departments = getDepartments();
    const units = getUnits();
    const sendStatuses = getSendStatuses();
    
    // 处理明细数据
    let detailsHtml = '';
    if (file.details && Array.isArray(file.details)) {
        file.details.forEach((detail, index) => {
            detailsHtml += `
                <div class="file-detail bg-gray-50 p-4 rounded-lg mb-2">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label for="edit-unit-${index}" class="block text-sm font-medium text-gray-700 mb-1">计量单位 <span class="text-red-500">*</span></label>
                            <select id="edit-unit-${index}" name="edit-unit-${index}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                                <option value="">请选择计量单位</option>
                                ${units.map(unit => `<option value="${unit}" ${unit === detail.unit ? 'selected' : ''}>${unit}</option>`).join('')}
                            </select>
                        </div>
                        
                        <div>
                            <label for="edit-quantity-${index}" class="block text-sm font-medium text-gray-700 mb-1">数量</label>
                            <input type="number" id="edit-quantity-${index}" name="edit-quantity-${index}" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg" value="${detail.quantity || ''}" placeholder="请输入数量">
                        </div>
                        
                        <div>
                            <label for="edit-amount-${index}" class="block text-sm font-medium text-gray-700 mb-1">金额</label>
                            <input type="number" id="edit-amount-${index}" name="edit-amount-${index}" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg" value="${detail.amount || ''}" placeholder="请输入金额">
                        </div>
                    </div>
                    
                    <div id="edit-other-unit-container-${index}" class="hidden mt-2">
                        <label for="edit-otherUnit-${index}" class="block text-sm font-medium text-gray-700 mb-1">其他计量单位说明 <span class="text-red-500">*</span></label>
                        <input type="text" id="edit-otherUnit-${index}" name="edit-otherUnit-${index}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入其他计量单位说明">
                    </div>
                </div>
            `;
        });
    } else {
        // 兼容旧数据格式
        detailsHtml = `
            <div class="file-detail bg-gray-50 p-4 rounded-lg mb-2">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label for="edit-unit-0" class="block text-sm font-medium text-gray-700 mb-1">计量单位 <span class="text-red-500">*</span></label>
                        <select id="edit-unit-0" name="edit-unit-0" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                            <option value="">请选择计量单位</option>
                            ${units.map(unit => `<option value="${unit}" ${unit === file.unit ? 'selected' : ''}>${unit}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label for="edit-quantity-0" class="block text-sm font-medium text-gray-700 mb-1">数量</label>
                        <input type="number" id="edit-quantity-0" name="edit-quantity-0" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg" value="${file.quantity || ''}" placeholder="请输入数量">
                    </div>
                    
                    <div>
                        <label for="edit-amount-0" class="block text-sm font-medium text-gray-700 mb-1">金额</label>
                        <input type="number" id="edit-amount-0" name="edit-amount-0" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg" value="${file.amount || ''}" placeholder="请输入金额">
                    </div>
                </div>
                
                <div id="edit-other-unit-container-0" class="hidden mt-2">
                    <label for="edit-otherUnit-0" class="block text-sm font-medium text-gray-700 mb-1">其他计量单位说明 <span class="text-red-500">*</span></label>
                    <input type="text" id="edit-otherUnit-0" name="edit-otherUnit-0" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入其他计量单位说明">
                </div>
            </div>
        `;
    }
    
    // 填充编辑文件表单
    editFileForm.innerHTML = `
        <input type="hidden" id="edit-file-id" value="${fileId}">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="edit-date" class="block text-sm font-medium text-gray-700 mb-1">日期 <span class="text-red-500">*</span></label>
                <input type="date" id="edit-date" name="edit-date" value="${file.date || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
            </div>
            
            <div>
                <label for="edit-fileType" class="block text-sm font-medium text-gray-700 mb-1">文件类型 <span class="text-red-500">*</span></label>
                <select id="edit-fileType" name="edit-fileType" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                    <option value="">请选择文件类型</option>
                    ${fileTypes.map(type => `<option value="${type}" ${type === file.fileType ? 'selected' : ''}>${type}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label for="edit-fileNumber" class="block text-sm font-medium text-gray-700 mb-1">文件编号</label>
                <input type="text" id="edit-fileNumber" name="edit-fileNumber" value="${file.fileNumber || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入文件编号">
            </div>
            
            <div>
                <label for="edit-department" class="block text-sm font-medium text-gray-700 mb-1">申请部门 <span class="text-red-500">*</span></label>
                <select id="edit-department" name="edit-department" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                    <option value="">请选择申请部门</option>
                    ${departments.map(dept => `<option value="${dept}" ${dept === file.department ? 'selected' : ''}>${dept}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label for="edit-applicant" class="block text-sm font-medium text-gray-700 mb-1">申请人 <span class="text-red-500">*</span></label>
                <input type="text" id="edit-applicant" name="edit-applicant" value="${file.applicant || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入申请人姓名" required>
            </div>
            
            <div>
                <label for="edit-sendStatus" class="block text-sm font-medium text-gray-700 mb-1">送签状态</label>
                <select id="edit-sendStatus" name="edit-sendStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="">请选择送签状态</option>
                    ${sendStatuses.map(status => `<option value="${status}" ${status === file.sendStatus ? 'selected' : ''}>${status}</option>`).join('')}
                </select>
            </div>
            
            <div id="edit-reject-reason-container" class="md:col-span-2 hidden">
                <label for="edit-rejectReason" class="block text-sm font-medium text-gray-700 mb-1">退回原因</label>
                <input type="text" id="edit-rejectReason" name="edit-rejectReason" value="${file.rejectReason || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入退回原因">
            </div>
        </div>
        
        <div class="mt-4">
            <label for="edit-content" class="block text-sm font-medium text-gray-700 mb-1">文件内容 <span class="text-red-500">*</span></label>
            <textarea id="edit-content" name="edit-content" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入文件内容" required>${file.content || ''}</textarea>
        </div>
        
        <!-- 文件明细区域 -->
        <div class="mt-4">
            <h4 class="font-medium text-gray-700 mb-2">文件明细</h4>
            <div id="edit-file-details-container">
                ${detailsHtml}
            </div>
        </div>
        
        <!-- 表单操作按钮 -->
        <div class="mt-6 flex justify-end space-x-4">
            <button type="button" id="cancel-edit-file" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200">
                取消
            </button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                保存修改
            </button>
        </div>
    `;
    
    // 显示弹窗
    editFileModal.classList.remove('hidden');
    
    // 绑定取消按钮事件
    const cancelEditButton = document.getElementById('cancel-edit-file');
    cancelEditButton.addEventListener('click', hideEditFileModal);
    
    // 绑定送签状态变更事件
    const editSendStatusSelect = document.getElementById('edit-sendStatus');
    const editRejectReasonContainer = document.getElementById('edit-reject-reason-container');
    
    editSendStatusSelect.addEventListener('change', () => {
        editRejectReasonContainer.classList.toggle('hidden', editSendStatusSelect.value !== '退回');
    });
    
    // 初始化时检查是否显示退回原因
    if (editSendStatusSelect.value === '退回') {
        editRejectReasonContainer.classList.remove('hidden');
    }
    
    // 绑定计量单位变更事件
    const unitSelects = document.querySelectorAll('[id^="edit-unit-"]');
    unitSelects.forEach((select, index) => {
        const otherUnitContainer = document.getElementById(`edit-other-unit-container-${index}`);
        
        select.addEventListener('change', () => {
            otherUnitContainer.classList.toggle('hidden', select.value !== '其他');
        });
        
        // 初始化时检查是否显示其他计量单位说明
        if (select.value === '其他') {
            otherUnitContainer.classList.remove('hidden');
        }
    });
}

// 隐藏编辑文件弹窗
function hideEditFileModal() {
    editFileModal.classList.add('hidden');
}

// 根据ID获取文件
function getFileById(fileId) {
    const files = getAllFiles();
    return files.find(file => file.id === fileId);
}

// 处理编辑文件提交
function handleEditFileSubmit() {
    const fileId = document.getElementById('edit-file-id').value;
    const date = document.getElementById('edit-date').value;
    const fileType = document.getElementById('edit-fileType').value;
    const fileNumber = document.getElementById('edit-fileNumber').value;
    const department = document.getElementById('edit-department').value;
    const applicant = document.getElementById('edit-applicant').value;
    const content = document.getElementById('edit-content').value;
    const sendStatus = document.getElementById('edit-sendStatus').value;
    const rejectReason = document.getElementById('edit-rejectReason') ? document.getElementById('edit-rejectReason').value : '';
    
    // 获取文件明细
    const details = [];
    let detailIndex = 0;
    let unitSelect = document.getElementById(`edit-unit-${detailIndex}`);
    
    while (unitSelect) {
        let unit = unitSelect.value;
        
        // 如果选择其他计量单位，获取其他说明
        if (unit === '其他') {
            const otherUnit = document.getElementById(`edit-otherUnit-${detailIndex}`).value;
            if (otherUnit) {
                unit = otherUnit;
            }
        }
        
        const quantity = document.getElementById(`edit-quantity-${detailIndex}`).value || 0;
        const amount = document.getElementById(`edit-amount-${detailIndex}`).value || 0;
        
        details.push({
            unit,
            quantity,
            amount
        });
        
        detailIndex++;
        unitSelect = document.getElementById(`edit-unit-${detailIndex}`);
    }
    
    // 验证文件数据
    const validation = validateFileData({ date, fileType, department, applicant, content });
    if (!validation.isValid) {
        showEditFileError(validation.errors[0]);
        return;
    }
    
    // 创建更新的文件数据
    const updatedFileData = {
        date,
        fileType,
        fileNumber,
        department,
        applicant,
        content,
        sendStatus,
        rejectReason,
        details
    };
    
    // 更新文件
    const result = updateFile(fileId, updatedFileData);
    
    if (result.success) {
        showToast('文件更新成功');
        hideEditFileModal();
        loadFileProcessingList();
    } else {
        showEditFileError(result.message);
    }
}

// 显示编辑文件错误
function showEditFileError(message) {
    editFileError.textContent = message;
    editFileError.classList.remove('hidden');
    setTimeout(() => {
        editFileError.classList.add('hidden');
    }, 3000);
}

// 处理删除文件
function handleDeleteFile(fileId) {
    if (confirm('确定要删除此文件信息吗？此操作不可恢复！')) {
        const result = deleteFile(fileId);
        
        if (result.success) {
            showToast(result.message);
            loadFileProcessingList();
        } else {
            showToast(result.message, 'error');
        }
    }
}

// 处理导出Excel
function handleExportToExcel() {
    // 获取筛选条件
    const keyword = document.getElementById('processing-keyword').value.trim();
    const fileType = document.getElementById('processing-file-type').value;
    const department = document.getElementById('processing-department').value;
    const status = document.getElementById('processing-status').value;
    const startDate = document.getElementById('processing-start-date').value;
    const endDate = document.getElementById('processing-end-date').value;
    
    // 构建筛选条件对象
    const filters = {
        keyword,
        fileType: fileType === '全部' ? '' : fileType,
        department: department === '全部' ? '' : department,
        sendStatus: status === '全部' ? '' : status,
        startDate,
        endDate
    };
    
    // 导出文件
    const result = exportFilesToExcel(filters);
    
    if (!result.success) {
        showToast(result.message, 'error');
    }
}

// 加载系统设置
function loadSystemSettings() {
    if (!checkPermission('canAccessSettings')) {
        systemSettingsPage.innerHTML = '<div class="text-center py-8 text-gray-500">您没有权限访问此页面</div>';
        return;
    }
    
    // 加载文件类型设置
    loadFileTypeSettings();
    
    // 加载部门设置
    loadDepartmentSettings();
    
    // 加载计量单位设置
    loadUnitSettings();
    
    // 加载送签状态设置
    loadStatusSettings();
    
    // 加载付款单位简称设置
    loadCompanySettings();
    
    // 加载支付类型设置
    loadPaymentTypeSettings();
}

// 加载文件类型设置
function loadFileTypeSettings() {
    const fileTypes = getFileTypes();
    
    let fileTypesHtml = '';
    if (fileTypes.length === 0) {
        fileTypesHtml = '<div class="text-center py-4 text-gray-500">暂无数据</div>';
    } else {
        fileTypesHtml = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">文件类型</th>
                        <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">操作</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${fileTypes.map(type => `
                        <tr>
                            <td class="px-4 py-2">${type}</td>
                            <td class="px-4 py-2 text-right">
                                <button type="button" class="delete-file-type-btn text-red-500 hover:text-red-700" data-type="${type}">
                                    <i class="fa fa-trash"></i> 删除
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    fileTypeSettings.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-4">文件类型设置</h3>
            
            <div class="flex mb-4">
                <input type="text" id="new-file-type" class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg" placeholder="请输入新的文件类型">
                <button type="button" id="add-file-type" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition duration-200">
                    添加
                </button>
            </div>
            
            <div class="overflow-x-auto">
                ${fileTypesHtml}
            </div>
        </div>
    `;
    
    // 绑定添加按钮事件
    const addFileTypeButton = document.getElementById('add-file-type');
    addFileTypeButton.addEventListener('click', () => {
        const newFileType = document.getElementById('new-file-type').value.trim();
        if (newFileType) {
            const result = addFileType(newFileType);
            if (result.success) {
                showToast(result.message);
                document.getElementById('new-file-type').value = '';
                loadFileTypeSettings();
            } else {
                showToast(result.message, 'error');
            }
        } else {
            showToast('请输入文件类型', 'error');
        }
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-file-type-btn').forEach(button => {
        button.addEventListener('click', () => {
            const fileType = button.getAttribute('data-type');
            if (confirm(`确定要删除文件类型 "${fileType}" 吗？`)) {
                const result = removeFileType(fileType);
                if (result.success) {
                    showToast(result.message);
                    loadFileTypeSettings();
                } else {
                    showToast(result.message, 'error');
                }
            }
        });
    });
}

// 加载部门设置
function loadDepartmentSettings() {
    const departments = getDepartments();
    
    let departmentsHtml = '';
    if (departments.length === 0) {
        departmentsHtml = '<div class="text-center py-4 text-gray-500">暂无数据</div>';
    } else {
        departmentsHtml = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">部门名称</th>
                        <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">操作</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${departments.map(dept => `
                        <tr>
                            <td class="px-4 py-2">${dept}</td>
                            <td class="px-4 py-2 text-right">
                                <button type="button" class="delete-department-btn text-red-500 hover:text-red-700" data-dept="${dept}">
                                    <i class="fa fa-trash"></i> 删除
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    departmentSettings.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-4">申请部门设置</h3>
            
            <div class="flex mb-4">
                <input type="text" id="new-department" class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg" placeholder="请输入新的部门名称">
                <button type="button" id="add-department" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition duration-200">
                    添加
                </button>
            </div>
            
            <div class="overflow-x-auto">
                ${departmentsHtml}
            </div>
        </div>
    `;
    
    // 绑定添加按钮事件
    const addDepartmentButton = document.getElementById('add-department');
    addDepartmentButton.addEventListener('click', () => {
        const newDepartment = document.getElementById('new-department').value.trim();
        if (newDepartment) {
            const result = addDepartment(newDepartment);
            if (result.success) {
                showToast(result.message);
                document.getElementById('new-department').value = '';
                loadDepartmentSettings();
            } else {
                showToast(result.message, 'error');
            }
        } else {
            showToast('请输入部门名称', 'error');
        }
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-department-btn').forEach(button => {
        button.addEventListener('click', () => {
            const department = button.getAttribute('data-dept');
            if (confirm(`确定要删除部门 "${department}" 吗？`)) {
                const result = removeDepartment(department);
                if (result.success) {
                    showToast(result.message);
                    loadDepartmentSettings();
                } else {
                    showToast(result.message, 'error');
                }
            }
        });
    });
}

// 加载计量单位设置
function loadUnitSettings() {
    const units = getUnits();
    
    let unitsHtml = '';
    if (units.length === 0) {
        unitsHtml = '<div class="text-center py-4 text-gray-500">暂无数据</div>';
    } else {
        unitsHtml = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">计量单位</th>
                        <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">操作</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${units.map(unit => `
                        <tr>
                            <td class="px-4 py-2">${unit}</td>
                            <td class="px-4 py-2 text-right">
                                <button type="button" class="delete-unit-btn text-red-500 hover:text-red-700" data-unit="${unit}">
                                    <i class="fa fa-trash"></i> 删除
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    unitSettings.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-4">计量单位设置</h3>
            
            <div class="flex mb-4">
                <input type="text" id="new-unit" class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg" placeholder="请输入新的计量单位">
                <button type="button" id="add-unit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition duration-200">
                    添加
                </button>
            </div>
            
            <div class="overflow-x-auto">
                ${unitsHtml}
            </div>
        </div>
    `;
    
    // 绑定添加按钮事件
    const addUnitButton = document.getElementById('add-unit');
    addUnitButton.addEventListener('click', () => {
        const newUnit = document.getElementById('new-unit').value.trim();
        if (newUnit) {
            const result = addUnit(newUnit);
            if (result.success) {
                showToast(result.message);
                document.getElementById('new-unit').value = '';
                loadUnitSettings();
            } else {
                showToast(result.message, 'error');
            }
        } else {
            showToast('请输入计量单位', 'error');
        }
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-unit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const unit = button.getAttribute('data-unit');
            if (confirm(`确定要删除计量单位 "${unit}" 吗？`)) {
                const result = removeUnit(unit);
                if (result.success) {
                    showToast(result.message);
                    loadUnitSettings();
                } else {
                    showToast(result.message, 'error');
                }
            }
        });
    });
}

// 加载送签状态设置
function loadStatusSettings() {
    const statuses = getSendStatuses();
    
    let statusesHtml = '';
    if (statuses.length === 0) {
        statusesHtml = '<div class="text-center py-4 text-gray-500">暂无数据</div>';
    } else {
        statusesHtml = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">送签状态</th>
                        <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">操作</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${statuses.map(status => `
                        <tr>
                            <td class="px-4 py-2">${status}</td>
                            <td class="px-4 py-2 text-right">
                                <button type="button" class="delete-status-btn text-red-500 hover:text-red-700" data-status="${status}">
                                    <i class="fa fa-trash"></i> 删除
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    statusSettings.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-4">送签状态设置</h3>
            
            <div class="flex mb-4">
                <input type="text" id="new-status" class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg" placeholder="请输入新的送签状态">
                <button type="button" id="add-status" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition duration-200">
                    添加
                </button>
            </div>
            
            <div class="overflow-x-auto">
                ${statusesHtml}
            </div>
        </div>
    `;
    
    // 绑定添加按钮事件
    const addStatusButton = document.getElementById('add-status');
    addStatusButton.addEventListener('click', () => {
        const newStatus = document.getElementById('new-status').value.trim();
        if (newStatus) {
            const result = addSendStatus(newStatus);
            if (result.success) {
                showToast(result.message);
                document.getElementById('new-status').value = '';
                loadStatusSettings();
            } else {
                showToast(result.message, 'error');
            }
        } else {
            showToast('请输入送签状态', 'error');
        }
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-status-btn').forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute('data-status');
            if (confirm(`确定要删除送签状态 "${status}" 吗？`)) {
                const result = removeSendStatus(status);
                if (result.success) {
                    showToast(result.message);
                    loadStatusSettings();
                } else {
                    showToast(result.message, 'error');
                }
            }
        });
    });
}

// 加载付款单位简称设置
function loadCompanySettings() {
    const companies = getPaymentCompanies();
    
    let companiesHtml = '';
    if (companies.length === 0) {
        companiesHtml = '<div class="text-center py-4 text-gray-500">暂无数据</div>';
    } else {
        companiesHtml = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">付款单位简称</th>
                        <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">操作</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${companies.map(company => `
                        <tr>
                            <td class="px-4 py-2">${company}</td>
                            <td class="px-4 py-2 text-right">
                                <button type="button" class="delete-company-btn text-red-500 hover:text-red-700" data-company="${company}">
                                    <i class="fa fa-trash"></i> 删除
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    companySettings.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-4">付款单位简称设置</h3>
            
            <div class="flex mb-4">
                <input type="text" id="new-company" class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg" placeholder="请输入新的付款单位简称">
                <button type="button" id="add-company" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition duration-200">
                    添加
                </button>
            </div>
            
            <div class="overflow-x-auto">
                ${companiesHtml}
            </div>
        </div>
    `;
    
    // 绑定添加按钮事件
    const addCompanyButton = document.getElementById('add-company');
    addCompanyButton.addEventListener('click', () => {
        const newCompany = document.getElementById('new-company').value.trim();
        if (newCompany) {
            const result = addPaymentCompany(newCompany);
            if (result.success) {
                showToast(result.message);
                document.getElementById('new-company').value = '';
                loadCompanySettings();
            } else {
                showToast(result.message, 'error');
            }
        } else {
            showToast('请输入付款单位简称', 'error');
        }
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-company-btn').forEach(button => {
        button.addEventListener('click', () => {
            const company = button.getAttribute('data-company');
            if (confirm(`确定要删除付款单位简称 "${company}" 吗？`)) {
                const result = removePaymentCompany(company);
                if (result.success) {
                    showToast(result.message);
                    loadCompanySettings();
                } else {
                    showToast(result.message, 'error');
                }
            }
        });
    });
}

// 加载支付类型设置
function loadPaymentTypeSettings() {
    const paymentTypes = getPaymentTypes();
    
    let paymentTypesHtml = '';
    if (paymentTypes.length === 0) {
        paymentTypesHtml = '<div class="text-center py-4 text-gray-500">暂无数据</div>';
    } else {
        paymentTypesHtml = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">支付类型</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">需要百分比</th>
                        <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">操作</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${paymentTypes.map(type => `
                        <tr>
                            <td class="px-4 py-2">${type.name}</td>
                            <td class="px-4 py-2">${type.needPercentage ? '是' : '否'}</td>
                            <td class="px-4 py-2 text-right">
                                <button type="button" class="delete-payment-type-btn text-red-500 hover:text-red-700" data-type="${type.name}">
                                    <i class="fa fa-trash"></i> 删除
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    paymentTypeSettings.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-4">支付类型设置</h3>
            
            <div class="flex flex-col md:flex-row gap-4 mb-4">
                <div class="flex-grow flex">
                    <input type="text" id="new-payment-type" class="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg" placeholder="请输入新的支付类型">
                    <div class="flex items-center bg-gray-100 px-3 border-y border-r border-gray-300 rounded-r-lg">
                        <input type="checkbox" id="need-percentage" class="mr-2">
                        <label for="need-percentage" class="text-sm">需要百分比</label>
                    </div>
                </div>
                <button type="button" id="add-payment-type" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200">
                    添加
                </button>
            </div>
            
            <div class="overflow-x-auto">
                ${paymentTypesHtml}
            </div>
        </div>
    `;
    
    // 绑定添加按钮事件
    const addPaymentTypeButton = document.getElementById('add-payment-type');
    addPaymentTypeButton.addEventListener('click', () => {
        const newPaymentType = document.getElementById('new-payment-type').value.trim();
        const needPercentage = document.getElementById('need-percentage').checked;
        
        if (newPaymentType) {
            const result = addPaymentType(newPaymentType, needPercentage);
            if (result.success) {
                showToast(result.message);
                document.getElementById('new-payment-type').value = '';
                document.getElementById('need-percentage').checked = false;
                loadPaymentTypeSettings();
            } else {
                showToast(result.message, 'error');
            }
        } else {
            showToast('请输入支付类型', 'error');
        }
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-payment-type-btn').forEach(button => {
        button.addEventListener('click', () => {
            const paymentType = button.getAttribute('data-type');
            if (confirm(`确定要删除支付类型 "${paymentType}" 吗？`)) {
                const result = removePaymentType(paymentType);
                if (result.success) {
                    showToast(result.message);
                    loadPaymentTypeSettings();
                } else {
                    showToast(result.message, 'error');
                }
            }
        });
    });
}

// 加载用户管理
function loadUserManagement() {
    if (!checkPermission('canManageUsers')) {
        userManagement.innerHTML = '<div class="text-center py-8 text-gray-500">您没有权限管理用户</div>';
        return;
    }
    
    // 获取所有用户
    const users = getUsers();
    const currentUser = getCurrentUser();
    
    let usersHtml = '';
    if (users.length === 0) {
        usersHtml = '<div class="text-center py-4 text-gray-500">暂无用户</div>';
    } else {
        usersHtml = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">账号</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">姓名</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">角色</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">需要修改密码</th>
                        <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">操作</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${users.map(user => `
                        <tr>
                            <td class="px-4 py-2">${user.username}</td>
                            <td class="px-4 py-2">${user.name}</td>
                            <td class="px-4 py-2">${getRoleDisplayName(user.role)}</td>
                            <td class="px-4 py-2">${user.needChangePassword ? '是' : '否'}</td>
                            <td class="px-4 py-2 text-right">
                                ${user.username !== currentUser.username ? `
                                    <button type="button" class="edit-user-btn bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs mr-1" data-username="${user.username}">
                                        <i class="fa fa-pencil mr-1"></i> 编辑
                                    </button>
                                    <button type="button" class="delete-user-btn bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs" data-username="${user.username}">
                                        <i class="fa fa-trash mr-1"></i> 删除
                                    </button>
                                ` : '（当前用户）'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    userManagement.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">用户管理</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div class="md:col-span-4">
                    <button type="button" id="add-user-button" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200">
                        <i class="fa fa-plus mr-1"></i> 新增用户
                    </button>
                </div>
            </div>
            
            <div class="overflow-x-auto">
                ${usersHtml}
            </div>
        </div>
        
        <!-- 添加/编辑用户弹窗 -->
        <div id="user-modal" class="modal hidden">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 id="user-modal-title" class="modal-title">新增用户</h4>
                    <button type="button" id="close-user-modal" class="close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="user-form">
                        <input type="hidden" id="user-username">
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="user-name" class="block text-sm font-medium text-gray-700 mb-1">姓名 <span class="text-red-500">*</span></label>
                                <input type="text" id="user-name" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入姓名" required>
                            </div>
                            
                            <div id="new-user-password-container">
                                <label for="user-password" class="block text-sm font-medium text-gray-700 mb-1">密码 <span class="text-red-500">*</span></label>
                                <input type="password" id="user-password" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="请输入密码" required>
                            </div>
                            
                            <div>
                                <label for="user-role" class="block text-sm font-medium text-gray-700 mb-1">角色 <span class="text-red-500">*</span></label>
                                <select id="user-role" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                                    <option value="admin">总管理员</option>
                                    <option value="normalAdmin">普通管理员</option>
                                    <option value="normalUser">普通账号</option>
                                </select>
                            </div>
                            
                            <div>
                                <label for="user-need-change-password" class="block text-sm font-medium text-gray-700 mb-1">首次登录需修改密码</label>
                                <input type="checkbox" id="user-need-change-password" class="mt-2">
                            </div>
                        </div>
                        
                        <div class="mt-4 text-red-500 text-sm hidden" id="user-error"></div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" id="cancel-user" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200">
                        取消
                    </button>
                    <button type="button" id="save-user" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                        保存
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 绑定添加用户按钮事件
    const addUserButton = document.getElementById('add-user-button');
    addUserButton.addEventListener('click', () => {
        showUserModal('add');
    });
    
    // 绑定编辑用户按钮事件
    document.querySelectorAll('.edit-user-btn').forEach(button => {
        button.addEventListener('click', () => {
            const username = button.getAttribute('data-username');
            showUserModal('edit', username);
        });
    });
    
    // 绑定删除用户按钮事件
    document.querySelectorAll('.delete-user-btn').forEach(button => {
        button.addEventListener('click', () => {
            const username = button.getAttribute('data-username');
            handleDeleteUser(username);
        });
    });
    
    // 绑定关闭用户弹窗按钮事件
    const closeUserModalButton = document.getElementById('close-user-modal');
    closeUserModalButton.addEventListener('click', hideUserModal);
    
    // 绑定取消用户按钮事件
    const cancelUserButton = document.getElementById('cancel-user');
    cancelUserButton.addEventListener('click', hideUserModal);
    
    // 绑定保存用户按钮事件
    const saveUserButton = document.getElementById('save-user');
    saveUserButton.addEventListener('click', handleSaveUser);
}

// 获取所有用户
function getUsers() {
    return getFromLocalStorage('users', []);
}

// 显示用户弹窗
function showUserModal(mode, username = null) {
    const userModal = document.getElementById('user-modal');
    const userModalTitle = document.getElementById('user-modal-title');
    const newUserPasswordContainer = document.getElementById('new-user-password-container');
    
    // 重置表单
    document.getElementById('user-form').reset();
    document.getElementById('user-username').value = '';
    document.getElementById('user-error').classList.add('hidden');
    
    if (mode === 'add') {
        userModalTitle.textContent = '新增用户';
        newUserPasswordContainer.classList.remove('hidden');
        document.getElementById('user-password').required = true;
        
        // 生成账号
        const users = getUsers();
        let newUsername = String(users.length + 1001);
        // 确保账号不重复
        while (users.some(user => user.username === newUsername)) {
            newUsername = String(parseInt(newUsername) + 1);
        }
        
        // 创建临时输入框显示账号
        const usernameInput = document.createElement('div');
        usernameInput.innerHTML = `
            <label class="block text-sm font-medium text-gray-700 mb-1">账号</label>
            <input type="text" value="${newUsername}" class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" disabled>
            <input type="hidden" id="new-username" value="${newUsername}">
        `;
        
        // 插入到表单的最前面
        const userForm = document.getElementById('user-form');
        const firstChild = userForm.firstChild;
        userForm.insertBefore(usernameInput, firstChild);
    } else if (mode === 'edit' && username) {
        userModalTitle.textContent = '编辑用户';
        newUserPasswordContainer.classList.add('hidden');
        document.getElementById('user-password').required = false;
        
        // 获取用户信息
        const users = getUsers();
        const user = users.find(u => u.username === username);
        
        if (user) {
            document.getElementById('user-username').value = user.username;
            document.getElementById('user-name').value = user.name;
            document.getElementById('user-role').value = user.role;
            document.getElementById('user-need-change-password').checked = user.needChangePassword;
        }
    }
    
    // 显示弹窗
    userModal.classList.remove('hidden');
}

// 隐藏用户弹窗
function hideUserModal() {
    const userModal = document.getElementById('user-modal');
    userModal.classList.add('hidden');
    
    // 移除临时账号输入框
    const newUsernameInput = document.getElementById('new-username');
    if (newUsernameInput && newUsernameInput.parentElement) {
        newUsernameInput.parentElement.remove();
    }
}

// 处理保存用户
function handleSaveUser() {
    const userUsername = document.getElementById('user-username').value;
    const newUsername = document.getElementById('new-username')?.value;
    const username = userUsername || newUsername;
    const name = document.getElementById('user-name').value.trim();
    const password = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;
    const needChangePassword = document.getElementById('user-need-change-password').checked;
    
    // 验证输入
    if (!username || !name || (userUsername ? false : !password)) {
        showUserError('请填写所有必填字段');
        return;
    }
    
    // 如果是新增用户
    if (!userUsername) {
        const result = addUser(username, password, name, role, needChangePassword);
        if (result.success) {
            showToast(result.message);
            hideUserModal();
            loadUserManagement();
        } else {
            showUserError(result.message);
        }
    } else {
        // 如果是编辑用户
        const result = updateUser(username, name, role, needChangePassword);
        if (result.success) {
            showToast(result.message);
            hideUserModal();
            loadUserManagement();
        } else {
            showUserError(result.message);
        }
    }
}

// 显示用户错误
function showUserError(message) {
    const userError = document.getElementById('user-error');
    userError.textContent = message;
    userError.classList.remove('hidden');
}

// 处理删除用户
function handleDeleteUser(username) {
    if (confirm(`确定要删除用户 "${username}" 吗？`)) {
        const result = deleteUser(username);
        if (result.success) {
            showToast(result.message);
            loadUserManagement();
        } else {
            showToast(result.message, 'error');
        }
    }
}

// 加载操作日志
function loadOperationLogs() {
    const logs = getOperationLogs();
    
    let logsHtml = '';
    if (logs.length === 0) {
        logsHtml = '<div class="text-center py-4 text-gray-500">暂无操作日志</div>';
    } else {
        // 按时间倒序排列
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        logsHtml = `
            <div class="space-y-2">
                ${logs.map(log => `
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-medium text-gray-700">${log.userName} (${log.userRole})</span>
                            <span class="text-xs text-gray-500">${formatDate(log.timestamp, 'YYYY-MM-DD HH:mm:ss')}</span>
                        </div>
                        <p class="text-sm text-gray-600">${log.action}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    operationLogs.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900 mb-4">操作日志</h3>
            ${logsHtml}
        </div>
    `;
}

// 页面加载完成后初始化应用
window.addEventListener('DOMContentLoaded', initApp);