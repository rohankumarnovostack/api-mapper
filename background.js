// Track API calls from localhost:3000 to localhost:3001
const apiCalls = [];

// Extract API name from URL path (returns the last segment/endpoint name)
function extractApiName(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Remove leading slash and get the path segments
    const segments = pathname.split('/').filter(segment => segment.length > 0);

    // Return the last segment as the API endpoint name
    // e.g., /v1/crm-component-configs/getConfigAndMetaUnauth -> getConfigAndMetaUnauth
    if (segments.length > 0) {
      return segments[segments.length - 1];
    }

    return pathname || '/';
  } catch (e) {
    return url;
  }
}

// Check if request is a socket connection
function isSocketConnection(url) {
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('/socket.io') ||
         lowerUrl.includes('websocket') ||
         lowerUrl.includes('ws://') ||
         lowerUrl.includes('wss://') ||
         lowerUrl.includes('socket') && lowerUrl.includes('transport=');
}

// Listen for network requests
chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    // Check if the request is from localhost:3000 to localhost:3001
    const initiator = details.initiator || details.documentUrl;
    const targetUrl = details.url;

    // Ignore socket connections
    if (isSocketConnection(targetUrl)) {
      return;
    }

    if (initiator && initiator.includes('localhost:3000') && targetUrl.includes('localhost:3001')) {
      // Get the full URL of the page that made the request
      let fullPageUrl = initiator;

      if (details.tabId && details.tabId !== -1) {
        try {
          const tab = await chrome.tabs.get(details.tabId);
          fullPageUrl = tab.url || initiator;
        } catch (e) {
          console.log('Could not get tab URL, using initiator:', e);
        }
      }

      // Check if this Location + API combination already exists
      const isDuplicate = apiCalls.some(call =>
        call.location === fullPageUrl && call.api === targetUrl
      );

      // Skip if duplicate
      if (isDuplicate) {
        console.log('Duplicate API call ignored:', { location: fullPageUrl, api: targetUrl });
        return;
      }

      const apiCall = {
        location: fullPageUrl,
        api: targetUrl,
        apiName: extractApiName(targetUrl),
        timestamp: new Date().toISOString(),
        method: details.method
      };

      apiCalls.push(apiCall);

      // Save to chrome storage
      chrome.storage.local.set({ apiCalls: apiCalls }, () => {
        console.log('API call tracked:', apiCall);
      });

      // Update badge to show number of tracked calls
      chrome.action.setBadgeText({ text: apiCalls.length.toString() });
      chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
    }
  },
  { urls: ["http://localhost:3001/*"] }
);

// Load stored API calls on startup
chrome.storage.local.get(['apiCalls'], (result) => {
  if (result.apiCalls) {
    apiCalls.push(...result.apiCalls);
    chrome.action.setBadgeText({ text: apiCalls.length.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getApiCalls') {
    sendResponse({ apiCalls: apiCalls });
  } else if (request.action === 'clearApiCalls') {
    apiCalls.length = 0;
    chrome.storage.local.set({ apiCalls: [] }, () => {
      chrome.action.setBadgeText({ text: '' });
      sendResponse({ success: true });
    });
  }
  return true;
});
