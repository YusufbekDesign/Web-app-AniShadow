// ============================================
// LOGIN TIZIMI - auth.js
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Agar foydalanuvchi allaqachon login qilgan bo'lsa, admin panelga yo'naltir
    checkAuthStatus();

    // Login formni submit qilish
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

/**
 * Login qilishni tekshirish va qayta yo'naltirish
 */
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Xatolarni tozalash
    clearErrors();

    // Kiritilgan ma'lumotlarni tekshirish
    if (email === 'yusufbekdesign@gmail.com' && password === '04042331Yusufbek') {
        // Super Admin foydalanuvchisi
        const userData = {
            id: generateUniqueId(),
            email: email,
            role: 'super_admin',
            loginTime: new Date().toISOString()
        };

        // LocalStorage'da saqlash
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Admin panelga yo'naltirish
        window.location.href = 'admin.html';
    } else {
        // Xato xabarini ko'rsatish
        showError('emailError', '❌ Email yoki parol noto\'g\'ri!');
        showError('passwordError', '');
    }
}

/**
 * Autentifikatsiyani tekshirish - agar login qilgan bo'lsa
 */
function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            if (user.role === 'super_admin') {
                // Agar admin panelga kirmoqchi bo'lsa, yo'naltir
                if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                    window.location.href = 'admin.html';
                }
            }
        } catch (error) {
            console.error('LocalStorage xatosi:', error);
            localStorage.removeItem('currentUser');
        }
    }
}

/**
 * Xato xabarini ko'rsatish
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = message ? 'block' : 'none';
    }
}

/**
 * Barcha xato xabarlarini tozalash
 */
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

/**
 * Unikal ID yaratish
 */
function generateUniqueId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================
// LOGOUT FUNKSIYASI
// ============================================

function logout() {
    if (confirm('Chiqmoqchi ekanligingizga ishonchingiz komilmi?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}