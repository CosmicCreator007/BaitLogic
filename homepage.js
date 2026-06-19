// ------------------------------------------------------
// BAITLOGIC — HOMEPAGE JS
// Clean, stable, production‑ready foundation
// ------------------------------------------------------


// ------------------------------------------------------
// LIVE WEATHER + PRESSURE (Open‑Meteo API)
// ------------------------------------------------------
async function loadConditions() {
    const lat = 38.7392;   // Highland, IL
    const lon = -89.6718;

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,wind_speed_10m,pressure_msl&temperature_unit=fahrenheit`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const temp = data.current.temperature_2m;
        const wind = data.current