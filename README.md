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
├── tools/                     ← The modelling apps; this repo is their home
│   ├── sdf-editor.html        ← MetaMeld
│   └── fish-editor-nurbs.html ← NURBS fish designer
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

## The editors (`tools/`)

Two self-contained modelling apps live here, and **this repo is their source
of truth** — edit them here. They were previously kept in
[Command-Center](https://github.com/DuckySonadar/Command-Center) and copied
across, which went wrong in both directions: the site ran a stale NURBS
designer for a while, and the `target="_top"` patch below had to be
re-applied by hand after every copy.

| File | What it is |
|---|---|
| `tools/sdf-editor.html` | **MetaMeld** — the general SDF modeller |
| `tools/fish-editor-nurbs.html` | The **NURBS fish designer** |

Both are single files with no dependencies and no network calls, so they
need no build step: they are live the moment they are pushed. Nothing in
either is path-relative, so they can be moved or renamed — though
`tools/sdf-editor.html` is the URL already saved to Home Screens, so it is
left alone. The filenames predate MetaMeld being named.

The **EDITOR** section of `index.html` embeds them in an iframe, switched by
the tab row, and `main.js` leaves the iframe empty until the section is
first opened so an editor's per-frame solve costs nothing on Home or
Gallery. Both are written as full-screen apps, so the section also carries
an **OPEN FULL SCREEN** link — the better experience for real work, and the
one to use on a phone, where **Share → Add to Home Screen** makes MetaMeld
launch like an app.

MetaMeld's *‹ Maker Cave* link carries `target="_top"` so it escapes the
iframe instead of loading the whole site inside the embed. It is a no-op
when the file is opened standalone.

### What still crosses to Command-Center

Neither of these is a file, but both will break quietly if ignored:

- The NURBS designer's **Shape JSON** is written for
  `flexifish_nurbs.py --shape`, and MetaMeld's model JSON is read by that
  repo's `joint_tool.py` tooling. Treat those shapes as a contract.
- The NURBS designer carries a JS port of the ring-linkage solid that
  `joint_tool.py` defines, checked against `joint_tool.raw` to 3e-14. If
  the solid changes there, that check is what should catch the drift.

---

## MetaMeld (`tools/sdf-editor.html`)

You build a shape out of signed-distance primitives and it raymarches the
result live on the GPU, then meshes the *same* field on the CPU to give you
a printable binary STL. Units are millimeters, +Z is up and z = 0 is the
build plate, same conventions as the flexi fish tools.

It opens on a single-scoop ice cream cone: a cone tipped point-down with its
apex under the plate, so the build-plate cut leaves a flat to stand on, a
squashed ellipsoid scoop, and a torus blended over the join for the rolled
rim. **Starters** has the rest (Blob, Vase, Keytag, Bracket) and will
replace whatever is on screen.

The model is kept in local storage, so closing the tab doesn't lose it —
which also means it is per-browser, and **JSON** is the portable backup.

### Modelling

A model is an ordered list of shapes, each applied to what came before:

- **Add** fuses the shape in, **Cut** removes it, **Keep** intersects.
- **Blend** rounds the join with a smooth min instead of a hard crease —
  0 mm is a sharp edge, a few mm is a fillet. It applies to all three
  operations, so you get soft cuts too.
- **Mirror X/Y/Z** repeats the shape across that plane, which is how you
  place symmetric features (bolt holes, fins) once instead of twice.
- Primitives: sphere, box, cylinder, capsule, torus, cone (separate base
  and top radii — set the top to 0 for a point), ellipsoid, and a
  **plane cut**. An unrotated plane cut at z = 0 keeps everything above
  the plate, which is the flat-bottom trick every print-in-place part
  wants. The readout warns when the model reaches below the plate.

Order matters: a Cut only removes what is already there, so shapes added
after it are untouched — use ▲▼ to move a shape up or down the list.

### Bodies

A body is one buildable part. The **Bodies** list sits above Shapes and is
where you work with them:

- **Tap a body** to select it — every shape it is made of — and to make it
  the active one. New shapes are built into it, and shapes belonging to
  anything else dim in the Shapes list, so you can see at a glance what you
  are working on. Selecting a shape moves you into its body, so the two
  lists stay in step.
- **● / ○** hides a body. It leaves the viewport, the size readout and the
  STL — the way to see inside an assembly, or to print one part of it.
- **✎** renames it. Names are worth setting: they are what the cut targets
  are labelled with.
- **✕** deletes the body and the shapes that build it. Undo brings it back.
- **＋ Body** starts an empty one and makes it active, so you can make the
  part first and then build into it.

A shape's own body is also on its **Body** row in the inspector, and every
Cut or Keep has an **Applies to** row naming the bodies it reaches. The
default is *All bodies*, so a model that never touches any of this behaves
exactly as it did before bodies existed.

Two things follow from a shape living in a body:

- **Blend stops at the boundary.** Two shapes in the same body with a few
  mm of blend fuse into one filleted lump; the same two shapes in
  different bodies meet in a hard crease instead. Nothing smooths across
  a body line.
- **A cut only reaches what it names.** Point a pocket at Body 1 and
  Body 2 keeps its shape, even where the cutting shape passes straight
  through it. That is the whole reason bodies exist — a captive part
  needs its socket carved out of its neighbour and *not* out of itself.

*All bodies* also covers bodies made later, which is what the build-plate
plane cut wants: make it once and every part you add afterwards gets its
flat bottom for free.

Deleting a body leaves any cut that named only it pointing at nothing, and
that cut goes inert — shown as `none` in the shape list rather than quietly
widening to everything it was never aimed at.

The badges in the shape list only appear once a model has two bodies, so
single-part models stay as uncluttered as they were.

**This is not a clearance.** Two bodies that overlap in space still union
into one solid — separate bodies stop the *field* from interacting, not
the geometry. Print-in-place parts still need a real gap between them
(`flexifish_nurbs.py` uses 0.55 mm), and that gap has to survive meshing:
below roughly two voxels of the STL resolution it closes up and the parts
come out welded.

**Orbit** mode: one finger orbits, two fingers pinch and pan. **Move**
mode: one finger slides the selection across the screen plane, two fingers
raise and lower it. ⤢ frames the model in whatever strip of screen the
sheet leaves visible. Drag or tap the grip to resize the sheet.

### Selecting

Selected shapes turn **blue** in the viewport, and because shapes blend
into each other the blue is mixed with the same weight the distance is —
so where a selected shape melts into an unselected one, the colour fades
across the blend instead of stopping at a hard line. It shows you exactly
how far a shape's influence reaches, which is otherwise guesswork.

The button row above the shape list decides what a tap does:

- **Single** — the tapped shape becomes the selection.
- **Sticky** — tapping adds a shape, and tapping it again takes it back
  out. That is the whole deselect story; the selection can be emptied
  completely, and the inspector then says so rather than pretending
  something is selected.

To select a **body**, tap it in the Bodies list. That takes everything the
body is made of — its own shapes *and* every cut or keep that reaches
them, the same set the model is folded from. In Sticky mode it adds the
body to what you already have, so bodies and loose shapes gather together.

**Move** drags everything selected at once, and **Delete** removes all of
it. With more than one shape selected the **Place** sliders drive the
whole selection as one rigid piece: Position translates all of it, and
Rotate turns it about the selection's centre — each shape orbits that
centre and takes its own orientation with it. The size, blend and corner
rows stay on a single shape, since there is no sensible way to resize a
mixed bag of primitives together; that shape is the last one you tapped,
marked in the list with a bar down its edge and named in the inspector
heading as *Editing 1 of N selected*.

The turn is a real rotation, not the same angle added to every shape.
Adding angles happens to work about Z and quietly shears a group apart
about X and Y, because the angles are stored as a Rz·Ry·Rx triple; the
group rotation composes a proper world-axis matrix onto each shape and
reads the triple back out, so distances inside the selection hold to
floating-point precision.

**Duplicate** copies one shape into the body it already belongs to. Select
a whole body first, though, and it copies the lot into a **new** body —
dropping the copies into the source body would only bury them inside the
shapes they came from. The copy is offset 10 mm in x and named after its
source (*Body 1 copy*).

Two details it gets right, both of which are easy to get wrong by hand.
A cut that named only the body being copied comes along, repointed at the
copy, so the new part is carved the same way; a cut that was already
global reaches the copy anyway and is left alone rather than doubled up.
And the copies are slotted in directly after the source body's last shape
rather than appended — a cut only reaches what is above it, so appending
would drop them below the build-plate cut and leave the copy with no flat
bottom.

### Getting it out

**Save STL** sweeps the real field on a grid (the resolution slider, 0.5 mm
by default) and runs the same surface-nets mesher the Python tools use.
It's evaluated a slice at a time between frames, so the phone stays
responsive and iOS never offers to kill the tab. On iOS the finished file
goes to the share sheet — Files, AirDrop, or straight into a slicer app.
Since the build spans several frames iOS has forgotten the tap by the time
it finishes and may refuse the share; the STL is kept, so tapping **Save
STL** again hands it over instantly.

Grids are capped at 14 M voxels on a touch device and 40 M elsewhere; the
readout shows the grid size before you commit. **JSON** copies the model
out as text (or pastes one back in) — the portable backup, since local
storage is per-browser.

### Why the picture and the STL can disagree

They find the surface in different ways, and the difference used to be
visible: the exported part looked slightly eroded next to the viewport.

The mesher is the accurate one. It interpolates the zero crossing exactly,
and its error falls off with the square of the resolution — a 40.000 mm
sphere comes out 39.987 mm at the default 0.5 mm and 39.997 mm at 0.25 mm.
Nothing to worry about on a print.

The *viewer* was the one telling fibs. Raymarching stops as soon as a ray
gets close to the surface rather than on it, so whatever that tolerance is,
the picture is drawn that far proud of the real surface — and because the
tolerance scales with how far the ray has travelled, the model quietly
fattened as you zoomed out. At arm's length it was about 0.2 mm on every
face, and worse across blends and on the ellipsoid, where the field is a
bound rather than a true distance and a given field value means more
millimetres than it says.

The tolerance is now loose only while a finger is down, and tightens as
soon as the view settles — the same trick the render resolution already
used. A settled picture sits about 0.04 mm proud, which is well under a
layer. Dragging is unchanged, and so is the cost of it.

If the number is what matters, though, neither of these is the place to
read it: **the STL is the truth**, and the Size readout is the loosest of
the three (it probes a coarse grid and bisects, and reads about 0.2 mm
under on the ice cream cone).

---

## NURBS fish designer (`tools/fish-editor-nurbs.html`)

Drives the NURBS flexi fish, with a drawing interface: **Draw side** and
**Draw top** show the curves with draggable control points (tap a point,
drag it; ＋/− edit the active curve; × on a fin chip removes that fin).
Region bands (head / dorsal / tail / caudal) and joint cut lines update
live as you draw, the region sliders sit in the right panel, and a
**Linkage: Ball / Rings** toggle picks the joint style.

**Linkage: Rings** subtracts a solid cutter to make each segment cut, and
that solid places and sizes itself against the local body section. The
**Ring cutter** sliders ride on top of that fit — *Along body* slides it,
*Lift* raises it off the plate, *Scale* resizes it — and both draw views
trace its **cross-section** where it currently sits, so you can watch it
move rather than build the plate and look at the hole. The side view cuts
it on the centreline, where the interlocking rings are; the top view cuts
it at the height of those rings. The outline comes from marching squares
on the same field the mesher uses, so it is the cut itself and not a
picture of one. The joint's *cut* stays where the regions put it; these
move only the solid that makes it.

The side fins are one pair, drawn in **Draw top** under the dorsal fin.
Each rides a ball socket, and a socket is a hollow rather than a bump —
a joint cut through one prints it in halves and the fin falls out — so
the whole socket has to sit inside a single rigid piece, and the dorsal
segment is the piece the fish is built around. Drag the outline over a
cut line and the designer says so before you build. (There was a
pectoral pair on the head until recently. Its sockets pushed the first
cut back until they fitted ahead of it, which cost a segment, and on
the plate the two pairs competed for the same skirt of free space
beside the body.)

**Shape JSON** exports a file for `flexifish_nurbs.py --shape`. **Save STL**
builds the real printable plate in the browser — segmented body, joint pins
and cavities, ball-socket fin parts — at the same 0.3 mm resolution the
Python tool prints at. Expect a few seconds; its surface-nets mesher can
leave a handful of non-manifold edges that slicers repair automatically, so
the Python build stays the pristine path. The JS is a numerically faithful
port of the Python pipeline, so what you draw is what prints.

The preview's segment-cut grooves are display only — the grooves and welded
side fins never touch the printable geometry. On a phone the panel docks to
the bottom half; one finger drags points, two fingers pan/zoom the drawing.


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
