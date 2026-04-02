// ============================================================
// SecureLens - Content Script
// Runs on every webpage the user visits
// ============================================================

// ── Load all required scripts ──────────────────────────────
// Note: In Manifest V3 content scripts can't import modules
// All scripts are loaded via manifest.json content_scripts

(async () => {

  // Get current page info
  const url = window.location.href;
  const pageContent = document.body?.innerText || "";

  // Skip internal browser pages
  if (url.startsWith("chrome://") ||
      url.startsWith("chrome-extension://") ||
      url.startsWith("about:")) {
    return;
  }

  // Send page info to background for analysis
  chrome.runtime.sendMessage({
    type:    "ANALYZE_PAGE",
    url:     url,
    content: pageContent.substring(0, 2000)  // First 2000 chars
  });

  // Listen for threat alerts from background
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "THREAT_DETECTED") {
      showThreatAlert(message.threat);
    }
  });

  /**
   * Show visual alert banner on page when threat detected
   */
  function showThreatAlert(threat) {

    // Don't show duplicate alerts
    if (document.getElementById("securelens-alert")) return;

    const colors = {
      CRITICAL: "#dc3545",
      HIGH:     "#fd7e14",
      MEDIUM:   "#ffc107",
      LOW:      "#28a745"
    };

    const color = colors[threat.riskLevel] || "#dc3545";

    // Create alert banner
    const alert = document.createElement("div");
    alert.id = "securelens-alert";
    alert.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999999;
      background: ${color};
      color: white;
      padding: 12px 20px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;

    alert.innerHTML = `
      <span>
        🔐 SecureLens: ${threat.message}
        (Risk: ${threat.riskLevel})
      </span>
      <button
        onclick="document.getElementById('securelens-alert').remove()"
        style="
          background: rgba(255,255,255,0.3);
          border: none;
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        ">
        Dismiss
      </button>
    `;

    document.body.prepend(alert);

    // Auto dismiss after 10 seconds
    setTimeout(() => alert.remove(), 10000);
  }

})();