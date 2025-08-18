
const scraperModeBtn = document.getElementById('scraperMode');
const interactionModeBtn = document.getElementById('interactionMode');
const scraperSection = document.getElementById('scraperSection');
const interactionSection = document.getElementById('interactionSection');

const profileUrls = document.getElementById('profileUrls');
const urlCount = document.getElementById('urlCount');
const likeCount = document.getElementById('likeCount');
const commentCount = document.getElementById('commentCount');

const startScraping = document.getElementById('startScraping');
const stopScraping = document.getElementById('stopScraping');
const startInteraction = document.getElementById('startInteraction');
const stopInteraction = document.getElementById('stopInteraction');

const status = document.getElementById('status');
const statusText = document.getElementById('statusText');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const stats = document.getElementById('stats');
const currentProfile = document.getElementById('currentProfile');
const profileCount = document.getElementById('profileCount');
const currentTab = document.getElementById('currentTab');
const currentUrl = document.getElementById('currentUrl');


document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup loaded');
  
  
  loadCurrentTabInfo();
  
  
  setupEventListeners();
  
  
  loadSavedUrls();
  
  
  validateInteractionInputs();
});

function setupEventListeners() {
  
  scraperModeBtn.addEventListener('click', () => {
    scraperModeBtn.classList.add('active');
    interactionModeBtn.classList.remove('active');
    scraperSection.classList.add('active');
    interactionSection.classList.remove('active');
  });

  interactionModeBtn.addEventListener('click', () => {
    interactionModeBtn.classList.add('active');
    scraperModeBtn.classList.remove('active');
    interactionSection.classList.add('active');
    scraperSection.classList.remove('active');
  });

  
  likeCount.addEventListener('input', validateInteractionInputs);
  commentCount.addEventListener('input', validateInteractionInputs);

  
  profileUrls.addEventListener('input', () => {
    saveUrls();
    updateUrlCount();
  });

  
  startScraping.addEventListener('click', handleStartScraping);
  stopScraping.addEventListener('click', handleStopScraping);
  startInteraction.addEventListener('click', handleStartInteraction);
  stopInteraction.addEventListener('click', handleStopInteraction);
}

async function loadCurrentTabInfo() {
  try {
    const [tab] = await chrome.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    
    if (tab && tab.title) {
      currentTab.innerHTML = `<img src="${tab.favIconUrl || ''}" class="favicon" onerror="this.style.display='none'">${tab.title}`;
      currentUrl.textContent = tab.url;
      
      if (tab.url.includes('linkedin.com')) {
        currentTab.innerHTML += ' <span style="color: #0077b5;">✓ LinkedIn Detected</span>';
      }
    } else {
      currentTab.innerHTML = '<span class="error">Unable to get tab info</span>';
    }
  } catch (error) {
    console.error('Error loading tab info:', error);
    currentTab.innerHTML = '<span class="loading">Loading tab info...</span>';
  }
}

async function loadSavedUrls() {
  try {
    const result = await chrome.storage.sync.get(['profileUrls']);
    if (result.profileUrls) {
      profileUrls.value = result.profileUrls;
      updateUrlCount();
    }
  } catch (error) {
    console.error('Error loading saved URLs:', error);
  }
}

async function saveUrls() {
  try {
    const urls = profileUrls.value;
    await chrome.storage.sync.set({ profileUrls: urls });
  } catch (error) {
    console.error('Error saving URLs:', error);
  }
}

function updateUrlCount() {
  const urls = profileUrls.value.trim().split('\n').filter(url => url.trim());
  const validUrls = urls.filter(url => url.includes('linkedin.com/in/'));
  urlCount.textContent = `${validUrls.length} profiles ready`;
}

function validateInteractionInputs() {
  const likeVal = parseInt(likeCount.value);
  const commentVal = parseInt(commentCount.value);
  const isValid = likeVal > 0 && commentVal > 0 && likeVal <= 50 && commentVal <= 20;
  startInteraction.disabled = !isValid;
  return isValid;
}

async function handleStartScraping() {
  const urls = profileUrls.value.trim().split('\n').filter(url => url.trim() && url.includes('linkedin.com/in/'));
  
  if (urls.length === 0) {
    showStatus('Please enter valid LinkedIn profile URLs', 'error');
    setTimeout(hideStatus, 3000);
    return;
  }

  startScraping.disabled = true;
  stopScraping.disabled = false;
  showStatus('Starting profile scraping...', 'processing');
  
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    chrome.tabs.sendMessage(tab.id, {
      action: 'startScraping',
      urls: urls
    }, (response) => {
      if (chrome.runtime.lastError) {
        showStatus('Error: Please refresh the LinkedIn page and try again', 'error');
        resetScrapingButtons();
        return;
      }
      
      if (response && response.success) {
        showStatus('Scraping profiles...', 'processing');
      } else {
        showStatus('Error starting scraper', 'error');
        resetScrapingButtons();
      }
    });
    
  } catch (error) {
    showStatus('Error: ' + error.message, 'error');
    resetScrapingButtons();
  }
}

async function handleStopScraping() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  chrome.tabs.sendMessage(tab.id, {action: 'stopScraping'});
  resetScrapingButtons();
  showStatus('Scraping stopped', 'error');
  setTimeout(hideStatus, 3000);
}

async function handleStartInteraction() {
  if (!validateInteractionInputs()) return;
  
  const likes = parseInt(likeCount.value);
  const comments = parseInt(commentCount.value);
  
  startInteraction.disabled = true;
  stopInteraction.disabled = false;
  showStatus('Starting feed interaction...', 'processing');
  
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    
    if (!tab.url.includes('linkedin.com')) {
      showStatus('Please navigate to LinkedIn first', 'error');
      resetInteractionButtons();
      return;
    }
    
    chrome.tabs.sendMessage(tab.id, {
      action: 'startInteraction',
      likeCount: likes,
      commentCount: comments
    }, (response) => {
      if (chrome.runtime.lastError) {
        showStatus('Error: Please refresh LinkedIn and try again', 'error');
        resetInteractionButtons();
        return;
      }
      
      if (response && response.success) {
        showStatus(`Interacting with ${likes} likes and ${comments} comments...`, 'processing');
      } else {
        showStatus('Error starting interaction', 'error');
        resetInteractionButtons();
      }
    });
    
  } catch (error) {
    showStatus('Error: ' + error.message, 'error');
    resetInteractionButtons();
  }
}

async function handleStopInteraction() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  chrome.tabs.sendMessage(tab.id, {action: 'stopInteraction'});
  resetInteractionButtons();
  showStatus('Interaction stopped', 'error');
  setTimeout(hideStatus, 3000);
}

function resetScrapingButtons() {
  startScraping.disabled = false;
  stopScraping.disabled = true;
}

function resetInteractionButtons() {
  startInteraction.disabled = !validateInteractionInputs();
  stopInteraction.disabled = true;
}

function showStatus(message, type = 'processing') {
  statusText.textContent = message;
  status.className = `status ${type}`;
  status.style.display = 'block';
  
  if (type === 'processing') {
    progressBar.style.display = 'block';
    stats.style.display = 'block';
  } else {
    progressBar.style.display = 'none';
    stats.style.display = 'none';
  }
}

function hideStatus() {
  status.style.display = 'none';
}

function updateProgress(current, total, currentItem = '') {
  const percentage = (current / total) * 100;
  progressFill.style.width = `${percentage}%`;
  currentProfile.textContent = currentItem;
  profileCount.textContent = `${current}/${total}`;
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrapingProgress') {
    updateProgress(message.current, message.total, message.currentProfile);
  } else if (message.action === 'scrapingComplete') {
    showStatus(`Scraping completed! ${message.count} profiles processed`, 'success');
    resetScrapingButtons();
    setTimeout(hideStatus, 5000);
  } else if (message.action === 'scrapingError') {
    showStatus('Scraping error: ' + message.error, 'error');
    resetScrapingButtons();
    setTimeout(hideStatus, 5000);
  } else if (message.action === 'interactionProgress') {
    updateProgress(message.current, message.total, `${message.likes} likes, ${message.comments} comments`);
  } else if (message.action === 'interactionComplete') {
    showStatus(`Interaction completed! ${message.likes} likes, ${message.comments} comments`, 'success');
    resetInteractionButtons();
    setTimeout(hideStatus, 5000);
  } else if (message.action === 'interactionError') {
    showStatus('Interaction error: ' + message.error, 'error');
    resetInteractionButtons();
    setTimeout(hideStatus, 5000);
  }
});