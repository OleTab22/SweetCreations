/**
 * Main script for handling UI states and general functions
 */

// UI Elements and State Management
const UI = {
    navItems: {
        loggedIn: [
            { path: 'catalog.html', name: 'Catalog', icon: 'shopping-bag' },
            { path: 'cart.html', name: 'Cart', icon: 'shopping-cart' },
            { path: 'wishlist.html', name: 'Wishlist', icon: 'heart' },
            { path: 'profile.html', name: 'Profile', icon: 'user' },
            { path: '#', name: 'Logout', class: 'logout-btn', icon: 'log-out' }
        ],
        loggedOut: [
            { path: 'catalog.html', name: 'Catalog', icon: 'shopping-bag' },
            { path: 'login.html', name: 'Login', icon: 'log-in' },
            { path: 'register.html', name: 'Sign Up', class: 'signup-btn', icon: 'user-plus' }
        ]
    },
    
    notifications: [],
    
    init() {
        this.updateUI();
        this.setupEventListeners();
        this.initializeFeatures();
    },

    updateUI() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        this.toggleAuthNav(!!token);
        this.updateUserProfile(user);
        this.updateCartBadge();
    },

    toggleAuthNav(isLoggedIn) {
        const navList = document.querySelector('.home-parent');
        if (!navList) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        const items = isLoggedIn ? this.navItems.loggedIn : this.navItems.loggedOut;
        const navHTML = items.map(item => `
            <li>
                <a href="${item.path}" 
                   class="nav-link ${item.class || ''} ${currentPath === item.path ? 'active' : ''}"
                   data-page="${item.name.toLowerCase()}">
                    ${item.icon ? `<i data-feather="${item.icon}"></i>` : ''}
                    ${item.name}
                    ${item.path === 'cart.html' ? '<span class="cart-badge"></span>' : ''}
                </a>
            </li>
        `).join('');

        navList.innerHTML = `
            <li>
                <a href="index.html" class="nav-link ${currentPath === 'index.html' ? 'active' : ''}">
                    <i data-feather="home"></i>
                    Home
                </a>
            </li>
            ${navHTML}
        `;

        // Initialize Feather icons
        if (window.feather) {
            feather.replace();
        }
    },

    updateUserProfile(user) {
        const profileElement = document.getElementById('user-profile');
        if (!profileElement) return;

        if (user) {
            profileElement.innerHTML = `
                <div class="user-info">
                    <span class="user-email">${user.email}</span>
                    <div class="user-menu">
                        <a href="profile.html" class="user-menu-item">
                            <i data-feather="user"></i> Profile
                        </a>
                        <a href="orders.html" class="user-menu-item">
                            <i data-feather="package"></i> Orders
                        </a>
                        <a href="settings.html" class="user-menu-item">
                            <i data-feather="settings"></i> Settings
                        </a>
                        <hr class="menu-divider">
                        <a href="#" class="user-menu-item logout-btn">
                            <i data-feather="log-out"></i> Logout
                        </a>
                    </div>
                </div>
            `;
            if (window.feather) feather.replace();
        } else {
            profileElement.innerHTML = '';
        }
    },

    updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const badge = document.querySelector('.cart-badge');
        if (badge && cart.length > 0) {
            badge.textContent = cart.length;
            badge.style.display = 'inline-flex';
        } else if (badge) {
            badge.style.display = 'none';
        }
    },

    showNotification(message, type = 'info', duration = 3000) {
        const notification = {
            id: Date.now(),
            message,
            type
        };

        this.notifications.push(notification);
        this.renderNotifications();

        setTimeout(() => {
            this.removeNotification(notification.id);
        }, duration);
    },

    removeNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.renderNotifications();
    },

    renderNotifications() {
        let container = document.querySelector('.notifications-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }

        container.innerHTML = this.notifications.map(createNotificationElement).join('');

        if (window.feather) feather.replace();
    },

    setupEventListeners() {
        document.addEventListener('click', async (e) => {
            if (e.target.matches('.logout-btn')) {
                e.preventDefault();
                await this.handleLogout();
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-info')) {
                const menu = document.querySelector('.user-menu.active');
                if (menu) menu.classList.remove('active');
            }
        });

        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.querySelector('.home-parent').classList.toggle('active');
            });
        }
    },

    async handleLogout() {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await API.post('/api/auth/logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('cart');
            this.showNotification('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    },

    initializeFeatures() {
        if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
            this.loadFeaturedProducts();
        }
    },

    async loadFeaturedProducts() {
        try {
            const queryParams = new URLSearchParams({
                featured: true
            });

            const response = await fetch(`/api/products?${queryParams}`);
            const responseText = await response.text();
            console.log(responseText);

            if (!response.ok) throw new Error('Failed to fetch featured products');

            const { data: products } = JSON.parse(responseText);

            if (!Array.isArray(products)) {
                throw new TypeError('Expected an array of products');
            }

            const productList = document.querySelector('.product-list');
            if (productList) {
                productList.innerHTML = products.map(product => `
                    <div class="product-card">
                        <img src="${product.imageUrl}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>${Utils.formatPrice(product.price)}</p>
                        <button class="btn btn-primary" onclick="addToCart('${product._id}')">
                            <i data-feather="shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading featured products:', error);
            showNotification('Failed to load featured products', 'error');
        }
    },

    renderProductCard(product) {
        return `
            <div class="card product-card">
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p class="price">₹${Utils.formatPrice(product.price)}</p>
                    <p class="description">${product.description.substring(0, 100)}...</p>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="UI.addToCart(${product._id})">
                            <i data-feather="shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-secondary" onclick="UI.addToWishlist(${product._id})">
                            <i data-feather="heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
};

// Utility Functions
const Utils = {
    formatDate(date) {
        return new Date(date).toLocaleDateString();
    },

    formatPrice(price) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    validateForm(formData, rules) {
        const errors = {};
        Object.keys(rules).forEach(field => {
            const value = formData[field];
            const fieldRules = rules[field];

            if (fieldRules.required && !value) {
                errors[field] = `${field} is required`;
            }
            if (fieldRules.minLength && value.length < fieldRules.minLength) {
                errors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
            }
        });
        return errors;
    }
};

// API Handlers
const API = {
    async get(endpoint) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('API GET error:', error);
            throw error;
        }
    },

    async post(endpoint, data) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': token })
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = 'login.html';
                }
                throw new Error('API request failed');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    UI.init();

    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });

    const currentUser = localStorage.getItem('token');
    if (currentUser) {
        const loginLink = document.getElementById('login-link');
        const profileLink = document.getElementById('profile-link');
        const logoutLink = document.getElementById('logout-link');

        if (loginLink) loginLink.classList.add('hidden');
        if (profileLink) profileLink.classList.remove('hidden');
        if (logoutLink) {
            logoutLink.classList.remove('hidden');
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                window.location.href = 'index.html';
            });
        }
    }
});

// Export utilities for use in other scripts
export { UI, Utils, API };

// Improved notification rendering with a utility function
function createNotificationElement(notification) {
    return `
        <div class="notification ${notification.type}" data-id="${notification.id}">
            <span class="notification-message">${notification.message}</span>
            <button class="notification-close" onclick="UI.removeNotification(${notification.id})">
                <i data-feather="x"></i>
            </button>
        </div>
    `;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}
