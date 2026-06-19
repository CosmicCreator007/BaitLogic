// -----------------------------
// LIVE CONDITIONS (placeholder)
// -----------------------------
function loadConditions() {
    document.getElementById("temp").innerText = "Temperature: --°";
    document.getElementById("pressure").innerText = "Pressure: -- inHg";
    document.getElementById("wind").innerText = "Wind: -- mph";
    document.getElementById("water").innerText = "Water: --";
}

loadConditions();


// -----------------------------
// SIGNUP FORM
// -----------------------------
const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = signupForm.querySelector("input[type='email']").value;

    if (!email) return;

    alert("Thanks for joining BaitLogic! You're on the early access list.");

    signupForm.reset();
});


// -----------------------------
// REPORTS (placeholder)
// -----------------------------
function loadReports() {
    const container = document.querySelector(".reports-list");

    container.innerHTML = `
        <p>No reports yet. Be the first to submit one.</p>
    `;
}

loadReports();