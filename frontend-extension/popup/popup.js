// ============================================================
// SecureLens - Popup Controller
// Controls what the user sees in the extension popup
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

  // ── Check Login State ──────────────────────────────────
  const isLoggedIn = await LocalStore.isLoggedIn();

  if (isLoggedIn) {
    showDashboard();
  } else {
    showLogin();
  }

  // ── Login Button ───────────────────────────────────────
  document.getElementById("login-btn")
    .addEventListener("click", async () => {

      const email    = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      const errorEl  = document.getElementById("login-error");

      errorEl.textContent = "";

      if (!email || !password) {
        errorEl.textContent = "Please enter email and password";
        return;
      }

      const btn = document.getElementById("login-btn");
      btn.disabled    = true;
      btn.textContent = "Logging in...";

      try {
        await AuthService.login(email, password);
        showDashboard();
      } catch (err) {
        errorEl.textContent = err.message;
      } finally {
        btn.disabled    = false;
        btn.textContent = "Login";
      }
    });

  // ── Register Button ────────────────────────────────────
  document.getElementById("register-btn")
    .addEventListener("click", async () => {

      const name     = document.getElementById("reg-name").value.trim();
      const email    = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      const errorEl  = document.getElementById("register-error");

      errorEl.textContent = "";

      if (!name || !email || !password) {
        errorEl.textContent = "All fields are required";
        return;
      }

      const btn = document.getElementById("register-btn");
      btn.disabled    = true;
      btn.textContent = "Creating account...";

      try {
        await AuthService.register(name, email, password);
        showDashboard();
      } catch (err) {
        errorEl.textContent = err.message;
      } finally {
        btn.disabled    = false;
        btn.textContent = "Register";
      }
    });

  // ── Toggle Login/Register ──────────────────────────────
  document.getElementById("show-register")
    .addEventListener("click", (e) => {
      e.preventDefault();
      showRegister();
    });

  document.getElementById("show-login")
    .addEventListener("click", (e) => {
      e.preventDefault();
      showLogin();
    });

  // ── Logout Button ──────────────────────────────────────
  document.getElementById("logout-btn")
    .addEventListener("click", async () => {
      await AuthService.logout();
      showLogin();
    });

  // ── Scan Button ────────────────────────────────────────
  document.getElementById("scan-btn")
    .addEventListener("click", async () => {

      const btn = document.getElementById("scan-btn");
      btn.disabled    = true;
      btn.textContent = "🔍 Scanning...";

      const resultDiv = document.getElementById("scan-result");
      const resultContent = document.getElementById("result-content");

      try {
        // Get current tab URL
        const url = await Helpers.getCurrentTabUrl();
        const content = `Scanning: ${url}`;

        // Run phishing check
        const result = await ApiService.analyze(
          url, content, Constants.THREATS.PHISHING
        );

        resultDiv.style.display = "block";

        if (result.threatDetected) {
          resultContent.innerHTML = `
            <div class="result-threat">
              ⚠️ ${result.message}<br/>
              <small>Risk: ${result.riskLevel}</small>
            </div>
          `;
        } else {
          resultContent.innerHTML = `
            <div class="result-safe">
              ✅ ${result.message}
            </div>
          `;
        }

      } catch (err) {
        resultDiv.style.display = "block";
        resultContent.innerHTML = `
          <div class="result-threat">Error: ${err.message}</div>
        `;
      } finally {
        btn.disabled    = false;
        btn.textContent = "🔍 Scan This Page";
      }
    });
});

// ── View Controllers ───────────────────────────────────────

function showLogin() {
  document.getElementById("login-view").style.display    = "block";
  document.getElementById("register-view").style.display = "none";
  document.getElementById("dashboard-view").style.display= "none";
}

function showRegister() {
  document.getElementById("login-view").style.display    = "none";
  document.getElementById("register-view").style.display = "block";
  document.getElementById("dashboard-view").style.display= "none";
}

async function showDashboard() {
  document.getElementById("login-view").style.display    = "none";
  document.getElementById("register-view").style.display = "none";
  document.getElementById("dashboard-view").style.display= "block";

  // Load user data
  const user = await LocalStore.getUser();

  if (user) {
    document.getElementById("user-name").textContent =
      `👋 ${user.fullName}`;

    // Update plan badge
    const badge = document.getElementById("user-plan");
    badge.textContent = user.plan;
    if (user.plan === "PREMIUM") {
      badge.classList.add("premium");
    }

    document.getElementById("user-plan-stat").textContent = user.plan;
  }

  // Load current URL
  const url = await Helpers.getCurrentTabUrl();
  document.getElementById("current-url").textContent =
    Helpers.truncate(url, 45);

  // Load stats and logs
  loadStats();
  loadLogs();
}

async function loadStats() {
  try {
    const stats = await ApiService.getStats();
    document.getElementById("total-threats").textContent =
      stats.totalThreatsDetected || 0;
  } catch {
    document.getElementById("total-threats").textContent = "0";
  }
}

async function loadLogs() {
  const logsEl = document.getElementById("logs-list");

  try {
    const logs = await ApiService.getLogs();

    if (!logs || logs.length === 0) {
      logsEl.innerHTML =
        '<div class="empty-state">No threats detected yet</div>';
      return;
    }

    // Show latest 5 logs
    logsEl.innerHTML = logs.slice(0, 5).map(log => `
      <div class="log-item ${log.riskLevel}">
        <div class="log-type">
          ${log.threatType.replace("_", " ")}
          — ${log.riskLevel}
        </div>
        <div class="log-url">${Helpers.truncate(log.url, 40)}</div>
        <div class="log-time">${Helpers.formatDate(log.detectedAt)}</div>
      </div>
    `).join("");

  } catch {
    logsEl.innerHTML =
      '<div class="empty-state">Could not load logs</div>';
  }
}