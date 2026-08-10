// External logic for Vocabulary Practice Page (ontap.html)

let shuffledQueue = [];
let currentIndex = 0;
let isAnswerChecked = false;
let scoreCorrect = 0;
let scoreWrong = 0;

// Fisher-Yates Shuffle Algorithm for 300 words without replacement
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getMasterData() {
    if (typeof masterData !== 'undefined' && Array.isArray(masterData) && masterData.length > 0) {
        return masterData;
    }
    if (typeof window !== 'undefined' && window.masterData && Array.isArray(window.masterData) && window.masterData.length > 0) {
        return window.masterData;
    }
    return [];
}

function initCycle() {
    const data = getMasterData();
    if (!data || data.length === 0) {
        console.error("masterData not loaded!");
        return;
    }
    shuffledQueue = shuffleArray(data);
    currentIndex = 0;
    scoreCorrect = 0;
    scoreWrong = 0;
    loadQuestion();
}

function loadQuestion() {
    if (currentIndex >= shuffledQueue.length) {
        showCycleComplete();
        return;
    }

    const currentWord = shuffledQueue[currentIndex];
    
    // Update counter and score
    document.getElementById('counterText').innerText = `Câu ${currentIndex + 1} / ${shuffledQueue.length}`;
    document.getElementById('scoreCorrect').innerText = `Đúng: ${scoreCorrect}`;
    document.getElementById('scoreWrong').innerText = `Sai: ${scoreWrong}`;
    
    // Display Vietnamese Meaning
    document.getElementById('displayMeaning').innerText = currentWord.v;
    
    // Clear and focus input
    const inputEl = document.getElementById('userInput');
    inputEl.value = '';
    inputEl.classList.remove('input-correct', 'input-wrong');
    inputEl.focus();
    
    // Hide result box and reset state
    const resultBox = document.getElementById('resultContainer');
    resultBox.classList.add('hidden');
    resultBox.classList.remove('result-correct', 'result-wrong');
    
    isAnswerChecked = false;
    
    // Update button text
    const actionBtn = document.getElementById('actionBtn');
    actionBtn.innerText = "KIỂM TRA (Enter)";
    actionBtn.className = "btn-action btn-submit";
}

function handleAction() {
    if (!isAnswerChecked) {
        checkAnswer();
    } else {
        nextQuestion();
    }
}

function checkAnswer() {
    const inputEl = document.getElementById('userInput');
    const userRaw = inputEl.value.trim();
    const userNorm = userRaw.toLowerCase();
    
    const currentWord = shuffledQueue[currentIndex];
    const targetHanzi = currentWord.h.trim();
    const targetPinyinNorm = currentWord.p.trim().toLowerCase();
    
    // Exact Pinyin match (case-insensitive & trimmed) or Exact Hanzi match
    const isCorrect = (userRaw === targetHanzi) || (userNorm === targetPinyinNorm);
    
    if (isCorrect) {
        scoreCorrect++;
    } else {
        scoreWrong++;
    }
    
    // Update score UI
    document.getElementById('scoreCorrect').innerText = `Đúng: ${scoreCorrect}`;
    document.getElementById('scoreWrong').innerText = `Sai: ${scoreWrong}`;
    
    // Display Result UI
    const resultBox = document.getElementById('resultContainer');
    const badgeEl = document.getElementById('resultBadge');
    const answerHanziEl = document.getElementById('answerHanzi');
    const answerPinyinEl = document.getElementById('answerPinyin');
    const actionBtn = document.getElementById('actionBtn');
    
    if (isCorrect) {
        badgeEl.innerText = "ĐÚNG";
        badgeEl.className = "status-badge badge-correct";
        resultBox.className = "result-container result-correct";
        inputEl.classList.add('input-correct');
        inputEl.classList.remove('input-wrong');
        actionBtn.className = "btn-action btn-correct";
    } else {
        badgeEl.innerText = "SAI";
        badgeEl.className = "status-badge badge-wrong";
        resultBox.className = "result-container result-wrong";
        inputEl.classList.add('input-wrong');
        inputEl.classList.remove('input-correct');
        actionBtn.className = "btn-action btn-wrong";
    }
    
    answerHanziEl.innerText = targetHanzi;
    answerPinyinEl.innerText = currentWord.p;
    
    resultBox.classList.remove('hidden');
    isAnswerChecked = true;
    
    actionBtn.innerText = "TIẾP THEO (Enter ↵)";
}

function nextQuestion() {
    currentIndex++;
    loadQuestion();
}

function showCycleComplete() {
    alert(`Chúc mừng bạn đã hoàn thành 300 từ vựng!\nKết quả: ${scoreCorrect} câu đúng, ${scoreWrong} câu sai.\n\nHệ thống sẽ bắt đầu lượt xáo trộn 300 từ mới!`);
    initCycle();
}

function setupEvents() {
    initCycle();
    
    const inputEl = document.getElementById('userInput');
    if (inputEl) {
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAction();
            }
        });
    }
    
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            handleAction();
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEvents);
} else {
    setupEvents();
}

