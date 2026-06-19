// prediction.js

// Main entry
export function buildPrediction(live) {
  const factors = scoreFactors(live);
  const overallScore = clamp(
    Math.round(
      factors.base +
      factors.pressure +
      factors.wind +
      factors.cloud +
      factors.rain +
      factors.moon
    ),
    0,
    100
  );

  const activityLevel = overallScore >= 70 ? "high"
                      : overallScore >= 45 ? "medium"
                      : "low";

  const recommendedDepth = pickDepth(live, factors);
  const recommendedStructure = pickStructure(live, factors);
  const recommendedBaits = pickBaits(live, factors, activityLevel);
  const biteWindowNote = buildBiteWindowNote(live, factors, activityLevel);

  return {
    lakeId: live.lakeId,
    timestamp: live.timestamp,
    overallScore,
    activityLevel,
    recommendedDepth,
    recommendedStructure,
    recommendedBaits,
    biteWindowNote,
    rawFactors: factors
  };
}

// ---------------- core scoring ----------------

function scoreFactors(live) {
  const { tempF, windMph, pressureMb, cloudPct, rainIn, moonPhase } = live;

  // Base: temp band
  let base = 40;
  if (tempF >= 55 && tempF <= 75) base += 15;      // prime
  else if (tempF >= 45 && tempF < 55) base += 5;   // early/late
  else if (tempF > 75 && tempF <= 85) base += 5;   // warm but ok
  else base -= 10;                                 // tough

  // Pressure: assume falling = better, rising = worse
  // You can later feed a real trend; for now infer from absolute
  let pressure = 0;
  if (pressureMb <= 1008) pressure += 10;          // low / falling
  else if (pressureMb <= 1015) pressure += 5;      // normal
  else pressure -= 10;                             // high / post-front

  // Wind: light–moderate is good, dead calm or howling is bad
  let wind = 0;
  if (windMph >= 3 && windMph <= 12) wind += 10;
  else if (windMph > 12 && windMph <= 18) wind += 3;
  else wind -= 5;

  // Cloud: overcast/partly is better than bluebird
  let cloud = 0;
  if (cloudPct >= 40 && cloudPct <= 90) cloud += 8;
  else if (cloudPct < 20) cloud -= 5;

  // Rain: light recent rain can help, heavy can hurt
  let rain = 0;
  if (rainIn > 0 && rainIn <= 0.3) rain += 5;
  else if (rainIn > 0.3) rain -= 5;

  // Moon: simple bump for “good” phases
  let moon = 0;
  const phase = (moonPhase || "").toLowerCase();
  if (phase.includes("full") || phase.includes("new")) moon += 5;
  else if (phase.includes("waxing") || phase.includes("waning")) moon += 2;

  return { base, pressure, wind, cloud, rain, moon };
}

// ---------------- recommendations ----------------

function pickDepth(live, factors) {
  const { tempF, cloudPct, pressureMb } = live;

  // Start with temp
  let depth = "mid-depth (6–12 ft)";

  if (tempF < 50) depth = "deeper (12–20 ft)";
  else if (tempF >= 65 && tempF <= 80) depth = "shallow to mid (3–10 ft)";
  else if (tempF > 80) depth = "deeper edges (10–18 ft)";

  // Adjust for pressure + cloud
  if (pressureMb > 1015 && cloudPct < 30) {
    depth = "deeper, tighter to cover (12–20 ft)";
  }

  return depth;
}

function pickStructure(live, factors) {
  const { windMph, windDir, cloudPct } = live;

  let structure = "points and breaks near main lake";

  if (windMph >= 5) {
    structure = `wind-blown banks and points (${windDir} side)`;
  }

  if (cloudPct > 60) {
    structure += " + shallow cover (wood, grass, docks)";
  } else if (cloudPct < 25) {
    structure += " + shade lines and deeper cover";
  }

  return structure;
}

function pickBaits(live, factors, activityLevel) {
  const { tempF, cloudPct, windMph } = live;
  const baits = [];

  // Activity baseline
  if (activityLevel === "high") {
    baits.push("moving baits (spinnerbait, chatterbait, crankbait)");
  } else if (activityLevel === "medium") {
    baits.push("finesse plastics (Texas rig, shaky head, ned rig)");
  } else {
    baits.push("slow bottom baits (jig, Carolina rig, dropshot)");
  }

  // Temp tweaks
  if (tempF < 50) {
    baits.push("smaller profile, natural colors, slow retrieve");
  } else if (tempF >= 65 && tempF <= 80) {
    baits.push("reaction baits around cover and points");
  }

  // Cloud/wind tweaks
  if (cloudPct > 60 && windMph >= 5) {
    baits.push("louder/brighter moving baits in stained water");
  } else if (cloudPct < 25) {
    baits.push("natural colors, precise casts to cover");
  }

  return dedupe(baits);
}

function buildBiteWindowNote(live, factors, activityLevel) {
  const { sunrise, sunset } = live;

  let note = "Best windows likely around low light periods";

  if (activityLevel === "high") {
    note = "Fish should be active most of the day, with strongest windows at low light.";
  } else if (activityLevel === "low") {
    note = "Expect tougher bite; focus tightly on prime low light windows and key structure.";
  }

  if (sunrise && sunset) {
    note += ` Target sunrise (${sunrise}) and sunset (${sunset}) for your longest bite windows.`;
  }

  return note;
}

// ---------------- utils ----------------

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function dedupe(arr) {
  return [...new Set(arr)];
}