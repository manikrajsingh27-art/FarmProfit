const API_BASE = "http://localhost:5000/api";

function getUser() {
  try { return JSON.parse(localStorage.getItem("fp_user") || "null"); } catch { return null; }
}

function getHeaders() {
  const user = getUser();
  return {
    "Content-Type": "application/json",
    "x-user-id": user ? user.id : "",
    "x-user-role": user ? user.role : "",
  };
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initStickyNav();
  loadCrops();
  initQuickActions();
});

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -80px 0px" });

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function initStickyNav() {
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  });
}

async function loadCrops() {
  try {
    const user = getUser();
    const farmerId = user ? user.id : null;
    const url = farmerId ? `${API_BASE}/crops?status=active&farmerId=${farmerId}` : `${API_BASE}/crops?status=active`;
    const res = await fetch(url, {
      headers: getHeaders(),
    });
    const data = await res.json();
    const grid = document.querySelector(".crops-grid");
    if (!grid) return;
    grid.innerHTML = "";
    (data.crops || []).forEach((crop) => {
      const card = document.createElement("div");
      card.className = "crop-card reveal";
      card.innerHTML = `
        <div class="crop-badge">${crop.cropName}</div>
        <div class="crop-name">${crop.variety}</div>
        <div class="crop-meta">
          <span>📦 ${crop.quantity} ${crop.unit}</span>
          <span>• Grade ${crop.qualityGrade}</span>
          <span>• ₹${crop.expectedPrice}/${crop.unit}</span>
        </div>
        <div class="crop-actions">
          <button class="btn btn-ghost btn-sm">Edit</button>
          <button class="btn btn-primary btn-sm" onclick="viewBuyerOptions('${crop.id}')">View Buyers</button>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load crops:", err);
  }
}

function initQuickActions() {
  const cards = document.querySelectorAll(".action-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.querySelector(".action-title").textContent;
      if (title === "Compare Selling Options") {
        window.location.href = "profit-comparison.html";
      } else if (title === "Book Transport") {
        window.location.href = "storage-transport.html";
      } else if (title === "Storage Options") {
        window.location.href = "storage-transport.html";
      } else if (title === "Track Payments") {
        window.location.href = "order-tracking.html";
      } else {
        alert(`Opening: ${title}`);
      }
    });
  });

  const sellBtns = document.querySelectorAll(".crop-card .btn-primary");
  sellBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".crop-card");
      const cropId = card.getAttribute("data-id");
      alert("Opening buyer options for crop...");
    });
  });
}

window.viewBuyerOptions = async (listingId) => {
  try {
    const res = await fetch(`${API_BASE}/crops/${listingId}/matching-buyers`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    localStorage.setItem("fp_matching_buyers", JSON.stringify(data.matchingBuyers || []));
    localStorage.setItem("fp_selected_listing", listingId);
    window.location.href = "buyer-option.html";
  } catch (err) {
    alert("Failed to load matching buyers. Is the backend running?");
  }
};