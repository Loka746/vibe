let isLogin = true;
const form = document.getElementById('auth-form');
const toggleBtn = document.getElementById('toggle-mode');
const submitBtn = document.getElementById('submit-btn');
const errorMsg = document.getElementById('error-msg');

if (localStorage.getItem('crm_token')) {
    window.location.href = '/dashboard';
}

toggleBtn.addEventListener('click', () => {
    isLogin = !isLogin;
    submitBtn.textContent = isLogin ? 'Login' : 'Register';
    toggleBtn.textContent = isLogin ? 'Need an account? Register' : 'Already have an account? Login';
    errorMsg.classList.add('hidden');
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        if (isLogin) {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Login failed');
            
            localStorage.setItem('crm_token', data.access_token);
            window.location.href = '/dashboard';
        } else {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Registration failed');
            
            isLogin = true;
            form.dispatchEvent(new Event('submit'));
        }
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove('hidden');
    }
});
