import express from "express";
import fetch from "node-fetch";
import lakes from "./lakes.json" assert { type: "json" };

const app = express();
const KEY = process.env.WEATHER_API_KEY;

// Get lake by ID
function getLake(id) {
  return lakes[id];
}

// Live lake endpoint
app.get("/lake/:id/live", async (req, res) => {
  const lake = getLake(req.params.id);

  if (!lake) {
    return res.status(404).json({ error: "Lake not found" });
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${lake.lat},${lake.lon}&days=1`;

  try {
    const r = await fetch