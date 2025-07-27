// Background script for Norwegian Time Converter
console.log('Background script loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  if (message.action === 'createWindow') {
    createFloatingWindow(message.data);
    sendResponse({ success: true });
  }
  
  if (message.action === 'saveState') {
    chrome.storage.local.set({ timeConverterState: message.data });
    sendResponse({ success: true });
  }
  
  if (message.action === 'getState') {
    chrome.storage.local.get(['timeConverterState'], (result) => {
      sendResponse({ data: result.timeConverterState });
    });
    return true; // Keep message channel open for async response
  }
});

// Create a floating window
async function createFloatingWindow(data) {
  try {
    console.log('Creating floating window with data:', data);
    
    // Save the current state
    if (data) {
      await chrome.storage.local.set({ timeConverterState: data });
    }
    
    // Create new window with tighter dimensions
    const window = await chrome.windows.create({
      url: chrome.runtime.getURL('popup-calculator.html'),
      type: 'popup',
      width: 340,
      height: 560,
      left: 100,
      top: 100,
      focused: true
    });
    
    console.log('Window created:', window);
  } catch (error) {
    console.error('Error creating window:', error);
  }
}

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension startup');
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});
