document.addEventListener('DOMContentLoaded', () => {
    // Theme initializer
    const savedTheme = localStorage.getItem('lumiere_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Form Toggle Logic
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    const goToSignup = document.getElementById('go-to-signup');
    const goToLogin = document.getElementById('go-to-login');

    goToSignup.addEventListener('click', () => {
        loginView.classList.remove('active');
        signupView.classList.add('active');
    });

    goToLogin.addEventListener('click', () => {
        signupView.classList.remove('active');
        loginView.classList.add('active');
    });
});
