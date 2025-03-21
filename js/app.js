// Estrutura dos dados
const englishLevels = {
    beginner: {
        name: 'Iniciante',
        levels: [1, 2, 3]
    },
    basic: {
        name: 'Básico',
        levels: [4, 5, 6]
    },
    intermediate: {
        name: 'Intermediário',
        levels: [7, 8, 9]
    },
    upperIntermediate: {
        name: 'Pós Intermediário',
        levels: [10, 11, 12]
    },
    advanced: {
        name: 'Avançado',
        levels: [13, 14, 15]
    },
    fluent: {
        name: 'Fluente',
        levels: [16]
    }
};

// Estrutura de uma unidade
const unitTopics = [
    'Tópico 1',
    'Tópico 2',
    'Aula em Grupo',
    'Tópico 3',
    'Tópico 4',
    'Aula Particular'
];

// Gerenciamento de estado
let currentLevel = null;
let currentUnit = null;
let progressData = {}; // Para armazenar todos os dados de progresso

// Constantes
const PROGRESS_FILE = 'progress.json';

// Elementos DOM
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close');
const levelGrid = document.getElementById('levelGrid');
const homeBtn = document.getElementById('homeBtn');
const progressBtn = document.getElementById('progressBtn');
const statusMessage = document.createElement('div');
statusMessage.className = 'status-message';
document.querySelector('.container').appendChild(statusMessage);

// Inicialização
function init() {
    loadProgress();
    renderLevels();
    setupEventListeners();
}

// Configuração dos event listeners
function setupEventListeners() {
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    homeBtn.addEventListener('click', () => {
        homeBtn.classList.add('active');
        progressBtn.classList.remove('active');
        renderLevels();
    });
    
    progressBtn.addEventListener('click', () => {
        progressBtn.classList.add('active');
        homeBtn.classList.remove('active');
        showProgress();
    });
}

// Renderização dos níveis
function renderLevels() {
    levelGrid.innerHTML = '';
    
    Object.entries(englishLevels).forEach(([key, category]) => {
        category.levels.forEach(level => {
            const progress = calculateLevelProgress(level);
            const card = createLevelCard(level, category.name, progress);
            levelGrid.appendChild(card);
        });
    });
}

// Criação do card de nível
function createLevelCard(level, categoryName, progress) {
    const card = document.createElement('div');
    card.className = 'level-card';
    card.innerHTML = `
        <div class="level-header">
            <h3 class="level-title">Nível ${level}</h3>
            <span class="category-name">${categoryName}</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <p class="progress-text">${progress}% completo</p>
    `;
    
    card.addEventListener('click', () => showLevelDetails(level));
    return card;
}

// Exibição dos detalhes do nível
function showLevelDetails(level) {
    currentLevel = level;
    modalContent.innerHTML = `
        <h2>Nível ${level}</h2>
        <div class="unit-grid">
            ${Array.from({length: 6}, (_, i) => createUnitCard(i + 1)).join('')}
        </div>
    `;
    modal.style.display = 'block';
}

// Criação do card de unidade
function createUnitCard(unitNumber) {
    const unitProgress = loadUnitProgress(currentLevel, unitNumber);
    return `
        <div class="unit-card" onclick="showUnitDetails(${unitNumber})">
            <h3>Unidade ${unitNumber}</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${calculateUnitProgress(unitProgress)}%"></div>
            </div>
            <p>${calculateUnitProgress(unitProgress)}% completo</p>
        </div>
    `;
}

// Exibição dos detalhes da unidade
function showUnitDetails(unitNumber) {
    currentUnit = unitNumber;
    const unitProgress = loadUnitProgress(currentLevel, unitNumber);
    
    modalContent.innerHTML = `
        <h2>Nível ${currentLevel} - Unidade ${unitNumber}</h2>
        <ul class="topic-list">
            ${unitTopics.map((topic, index) => `
                <li class="topic-item">
                    <input type="checkbox" 
                           class="topic-checkbox" 
                           ${unitProgress[index] ? 'checked' : ''}
                           onchange="updateProgress(${index})"
                    >
                    <span class="${unitProgress[index] ? 'completed' : ''}">${topic}</span>
                </li>
            `).join('')}
        </ul>
    `;
}

// Atualização do progresso
function updateProgress(topicIndex) {
    const progress = loadUnitProgress(currentLevel, currentUnit);
    progress[topicIndex] = !progress[topicIndex];
    saveUnitProgress(currentLevel, currentUnit, progress);
    
    const topicSpan = document.querySelectorAll('.topic-list span')[topicIndex];
    topicSpan.classList.toggle('completed');
    
    renderLevels();
    
    // Salvar no arquivo JSON após atualizar o progresso
    saveProgressToJson();
}

// Cálculo do progresso da unidade
function calculateUnitProgress(unitProgress) {
    if (!unitProgress) return 0;
    const completed = unitProgress.filter(Boolean).length;
    return Math.round((completed / unitTopics.length) * 100);
}

// Cálculo do progresso do nível
function calculateLevelProgress(level) {
    let totalProgress = 0;
    for (let unit = 1; unit <= 6; unit++) {
        const unitProgress = loadUnitProgress(level, unit);
        totalProgress += calculateUnitProgress(unitProgress);
    }
    return Math.round(totalProgress / 6);
}

// Exibição do progresso geral
function showProgress() {
    let totalProgress = 0;
    let totalLevels = 0;
    
    levelGrid.innerHTML = '<h2>Seu Progresso Geral</h2>';
    
    Object.entries(englishLevels).forEach(([key, category]) => {
        const categoryProgress = category.levels.map(level => calculateLevelProgress(level));
        const avgProgress = categoryProgress.reduce((a, b) => a + b, 0) / category.levels.length;
        
        totalProgress += avgProgress * category.levels.length;
        totalLevels += category.levels.length;
        
        const categoryElement = document.createElement('div');
        categoryElement.className = 'level-card';
        categoryElement.innerHTML = `
            <div class="level-header">
                <h3 class="level-title">${category.name}</h3>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${avgProgress}%"></div>
            </div>
            <p>${Math.round(avgProgress)}% completo</p>
        `;
        
        levelGrid.appendChild(categoryElement);
    });
    
    const overallProgress = Math.round(totalProgress / totalLevels);
    const overallElement = document.createElement('div');
    overallElement.className = 'level-card';
    overallElement.innerHTML = `
        <div class="level-header">
            <h3 class="level-title">Progresso Total</h3>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${overallProgress}%"></div>
        </div>
        <p>${overallProgress}% completo</p>
    `;
    
    levelGrid.appendChild(overallElement);
}

// Gerenciamento do arquivo JSON
function loadUnitProgress(level, unit) {
    const key = `level${level}unit${unit}`;
    
    // Primeiro, tenta carregar do objeto progressData em memória
    if (progressData[key]) {
        return progressData[key];
    }
    
    // Tenta carregar do localStorage
    const saved = localStorage.getItem(key);
    if (saved) {
        const parsedData = JSON.parse(saved);
        progressData[key] = parsedData;
        return parsedData;
    }
    
    // Se não existir em memória ou localStorage, retorna um novo array vazio
    progressData[key] = Array(unitTopics.length).fill(false);
    return progressData[key];
}

function saveUnitProgress(level, unit, progress) {
    const key = `level${level}unit${unit}`;
    
    // Atualiza o objeto em memória
    progressData[key] = progress;
    
    // Salva no localStorage
    localStorage.setItem(key, JSON.stringify(progress));
    
    // Atualiza o objeto JSON completo
    localStorage.setItem('progressDataComplete', JSON.stringify(progressData));
    
    // Exibe mensagem de sucesso
    showStatusMessage('Progresso salvo com sucesso!', 'success');
    setTimeout(() => {
        hideStatusMessage();
    }, 2000);
}

// Funções para gerenciar o arquivo JSON
function saveProgressToJson() {
    try {
        // Faz a requisição para salvar no servidor
        fetch('/save-progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(progressData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showStatusMessage('Progresso salvo com sucesso!', 'success');
            } else {
                throw new Error(data.message || 'Erro ao salvar progresso');
            }
        })
        .catch(error => {
            console.error('Erro ao salvar progresso:', error);
            showStatusMessage('Erro ao salvar progresso. Tente novamente.', 'error');
        })
        .finally(() => {
            setTimeout(() => {
                hideStatusMessage();
            }, 2000);
        });
    } catch (error) {
        console.error('Erro ao salvar progresso:', error);
        showStatusMessage('Erro ao salvar progresso. Tente novamente.', 'error');
    }
}

function loadProgress() {
    try {
        showStatusMessage('Carregando progresso...', 'info');
        
        // Tenta carregar do arquivo progress.json primeiro
        fetch('/progress.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar arquivo JSON');
                }
                return response.json();
            })
            .then(data => {
                // Se o arquivo JSON tiver dados, usamos eles
                if (data && Object.keys(data).length > 0) {
                    progressData = data;
                    
                    // Atualiza o localStorage com os dados do JSON
                    Object.entries(progressData).forEach(([key, value]) => {
                        localStorage.setItem(key, JSON.stringify(value));
                    });
                    localStorage.setItem('progressDataComplete', JSON.stringify(progressData));
                    
                    showStatusMessage('Progresso carregado do arquivo JSON!', 'success');
                } else {
                    // Se não tiver dados no JSON, tenta carregar do localStorage
                    loadFromLocalStorage();
                }
            })
            .catch(error => {
                console.error('Erro ao carregar do JSON:', error);
                loadFromLocalStorage();
            })
            .finally(() => {
                renderLevels();
                setTimeout(() => {
                    hideStatusMessage();
                }, 2000);
            });
    } catch (error) {
        console.error('Erro ao carregar progresso:', error);
        showStatusMessage('Erro ao carregar progresso. Usando dados vazios.', 'error');
        
        // Em caso de erro, inicializa com dados vazios
        progressData = {};
        renderLevels();
    }
}

// Função auxiliar para carregar do localStorage
function loadFromLocalStorage() {
    // Carrega do localStorage
    const savedComplete = localStorage.getItem('progressDataComplete');
    
    if (savedComplete) {
        progressData = JSON.parse(savedComplete);
        showStatusMessage('Progresso carregado do localStorage!', 'success');
    } else {
        // Inicializa cada nível e unidade a partir do localStorage individual
        for (const category of Object.values(englishLevels)) {
            for (const level of category.levels) {
                for (let unit = 1; unit <= 6; unit++) {
                    loadUnitProgress(level, unit);
                }
            }
        }
        showStatusMessage('Progresso inicial carregado', 'info');
    }
}

// Funções auxiliares para mensagens de status
function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
}

function hideStatusMessage() {
    statusMessage.style.display = 'none';
}

function closeModal() {
    modal.style.display = 'none';
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    init();
}); 