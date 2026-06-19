// api.ts
const API_BASE = window.location.origin;

// Lakes
export async function getLakes() {
  const res = await fetch(`${API_BASE}/lakes.json`);
  if (!res.ok) throw new Error("Failed to load lakes");
  return res.json();
}

export async function getLake(id) {
  const lakes = await getLakes();
  return lakes.find(l => l.id === id) || null;
}

// Weather + Pressure
const WEATHER_KEY = "YOUR_OPENWEATHERMAP_KEY";

export async function getWeather(lat, lon) {
  const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=imper