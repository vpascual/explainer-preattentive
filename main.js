// State variables
let selectedFeature = 'color';
let numDistractors = 42;
let numTrials = 10;
let displayDuration = 300;
let currentTrial = 0;
let trialResults = [];
let gameState = 'ready';
let startTime = null;
let displayTimeout = null;
let reactionTime = null;
let elements = [];
let targetPresent = false;

// Feature definitions
const features = {
    color: {
        name: 'Color (Hue) — Red among blue',
        description: 'Different hues are processed preattentively, making colored targets pop out instantly.',
        target: { type: 'circle', color: '#ef4444', size: 30 },
        distractor: { type: 'circle', color: '#3b82f6', size: 30 }
    },
    size: {
        name: 'Size — Large among small',
        description: 'Significant size differences are detected quickly by our visual system.',
        target: { type: 'circle', color: '#3b82f6', size: 45 },
        distractor: { type: 'circle', color: '#3b82f6', size: 25 }
    },
    orientation: {
        name: 'Orientation — Tilted among horizontal',
        description: 'Tilted lines among horizontal ones stand out due to orientation processing.',
        target: { type: 'line', color: '#3b82f6', angle: 45, size: 30 },
        distractor: { type: 'line', color: '#3b82f6', angle: 0, size: 30 }
    },
    shape: {
        name: 'Shape — Square among circles',
        description: 'Basic shape differences (circle vs square) are recognized preattentively.',
        target: { type: 'square', color: '#3b82f6', size: 30 },
        distractor: { type: 'circle', color: '#3b82f6', size: 30 }
    },
    intensity: {
        name: 'Intensity — Dark among light',
        description: 'Brightness differences allow dark elements to stand out among light ones.',
        target: { type: 'circle', color: '#1e3a8a', size: 30 },
        distractor: { type: 'circle', color: '#93c5fd', size: 30 }
    },
    enclosure: {
        name: 'Enclosure — Circled item',
        description: 'Elements with enclosing marks (like circles around them) are detected preattentively.',
        target: { type: 'circle', color: '#3b82f6', size: 20, enclosed: true },
        distractor: { type: 'circle', color: '#3b82f6', size: 20 }
    },
    length: {
        name: 'Length — Long among short',
        description: 'Line length differences are processed quickly by our visual system.',
        target: { type: 'line', color: '#3b82f6', angle: 90, size: 50 },
        distractor: { type: 'line', color: '#3b82f6', angle: 90, size: 25 }
    },
    curvature: {
        name: 'Curvature — Curved among straight',
        description: 'Curved lines stand out among straight lines due to curvature detection.',
        target: { type: 'arc', color: '#3b82f6', size: 30 },
        distractor: { type: 'line', color: '#3b82f6', angle: 90, size: 30 }
    },
    conjunction: {
        name: 'Conjunction — Red circle among red squares & blue circles',
        description: 'Searching for combined features requires serial attention - much slower! You must check each item individually.',
        target: { type: 'circle', color: '#ef4444', size: 30 },
        distractor: { type: 'circle', color: '#3b82f6', size: 30, alt: { type: 'square', color: '#ef4444', size: 30 } }
    }
};

// DOM elements
const featureSelect = document.getElementById('featureSelect');
const featureDescription = document.getElementById('featureDescription');
const distractorSlider = document.getElementById('distractorSlider');
const distractorCount = document.getElementById('distractorCount');
const trialsSlider = document.getElementById('trialsSlider');
const trialsCount = document.getElementById('trialsCount');
const durationSlider = document.getElementById('durationSlider');
const durationCount = document.getElementById('durationCount');
const readyState = document.getElementById('readyState');
const playingState = document.getElementById('playingState');
const resultState = document.getElementById('resultState');
const startButton = document.getElementById('startButton');
const presentButton = document.getElementById('presentButton');
const absentButton = document.getElementById('absentButton');
const tryAgainButton = document.getElementById('tryAgainButton');
const canvas = document.getElementById('canvas');

// Initialize
function init() {
    updateFeatureDescription();
    featureSelect.addEventListener('change', (e) => {
        selectedFeature = e.target.value;
        updateFeatureDescription();
        reset();
    });
    distractorSlider.addEventListener('input', (e) => {
        numDistractors = parseInt(e.target.value);
        distractorCount.textContent = numDistractors;
    });
    trialsSlider.addEventListener('input', (e) => {
        numTrials = parseInt(e.target.value);
        trialsCount.textContent = numTrials;
    });
    durationSlider.addEventListener('input', (e) => {
        displayDuration = parseInt(e.target.value);
        durationCount.textContent = displayDuration;
    });
    startButton.addEventListener('click', startGame);
    presentButton.addEventListener('click', () => handleResponse(true));
    absentButton.addEventListener('click', () => handleResponse(false));
    tryAgainButton.addEventListener('click', startGame);
}

function updateFeatureDescription() {
    featureDescription.textContent = features[selectedFeature].description;
}

function reset() {
    gameState = 'ready';
    showState('ready');
}

function showState(state) {
    readyState.style.display = state === 'ready' ? 'block' : 'none';
    playingState.style.display = state === 'playing' ? 'block' : 'none';
    resultState.style.display = state === 'success' || state === 'failure' ? 'block' : 'none';
}

function startGame() {
    currentTrial = 0;
    trialResults = [];
    document.getElementById('totalTrials').textContent = numTrials;
    
    // Show playing state
    gameState = 'playing';
    showState('playing');
    
    // Show countdown overlay
    const countdownDisplay = document.getElementById('countdownDisplay');
    const countdownNumber = document.getElementById('countdownNumber');
    
    countdownDisplay.style.display = 'flex';
    
    let count = 3;
    countdownNumber.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none';
            startTrial();
        }
    }, 1000);
}

function startTrial() {
    gameState = 'playing';
    showState('playing');
    
    // Update progress
    document.getElementById('trialProgress').textContent = currentTrial + 1;
    
    generateElements();
    renderElements();
    
    // Debug: show if target is actually present
    document.getElementById('debugInfo').textContent = `(Actually: ${targetPresent ? 'Present' : 'Absent'})`;
    
    // Make sure canvas is visible
    canvas.style.opacity = '1';
    canvas.style.visibility = 'visible';
    
    // Start timing when display appears
    startTime = Date.now();
    
    // Hide display after duration
    if (displayDuration < 500) {
        displayTimeout = setTimeout(() => {
            canvas.style.visibility = 'hidden';
        }, displayDuration);
    }
}

function generateElements() {
    elements = [];
    const gridSize = Math.ceil(Math.sqrt(numDistractors + 1)) + 1;
    const cellSize = 350 / gridSize;
    const positions = [];
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            positions.push({
                x: i * cellSize + cellSize / 2 + (Math.random() - 0.5) * cellSize * 0.4,
                y: j * cellSize + cellSize / 2 + (Math.random() - 0.5) * cellSize * 0.4
            });
        }
    }
    
    positions.sort(() => Math.random() - 0.5);
    targetPresent = Math.random() > 0.5;
    
    let startIdx = 0;
    if (targetPresent) {
        const targetIdx = Math.floor(Math.random() * Math.min(positions.length, numDistractors + 1));
        elements.push({
            ...positions[targetIdx],
            isTarget: true,
            ...features[selectedFeature].target
        });
        startIdx = 1;
    }
    
    const numDistractorsToAdd = targetPresent ? numDistractors : numDistractors + 1;
    for (let i = 0; i < numDistractorsToAdd && i + startIdx < positions.length; i++) {
        const idx = i + startIdx;
        const distractor = features[selectedFeature].distractor;
        
        if (distractor.alt) {
            const useAlt = Math.random() > 0.5;
            elements.push({
                ...positions[idx],
                isTarget: false,
                ...(useAlt ? distractor.alt : distractor)
            });
        } else {
            elements.push({
                ...positions[idx],
                isTarget: false,
                ...distractor
            });
        }
    }
}

function renderElements() {
    canvas.innerHTML = '';
    elements.forEach(element => {
        const el = createSVGElement(element);
        if (el) canvas.appendChild(el);
    });
}

function createSVGElement(element) {
    if (element.type === 'circle') {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', element.x);
        circle.setAttribute('cy', element.y);
        circle.setAttribute('r', element.size / 2);
        circle.setAttribute('fill', element.color);
        g.appendChild(circle);
        
        if (element.enclosed) {
            const enclosure = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            enclosure.setAttribute('cx', element.x);
            enclosure.setAttribute('cy', element.y);
            enclosure.setAttribute('r', element.size / 2 + 8);
            enclosure.setAttribute('fill', 'none');
            enclosure.setAttribute('stroke', element.color);
            enclosure.setAttribute('stroke-width', '2');
            g.appendChild(enclosure);
        }
        return g;
    } else if (element.type === 'square') {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', element.x - element.size / 2);
        rect.setAttribute('y', element.y - element.size / 2);
        rect.setAttribute('width', element.size);
        rect.setAttribute('height', element.size);
        rect.setAttribute('fill', element.color);
        return rect;
    } else if (element.type === 'line') {
        const length = element.size;
        const angle = element.angle * (Math.PI / 180);
        const x1 = element.x - (length / 2) * Math.cos(angle);
        const y1 = element.y - (length / 2) * Math.sin(angle);
        const x2 = element.x + (length / 2) * Math.cos(angle);
        const y2 = element.y + (length / 2) * Math.sin(angle);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', element.color);
        line.setAttribute('stroke-width', '4');
        line.setAttribute('stroke-linecap', 'round');
        return line;
    } else if (element.type === 'arc') {
        const size = element.size;
        const radius = size / 2;
        const startX = element.x - radius;
        const startY = element.y;
        const endX = element.x + radius;
        const endY = element.y;
        const controlY = element.y - radius;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${startX} ${startY} Q ${element.x} ${controlY} ${endX} ${endY}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', element.color);
        path.setAttribute('stroke-width', '4');
        path.setAttribute('stroke-linecap', 'round');
        return path;
    }
    return null;
}

function handleResponse(userSaysPresent) {
    if (gameState !== 'playing') return;
    
    // Clear display timeout if it exists
    if (displayTimeout) {
        clearTimeout(displayTimeout);
        displayTimeout = null;
    }
    
    const endTime = Date.now();
    reactionTime = endTime - startTime;
    const correct = userSaysPresent === targetPresent;
    
    // Show immediate feedback
    const feedbackEl = document.getElementById('feedbackMessage');
    if (correct) {
        feedbackEl.textContent = '✓ Correct!';
        feedbackEl.style.color = '#10b981';
    } else {
        feedbackEl.textContent = `✗ Wrong (was ${targetPresent ? 'Present' : 'Absent'})`;
        feedbackEl.style.color = '#ef4444';
    }
    
    // Store trial result
    trialResults.push({
        trial: currentTrial + 1,
        correct: correct,
        time: reactionTime,
        targetPresent: targetPresent
    });
    
    currentTrial++;
    
    // Check if we've completed all trials
    if (currentTrial >= numTrials) {
        gameState = 'success';
        setTimeout(() => {
            showFinalResults();
        }, 800);
    } else {
        // Brief pause then start next trial
        canvas.style.visibility = 'hidden';
        setTimeout(() => {
            feedbackEl.textContent = '';
            startTrial();
        }, 800);
    }
}

function showFinalResults() {
    showState('success');
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const resultTime = document.getElementById('resultTime');
    const resultExplanation = document.getElementById('resultExplanation');
    
    // Calculate statistics
    const correctTrials = trialResults.filter(t => t.correct).length;
    const accuracy = ((correctTrials / numTrials) * 100).toFixed(1);
    const avgTime = Math.round(trialResults.reduce((sum, t) => sum + t.time, 0) / numTrials);
    
    resultIcon.textContent = '✓';
    resultIcon.className = 'result-icon success';
    resultTitle.textContent = 'Trials Complete!';
    resultTitle.className = 'result-title success';
    resultMessage.textContent = `Accuracy: ${correctTrials}/${numTrials} (${accuracy}%)`;
    resultTime.textContent = `Average: ${avgTime} ms`;
    
    if (features[selectedFeature].name.includes('Conjunction')) {
        resultExplanation.textContent = `Conjunction searches require checking items one by one, making them much slower than preattentive features.`;
    } else {
        resultExplanation.textContent = `Preattentive features pop out instantly, regardless of the number of distractors. Your reaction times should be fairly consistent across trials.`;
    }
}

// Start the app
init();
