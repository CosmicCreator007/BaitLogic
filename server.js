import express from "express";
import fetch from "node-fetch";
import lakes from "./lakes.json" assert { type: "json" };
import { buildPrediction } from "./prediction.js";

const app = express();
const KEY = process.env.WEATHER_API_KEY;

// Get lake by ID
function getLake(id) {
  return lakes[id];
}

// Fetch live data (shared by both endpoints)
async function fetchLiveData(lakeId) {
  const lake = getLake(lakeId);
  if (!lake) return null;

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${lake.lat},${lake.lon}&days=1`;

  const r = await fetch(url);
  const data = await r.json();

  const c = data.current;
  const astro = data.forecast.forecastday[0].astro;

  return {
    lakeId,
    timestamp: new Date().toISOString(),
    tempF: c.temp_f,
    windMph: c.wind_mph,
    windDir: c.wind_dir,
    pressureMb: c.pressure_mb,
    cloudPct: c.cloud,
    rainIn: c.precip_in,
    sunrise: astro.sunrise,
    sunset: astro.sunset,
    moonPhase: astro.moon_phase
  };
}

// -------------------------
// LIVE DATA ENDPOINT
// -------------------------
app.get("/lake/:id/live", async (req, res) => {
  try {
    const live = await fetchLiveData(req.params.id);
    if (!live) return res.status(404).json({ error: "Lake not found" });
    res.json(live);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lake data" });
  }
});

// -------------------------
// PREDICTION ENDPOINT
// -------------------------
app.get("/lake/:id/prediction", async (req, res) => {
  try {
    const live = await fetchLiveData(req.params.id);
    if (!live) return res.status(404).json({ error: "Lake not found" });

    const prediction = buildPrediction(live);

    res.json({
      live,
      prediction
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate prediction" });
  }
});

// -------------------------
// START SERVER
// -------------------------
app.listen(3000, () => {
  console.log("BaitLogic Engine running on port 3000");
});