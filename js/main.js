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
    if (id === "editor") loadEditor();
    // Scroll content frame to top when switching sections
    const frame = document.querySelector(".content-frame");
    if (frame) frame.scrollTop = 0;
  }

  // Highlight active nav button (matched by data-target)
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.target === id);
  });
}

// ─── SDF EDITOR EMBED ─────────────────────────────────────────
// The editor solves a distance field every frame, so its iframe stays
// empty until the section is opened for the first time.
function loadEditor() {
  const frame = document.querySelector(".editor-frame");
  if (frame && !frame.src && frame.dataset.src) frame.src = frame.dataset.src;
}

function selectEditor(src) {
  const frame = document.querySelector(".editor-frame");
  const launch = document.querySelector(".editor-launch");
  if (!frame) return;

  // Swap it live if the editor is already up; otherwise just arm loadEditor().
  frame.dataset.src = src;
  if (frame.src) frame.src = src;
  if (launch) launch.href = src;
}

// ─── HANDLE HASH ROUTING ──────────────────────────────────────
function routeFromHash() {
  const hash = window.location.hash.replace("#", "") || "home";
  const valid = ["home", "gallery", "about", "editor"];
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

  // Editor source switcher
  document.querySelectorAll(".editor-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".editor-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      selectEditor(tab.dataset.editor);
    });
  });
});

