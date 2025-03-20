// Credenciais
const VALID_USERNAME = 'ernane';
const VALID_PASSWORD = 'estudos';

// Verifica se o usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('app.html')) {
        if (!isLoggedIn) {
            window.location.href = 'index.html';
        }
    } else if (currentPage.includes('index.html') || currentPage === '/English-Study-Tracker/') {
        if (isLoggedIn) {
            window.location.href = 'app.html';
        }
    }
});

// Função de login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'app.html';
    } else {
        errorElement.textContent = 'Usuário ou senha incorretos';
        errorElement.style.display = 'block';
        
        // Limpa a mensagem de erro após 3 segundos
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
}

// Função de logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Adiciona evento de tecla Enter para login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
});