# SowSmart Icon Generation Guide

## Chosen Style: Vintage Seed Packet

Thick outlines, limited warm color palette (2-3 colors), 1930s-1940s
botanical print feel, hand-engraved quality, slightly aged warm tones.

---

## Master Style Description

Use this exact style description in every prompt to keep icons consistent:

```
Vintage seed packet illustration style. Thick clean outlines, limited warm
color palette of 2-3 colors, 1930s-1940s botanical print feel, slightly
hand-engraved quality, aged warm tones. Simple and iconic, no decorative
patterns on the vegetable itself. Transparent background. Square format.
```

---

## Batch Generation Prompt Template

Replace [VEG1], [VEG2], [VEG3], [VEG4] with your vegetables.
Paste into ChatGPT each time you need a new batch.

```
Create a 2x2 grid of vegetable icons. Each icon should be drawn in the same
consistent style: Vintage seed packet illustration style. Thick clean outlines,
limited warm color palette of 2-3 colors, 1930s-1940s botanical print feel,
slightly hand-engraved quality, aged warm tones. Simple and iconic, no
decorative patterns on the vegetable itself. Transparent background. Square
format. Each icon the same size.

The 4 vegetables are:
1. [VEG1]
2. [VEG2]
3. [VEG3]
4. [VEG4]

Label each cell with the vegetable name. Each icon must have a transparent
background. Display them on a white grid background so they are visible,
but the icons themselves must have no background fill.
```

---

## Full Icon List (58 total)

### Batch 1
1. Artichoke
2. Asparagus
3. Avocado
4. Bamboo Sprouts

### Batch 2
5. Beans
6. Beetroot
7. Broccoli
8. Brussel Sprouts

### Batch 3
9. Cabbage
10. Carrot ✓ (already generated - use as style reference)
11. Cauliflower
12. Celery

### Batch 4
13. Cherry Tomatoes
14. Chili Pepper
15. Chinese Cabbage
16. Chives

### Batch 5
17. Corn
18. Cucumber
19. Daikon
20. Eggplant

### Batch 6
21. Fennel
22. Garlic
23. Ginger
24. Green Beans

### Batch 7
25. Horseradish
26. Kale
27. Kohlrabi
28. Leek

### Batch 8
29. Lettuce
30. Mushroom
31. Olives
32. Onion

### Batch 9
33. Paprika
34. Parsley Root
35. Parsnip
36. Peas

### Batch 10
37. Potato
38. Pumpkin (round orange)
39. Pumpkin (elongated / heirloom)
40. Radish

### Batch 11
41. Soybeans
42. Spinach
43. Spring Onion
44. Squash

### Batch 12
45. Sweet Potato
46. Tomato
47. Turnip
48. Wasabi

### Batch 13
49. Watercress
50. Zucchini
51. Strawberry
52. Bell Pepper

### Batch 14
53. Basil
54. Dill
55. Marigold
56. Nasturtium

### Batch 15
57. Chamomile
58. Sunflower

---

## File Naming Convention

Save each exported icon as a lowercase PNG matching the plant ID in plants.js.
Store in: `public/icons/`

Examples:
- carrot.png
- cherry_tomatoes.png
- brussel_sprouts.png
- bell_pepper.png

---

## Tips for Consistency

- Always include the full master style description in every prompt
- If a batch looks off, paste in the carrot as a reference:
  "Match the style of this carrot icon: [attach carrot image]"
- Request transparent background so icons work on any background color
- If ChatGPT drifts in style, start a fresh chat and re-paste the full prompt
