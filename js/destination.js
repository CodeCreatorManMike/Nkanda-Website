const STORAGE_KEY = "nkanda_profile";

function loadProfile() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; }
}
function saveProfile(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function fillSelect(selectEl, selectedCode, onChange) {
  selectEl.innerHTML = "";
  DESTINATIONS.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d.code;
    opt.textContent = d.name;
    if (d.code === selectedCode) opt.selected = true;
    selectEl.appendChild(opt);
  });
  selectEl.addEventListener("change", () => onChange(selectEl.value));
}

function setFlagLabel(flagId, labelId, code) {
  const dest = destinationByCode(code);
  document.getElementById(flagId).innerHTML = `<img src="${flagUrl(code)}" alt="">`;
  document.getElementById(labelId).textContent = dest ? dest.name : code.toUpperCase();
}

function render() {
  const profile = loadProfile();
  let destCode = getParam("code") || "eg";
  if (!destinationByCode(destCode)) destCode = "eg";
  let passportCode = profile.citizenship || "gb";

  document.title = `Apply for your ${destinationByCode(destCode).name} visa online — Nkanda`;
  document.getElementById("bc-country").textContent = destinationByCode(destCode).name;
  document.getElementById("title-country").textContent = destinationByCode(destCode).name;

  setFlagLabel("passport-flag", "passport-label", passportCode);
  setFlagLabel("dest-flag", "dest-label", destCode);

  fillSelect(document.getElementById("passport-select"), passportCode, (val) => {
    profile.citizenship = val;
    saveProfile(profile);
    setFlagLabel("passport-flag", "passport-label", val);
    updateRoute(destCode, val);
  });

  fillSelect(document.getElementById("dest-select"), destCode, (val) => {
    window.location.href = `destination.html?code=${val}`;
  });

  updateRoute(destCode, passportCode);

  document.getElementById("apply-btn").addEventListener("click", () => {
    window.location.href = `apply.html?code=${destCode}`;
  });
}

function updateRoute(destCode, passportCode) {
  const profile = loadProfile();
  const route = matchRoute(destCode, "tourism", profile);
  const dest = route.destination;

  document.getElementById("route-meta").innerHTML = `
    <span><b>Single entry</b></span>
    <span>· ${dest.validity} stay</span>
    <span>· Guaranteed in ${dest.guaranteedDays} days</span>
  `;
  document.getElementById("stat-approval").textContent = `${route.acceptanceChance}%`;

  document.getElementById("req-heading").textContent = `The essential documents for ${dest.name}`;
  document.getElementById("req-sub").textContent = route.justification;
  document.getElementById("req-docs").innerHTML = route.documents.map((doc, i) => `
    <div class="step-card">
      <div class="num">${i + 1}</div>
      <h4>${doc.title}</h4>
      <p>${doc.desc}</p>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", render);
