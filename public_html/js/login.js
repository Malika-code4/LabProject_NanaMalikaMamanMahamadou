/* ==========================================
   Login Page Script
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            clearFormErrors('loginForm');
            clearMessage('loginError');
            clearMessage('loginSuccess');

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            // Validation
            let hasError = false;

            if (!username) {
                showFieldError('username', 'Username or email is required');
                hasError = true;
            }

            if (!password) {
                showFieldError('password', 'Password is required');
                hasError = true;
            }

            if (hasError) return;

            // Set loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true);

            try {
                // Call login API
                const response = await apiCall('login.php', 'POST', {
                    username,
                    password
                });

                if (response.success) {
                    // Store user data
                    setCurrentUser({
                        user_id: response.user_id,
                        username: response.username,
                        role: response.role
                    });

                    showMessage('loginSuccess', 'Login successful! Redirecting...', 'success');
                    
                    // Redirect to dashboard after delay
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showMessage('loginError', 'Invalid username or password', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('loginError', 'An error occurred. Please try again.', 'error');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });

        // Real-time validation
        usernameInput.addEventListener('blur', () => {
            clearFieldError('username');
            if (!usernameInput.value.trim()) {
                showFieldError('username', 'Username or email is required');
            }
        });

        passwordInput.addEventListener('blur', () => {
            clearFieldError('password');
            if (!passwordInput.value) {
                showFieldError('password', 'Password is required');
            }
        });
    }
});