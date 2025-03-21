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
const JSON_FILE_PATH = 'progress.json'; // Caminho para o arquivo JSON local

// Elementos DOM
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close');
const levelGrid = document.getElementById('levelGrid');
const homeBtn = document.getElementById('homeBtn');
const progressBtn = document.getElementById('progressBtn');

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

// Gerenciamento do armazenamento JSON
function loadUnitProgress(level, unit) {
    const key = `level${level}unit${unit}`;
    
    // Se já temos os dados em memória, use-os
    if (progressData[key]) {
        return progressData[key];
    }
    
    // Se não tivermos dados em memória, retorne um array vazio de tópicos
    return Array(unitTopics.length).fill(false);
}

function saveUnitProgress(level, unit, progress) {
    const key = `level${level}unit${unit}`;
    
    // Atualiza o objeto em memória
    progressData[key] = progress;
    
    // Salva no arquivo JSON
    saveProgressToJson();
}

// Funções para gerenciar o arquivo JSON
function saveProgressToJson() {
    // Salva o progresso no arquivo JSON local usando AJAX
    const progressJson = JSON.stringify(progressData);
    
    fetch('save_progress.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: progressJson
    })
    .then(response => response.json())
    .then(data => {
        console.log('Progresso salvo com sucesso:', data);
        // Podemos adicionar uma notificação visual aqui se quisermos
    })
    .catch((error) => {
        console.error('Erro ao salvar progresso:', error);
        // Salvar no localStorage como fallback
        localStorage.setItem('progressBackup', progressJson);
        alert('Não foi possível salvar o progresso no servidor. Seus dados foram salvos localmente como backup.');
    });
}

function loadProgress() {
    // Tenta carregar o progresso do arquivo JSON local
    fetch(JSON_FILE_PATH)
    .then(response => {
        if (!response.ok) {
            throw new Error('Arquivo de progresso não encontrado');
        }
        return response.json();
    })
    .then(data => {
        console.log('Progresso carregado com sucesso:', data);
        // Atualiza o objeto em memória com os dados carregados
        progressData = data;
        // Atualiza a interface
        renderLevels();
    })
    .catch((error) => {
        console.error('Erro ao carregar progresso do arquivo:', error);
        // Tenta carregar do localStorage como fallback
        const backup = localStorage.getItem('progressBackup');
        if (backup) {
            try {
                progressData = JSON.parse(backup);
                console.log('Progresso carregado do backup local');
                renderLevels();
            } catch (e) {
                console.error('Erro ao carregar backup:', e);
            }
        }
    });
}

// Adiciona funcionalidade para exportar/importar manualmente
function exportProgress() {
    const progressJson = JSON.stringify(progressData);
    const blob = new Blob([progressJson], { type: 'application/json' });
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = URL.createObjectURL(blob);
    a.download = 'english_progress_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importProgress(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            progressData = { ...progressData, ...importedData };
            
            // Salva os dados importados no servidor
            saveProgressToJson();
            
            renderLevels();
            alert('Progresso importado com sucesso!');
        } catch (error) {
            console.error('Erro ao importar progresso:', error);
            alert('Erro ao importar arquivo. Verifique se é um JSON válido.');
        }
    };
    reader.readAsText(file);
}

function closeModal() {
    modal.style.display = 'none';
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Função para adicionar menu de importação/exportação
function addImportExportMenu() {
    const container = document.querySelector('.container');
    
    const menuDiv = document.createElement('div');
    menuDiv.className = 'import-export-menu';
    menuDiv.innerHTML = `
        <button id="exportBtn">Exportar Progresso</button>
        <label for="importFile" class="import-label">Importar Progresso</label>
        <input type="file" id="importFile" accept=".json" style="display: none;">
    `;
    
    container.appendChild(menuDiv);
    
    document.getElementById('exportBtn').addEventListener('click', exportProgress);
    document.getElementById('importFile').addEventListener('change', importProgress);
}

// Adiciona a função ao init
document.addEventListener('DOMContentLoaded', function() {
    init();
    addImportExportMenu();
}); 