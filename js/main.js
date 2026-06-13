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
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
    // Scroll content frame to top when switching sections
    document.querySelector(".content-frame").scrollTop = 0;
  }

  // Highlight active nav button
  document.querySelectorAll(".nav-btn").forEach(btn => {
    if (btn.getAttribute("onclick")?.includes(`'${id}'`)) {
      btn.classList.add("active");
    }
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

  // Override nav links to use showSection (prevents full reload)
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const match = btn.getAttribute("onclick")?.match(/'(\w+)'/);
      if (match) {
        e.preventDefault();
        history.pushState(null, "", `#${match[1]}`);
        showSection(match[1]);
      }
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

