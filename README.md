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
│   ├── sdf-editor.html        ← MetaMeld, built — this is the file that ships
│   ├── sdf-editor.shell.html  ← its source: everything but the geometry
│   ├── sinterform/            ← submodule: the geometry kernel, Apache-2.0
│   │     sinterform.js  the geometry · glsl.js  its shader half
│   │     glmesh.js      optional: fills the mesher's grid on the GPU
│   ├── build-editor.mjs       ← splices them into sdf-editor.html
│   ├── check-kernel.mjs       ← checks the built file
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

## Licence and the MetaMeld name

Two licences, on purpose:

| what | licence | file |
|---|---|---|
| **SinterForm** — the geometry kernel, vendored at `tools/sinterform/` and inlined into `tools/sdf-editor.html` | Apache-2.0 | `LICENSE-APACHE` |
| everything else — the site, the MetaMeld application, the fish designer | MIT | `LICENSE` |

The kernel now lives in [its own repository][sf] and is consumed back into
MetaMeld as a submodule. Apache-2.0 rather than MIT because it
carries an express patent grant and an express trademark carve-out (§6),
which is what a library meant for strangers to embed should say for itself
rather than leave to a separate file.

Both are permissive and both are the owner's to grant, so the split is a
choice rather than a conflict. Nothing narrows either: use any of it, embed
it, sell what you build with it, owe nobody anything.

**MetaMeld™ is a trademark and is not covered by that licence.** MIT is a
copyright licence and says nothing about names, so the reservation is
spelled out in `TRADEMARK.md` rather than left to be inferred. The short
version: fork it freely and call your fork something else; "a MetaMeld
plugin" and "built with MetaMeld" need no permission; a modified build
distributed *as* MetaMeld does.

Both editors are single self-contained files that get copied around on
their own, so each carries its own copyright notice at the top — MIT
requires the notice to survive copying, and a file that travels alone has
to carry it.

### The kernel, and building MetaMeld

**SinterForm** is the geometry: primitives, booleans, bodies, baked fields,
the mesher, STL output — 1,411 lines that touch no DOM, no WebGL, no storage
and none of the application's state, and not the GPU either: the shader half
of each primitive is a separate file, `glsl.js`, and the JS in the kernel is
*generated from it* rather than written beside it. That is what made it
liftable, and it now lives in [its own repository][sf], pinned here as a
submodule at `tools/sinterform/`. No npm, no `node_modules`, no bundler: this
project has no build tooling and that is deliberate.

[sf]: https://github.com/DuckySonadar/sinterform

Except for one 30-line script, because MetaMeld's defining property is that
it is **one file**. It opens from `file://`, it survives being mailed to
someone, and Add to Home Screen turns it into an app with no server
anywhere. Splitting the sources must not cost that. So the sources are
split and the shipped file is assembled:

```
sdf-editor.shell.html   everything but the geometry, with two markers in it
  + sinterform/sinterform.js    the geometry           ⎫ one script element
  + sinterform/glsl.js          the shader half of it  ⎭
  + sinterform/glmesh.js        the grid fill, on the GPU — its own element
  = sdf-editor.html     what actually ships, and what is committed
```

The kernel and its shader are separate files because they are used
separately — a mesher or a test wants the geometry without a GPU anywhere
near it. They arrive in one script element here only because MetaMeld ships
as one file.

`glmesh.js` gets an element of its own, and for the same reason stated the
other way round. It exists to *drive* a GL context: it fills the mesher's
sample grid on the GPU instead of in JavaScript, which is what makes the
meshed viewport and the STL export quick. Every line of it names something
`check-kernel.mjs` refuses to find in a kernel, so putting it in the block
above would be claiming it is geometry. It is not, and MetaMeld treats it as
optional — everything works without it, more slowly.

```bash
git submodule update --init tools/sinterform   # once, after cloning
node tools/build-editor.mjs                    # after changing either source
```

Edit `sdf-editor.shell.html`, never `sdf-editor.html` — the build overwrites
it. It stays committed so that landing on the repo and opening the file
works without being told to build anything first.

The build emits the Apache-2.0 notice and licence text into the file itself,
along with the exact kernel commit it used. §4 asks that attribution be
retained and the licence included, and the shipped file travels alone —
nobody who receives it has `LICENSE-APACHE` sitting next to it. A step a
human has to remember is a step that eventually does not happen, so it isn't
one.

Then it is checked rather than trusted:

```bash
node tools/check-kernel.mjs
```

The assertions moved to SinterForm along with the kernel — a kernel and the
thing that proves it correct should not live in different repositories — and
this runs them against the **built** `sdf-editor.html`. It refuses the
kernel if it names anything browser-shaped, runs it under node with no DOM
at all, and asks it for geometry whose answer is known: a sphere's
distances, a cut that removes material, two bodies that meet without
blending. Exit code 0 or 1, so it can be a CI step.

Running it on the built file rather than on the submodule source is the
point. The failure it exists for — a literal closing script tag anywhere in
the kernel, even inside a comment — ends the script element and turns the
rest of the page into text. That is a property of the assembled HTML, so it
is checked there. The build refuses to write the file at all in that case.

Two more checks live in the submodule and are worth running after touching
geometry:

```bash
node tools/sinterform/check-primitives.mjs   # is each primitive a real distance function?
node tools/sinterform/check-glsl.mjs         # do the GLSL and JS twins agree?
```

The first matters because `map()` is one fold: a primitive that over-estimates
distance shortens the safe step for *every* ray in the scene, not just the
ones near it. It prints the maximum safe raymarch step the whole set implies —
currently 0.817, against the 0.72 the shader uses.

### Who commits, and as whom

Commits arrive from the GitHub web UI, a Mac and Claude Code sessions in
the cloud, and each brought its own git identity — including a personal
email published in a public repo and a `…@Users-MacBook-Pro.local` address
that does not exist. `.mailmap` maps them all onto one canonical author for
display (`git log`, `git shortlog`, `git blame` read it automatically;
nothing is rewritten, and GitHub's own contributor graph ignores it).
`.claude/hooks/session-start.sh` fixes it at the source for remote Claude
Code sessions, writing `git config --local` only and leaving local sessions
to whatever identity the machine already has.

The canonical identity is the GitHub account plus GitHub's noreply address —
it links the commit to the account and keeps a personal email off a public
repo. On your own machine:

```bash
git config --global user.name  "DuckySonadar"
git config --global user.email "77309815+DuckySonadar@users.noreply.github.com"
```

Claude stays on the commits it helped with as a `Co-Authored-By` trailer.

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
  and top radii — set the top to 0 for a point), ellipsoid, prism (a
  regular n-gon extruded, 3 to 12 sides), pyramid, octahedron, dome (a
  sphere cut at a height you choose, so less or more than a hemisphere),
  arc (a torus swept through part of a turn — the hinge and spring shape),
  link (a chain link standing on end, so the next one threads through it),
  and a **plane cut**. An unrotated plane cut at z = 0 keeps everything
  above the plate, which is the flat-bottom trick every print-in-place part
  wants. The readout warns when the model reaches below the plate.

  The kernel carries four more — profile, wire, sweep and construct — that
  this editor does not offer, because each is a *drawing* held in a library
  on the document rather than a handful of numbers, and MetaMeld has no
  surface to draw one on. A document written elsewhere that names one still
  opens, renders and exports here.

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

### The widget

**Tap a shape in the viewport to select it**, in either mode. The shape list
follows: the row lights up and scrolls into view, and the inspector switches
to it — which is the right way round for a model you are looking at rather
than reading. Tapping empty space clears the selection.

The tap is a ray marched against the same field the shader draws, so what you
get is the shape whose surface is under your finger. Where two shapes blend,
the surface belongs to both and the nearer one wins. Cuts are not candidates:
you cannot tap a hole.

Selecting anything raises a **widget** at the selection, and a small bar of
three buttons down the left edge says what its handles do:

- **Move** — an arrow per axis. Drag one and the selection slides along that
  axis only.
- **Turn** — a ring per axis. Drag one and the selection rotates about that
  axis, through the angle your finger travelled *along the ring* rather than
  across the screen.
- **Scale** — a cube per axis. Dragging any of them scales **uniformly**,
  which is what the Scale slider does and for the same reason: per-axis
  scaling of a rotated assembly is not expressible here, and three separate
  handles must not imply otherwise.

Only the near half of each ring is drawn, and only what is drawn can be
grabbed. Three full circles at the same centre put the back of each one
across the front of the others, and with a fingertip's worth of tolerance
around all of it, near enough every press inside the widget caught a ring —
including the ones meant to orbit the view. A ring is also a long target
rather than a small one, so it takes a tighter tolerance than an arrow does.

A ring whose plane nearly contains the view direction is not offered at all.
Edge-on it draws as a line, and the angle it measures is one in its own
plane, so a pixel of finger is most of a turn: what it mostly did was catch
drags meant for something else. Orbit a little and it comes back. Where two
rings are both within reach, the one you are facing more squarely wins.

Two fingers are always the camera, whatever the widget is doing.

The handles are drawn in the axis colours — X red, Y green, Z violet — and
those are the colours on the matching sliders in the panel, so the arrow on
screen and the row in the sheet do not have to explain that they are the same
thing. (Z is violet rather than blue because a selected shape is drawn in
cyan, and a blue handle for its up axis disappeared into it.)

The widget turns about the selection's own centre, which is the same centre
the Place sliders use, so the two controls cannot disagree about what a turn
is about. With several shapes selected it moves, turns and scales all of them
as one rigid piece, and the whole drag is one undo step.

Everything a handle does goes through the same three operations the sliders
drive. The widget is a second way to reach them, not a second implementation
of them — which is why a group turn stays rigid to floating-point precision
whichever control you use.

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

A tap in the viewport obeys the same two modes: in **Single** it replaces the
selection, in **Sticky** it adds to it, and in Sticky a tap on empty space is
left alone rather than clearing what you have gathered.

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

### How big a model can be

There is no limit on the number of shapes. There used to be one — 32 — and
it was never a fact about documents: it was how many shapes fit in the
raymarcher's uniform block, enforced by refusing the 33rd shape rather than
by changing how the model was drawn.

So it changes how the model is drawn instead. Up to what the GPU reports it
can hold — 96 shapes on a desktop, 48 on a phone, fewer on hardware sitting
at the floor the standard guarantees — the viewport raymarches, which is the
picture with the shadows, the ambient occlusion and the selection blue that
fades across a blend. Past that it meshes the same field, with the same
surface nets the STL comes out of, and draws the triangles: plainer — no
blue, no shadows, the selection carried by the wireframe boxes alone — and
the same cost for four hundred shapes as for four. The shape count reads
**meshed view** when that is what you are looking at, and the size readout
says how many triangles at what spacing.

Only the shapes actually being drawn count. Shapes switched off and hidden
bodies are not in the plan at all, so a large document worked on one body at
a time keeps the better picture.

The mesh is also what you see **while you orbit** a model small enough to
raymarch, on hardware that can build it on the GPU. The model is not
changing while the camera moves, so the triangles are still of what is on
the screen, and they redraw in about a millisecond where a raymarched frame
of the same scene costs hundreds. The raymarched picture is back the moment
the view settles. Dragging a *slider* never gets the mesh — the shape is
changing under it, and a stand-in that lagged the hand would be worse than a
slow picture that did not.

### Reading and typing the numbers

Every slider carries an **icon** saying what it drives, and the axis ones are
drawn in the axis colour the widget uses — so the red arrow on screen and the
red row in the sheet identify each other without a caption.

**Tap the number** on any row and type the value you want. A slider is the
right control for finding a size and the wrong one for entering a known one:
the 0.5 mm step cannot reach 12.7, and on a phone the last millimetre is a
fight. Enter commits, Escape leaves it alone, and a typed value is clamped to
the same range the slider has. It goes through the row's own setter, so it
takes exactly the path a dragged value does — same clamp, same undo step,
same redraw. The STL resolution row works the same way.

### Getting it out

**Save STL** sweeps the real field on a grid (the resolution slider, 0.5 mm
by default) and runs the same surface-nets mesher the Python tools use.
Sweeping the grid is one distance evaluation per corner and is essentially
the whole cost of an export, so it goes to the GPU where there is one:
`glmesh.js` compiles the same field into a shader and renders it into a
float target a slab at a time, which is the same grid the JavaScript loop
would have written, walked by the same mesher. Where there is no GPU path —
or the model is past even *that* uniform block — it is evaluated a slice at
a time between frames, so the phone stays
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
under on the ice cream cone — on a coarser grid the more shapes there are,
since the probe costs grid points times shapes and a readout is not worth
freezing the panel for).

The meshed view is the one picture that does not disagree with the STL,
being the same mesher on the same field. It runs at a coarser spacing —
whatever a grid of about 120 cubed works out to for the model in front of
it — so it is the *same* surface found less finely, rather than a different
surface.

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

In **Draw side** each cutter also gets a **bounding box** — its own
extent, shroud and overshoot included, not just the part that removes
material. Drag a **corner** to stretch it fore-aft and vertically at
once, anchored on the corner opposite, so the far side of the box holds
still. Drag the **middle** handle to move that one cutter. Both are
per-joint, so a fish can have one joint nudged forward and the rest left
alone. Everything a handle writes is a *delta* on the three sliders, so
the sliders keep moving every cutter afterwards; **double-click a middle
handle** to throw one cutter's delta away and hand it back to them.
Across-body scale is not on this box — the side view has no width axis —
so it stays on the Scale slider, where Draw top shows it.

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

The 3D view **raymarches the printable plate on the GPU**. The build
samples the real plate field — segmented body, joint pins and cavities,
free ball-socket fin parts — into a distance grid, hands it to a GLSL
sphere tracer as a 3D texture, and marches it per pixel. What is on
screen is the print, not a stand-in for it: the segment gaps are the
actual joint cuts and the fins are lying where they will lie on the
plate. Orbiting costs nothing, since the field is already on the GPU;
only an edit rebuilds it. The quality buttons set the grid spacing,
which is what the picture's fidelity is limited by (1.0 / 0.7 / 0.5 mm),
and the status line reports the grid it settled on.

If the shape cannot make a plate — a fin socket straddling a joint, say —
the view falls back to the unsegmented shape and says *shape only*, so
you can see what you are fixing. Exports never fall back.

**Shape JSON** exports a file for `flexifish_nurbs.py --shape`. **Save STL**
meshes that same field with surface nets, at the 0.3 mm resolution the
Python tool prints at. Expect a few seconds; the mesher can leave a handful
of non-manifold edges that slicers repair automatically, so the Python build
stays the pristine path. The JS is a numerically faithful port of the Python
pipeline, so what you draw is what prints.

On a phone the panel docks to the bottom half; one finger drags points, two
fingers pan/zoom the drawing.


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
