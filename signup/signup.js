// SocialSphere Signup Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('SocialSphere Signup Page Loaded');
    
    // Get form elements
    const signupForm = document.getElementById('signupForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const signupBtn = document.getElementById('signupBtn');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
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
    
    // Real-time validation
    usernameInput.addEventListener('input', validateUsername);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    
    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            createUser();
        }
    });
    
    function validateUsername() {
        const username = usernameInput.value.trim();
        const users = JSON.parse(localStorage.getItem('socialSphereUsers'));
        
        if (username.length < 3) {
            setFieldInvalid(usernameInput, 'Username must be at least 3 characters long');
            return false;
        }
        
        if (username.length > 20) {
            setFieldInvalid(usernameInput, 'Username must be no more than 20 characters long');
            return false;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setFieldInvalid(usernameInput, 'Username can only contain letters, numbers, and underscores');
            return false;
        }
        
        if (users[username]) {
            setFieldInvalid(usernameInput, 'Username already exists. Please choose another one.');
            return false;
        }
        
        setFieldValid(usernameInput);
        return true;
    }
    
    function validatePassword() {
        const password = passwordInput.value;
        
        if (password.length < 6) {
            setFieldInvalid(passwordInput, 'Password must be at least 6 characters long');
            return false;
        }
        
        setFieldValid(passwordInput);
        
        // Re-validate password match if confirm password has value
        if (confirmPasswordInput.value) {
            validatePasswordMatch();
        }
        
        return true;
    }
    
    function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (password !== confirmPassword) {
            setFieldInvalid(confirmPasswordInput, 'Passwords do not match');
            return false;
        }
        
        setFieldValid(confirmPasswordInput);
        return true;
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
    
    function validateForm() {
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();
        const isPasswordMatchValid = validatePasswordMatch();
        
        return isUsernameValid && isPasswordValid && isPasswordMatchValid;
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove('d-none');
        successAlert.classList.add('d-none');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorAlert.classList.add('d-none');
        }, 5000);
    }
    
    function showSuccess(message) {
        successMessage.textContent = message;
        successAlert.classList.remove('d-none');
        errorAlert.classList.add('d-none');
    }
    
    function createUser() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        try {
            // Get existing users dictionary
            const users = JSON.parse(localStorage.getItem('socialSphereUsers'));
            
            // Create new user object
            const newUser = {
                username: username,
                password: password,
                createdAt: new Date().toISOString(),
                points: 0,
                achievements: []
            };
            
            // Add user to dictionary
            users[username] = newUser;
            
            // Save back to localStorage
            localStorage.setItem('socialSphereUsers', JSON.stringify(users));
            
            console.log('User created successfully:', username);
            
            // Show success message
            showSuccess('Account created successfully! Redirecting to login...');
            
            // Disable form
            signupBtn.disabled = true;
            signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating Account...';
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = '../login/login.html';
            }, 2000);
            
        } catch (error) {
            console.error('Error creating user:', error);
            showError('An error occurred while creating your account. Please try again.');
            
            // Re-enable form
            signupBtn.disabled = false;
            signupBtn.innerHTML = '<i class="fas fa-user-plus me-2"></i>Sign Up';
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
});