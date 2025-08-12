document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [tab] = await chrome.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    
    const tabTitleElement = document.getElementById('tabTitle');
    const tabUrlElement = document.getElementById('tabUrl');
    const pageSummaryElement = document.getElementById('pageSummary');
    
    if (tab && tab.title) {
      const favicon = tab.favIconUrl ? 
        `<img src="${tab.favIconUrl}" class="favicon" onerror="this.style.display='none'">` : '';
      tabTitleElement.innerHTML = favicon + tab.title;
      
      tabUrlElement.textContent = tab.url;
      
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: getPageContent
        });
        
        chrome.tabs.sendMessage(tab.id, { action: 'getContent' }, (response) => {
          if (chrome.runtime.lastError) {
            showDefaultSummary(tab, pageSummaryElement);
            return;
          }
          
          if (response && response.content) {
            const summary = generateSummary(response.content, tab.url);
            pageSummaryElement.innerHTML = summary;
          } else {
            showDefaultSummary(tab, pageSummaryElement);
          }
        });
        
        setTimeout(() => {
          if (pageSummaryElement.innerHTML.includes('Analyzing')) {
            showDefaultSummary(tab, pageSummaryElement);
          }
        }, 2000);
        
      } catch (error) {
        console.error('Error getting page content:', error);
        showDefaultSummary(tab, pageSummaryElement);
      }
      
    } else {
      tabTitleElement.innerHTML = '<span class="error">Unable to get tab info</span>';
      pageSummaryElement.innerHTML = '<span class="error">No page data available</span>';
    }
    
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('tabTitle').innerHTML = '<span class="error">Error loading tab info</span>';
    document.getElementById('pageSummary').innerHTML = '<span class="error">Error loading summary</span>';
  }
});

function getPageContent() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getContent') {
      try {
        const title = document.title;
        const description = document.querySelector('meta[name="description"]')?.content || '';
        const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
          .slice(0, 5)
          .map(h => h.textContent.trim())
          .filter(text => text.length > 0);
        
        const paragraphs = Array.from(document.querySelectorAll('p'))
          .slice(0, 3)
          .map(p => p.textContent.trim())
          .filter(text => text.length > 50);
        
        sendResponse({
          content: {
            title,
            description,
            headings,
            paragraphs,
            url: window.location.href
          }
        });
      } catch (error) {
        sendResponse({ error: error.message });
      }
    }
  });
}

function generateSummary(content, url) {
  const domain = new URL(url).hostname;
  let summary = '';
  
  if (domain.includes('github.com')) {
    summary = `📂 GitHub repository or page`;
    if (content.description) {
      summary += ` - ${content.description}`;
    }
  } else if (domain.includes('youtube.com')) {
    summary = `🎥 YouTube video or channel`;
    if (content.headings.length > 0) {
      summary += ` - ${content.headings[0]}`;
    }
  } else if (domain.includes('stackoverflow.com')) {
    summary = `💻 Stack Overflow question or answer`;
    if (content.headings.length > 0) {
      summary += ` about ${content.headings[0].toLowerCase()}`;
    }
  } else if (domain.includes('wikipedia.org')) {
    summary = `📚 Wikipedia article`;
    if (content.description) {
      summary += ` - ${content.description}`;
    }
  } else if (domain.includes('news') || domain.includes('cnn.com') || domain.includes('bbc.com')) {
    summary = `📰 News article`;
    if (content.headings.length > 0) {
      summary += ` - ${content.headings[0]}`;
    }
  } else if (domain.includes('reddit.com')) {
    summary = `🔗 Reddit post or discussion`;
    if (content.headings.length > 0) {
      summary += ` - ${content.headings[0]}`;
    }
  } else {
    if (content.description) {
      summary = `🌐 ${content.description}`;
    } else if (content.headings.length > 0) {
      summary = `🌐 ${content.headings[0]}`;
    } else if (content.paragraphs.length > 0) {
      summary = `🌐 ${content.paragraphs[0].substring(0, 100)}...`;
    } else {
      summary = `🌐 Website: ${domain}`;
    }
  }
  
  if (content.headings.length > 1) {
    summary += `<br><small>📋 Topics: ${content.headings.slice(1, 3).join(', ')}</small>`;
  }
  
  return summary;
}

function showDefaultSummary(tab, element) {
  const domain = new URL(tab.url).hostname;
  let summary = '';
  
  if (domain.includes('chrome://')) {
    summary = '⚙️ Chrome internal page';
  } else if (domain.includes('localhost')) {
    summary = '🏠 Local development server';
  } else if (domain.includes('file://')) {
    summary = '📁 Local file';
  } else {
    summary = `🌐 Website: ${domain}`;
  }
  
  element.innerHTML = summary;
}