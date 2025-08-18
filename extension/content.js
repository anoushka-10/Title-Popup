
let isScrapingActive = false;
let isInteractionActive = false;
let scrapingInterval;
let interactionData = {
  targetLikes: 0,
  targetComments: 0,
  likesCompleted: 0,
  commentsCompleted: 0,
  processedPosts: new Set()
};

const COMMENT_VARIATIONS = [
  'CFBR',
  'Great insights!',
  'Thanks for sharing',
  'Interesting perspective',
  'Well said!'
];

function getRandomComment() {
  return COMMENT_VARIATIONS[Math.floor(Math.random() * COMMENT_VARIATIONS.length)];
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'startScraping':
      startProfileScraping(request.urls);
      sendResponse({success: true});
      break;
    
    case 'stopScraping':
      stopProfileScraping();
      sendResponse({success: true});
      break;
    
    case 'startInteraction':
      startFeedInteraction(request.likeCount, request.commentCount);
      sendResponse({success: true});
      break;
    
    case 'stopInteraction':
      stopFeedInteraction();
      sendResponse({success: true});
      break;
    
    default:
      sendResponse({success: false, error: 'Unknown action'});
  }
});


function startProfileScraping(urls) {
  if (isScrapingActive) return;
  
  isScrapingActive = true;
  let currentIndex = 0;
  const scrapedProfiles = [];
  
  function scrapeNextProfile() {
    if (!isScrapingActive || currentIndex >= urls.length) {
      completeScraping(scrapedProfiles);
      return;
    }
    
    const currentUrl = urls[currentIndex];
    const profileName = extractProfileName(currentUrl);
    
    
    chrome.runtime.sendMessage({
      action: 'scrapingProgress',
      current: currentIndex + 1,
      total: urls.length,
      currentProfile: profileName
    });
    
    
    window.location.href = currentUrl;
    
    
    setTimeout(() => {
      if (isScrapingActive) {
        try {
          const profileData = scrapeCurrentProfile();
          scrapedProfiles.push(profileData);
          currentIndex++;
          
          
          setTimeout(scrapeNextProfile, 3000);
        } catch (error) {
          chrome.runtime.sendMessage({
            action: 'scrapingError',
            error: error.message
          });
          stopProfileScraping();
        }
      }
    }, 4000);
  }
  
  scrapeNextProfile();
}

function scrapeCurrentProfile() {
  const profileData = {
    url: window.location.href,
    timestamp: new Date().toISOString()
  };
  
  try {
    
    const nameElement = document.querySelector('h1.text-heading-xlarge, h1.pv-text-details__left-panel h1');
    profileData.name = nameElement ? nameElement.textContent.trim() : 'N/A';
    
    
    const headlineElement = document.querySelector('.text-body-medium.break-words, .pv-text-details__left-panel .text-body-medium');
    profileData.headline = headlineElement ? headlineElement.textContent.trim() : 'N/A';
    
    
    const locationElement = document.querySelector('.text-body-small.inline.t-black--light.break-words, .pv-text-details__left-panel .pb2 .text-body-small');
    profileData.location = locationElement ? locationElement.textContent.trim() : 'N/A';
    
    
    const aboutElement = document.querySelector('[data-field="experience_summary_text"] span, .pv-about__text .inline-show-more-text span');
    profileData.about = aboutElement ? aboutElement.textContent.trim() : 'N/A';
    
    
    const experienceElements = document.querySelectorAll('[data-field="position_title"], .pv-entity__summary-info h3');
    profileData.experience = Array.from(experienceElements).slice(0, 3).map(el => el.textContent.trim());
    
    
    const skillElements = document.querySelectorAll('.pv-skill-category-entity__name span, .skill-category-entity__name span');
    profileData.skills = Array.from(skillElements).slice(0, 10).map(el => el.textContent.trim());
    
    
    const connectionElement = document.querySelector('.t-black--light.t-normal span, .pv-top-card--list-bullet li span');
    profileData.connections = connectionElement ? connectionElement.textContent.trim() : 'N/A';
    
    console.log('Profile scraped:', profileData);
    return profileData;
    
  } catch (error) {
    console.error('Error scraping profile:', error);
    return profileData;
  }
}

function stopProfileScraping() {
  isScrapingActive = false;
  if (scrapingInterval) {
    clearInterval(scrapingInterval);
  }
}

function completeScraping(profiles) {
  isScrapingActive = false;
  
  
  const dataStr = JSON.stringify(profiles, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `linkedin_profiles_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  chrome.runtime.sendMessage({
    action: 'scrapingComplete',
    count: profiles.length
  });
}

function extractProfileName(url) {
  const match = url.match(/\/in\/([^\/]+)/);
  return match ? match[1] : 'Unknown';
}


function startFeedInteraction(targetLikes, targetComments) {
  if (isInteractionActive) return;
  
  
  if (!window.location.href.includes('linkedin.com/feed')) {
    
window.location.href = 'https://www.linkedin.com/feed/';
    return;
  }
  
  isInteractionActive = true;
  
  
  interactionData = {
    targetLikes: targetLikes,
    targetComments: targetComments,
    likesCompleted: 0,
    commentsCompleted: 0,
    processedPosts: new Set()
  };
  
  console.log(`Starting feed interaction: ${targetLikes} likes, ${targetComments} comments`);
  
  
  setTimeout(() => {
    processFeedPosts();
  }, 2000);
}

function processFeedPosts() {
  if (!isInteractionActive) return;
  
  
  if (interactionData.likesCompleted >= interactionData.targetLikes && 
      interactionData.commentsCompleted >= interactionData.targetComments) {
    completeInteraction();
    return;
  } ``
  
  
  const posts = getAllVisiblePosts();
  let actionTaken = false;
  
  for (let post of posts) {
    if (!isInteractionActive) return;
    
    const postId = getPostId(post);
    if (interactionData.processedPosts.has(postId)) continue;
    
    
    interactionData.processedPosts.add(postId);
    
    
    if (interactionData.likesCompleted < interactionData.targetLikes) {
      if (tryLikePost(post)) {
        interactionData.likesCompleted++;
        actionTaken = true;
        console.log(`✅ Liked post ${interactionData.likesCompleted}/${interactionData.targetLikes}`);
        
        sendProgressUpdate();
        
        
        setTimeout(() => {
          if (isInteractionActive && interactionData.commentsCompleted < interactionData.targetComments) {
            tryCommentOnPost(post);
          }
        }, randomDelay(1000, 2000));
        
        break; 
      }
    }
    
    else if (interactionData.commentsCompleted < interactionData.targetComments) {
      if (tryCommentOnPost(post)) {
        actionTaken = true;
        break; 
      }
    }
  }
  
  
  if (!actionTaken) {
    scrollToLoadMore();
  }
  
  
  setTimeout(() => {
    if (isInteractionActive) {
      processFeedPosts();
    }
  }, randomDelay(2000, 4000));
}

function getAllVisiblePosts() {
  const postSelectors = [
    'div[data-urn*="urn:li:activity:"]',
    '.feed-shared-update-v2',
    '.occludable-update',
    'article[data-urn]',
    '.feed-shared-update-v2__description-wrapper'
  ];
  
  let allPosts = [];
  
  for (let selector of postSelectors) {
    const posts = document.querySelectorAll(selector);
    allPosts = allPosts.concat(Array.from(posts));
  }
  
  
  const uniquePosts = [...new Map(allPosts.map(post => [getPostId(post), post])).values()];
  
  return uniquePosts.filter(post => {
    const rect = post.getBoundingClientRect();
    return rect.top >= -100 && rect.top <= window.innerHeight + 100 && rect.height > 0;
  });
}

function getPostId(post) {
  
  return post.getAttribute('data-urn') || 
         post.getAttribute('data-id') || 
         post.querySelector('[data-urn]')?.getAttribute('data-urn') ||
         post.innerHTML.substring(0, 100); 
}

function tryLikePost(post) {
  try {
    const likeSelectors = [
      'button[aria-label*="Like"][data-control-name*="like"]',
      'button[aria-label*="React Like"]',
      'button.reaction-button[aria-label*="Like"]',
      '.social-actions-button[aria-label*="Like"]',
      'button[data-control-name="like_toggle"]'
    ];
    
    let likeButton = null;
    
    for (let selector of likeSelectors) {
      likeButton = post.querySelector(selector);
      if (likeButton && isElementVisible(likeButton)) {
        break;
      }
    }
    
    if (!likeButton) {
      console.log('❌ Like button not found for post');
      return false;
    }
    
    
    const isLiked = likeButton.getAttribute('aria-pressed') === 'true' ||
                   likeButton.classList.contains('active') ||
                   likeButton.classList.contains('artdeco-button--selected') ||
                   likeButton.querySelector('.reaction-button--active') ||
                   likeButton.getAttribute('aria-label')?.includes('Unlike');
    
    if (isLiked) {
      console.log('👍 Post already liked, skipping');
      return false;
    }
    
    
    likeButton.style.outline = '2px solid #0077b5';
    setTimeout(() => {
      likeButton.style.outline = '';
    }, 500);
    
    simulateHumanClick(likeButton);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error liking post:', error);
    return false;
  }
}

function tryCommentOnPost(post) {
  try {
    
    const commentSelectors = [
      'button[aria-label*="Comment"]',
      'button[data-control-name="comment_toggle"]',
      '.social-actions-button--comment',
      '.feed-shared-social-action-bar button[aria-label*="Comment"]',
      'button[aria-label="Comment on"]'
    ];
    
    let commentButton = null;
    
    for (let selector of commentSelectors) {
      commentButton = post.querySelector(selector);
      if (commentButton && isElementVisible(commentButton)) {
        break;
      }
    }
    
    if (!commentButton) {
      console.log('❌ Comment button not found');
      return false;
    }
    
    
    simulateHumanClick(commentButton);
    
    
    setTimeout(() => {
      if (isInteractionActive) {
        typeComment(post);
      }
    }, randomDelay(1000, 2000));
    
    return true;
    
  } catch (error) {
    console.error('❌ Error commenting on post:', error);
    return false;
  }
}

function typeComment(post) {
  try {
    
    setTimeout(() => {
      const commentBoxSelectors = [
        '.ql-editor[contenteditable="true"]',
        'div[role="textbox"][contenteditable="true"]',
        '.comments-comment-texteditor .ql-editor',
        '.comments-comment-box__form .ql-editor',
        '.comments-comment-texteditor div[contenteditable="true"]'
      ];
      
      let commentBox = null;
      
      
      for (let selector of commentBoxSelectors) {
        commentBox = post.querySelector(selector);
        if (commentBox && isElementVisible(commentBox)) break;
        
        
        commentBox = document.querySelector(selector);
        if (commentBox && isElementVisible(commentBox)) break;
      }
      
      if (!commentBox) {
        console.log('❌ Comment text box not found');
        return false;
      }
      
      
      commentBox.focus();
      
      
      const comment = 'CFBR';
      typeText(commentBox, comment);
      
      
      setTimeout(() => {
        submitComment(post, commentBox);
      }, randomDelay(1000, 2000));
      
    }, 500);
    
  } catch (error) {
    console.error('❌ Error typing comment:', error);
  }
}

function typeText(element, text = null) {
  
  const commentText = text || getRandomComment();
  
  
  element.innerHTML = '';
  element.textContent = '';
  
  
  element.focus();
  
  
  let index = 0;
  const typeInterval = setInterval(() => {
    if (index < commentText.length && isInteractionActive) {
      element.textContent += commentText[index];
      
      
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      const keyboardEvent = new KeyboardEvent('keyup', { 
        bubbles: true, 
        key: commentText[index],
        code: `Key${commentText[index].toUpperCase()}`
      });
      
      element.dispatchEvent(inputEvent);
      element.dispatchEvent(keyboardEvent);
      
      index++;
    } else {
      clearInterval(typeInterval);
    }
  }, randomDelay(80, 200));
}

function submitComment(post, commentBox) {
  try {
    
    const submitSelectors = [
      'button[data-control-name="comment.post"]',
      'button[aria-label*="Post comment"]',
      '.comments-comment-box__submit-button--cr',
      '.comments-comment-box button[type="submit"]',
      'button.comments-comment-box__submit-button',
      '.artdeco-button--primary[aria-label*="Post"]'
    ];
    
    let submitButton = null;
    
    
    for (let selector of submitSelectors) {
      submitButton = post.querySelector(selector);
      if (submitButton && !submitButton.disabled && isElementVisible(submitButton)) break;
      
      
      submitButton = document.querySelector(selector);
      if (submitButton && !submitButton.disabled && isElementVisible(submitButton)) break;
    }
    
    if (!submitButton) {
      console.log('❌ Submit button not found');
      return false;
    }
    
    
    simulateHumanClick(submitButton);
    
    interactionData.commentsCompleted++;
    console.log(`💬 Commented on post ${interactionData.commentsCompleted}/${interactionData.targetComments}`);
    
    sendProgressUpdate();
    
    return true;
    
  } catch (error) {
    console.error('❌ Error submitting comment:', error);
    return false;
  }
}

function scrollToLoadMore() {
  const currentScrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  
  if (currentScrollY >= maxScroll * 0.9) {
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('📜 Scrolled to top to refresh feed');
  } else {
    
    const scrollAmount = window.innerHeight * 0.6;
    window.scrollBy({
      top: scrollAmount,
      behavior: 'smooth'
    });
    console.log('📜 Scrolling to load more posts...');
  }
}



function simulateHumanClick(element) {
  
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  
  const events = ['mousedown', 'mouseup', 'click'];
  
  events.forEach((eventType, index) => {
    setTimeout(() => {
      const event = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      });
      element.dispatchEvent(event);
    }, index * 50);
  });
}

function isElementVisible(element) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  
  return rect.width > 0 && 
         rect.height > 0 && 
         style.visibility !== 'hidden' && 
         style.display !== 'none' &&
         style.opacity !== '0';
}

function stopFeedInteraction() {
  isInteractionActive = false;
  console.log('⏹️ Feed interaction stopped');
}

function completeInteraction() {
  isInteractionActive = false;
  
  console.log(`🎉 Interaction completed! Likes: ${interactionData.likesCompleted}, Comments: ${interactionData.commentsCompleted}`);
  
  chrome.runtime.sendMessage({
    action: 'interactionComplete',
    likes: interactionData.likesCompleted,
    comments: interactionData.commentsCompleted
  });
}

function sendProgressUpdate() {
  const total = interactionData.targetLikes + interactionData.targetComments;
  const current = interactionData.likesCompleted + interactionData.commentsCompleted;
  
  chrome.runtime.sendMessage({
    action: 'interactionProgress',
    current: current,
    total: total,
    likes: interactionData.likesCompleted,
    comments: interactionData.commentsCompleted
  });
}


function randomDelay(min = 1000, max = 3000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function autoScroll() {
  return new Promise((resolve) => {
    let totalHeight = 0;
    const distance = 100;
    const timer = setInterval(() => {
      const scrollHeight = document.body.scrollHeight;
      window.scrollBy(0, distance);
      totalHeight += distance;

      if (totalHeight >= scrollHeight || !isInteractionActive) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });
}


console.log('LinkedIn Extension Content Script Loaded');


if (!window.location.href.includes('linkedin.com')) {
  console.warn('LinkedIn Extension: Not on LinkedIn domain');
}

function handleInteractionError(error, context) {
  console.error(`❌ Error in ${context}:`, error);
  
  if (context === 'like' || context === 'comment') {
    setTimeout(() => {
      if (isInteractionActive) {
        scrollToLoadMore();
      }
    }, randomDelay(2000, 3000));
  }
}

const RATE_LIMITS = {
  minDelayBetweenActions: 3000,
  maxDelayBetweenActions: 8000,
  scrollDelay: 2000,
  commentDelay: 5000
};

function getSmartDelay(actionType) {
  switch (actionType) {
    case 'like':
      return randomDelay(RATE_LIMITS.minDelayBetweenActions, RATE_LIMITS.maxDelayBetweenActions);
    case 'comment':
      return randomDelay(RATE_LIMITS.commentDelay, RATE_LIMITS.commentDelay + 3000);
    case 'scroll':
      return randomDelay(RATE_LIMITS.scrollDelay, RATE_LIMITS.scrollDelay + 1000);
    default:
      return randomDelay(1000, 3000);
  }
}