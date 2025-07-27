// Norwegian Time Converter - Tab Mode (Same functionality as extension)
console.log('Norwegian Time Converter - Tab Mode loaded');

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tab Mode DOM loaded - setting up event listeners...');
    
    // Set defaults
    document.getElementById('time').value = '00:00';
    document.getElementById('targetTimezone').value = 'CET';
    
    // Set today's date in HTML5 date input (yyyy-mm-dd format)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    document.getElementById('date').value = `${year}-${month}-${day}`;
    
    // Add event listeners for buttons
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const createCountdownBtn = document.getElementById('createCountdownBtn');
    const createTabBtn = document.getElementById('createTabBtn');
    const unpinBtn = document.getElementById('unpinBtn');
    
    if (convertBtn) {
        convertBtn.addEventListener('click', convertNow);
        console.log('Convert button event listener added');
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAll);
        console.log('Clear button event listener added');
    }
    
    // Countdown functionality
    if (createCountdownBtn) {
        createCountdownBtn.addEventListener('click', createCountdown);
    }
    
    // Tab functionality - Create another tab
    if (createTabBtn) {
        createTabBtn.addEventListener('click', createNewTab);
    }
    
    // Unpin functionality - Create floating window
    if (unpinBtn) {
        unpinBtn.addEventListener('click', toggleFloatingWindow);
    }
    
    // Auto-save state as user interacts
    const inputs = ['timezone', 'date', 'time', 'ampm', 'targetTimezone'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', saveCurrentState);
            element.addEventListener('input', saveCurrentState);
        }
    });
    
    // Add mouse wheel functionality for time and date inputs
    addMouseWheelSupport();
    
    // Try to restore state
    restoreStateFromStorage();
    
    console.log('Tab Mode initialization complete');
});

// Create Tab functionality
function createNewTab() {
    const createTabBtn = document.getElementById('createTabBtn');
    
    // Save current state first
    saveCurrentState();
    
    // Open a new tab with the tab calculator
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({
            url: chrome.runtime.getURL('tab-calculator.html'),
            active: true
        });
        
        // Update button to show active state
        createTabBtn.textContent = 'Tab Created';
        createTabBtn.classList.add('active');
        
        // Reset after 2 seconds
        setTimeout(() => {
            createTabBtn.textContent = 'Create Tab';
            createTabBtn.classList.remove('active');
        }, 2000);
        
        console.log('New tab created');
    } else {
        console.log('Chrome tabs API not available');
    }
}

// Unpin functionality - creates real OS window
function toggleFloatingWindow() {
  const unpinBtn = document.getElementById('unpinBtn');
  
  // Collect current state
  const currentState = {
    timezone: document.getElementById('timezone').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    ampm: document.getElementById('ampm').value,
    targetTimezone: document.getElementById('targetTimezone').value,
    resultTime: document.getElementById('resultTime').textContent,
    resultDetails: document.getElementById('resultDetails').innerHTML
  };
  
  console.log('Creating floating window with state:', currentState);
  
  // Send message to background script to create window
  chrome.runtime.sendMessage({
    action: 'createWindow',
    data: currentState
  }, (response) => {
    if (response && response.success) {
      console.log('Window creation requested successfully');
      
      // Update button temporarily
      unpinBtn.textContent = 'Window Created';
      unpinBtn.classList.add('active');
      
      // Reset button after 2 seconds
      setTimeout(() => {
        unpinBtn.textContent = 'Unpin Window';
        unpinBtn.classList.remove('active');
      }, 2000);
    } else {
      console.error('Failed to create window');
    }
  });
}
// Convert function - handles all timezones including UTC offsets
function convertNow() {
    console.log('Tab Mode Convert button clicked');
    
    const timezone = document.getElementById('timezone').value;
    const time = document.getElementById('time').value;
    const ampm = document.getElementById('ampm').value;
    const target = document.getElementById('targetTimezone').value;
    const date = document.getElementById('date').value;
    
    // Source timezone from the main dropdown
    const sourceTimezone = timezone;
    
    if (!sourceTimezone) {
        document.getElementById('resultTime').textContent = 'Select timezone';
        document.getElementById('resultDetails').innerHTML = 'Please select a source timezone';
        return;
    }
    
    if (!time) {
        document.getElementById('resultTime').textContent = 'Enter time';
        document.getElementById('resultDetails').innerHTML = 'Please enter a time to convert';
        return;
    }
    
    try {
        const result = performConversion(sourceTimezone, time, ampm, target, date);
        displayResult(result);
    } catch (error) {
        console.error('Tab Mode conversion error:', error);
        document.getElementById('resultTime').textContent = 'Error';
        document.getElementById('resultDetails').innerHTML = 'Conversion failed: ' + error.message;
    }
}

// Clear function
function clearAll() {
    console.log('Tab Mode Clear button clicked');
    
    document.getElementById('timezone').value = '';
    
    // Reset date to today in HTML5 format (yyyy-mm-dd)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    document.getElementById('date').value = `${year}-${month}-${day}`;
    
    document.getElementById('time').value = '00:00';
    document.getElementById('ampm').value = '';
    document.getElementById('targetTimezone').value = 'CET';
    
    document.getElementById('resultTime').textContent = 'Select timezone';
    document.getElementById('resultDetails').innerHTML = 'Select a timezone from the dropdown above';
    
    // Hide countdown section (green box and button)
    const countdownSection = document.getElementById('countdownSection');
    if (countdownSection) {
        countdownSection.style.display = 'none';
    }
}

// Create countdown functionality
function createCountdown() {
    console.log('Tab Mode Creating countdown...');
    
    // Get current form values
    const timezone = document.getElementById('timezone').value;
    const time = document.getElementById('time').value;
    const ampm = document.getElementById('ampm').value;
    const target = document.getElementById('targetTimezone').value;
    const date = document.getElementById('date').value;
    
    if (!timezone || !time) {
        alert('Please convert a time first to create a countdown');
        return;
    }
    
    try {
        // Perform conversion to get target datetime
        const result = performConversion(timezone, time, ampm, target, date);
        
        // Calculate target datetime
        const targetDate = new Date(date || new Date().toISOString().split('T')[0]);
        const [hours, minutes] = result.time24h.split(':').map(Number);
        targetDate.setHours(hours, minutes, 0, 0);
        
        // Check if time is in the future
        const now = new Date();
        if (targetDate.getTime() <= now.getTime()) {
            alert('Cannot create countdown for past time. Please select a future time.');
            return;
        }
        
        // Prepare countdown data
        const countdownData = {
            sourceTime: result.sourceTime,
            sourceTimezone: result.sourceTimezone,
            targetTime: result.time24h,
            time12h: result.time12h,
            targetTimezone: result.targetTimezone,
            targetDateTime: targetDate.toISOString(),
            date: date || new Date().toISOString().split('T')[0],
            timeRelative: result.timeRelative
        };
        
        console.log('Tab Mode countdown data:', countdownData);
        
        // Store data in localStorage
        localStorage.setItem('countdownData', JSON.stringify(countdownData));
        
        // Open countdown in new tab
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.create({
                url: chrome.runtime.getURL('countdown.html'),
                active: true
            });
        } else {
            // Fallback for non-extension context
            window.open('countdown.html', '_blank');
        }
        
        console.log('Tab Mode countdown tab created');
        
    } catch (error) {
        console.error('Tab Mode error creating countdown:', error);
        alert('Error creating countdown. Please try again.');
    }
}

// State management functions
function saveCurrentState() {
    const currentState = {
        timezone: document.getElementById('timezone').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        ampm: document.getElementById('ampm').value,
        targetTimezone: document.getElementById('targetTimezone').value,
        resultTime: document.getElementById('resultTime').textContent,
        resultDetails: document.getElementById('resultDetails').innerHTML
    };
    
    try {
        localStorage.setItem('timeConverterState', JSON.stringify(currentState));
    } catch (e) {
        console.log('Could not save state:', e);
    }
}

function restoreStateFromStorage() {
    try {
        const savedState = localStorage.getItem('timeConverterState');
        if (savedState) {
            const state = JSON.parse(savedState);
            
            // Restore form values
            if (state.timezone) document.getElementById('timezone').value = state.timezone;
            if (state.date) document.getElementById('date').value = state.date;
            if (state.time) document.getElementById('time').value = state.time;
            if (state.ampm) document.getElementById('ampm').value = state.ampm;
            if (state.targetTimezone) document.getElementById('targetTimezone').value = state.targetTimezone;
            
            // Restore results
            if (state.resultTime) document.getElementById('resultTime').textContent = state.resultTime;
            if (state.resultDetails) document.getElementById('resultDetails').innerHTML = state.resultDetails;
            
            console.log('Tab Mode state restored from storage');
        }
    } catch (e) {
        console.log('Could not restore tab mode state:', e);
    }
}
// Conversion function (same as original extension)
function performConversion(sourceTimezone, time, ampm, targetTimezone, date) {
    console.log('Tab Mode performing conversion...');
    
    // Timezone offset mapping
    const offsets = {
        'PST': -8, 'PDT': -7,
        'EST': -5, 'EDT': -4,
        'CST': -6, 'CDT': -5,
        'MST': -7, 'MDT': -6,
        'CET': +1, 'CEST': +2,
        'GMT': 0, 'UTC': 0,
        'BST': +1,
        'EET': +2, 'EEST': +3,
        'JST': +9, 'KST': +9,
        'IST': +5.5, 'CST_CN': +8,
        'ICT': +7,
        'AEST': +10, 'AEDT': +11,
        'AWST': +8,
        'NZST': +12, 'NZDT': +13,
        'WAT': +1, 'CAT': +2, 'EAT': +3,
        // UTC offsets
        'UTC-12': -12, 'UTC-11': -11, 'UTC-10': -10, 'UTC-9': -9,
        'UTC-8': -8, 'UTC-7': -7, 'UTC-6': -6, 'UTC-5': -5,
        'UTC-4': -4, 'UTC-3': -3, 'UTC-2': -2, 'UTC-1': -1,
        'UTC+0': 0, 'UTC+1': +1, 'UTC+2': +2, 'UTC+3': +3,
        'UTC+4': +4, 'UTC+5': +5, 'UTC+6': +6, 'UTC+7': +7,
        'UTC+8': +8, 'UTC+9': +9, 'UTC+10': +10, 'UTC+11': +11, 'UTC+12': +12
    };
    
    // Auto-select CET/CEST for target
    let actualTargetTimezone = targetTimezone;
    if (targetTimezone === 'CET') {
        const now = new Date();
        const month = now.getMonth() + 1;
        actualTargetTimezone = (month >= 3 && month <= 10) ? 'CEST' : 'CET';
    }
    
    const sourceOffset = offsets[sourceTimezone];
    const targetOffset = offsets[actualTargetTimezone];
    
    if (sourceOffset === undefined) {
        throw new Error('Unknown source timezone: ' + sourceTimezone);
    }
    if (targetOffset === undefined) {
        throw new Error('Unknown target timezone: ' + actualTargetTimezone);
    }
    
    // Parse date - HTML5 date input gives yyyy-mm-dd format
    let parsedDate = null;
    if (date) {
        parsedDate = date;
        console.log('Using provided date:', parsedDate);
    } else {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        parsedDate = `${year}-${month}-${day}`;
        console.log('Using today as date:', parsedDate);
    }
    
    // Parse time and handle AM/PM
    let [hours, minutes] = time.split(':').map(Number);
    
    // Handle AM/PM conversion
    if (ampm === 'AM' && hours === 12) {
        hours = 0;
    } else if (ampm === 'PM' && hours !== 12) {
        hours += 12;
    }
    
    // Create source time display with AM/PM if provided
    let sourceTimeDisplay;
    if (ampm) {
        let displayHours = hours;
        let displayAmPm = 'AM';
        if (hours === 0) {
            displayHours = 12;
        } else if (hours === 12) {
            displayAmPm = 'PM';
        } else if (hours > 12) {
            displayHours = hours - 12;
            displayAmPm = 'PM';
        }
        sourceTimeDisplay = `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${displayAmPm}`;
    } else {
        sourceTimeDisplay = time;
    }
    
    // Convert to target timezone
    const utcHours = hours - sourceOffset;
    const targetHours = utcHours + targetOffset;
    
    // Handle day overflow/underflow (but don't show it)
    let finalHours = targetHours;
    
    if (finalHours >= 24) {
        finalHours -= 24;
    } else if (finalHours < 0) {
        finalHours += 24;
    }
    
    // Create result time in 24h format
    const time24h = `${String(finalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    // Create 12h format
    let hours12 = finalHours;
    let resultAmpm = 'AM';
    
    if (hours12 === 0) {
        hours12 = 12;
    } else if (hours12 === 12) {
        resultAmpm = 'PM';
    } else if (hours12 > 12) {
        hours12 -= 12;
        resultAmpm = 'PM';
    }
    
    const time12h = `${hours12}:${String(minutes).padStart(2, '0')} ${resultAmpm}`;
    
    // Calculate time until/since
    const timeRelativeText = calculateTimeRelative(finalHours, minutes, parsedDate, actualTargetTimezone);
    console.log('Tab Mode time relative calculated:', timeRelativeText);
    
    return {
        time24h: time24h,
        time12h: time12h,
        sourceTime: sourceTimeDisplay,
        sourceTimezone: sourceTimezone,
        targetTimezone: actualTargetTimezone,
        timeRelative: timeRelativeText
    };
}
// Calculate time until/since the converted time - handles both future and past
function calculateTimeRelative(targetHours, targetMinutes, inputDate, targetTimezone) {
    try {
        // Use input date or today
        let useDate;
        if (inputDate) {
            useDate = inputDate;
        } else {
            useDate = new Date().toISOString().split('T')[0];
        }
        
        const targetDate = new Date(useDate);
        targetDate.setHours(targetHours, targetMinutes, 0, 0);
        
        const now = new Date();
        const diffMs = targetDate.getTime() - now.getTime();
        const isPast = diffMs < 0;
        const absDiffMs = Math.abs(diffMs);
        
        // Convert to units
        let totalMinutes = Math.floor(absDiffMs / (1000 * 60));
        let totalHours = Math.floor(totalMinutes / 60);
        let totalDays = Math.floor(totalHours / 24);
        let totalMonths = Math.floor(totalDays / 30);
        let totalYears = Math.floor(totalDays / 365);
        
        // Calculate remaining units
        let remainingMonths = totalMonths % 12;
        let remainingDays = totalDays % 30;
        let remainingHours = totalHours % 24;
        let remainingMinutes = totalMinutes % 60;
        
        // Build result array with all relevant units
        let timeParts = [];
        
        if (totalYears > 0) {
            timeParts.push(`${totalYears} years`);
            if (remainingMonths > 0) timeParts.push(`${remainingMonths} months`);
            if (remainingDays > 0) timeParts.push(`${remainingDays} days`);
            if (remainingHours > 0) timeParts.push(`${remainingHours} hours`);
            if (remainingMinutes > 0) timeParts.push(`${remainingMinutes} minutes`);
        } else if (totalMonths > 0) {
            timeParts.push(`${totalMonths} months`);
            if (remainingDays > 0) timeParts.push(`${remainingDays} days`);
            if (remainingHours > 0) timeParts.push(`${remainingHours} hours`);
            if (remainingMinutes > 0) timeParts.push(`${remainingMinutes} minutes`);
        } else if (totalDays > 0) {
            timeParts.push(`${totalDays} days`);
            if (remainingHours > 0) timeParts.push(`${remainingHours} hours`);
            if (remainingMinutes > 0) timeParts.push(`${remainingMinutes} minutes`);
        } else if (totalHours > 0) {
            timeParts.push(`${totalHours} hours`);
            if (remainingMinutes > 0) timeParts.push(`${remainingMinutes} minutes`);
        } else if (totalMinutes > 0) {
            timeParts.push(`${totalMinutes} minutes`);
        } else {
            return isPast ? 'just happened' : 'happening now';
        }
        
        const timeText = timeParts.join(' ');
        return isPast ? `${timeText} ago` : `${timeText} to go`;
        
    } catch (error) {
        console.error('Tab Mode time relative calculation error:', error);
        return null;
    }
}

// Display result
function displayResult(result) {
    console.log('Tab Mode displaying result:', result);
    
    // Don't show the big time display - leave it empty or hide it
    document.getElementById('resultTime').textContent = '';
    
    const targetName = result.targetTimezone === 'CET' || result.targetTimezone === 'CEST' ? 
        'CET / CEST NORWAY' : result.targetTimezone;
    
    // Make only the converted time (24h) highlighted in the conversion line
    let details = `${result.sourceTime} ${result.sourceTimezone} = <span style="color: #007aff; font-weight: 700;">${result.time24h}</span> (${result.time12h}) ${targetName}`;
    
    if (result.timeRelative) {
        details += `<br><br>${result.timeRelative}`;
        console.log('Tab Mode added time relative to details:', result.timeRelative);
    } else {
        console.log('Tab Mode no time relative data available');
    }
    
    document.getElementById('resultDetails').innerHTML = details;
    console.log('Tab Mode final details HTML:', details);
    
    // Show countdown button if result shows future time
    const countdownSection = document.getElementById('countdownSection');
    if (result.timeRelative && !result.timeRelative.includes('ago')) {
        countdownSection.style.display = 'block';
        
        // Update countdown info - remove "to go" from text
        const countdownInfo = document.getElementById('countdownInfo');
        const cleanTimeText = result.timeRelative.replace(' to go', '');
        countdownInfo.textContent = `Creates a countdown timer for ${cleanTimeText}`;
    } else {
        countdownSection.style.display = 'none';
    }
}

// Mouse wheel support for time and date inputs
function addMouseWheelSupport() {
    const timeInput = document.getElementById('time');
    const dateInput = document.getElementById('date');
    
    // Time input mouse wheel support
    if (timeInput) {
        timeInput.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            const currentValue = this.value;
            if (!currentValue) return;
            
            const [hours, minutes] = currentValue.split(':').map(Number);
            let newHours = hours;
            let newMinutes = minutes;
            
            if (e.deltaY < 0) {
                // Scroll up - increase time
                newMinutes += 15;
                if (newMinutes >= 60) {
                    newMinutes = 0;
                    newHours++;
                    if (newHours >= 24) {
                        newHours = 0;
                    }
                }
            } else {
                // Scroll down - decrease time
                newMinutes -= 15;
                if (newMinutes < 0) {
                    newMinutes = 45;
                    newHours--;
                    if (newHours < 0) {
                        newHours = 23;
                    }
                }
            }
            
            const newTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
            this.value = newTime;
            
            // Trigger change event to update conversion
            this.dispatchEvent(new Event('change'));
        });
    }
    
    // Date input mouse wheel support
    if (dateInput) {
        dateInput.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            const currentValue = this.value;
            if (!currentValue) return;
            
            const currentDate = new Date(currentValue);
            
            if (e.deltaY < 0) {
                // Scroll up - next day
                currentDate.setDate(currentDate.getDate() + 1);
            } else {
                // Scroll down - previous day
                currentDate.setDate(currentDate.getDate() - 1);
            }
            
            // Format date as YYYY-MM-DD
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            this.value = `${year}-${month}-${day}`;
            
            // Trigger change event to update conversion
            this.dispatchEvent(new Event('change'));
        });
    }
}

console.log('Tab Mode JavaScript loaded successfully');