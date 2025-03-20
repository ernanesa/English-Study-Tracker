// Funções para manipulação do vocabulário
function addWord() {
    const wordInput = document.getElementById('new-word');
    const translationInput = document.getElementById('word-translation');
    const wordList = document.getElementById('word-list');

    if (wordInput.value && translationInput.value) {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.innerHTML = `
            <span>${wordInput.value} - ${translationInput.value}</span>
            <button onclick="this.parentElement.remove()">Remover</button>
        `;
        wordList.appendChild(wordItem);

        wordInput.value = '';
        translationInput.value = '';
    }
}

// Funções para registro de tempo de estudo
function addStudyTime() {
    const hoursInput = document.getElementById('study-hours');
    const dateInput = document.getElementById('study-date');
    const historyList = document.getElementById('study-history');

    if (hoursInput.value && dateInput.value) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span>${dateInput.value}: ${hoursInput.value} horas</span>
            <button onclick="this.parentElement.remove()">Remover</button>
        `;
        historyList.appendChild(historyItem);

        hoursInput.value = '';
        dateInput.value = '';
    }
}

// Funções para manipulação de metas
function addGoal() {
    const goalInput = document.getElementById('new-goal');
    const dateInput = document.getElementById('goal-date');
    const goalList = document.getElementById('goal-list');

    if (goalInput.value && dateInput.value) {
        const goalItem = document.createElement('div');
        goalItem.className = 'goal-item';
        goalItem.innerHTML = `
            <span>${goalInput.value} - Meta para: ${dateInput.value}</span>
            <button onclick="this.parentElement.remove()">Remover</button>
        `;
        goalList.appendChild(goalItem);

        goalInput.value = '';
        dateInput.value = '';
    }
}

// Atualização dos valores das habilidades
document.addEventListener('DOMContentLoaded', function() {
    const skillInputs = document.querySelectorAll('.skill input[type="range"]');
    
    skillInputs.forEach(input => {
        const valueDisplay = input.nextElementSibling;
        
        // Atualiza o valor inicial
        valueDisplay.textContent = input.value + '%';
        
        // Atualiza quando o valor mudar
        input.addEventListener('input', function() {
            valueDisplay.textContent = this.value + '%';
        });
    });
});