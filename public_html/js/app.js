/* ==========================================
   Global App Functions
   ========================================== */

const API_BASE = './api';

// ==========================================
// Authentication Helpers
// ==========================================

function getAuthToken() {
    return localStorage.getItem('auth_token');
}

function setAuthToken(token) {
    localStorage.setItem('auth_token', token);
}

function clearAuthToken() {
    localStorage.removeItem('auth_token');
}

function getCurrentUser() {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('current_user', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('current_user');
}

// ==========================================
// API Request Helpers
// ==========================================

async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE}/${endpoint}`, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: 'Network error' };
    }
}

// ==========================================
// Auth Check
// ==========================================

async function checkAuth() {
    try {
        const response = await fetch('./api/auth_check.php');
        const data = await response.json();
        return data.authenticated ? data : null;
    } catch (error) {
        console.error('Auth check error:', error);
        return null;
    }
}

async function ensureAuthenticated() {
    const auth = await checkAuth();
    if (!auth) {
        clearAuthToken();
        clearCurrentUser();
        window.location.href = 'login.html';
        return false;
    }
    return auth;
}

// ==========================================
// Logout
// ==========================================

async function logout() {
    await fetch(`${API_BASE}/logout.php`, { method: 'POST' });
    clearAuthToken();
    clearCurrentUser();
    window.location.href = 'index.html';
}

// ==========================================
// Form Validation
// ==========================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateUsername(username) {
    return username.length >= 3;
}

function validatePassword(password) {
    return password.length >= 6;
}

function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const errorElements = form.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
        });
    }
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFieldError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

// ==========================================
// Message Helpers
// ==========================================

function showMessage(elementId, message, type = 'success') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `message show ${type}`;
        if (type === 'success') {
            setTimeout(() => {
                element.classList.remove('show');
            }, 3000);
        }
    }
}

function clearMessage(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = '';
        element.classList.remove('show');
    }
}

// ==========================================
// Modal Helpers
// ==========================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function setupModalCloseButtons() {
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// ==========================================
// Loading Button State
// ==========================================

function setButtonLoading(button, isLoading = true) {
    const spinner = button.querySelector('.btn-spinner');
    const text = button.querySelector('.btn-text');
    
    if (isLoading) {
        button.disabled = true;
        if (spinner) spinner.style.display = 'inline-block';
        if (text) text.style.display = 'none';
    } else {
        button.disabled = false;
        if (spinner) spinner.style.display = 'none';
        if (text) text.style.display = 'inline';
    }
}

// ==========================================
// Format Date
// ==========================================

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ==========================================
// Initialize
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    setupModalCloseButtons();

    // Setup logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtnProfile');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
});
