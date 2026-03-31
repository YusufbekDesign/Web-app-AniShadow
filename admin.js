// ============================================
// ADMIN PANEL LOGIKASI - admin.js
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Autentifikatsiyani tekshirish
    checkAdminAuth();

    // Foydalanuvchi ma'lumotlarini ko'rsatish
    displayUserInfo();

    // Sidebar menyu tugmalarini qo'shish
    setupMenuItems();

    // Rol o'zgarishi uchun listener
    document.getElementById('role').addEventListener('change', handleRoleChange);

    // Form saqlashni qabul qilish
    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);

    // Qidirishni qabul qilish
    document.getElementById('searchUsers').addEventListener('input', handleSearch);

    // Dashboard statistikasini yangilash
    updateDashboard();

    // Foydalanuvchilar ro'yxatini ko'rsatish
    loadUsers();

    // Viloyat o'zgarishi uchun listener
    document.getElementById('region').addEventListener('change', loadDistricts);
});

/**
 * Admin autentifikatsiyasi - Faqat super_admin kira olsin
 */
function checkAdminAuth() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const user = JSON.parse(currentUser);
        if (user.role !== 'super_admin') {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Autentifikatsiya xatosi:', error);
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

/**
 * Foydalanuvchi ma'lumotlarini ko'rsatish
 */
function displayUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        userInfoElement.textContent = `📧 ${currentUser.email}`;
    }
}

/**
 * Sidebar menyu itemlarini faollashtirish
 */
function setupMenuItems() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Barcha itemlardan active klassini olib tashlash
            document.querySelectorAll('.menu-item').forEach(i => {
                i.classList.remove('active');
            });

            // Bosilgan itemga active klassini qo'shish
            this.classList.add('active');

            // Barcha content sectionlarni yashirish
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Tanlangan sectionni ko'rsatish
            const sectionId = this.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
            }
        });
    });
}

/**
 * Rol o'zgarishi - O'quvchi tanlansa, Sinf inputi paydo bo'lsin
 */
function handleRoleChange() {
    const role = document.getElementById('role').value;
    const classGroupDiv = document.getElementById('classGroupDiv');

    if (role === 'student') {
        classGroupDiv.style.display = 'block';
        document.getElementById('classGroup').required = true;
    } else {
        classGroupDiv.style.display = 'none';
        document.getElementById('classGroup').required = false;
        document.getElementById('classGroup').value = '';
    }
}

/**
 * Parol avtomatik yaratish (Random va kuchli)
 */
function generatePassword() {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';

    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    document.getElementById('userPassword').value = password;
}

/**
 * Yangi foydalanuvchi qo'shish formani saqlash
 */
function handleAddUser(e) {
    e.preventDefault();

    // Formadan ma'lumotlarni olish
    const userData = {
        id: generateUniqueId(),
        fullName: document.getElementById('fullName').value,
        region: document.getElementById('region').value,
        district: document.getElementById('district').value,
        schoolNumber: document.getElementById('schoolNumber').value,
        role: document.getElementById('role').value,
        classGroup: document.getElementById('classGroup').value || null,
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value,
        createdAt: new Date().toISOString()
    };

    // LocalStorage'dan users arrayni olish
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Yangi foydalanuvchini arrayga qo'shish
    users.push(userData);

    // LocalStorage'ga saqlash
    localStorage.setItem('users', JSON.stringify(users));

    // Muvaffaqiyat xabarini ko'rsatish
    showSuccessMessage();

    // Formani tozalash
    document.getElementById('addUserForm').reset();
    document.getElementById('classGroupDiv').style.display = 'none';
    document.getElementById('userPassword').value = '';

    // Foydalanuvchilar ro'yxatini yangilash
    loadUsers();

    // Dashboard statistikasini yangilash
    updateDashboard();
}

/**
 * Muvaffaqiyat xabarini ko'rsatish
 */
function showSuccessMessage() {
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

/**
 * Foydalanuvchilar ro'yxatini yuklash va ko'rsatish
 */
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.getElementById('usersTableBody');

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Hozircha foydalanuvchilar yo\'q</td></tr>';
        return;
    }

    tableBody.innerHTML = users.map((user, index) => {
        const regionName = getRegionName(user.region);
        const roleName = getRoleName(user.role);

        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${user.fullName}</strong></td>
                <td>${user.email}</td>
                <td><span class="role-badge role-${user.role}">${roleName}</span></td>
                <td>${regionName} / ${user.district}</td>
                <td>Maktab-${user.schoolNumber}</td>
                <td>${user.classGroup || '—'}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="editUser('${user.id}')">✏️</button>
                    <button class="btn-small btn-delete" onclick="deleteUser('${user.id}')">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Qidirishni amalga oshirish
 */
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.getElementById('usersTableBody');

    const filtered = users.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        getRoleName(user.role).toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Hech narsa topilmadi</td></tr>';
        return;
    }

    tableBody.innerHTML = filtered.map((user, index) => {
        const regionName = getRegionName(user.region);
        const roleName = getRoleName(user.role);

        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${user.fullName}</strong></td>
                <td>${user.email}</td>
                <td><span class="role-badge role-${user.role}">${roleName}</span></td>
                <td>${regionName} / ${user.district}</td>
                <td>Maktab-${user.schoolNumber}</td>
                <td>${user.classGroup || '—'}</td>
                <td>
                    <button class="btn-small btn-edit" onclick="editUser('${user.id}')">✏️</button>
                    <button class="btn-small btn-delete" onclick="deleteUser('${user.id}')">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Foydalanuvchini o'chirish
 */
function deleteUser(userId) {
    if (confirm('Bu foydalanuvchini o\'chirishga ishonchingiz komilmi?')) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
        updateDashboard();
        alert('Foydalanuvchi muvaffaqiyatli o\'chirildi');
    }
}

/**
 * Dashboard statistikasini yangilash
 */
function updateDashboard() {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const totalUsers = users.length;
    const teachers = users.filter(u => u.role === 'teacher').length;
    const students = users.filter(u => u.role === 'student').length;
    const schools = new Set(users.map(u => u.schoolNumber)).size;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('teacherCount').textContent = teachers;
    document.getElementById('studentCount').textContent = students;
    document.getElementById('schoolCount').textContent = schools;
}

/**
 * Unikal ID yaratish
 */
function generateUniqueId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Rol nomini o'zbek tiliga o'girish
 */
function getRoleName(role) {
    const roles = {
        'director': '👨‍💼 Direktor',
        'vice_director': '👨‍💼 Zamdirektor',
        'zavuch': '👨‍💼 Zavuch',
        'teacher': '👨‍🏫 O\'qituvchi',
        'student': '👦 O\'quvchi'
    };
    return roles[role] || role;
}

/**
 * Viloyat nomini olish
 */
function getRegionName(regionCode) {
    const regions = {
        'tashkent-city': 'Toshkent Shahar',
        'tashkent-region': 'Toshkent Viloyati',
        'samarkand': 'Samarqand',
        'bukhara': 'Buxoro',
        'kashkadarya': 'Qashqadaryo',
        'navoi': 'Navoiy',
        'andijan': 'Andijon',
        'fergana': 'Farg\'ona',
        'namangan': 'Namangan',
        'karakalpakstan': 'Qoraqalpog\'iston',
        'surxandarya': 'Surxondaryo',
        'jizzakh': 'Jizzax'
    };
    return regions[regionCode] || regionCode;
}

// Placeholder - edit funksiyasi
function editUser(userId) {
    alert('Edit funksiyasi 2-bosqichda qo\'shiladi');
}