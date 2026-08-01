# Josiah's Maker Cave

Star Trek TNG–themed website for 3D printed toys and fidgets.  
© Randy Lindstrom · All Rights Reserved

---

## File Structure

```
josiahs-maker-cave/
├── index.html
├── cover-photo-1.jpg          ← Drop your hero background image here
├── inventory/                 ← Drop inventory images here (see naming guide)
│   ├── DGN-0001 Crystal Dragon Blue.jpg
│   ├── FGT-0001 Infinity Cube.jpg
│   └── ...
├── inventory-manifest.json    ← Generate this for GitHub Pages (see below)
├── tools/                     ← Embedded browser apps (see SDF Editor below)
│   ├── sdf-editor.html
│   └── sdf-editor-blob.html
├── css/
│   └── style.css
└── js/
    ├── gallery.js
    └── main.js
```

---

## Inventory Naming Convention

All images placed in the `inventory/` folder must follow this naming format:

```
AAA-0000 Description of the item.jpg
```

**Category Codes:**

| Code | Category                |
|------|-------------------------|
| DGN  | Dragons                 |
| OCN  | Ocean Creatures         |
| DSR  | Dinosaurs & Prehistoric |
| MYH  | Mythical Creatures      |
| PZL  | Puzzles                 |
| FGT  | Fidgets                 |
| GTL  | Gadgets & Tools         |
| MBR  | Robots & Mechs          |
| SCI  | Science, Space & Tech   |
| EDU  | Educational             |
| ART  | Art & Decorative        |
| ABL  | Adorable                |

**Examples:**
- `DGN-0001 Crystal Dragon Blue.jpg` → SKU DGN-0001, description "Crystal Dragon Blue"
- `FGT-0001 Infinity Cube.jpg` → SKU FGT-0001, description "Infinity Cube"
- `MYH-0002 Flexi Unicorn Pink.png` → SKU MYH-0002, description "Flexi Unicorn Pink"

Supported image formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

---

## GitHub Pages Setup

GitHub Pages serves static files but does **not** provide directory listings.  
You need to maintain an `inventory-manifest.json` file so the gallery can find your images.

### inventory-manifest.json format

```json
[
  "DGN-0001 Crystal Dragon Blue.jpg",
  "DGN-0002 Flexi Dragon Hatchling.jpg",
  "FGT-0001 Infinity Cube.jpg",
  "MYH-0001 Articulating Phoenix.jpg"
]
```

Just the filenames — no paths. Update this file every time you add images to `inventory/`.

### Quick update workflow

1. Drop new image(s) into `inventory/`
2. Add the filename(s) to `inventory-manifest.json`
3. Commit and push to GitHub

The gallery rebuilds automatically on page load.

---

## Manual Inventory (local / offline fallback)

If you're testing locally without a web server, open `js/gallery.js` and populate
the `MANUAL_INVENTORY` array:

```js
const MANUAL_INVENTORY = [
  "DGN-0001 Crystal Dragon Blue.jpg",
  "FGT-0001 Infinity Cube.jpg",
];
```

This bypasses all fetch logic and works with `file://` URLs.

---

## Cover Photo

Place your hero image at the root of the project named exactly:

```
cover-photo-1.jpg
```

The image will be displayed full-bleed on the Home page with a dark overlay.
Recommended: a wide landscape photo of a cool 3D print, at least 1920×1080px.

---

## SDF Editor section

The **EDITOR** tab (`#editor`) hosts two signed-distance modelling apps in an
iframe, switched by the tab row. Both ship in `tools/`:

| File                           | Source in Command-Center | What it is                                          |
|--------------------------------|--------------------------|-----------------------------------------------------|
| `tools/sdf-editor.html`        | `sdf_editor.html`        | **MetaMeld** — the general SDF modeller: primitives, cut/keep, bodies, STL |
| `tools/fish-editor-nurbs.html` | `fish_designer_nurbs.html` | The NURBS flexi fish — draw views, Shape JSON       |

Both are self-contained (no dependencies, no network calls, no analytics) and
run entirely in the visitor's browser. `main.js` leaves the iframe empty until
the section is opened for the first time, so an editor's per-frame solve never
costs anything on the Home or Gallery pages.

They're written as full-screen apps, so the section also carries an **OPEN FULL
SCREEN** link that hands the visitor the raw page — the better experience for
real modelling, and the one to use on a phone.

**Updating them:** these are copies. Edit the originals in the
[Command-Center](https://github.com/DuckySonadar/Command-Center) repo, then
re-copy:

```
cp ../Command-Center/sdf_editor.html          tools/sdf-editor.html
cp ../Command-Center/fish_designer_nurbs.html tools/fish-editor-nurbs.html
```

The filenames here predate the app being named MetaMeld and are deliberately
left alone — `tools/sdf-editor.html` is the URL already live and already
saved to a Home Screen, and nothing in either file is path-relative.

One edit is applied on top of the copy: the editor's **‹ Maker Cave** link
gets `target="_top"` so it escapes the iframe instead of loading the site
inside the embed. Re-apply it after re-copying (it's a no-op when the file is
opened standalone, so it can go upstream whenever convenient).

---

## License Notice

Physical prints of Cinderwing3D original designs are sold under an active  
commercial subscriber license. All items are personally printed by the seller.  
Digital files are not sold or distributed. Original designs credit: **Cinderwing3D**.

Per license terms:
- ✅ Physical prints may be sold
- ✅ Wholesale and local shop partnerships allowed
- ❌ Digital STL files may not be sold or shared
- ❌ No outsourcing or third-party manufacturing
- ❌ No mass production / dropshipping

---

*© Randy Lindstrom · Josiah's Maker Cave*
