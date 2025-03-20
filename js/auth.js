// Credenciais
const VALID_USERNAME = 'ernane';
const VALID_PASSWORD = 'estudos';

// Verifica se o usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    // Redireciona para a página apropriada com base no estado de login
    if (currentPage.includes('app.html')) {
        if (!isLoggedIn) {
            window.location.href = 'index.html';
        }
    } else if (currentPage.includes('index.html') || currentPage === '/English-Study-Tracker/') {
        if (isLoggedIn) {
            window.location.href = 'app.html';
        }
    }

    // Adiciona evento de tecla Enter para login
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const errorElement = document.getElementById('login-error');

        // Limpa mensagem de erro quando o usuário começa a digitar
        usernameInput?.addEventListener('input', () => {
            errorElement.style.display = 'none';
        });

        passwordInput?.addEventListener('input', () => {
            errorElement.style.display = 'none';
        });

        // Permite login com Enter em qualquer campo
        loginForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
});

// Função de login
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    const loginButton = document.querySelector('.login-form button');

    // Desabilita o botão durante a validação
    loginButton.disabled = true;
    loginButton.textContent = 'Verificando...';

    // Simula uma pequena espera para dar feedback visual
    setTimeout(() => {
        if (!username || !password) {
            showError('Por favor, preencha todos os campos');
        } else if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            // Login bem sucedido
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            window.location.href = 'app.html';
        } else {
            // Login falhou
            showError('Usuário ou senha incorretos');
            document.getElementById('password').value = ''; // Limpa a senha
        }

        // Reativa o botão
        loginButton.disabled = false;
        loginButton.textContent = 'Entrar';
    }, 500);
}

// Função para mostrar erro
function showError(message) {
    const errorElement = document.getElementById('login-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Adiciona classe para animação
    errorElement.classList.add('shake');
    
    // Remove a classe de animação após a animação terminar
    setTimeout(() => {
        errorElement.classList.remove('shake');
    }, 500);
}

// Função de logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}