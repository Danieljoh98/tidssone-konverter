// Countdown Timer JavaScript
console.log('Countdown timer loaded');

let countdownInterval;
let totalSeconds = 0;
let originalTotalSeconds = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Get countdown data from URL parameters or localStorage
    getCountdownData();
    
    // Add event listener for edit title button
    const editTitleBtn = document.getElementById('editTitleBtn');
    if (editTitleBtn) {
        editTitleBtn.addEventListener('click', editTitle);
    }
});

function getCountdownData() {
    // Try to get data from localStorage first
    const countdownData = localStorage.getItem('countdownData');
    
    if (countdownData) {
        try {
            const data = JSON.parse(countdownData);
            console.log('Countdown data:', data);
            
            // Calculate target time
            const targetTime = new Date(data.targetDateTime);
            const now = new Date();
            const timeDiff = targetTime.getTime() - now.getTime();
            
            if (timeDiff > 0) {
                totalSeconds = Math.floor(timeDiff / 1000);
                originalTotalSeconds = totalSeconds;
                
                // Update display info
                updateTargetInfo(data);
                
                // Start countdown
                startCountdown();
            } else {
                showFinished();
            }
            
            // Clean up localStorage
            localStorage.removeItem('countdownData');
            
        } catch (e) {
            console.error('Error parsing countdown data:', e);
            showError();
        }
    } else {
        console.log('No countdown data found');
        showError();
    }
}

function updateTargetInfo(data) {
    const mainTitle = document.getElementById('mainTitle');
    const targetInfo = document.getElementById('targetInfo');
    const detailsInfo = document.getElementById('detailsInfo');
    
    // Update main title with countdown info
    mainTitle.textContent = `Counting down to ${data.time12h} ${data.sourceTimezone} to ${data.targetTime} in ${data.targetTimezone}`;
    
    // Keep subtitle empty by default
    targetInfo.textContent = '';
    
    detailsInfo.innerHTML = `
        <strong>Target:</strong> ${data.targetTime} (${data.time12h}) ${data.targetTimezone}<br>
        <strong>Source:</strong> ${data.sourceTime} ${data.sourceTimezone}<br>
        <strong>Date:</strong> ${data.date}
    `;
}

function startCountdown() {
    updateDisplay();
    
    countdownInterval = setInterval(() => {
        totalSeconds--;
        
        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            showFinished();
        } else {
            updateDisplay();
        }
    }, 1000);
}

function updateDisplay() {
    const totalDays = Math.floor(totalSeconds / (3600 * 24));
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const timeDisplay = document.getElementById('timeDisplay');
    const timeUnits = document.getElementById('timeUnits');
    const progressBar = document.getElementById('progressBar');
    
    // Format time display
    let displayText = '';
    let unitsText = '';
    
    if (months > 0) {
        displayText = `${months}:${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        unitsText = `${months} months, ${days} days, ${hours} hours, ${minutes} minutes remaining`;
    } else if (days > 0) {
        displayText = `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        unitsText = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`;
    } else if (hours > 0) {
        displayText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        unitsText = `${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`;
    } else if (minutes > 0) {
        displayText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        unitsText = `${minutes} minutes, ${seconds} seconds remaining`;
    } else {
        displayText = `${seconds.toString().padStart(2, '0')}`;
        unitsText = `${seconds} seconds remaining`;
    }
    
    timeDisplay.textContent = displayText;
    timeUnits.textContent = unitsText;
    
    // Update progress bar
    if (originalTotalSeconds > 0) {
        const progress = ((originalTotalSeconds - totalSeconds) / originalTotalSeconds) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

function showFinished() {
    const countdownDisplay = document.querySelector('.countdown-display');
    countdownDisplay.innerHTML = `
        <div class="countdown-finished">🎉 Time's Up! 🎉</div>
        <div class="time-units">Your target time has been reached!</div>
    `;
    
    // Play notification sound (if supported)
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaAxKe2/dOMQUsheHwz30oAyOAzvLZiTYHGGpAs+etPtd38N1uNAUrftLa8+2PZjfH89+OOgkVYrLc53RMGAcJKKnHm0scBz6FzPnqhWQHBjGH0e/OdSr5NnzI5tdUGAwKU5/Y41w7ES2e1PHVgzMFJofM7tl+KgQhfcnYpFcdCzybzO+eWRMJKamBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaAxKe2/dOMQUsheHwz30oAyOAzvLZiTYHGGpAs+etPtd38N1uNAUrftLa8+2PZjfH89+OOgkVYrLc53RMGAcJKKnHm0scBz6FzPnqhWQHBjGH0e/OdSr5NnzI5tdUGAwKU5/Y41w7ES2e1PHVgzMFJofM7tl+KgQhfcnYpFcdCzybzO+eWRMJKam');
        audio.play();
    } catch (e) {
        console.log('Could not play notification sound');
    }
    
    // Animate the page
    document.body.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)';
}

function showError() {
    const countdownDisplay = document.querySelector('.countdown-display');
    countdownDisplay.innerHTML = `
        <div class="time-remaining" style="font-size: 2rem;">❌ Error</div>
        <div class="time-units">Could not load countdown data</div>
    `;
    
    document.getElementById('mainTitle').textContent = 'Countdown data not found';
    document.getElementById('targetInfo').textContent = '';
    document.getElementById('detailsInfo').textContent = 'Please create a new countdown from the time converter.';
}

function editTitle() {
    const targetInfo = document.getElementById('targetInfo');
    const currentText = targetInfo.textContent || '';
    
    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.placeholder = 'Add a description for this countdown...';
    input.style.cssText = `
        background: rgba(255,255,255,0.9);
        border: 2px solid #BA1A2C;
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 2.5rem;
        font-weight: 800;
        color: #1d1d1f;
        width: 100%;
        max-width: 800px;
        font-family: inherit;
        text-align: center;
    `;
    
    // Replace text with input
    targetInfo.innerHTML = '';
    targetInfo.appendChild(input);
    input.focus();
    input.select();
    
    // Save on Enter or blur
    function saveTitle() {
        const newText = input.value.trim();
        targetInfo.textContent = newText;
        input.removeEventListener('blur', saveTitle);
        input.removeEventListener('keydown', handleKeydown);
    }
    
    function handleKeydown(e) {
        if (e.key === 'Enter') {
            saveTitle();
        } else if (e.key === 'Escape') {
            targetInfo.textContent = currentText;
            input.removeEventListener('blur', saveTitle);
            input.removeEventListener('keydown', handleKeydown);
        }
    }
    
    input.addEventListener('blur', saveTitle);
    input.addEventListener('keydown', handleKeydown);
}

console.log('Countdown timer script loaded');
