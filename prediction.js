import { getPrediction } from "./api.ts";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const lakeId = params.get("lake");

  const output = document.getElementById("prediction-output");

  if (!lakeId) {
    output.innerHTML = "<p>No lake selected.</p>";
    return;
  }

  try {
    const result = await getPrediction(lakeId);

    output.innerHTML = `
      <h2>${result.lake}</h2>
      <p><strong>Pressure:</strong> ${result.pressure} hPa</p>
      <p><strong>Score:</strong> ${result.score}</p>
      <p><strong>Conditions:</strong> ${result.message}</p>
    `;
  } catch (err) {
    output.innerHTML = "<p>Error loading prediction.</p>";
  }
});