// Credenciais de teste
const TEST_CREDENTIALS = {
    username: 'ernane',
    password: 'estudos'
};

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Limpa mensagem de erro anterior
    errorMessage.textContent = '';

    // Verifica as credenciais
    if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
        // Armazena o status de login no localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        // Redireciona para a página inicial
        window.location.href = 'app.html';
    } else {
        // Exibe mensagem de erro
        errorMessage.textContent = 'Usuário ou senha incorretos';
        
        // Limpa o campo de senha
        document.getElementById('password').value = '';
        
        // Foca no campo de usuário se estiver vazio, senão foca na senha
        if (!username) {
            document.getElementById('username').focus();
        } else {
            document.getElementById('password').focus();
        }
    }
} 