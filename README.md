# SowSmart

A square-foot garden planner. Plan your raised beds, pick companion plants, and get planting timing by USDA hardiness zone.

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

The app falls back to local static data (`src/data/plants.js`) when Supabase is not configured.

---

## Plant icons

Icons are vintage seed packet style illustrations generated with ChatGPT (DALL-E 3). The source prompt and batch list live in `design/icon-generation.md`.

Processed icons are stored in `public/icons/` as transparent PNGs.

### Adding a new batch of icons

1. Generate a 2×2 grid image in ChatGPT using the prompt in `design/icon-generation.md`
2. Save the image to the project root
3. Add an entry to the `BATCHES` array in `scripts/crop-icons.mjs`
4. Run the crop script:
   ```bash
   npm run icons:crop
   ```
5. Remove backgrounds from the new icons (see below)

### Removing backgrounds

**Option A — remove.bg API (best quality, 50 free credits/month)**

Add your API key to `.env.local`:
```
REMOVE_BG_API_KEY=your_key_here
```
Get a key at: https://www.remove.bg/dashboard#api-key

Then run:
```bash
npm run icons:remove-bg-api
```
This processes the first 50 icons alphabetically. Run it again next month for additional icons.

**Option B — flood fill (free, good for icons with thick outlines)**

```bash
npm run icons:remove-bg
```
This skips the first 50 (already handled by the API) and processes the rest using edge-flood-fill to remove white/near-white backgrounds.

### Fixing icons that still show a text label

If any icon still has the plant name visible at the bottom after processing, run:

```bash
npm run icons:retrim -- chamomile potato sunflower
```

Pass icon names without the `.png` extension. The script trims an extra 20% from the bottom and re-applies background removal. If text is still visible after one pass, open `scripts/retrim-icons.mjs` and increase `TRIM_FRACTION`.

### All npm icon scripts

| Script | What it does |
|---|---|
| `npm run icons:crop` | Crop batch grid images into individual icons |
| `npm run icons:remove-bg-api` | Remove backgrounds via remove.bg API (first 50) |
| `npm run icons:remove-bg` | Flood-fill background removal (remaining icons) |
| `npm run icons:retrim -- <names>` | Re-trim specific icons that still show text |
