-- ============================================================
-- sowsmart — Supabase schema + seed
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Table
create table plants (
  id                text primary key,
  name              text not null,
  emoji             text,
  plants_per_square integer,
  companions        text[] default '{}',
  competitors       text[] default '{}',
  incompatible      text[] default '{}',
  notes             text,
  timing            jsonb
);

-- Row Level Security (public read, no auth required)
alter table plants enable row level security;

create policy "Plants are publicly readable"
  on plants for select using (true);

-- ============================================================
-- Seed — 25 plants
-- ============================================================

insert into plants (id, name, emoji, plants_per_square, companions, competitors, incompatible, notes, timing) values

('tomato', 'Tomato', '🍅', 1,
  array['basil','carrot','marigold','nasturtium','chamomile'],
  array['potato','corn'],
  array['fennel'],
  'Needs full sun. Stake or cage when planting.',
  '{"cold":{"indoor_start":"Feb–Mar","transplant":"Jun–Jul","direct_sow":null,"harvest":"Aug–Oct"},"temperate":{"indoor_start":"Feb–Apr","transplant":"May–Jun","direct_sow":null,"harvest":"Jul–Sep"},"warm":{"indoor_start":"Jan–Mar","transplant":"Mar–May","direct_sow":null,"harvest":"Jun–Sep"},"hot":{"indoor_start":null,"transplant":"Feb–Apr","direct_sow":"Jan–Mar","harvest":"Apr–Jul"}}'
),

('basil', 'Basil', '🌿', 4,
  array['tomato','pepper','marigold'],
  array[]::text[],
  array['fennel'],
  'Repels aphids and whiteflies. Pinch flowers to extend harvest.',
  '{"cold":{"indoor_start":"Apr–May","transplant":"Jun","direct_sow":null,"harvest":"Jul–Sep"},"temperate":{"indoor_start":"Mar–Apr","transplant":"May–Jun","direct_sow":"May–Jun","harvest":"Jun–Sep"},"warm":{"indoor_start":"Feb–Mar","transplant":"Apr–May","direct_sow":"Apr–May","harvest":"May–Sep"},"hot":{"indoor_start":null,"transplant":"Mar–Apr","direct_sow":"Mar–Apr","harvest":"Apr–Oct"}}'
),

('carrot', 'Carrot', '🥕', 16,
  array['tomato','lettuce','onion','pea','radish','chamomile'],
  array[]::text[],
  array['dill'],
  'Needs loose, deep soil. Thin to 3 inches apart.',
  '{"cold":{"indoor_start":null,"transplant":null,"direct_sow":"May–Jun","harvest":"Aug–Oct"},"temperate":{"indoor_start":null,"transplant":null,"direct_sow":"Apr–Jun","harvest":"Jul–Sep"},"warm":{"indoor_start":null,"transplant":null,"direct_sow":"Feb–Apr","harvest":"May–Jul"},"hot":{"indoor_start":null,"transplant":null,"direct_sow":"Jan–Mar","harvest":"Mar–Jun"}}'
),

('lettuce', 'Lettuce', '🥬', 4,
  array['carrot','radish','strawberry','onion','spinach','chamomile'],
  array[]::text[],
  array[]::text[],
  'Bolt-prone in heat. Shade from taller plants in summer.',
  '{"cold":{"indoor_start":"Mar–Apr","transplant":"May–Jun","direct_sow":"May","harvest":"Jun–Sep"},"temperate":{"indoor_start":"Feb–Mar","transplant":"Apr–May","direct_sow":"Apr–May","harvest":"May–Jul"},"warm":{"indoor_start":"Jan–Feb","transplant":"Mar–Apr","direct_sow":"Mar–Apr","harvest":"Apr–Jun"},"hot":{"indoor_start":"Oct–Nov","transplant":"Nov–Dec","direct_sow":"Oct–Nov","harvest":"Dec–Mar"}}'
),

('radish', 'Radish', '🔴', 16,
  array['carrot','lettuce','spinach','cucumber','pea'],
  array[]::text[],
  array[]::text[],
  'Fast grower — great for filling gaps and marking slow-germinating rows.',
  '{"cold":{"indoor_start":null,"transplant":null,"direct_sow":"May–Jun","harvest":"Jun–Jul"},"temperate":{"indoor_start":null,"transplant":null,"direct_sow":"Mar–May","harvest":"Apr–Jun"},"warm":{"indoor_start":null,"transplant":null,"direct_sow":"Feb–Apr","harvest":"Mar–May"},"hot":{"indoor_start":null,"transplant":null,"direct_sow":"Jan–Mar","harvest":"Feb–Apr"}}'
),

('spinach', 'Spinach', '🍃', 9,
  array['lettuce','radish','strawberry','pea'],
  array[]::text[],
  array[]::text[],
  'Cool-season crop. Bolts quickly in heat; plant in spring or fall.',
  '{"cold":{"indoor_start":null,"transplant":null,"direct_sow":"May–Jun","harvest":"Jun–Aug"},"temperate":{"indoor_start":null,"transplant":null,"direct_sow":"Mar–May","harvest":"Apr–Jun"},"warm":{"indoor_start":null,"transplant":null,"direct_sow":"Feb–Mar","harvest":"Mar–May"},"hot":{"indoor_start":null,"transplant":null,"direct_sow":"Oct–Jan","harvest":"Nov–Mar"}}'
),

('cucumber', 'Cucumber', '🥒', 1,
  array['radish','nasturtium','sunflower','dill'],
  array[]::text[],
  array['potato'],
  'Climbs if given a trellis. Keeps fruit clean and saves space.',
  '{"cold":{"indoor_start":"Apr–May","transplant":"Jun","direct_sow":null,"harvest":"Aug–Sep"},"temperate":{"indoor_start":"Mar–Apr","transplant":"May–Jun","direct_sow":"May–Jun","harvest":"Jul–Sep"},"warm":{"indoor_start":"Feb–Mar","transplant":"Apr","direct_sow":"Apr–May","harvest":"Jun–Aug"},"hot":{"indoor_start":null,"transplant":"Mar","direct_sow":"Mar–Apr","harvest":"May–Jul"}}'
),

('zucchini', 'Zucchini', '🥦', 1,
  array['nasturtium','corn','pea'],
  array[]::text[],
  array[]::text[],
  'One plant produces prolifically — plan space accordingly.',
  '{"cold":{"indoor_start":"Apr–May","transplant":"Jun","direct_sow":null,"harvest":"Aug–Sep"},"temperate":{"indoor_start":"Mar–Apr","transplant":"May","direct_sow":"May","harvest":"Jul–Sep"},"warm":{"indoor_start":"Feb–Mar","transplant":"Apr","direct_sow":"Apr","harvest":"Jun–Aug"},"hot":{"indoor_start":null,"transplant":"Mar","direct_sow":"Mar–Apr","harvest":"May–Jul"}}'
),

('pea', 'Pea', '🫛', 8,
  array['carrot','radish','spinach','lettuce','zucchini','corn'],
  array[]::text[],
  array['onion','garlic'],
  'Fixes nitrogen. Supports needed for climbing varieties.',
  '{"cold":{"indoor_start":null,"transplant":null,"direct_sow":"May","harvest":"Jul–Aug"},"temperate":{"indoor_start":null,"transplant":null,"direct_sow":"Mar–Apr","harvest":"Jun–Jul"},"warm":{"indoor_start":null,"transplant":null,"direct_sow":"Feb–Mar","harvest":"Apr–Jun"},"hot":{"indoor_start":null,"transplant":null,"direct_sow":"Oct–Jan","harvest":"Dec–Mar"}}'
),

('bush_bean', 'Bush Bean', '🫘', 9,
  array['carrot','cucumber','strawberry','corn'],
  array['onion','fennel'],
  array[]::text[],
  'Do not soak seeds before planting. Direct sow after last frost.',
  '{"cold":{"indoor_start":null,"transplant":null,"direct_sow":"Jun","harvest":"Aug–Sep"},"temperate":{"indoor_start":null,"transplant":null,"direct_sow":"May–Jun","harvest":"Jul–Aug"},"warm":{"indoor_start":null,"transplant":null,"direct_sow":"Apr–May","harvest":"Jun–Jul"},"hot":{"indoor_start":null,"transplant":null,"direct_sow":"Mar–Apr","harvest":"May–Jun"}}'
),

('onion', 'Onion', '🧅', 16,
  array['carrot','lettuce','tomato','chamomile'],
  array['bush_bean'],
  array['pea'],
  'Plant sets or transplants in early spring. Deters many pests.',
  '{"cold":{"indoor_start":"Jan–Feb","transplant":"May","direct_sow":null,"harvest":"Aug–Sep"},"temperate":{"indoor_start":"Jan–Feb","transplant":"Mar–Apr","direct_sow":"Mar–Apr","harvest":"Jul–Aug"},"warm":{"indoor_start":"Nov–Dec","transplant":"Feb–Mar","direct_sow":"Feb–Mar","harvest":"May–Jul"},"hot":{"indoor_start":"Oct–Nov","transplant":"Dec–Jan","direct_sow":"Dec–Jan","harvest":"Mar–May"}}'
),

('garlic', 'Garlic', '🧄', 9,
  array['tomato','carrot','strawberry','lettuce'],
  array[]::text[],
  array['pea'],
  'Plant cloves in fall for best results. Harvest when lower leaves yellow.',
  '{"cold":{"indoor_start":null,"transplant":null,"direct_sow":"Sep–Oct","harvest":"Jul–Aug"},"temperate":{"indoor_start":null,"transplant":null,"direct_sow":"Oct–Nov","harvest":"Jun–Jul"},"warm":{"indoor_start":null,"transplant":null,"direct_sow":"Oct–Dec","harvest":"May–Jun"},"hot":{"indoor_start":null,"transplant":null,"direct_sow":"Nov–Jan","harvest":"Apr–May"}}'
),

('pepper', 'Pepper', '🌶️', 1,
  array['basil','carrot','tomato','marigold'],
  array[]::text[],
  array['fennel'],
  'Needs warm soil. Start indoors 8–10 weeks before last frost.',
  '{"cold":{"indoor_start":"Feb–Mar","transplant":"Jun","direct_sow":null,"harvest":"Aug–Oct"},"temperate":{"indoor_start":"Feb–Mar","transplant":"May–Jun","direct_sow":null,"harvest":"Jul–Sep"},"warm":{"indoor_start":"Jan–Feb","transplant":"Apr","direct_sow":null,"harvest":"Jun–Sep"},"hot":{"indoor_start":"Nov–Dec","transplant":"Feb–Mar","direct_sow":null,"harvest":"Apr–Jul"}}'
),

('broccoli', 'Broccoli', '🥦', 1,
  array['chamomile','dill','nasturtium','onion'],
  array['tomato','strawberry'],
  array[]::text[],
  'Cool-season brassica. Side-dress with nitrogen fertiliser.',
  '{"cold":{"indoor_start":"Mar–Apr","transplant":"May–Jun","direct_sow":null,"harvest":"Aug–Oct"},"temperate":{"indoor_start":"Feb–Mar","transplant":"Apr–May","direct_sow":null,"harvest":"Jun–Aug"},"warm":{"indoor_start":"Aug–Sep","transplant":"Oct","direct_sow":null,"harvest":"Dec–Feb"},"hot":{"indoor_start":"Aug–Sep","transplant":"Oct–Nov","direct_sow":null,"harvest":"Jan–Mar"}}'
),

('cauliflower', 'Cauliflower', '🤍', 1,
  array['dill','onion','chamomile'],
  array['tomato','strawberry'],
  array[]::text[],
  'Blanch heads by tying leaves over the curd when it is golf-ball size.',
  '{"cold":{"indoor_start":"Mar–Apr","transplant":"May–Jun","direct_sow":null,"harvest":"Aug–Oct"},"temperate":{"indoor_start":"Feb–Mar","transplant":"Apr–May","direct_sow":null,"harvest":"Jun–Aug"},"warm":{"indoor_start":"Aug–Sep","transplant":"Oct","direct_sow":null,"harvest":"Dec–Feb"},"hot":{"indoor_start":"Aug–Sep","transplant":"Oct–Nov","direct_sow":null,"harvest":"Jan–Mar"}}'
),

('kale', 'Kale', '🥬', 1,
  array['dill','chamomile','nasturtium'],
  array['tomato'],
  array[]::text[],
  'Very cold-hardy. Flavour improves after frost.',
  '{"cold":{"indoor_start":"Mar–Apr","transplant":"May","direct_sow":"Jul–Aug","harvest":"Aug–Nov"},"temperate":{"indoor_start":"Feb–Mar","transplant":"Apr","direct_sow":"Jul","harvest":"Jun–Nov"},"warm":{"indoor_start":"Aug–Sep","transplant":"Sep–Oct","direct_sow":"Sep–Oct","harvest":"Nov–Mar"},"hot":{"indoor_start":"Sep–Oct","transplant":"Oct–Nov","direct_sow":"Oct–Nov","harvest":"Dec–Apr"}}'
),

('strawberry', 'Strawberry', '🍓', 4,
  array['lettuce','spinach','garlic','bush_bean'],
  array['broccoli','cauliflower'],
  array['fennel'],
  'Perennial. Runners spread aggressively — remove or redirect.',
  '{"cold":{"indoor_start":null,"transplant":"May","direct_sow":null,"harvest":"Jun–Jul"},"temperate":{"indoor_start":null,"transplant":"Apr","direct_sow":null,"harvest":"May–Jul"},"warm":{"indoor_start":null,"transplant":"Mar","direct_sow":null,"harvest":"Apr–Jun"},"hot":{"indoor_start":null,"transplant":"Oct–Nov","direct_sow":null,"harvest":"Feb–Apr"}}'
),

('potato', 'Potato', '🥔', 1,
  array['corn','pea','nasturtium','chamomile'],
  array['tomato'],
  array['cucumber'],
  'Plant certified seed potatoes. Hill soil up as plants grow.',
  '{"cold":{"indoor_start":null,"transplant":null,"direct_sow":"May–Jun","harvest":"Sep–Oct"},"temperate":{"indoor_start":null,"transplant":null,"direct_sow":"Mar–Apr","harvest":"Jul–Aug"},"warm":{"indoor_start":null,"transplant":null,"direct_sow":"Feb–Mar","harvest":"Jun–Jul"},"hot":{"indoor_start":null,"transplant":null,"direct_sow":"Jan–Feb","harvest":"Apr–May"}}'
),

('corn', 'Corn', '🌽', 1,
  array['potato','pea','zucchini','cucumber','sunflower'],
  array['tomato'],
  array[]::text[],
  'Wind-pollinated — plant in blocks, not rows, for best pollination.',
  '{"cold":{"indoor_start":null,"transplant":null,"direct_sow":"Jun","harvest":"Sep–Oct"},"temperate":{"indoor_start":null,"transplant":null,"direct_sow":"May–Jun","harvest":"Aug–Sep"},"warm":{"indoor_start":null,"transplant":null,"direct_sow":"Apr–May","harvest":"Jul–Aug"},"hot":{"indoor_start":null,"transplant":null,"direct_sow":"Mar–Apr","harvest":"Jun–Jul"}}'
),

('sunflower', 'Sunflower', '🌻', 1,
  array['cucumber','corn','nasturtium'],
  array[]::text[],
  array['potato'],
  'Attracts pollinators. Provides shade for heat-sensitive plants.',
  '{"cold":{"indoor_start":null,"transplant":null,"direct_sow":"Jun","harvest":"Sep–Oct"},"temperate":{"indoor_start":null,"transplant":null,"direct_sow":"May","harvest":"Aug–Sep"},"warm":{"indoor_start":null,"transplant":null,"direct_sow":"Apr","harvest":"Jul–Aug"},"hot":{"indoor_start":null,"transplant":null,"direct_sow":"Mar–Apr","harvest":"Jun–Aug"}}'
),

('fennel', 'Fennel', '🌾', 1,
  array['dill'],
  array['bush_bean'],
  array['tomato','pepper','basil','strawberry'],
  'Allelopathic — inhibits most vegetables. Best grown in its own container or bed edge.',
  '{"cold":{"indoor_start":"Apr","transplant":"Jun","direct_sow":null,"harvest":"Sep–Oct"},"temperate":{"indoor_start":"Mar","transplant":"May","direct_sow":"Apr–May","harvest":"Aug–Sep"},"warm":{"indoor_start":"Feb","transplant":"Apr","direct_sow":"Mar–Apr","harvest":"Jul–Aug"},"hot":{"indoor_start":null,"transplant":"Mar","direct_sow":"Feb–Mar","harvest":"May–Jul"}}'
),

('dill', 'Dill', '🌿', 4,
  array['cucumber','fennel','broccoli','cauliflower','kale'],
  array[]::text[],
  array['carrot'],
  'Attracts beneficial wasps. Allow some plants to flower.',
  '{"cold":{"indoor_start":null,"transplant":null,"direct_sow":"Jun","harvest":"Jul–Sep"},"temperate":{"indoor_start":null,"transplant":null,"direct_sow":"Apr–Jun","harvest":"Jun–Aug"},"warm":{"indoor_start":null,"transplant":null,"direct_sow":"Mar–May","harvest":"May–Jul"},"hot":{"indoor_start":null,"transplant":null,"direct_sow":"Feb–Mar","harvest":"Apr–Jun"}}'
),

('marigold', 'Marigold', '🌼', 4,
  array['tomato','basil','pepper','carrot','cucumber'],
  array[]::text[],
  array[]::text[],
  'Natural pest deterrent. Deters nematodes and aphids.',
  '{"cold":{"indoor_start":"Mar–Apr","transplant":"Jun","direct_sow":null,"harvest":null},"temperate":{"indoor_start":"Feb–Mar","transplant":"May","direct_sow":"May","harvest":null},"warm":{"indoor_start":"Jan–Feb","transplant":"Apr","direct_sow":"Apr","harvest":null},"hot":{"indoor_start":null,"transplant":"Mar","direct_sow":"Mar","harvest":null}}'
),

('nasturtium', 'Nasturtium', '🌸', 4,
  array['tomato','cucumber','zucchini','potato','broccoli','sunflower'],
  array[]::text[],
  array[]::text[],
  'Edible flowers and leaves. Sacrificial trap crop for aphids.',
  '{"cold":{"indoor_start":null,"transplant":null,"direct_sow":"Jun","harvest":"Jul–Sep"},"temperate":{"indoor_start":null,"transplant":null,"direct_sow":"Apr–May","harvest":"Jun–Sep"},"warm":{"indoor_start":null,"transplant":null,"direct_sow":"Mar–Apr","harvest":"May–Aug"},"hot":{"indoor_start":null,"transplant":null,"direct_sow":"Feb–Mar","harvest":"Apr–Jun"}}'
),

('chamomile', 'Chamomile', '🌼', 4,
  array['tomato','carrot','lettuce','onion','broccoli','cauliflower','kale','potato'],
  array[]::text[],
  array[]::text[],
  'Accumulates calcium and potassium. Attracts beneficial insects.',
  '{"cold":{"indoor_start":"Mar–Apr","transplant":"May–Jun","direct_sow":"May","harvest":"Jul–Sep"},"temperate":{"indoor_start":"Feb–Mar","transplant":"Apr–May","direct_sow":"Apr","harvest":"Jun–Aug"},"warm":{"indoor_start":"Jan–Feb","transplant":"Mar–Apr","direct_sow":"Mar","harvest":"May–Jul"},"hot":{"indoor_start":null,"transplant":"Feb–Mar","direct_sow":"Feb","harvest":"Apr–Jun"}}'
);
