// ------------------------------------------------------
// LIVE WEATHER + PRESSURE + USGS WATER LEVELS
// ------------------------------------------------------
async function loadConditions() {
    const lat = 38.7392;   // Highland, IL
    const lon = -89.6718;

    // WEATHER API (Open-Meteo)
    const weatherURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,wind_speed_10m,pressure_msl&temperature_unit=fahrenheit`;

    // USGS API — Carlyle Lake Gauge (ID: 05593000)
    const usgsURL =
        "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=05593000&parameterCd=00065";

    try {
        // WEATHER FETCH
        const weatherRes = await fetch(weatherURL);
        const weatherData = await weatherRes.json();

        const temp = weatherData.current.temperature_2m;
        const wind = weatherData.current.wind_speed_10m;
        const pressure = (weatherData.current.pressure_msl * 0.02953).toFixed(2); // hPa → inHg

        // USGS FETCH
        const usgsRes = await fetch(usgsURL);
        const usgsData = await usgsRes.json();

        const gauge =
            usgsData.value.timeSeries[0].values[0].value[0].value;

        // UPDATE UI
        document.getElementById("temp").innerText = `Temperature: ${temp}°F`;
        document.getElementById("pressure").innerText = `Pressure: ${pressure} inHg`;
        document.getElementById("wind").innerText = `Wind: ${wind} mph`;
        document.getElementById("water").innerText = `Water Level: ${gauge} ft`;

    } catch (err) {
        console.error("API error:", err);

        document.getElementById("temp").innerText = "Temperature: --";
        document.getElementById("pressure").innerText = "Pressure: --";
        document.getElementById("wind").innerText = "Wind: --";
        document.getElementById("water").innerText = "Water Level: --";
    }
}

loadConditions();