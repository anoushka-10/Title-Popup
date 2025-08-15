let isScrapingActive = false;
let currentScrapingIndex = 0;
let profileUrls = [];
let scrapedProfiles = [];

document.addEventListener('DOMContentLoaded', async () => {
  
  await loadCurrentTabInfo();
  
  const result = await chrome.storage.sync.get(['profileUrls']);
  if (result.profileUrls) {
    document.getElementById('profileUrls').value = result.profileUrls;
    updateUrlCount();
  }

  
  document.getElementById('startScraping').addEventListener('click', startScraping);
  document.getElementById('stopScraping').addEventListener('click', stopScraping);
  
  
  document.getElementById('profileUrls').addEventListener('input', () => {
    saveUrls();
    updateUrlCount();
  });
});

async function loadCurrentTabInfo() {
  try {
    const [tab] = await chrome.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    
    const tabElement = document.getElementById('currentTab');
    const urlElement = document.getElementById('currentUrl');
    
    if (tab && tab.title) {
      const favicon = tab.favIconUrl ? 
        `<img src="${tab.favIconUrl}" class="favicon" onerror="this.style.display='none'">` : '';
      tabElement.innerHTML = favicon + tab.title;
      urlElement.textContent = tab.url;
      
      
      if (tab.url.includes('linkedin.com')) {
        tabElement.innerHTML += ' <span style="color: #0077b5;">✓ LinkedIn Detected</span>';
      }
      
    } else {
      tabElement.innerHTML = '<span class="error">Unable to get tab info</span>';
    }
    
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('currentTab').innerHTML = '<span class="error">Error loading tab info</span>';
  }
}

async function saveUrls() {
  const urls = document.getElementById('profileUrls').value;
  await chrome.storage.sync.set({ profileUrls: urls });
}

function updateUrlCount() {
  const urls = parseUrls();
  const countElement = document.getElementById('urlCount');
  const count = urls.length;
  
  if (count === 0) {
    countElement.textContent = '0 profiles ready';
    countElement.style.color = '#95a5a6';
  } else if (count < 3) {
    countElement.textContent = `${count} profile${count > 1 ? 's' : ''} (minimum 3 required)`;
    countElement.style.color = '#e67e22';
  } else {
    countElement.textContent = `${count} profiles ready ✓`;
    countElement.style.color = '#27ae60';
  }
}

function showStatus(message, type = 'processing', showProgress = false) {
  const statusDiv = document.getElementById('status');
  const statusText = document.getElementById('statusText');
  const progressBar = document.getElementById('progressBar');
  
  statusText.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
  
  if (showProgress && type === 'processing') {
    progressBar.style.display = 'block';
    document.getElementById('stats').style.display = 'flex';
    updateProgress();
  } else {
    progressBar.style.display = 'none';
    document.getElementById('stats').style.display = 'none';
  }
}

function updateProgress() {
  const progressFill = document.getElementById('progressFill');
  const currentProfile = document.getElementById('currentProfile');
  const profileCount = document.getElementById('profileCount');
  
  const progress = (currentScrapingIndex / profileUrls.length) * 100;
  progressFill.style.width = `${progress}%`;
  
  currentProfile.textContent = `Profile ${currentScrapingIndex}/${profileUrls.length}`;
  profileCount.textContent = `${scrapedProfiles.length} scraped`;
}

function parseUrls() {
  const urlText = document.getElementById('profileUrls').value.trim();
  if (!urlText) return [];
  
  return urlText
    .split('\n')
    .map(url => url.trim())
    .filter(url => url && url.includes('linkedin.com/in/'));
}

async function startScraping() {
  profileUrls = parseUrls();
  
  if (profileUrls.length === 0) {
    showStatus('❌ Please enter at least one LinkedIn profile URL', 'error');
    return;
  }

  if (profileUrls.length < 3) {
    showStatus('❌ Please enter at least 3 LinkedIn profile URLs', 'error');
    return;
  }

  isScrapingActive = true;
  currentScrapingIndex = 0;
  scrapedProfiles = [];
  
  document.getElementById('startScraping').disabled = true;
  document.getElementById('stopScraping').disabled = false;
  
  showStatus(`🚀 Starting to scrape ${profileUrls.length} profiles...`, 'processing', true);
  
  
  await scrapeNextProfile();
}

function stopScraping() {
  isScrapingActive = false;
  document.getElementById('startScraping').disabled = false;
  document.getElementById('stopScraping').disabled = true;
  showStatus('⏹️ Scraping stopped by user', 'error');
}

async function scrapeNextProfile() {
  if (!isScrapingActive || currentScrapingIndex >= profileUrls.length) {
    
    isScrapingActive = false;
    document.getElementById('startScraping').disabled = false;
    document.getElementById('stopScraping').disabled = true;
    showStatus(`🎉 Scraping completed! Successfully scraped ${scrapedProfiles.length}/${profileUrls.length} profiles`, 'success');
    return;
  }

  const currentUrl = profileUrls[currentScrapingIndex];
  showStatus(`🔍 Scraping profile ${currentScrapingIndex + 1}/${profileUrls.length}`, 'processing', true);

  try {
    
    const tab = await chrome.tabs.create({ url: currentUrl, active: false });
    
    
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeLinkedInProfile
    });

    if (results && results[0] && results[0].result) {
      const profileData = results[0].result;
      profileData.url = currentUrl;
      
      
      await sendToAPI(profileData);
      scrapedProfiles.push(profileData);
      
      showStatus(`✅ Successfully scraped: ${profileData.name || 'Profile'}`, 'processing', true);
    } else {
      showStatus(`⚠️ Failed to scrape profile data`, 'processing', true);
    }

    
    await chrome.tabs.remove(tab.id);
    
    
    currentScrapingIndex++;
    
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (isScrapingActive) {
      await scrapeNextProfile();
    }

  } catch (error) {
    console.error('Error scraping profile:', error);
    showStatus(`❌ Error scraping ${currentUrl}: ${error.message}`, 'error');
    
    currentScrapingIndex++;
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (isScrapingActive) {
      await scrapeNextProfile();
    }
  }
}


function scrapeLinkedInProfile() {
  try {
    const data = {};

    
    const waitForElement = (selector, timeout = 5000) => {
      return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }
        
        const observer = new MutationObserver(() => {
          const element = document.querySelector(selector);
          if (element) {
            observer.disconnect();
            resolve(element);
          }
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, timeout);
      });
    };

    
    const nameSelectors = [
      'h1.text-heading-xlarge',
      '.pv-text-details__left-panel h1',
      'h1[id*="name"]',
      '.ph5 h1'
    ];
    
    let nameElement = null;
    for (const selector of nameSelectors) {
      nameElement = document.querySelector(selector);
      if (nameElement) break;
    }
    data.name = nameElement ? nameElement.textContent.trim() : '';

    
    const locationSelectors = [
      '.text-body-small.inline.t-black--light.break-words',
      '.pv-text-details__left-panel .text-body-small',
      '[data-generated-suggestion-target] + .text-body-small',
      '.ph5 .text-body-small'
    ];
    
    let locationElement = null;
    for (const selector of locationSelectors) {
      locationElement = document.querySelector(selector);
      if (locationElement && locationElement.textContent.trim() && !locationElement.textContent.includes('followers')) {
        break;
      }
    }
    data.location = locationElement ? locationElement.textContent.trim() : '';

    
const aboutSelectors = [
  '#about ~ .display-flex .visually-hidden',
  '#about ~ div span[aria-hidden="true"]'      
];
    let aboutElement = null;
    for (const selector of aboutSelectors) {
      aboutElement = document.querySelector(selector);
      if (aboutElement) break;
    }
    data.about = aboutElement ? aboutElement.textContent.trim() : '';

    
    const bioSelectors = [
      '.text-body-medium.break-words',
      '.pv-text-details__left-panel .text-body-medium',
      'h2.text-heading-large',
      '.ph5 .text-body-medium'
    ];
    
    let bioElement = null;
    for (const selector of bioSelectors) {
      bioElement = document.querySelector(selector);
      if (bioElement) break;
    }
    data.bio = bioElement ? bioElement.textContent.trim() : '';

    
    const followerSelectors = [
      'a[href*="followers"] .t-bold',
      '.pv-recent-activity-section__follower-count .t-bold',
      '[aria-label*="follower"] .t-bold'
    ];
    
    let followerElement = null;
    for (const selector of followerSelectors) {
      followerElement = document.querySelector(selector);
      if (followerElement) break;
    }
    data.followerCount = followerElement ? parseConnectionCount(followerElement.textContent.trim()) : 0;

    
    const connectionSelectors = [
      'a[href*="connections"] .t-bold',
      '.pv-top-card--list-bullet .t-bold',
      '[aria-label*="connection"] .t-bold'
    ];
    
    let connectionElement = null;
    for (const selector of connectionSelectors) {
      connectionElement = document.querySelector(selector);
      if (connectionElement) break;
    }
    data.connectionCount = connectionElement ? parseConnectionCount(connectionElement.textContent.trim()) : 0;

    console.log('Scraped data:', data);
    return data;

  } catch (error) {
    console.error('Error in scraping function:', error);
    return null;
  }

  function parseConnectionCount(text) {
    if (!text) return 0;
    
    
    text = text.toLowerCase().replace(/,/g, '').replace(/\+/g, '');
    
    
    if (text.includes('k')) {
      return parseInt(parseFloat(text) * 1000);
    } else if (text.includes('m')) {
      return parseInt(parseFloat(text) * 1000000);
    } else {
      const num = parseInt(text);
      return isNaN(num) ? 0 : num;
    }
  }
}

async function sendToAPI(profileData) {
  try {
    const response = await fetch('http://localhost:3000/api/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Profile saved:', result);
    return result;

  } catch (error) {
    console.error('Error sending to API:', error);
    
    return null;
  }
}