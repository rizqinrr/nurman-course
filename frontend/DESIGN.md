---
name: Nurman Course Funnel
description: Peta belajar mobile-first untuk memilih program les dan lanjut ke WhatsApp.
colors:
  primary: "#4a70a9"
  primary-deep: "#2e4b7a"
  accent-destination: "#f2c14e"
  neutral-bg: "#edf4fb"
  ink: "#14233a"
  ink-soft: "#536781"
  line: "#c4d3e3"
typography:
  display:
    fontFamily: "var(--font-dm-sans), system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 8vw, 3rem)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.055em"
  body:
    fontFamily: "var(--font-dm-sans), system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.75
rounded:
  sm: "0.75rem"
  md: "1rem"
  lg: "1.75rem"
spacing:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.25rem"
---

# Design System: Nurman Course Funnel

## Overview

**Creative North Star: "Peta Belajar"**

The funnel extends the landing page's plotted learning map into a focused selection flow. Parents see a route, choose a branch, narrow the choice, and arrive at a schedule with the WhatsApp action still visible. The surface is light, practical, and decisive rather than decorative.

Key characteristics:
- Cool map-blue ground with deep navy ink.
- Functional route lines and numbered progress rail.
- Warm yellow reserved for selected/destination states.
- Mobile-first stacked choices with generous touch targets.

## Colors

The palette is a cool, high-contrast blue map with a warm destination marker.

### Primary
- **Nurman Blue** (#4a70a9): active route nodes, primary actions, and selected controls.
- **Deep Route Navy** (#2e4b7a): selected context panels and high-emphasis summaries.
- **Destination Gold** (#f2c14e): Calistung route and selected level destination state.

### Neutral
- **Map Ground** (#edf4fb): page background and progress rail backing.
- **Ink** (#14233a): display headings.
- **Soft Ink** (#536781): body copy and supporting descriptions.
- **Plot Line** (#c4d3e3): route lines, borders, and dividers.

## Typography

**Display Font:** DM Sans via the existing project variable, with system sans fallback.
**Body Font:** DM Sans via the existing project variable, with system sans fallback.

**Character:** Dense, friendly, and direct. Heavy display weights establish the next decision; medium body text keeps descriptions easy to scan.

### Hierarchy
- **Display** (900, 2.25rem–3rem, 0.98): route page titles.
- **Headline** (900, 1.125rem–1.25rem, normal): selectable route and level names.
- **Body** (500, 1rem, 1.75): descriptions and helper copy.
- **Label** (700–900, 0.625rem–0.875rem): progress steps, badges, and compact state labels.

## Layout

The funnel uses a centered max-width content column on the mobile-first course shell. The first viewport begins with back navigation, a four-step progress rail, then the current decision. Choices use full-width touch targets and route lines as structural wayfinding. Sticky bottom actions remain visible on level and schedule pages. The surface has no horizontal overflow at 390px and expands fluidly through desktop widths.

## Elevation & Depth

Depth is a hybrid of tonal layering and soft ambient shadows. White route panels lift subtly from the map ground; deep navy summary panels establish the current context; no hard offset shadows are used.

## Shapes

Route panels use a 1.75rem radius, compact controls use rounded-full or 0.75rem–1rem radii, and borders stay thin and cool. The gold route is a tonal variant of the same geometry rather than a separate component family.

## Components

### Buttons
- **Shape:** rounded 1rem–1.75rem with minimum 3rem touch height.
- **Primary:** Nurman Blue with white text and soft blue shadow.
- **Hover / Focus:** darken to #3a5a99; use a visible 2px focus outline.

### Chips
- **Style:** white translucent surface, Plot Line border, Soft Ink text.
- **State:** active controls use Nurman Blue and white text; disabled controls use muted opacity and explicit status text.

### Cards / Containers
- **Corner Style:** 1.75rem for route panels, 1rem–1.5rem for content groups.
- **Background:** white at rest, deep route navy for context summaries, warm yellow for destination route.
- **Shadow Strategy:** soft ambient lift only.
- **Border:** thin Plot Line border.
- **Internal Padding:** 1.25rem mobile, 1.5rem at larger widths.

### Inputs / Fields
- **Style:** white 90% surface, Plot Line stroke, 0.75rem radius.
- **Focus:** Nurman Blue border with a low-opacity blue ring.
- **Error / Disabled:** preserve readable muted text and explicit disabled labels.

### Navigation
- **Style:** pill back action paired with the Peta Belajar marker and four-step progress rail.
- **Active:** navy label and gold/blue numbered state.

### Route Nodes
Functional map nodes combine a thin connecting line, icon tile, decision copy, and directional arrow. The node itself is the action; no nested card hierarchy is needed.

## Do's and Don'ts

### Do:
- **Do** preserve the route sequence and existing funnel data source.
- **Do** keep primary WhatsApp and schedule actions visible on mobile.
- **Do** use the yellow accent as a destination/selection signal, not as a general highlight.
- **Do** keep copy in Indonesian and preserve verified product claims.

### Don't:
- **Don't** introduce a second palette or a separate visual identity inside the course funnel.
- **Don't** expose pricing, WhatsApp number, or material data from duplicate page-local sources.
- **Don't** hide the next action below a long explanation on mobile.
- **Don't** use gradients, hard offset shadows, or decorative glyphs as substitutes for authored route structure.
