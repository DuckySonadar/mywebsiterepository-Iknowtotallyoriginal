/**
 * main.js — Josiah's Maker Cave
 * Navigation, dynamic year, and UI utilities.
 */
"use strict";

// ─── DYNAMIC COPYRIGHT YEAR & STARDATE ───────────────────────
document.getElementById("copy-year").textContent = new Date().getFullYear();

(function updateStardate() {
  const el = document.getElementById("stardate-display");
  if (!el) return;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  const fraction = String(Math.floor((dayOfYear / 365) * 10)).padStart(1, "0");
  el.textContent = `STARDATE ${now.getFullYear()}.${fraction}`;
})();

// ─── SECTION NAVIGATION ───────────────────────────────────────
// The left rail buttons connect to the active content frame; the
// active rail button is highlighted with its connecting tab.
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));

  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
    // Scroll content frame to top when switching sections
    const frame = document.querySelector(".content-frame");
    if (frame) frame.scrollTop = 0;
  }

  // Highlight active rail button (matched by data-target)
  document.querySelectorAll(".rail-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.target === id);
  });
}

// ─── HANDLE HASH ROUTING ──────────────────────────────────────
function routeFromHash() {
  const hash = window.location.hash.replace("#", "") || "home";
  const valid = ["home", "gallery", "about"];
  showSection(valid.includes(hash) ? hash : "home");
}

window.addEventListener("hashchange", routeFromHash);
document.addEventListener("DOMContentLoaded", () => {
  routeFromHash();

  // Any element with data-target navigates (rail buttons + hero CTA)
  document.querySelectorAll("[data-target]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const id = btn.dataset.target;
      history.pushState(null, "", `#${id}`);
      showSection(id);
    });
  });
});

// ─── STARFIELD AMBIENT (subtle background on home) ────────────
(function initStarfield() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:1;opacity:0.25;";
  hero.insertBefore(canvas, hero.firstChild);

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    drawStars();
  }

  function drawStars() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const count = Math.floor((canvas.width * canvas.height) / 6000);
    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 1.2;
      const alpha = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,204,153,${alpha})`;
      ctx.fill();
    }
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  resize();
})();

