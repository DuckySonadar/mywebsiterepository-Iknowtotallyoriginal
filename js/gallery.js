/**
 * gallery.js — Josiah's Maker Cave
 *
 * INVENTORY NAMING CONVENTION
 * ─────────────────────────────────────────────────────────────
 * Files must be placed in the /inventory/ folder.
 * Filename format:  AAA-0000 Description of item.ext
 *
 * Category Codes:
 *   DGN — Dragons
 *   OCN — Ocean Creatures
 *   DSR — Dinosaurs / Prehistoric
 *   MYH — Mythical Creatures
 *   PZL — Puzzles
 *   FGT — Fidgets
 *   GTL — Gadgets & Tools
 *   MBR — Multi-Body / Robots / Mechs
 *   SCI — Science / Space / Tech
 *   EDU — Educational
 *   ART — Artistic / Decorative
 *
 * Example: "DGN-0001 Crystal Dragon Blue.png"
 *   → SKU: DGN-0001
 *   → Description: Crystal Dragon Blue
 *   → Category: Dragons
 *
 * USAGE
 * ─────────────────────────────────────────────────────────────
 * 1. Drop image files into the /inventory/ folder.
 * 2. Name them per the format above.
 * 3. Open index.html — the gallery builds automatically.
 *
 * If running locally via file:// (no server), see the
 * MANUAL INVENTORY section below to list files explicitly.
 * When hosted on GitHub Pages, the fetch-based auto-detection
 * works if the repo contains an inventory-manifest.json
 * (see README for how to generate it).
 * ─────────────────────────────────────────────────────────────
 */

"use strict";

// ─── CATEGORY REGISTRY ────────────────────────────────────────
const CATEGORIES = {
  DGN: { name: "Dragons",                     color: "#ff9900", icon: "🐉" },
  OCN: { name: "Ocean Creatures",              color: "#aaccff", icon: "🐙" },
  DSR: { name: "Dinosaurs & Prehistoric",      color: "#99dd66", icon: "🦕" },
  MYH: { name: "Mythical Creatures",           color: "#cc88ff", icon: "🦄" },
  PZL: { name: "Puzzles",                      color: "#ffcc00", icon: "🧩" },
  FGT: { name: "Fidgets",                      color: "#ff7755", icon: "🌀" },
  GTL: { name: "Gadgets & Tools",               color: "#66ffcc", icon: "🔧" },
  MBR: { name: "Robots & Mechs",               color: "#66ccff", icon: "🤖" },
  SCI: { name: "Science, Space & Tech",        color: "#55eecc", icon: "🚀" },
  EDU: { name: "Educational",                  color: "#aaffaa", icon: "📐" },
  ART: { name: "Art & Decorative",             color: "#ffcc99", icon: "🎨" },
  ABL: { name: "Adorable",                     color: "#ffaacc", icon: "🐣" },
};

// ─── MANUAL INVENTORY ─────────────────────────────────────────
// When no server is available (local file:// access), list your
// inventory files here. The gallery will use these exclusively.
// Format: just the filename, path is always "inventory/".
//
// To use auto-detection via GitHub Pages, leave this array empty
// and ensure inventory-manifest.json exists (see README).
//
const MANUAL_INVENTORY = [
  // "DGN-0001 Crystal Dragon.jpg",
  // "DGN-0002 Flexi Dragon Hatchling.jpg",
  // "FGT-0001 Infinity Cube.jpg",
  // "MYH-0001 Articulating Phoenix.jpg",
];

// ─── CAMELCASE → DISPLAY TEXT ─────────────────────────────────
function camelToDisplay(str) {
  return str.replace(/([A-Z])/g, " $1").trim();
}

// ─── PARSE MANIFEST ENTRY ─────────────────────────────────────
// Accepts either the new structured object format:
//   { category, number, description, file }
// or a legacy plain filename string:
//   "AAA-0000-CamelCaseDescription.jpg"
function parseEntry(entry) {
  if (typeof entry === "object" && entry !== null) {
    const { category: code, number: num, description, designer, file } = entry;
    if (!code || !num || !file) return null;
    if (!CATEGORIES[code]) return null;
    return {
      sku: `${code}-${num}`,
      code,
      num,
      description: camelToDisplay(description) || "(no description)",
      designer: designer || null,
      src: `inventory/${file}`,
    };
  }

  // Legacy: plain filename string (AAA-0000-Description-Designer.ext)
  const base = entry.split("/").pop();
  const noExt = base.replace(/\.[^.]+$/, "");
  const match = noExt.match(/^([A-Z]{2,3})-(\d{4})-([^-]+)(?:-(.+))?$/);
  if (!match) return null;
  const [, code, num, rawDesc, rawDesigner] = match;
  if (!CATEGORIES[code]) return null;
  return {
    sku: `${code}-${num}`,
    code,
    num,
    description: camelToDisplay(rawDesc) || "(no description)",
    designer: rawDesigner || null, // designer names are NOT camelToDisplay'd
    src: `inventory/${base}`,
  };
}

// ─── BUILD GALLERY DOM ────────────────────────────────────────
function buildGallery(files) {
  const container = document.getElementById("gallery-container");
  container.innerHTML = "";

  // Group by category code, preserving CATEGORIES order
  const grouped = {};
  for (const code of Object.keys(CATEGORIES)) grouped[code] = [];

  let parsed = 0;
  for (const f of files) {
    const item = parseEntry(f);
    if (item) {
      grouped[item.code].push(item);
      parsed++;
    }
  }

  // Sort each category by SKU number
  for (const code in grouped) {
    grouped[code].sort((a, b) => parseInt(a.num) - parseInt(b.num));
  }

  if (parsed === 0) {
    container.innerHTML = `
      <div style="padding:60px 0; text-align:center;">
        <p class="loading-msg" style="animation:none; opacity:.7;">
          [ NO INVENTORY FILES DETECTED ]<br><br>
          <span style="font-size:.75rem; letter-spacing:.08em; color:#554433;">
            Drop image files named AAA-0000 Description.jpg into the /inventory/ folder.<br>
            See js/gallery.js for the full naming guide.
          </span>
        </p>
      </div>`;
    return;
  }

  for (const code of Object.keys(CATEGORIES)) {
    const items = grouped[code];
    const cat = CATEGORIES[code];

    const section = document.createElement("div");
    section.className = "category-section";
    section.dataset.code = code;

    // If no items in this category, skip (or show empty heading)
    if (items.length === 0) continue;

    section.innerHTML = `
      <div class="category-header">
        <div class="category-pill" style="background:${cat.color};">${code}</div>
        <span class="category-name">${cat.icon}&nbsp;&nbsp;${cat.name}</span>
        <div class="category-line" style="background:linear-gradient(to right, ${cat.color}, transparent);"></div>
      </div>
      <div class="items-grid" id="grid-${code}"></div>`;

    container.appendChild(section);

    const grid = document.getElementById(`grid-${code}`);
    for (const item of items) {
      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
        <div class="item-img-wrap">
          <img
            src="${item.src}"
            alt="${item.sku} — ${item.description}"
            loading="lazy"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="item-img-placeholder" style="display:none;">
            <span class="icon">${cat.icon}</span>
            <span>${item.sku}</span>
          </div>
        </div>
        <div class="item-sku">${item.sku}</div>
        <div class="item-desc">${item.description}</div>
        ${item.designer ? `<div class="item-designer">Design by ${item.designer}</div>` : ""}`;
      grid.appendChild(card);
    }
  }
}

// ─── LOAD INVENTORY ───────────────────────────────────────────
async function loadInventory() {
  // 1. Use manual list if populated
  if (MANUAL_INVENTORY.length > 0) {
    buildGallery(MANUAL_INVENTORY);
    return;
  }

  // 2. Try loading inventory-manifest.json (for GitHub Pages)
  try {
    const res = await fetch("inventory-manifest.json");
    if (res.ok) {
      const files = await res.json();
      buildGallery(files);
      return;
    }
  } catch (_) {/* fall through */}

  // 3. Try a directory listing (works on some local servers)
  try {
    const res = await fetch("inventory/");
    if (res.ok) {
      const html = await res.text();
      // Parse hrefs from a basic directory listing
      const matches = [...html.matchAll(/href="([^"]+\.(jpg|jpeg|png|gif|webp))"/gi)];
      const files = matches.map(m => m[1].split("/").pop());
      buildGallery(files);
      return;
    }
  } catch (_) {/* fall through */}

  // 4. Nothing worked — show guidance
  buildGallery([]);
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", loadInventory);
