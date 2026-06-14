/**
 * main.js — Josiah's Maker Cave
 * Navigation, dynamic year, and UI utilities.
 */
"use strict";

// ─── DYNAMIC COPYRIGHT YEAR ───────────────────────────────────
document.getElementById("copy-year").textContent = new Date().getFullYear();

// ─── SECTION NAVIGATION ───────────────────────────────────────
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));

  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
    // Scroll content frame to top when switching sections
    const frame = document.querySelector(".content-frame");
    if (frame) frame.scrollTop = 0;
  }

  // Highlight active nav button (matched by data-target)
  document.querySelectorAll(".nav-btn").forEach(btn => {
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

  // Any element with data-target navigates (nav buttons + hero CTA)
  document.querySelectorAll("[data-target]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const id = btn.dataset.target;
      history.pushState(null, "", `#${id}`);
      showSection(id);
    });
  });
});

