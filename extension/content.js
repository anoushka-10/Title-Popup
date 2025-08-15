console.log('LinkedIn Profile Scraper content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeProfile') {
    (async () => {
      try {
        const profileData = await scrapeCurrentProfile();
        sendResponse({ success: true, data: profileData });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    })();

    return true;
  }
});

function scrapeCurrentProfile() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = 1000;

    const scrapingInterval = setInterval(() => {
      const nameElement = document.querySelector('h1.text-heading-xlarge, .pv-text-details__left-panel h1');

      if (nameElement) {
        clearInterval(scrapingInterval);

        const data = {};
        data.name = nameElement ? nameElement.textContent.trim() : '';

        const locationElement = document.querySelector('.text-body-small.inline.t-black--light.break-words, .pv-text-details__left-panel .text-body-small');
        data.location = locationElement ? locationElement.textContent.trim() : '';
        
        resolve(data);

      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(scrapingInterval);
          reject(new Error('Failed to find profile content after 10 seconds.'));
        }
      }
    }, interval);
  });
}

function parseConnectionCount(text) {
  if (!text) return 0;
  text = text.toLowerCase().replace(/,/g, '');
  if (text.includes('k')) {
    return parseInt(parseFloat(text) * 1000);
  } else if (text.includes('m')) {
    return parseInt(parseFloat(text) * 1000000);
  } else {
    return parseInt(text) || 0;
  }
}