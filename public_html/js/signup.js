/* ==========================================
   Signup Page Script
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const roleSelect = document.getElementById('role');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Auto-select role from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    if (roleParam && (roleParam === 'student' || roleParam === 'faculty')) {
        roleSelect.value = roleParam;
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            clearFormErrors('signupForm');
            clearMessage('signupError');
            clearMessage('signupSuccess');

            const role = roleSelect.value;
            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validation
            let hasError = false;

            if (!role) {
                showFieldError('role', 'Please select a role');
                hasError = true;
            }

            if (!username) {
                showFieldError('username', 'Username is required');
                hasError = true;
            } else if (!validateUsername(username)) {
                showFieldError('username', 'Username must be at least 3 characters');
                hasError = true;
            }

            if (!email) {
                showFieldError('email', 'Email is required');
                hasError = true;
            } else if (!validateEmail(email)) {
                showFieldError('email', 'Invalid email format');
                hasError = true;
            }

            if (!password) {
                showFieldError('password', 'Password is required');
                hasError = true;
            } else if (!validatePassword(password)) {
                showFieldError('password', 'Password must be at least 6 characters');
                hasError = true;
            }

            if (!confirmPassword) {
                showFieldError('confirmPassword', 'Please confirm your password');
                hasError = true;
            } else if (password !== confirmPassword) {
                showFieldError('confirmPassword', 'Passwords do not match');
                hasError = true;
            }

            if (hasError) return;

            // Set loading state
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true);

            try {
                // Call signup API
                const response = await apiCall('signup.php', 'POST', {
                    role,
                    username,
                    email,
                    password
                });

                if (response.success) {
                    showMessage('signupSuccess', 'Account created successfully! Redirecting to login...', 'success');
                    
                    // Clear form
                    signupForm.reset();
                    
                    // Redirect to login after delay
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showMessage('signupError', response.message || 'Signup failed. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Signup error:', error);
                showMessage('signupError', 'An error occurred. Please try again.', 'error');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });

        // Real-time validation
        roleSelect.addEventListener('change', () => {
            clearFieldError('role');
        });

        usernameInput.addEventListener('blur', () => {
            clearFieldError('username');
            if (!usernameInput.value.trim()) {
                showFieldError('username', 'Username is required');
            } else if (!validateUsername(usernameInput.value.trim())) {
                showFieldError('username', 'Username must be at least 3 characters');
            }
        });

        emailInput.addEventListener('blur', () => {
            clearFieldError('email');
            if (!emailInput.value.trim()) {
                showFieldError('email', 'Email is required');
            } else if (!validateEmail(emailInput.value.trim())) {
                showFieldError('email', 'Invalid email format');
            }
        });

        passwordInput.addEventListener('blur', () => {
            clearFieldError('password');
            if (!passwordInput.value) {
                showFieldError('password', 'Password is required');
            } else if (!validatePassword(passwordInput.value)) {
                showFieldError('password', 'Password must be at least 6 characters');
            }
        });

        confirmPasswordInput.addEventListener('blur', () => {
            clearFieldError('confirmPassword');
            if (!confirmPasswordInput.value) {
                showFieldError('confirmPassword', 'Please confirm your password');
            } else if (passwordInput.value !== confirmPasswordInput.value) {
                showFieldError('confirmPassword', 'Passwords do not match');
            }
        });
    }
});