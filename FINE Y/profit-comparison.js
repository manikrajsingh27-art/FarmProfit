const API_BASE = "http://localhost:5000/api";

function getHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initStickyNav();
  initOptionSelection();
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

function initOptionSelection() {
  const btns = document.querySelectorAll(".option-card .btn-primary");
  btns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const card = btn.closest(".option-card");
      const name = card.querySelector(".option-name").textContent;

      const quantity = parseFloat(card.querySelector(".meta-value")?.textContent?.replace(/[₹,]/g, "") || "100");
      const offeredPrice = parseFloat(prompt("Enter offered price per quintal:", "2350") || "2350");
      if (!offeredPrice) return;

      try {
        const res = await fetch(`${API_BASE}/calculate-options`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            quantity: quantity,
            offeredPrice: offeredPrice,
            transportCost: 5000,
            storageCost: 0,
            commission: offeredPrice * quantity * 0.03,
            packagingCost: 3000,
            expectedSpoilageLoss: 1000,
          }),
        });
        const data = await res.json();
        if (data.success) {
          alert(
            `Option: ${name}\n` +
            `Sale Value: ₹${data.saleValue.toLocaleString()}\n` +
            `Total Cost: ₹${data.totalCost.toLocaleString()}\n` +
            `Net Income: ₹${data.netIncome.toLocaleString()}\n` +
            `Risk Level: ${data.riskLevel}\n` +
            `Payment Time: ${data.paymentTime}\n` +
            `Reason: ${data.recommendationReason}`
          );
        } else {
          alert("Calculation failed: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        alert("Cannot connect to backend. Make sure server is running on port 5000.");
      }
    });
  });
}