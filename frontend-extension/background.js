// ============================================================
// SecureLens - Background Service Worker
// Handles messages from content scripts and coordinates analysis
// ============================================================

// ── Constants (duplicated here since service workers
//    can't import from other files directly) ──────────────
const API_BASE_URL = "https://securelens.up.railway.app/api";
const TOKEN_KEY    = "securelens_token";
// ── Listen for messages from content scripts ───────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "ANALYZE_PAGE") {
    handlePageAnalysis(message, sender);
  }

  return true; // Keep message channel open for async
});

/**
 * Analyze page content for threats
 */
async function handlePageAnalysis(message, sender) {

  // Get stored JWT token
  const storage = await chrome.storage.local.get(TOKEN_KEY);
  const token   = storage[TOKEN_KEY];

  // Skip if not logged in
  if (!token) return;

  const { url, content } = message;

  // Run all 3 detectors in parallel
  const [phishing, injection, sensitive] = await Promise.allSettled([
    analyzeContent(url, content, "PHISHING",          token),
    analyzeContent(url, content, "PROMPT_INJECTION",   token),
    analyzeContent(url, content, "SENSITIVE_DATA",     token)
  ]);

  // Send alerts for detected threats
  [phishing, injection, sensitive].forEach(result => {
    if (result.status === "fulfilled" &&
        result.value?.threatDetected) {

      // Send alert to content script
      chrome.tabs.sendMessage(sender.tab.id, {
        type:   "THREAT_DETECTED",
        threat: result.value
      });

      // Update extension badge
      updateBadge(sender.tab.id, result.value.riskLevel);
    }
  });
}

/**
 * Call backend detection API
 */
async function analyzeContent(url, content, threatType, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/detect`, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ url, content, threatType })
    });

    const data = await response.json();
    return data.success ? data.data : null;

  } catch (error) {
    console.error(`SecureLens: ${threatType} check failed`, error);
    return null;
  }
}

/**
 * Update extension icon badge with threat count
 */
function updateBadge(tabId, riskLevel) {
  const colors = {
    CRITICAL: "#dc3545",
    HIGH:     "#fd7e14",
    MEDIUM:   "#ffc107",
    LOW:      "#28a745"
  };

  chrome.action.setBadgeText({
    text:  "!",
    tabId: tabId
  });

  chrome.action.setBadgeBackgroundColor({
    color: colors[riskLevel] || "#dc3545",
    tabId: tabId
  });
}