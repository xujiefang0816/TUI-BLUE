/**
 * 用户管理模块
 */
import { saveToLocalStorage, getFromLocalStorage, generateId, formatDate } from './utils.js';
import { logOperation } from './settings.js';

// 存储键名常量
const USERS_KEY = 'file_registration_system_users';
const CURRENT_USER_KEY = 'file_registration_system_current_user';

// 默认用户数据
const defaultUsers = [
    {
        id: generateId(),
        username: 'TYL2025',
        password: '941314aA',
        role: 'admin', // 总管理员
        name: '总管理员',
        needChangePassword: false,
        createTime: new Date().toISOString(),
        lastLoginTime: null
    },
    {
        id: generateId(),
        username: '8888',
        password: '8888',
        role: 'manager', // 普通管理员
        name: '普通管理员',
        needChangePassword: true,
        createTime: new Date().toISOString(),
        lastLoginTime: null
    },
    {
        id: generateId(),
        username: '1001',
        password: '1001',
        role: 'user', // 普通账号
        name: '普通账号',
        needChangePassword: true,
        createTime: new Date().toISOString(),
        lastLoginTime: null
    }
];

// 用户角色权限映射
const rolePermissions = {
    admin: {
        canAccess: ['fileRegistration', 'fileInfo', 'fileProcessing', 'systemSettings'],
        canManageUsers: true,
        canEditSettings: true,
        canDeleteFiles: true,
        canBatchProcess: true,
        canExportExcel: true
    },
    manager: {
        canAccess: ['fileRegistration', 'fileInfo', 'fileProcessing'],
        canManageUsers: false,
        canEditSettings: false,
        canDeleteFiles: true,
        canBatchProcess: true,
        canExportExcel: true
    },
    user: {
        canAccess: ['fileRegistration', 'fileInfo'],
        canManageUsers: false,
        canEditSettings: false,
        canDeleteFiles: false,
        canBatchProcess: false,
        canExportExcel: false
    }
};

// 初始化用户数据
export function initUsers() {
    const users = getFromLocalStorage(USERS_KEY);
    if (!users || users.length === 0) {
        saveToLocalStorage(USERS_KEY, defaultUsers);
        return defaultUsers;
    }
    return users;
}

// 获取所有用户
export function getAllUsers() {
    return getFromLocalStorage(USERS_KEY) || defaultUsers;
}

// 根据用户名获取用户
export function getUserByUsername(username) {
    const users = getAllUsers();
    return users.find(user => user.username === username);
}

// 根据ID获取用户
export function getUserById(id) {
    const users = getAllUsers();
    return users.find(user => user.id === id);
}

// 用户登录
export function login(username, password) {
    const user = getUserByUsername(username);
    if (!user) {
        return { success: false, message: '账号不存在' };
    }
    
    if (user.password !== password) {
        return { success: false, message: '密码错误' };
    }
    
    // 更新最后登录时间
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index].lastLoginTime = new Date().toISOString();
        saveToLocalStorage(USERS_KEY, users);
        user.lastLoginTime = users[index].lastLoginTime;
    }
    
    // 保存当前登录用户
    saveToLocalStorage(CURRENT_USER_KEY, user);
    
    // 记录登录日志
    logOperation(username, '用户登录');
    
    return {
        success: true,
        user,
        needChangePassword: user.needChangePassword
    };
}

// 用户登出
export function logout() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        logOperation(currentUser.username, '用户登出');
    }
    removeFromLocalStorage(CURRENT_USER_KEY);
}

// 获取当前登录用户
export function getCurrentUser() {
    return getFromLocalStorage(CURRENT_USER_KEY);
}

// 检查用户是否已登录
export function isLoggedIn() {
    return getCurrentUser() !== null;
}

// 修改密码
export function changePassword(username, currentPassword, newPassword) {
    const users = getAllUsers();
    const index = users.findIndex(user => user.username === username);
    
    if (index === -1) {
        return { success: false, message: '用户不存在' };
    }
    
    if (users[index].password !== currentPassword) {
        return { success: false, message: '当前密码错误' };
    }
    
    // 检查新密码强度
    if (newPassword.length < 6) {
        return { success: false, message: '新密码长度不能少于6位' };
    }
    
    // 更新密码
    users[index].password = newPassword;
    users[index].needChangePassword = false;
    saveToLocalStorage(USERS_KEY, users);
    
    // 更新当前登录用户信息
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.username === username) {
        currentUser.password = newPassword;
        currentUser.needChangePassword = false;
        saveToLocalStorage(CURRENT_USER_KEY, currentUser);
    }
    
    // 记录操作日志
    logOperation(username, '修改密码');
    
    return { success: true, message: '密码修改成功' };
}

// 管理员重置用户密码
export function resetUserPassword(adminUsername, userId, newPassword = '123456') {
    const adminUser = getUserByUsername(adminUsername);
    if (!adminUser || adminUser.role !== 'admin') {
        return { success: false, message: '只有管理员才能重置密码' };
    }
    
    const users = getAllUsers();
    const index = users.findIndex(user => user.id === userId);
    
    if (index === -1) {
        return { success: false, message: '用户不存在' };
    }
    
    // 保存原密码用于日志
    const oldPassword = users[index].password;
    
    // 更新密码
    users[index].password = newPassword;
    users[index].needChangePassword = true;
    saveToLocalStorage(USERS_KEY, users);
    
    // 记录操作日志
    logOperation(adminUsername, `重置用户 ${users[index].username} 的密码`);
    
    return { success: true, message: '密码重置成功' };
}

// 添加用户
export function addUser(adminUsername, username, password, role, name) {
    const adminUser = getUserByUsername(adminUsername);
    if (!adminUser || adminUser.role !== 'admin') {
        return { success: false, message: '只有管理员才能添加用户' };
    }
    
    const users = getAllUsers();
    
    // 检查用户名是否已存在
    if (users.some(user => user.username === username)) {
        return { success: false, message: '用户名已存在' };
    }
    
    // 检查角色是否有效
    if (!['admin', 'manager', 'user'].includes(role)) {
        return { success: false, message: '无效的角色' };
    }
    
    // 创建新用户
    const newUser = {
        id: generateId(),
        username,
        password,
        role,
        name,
        needChangePassword: true,
        createTime: new Date().toISOString(),
        lastLoginTime: null
    };
    
    users.push(newUser);
    saveToLocalStorage(USERS_KEY, users);
    
    // 记录操作日志
    logOperation(adminUsername, `添加用户 ${username}，角色：${role}`);
    
    return { success: true, message: '用户添加成功', user: newUser };
}

// 删除用户
export function deleteUser(adminUsername, userId) {
    const adminUser = getUserByUsername(adminUsername);
    if (!adminUser || adminUser.role !== 'admin') {
        return { success: false, message: '只有管理员才能删除用户' };
    }
    
    // 不能删除自己
    if (adminUser.id === userId) {
        return { success: false, message: '不能删除自己的账号' };
    }
    
    const users = getAllUsers();
    const index = users.findIndex(user => user.id === userId);
    
    if (index === -1) {
        return { success: false, message: '用户不存在' };
    }
    
    // 记录要删除的用户信息用于日志
    const deletedUser = users[index];
    
    // 删除用户
    users.splice(index, 1);
    saveToLocalStorage(USERS_KEY, users);
    
    // 记录操作日志
    logOperation(adminUsername, `删除用户 ${deletedUser.username}，角色：${deletedUser.role}`);
    
    return { success: true, message: '用户删除成功' };
}

// 更新用户信息
export function updateUser(adminUsername, userId, updates) {
    const adminUser = getUserByUsername(adminUsername);
    if (!adminUser || adminUser.role !== 'admin') {
        return { success: false, message: '只有管理员才能更新用户信息' };
    }
    
    const users = getAllUsers();
    const index = users.findIndex(user => user.id === userId);
    
    if (index === -1) {
        return { success: false, message: '用户不存在' };
    }
    
    // 不能修改自己的角色
    if (adminUser.id === userId && updates.role && updates.role !== adminUser.role) {
        return { success: false, message: '不能修改自己的角色' };
    }
    
    // 检查用户名是否重复（如果更新了用户名）
    if (updates.username && updates.username !== users[index].username) {
        if (users.some(user => user.username === updates.username)) {
            return { success: false, message: '用户名已存在' };
        }
    }
    
    // 检查角色是否有效
    if (updates.role && !['admin', 'manager', 'user'].includes(updates.role)) {
        return { success: false, message: '无效的角色' };
    }
    
    // 保存原始信息用于日志
    const oldInfo = { ...users[index] };
    
    // 更新用户信息
    users[index] = { ...users[index], ...updates };
    saveToLocalStorage(USERS_KEY, users);
    
    // 记录操作日志
    let logMessage = `更新用户 ${users[index].username} 的信息`;
    if (oldInfo.role !== users[index].role) {
        logMessage += `，角色从 ${oldInfo.role} 改为 ${users[index].role}`;
    }
    logOperation(adminUsername, logMessage);
    
    return { success: true, message: '用户信息更新成功', user: users[index] };
}

// 检查用户权限
export function checkPermission(permission) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return false;
    }
    
    const rolePermission = rolePermissions[currentUser.role];
    if (!rolePermission) {
        return false;
    }
    
    return rolePermission[permission] === true;
}

// 检查页面访问权限
export function canAccessPage(page) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return false;
    }
    
    const rolePermission = rolePermissions[currentUser.role];
    if (!rolePermission) {
        return false;
    }
    
    return rolePermission.canAccess.includes(page);
}

// 获取用户角色显示名称
export function getRoleDisplayName(role) {
    const roleNames = {
        admin: '总管理员',
        manager: '普通管理员',
        user: '普通账号'
    };
    return roleNames[role] || role;
}

// 搜索用户
export function searchUsers(keyword) {
    const users = getAllUsers();
    if (!keyword || keyword.trim() === '') {
        return users;
    }
    
    const lowerKeyword = keyword.toLowerCase();
    return users.filter(user => 
        user.username.toLowerCase().includes(lowerKeyword) ||
        user.name.toLowerCase().includes(lowerKeyword) ||
        getRoleDisplayName(user.role).toLowerCase().includes(lowerKeyword)
    );
}

// 导出用户数据
export function exportUsers() {
    const users = getAllUsers();
    const exportData = users.map(user => ({
        用户名: user.username,
        角色: getRoleDisplayName(user.role),
        姓名: user.name,
        创建时间: formatDate(user.createTime, 'YYYY-MM-DD HH:mm:ss'),
        最后登录时间: user.lastLoginTime ? formatDate(user.lastLoginTime, 'YYYY-MM-DD HH:mm:ss') : '-',
        需要修改密码: user.needChangePassword ? '是' : '否'
    }));
    
    // 转换为CSV
    const headers = Object.keys(exportData[0]);
    const csvContent = 
        headers.join(',') + '\n' +
        exportData.map(row => 
            headers.map(header => {
                const cell = row[header];
                return typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell;
            }).join(',')
        ).join('\n');
    
    // 创建下载链接
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `用户数据_${formatDate(new Date(), 'YYYY-MM-DD')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}