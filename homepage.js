import { getLakes } from "./api.ts";

document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("lake-list");

  try {
    const lakes = await getLakes();

    list.innerHTML = lakes
      .map(
        lake => `
      <div class="lake-card">
        <h3>${lake.name}</h3>
        <p>${lake.description || ""}</p>
        <button onclick="window.location.href='prediction.html?lake=${lake.id}'">
          View Prediction
        </button>
      </div>
    `
      )
      .join("");
  } catch (err) {
    list.innerHTML = "<p>Error loading lakes.</p>";
  }
});