const API_URL =
  "https://car-price-prediction-api-beamazh0asfkajb3.canadacentral-01.azurewebsites.net/predict/";

const idle = document.getElementById("idle-state");
const loading = document.getElementById("loading-state");
const result = document.getElementById("result-state");
const error = document.getElementById("error-state");

function setState(state) {
  idle.classList.remove("hidden");
  loading.classList.remove("visible");
  result.classList.remove("visible");
  error.classList.remove("visible");

  if (state === "idle") idle.classList.add("hidden") || true;
  if (state === "loading") {
    idle.classList.add("hidden");
    loading.classList.add("visible");
  }
  if (state === "result") {
    idle.classList.add("hidden");
    result.classList.add("visible");
  }
  if (state === "error") {
    idle.classList.add("hidden");
    error.classList.add("visible");
  }
}

setState("idle");
idle.classList.remove("hidden");

document
  .getElementById("estimator-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = document.getElementById("submit-btn");
    btn.disabled = true;
    setState("loading");

    const data = Object.fromEntries(new FormData(e.target));

    data.power = parseInt(data.power);
    data.mileage = parseInt(data.mileage);
    data.age_at_listing = parseInt(data.age_at_listing);
    data.registration_month = parseInt(data.registration_month);
    data.month_created = parseInt(data.month_created);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const json = await response.json();
      const price = json.prediction ?? json.price ?? json.result;

      if (price == null) throw new Error("Unexpected response format");

      showResult(price, data);
    } catch (err) {
      document.getElementById("error-message").textContent =
        err.message.includes("Failed to fetch")
          ? "Could not reach the API.\nCheck your connection or endpoint."
          : err.message;
      setState("error");
    } finally {
      btn.disabled = false;
    }
  });

function showResult(price, data) {
  setState("result");

  const priceEl = document.getElementById("price-display");
  const subEl = document.getElementById("price-range");
  const detEl = document.getElementById("result-details");

  priceEl.classList.remove("show");
  let start = 0;
  const target = Math.round(price);
  const duration = 900;
  const step = target / (duration / 16);
  const interval = setInterval(() => {
    start = Math.min(start + step, target);
    priceEl.textContent = "€ " + Math.round(start).toLocaleString("de-DE");
    if (start >= target) clearInterval(interval);
  }, 16);

  setTimeout(() => priceEl.classList.add("show"), 50);

  const low = Math.round(price * 0.92).toLocaleString("de-DE");
  const high = Math.round(price * 1.08).toLocaleString("de-DE");
  subEl.textContent = `Confidence range: €${low} – €${high}`;

  detEl.innerHTML = `
      <div class="detail-row">
        <span class="detail-key">Brand / Model</span>
        <span class="detail-val">${data.brand} ${data.model}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Power</span>
        <span class="detail-val">${data.power} HP</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Mileage</span>
        <span class="detail-val">${parseInt(data.mileage).toLocaleString("de-DE")} km</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Age at listing</span>
        <span class="detail-val">${data.age_at_listing} yr${data.age_at_listing !== 1 ? "s" : ""}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Fuel</span>
        <span class="detail-val">${data.fuel_type}</span>
      </div>
    `;
}

function resetForm() {
  setState("idle");
  idle.classList.remove("hidden");
}
