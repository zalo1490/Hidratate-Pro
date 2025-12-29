const cupsContainer = document.getElementById('cups-container');
const liters = document.getElementById('liters');
const percentage = document.getElementById('percentage');
const remained = document.getElementById('remained');
const goalSelect = document.getElementById('goal-select');
const msg = document.getElementById('motivation-msg');
const weeklyCountEl = document.getElementById('weekly-count');
const monthlyCountEl = document.getElementById('monthly-count');

let dailyGoal = 2000;
let cupsStatus = []; 
let history = JSON.parse(localStorage.getItem('waterHistory')) || [];

function initCups() {
    const totalCups = dailyGoal / 250;
    cupsStatus = new Array(totalCups).fill(false);
    renderCups();
}

function renderCups() {
    cupsContainer.innerHTML = '';
    cupsStatus.forEach((isFull, index) => {
        const cup = document.createElement('div');
        cup.className = `cup-small ${isFull ? 'full' : ''}`;
        cup.innerHTML = `250<br>ml`;
        cup.onclick = () => {
            cupsStatus[index] = !cupsStatus[index];
            updateProgress();
        };
        cupsContainer.appendChild(cup);
    });
}

function updateProgress() {
    const fullCupsCount = cupsStatus.filter(v => v).length;
    const consumed = fullCupsCount * 250;
    const percent = (consumed / dailyGoal) * 100;

    // Altura proporcional a los 240px del CSS
    percentage.style.height = `${(consumed / dailyGoal) * 240}px`;
    percentage.innerText = consumed === 0 ? '' : `${Math.round(percent)}%`;

    if (consumed >= dailyGoal) {
        remained.style.visibility = 'hidden';
        remained.style.height = 0;
        msg.innerText = "¡Meta cumplida! 🏆";
        saveSuccess(); 
    } else {
        remained.style.visibility = 'visible';
        remained.style.height = 'auto';
        liters.innerText = `${((dailyGoal - consumed) / 1000).toFixed(2)}L`;
        msg.innerText = percent > 50 ? "¡Ya casi! 💧" : "Sigue bebiendo.";
    }
    
    renderCups();
    updateStats();
}

function saveSuccess() {
    const today = new Date().toISOString().split('T')[0];
    if (!history.includes(today)) {
        history.push(today);
        localStorage.setItem('waterHistory', JSON.stringify(history));
    }
}

function updateStats() {
    const now = new Date();
    const getDays = (days) => history.filter(d => (now - new Date(d)) / 864e5 <= days).length;
    weeklyCountEl.innerText = getDays(7);
    monthlyCountEl.innerText = getDays(30);
}

goalSelect.onchange = (e) => {
    dailyGoal = parseInt(e.target.value);
    initCups();
    updateProgress();
};

document.getElementById('reset-btn').onclick = () => {
    initCups();
    updateProgress();
};

initCups();
updateProgress();