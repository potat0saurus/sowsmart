# SowSmart — Product Requirements Document

> **Status:** Draft
> **Working Title:** SowSmart _(name TBD — trademark check required before launch)_
> **Last Updated:** 2026-02-21

---

## 1. Overview

SowSmart is a square foot gardening planner that helps users design, optimise, and manage their garden beds. Users input their bed dimensions, select vegetables, and the app calculates planting configurations, flags companion planting conflicts, and provides timing guidance based on their growing zone.

The end goal is a mobile app (iOS & Android) with a whimsical, Studio Ghibli-inspired aesthetic — warm, painterly, and joyful. The MVP is a browser-based tool focused on core planning functionality.

---

## 2. Problem Statement

Square foot gardening is a well-established method but planning it well is hard without help. Gardeners have to manually look up:
- How many plants fit in a square foot
- Which plants grow well together (and which don't)
- When to plant based on their location and frost dates

There's no single tool that combines grid planning, companion planting intelligence, and zone-based timing in one place — especially not one that feels delightful to use.

---

## 3. Goals

- Make garden bed planning fast and accessible for beginners and experienced gardeners alike
- Surface companion planting knowledge without requiring the user to already know it
- Give users confidence in their planting decisions through clear visual feedback
- Build toward a mobile-first, beautifully designed experience

---

## 4. Target Users

- Home gardeners using raised beds or defined garden plots
- Beginners who want guidance on what to plant and where
- Experienced gardeners who want a faster planning tool
- Anyone interested in square foot gardening methodology

---

## 5. End Goal Feature Set

### Garden Bed Management
- Create and save multiple garden beds
- Group beds into a named **Garden** (e.g. a U-shaped bed made of 3 individual beds)
- Visual top-down grid representation of each bed

### Grid Planning
- Input custom bed dimensions to generate a square foot grid
- **Auto-suggest layout** — app recommends an optimised planting configuration based on selected vegetables, companion compatibility, and spacing rules
- **Drag-and-drop** — users can manually arrange or adjust the suggested layout
- Visual indicators for companion, competitive, and incompatible plant pairings across the grid

### Plant Database
- Built-in database of common vegetables with:
  - Spacing rules (plants per square foot)
  - Companion plants
  - Competitive plants
  - Incompatible plants
  - Growing zone timing data
- User-submitted custom plants (if not found in the database)

### Companion Planting
- Visual warnings on the grid when incompatible plants are placed near each other (overridable — user can keep the placement but the warning stays visible)
- Recommendations surfaced as the user selects plants (e.g. _"You've added tomatoes — basil is a great companion!"_)
- Cross-bed companion planting awareness

### Growing Zones & Timing
- Auto-detect user's growing zone from device location
- Display planting windows for each selected vegetable
- Push notification reminders (e.g. _"Time to start your tomato seedlings indoors!"_)

### Accounts & Saving
- Sign in with Google or Apple
- Saved beds and gardens synced across devices

### Design
- Whimsical, painterly aesthetic inspired by Studio Ghibli
- Warm colour palette, illustrated plant icons, soft textures
- Feels like a garden journal, not a spreadsheet

---

## 6. MVP Scope (Browser)

The MVP validates the core planning loop in the browser with no login required.

### In Scope

| Feature | Notes |
|---|---|
| Input bed dimensions | Width × length in feet, generates square grid |
| Select vegetables from built-in database | Common vegetables only |
| Auto-suggest planting layout | Optimises for companion compatibility + spacing |
| Drag-and-drop grid adjustment | User can override the suggestion |
| Automatic spacing rules | App calculates plants per square based on vegetable type |
| Incompatibility warnings | Shown on grid when incompatible plants are adjacent; overridable |
| Companion planting recommendations | Surfaced as user selects plants |
| Manual growing zone input | User enters their USDA zone |
| Planting timing suggestions | Based on entered zone |
| Local saving | Beds saved to browser local storage, no account needed |
| Multiple beds | Saved independently, no grouping |

### Out of Scope for MVP

- User accounts / login
- Custom user-added plants
- Location-based zone detection
- Push notifications
- Bed grouping / multi-bed gardens
- Cross-bed companion planting
- Mobile app
- Studio Ghibli visual design _(MVP can be clean and functional)_

---

## 7. User Stories

### Core Planning
- As a user, I want to enter my bed dimensions so I can see exactly how many squares I have to work with
- As a user, I want to select vegetables I'd like to grow and have the app tell me how many fit per square
- As a user, I want the app to suggest a layout so I don't have to figure out configuration from scratch
- As a user, I want to drag and drop plants into specific squares so I can customise the layout to my preference

### Companion Planting
- As a user, I want to see which of my selected plants grow well together so I can make smart placement decisions
- As a user, I want to be warned when I place incompatible plants next to each other, even if I can still choose to do it
- As a user, I want the app to recommend companion plants based on what I've already selected

### Timing
- As a user, I want to enter my growing zone so the app can tell me when to plant each vegetable
- As a user (end goal), I want the app to detect my zone automatically so I don't have to look it up
- As a user (end goal), I want to receive reminders when it's time to plant or start seedlings

### Saving
- As a user, I want to save my bed layout and come back to it later
- As a user, I want to save multiple bed configurations for different areas of my garden
- As a user (end goal), I want my gardens saved to my account so I can access them on any device

---

## 8. Key UX Flows

### MVP: Plan a New Bed
1. User lands on home screen → clicks **"New Bed"**
2. Enters bed dimensions (e.g. 4ft × 8ft) → grid of 32 squares is generated
3. User enters their USDA growing zone
4. User browses/searches the plant database and selects vegetables
5. App shows companion/incompatible relationships as plants are selected
6. User clicks **"Suggest Layout"** → app fills the grid with an optimised arrangement
7. User reviews layout, drags and drops to adjust as desired
8. Warnings appear on any incompatible adjacent placements
9. User views planting timing per vegetable based on their zone
10. User saves the bed (stored in local storage)

---

## 9. Technical Considerations

### MVP (Browser)
- Vanilla HTML/CSS/JS or lightweight framework (TBD)
- Local storage for saving bed configurations
- Plant database as a local JSON file to start
- No backend required for MVP

### End Goal (Mobile)
- React Native or Flutter for cross-platform iOS/Android
- Backend API for user accounts, saved gardens, and custom plants
- Database: PostgreSQL or similar for plant data and user data
- Auth: Google Sign-In / Apple Sign-In (OAuth)
- Push notifications via Firebase Cloud Messaging (FCM) or similar
- Growing zone detection via geolocation + USDA zone API or local dataset

---

## 10. Design Direction

### MVP
- Clean, functional, readable
- Grid-focused layout
- Clear colour coding for companion (green), competitive (yellow/amber), incompatible (red) relationships

### End Goal
- **Studio Ghibli-inspired** — warm, painterly, whimsical
- Illustrated plant icons (hand-drawn style)
- Soft earthy tones, watercolour textures
- Feels like a living garden journal
- Animations: plants "growing" into squares, gentle leaf movements
- Typography: friendly, slightly rounded — not sterile

---

## 11. Open Questions

- [ ] Trademark/name check for "SowSmart" before launch
- [ ] Which vegetables to include in the initial database, and what data source to use for companion planting relationships?

---

## 12. Resolved Decisions

| Question | Decision |
|---|---|
| Auto-suggest priority | Optimise for **companion compatibility first** |
| Too many plants selected | Generate the best compatibility layout possible, then show the user a list of plants that didn't fit. User can swap any excluded plant in by choosing which currently-placed plant to remove in its place. |
| Monetisation | **Free for MVP.** Paid app in the future (one-time purchase or subscription TBD). |

---

## 13. Success Metrics (End Goal)

- Users successfully complete a full bed plan in under 10 minutes
- Retention: users return to update/add beds across multiple growing seasons
- App Store rating ≥ 4.5 stars
- Companion planting warning feature reduces user-reported planting mistakes
