// User authentication system
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let adminCredentials = {
    username: 'AGvantrixe',
    password: 'AGExim@2026',
    securityCode: '1994'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    initializeForms();
});

// Check if user is already logged in
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showUserInterface();
    }
}

// Initialize all forms
function initializeForms() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Register form
    document.getElementById('register-form').addEventListener('submit', handleRegister);

    // Admin form
    document.getElementById('admin-form').addEventListener('submit', handleAdminLogin);
}

// Modal management functions
function showLoginModal() {
    closeAllModals();
    document.getElementById('login-modal').style.display = 'block';
}

function showRegisterModal() {
    closeAllModals();
    document.getElementById('register-modal').style.display = 'block';
}

function showAdminLogin() {
    closeAllModals();
    document.getElementById('admin-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
}

function switchToRegister() {
    closeModal('login-modal');
    showRegisterModal();
}

function switchToLogin() {
    closeModal('register-modal');
    showLoginModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Form handlers
function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert('An account with this email already exists!');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: 'customer',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created successfully! Please login.');
    switchToLogin();
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        closeModal('login-modal');
        showUserInterface();
        alert(`Welcome back, ${user.name}!`);
    } else {
        alert('Invalid email or password!');
    }
}

function handleAdminLogin(event) {
    event.preventDefault();

    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const securityCode = document.getElementById('admin-code').value;

    if (username === adminCredentials.username &&
        password === adminCredentials.password &&
        securityCode === adminCredentials.securityCode) {

        currentUser = {
            name: 'Administrator',
            email: 'admin@globaltrade.com',
            role: 'admin'
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('admin-modal');
        showAdminInterface();
        alert('Admin login successful!');
    } else {
        alert('Invalid admin credentials! Access denied.');
        // Clear form for security
        document.getElementById('admin-form').reset();
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    hideUserInterface();
    alert('Logged out successfully!');
}

function showUserInterface() {
    document.getElementById('auth-links').style.display = 'none';
    document.getElementById('user-menu').style.display = 'flex';
    document.getElementById('user-greeting').textContent = `Hello, ${currentUser.name}`;
    document.getElementById('dashboard').style.display = 'block';

    // Scroll to dashboard
    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
}

function showAdminInterface() {
    document.getElementById('auth-links').style.display = 'none';
    document.getElementById('user-menu').style.display = 'flex';
    document.getElementById('user-greeting').textContent = `Admin: ${currentUser.name}`;
    document.getElementById('dashboard').style.display = 'block';

    // Update dashboard for admin
    document.querySelector('.dashboard h2').textContent = 'Shipping Operations Dashboard';
    document.querySelector('.dashboard-content').innerHTML = `
        <div class="dashboard-card">
            <h3>👥 Client Management</h3>
            <p>Manage shipping client accounts</p>
            <button class="btn">View Clients</button>
        </div>
        <div class="dashboard-card">
            <h3>🚢 Fleet Tracking</h3>
            <p>Monitor port-to-port shipments</p>
            <button class="btn">Track Ships</button>
        </div>
        <div class="dashboard-card">
            <h3>📦 Booking Management</h3>
            <p>Manage port-to-port bookings</p>
            <button class="btn">View Bookings</button>
        </div>
        <div class="dashboard-card">
            <h3>⚙️ Port Operations</h3>
            <p>Configure shipping settings</p>
            <button class="btn">Port Settings</button>
        </div>
    `;
}

function hideUserInterface() {
    document.getElementById('auth-links').style.display = 'flex';
    document.getElementById('user-menu').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 60;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Contact form submission handler
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const formData = new FormData(this);

        // Show success message
        alert('Thank you for your message! We will get back to you soon.');

        // Reset form
        this.reset();
    });
}

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and feature boxes
document.querySelectorAll('.service-card, .feature, .info-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
