// ------------------------------------------------------
// BAITLOGIC — HOMEPAGE JS (Full Build)
// ------------------------------------------------------


// ------------------------------------------------------
// LAKE DATABASE
// ------------------------------------------------------
const lakes = {
    carlyle: {
        name: "Carlyle Lake",
        lat: 38.6420,
        lon: -89.3748,
        usgs: "05593000" // gauge height
    },
    silver: {
        name: "Silver Lake (Highland)",
        lat: 38.7392,
        lon: -89.6718,
        usgs: null
    },
    pocahontas: {
        name: "Pocahontas Ponds",
        lat: 38.8250,
        lon: -89.5350,
        usgs: null
    },
    greenville: {
        name: "Greenville Patriots Park",
        lat: 38.8920,
        lon: -89.4130,
        usgs: null
    }
};


// ------------------------------------------------------
// SPECIES BEHAVIOR LOGIC
// ------------------------------------------------------

// Behavior rules based on pressure (inHg)
function getPressureBehavior(pressure) {
    if (pressure < 29.6) return "Feeding active — low pressure bite window";
    if (pressure < 30.0) return "Stable bite — normal feeding patterns";
    if (pressure < 30.3) return "Slowing — fish holding tighter to cover";
    return "Tough bite — high pressure lockjaw";
}

// Behavior rules based on wind (mph)
function getWindBehavior(wind) {
    if (wind < 3) return "Calm water — finesse presentations best";
    if (wind < 10) return "Ideal wind — active feeding zones expand";
    if (wind < 18) return "Wind-driven bite — target wind-blown banks";
    return "High wind — fish pushed deep or tight to structure";
}

// Species-specific logic
function getSpeciesLogic(pressure, wind) {
    return {
        bass: {
            bite: pressure < 29.9 ? "High" : pressure < 30.2 ? "Medium" : "Low",
            behavior: `${getPressureBehavior(pressure)}. ${getWindBehavior(wind)}.`
        },
        crappie: {
            bite: pressure < 29.8 ? "High" : pressure < 30.1 ? "Medium" : "Low",
            behavior: pressure < 30
                ? "Suspended schools more active"
                : "Holding tight to brush and timber"
        },
        catfish: {
            bite: wind > 12 ? "High" : "Medium",
            behavior: wind > 12
                ? "Wind-stirred water increases feeding"
                : "Consistent bite on bottom structure"
        },
        bluegill: {
            bite: pressure < 30 ? "High" : "Medium",
            behavior: pressure < 30
                ? "Shallow flats active"
                : "Holding near weed edges"
        }
    };
}

// Render species logic into the UI
function updateSpeciesLogic(pressure, wind) {
    const species = getSpeciesLogic(pressure, wind);

    const container = document.querySelector(".species-grid");
    if (!container) return;

    container.innerHTML = `
        <div class="species-card">
            <strong>Bass</strong><br>
            Bite