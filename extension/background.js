
chrome.runtime.onInstalled.addListener(() => {
  console.log('LinkedIn Profile Scraper extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('linkedin.com/in/')) {
    console.log('LinkedIn profile page loaded:', tab.url);
  }
});