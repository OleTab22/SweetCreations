const showError = (message) => {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
};

const setLoading = (isLoading) => {
    const button = document.querySelector('.btn-primary');
    const buttonText = button.querySelector('.btn-text');
    const loader = button.querySelector('.loader');
    
    button.disabled = isLoading;
    buttonText.style.display = isLoading ? 'none' : 'block';
    loader.style.display = isLoading ? 'block' : 'none';
};

export const registerUser = async (email, password) => {
    try {
        setLoading(true);
        showError(''); // Clear any existing errors

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        alert('Registration successful! Please log in.');
        window.location.href = 'login.html';
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
};

export const loginUser = async (email, password) => {
    try {
        setLoading(true);
        showError(''); // Clear any existing errors

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        localStorage.setItem('token', `Bearer ${data.token}`);
        localStorage.setItem('user', JSON.stringify({
            email: data.user.email,
            id: data.user.id
        }));
        
        window.location.href = 'index.html';
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('register-form');

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        loginUser(email, password);
    });

    registerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        registerUser(email, password);
    });
});
