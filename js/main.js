// Landing page: hero photo collage, geolocation-based citizenship suggestion,
// destination grid ranked by viability, search filter.

const STORAGE_KEY = "nkanda_profile";

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function buildHeroGrid() {
  const grid = document.getElementById("hero-photo-grid");
  if (!grid) return;
  const codes = PHOTO_CODES.slice(0, 18);
  codes.forEach((code) => {
    const div = document.createElement("div");
    div.style.backgroundImage = `url(${photoUrl(code)})`;
    grid.appendChild(div);
  });
}

function populateCitizenshipSelect(selected) {
  const select = document.getElementById("citizenship-select");
  if (!select) return;
  select.innerHTML = "";
  DESTINATIONS.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d.code;
    opt.textContent = d.name;
    if (d.code === selected) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener("change", () => {
    const profile = loadProfile();
    profile.citizenship = select.value;
    saveProfile(profile);
    updateCitizenshipDisplay(select.value);
    renderDestinations();
  });
}

function updateCitizenshipDisplay(code) {
  const dest = destinationByCode(code);
  const flagEl = document.getElementById("citizenship-flag");
  const labelEl = document.getElementById("citizenship-label");
  if (flagEl) flagEl.innerHTML = `<img src="${flagUrl(code)}" alt="">`;
  if (labelEl) labelEl.textContent = dest ? dest.name : code.toUpperCase();
}

function cardHtml(dest, badgeText) {
  const photo = photoUrl(dest.code);
  const bg = photo ? `<img class="bg" src="${photo}" alt="${dest.name}">` : `<div class="bg" style="background:linear-gradient(160deg,#2c3a52,#0f1a2e);"></div>`;
  return `
    <div class="dest-card" data-code="${dest.code}">
      ${bg}
      <div class="grad"></div>
      <div class="flag"><img src="${flagUrl(dest.code)}" alt=""></div>
      <div class="badge">${badgeText}</div>
      <div class="meta">
        <div class="name">${dest.name.toUpperCase()}</div>
        <div class="sub">${dest.type} · Valid ${dest.validity}</div>
      </div>
    </div>`;
}

function renderDestinations() {
  const profile = loadProfile();
  const query = (document.getElementById("search").value || "").toLowerCase();
  const ranked = rankedDestinations(profile).filter((d) => d.name.toLowerCase().includes(query));

  const best = ranked.slice(0, 8);
  const rest = ranked.slice(8);

  document.getElementById("grid-best").innerHTML = best.map((d) => cardHtml(d, `${d.guaranteedDays}d decision`)).join("");
  document.getElementById("grid-rest").innerHTML = rest.map((d) => cardHtml(d, `${d.guaranteedDays}d decision`)).join("");

  document.querySelectorAll(".dest-card").forEach((card) => {
    card.addEventListener("click", () => {
      window.location.href = `destination.html?code=${card.dataset.code}`;
    });
  });
}

async function initGeo() {
  const profile = loadProfile();
  if (profile.citizenship) {
    updateCitizenshipDisplay(profile.citizenship);
    populateCitizenshipSelect(profile.citizenship);
    document.getElementById("geo-status").textContent = `Citizenship set to ${destinationByCode(profile.citizenship)?.name || profile.citizenship.toUpperCase()}`;
    return;
  }

  populateCitizenshipSelect(null);
  const geo = await detectCountry();
  if (geo && destinationByCode(geo.code)) {
    profile.citizenship = geo.code;
    saveProfile(profile);
    updateCitizenshipDisplay(geo.code);
    populateCitizenshipSelect(geo.code);
    document.getElementById("geo-status").innerHTML = `Detected you're in <strong>${geo.name}</strong> — set as your citizenship. Change it anytime.`;
    renderDestinations();
  } else {
    profile.citizenship = "gb";
    saveProfile(profile);
    updateCitizenshipDisplay("gb");
    populateCitizenshipSelect("gb");
    document.getElementById("geo-status").textContent = "Couldn't detect your location — defaulted to United Kingdom.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  buildHeroGrid();
  renderDestinations();
  document.getElementById("search").addEventListener("input", renderDestinations);
  initGeo();
});
