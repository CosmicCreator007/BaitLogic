// api.ts
// Unified API helper for BaitLogic (HTML/JS version)

const API_BASE = window.location.origin;

// ------------------------------
// Fetch Lakes
// ------------------------------
export async function getLakes() {
  const res = await fetch(`${API_BASE}/lakes.json`);
  if (!res.ok) throw new Error("Failed to load lakes");
  return res.json();
}

// ------------------------------
// Fetch Single Lake by ID
// ------------------------------
export async function getLake(id: string) {
  const lakes = await getLakes();
  return lakes.find((lake: any) => lake.id === id) || null;
}

// ------------------------------
// Weather + Pressure
// ------------------------------
const WEATHER_KEY = "YOUR_OPENWEATHERMAP_KEY";

export async function getWeather(lat: number, lon: number) {
  const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=imperial`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather API failed");
  return res.json();
}

export async function getPressure(lat: number, lon: number) {
  const weather = await getWeather(lat, lon);
  return weather.main?.pressure || null;
}

// ------------------------------
// Prediction Engine
// ------------------------------
export async function getPrediction(lakeId: string) {
  const lake = await getLake(lakeId);
  if (!lake) {
    return {
      lake: "Unknown",
      pressure: null,
      score: 0,
      message: "Lake not found",
    };
  }

  const pressure = await getPressure(lake.lat, lake.lon);

  // Simple scoring model
  let score = 50;

  if (pressure < 1000) score += 10;
  if (pressure > 1020) score -= 10;

  return {
    lake: lake.name,
    pressure,
    score,
    message:
      score >= 60
        ? "Great bite window"
        : score >= 45
        ? "Fair conditions"
        : "Slow bite expected",
  };
}

// ------------------------------
// Reports (optional future)
// ------------------------------
export async function getReports() {
  const res = await fetch(`${API_BASE}/reports.json`);
  if (!res.ok) return [];
  return res.json();
}