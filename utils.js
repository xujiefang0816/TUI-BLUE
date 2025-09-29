/**
 * 工具函数模块
 */

// 日期格式化函数
export function formatDate(date, format = 'YYYY-MM-DD') {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

// 获取当前日期时间
export function getCurrentDateTime() {
    return new Date();
}

// 获取当前日期
export function getCurrentDate() {
    return formatDate(new Date(), 'YYYY-MM-DD');
}

// 获取当前时间戳
export function getTimestamp() {
    return Date.now();
}

// 防抖函数
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 验证邮箱
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 验证手机号
export function isValidPhone(phone) {
    const re = /^1[3-9]\d{9}$/;
    return re.test(phone);
}

// 验证密码强度
export function checkPasswordStrength(password) {
    if (!password) return 0;
    
    let strength = 0;
    
    // 长度检查
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // 包含数字
    if (/\d/.test(password)) strength++;
    
    // 包含小写字母
    if (/[a-z]/.test(password)) strength++;
    
    // 包含大写字母
    if (/[A-Z]/.test(password)) strength++;
    
    // 包含特殊字符
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

// 存储数据到localStorage
export function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('保存到localStorage失败:', error);
        return false;
    }
}

// 从localStorage读取数据
export function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('从localStorage读取失败:', error);
        return null;
    }
}

// 从localStorage删除数据
export function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('从localStorage删除失败:', error);
        return false;
    }
}

// 生成唯一ID
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 深拷贝
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    
    const clonedObj = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    
    return clonedObj;
}

// 格式化数字（千分位）
export function formatNumber(num) {
    if (typeof num !== 'number' && num !== undefined && num !== null) {
        num = parseFloat(num);
    }
    
    if (isNaN(num)) return num;
    
    return num.toLocaleString('zh-CN');
}

// 格式化金额
export function formatMoney(amount) {
    if (typeof amount !== 'number' && amount !== undefined && amount !== null) {
        amount = parseFloat(amount);
    }
    
    if (isNaN(amount)) return amount;
    
    return '¥' + amount.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// 计算百分比
export function calculatePercentage(value, total) {
    if (typeof value !== 'number' || typeof total !== 'number' || total === 0) {
        return 0;
    }
    
    return ((value / total) * 100).toFixed(2);
}

// 导出表格数据为Excel
export function exportToExcel(tableId, filename = '导出数据') {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error('未找到表格元素');
        return;
    }
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = [];
        const cols = rows[i].querySelectorAll('th, td');
        
        for (let j = 0; j < cols.length; j++) {
            let data = cols[j].innerText;
            data = data.replace(/"/g, '""');
            row.push('"' + data + '"');
        }
        
        csv.push(row.join(','));
    }
    
    // 创建CSV内容
    const csvContent = '\uFEFF' + csv.join('\n');
    
    // 创建Blob对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 创建下载链接
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename + '.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 显示提示信息
export function showToast(message, type = 'success', duration = 3000) {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300`;
    
    // 设置toast样式
    switch (type) {
        case 'success':
            toast.className += ' bg-green-500 text-white';
            break;
        case 'error':
            toast.className += ' bg-red-500 text-white';
            break;
        case 'warning':
            toast.className += ' bg-yellow-500 text-white';
            break;
        case 'info':
            toast.className += ' bg-blue-500 text-white';
            break;
        default:
            toast.className += ' bg-gray-700 text-white';
    }
    
    // 设置toast内容
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示toast
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // 自动隐藏toast
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

// 滚动到页面顶部
export function scrollToTop(smooth = true) {
    window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

// 滚动到指定元素
export function scrollToElement(elementId, smooth = true) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'start'
        });
    }
}

// 获取URL参数
export function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    });
    
    return params;
}

// 设置URL参数
export function setUrlParams(params) {
    const urlParams = new URLSearchParams(window.location.search);
    
    for (const key in params) {
        if (params[key] === null || params[key] === undefined) {
            urlParams.delete(key);
        } else {
            urlParams.set(key, params[key]);
        }
    }
    
    const newUrl = window.location.pathname + '?' + urlParams.toString();
    window.history.replaceState({}, '', newUrl);
}

// 复制文本到剪贴板
export async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        return true;
    } catch (error) {
        console.error('复制到剪贴板失败:', error);
        return false;
    }
}

// 检查元素是否在视口中
export function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 数组去重
export function uniqueArray(array, key) {
    if (!array || !Array.isArray(array)) return [];
    
    if (key) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) return false;
            seen.add(value);
            return true;
        });
    }
    
    return [...new Set(array)];
}

// 数组排序
export function sortArray(array, key, order = 'asc') {
    if (!array || !Array.isArray(array)) return [];
    
    return [...array].sort((a, b) => {
        let aValue = a[key];
        let bValue = b[key];
        
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        
        if (order === 'asc') {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
    });
}

// 数组分页
export function paginateArray(array, page, pageSize) {
    if (!array || !Array.isArray(array)) return [];
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return array.slice(startIndex, endIndex);
}

// 颜色转换：十六进制转RGB
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// 颜色转换：RGB转十六进制
export function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}