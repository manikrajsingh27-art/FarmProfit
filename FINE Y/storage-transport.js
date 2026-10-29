const API_BASE = "http://localhost:5000/api";

function getHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initStickyNav();
  initStorageActions();
  initTransportActions();
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

function initStorageActions() {
  const btns = document.querySelectorAll(".storage-card .btn-outline");
  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".storage-card");
      const name = card.querySelector(".storage-name").textContent;
      alert(`Viewing storage details for: ${name}`);
    });
  });
}

function initTransportActions() {
  const btns = document.querySelectorAll(".transport-card .btn-primary");
  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".transport-card");
      const name = card.querySelector(".transport-name").textContent;
      alert(`Booking transport with: ${name}`);
    });
  });
}