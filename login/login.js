// SocialSphere Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('SocialSphere Login Page Loaded');
    
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    const attemptsAlert = document.getElementById('attemptsAlert');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const attemptsMessage = document.getElementById('attemptsMessage');
    
    // Login attempts tracking
    let loginAttempts = 0;
    const maxAttempts = 5; // Show warning after this many attempts
    
    // Initialize localStorage for user management if not exists
    if (!localStorage.getItem('socialSphereUsers')) {
        localStorage.setItem('socialSphereUsers', JSON.stringify({}));
        console.log('Initialized empty user dictionary');
    }
    
    // Password visibility toggle
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            authenticateUser();
        }
    });
    
    // Real-time validation
    usernameInput.addEventListener('input', clearErrors);
    passwordInput.addEventListener('input', clearErrors);
    
    function validateForm() {
        let isValid = true;
        
        // Username validation
        if (!usernameInput.value.trim()) {
            setFieldInvalid(usernameInput, 'Please enter your username');
            isValid = false;
        } else {
            setFieldValid(usernameInput);
        }
        
        // Password validation
        if (!passwordInput.value) {
            setFieldInvalid(passwordInput, 'Please enter your password');
            isValid = false;
        } else {
            setFieldValid(passwordInput);
        }
        
        return isValid;
    }
    
    function setFieldValid(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    }
    
    function setFieldInvalid(field, message) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        const feedback = field.parentNode.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    }
    
    function clearErrors() {
        errorAlert.classList.add('d-none');
        successAlert.classList.add('d-none');
        
        // Clear field validation states
        usernameInput.classList.remove('is-invalid', 'is-valid');
        passwordInput.classList.remove('is-invalid', 'is-valid');
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove('d-none');
        successAlert.classList.add('d-none');
        attemptsAlert.classList.add('d-none');
        
        // Add shake animation to form
        loginForm.classList.add('shake');
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorAlert.classList.add('d-none');
        }, 5000);
    }
    
    function showSuccess(message) {
        successMessage.textContent = message;
        successAlert.classList.remove('d-none');
        errorAlert.classList.add('d-none');
        attemptsAlert.classList.add('d-none');
    }
    
    function showAttemptsWarning(attempts) {
        attemptsMessage.textContent = `Login attempt ${attempts}. Remember, you have unlimited attempts to log in.`;
        attemptsAlert.classList.remove('d-none');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            attemptsAlert.classList.add('d-none');
        }, 3000);
    }
    
    function authenticateUser() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        try {
            // Get users dictionary from localStorage
            const users = JSON.parse(localStorage.getItem('socialSphereUsers'));
            
            // Check if user exists
            if (!users[username]) {
                loginAttempts++;
                showError('Username not found. Please check your username or sign up for a new account.');
                
                if (loginAttempts >= maxAttempts) {
                    showAttemptsWarning(loginAttempts);
                }
                return;
            }
            
            // Get user by username
            const user = users[username];
            
            // Validate password
            if (user.password !== password) {
                loginAttempts++;
                showError('Incorrect password. Please try again.');
                
                if (loginAttempts >= maxAttempts) {
                    showAttemptsWarning(loginAttempts);
                }
                return;
            }
            
            // Authentication successful
            console.log('User authenticated successfully:', username);
            
            // Store current user in localStorage (not session/cookies as per requirements)
            localStorage.setItem('currentUser', username);
            
            // Update user's last login
            users[username].lastLogin = new Date().toISOString();
            localStorage.setItem('socialSphereUsers', JSON.stringify(users));
            
            // Show success message
            showSuccess('Login successful! Redirecting to your dashboard...');
            
            // Disable form
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging In...';
            
            // Clear form
            loginForm.reset();
            clearErrors();
            
            // Reset login attempts
            loginAttempts = 0;
            
            // Redirect to home page after 2 seconds
            setTimeout(() => {
                window.location.href = '../home/home.html';
            }, 2000);
            
        } catch (error) {
            console.error('Error during authentication:', error);
            showError('An error occurred during login. Please try again.');
            
            // Re-enable form
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Log In';
        }
    }
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        console.log('User already logged in, redirecting to home...');
        window.location.href = '../home/home.html';
    }
    
    // Add some visual feedback for form interactions
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.style.transform = 'translateY(0)';
        });
    });
    
    // Handle Enter key in username field
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });
    
    // Handle Enter key in password field
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});