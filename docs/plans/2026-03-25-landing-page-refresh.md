# Landing Page Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refresh `landing.html` into a more premium dark-tech landing page with improved CTA hierarchy, upgraded card depth, and refined visual polish.

**Architecture:** This update keeps the page as a single static HTML document using Tailwind CDN plus a small custom CSS layer. The implementation focuses on visual treatment, spacing, CTA hierarchy, and section polish without introducing a build step or changing core copy structure.

**Tech Stack:** HTML, Tailwind CSS CDN, custom CSS

---

### Task 1: Upgrade shared visual system

**Files:**
- Modify: `landing.html`

**Step 1: Add shared utility classes**

- Add custom CSS classes for glow backgrounds, grid overlays, glass cards, premium buttons, chip pills, and hover transitions.

**Step 2: Update page background treatment**

- Add layered page-level gradients and glow helpers while preserving legibility.

**Step 3: Verify style classes are reusable**

- Ensure the new classes can be reused across hero, cards, and footer CTA without duplicating markup patterns.

### Task 2: Refine hero and CTA

**Files:**
- Modify: `landing.html`

**Step 1: Rework hero container**

- Add richer visual layering, better width control, and stronger spacing rhythm.

**Step 2: Upgrade CTA buttons**

- Convert the primary CTA into a dominant gradient button and the secondary CTA into a glass secondary action.

**Step 3: Add trust chips**

- Insert a compact row of product capability pills below the CTA row.

### Task 3: Upgrade cards and content hierarchy

**Files:**
- Modify: `landing.html`

**Step 1: Restyle feature cards**

- Apply glass card styling, better icon badge treatment, top highlight lines, and stronger hover states.

**Step 2: Improve AI engine modules**

- Add section lead text, stronger headings, and cleaner grid rhythm for sub-features.

**Step 3: Restyle value summary section**

- Increase depth and contrast in the “Why Choose Us” block with more refined presentation.

### Task 4: Polish footer CTA and interaction details

**Files:**
- Modify: `landing.html`

**Step 1: Upgrade final CTA block**

- Turn the final CTA into a stronger conversion panel with richer background layering.

**Step 2: Add motion consistency**

- Ensure buttons, cards, and chips share restrained transitions and hover polish.

**Step 3: Validate final visual consistency**

- Review spacing, contrast, and CTA emphasis across the page.

### Task 5: Verify markup

**Files:**
- Modify: `landing.html`

**Step 1: Check key copy and HTML structure**

- Confirm headline, buttons, and sections remain intact.

**Step 2: Load the page locally**

- Verify the page still serves correctly through the local static server.
