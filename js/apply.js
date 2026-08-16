const STORAGE_KEY = "nkanda_profile";

function loadProfile() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; }
}
function getParam(name) { return new URLSearchParams(window.location.search).get(name); }
function uid() { return Math.random().toString(36).slice(2, 9); }
function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "TR";
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

const STEPS = ["loading", "match", "travelers", "details", "docs", "checkout", "success"];

const state = {
  destCode: getParam("code") || "eg",
  route: null,
  step: "loading",
  docStepIndex: 0,
  travelers: [{ id: uid(), name: "", dob: "", passport: "", relationship: "Primary applicant" }],
  docs: {}, // travelerId -> { docTitle: true }
};

function showStep(step) {
  state.step = step;
  STEPS.forEach((s) => {
    document.getElementById(`step-${s}`).style.display = s === step ? "" : "none";
  });

  const tabs = document.getElementById("flow-tabs");
  const footer = document.getElementById("footer-bar");
  const secondary = document.getElementById("footer-secondary");

  if (["travelers", "docs", "checkout"].includes(step)) {
    tabs.style.display = "flex";
    document.querySelectorAll(".flow-tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.tab === step);
      t.classList.toggle("done", STEPS.indexOf(t.dataset.tab) < STEPS.indexOf(step) && t.dataset.tab !== step);
    });
  } else {
    tabs.style.display = "none";
  }

  if (["match", "travelers", "details", "docs", "checkout"].includes(step)) {
    footer.style.display = "flex";
    secondary.style.display = step === "match" ? "none" : "inline-flex";
  } else {
    footer.style.display = "none";
  }

  renderFooterPrimary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderFooterPrimary() {
  const primary = document.getElementById("footer-primary");
  const map = {
    match: "Continue",
    travelers: () => `Confirm ${state.travelers.length} traveler${state.travelers.length > 1 ? "s" : ""}`,
    details: "Continue to documents",
    docs: "Proceed to checkout",
    checkout: "Pay & submit",
  };
  const val = map[state.step];
  primary.textContent = typeof val === "function" ? val() : (val || "Continue");
}

// ---------- Loading ----------
const LOADING_MESSAGES = [
  "Checking your profile…",
  "Comparing visa routes…",
  "Calculating approval odds…",
  "Finding your best route…",
];

function runLoading() {
  const el = document.getElementById("loading-msg");
  let i = 0;
  el.textContent = LOADING_MESSAGES[0];
  const interval = setInterval(() => {
    i++;
    if (i < LOADING_MESSAGES.length) el.textContent = LOADING_MESSAGES[i];
  }, 550);

  setTimeout(() => {
    clearInterval(interval);
    const profile = loadProfile();
    state.route = matchRoute(state.destCode, profile.purpose || "tourism", profile);
    renderMatch();
    showStep("match");
  }, 2400);
}

// ---------- Match ----------
function renderMatch() {
  const r = state.route;
  document.getElementById("match-sub").textContent = `${r.destination.name} · based on your citizenship and travel history`;
  document.getElementById("match-card").innerHTML = `
    <div class="route-result-card">
      <div class="top">
        <div>
          <div class="cat">${r.category}</div>
          <div class="name">${r.name}</div>
        </div>
        <div class="chance">
          <div class="pct">${r.acceptanceChance}%</div>
          <div class="lbl">acceptance</div>
        </div>
      </div>
      <div class="why">${r.justification}</div>
      ${r.factors.map((f) => `<div style="font-size:12px; color:var(--accent-dark); font-weight:600; margin-bottom:4px;">${f}</div>`).join("")}
      <div class="stats">
        <span>⏱ ${r.duration}</span>
        <span>💼 ${r.workRights}</span>
        <span>📋 ${r.documents.length} documents</span>
      </div>
    </div>
  `;
}

// ---------- Travelers ----------
function renderTravelers() {
  const list = document.getElementById("traveler-list");
  list.innerHTML = state.travelers.map((t, i) => `
    <div class="traveler-card">
      <div class="traveler-avatar">${initials(t.name) || "TR"}</div>
      <div class="info">
        <div class="name">${t.name || `Traveler ${i + 1}`}</div>
        <div class="status">${t.relationship}</div>
      </div>
      ${i > 0 ? `<button class="traveler-remove" data-id="${t.id}">Remove</button>` : ""}
    </div>
  `).join("");

  list.querySelectorAll(".traveler-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.travelers = state.travelers.filter((t) => t.id !== btn.dataset.id);
      renderTravelers();
      renderFooterPrimary();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("add-traveler-btn").addEventListener("click", () => {
    state.travelers.push({ id: uid(), name: "", dob: "", passport: "", relationship: "Traveler" });
    renderTravelers();
    renderFooterPrimary();
  });
});

// ---------- Details ----------
function renderDetails() {
  document.getElementById("details-forms").innerHTML = state.travelers.map((t, i) => `
    <div class="apply-card" style="margin-bottom:16px; max-width:none;">
      <label class="field-label">${i === 0 ? "Primary applicant" : `Traveler ${i + 1}`} — full name</label>
      <input type="text" data-id="${t.id}" data-field="name" value="${t.name}" placeholder="Full legal name"
        style="width:100%; padding:13px 16px; border-radius:12px; border:1px solid var(--hairline); background:var(--backdrop); font-size:14.5px; margin-bottom:12px; font-family:inherit;">
      <div style="display:flex; gap:12px;">
        <div style="flex:1;">
          <label class="field-label">Date of birth</label>
          <input type="date" data-id="${t.id}" data-field="dob" value="${t.dob}"
            style="width:100%; padding:13px 16px; border-radius:12px; border:1px solid var(--hairline); background:var(--backdrop); font-size:14.5px; font-family:inherit;">
        </div>
        <div style="flex:1;">
          <label class="field-label">Passport number</label>
          <input type="text" data-id="${t.id}" data-field="passport" value="${t.passport}" placeholder="e.g. 123456789"
            style="width:100%; padding:13px 16px; border-radius:12px; border:1px solid var(--hairline); background:var(--backdrop); font-size:14.5px; font-family:inherit;">
        </div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("#details-forms input").forEach((input) => {
    input.addEventListener("input", () => {
      const traveler = state.travelers.find((t) => t.id === input.dataset.id);
      if (traveler) traveler[input.dataset.field] = input.value;
      if (input.dataset.field === "name") renderTravelers();
    });
  });
}

// ---------- Docs ----------
function renderDocs() {
  const r = state.route;
  document.getElementById("docs-sub").textContent = `These are the documents required for ${r.destination.name}, per traveler.`;
  const list = document.getElementById("docs-list");
  list.innerHTML = state.travelers.map((t) => {
    const done = state.docs[t.id] || {};
    return `
      <div style="margin-bottom:18px;">
        <div style="font-weight:700; font-size:14px; margin-bottom:8px;">${t.name || "Traveler"} <span style="color:var(--subink); font-weight:500;">— ${Object.keys(done).length}/${r.documents.length} uploaded</span></div>
        ${r.documents.map((doc) => `
          <div class="doc-item">
            <div class="row">
              <div class="check ${done[doc.title] ? "done" : ""}">${done[doc.title] ? "✓" : ""}</div>
              <div style="flex:1;">
                <div class="name">${doc.title}</div>
                <div class="desc">${doc.desc}</div>
              </div>
              <button class="doc-upload-btn" data-traveler="${t.id}" data-doc="${doc.title}">${done[doc.title] ? "Replace" : "Upload"}</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }).join("");

  list.querySelectorAll(".doc-upload-btn").forEach((btn) => {
    btn.onclick = () => {
      const tId = btn.dataset.traveler;
      const docTitle = btn.dataset.doc;
      state.docs[tId] = state.docs[tId] || {};
      state.docs[tId][docTitle] = true;
      renderDocs();
    };
  });
}

// ---------- Checkout ----------
function renderCheckout() {
  const r = state.route;
  const perTraveler = 49;
  const govFee = 25;
  const rows = state.travelers.map((t, i) => `
    <div class="summary-row"><span class="lbl">${t.name || `Traveler ${i + 1}`} — service fee</span><span>$${perTraveler}</span></div>
    <div class="summary-row"><span class="lbl">${t.name || `Traveler ${i + 1}`} — government fee</span><span>$${govFee}</span></div>
  `).join("");
  const total = state.travelers.length * (perTraveler + govFee);
  document.getElementById("summary-rows").innerHTML = `
    <div class="summary-row"><span class="lbl">Route</span><span>${r.name}</span></div>
    ${rows}
    <div class="summary-total"><span>Total</span><span>$${total}</span></div>
  `;
}

// ---------- Navigation ----------
function goNext() {
  const idx = STEPS.indexOf(state.step);

  if (state.step === "travelers") {
    showStep("details");
    renderDetails();
    return;
  }
  if (state.step === "details") {
    showStep("docs");
    renderDocs();
    return;
  }
  if (state.step === "checkout") {
    const name = document.getElementById("pay-name").value.trim();
    const number = document.getElementById("pay-number").value.trim();
    const expiry = document.getElementById("pay-expiry").value.trim();
    const cvc = document.getElementById("pay-cvc").value.trim();
    if (!name || !number || !expiry || !cvc) {
      document.getElementById("pay-error").style.display = "block";
      return;
    }
    document.getElementById("pay-error").style.display = "none";
    document.getElementById("success-sub").textContent = `Your ${state.route.name} application for ${state.travelers.length} traveler${state.travelers.length > 1 ? "s" : ""} has been received. Decision guaranteed within ${state.route.destination.guaranteedDays} days.`;
    showStep("success");
    return;
  }

  const next = STEPS[idx + 1];
  if (next) {
    showStep(next);
    if (next === "travelers") renderTravelers();
    if (next === "checkout") renderCheckout();
  }
}

function goBack() {
  const idx = STEPS.indexOf(state.step);
  if (state.step === "travelers") { showStep("match"); return; }
  if (idx > 1) showStep(STEPS[idx - 1]);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("back-link").addEventListener("click", (e) => {
    e.preventDefault();
    if (state.step === "loading" || state.step === "match") {
      window.location.href = `destination.html?code=${state.destCode}`;
    } else {
      goBack();
    }
  });

  document.getElementById("footer-primary").addEventListener("click", goNext);
  document.getElementById("footer-secondary").addEventListener("click", goBack);

  document.querySelectorAll(".flow-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      if (target === "docs" && !state.route) return;
      showStep(target);
      if (target === "travelers") renderTravelers();
      if (target === "docs") renderDocs();
      if (target === "checkout") renderCheckout();
    });
  });

  runLoading();
});
