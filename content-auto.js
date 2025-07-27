// NORSK TIDSKONVERTER - Kun manual aktivering
console.log('🚀 NORSK TIDSKONVERTER LASTET - VERSJON 3.0!');
console.log('📍 Current URL:', window.location.href);
console.log('🖼️ Is iframe:', window !== window.top);
console.log('🌐 Domain:', window.location.hostname);

// Lagrer originale tider for tilbakestilling
let originalElements = new Map();
let convertedCount = 0;

// Legg til CSS for konverterte tider
function addStyles() {
    if (document.getElementById('norwegian-time-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'norwegian-time-styles';
    style.textContent = `
        .norwegian-time-converted {
            /* Ingen spesiell styling på selve tiden */
        }
        
        .norsk-tid-label {
            background: linear-gradient(90deg, #ef233c 33%, #ffffff 33%, #ffffff 66%, #2e5bba 66%);
            color: #000;
            padding: 1px 3px;
            border-radius: 2px;
            font-size: 0.8em;
            font-weight: bold;
            margin-left: 2px;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);
    console.log('✅ Styles added');
}
// KOMPLETT tidssone mapping - alle globale tidssoner
const timezoneMap = {
    // 🌍 Globale og standard tidssoner (UTC-baserte)
    'UTC': 'UTC',
    'GMT': 'UTC',
    
    // 🌍 Europa
    'CET': 'Europe/Berlin',           // Central European Time (UTC+01:00)
    'CEST': 'Europe/Berlin',          // Central European Summer Time (UTC+02:00)
    'EET': 'Europe/Athens',           // Eastern European Time (UTC+02:00)
    'EEST': 'Europe/Athens',          // Eastern European Summer Time (UTC+03:00)
    'WET': 'Europe/Lisbon',           // Western European Time (UTC+00:00)
    'WEST': 'Europe/Lisbon',          // Western European Summer Time (UTC+01:00)
    'BST': 'Europe/London',           // British Summer Time (UTC+01:00)
    'IST_IE': 'Europe/Dublin',        // Irish Standard Time (UTC+01:00)
    'MSK': 'Europe/Moscow',           // Moscow Standard Time (UTC+03:00)
    
    // 🌎 Amerika
    'EST': 'America/New_York',        // Eastern Standard Time (UTC-05:00)
    'EDT': 'America/New_York',        // Eastern Daylight Time (UTC-04:00)
    'CST': 'America/Chicago',         // Central Standard Time (UTC-06:00)
    'CDT': 'America/Chicago',         // Central Daylight Time (UTC-05:00)
    'MST': 'America/Denver',          // Mountain Standard Time (UTC-07:00)
    'MDT': 'America/Denver',          // Mountain Daylight Time (UTC-06:00)
    'PST': 'America/Los_Angeles',     // Pacific Standard Time (UTC-08:00)
    'PDT': 'America/Los_Angeles',     // Pacific Daylight Time (UTC-07:00)
    'AKST': 'America/Anchorage',      // Alaska Standard Time (UTC-09:00)
    'AKDT': 'America/Anchorage',      // Alaska Daylight Time (UTC-08:00)
    'HST': 'Pacific/Honolulu',        // Hawaii Standard Time (UTC-10:00)
    'AST': 'America/Halifax',         // Atlantic Standard Time (UTC-04:00)
    'NST': 'America/St_Johns',        // Newfoundland Standard Time (UTC-03:30)
    'NDT': 'America/St_Johns',        // Newfoundland Daylight Time (UTC-02:30)
    'BRT': 'America/Sao_Paulo',       // Brasília Time (UTC-03:00)
    'ART': 'America/Argentina/Buenos_Aires', // Argentina Time (UTC-03:00)
    
    // 🌏 Asia
    'IST': 'Asia/Kolkata',            // India Standard Time (UTC+05:30)
    'IST_IN': 'Asia/Kolkata',         // India Standard Time explicit
    'PKT': 'Asia/Karachi',            // Pakistan Standard Time (UTC+05:00)
    'ICT': 'Asia/Bangkok',            // Indochina Time (UTC+07:00)
    'THA': 'Asia/Bangkok',            // Thailand Standard Time (UTC+07:00)
    'CST_CN': 'Asia/Shanghai',        // China Standard Time (UTC+08:00)
    'JST': 'Asia/Tokyo',              // Japan Standard Time (UTC+09:00)
    'KST': 'Asia/Seoul',              // Korea Standard Time (UTC+09:00)
    'WIB': 'Asia/Jakarta',            // Western Indonesia Time (UTC+07:00)
    'WITA': 'Asia/Makassar',          // Central Indonesia Time (UTC+08:00)
    'WIT': 'Asia/Jayapura',           // Eastern Indonesia Time (UTC+09:00)
    'AST_ARABIA': 'Asia/Riyadh',      // Arabia Standard Time (UTC+03:00)
    'IRST': 'Asia/Tehran',            // Iran Standard Time (UTC+03:30)
    'AFT': 'Asia/Kabul',              // Afghanistan Time (UTC+04:30)
    
    // 🌐 Oseania og Australia
    'AWST': 'Australia/Perth',        // Australian Western Standard Time (UTC+08:00)
    'ACST': 'Australia/Adelaide',     // Australian Central Standard Time (UTC+09:30)
    'ACDT': 'Australia/Adelaide',     // Australian Central Daylight Time (UTC+10:30)
    'AEST': 'Australia/Sydney',       // Australian Eastern Standard Time (UTC+10:00)
    'AEDT': 'Australia/Sydney',       // Australian Eastern Daylight Time (UTC+11:00)
    'NZST': 'Pacific/Auckland',       // New Zealand Standard Time (UTC+12:00)
    'NZDT': 'Pacific/Auckland',       // New Zealand Daylight Time (UTC+13:00)
    'CHAST': 'Pacific/Chatham',       // Chatham Standard Time (UTC+12:45)
    'CHADT': 'Pacific/Chatham',       // Chatham Daylight Time (UTC+13:45)
    
    // 🌍 Afrika
    'WAT': 'Africa/Lagos',            // West Africa Time (UTC+01:00)
    'CAT': 'Africa/Johannesburg',     // Central Africa Time (UTC+02:00)
    'EAT': 'Africa/Nairobi',          // East Africa Time (UTC+03:00)
    'SAST': 'Africa/Johannesburg',    // South Africa Standard Time (UTC+02:00)
    
    // ❓ Andre og mindre vanlige
    'NST_KP': 'Asia/Pyongyang',       // North Korea Standard Time (UTC+09:00)
    'MYT': 'Asia/Kuala_Lumpur',       // Malaysia Time (UTC+08:00)
    'UZT': 'Asia/Tashkent',           // Uzbekistan Time (UTC+05:00)
    'YEKT': 'Asia/Yekaterinburg',     // Yekaterinburg Time (UTC+05:00)
    'VLAT': 'Asia/Vladivostok',       // Vladivostok Time (UTC+10:00)
    
    // Vanlige forkortelser (uten år/sesong)
    'PT': 'America/Los_Angeles',      // Pacific Time (generic)
    'ET': 'America/New_York',         // Eastern Time (generic)
    'CT': 'America/Chicago',          // Central Time (generic)
    'MT': 'America/Denver',           // Mountain Time (generic)
    
    // Legacy/alternative mappinger
    'CST_CHINA': 'Asia/Shanghai',     // China Standard Time (alternative)
    'HKT': 'Asia/Hong_Kong',          // Hong Kong Time
    'SGT': 'Asia/Singapore',          // Singapore Time
    'GST': 'Asia/Dubai'               // Gulf Standard Time
};

// Log timezone info after timezoneMap is defined
console.log('🌍 Supported timezones:', Object.keys(timezoneMap).length, 'total');
console.log('🕐 Available timezones:', Object.keys(timezoneMap).sort().join(', '));

// Global error handler for debugging
window.addEventListener('error', function(e) {
    console.error('🚨 Content script error:', e.error, e.filename, e.lineno);
});

// Make sure content script is accessible globally for debugging
window.norwegianTimeConverter = {
    timezoneMap,
    originalElements,
    scanAndConvert,
    convertTextPattern,
    resetAllTimes
};

function convertTimeToNorwegian(timeStr, timezone) {
    console.log(`🔄 CONVERTING: timeStr="${timeStr}", timezone="${timezone}"`);
    
    try {
        const sourceTimezone = timezoneMap[timezone.toUpperCase()];
        console.log(`🗺️ Timezone mapping: ${timezone.toUpperCase()} → ${sourceTimezone}`);
        
        if (!sourceTimezone) {
            console.log(`❌ No timezone mapping found for: ${timezone.toUpperCase()}`);
            return null;
        }
        
        // Parse tiden
        let dateObj;
        const now = new Date();
        console.log(`⏰ Parsing time: "${timeStr}"`);
        
        if (timeStr.match(/^\d{1,2}:\d{2}(am|pm)?$/i)) {
            // Format: 12:30pm eller 12:30
            let timeWithAmPm = timeStr;
            if (!timeStr.match(/(am|pm)/i)) {
                // Hvis ingen AM/PM, anta det er 24-timers format
                const hour = parseInt(timeStr.split(':')[0]);
                if (hour <= 12) {
                    timeWithAmPm = timeStr + (hour < 12 ? 'am' : 'pm');
                }
            }
            console.log(`🕐 Time with AM/PM: "${timeWithAmPm}"`);
            
            // Fix: Ensure space before AM/PM and use proper format
            timeWithAmPm = timeWithAmPm.replace(/(\d)(am|pm)/i, '$1 $2');
            const dateString = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${timeWithAmPm}`;
            console.log(`📅 Creating date from: "${dateString}"`);
            dateObj = new Date(dateString);
        } else if (timeStr.match(/^\d{1,2}\s+(am|pm)$/i)) {
            // NEW: Format: "6 PM", "9 AM" (space before AM/PM, no minutes)
            const parts = timeStr.trim().split(/\s+/);
            const hour = parseInt(parts[0]);
            const ampm = parts[1].toLowerCase();
            const timeWithMinutes = `${hour}:00 ${ampm}`;
            console.log(`🕐 Converted "${timeStr}" to "${timeWithMinutes}"`);
            
            const dateString = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${timeWithMinutes}`;
            console.log(`📅 Creating date from: "${dateString}"`);
            dateObj = new Date(dateString);
        } else {
            console.log(`🕐 Trying to parse as generic date: "${timeStr}"`);
            dateObj = new Date(timeStr);
        }
        
        console.log(`📅 Parsed dateObj:`, dateObj);
        console.log(`📅 Is valid date:`, !isNaN(dateObj.getTime()));
        
        if (isNaN(dateObj.getTime())) {
            console.log(`❌ Failed to parse date from: "${timeStr}"`);
            return null;
        }
        
        console.log(`📅 Original dateObj:`, dateObj);
        console.log(`🌍 Source timezone: ${sourceTimezone}`);
        
        // UNIVERSELL tidskonvertering for alle tidsoner
        // Bruk moderne JavaScript Date og Intl API
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();
        
        // Lag en dato med dagens dato og parsed tid
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        console.log(`⏰ Parsed time: ${hours}:${minutes}`);
        
        // Opprett en dato i kilde-tidssonen
        const sourceDate = new Date(year, month, day, hours, minutes);
        
        // Bruk Intl.DateTimeFormat for presis tidskonvertering
        // Konverter samme tidspunkt fra kilde-tidssone til norsk tid
        const formatter = new Intl.DateTimeFormat('no-NO', {
            timeZone: 'Europe/Oslo',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        // Lag en "virtuell" dato som representerer tiden i kilde-tidssonen
        // og finn hva den samme tiden ville vært i Oslo
        try {
            // Beregn offset-forskjell mellom tidssonene
            const sourceFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: sourceTimezone,
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', hour12: false
            });
            
            const osloFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Europe/Oslo',
                year: 'numeric', month: '2-digit', day: '2-digit', 
                hour: '2-digit', minute: '2-digit', hour12: false
            });
            
            // Bruk en referanse-dato for å finne offset-forskjell
            const refDate = new Date();
            const sourceTime = new Date(sourceFormatter.format(refDate));
            const osloTime = new Date(osloFormatter.format(refDate));
            const offsetDiff = osloTime.getTime() - sourceTime.getTime();
            
            console.log(`⏰ Offset difference: ${offsetDiff / (1000 * 60 * 60)} hours`);
            
            // Anvend offset-forskjellen på input-tiden
            const convertedDate = new Date(sourceDate.getTime() + offsetDiff);
            
            const norwayTimeString = convertedDate.toLocaleString('no-NO', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            
            console.log(`✅ Converted "${timeStr} ${timezone}" → "${norwayTimeString}" (Norway time)`);
            return norwayTimeString;
            
        } catch (error) {
            console.log(`❌ Error in timezone conversion:`, error);
            return null;
        }
        
    } catch (error) {
        console.log('❌ Error converting time:', error);
        return null;
    }
}

function scanAndConvert() {
    console.log('🔍 MANUAL SCANNING: Looking for all timezones on page...');
    addStyles();
    
    let foundTimezones = 0;
    
    // DEBUG: Grunnleggende test først
    console.log('🧪 DEBUG: Testing basic queries...');
    console.log('document.body exists:', !!document.body);
    console.log('querySelector works:', !!document.querySelector);
    
    // DEBUG: Se hva som faktisk finnes på siden
    console.log('🔍 Looking for .tz elements...');
    const tzElements = document.querySelectorAll('.tz');
    console.log(`Found ${tzElements.length} .tz elements:`, tzElements);
    
    if (tzElements.length === 0) {
        console.log('❌ No .tz elements found! Checking if elements exist at all...');
        const allElements = document.querySelectorAll('*');
        console.log(`Total elements on page: ${allElements.length}`);
        
        // Test med andre selectors
        const spanElements = document.querySelectorAll('span');
        console.log(`Total span elements: ${spanElements.length}`);
        
        // Se etter tekst som inneholder PDT eller andre tidssoner
        const bodyText = document.body.innerText || document.body.textContent;
        const timezones = ['PDT', 'PST', 'EDT', 'EST', 'CDT', 'CST', 'MDT', 'MST', 'UTC', 'GMT'];
        
        console.log('🔍 Searching for any timezone text...');
        timezones.forEach(tz => {
            if (bodyText.includes(tz)) {
                console.log(`✅ Found ${tz} text in body!`);
                const index = bodyText.indexOf(tz);
                console.log(`${tz} context:`, bodyText.substring(index - 30, index + 30));
            }
        });
        
        // Søk etter iframe som kan inneholde innholdet
        const iframes = document.querySelectorAll('iframe');
        console.log(`🖼️ Found ${iframes.length} iframes:`, iframes);
        
        iframes.forEach((iframe, index) => {
            console.log(`  iframe[${index}]:`, iframe.src);
        });
        
        // Søk etter elementer som kan inneholde tid
        const timePattern = /\d{1,2}:\d{2}(?:am|pm)?/i;
        const elementsWithTime = Array.from(document.querySelectorAll('*')).filter(el => 
            el.children.length === 0 && timePattern.test(el.textContent)
        );
        
        console.log(`⏰ Found ${elementsWithTime.length} elements with time patterns:`);
        elementsWithTime.slice(0, 5).forEach((el, index) => {
            console.log(`  time[${index}]: "${el.textContent.trim()}" in <${el.tagName.toLowerCase()}>`);
        });
        
        if (bodyText.includes('PDT')) {
            console.log('✅ Found PDT text in body!');
            console.log('PDT context:', bodyText.substring(bodyText.indexOf('PDT') - 20, bodyText.indexOf('PDT') + 20));
        } else {
            console.log('❌ No PDT text found in body');
            console.log('Body text preview:', bodyText.substring(0, 200));
        }
        
        // Don't return early - continue with other strategies even if no .tz elements found
    }
    
    tzElements.forEach((el, index) => {
        console.log(`  .tz[${index}]: "${el.textContent.trim()}" in`, el.parentElement);
    });
    
    // Strategi 1: Finn alle tidssone-span elementer (som Comic-Con bruker)
    const timezoneSelectors = [
        '.tz', '.timezone', '[class*="timezone"]', '[class*="tz"]',
        '.time-zone', '.tz-label', '.zone', '[data-timezone]'
    ];
    
    timezoneSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`🔍 Selector "${selector}" found ${elements.length} elements`);
        
        elements.forEach(element => {
            const timezone = element.textContent.trim().toUpperCase();
            console.log(`  Checking: "${timezone}"`);
            
            if (timezoneMap[timezone]) {
                console.log(`📍 Found timezone element: ${timezone}`);
                const timeElement = findNearbyTimeElement(element);
                if (timeElement) {
                    convertTimeElement(timeElement, element, timezone);
                    foundTimezones++;
                } else {
                    console.log(`❌ No time element found near ${timezone}`);
                }
            } else {
                console.log(`❌ Timezone "${timezone}" not in timezoneMap`);
            }
        });
    });
    
    // Strategi 2: Scan all text for time + timezone patterns
    const allText = document.body.innerText;
    
    // Oppdaterte patterns for å fange ALLE tidsformater og nye tidssoner
    const patterns = [
        // Range patterns (høyeste prioritet) - "6 PM - 7 PM PDT"
        /(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s*-\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s+([A-Z]{2,4})\b/gi,
        
        // SPESIELLE PST/PDT patterns (høy prioritet) - KORRIGERT for 2 capture groups
        /(\d{1,2}:\d{2}\s*(?:AM|PM))\s+(PST)\b/gi,
        /(\d{1,2}:\d{2}\s*(?:AM|PM))\s+(PDT)\b/gi,
        /at\s+(\d{1,2}:\d{2}\s*(?:AM|PM))\s+(PST)\b/gi,
        /at\s+(\d{1,2}:\d{2}\s*(?:AM|PM))\s+(PDT)\b/gi,
        
        // Basic patterns - capture individual times with timezone (2-4 character timezones)
        /(\d{1,2}:\d{2}\s*(?:AM|PM))\s+([A-Z]{2,4})\b/gi,
        /(\d{1,2}\s+(?:AM|PM))\s+([A-Z]{2,4})\b/gi,
        
        // Longer timezone codes (up to 6 characters for things like CHAST, CHADT)
        /(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s+([A-Z]{3,6})\b/gi,
        
        // Event patterns with at/on
        /at\s+(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s+([A-Z]{2,6})\b/gi,
        /on\s+\w+\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s+([A-Z]{2,6})\b/gi,
        /\w+\s+\d{1,2}\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s+([A-Z]{2,6})\b/gi,
        
        // Parenthetical timezone patterns - "3:30PM San Diego time (PDT)"
        /(\d{1,2}:\d{2}(?:AM|PM)?)\s+[^(]*\(([A-Z]{2,6})\)/gi,
        
        // Flexible patterns with "time" keyword
        /(\d{1,2}:\d{2}(?:AM|PM)?)\s+.*?([A-Z]{2,6})\s*time/gi,
        
        // Start/end time patterns
        /starts?\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s+([A-Z]{2,6})\b/gi,
        /ends?\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s+([A-Z]{2,6})\b/gi,
        
        // Conference/meeting patterns
        /meeting\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s+([A-Z]{2,6})\b/gi,
        /conference\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s+([A-Z]{2,6})\b/gi,
        
        // Live streaming patterns (for your specific case)
        /live\s+.*?at\s+(\d{1,2}:\d{2}\s*(?:AM|PM))\s+([A-Z]{2,6})\b/gi
    ];
    
    // Scan hele siden for text-patterns
    console.log('🔍 Starting strategy 2 text pattern scanning...');
    let elementsChecked = 0;
    let patternsMatched = 0;
    
    document.querySelectorAll('*').forEach(element => {
        // Hopp over allerede konverterte elementer og scripts
        if (element.classList.contains('norwegian-time-converted') || 
            element.tagName === 'SCRIPT' || 
            element.tagName === 'STYLE') return;
        
        const text = element.textContent;
        if (!text) return;
        
        elementsChecked++;
        
        // Spesiell sjekk for problemet: Twitter/X style spans med PST
        if (text.includes('PST') && text.includes('8:30 PM')) {
            console.log(`🎯 FOUND SPECIFIC PST ISSUE: "${text.substring(0, 150)}..."`);
            console.log(`  Element tag: ${element.tagName}, class: ${element.className}`);
            console.log(`  Text length: ${text.length}, children: ${element.children.length}`);
        }
        
        // Økt tekstlengde-grensen for å fange mer innhold (var 500)
        if (text.length > 1000) {
            console.log(`⚠️ Skipping long text (${text.length} chars): "${text.substring(0, 100)}..."`);
            return;
        }
        
        // Tillat både leaf nodes og parent nodes med begrenset nesting
        const isLeafNode = element.children.length === 0;
        const isShallowParent = element.children.length <= 2; // Max 2 child elements
        
        if (!isLeafNode && !isShallowParent) {
            // For deep nested elements, only process if text is reasonably short
            if (text.length > 200) return;
        }
        
        patterns.forEach((pattern, patternIndex) => {
            const matches = [...text.matchAll(pattern)];
            if (matches.length > 0) {
                patternsMatched += matches.length;
                console.log(`🎯 Pattern ${patternIndex} found ${matches.length} matches in element`);
                console.log(`  Element: ${element.tagName}.${element.className}`);
                console.log(`  Text preview: "${text.substring(0, 100)}..."`);
            }
            
            matches.forEach((match, matchIndex) => {
                const [fullMatch, ...captureGroups] = match;
                console.log(`🔍 Processing match ${matchIndex}: "${fullMatch}", groups:`, captureGroups);
                
                // Sjekk om dette elementet allerede er konvertert
                if (element.innerHTML.includes('norsk tid')) {
                    console.log(`⚠️ Element already converted, skipping match "${fullMatch}"`);
                    return;
                }
                
                // Håndter ulike typer matches
                if (captureGroups.length === 3) {
                    // Range pattern: "6 PM - 7 PM PDT"
                    const [timeStr1, timeStr2, timezone] = captureGroups;
                    console.log(`📅 Range pattern: "${fullMatch}", times="${timeStr1}, ${timeStr2}", timezone="${timezone}"`);
                    
                    if (timezoneMap[timezone.toUpperCase()]) {
                        console.log(`🕐 Converting range pattern: "${fullMatch}"`);
                        convertTextPattern(element, fullMatch, timeStr1, timezone);
                        foundTimezones++;
                    } else {
                        console.log(`❌ Timezone "${timezone}" not in timezoneMap`);
                    }
                } else if (captureGroups.length === 2) {
                    // Standard pattern: "6 PM PDT" or "8:30 PM PST"
                    const [timeStr, timezone] = captureGroups;
                    console.log(`⏰ Single time pattern: "${fullMatch}", timeStr="${timeStr}", timezone="${timezone}"`);
                    
                    if (timezoneMap[timezone.toUpperCase()]) {
                        console.log(`🕐 Converting single time pattern: "${fullMatch}"`);
                        convertTextPattern(element, fullMatch, timeStr, timezone);
                        foundTimezones++;
                    } else {
                        console.log(`❌ Timezone "${timezone}" not in timezoneMap`);
                    }
                } else {
                    console.log(`❓ Unexpected capture group count: ${captureGroups.length} for match "${fullMatch}"`);
                }
            });
        });
    });
    
    console.log(`📊 Strategy 2 complete: Checked ${elementsChecked} elements, found ${patternsMatched} pattern matches`);
    
    // Strategi 3: Spesifikk støtte for sched.com (Comic-Con)
    if (window.location.hostname.includes('sched.com')) {
        console.log('🎯 SCHED.COM DETECTED - Running specialized scanning...');
        
        // Sched.com bruker spesifikke selektorer
        const schedSelectors = [
            '.event-time', '.session-time', '.time', '.session-start',
            '[data-start]', '[data-end]', '.event-start', '.event-end',
            '.event .time', '.session .time', '.schedule-time',
            // Mer generiske selektorer for sched.com
            '.event', '.session', '.item', '.schedule-item',
            '[class*="time"]', '[class*="event"]', '[class*="session"]',
            // Span og div elementer som kan inneholde tid
            'span', 'div', 'td', 'th', 'p'
        ];
        
        schedSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Sched selector "${selector}" found ${elements.length} elements`);
            
            elements.forEach(element => {
                const text = element.textContent.trim();
                console.log(`  Checking sched element: "${text}"`);
                
                // Søk etter tid + tidssone patterns i sched.com format
                const schedPatterns = [
                    /(\d{1,2}:\d{2}\s*(?:am|pm)?)\s*([A-Z]{2,4})/gi,
                    /(\d{1,2}:\d{2})\s+([A-Z]{2,4})/gi
                ];
                
                schedPatterns.forEach(pattern => {
                    const matches = [...text.matchAll(pattern)];
                    matches.forEach(match => {
                        const [fullMatch, timeStr, timezone] = match;
                        if (timezoneMap[timezone.toUpperCase()]) {
                            console.log(`🎯 Found sched pattern: "${fullMatch}"`);
                            convertTextPattern(element, fullMatch, timeStr, timezone);
                            foundTimezones++;
                        }
                    });
                });
            });
        });
        
        // Også søk i alle elementer som inneholder vanlige tidssoner (ikke bare PDT/PST)
        const commonTimezones = ['PDT', 'PST', 'EDT', 'EST', 'CDT', 'CST', 'MDT', 'MST', 
                               'CET', 'CEST', 'JST', 'KST', 'IST', 'AEST', 'AWST', 'UTC', 'GMT'];
        
        document.querySelectorAll('*').forEach(element => {
            if (element.children.length > 0) return; // Kun leaf nodes
            
            const text = element.textContent;
            if (!text) return;
            
            // Sjekk om teksten inneholder noen av de vanlige tidssonene
            const hasTimezone = commonTimezones.some(tz => text.includes(tz));
            if (hasTimezone) {
                console.log(`🌍 Found timezone element: "${text}"`);
                
                // Bruk alle patterns for å finne tid + tidssone kombinasjoner
                const allPatterns = [
                    /(\d{1,2}:\d{2}\s*(?:am|pm)?)\s*(PDT|PST|EDT|EST|CDT|CST|MDT|MST|CET|CEST|JST|KST|IST|AEST|AWST|UTC|GMT)/gi,
                    /(\d{1,2}:\d{2})\s+(PDT|PST|EDT|EST|CDT|CST|MDT|MST|CET|CEST|JST|KST|IST|AEST|AWST|UTC|GMT)/gi,
                    /(\d{1,2}\s+(?:am|pm))\s+(PDT|PST|EDT|EST|CDT|CST|MDT|MST|CET|CEST|JST|KST|IST|AEST|AWST|UTC|GMT)/gi
                ];
                
                allPatterns.forEach(pattern => {
                    const matches = [...text.matchAll(pattern)];
                    matches.forEach(match => {
                        const [fullMatch, timeStr, timezone] = match;
                        if (timezoneMap[timezone.toUpperCase()]) {
                            console.log(`🌍 Converting global timezone: "${fullMatch}"`);
                            convertTextPattern(element, fullMatch, timeStr, timezone);
                            foundTimezones++;
                        }
                    });
                });
            }
        });
        
        // Mer aggressiv søking: ALL elementer som inneholder tid (anta PDT for Comic-Con)
        console.log('🔍 AGGRESSIVE SCAN: Looking for ANY time patterns...');
        let timeElementsFound = 0;
        
        document.querySelectorAll('*').forEach(element => {
            if (element.children.length > 0) return; // Kun leaf nodes
            
            const text = element.textContent.trim();
            if (!text || text.length < 3 || text.length > 50) return; // Rimelige lengder
            
            // Søk etter tidsformater (anta at Comic-Con bruker PDT)
            const timePatterns = [
                /(\d{1,2}:\d{2}\s*(?:am|pm))/gi,  // 2:30pm, 10:00am
                /(\d{1,2}:\d{2})\s*(?:a|p)m?/gi,  // 2:30 pm, 10:00a
                /(\d{1,2}:\d{2})/g                // 14:30, 9:15
            ];
            
            timePatterns.forEach(pattern => {
                const matches = [...text.matchAll(pattern)];
                if (matches.length > 0) {
                    console.log(`⏰ Found time element (assuming PDT): "${text}"`);
                    timeElementsFound++;
                    
                    matches.forEach(match => {
                        const timeStr = match[1] || match[0];
                        // Anta PDT for Comic-Con tider (kan justeres senere)
                        console.log(`🌴 Converting assumed PDT time: "${timeStr}"`);
                        convertTextPattern(element, timeStr, timeStr, 'PDT');
                        foundTimezones++;
                    });
                }
            });
        });
        
        console.log(`🎯 SCHED.COM scan complete: Found ${timeElementsFound} time elements`);
    }
    
    console.log(`✅ MANUAL SCAN COMPLETE: Found and converted ${foundTimezones} timezones`);
    
    if (foundTimezones > 0) {
        // Vis notifikasjon
        showNotification(`🇳🇴 Konverterte ${foundTimezones} tidssoner til norsk tid!`);
    }
    
    return foundTimezones;
}

function findNearbyTimeElement(timezoneElement) {
    const container = timezoneElement.parentElement;
    if (!container) return null;
    
    console.log(`🔍 Searching for time near timezone element:`);
    console.log(`  Timezone element:`, timezoneElement);
    console.log(`  Container:`, container);
    console.log(`  Container tagName: ${container.tagName}, className: "${container.className}"`);
    console.log(`  Container text: "${container.textContent.trim()}"`);
    
    // Søk i samme container
    const timePattern = /\d{1,2}:\d{2}(?:am|pm)?/i;
    const containerText = container.textContent;
    
    if (timePattern.test(containerText)) {
        console.log(`✅ Found time in same container!`);
        return container;
    }
    
    // Søk i siblings
    const siblings = Array.from(container.parentElement?.children || []);
    console.log(`🔍 Checking ${siblings.length} siblings...`);
    
    for (const sibling of siblings) {
        if (sibling !== container && timePattern.test(sibling.textContent)) {
            console.log(`✅ Found time in sibling: "${sibling.textContent.trim()}"`);
            return sibling;
        }
    }
    
    console.log(`❌ No time found near timezone element`);
    return null;
}

function convertTimeElement(timeElement, timezoneElement, timezone) {
    if (originalElements.has(timeElement)) {
        console.log(`⚠️ Element already converted, skipping`);
        return;
    }
    
    const originalText = timeElement.textContent;
    console.log(`🔄 Converting element with text: "${originalText}"`);
    console.log(`🔄 Element details:`, timeElement);
    
    // Finn tiden i teksten
    const timeMatch = originalText.match(/\d{1,2}:\d{2}(?:am|pm)?/i);
    if (!timeMatch) {
        console.log(`❌ No time pattern found in: "${originalText}"`);
        return;
    }
    
    const timeStr = timeMatch[0];
    console.log(`⏰ Found time: "${timeStr}", timezone: "${timezone}"`);
    
    const converted = convertTimeToNorwegian(timeStr, timezone);
    
    if (converted) {
        console.log(`✅ Conversion successful: "${timeStr}" → "${converted}"`);
        
        // Lagre original
        originalElements.set(timeElement, {
            html: timeElement.innerHTML,
            text: originalText,
            timezone: timezone
        });
        
        // Test forskjellige måter å endre elementet på
        try {
            // Metode 1: Direkte innerHTML erstatning
            const originalHtml = timeElement.innerHTML;
            const newHtml = `<span class="norwegian-time-converted norwegian-auto-converted" style="background: linear-gradient(135deg, #ff6b6b, #4ecdc4); color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                ${converted} (Norsk tid)
                <div class="norwegian-time-tooltip" style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: #2c3e50; color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px; white-space: nowrap; opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 10000; pointer-events: none;">
                    Original: ${timeStr} ${timezone}
                </div>
            </span>`;
            
            timeElement.innerHTML = newHtml;
            console.log(`📝 HTML changed from: "${originalHtml}" to: "${timeElement.innerHTML}"`);
            
            // Sjekk om endringen faktisk skjedde
            if (timeElement.innerHTML === newHtml) {
                console.log(`✅ HTML change confirmed!`);
            } else {
                console.log(`❌ HTML change failed! Current: "${timeElement.innerHTML}"`);
            }
            
            // Skjul tidssone hvis separat element
            if (timezoneElement && timezoneElement !== timeElement) {
                timezoneElement.style.display = 'none';
                console.log(`🙈 Hidden timezone element`);
            }
            
            console.log(`✅ Successfully converted: "${originalText}" → "${converted}"`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error updating element:`, error);
            return false;
        }
    } else {
        console.log(`❌ Conversion failed for: "${timeStr}" ${timezone}`);
        return false;
    }
}
function convertTextPattern(element, fullMatch, timeStr, timezone) {
    // Sjekk om elementet allerede er konvertert
    if (originalElements.has(element)) {
        console.log(`⚠️ Element already processed, skipping`);
        return;
    }
    
    // Sjekk om elementet allerede inneholder konvertert tekst
    if (element.innerHTML.includes('norsk tid')) {
        console.log(`⚠️ Element already contains 'norsk tid', skipping to avoid double conversion`);
        return;
    }
    
    // Lagre original (kun første gang)
    originalElements.set(element, {
        html: element.innerHTML,
        text: element.textContent
    });
    
    let newHtml = element.innerHTML;
    console.log(`🔄 Converting pattern: "${fullMatch}" in element: "${element.textContent.substring(0, 100)}"`);
    
    // Spesiell håndtering for tidsperioder som "6 PM - 7 PM PDT"
    const rangePattern = /(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s*-\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s+([A-Z]{2,4})\b/gi;
    const rangeMatch = fullMatch.match(rangePattern);
    
    if (rangeMatch) {
        console.log(`📅 Processing time range: "${fullMatch}"`);
        // Håndter tidsperiode - konverter begge tidene
        const rangeParts = fullMatch.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s*-\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s+([A-Z]{2,4})/i);
        if (rangeParts) {
            const startTime = rangeParts[1];
            const endTime = rangeParts[2];
            const tz = rangeParts[3];
            
            console.log(`⏰ Range times: start="${startTime}", end="${endTime}", timezone="${tz}"`);
            
            const convertedStart = convertTimeToNorwegian(startTime, tz);
            const convertedEnd = convertTimeToNorwegian(endTime, tz);
            
            if (convertedStart && convertedEnd) {
                // NYTT FORMAT: "6 PM (18:00 norsk tid) - 7 PM (19:00 norsk tid) PDT"
                const newRangeFormat = `${startTime} (${convertedStart} <span class="norsk-tid-label">norsk tid</span>) - ${endTime} (${convertedEnd} <span class="norsk-tid-label">norsk tid</span>) ${tz}`;
                
                // Bruk exact match replacement for å unngå å erstatte feil tekst
                newHtml = newHtml.replace(fullMatch, newRangeFormat);
                console.log(`✅ Range converted: "${fullMatch}" → "${startTime} (${convertedStart} norsk tid) - ${endTime} (${convertedEnd} norsk tid) ${tz}"`);
            }
        }
    } else {
        console.log(`⏰ Processing single time: "${timeStr}" with timezone "${timezone}"`);
        // Standard enkelt tid - NYTT FORMAT: "6 PM (18:00 norsk tid) PDT"
        const converted = convertTimeToNorwegian(timeStr, timezone);
        if (!converted) {
            console.log(`❌ Conversion failed for "${timeStr}" ${timezone}`);
            return;
        }
        
        // Finn den eksakte match i HTML for å erstatte riktig forekomst
        // Først, prøv å finne hele pattern med tidssone
        const escapedTime = escapeRegex(timeStr);
        const escapedTimezone = escapeRegex(timezone);
        
        // Prøv ulike mønster for å finne den eksakte matchen
        const possiblePatterns = [
            `${escapedTime}\\s+${escapedTimezone}\\b`,  // "6 PM PDT"
            `${escapedTime}\\s*${escapedTimezone}\\b`,   // "6PM PDT" 
            `\\b${escapedTime}\\s+${escapedTimezone}`    // word boundary start
        ];
        
        let replaced = false;
        for (const patternStr of possiblePatterns) {
            const regex = new RegExp(patternStr, 'gi');
            const match = newHtml.match(regex);
            
            if (match && match[0]) {
                const originalTimeWithTz = match[0];
                const newFormat = `${timeStr} (${converted} <span class="norsk-tid-label">norsk tid</span>) ${timezone}`;
                newHtml = newHtml.replace(regex, newFormat);
                console.log(`✅ Single time converted using pattern "${patternStr}": "${originalTimeWithTz}" → "${timeStr} (${converted} norsk tid) ${timezone}"`);
                replaced = true;
                break;
            }
        }
        
        if (!replaced) {
            // Fallback: bare legg til norsk tid etter tiden, uten tidssone
            const timeRegex = new RegExp(escapeRegex(timeStr), 'gi');
            const newFormat = `${timeStr} (${converted} <span class="norsk-tid-label">norsk tid</span>)`;
            newHtml = newHtml.replace(timeRegex, newFormat);
            console.log(`✅ Fallback conversion: "${timeStr}" → "${timeStr} (${converted} norsk tid)"`);
        }
    }
    
    // Oppdater element
    element.innerHTML = newHtml;
    element.classList.add('norwegian-time-converted');
    console.log(`📝 Element updated successfully`);
}

// Hjelpefunksjon for å escape special regex karakterer
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function showNotification(message) {
    // Lag en enkel notifikasjon
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 99999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.5s ease;
        font-family: Arial, sans-serif;
        font-size: 14px;
    `;
    
    // Legg til animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Fjern etter 5 sekunder
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.5s ease reverse';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

function resetAllTimes() {
    console.log('🔄 Resetting all auto-converted times...');
    let resetCount = 0;
    
    // Gjenopprett alle elementer
    originalElements.forEach((original, element) => {
        if (element.parentNode) {
            element.innerHTML = original.html;
            element.classList.remove('norwegian-time-converted', 'norwegian-auto-converted');
            resetCount++;
        }
    });
    
    // Vis skjulte tidssone-elementer
    document.querySelectorAll('[style*="display: none"]').forEach(el => {
        if (el.textContent.match(/^[A-Z]{2,4}$/)) {
            el.style.display = '';
        }
    });
    
    originalElements.clear();
    
    // Fjern styles
    const styleElement = document.getElementById('norwegian-time-styles');
    if (styleElement) {
        styleElement.remove();
    }
    
    console.log(`✅ Reset ${resetCount} elements`);
    
    if (resetCount > 0) {
        showNotification(`🔄 Tilbakestilte ${resetCount} tidssoner`);
    }
    
    return resetCount;
}

// Lytt til meldinger fra popup (kun manual kontroll)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('📨 MELDING MOTTATT:', request);
    console.log('🔄 Starter konvertering...');
    
    if (request.action === 'convertToNorwegian') {
        const count = scanAndConvert();
        console.log(`✅ Ferdig! Konverterte ${count} tidssoner`);
        sendResponse({success: true, count: count});
    } else if (request.action === 'resetTimes') {
        const count = resetAllTimes();
        console.log(`✅ Tilbakestilt ${count} tidssoner`);
        sendResponse({success: true, count: count});
    }
    
    return true;
});

// Spesiell håndtering for dynamisk innhold (som sched.com iframes)
if (window.location.hostname.includes('sched.com')) {
    console.log('🎯 SCHED.COM iframe detected - Setting up dynamic content monitoring...');
    
    // Funksjjon for å vente på at innholdet skal laste
    function waitForContent(attempt = 1, maxAttempts = 10) {
        console.log(`⏰ Attempt ${attempt}/${maxAttempts} - Checking for loaded content...`);
        
        const bodyText = document.body.innerText || document.body.textContent || '';
        const hasContent = bodyText.length > 100; // Mer enn bare navigasjon
        const hasTimeElements = document.querySelectorAll('*').length > 50; // Nok elementer
        
        console.log(`📊 Content check: bodyText=${bodyText.length} chars, elements=${document.querySelectorAll('*').length}`);
        console.log(`📄 Body preview:`, bodyText.substring(0, 200));
        
        if (hasContent && hasTimeElements) {
            console.log('✅ Content loaded! Running scan...');
            const count = scanAndConvert();
            if (count > 0) {
                console.log(`🎯 Auto-converted ${count} timezones in sched.com iframe`);
            } else {
                console.log('🔍 No timezones found, but content is loaded');
                
                // Ekstra debugging - se hva som faktisk finnes
                console.log('🧪 EXTRA DEBUG - Looking for any time-like text...');
                document.querySelectorAll('*').forEach((el, index) => {
                    if (el.children.length === 0) { // Leaf nodes
                        const text = el.textContent.trim();
                        if (text.match(/\d{1,2}:\d{2}/)) {
                            console.log(`⏰ Found time-like text [${index}]: "${text}"`);
                        }
                        if (text.includes('PM') || text.includes('AM') || text.includes('PDT') || text.includes('PST')) {
                            console.log(`🌐 Found timezone-like text [${index}]: "${text}"`);
                        }
                    }
                });
            }
        } else if (attempt < maxAttempts) {
            // Prøv igjen etter litt delay
            setTimeout(() => waitForContent(attempt + 1, maxAttempts), 1000);
        } else {
            console.log('⏰ Max attempts reached - content may not have loaded');
        }
    }
    
    // Start med en gang
    waitForContent();
    
    // Overvåk DOM endringer for nytt innhold
    const observer = new MutationObserver((mutations) => {
        let hasNewContent = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const text = node.textContent || '';
                        if (text.includes('PDT') || text.includes('PST') || text.includes(':') || text.length > 20) {
                            hasNewContent = true;
                        }
                    }
                });
            }
        });
        
        if (hasNewContent) {
            console.log('🔄 New content detected via MutationObserver, scanning...');
            setTimeout(() => {
                const count = scanAndConvert();
                if (count > 0) {
                    console.log(`🎯 Auto-converted ${count} new timezones`);
                }
            }, 500);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

console.log('✅ Norsk Tidskonverter ready - VENTER PÅ KLIKK!');