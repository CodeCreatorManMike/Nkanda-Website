// Detects the visitor's country from the browser — geolocation first (with
// permission), falling back to an IP-based lookup if denied or unavailable.
// Both services are free, keyless, client-side APIs; failures are silent —
// the caller just gets no suggestion and the country pickers default to manual.

async function detectCountry() {
  try {
    const viaGeolocation = await detectViaGeolocation();
    if (viaGeolocation) return viaGeolocation;
  } catch (e) { /* fall through to IP lookup */ }

  try {
    return await detectViaIP();
  } catch (e) {
    return null;
  }
}

function detectViaGeolocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    const timeout = setTimeout(() => resolve(null), 6000);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        clearTimeout(timeout);
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          if (data && data.countryCode) {
            resolve({ code: data.countryCode.toLowerCase(), name: data.countryName, source: "gps" });
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      },
      () => { clearTimeout(timeout); resolve(null); },
      { timeout: 5000, maximumAge: 600000 }
    );
  });
}

async function detectViaIP() {
  const res = await fetch("https://ipapi.co/json/");
  const data = await res.json();
  if (data && data.country_code) {
    return { code: data.country_code.toLowerCase(), name: data.country_name, source: "ip" };
  }
  return null;
}
