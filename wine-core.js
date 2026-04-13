// ═══════════════════════════════════════════════════════════════════
//  wine-core.js — pure logic & data layer for Vintner's Log
//  Shared between wine.html (the app) and wine-tests.html (the tests)
//  No DOM dependencies — safe to unit test directly.
// ═══════════════════════════════════════════════════════════════════

// ─── Constants ──────────────────────────────────────────────────────
var STORAGE_KEY = 'vintners_log_v1';

var STAGES = [
  { id: 'fruit_selection',        label: 'Fruit Selection',   icon: '🍒', group: 'planning' },
  { id: 'methodology',            label: 'Methodology',       icon: '📋', group: 'planning' },
  { id: 'recipe',                 label: 'Recipe',            icon: '🧪', group: 'planning' },
  { id: 'preparation',            label: 'Preparation',       icon: '⚗️',  group: 'preparation' },
  { id: 'primary_fermentation',   label: 'Primary Ferm.',     icon: '🫧', group: 'fermentation' },
  { id: 'secondary_fermentation', label: 'Secondary Ferm.',   icon: '🔬', group: 'fermentation' },
  { id: 'clarification',          label: 'Clarification',     icon: '✨', group: 'fermentation' },
  { id: 'bottling',               label: 'Bottling',          icon: '🍾', group: 'aging' },
  { id: 'aging',                  label: 'Aging',             icon: '🪵', group: 'aging' },
];

var STAGE_IDS = STAGES.map(s => s.id);

var GROUP_CLASS = {
  planning:     'stage-planning',
  preparation:  'stage-preparation',
  fermentation: 'stage-fermentation',
  aging:        'stage-aging',
  complete:     'stage-complete',
};

// ─── Data Layer ──────────────────────────────────────────────────────
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { batches: [] };
  } catch { return { batches: [] }; }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getData() { return loadData(); }

function seedCherryBatch() {
  const data = loadData();
  const already = data.batches.find(b => b.id === 'cherry-2026-seed');
  if (already) return;

  const cherryBatch = {
    id: 'cherry-2026-seed',
    name: 'Backyard Sweet Cherry 2026',
    fruit: 'Sweet Cherry',
    year: 2026,
    gallons: 3,
    source: 'Home Garden',
    harvest_date: '2026-06-20',
    blossom_date: '2026-04-11',
    current_stage: 'fruit_selection',
    completed_stages: [],
    created: new Date().toISOString(),
    notes: 'Two sweet cherry trees in the backyard blossomed April 11, 2026. Estimated harvest late June. Planning a 3-gallon batch.',
    stages: {}
  };

  data.batches.unshift(cherryBatch);
  saveData(data);
}

// ─── Utilities ───────────────────────────────────────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(isoDate) {
  if (!isoDate) return null;
  const target = new Date(isoDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / 86400000);
}

function stageIndex(stageId) {
  return STAGE_IDS.indexOf(stageId);
}

function getStageInfo(stageId) {
  return STAGES.find(s => s.id === stageId) || STAGES[0];
}

function batchProgress(batch) {
  const idx = stageIndex(batch.current_stage);
  return { current: idx, total: STAGES.length };
}

function batchGroupClass(batch) {
  if (batch.completed_stages?.length === STAGES.length) return 'stage-complete';
  const info = getStageInfo(batch.current_stage);
  return GROUP_CLASS[info.group] || 'stage-planning';
}

// ─── HTML Escape ──────────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Cherry Recipe Defaults ──────────────────────────────────────────
// Extracted so tests can verify scaling without parsing the stage renderer.
function cherryRecipeDefaults(gallons) {
  return [
    { name: 'Sweet Cherries',          amount: (6.5 * gallons).toFixed(1), unit: 'lbs' },
    { name: 'Granulated Sugar',        amount: (2.0 * gallons).toFixed(1), unit: 'lbs' },
    { name: 'Water',                   amount: (0.6 * gallons).toFixed(2), unit: 'gallons' },
    { name: 'Pectic Enzyme',           amount: (0.5 * gallons).toFixed(1), unit: 'tsp' },
    { name: 'Acid Blend',              amount: (0.5 * gallons).toFixed(1), unit: 'tsp' },
    { name: 'Yeast Nutrient',          amount: (1.0 * gallons).toFixed(1), unit: 'tsp' },
    { name: 'Potassium Metabisulfite', amount: (0.25 * gallons).toFixed(2), unit: 'tsp' },
  ];
}

// ─── ABV Estimator ────────────────────────────────────────────────────
function estimateAbv(og, fg) {
  return parseFloat(((og - fg) * 131.25).toFixed(1));
}

// ═══════════════════════════════════════════════════════════════════
//  LIBRARY — Fruits, Fermentation Types, Yeast, Recipes
// ═══════════════════════════════════════════════════════════════════

var FRUIT_LIBRARY = [
  { id:'sweet_cherry', name:'Sweet Cherry', varieties:['Bing','Rainier','Chelan','Lapins','Backyard Sweet'],
    season:'June–July', lbs_per_gallon:{min:5,ideal:6.5,max:8}, brix_typical:{min:18,max:24},
    ph_typical:{min:3.3,max:3.8}, acid:'low', sugar:'high',
    notes:'High sugar, mild acid. Add acid blend. Produces rich, fruit-forward wines. Color deepens with skin contact.',
    tags:['stone fruit','low acid','high sugar'], recipe_id:'stone_fruit' },

  { id:'sour_cherry', name:'Sour / Tart Cherry', varieties:['Montmorency','Morello','Balaton'],
    season:'July', lbs_per_gallon:{min:4,ideal:6,max:8}, brix_typical:{min:14,max:18},
    ph_typical:{min:3.0,max:3.4}, acid:'high', sugar:'medium',
    notes:'Bright acidity, complex flavor. May need sugar addition. Outstanding dessert wine potential.',
    tags:['stone fruit','high acid','tart'], recipe_id:'stone_fruit' },

  { id:'concord_grape', name:'Concord Grape', varieties:['Concord','Niagara','Catawba'],
    season:'Sept–Oct', lbs_per_gallon:{min:6,ideal:8,max:10}, brix_typical:{min:14,max:18},
    ph_typical:{min:3.0,max:3.5}, acid:'medium', sugar:'medium',
    notes:'Classic foxy grape character. Good tannin structure. Lower brix than wine grapes — chaptalization often needed.',
    tags:['grape','medium acid','foxy'], recipe_id:'grape' },

  { id:'blueberry', name:'Blueberry', varieties:['Highbush','Lowbush','Rabbiteye','Wild'],
    season:'July–Aug', lbs_per_gallon:{min:5,ideal:7,max:9}, brix_typical:{min:12,max:16},
    ph_typical:{min:3.1,max:3.6}, acid:'medium', sugar:'low-medium',
    notes:'Requires pectic enzyme — very pectin-rich. Deep color. Add sugar to reach OG. Pairs well with oak.',
    tags:['berry','medium acid','deep color'], recipe_id:'berry' },

  { id:'blackberry', name:'Blackberry', varieties:['Marionberry','Boysenberry','Wild Blackberry','Loganberry'],
    season:'July–Sept', lbs_per_gallon:{min:4,ideal:6,max:8}, brix_typical:{min:10,max:15},
    ph_typical:{min:3.0,max:3.5}, acid:'medium-high', sugar:'low-medium',
    notes:'Rich color and tannin. Earthy, bramble notes. Freeze first to maximize juice extraction.',
    tags:['berry','medium-high acid','tannic'], recipe_id:'berry' },

  { id:'raspberry', name:'Raspberry', varieties:['Heritage','Tulameen','Wild Red','Black Raspberry'],
    season:'June–Aug', lbs_per_gallon:{min:4,ideal:6,max:8}, brix_typical:{min:10,max:14},
    ph_typical:{min:2.9,max:3.4}, acid:'high', sugar:'low',
    notes:'Vibrant color and aroma. High acid — sugar addition required. Pairs beautifully with 71B yeast.',
    tags:['berry','high acid','aromatic'], recipe_id:'berry' },

  { id:'peach', name:'Peach / Nectarine', varieties:['Elberta','Reliance','Contender','Nectarine'],
    season:'July–Sept', lbs_per_gallon:{min:5,ideal:7,max:9}, brix_typical:{min:10,max:16},
    ph_typical:{min:3.3,max:4.0}, acid:'low', sugar:'medium',
    notes:'Delicate aroma — avoid high temps during fermentation. Use Côte des Blancs yeast. Pectic enzyme essential.',
    tags:['stone fruit','low acid','delicate'], recipe_id:'stone_fruit' },

  { id:'apple', name:'Apple / Crabapple', varieties:['Gravenstein','Honeycrisp','Crabapple','Fuji','Wild Apple'],
    season:'Aug–Oct', lbs_per_gallon:{min:8,ideal:12,max:16}, brix_typical:{min:10,max:14},
    ph_typical:{min:3.2,max:3.8}, acid:'medium', sugar:'medium',
    notes:'Best pressed into juice. Produces a cider-wine hybrid. MLF optional for softening. Versatile base for blends.',
    tags:['pome fruit','medium acid','crisp'], recipe_id:'apple' },

  { id:'elderberry', name:'Elderberry', varieties:['American','European','Sambucus'],
    season:'Aug–Sept', lbs_per_gallon:{min:2,ideal:3,max:4}, brix_typical:{min:10,max:14},
    ph_typical:{min:3.4,max:4.0}, acid:'medium', sugar:'low',
    notes:'Very concentrated — use less fruit per gallon. Extremely deep color and tannin. Must be fully ripe; raw berries toxic.',
    tags:['berry','medium acid','high tannin','concentrated'], recipe_id:'berry' },

  { id:'plum', name:'Plum / Damson', varieties:['Italian Prune','Damson','Greengage','Santa Rosa','Wild Plum'],
    season:'Aug–Sept', lbs_per_gallon:{min:5,ideal:7,max:9}, brix_typical:{min:14,max:20},
    ph_typical:{min:3.0,max:3.5}, acid:'medium', sugar:'medium-high',
    notes:'Rich stone-fruit character with good tannin. Remove pits before fermenting. Pairs well with RC212.',
    tags:['stone fruit','medium acid','rich'], recipe_id:'stone_fruit' },
];

var FERMENTATION_TYPES = [
  { id:'traditional', name:'Traditional', icon:'🍶',
    description:'Controlled fermentation with commercial yeast at stable room temperature. Predictable, clean results.',
    so2_use:true, timeline_days:{ preparation:2, primary:{min:7,max:14}, secondary:{min:30,max:60}, clarification:{min:14,max:30}, aging:{min:90,max:180} },
    notes:'Best for beginners. Most predictable flavor profile. Wide yeast selection available.',
    recommended_for:['sweet_cherry','blueberry','peach','plum'] },

  { id:'wild', name:'Wild / Natural', icon:'🌿',
    description:'Fermentation driven by native yeasts on the fruit skins and in the environment. Unpredictable but complex.',
    so2_use:false, timeline_days:{ preparation:3, primary:{min:14,max:28}, secondary:{min:45,max:90}, clarification:{min:21,max:45}, aging:{min:180,max:365} },
    notes:'Higher risk of off-flavors. Requires careful monitoring. Produces terroir-driven, complex wines.',
    recommended_for:['concord_grape','apple','elderberry'] },

  { id:'cold', name:'Cold Fermentation', icon:'❄️',
    description:'Low-temperature fermentation (55–65°F) to preserve delicate aromatics. Slower but fragrant results.',
    so2_use:true, timeline_days:{ preparation:2, primary:{min:14,max:21}, secondary:{min:45,max:90}, clarification:{min:14,max:21}, aging:{min:60,max:120} },
    notes:'Ideal for aromatic fruits like peach, raspberry, and elderflower. Needs temperature control.',
    recommended_for:['peach','raspberry','elderberry'] },

  { id:'quick', name:'Quick / Early Drinking', icon:'⚡',
    description:'Optimized for fast turnaround. Commercial yeast, minimal aging. Ready in 8–12 weeks.',
    so2_use:true, timeline_days:{ preparation:1, primary:{min:7,max:10}, secondary:{min:14,max:21}, clarification:{min:7,max:14}, aging:{min:30,max:60} },
    notes:'Sacrifices complexity for speed. Great for high-production summers with lots of fruit.',
    recommended_for:['blueberry','blackberry','concord_grape'] },

  { id:'semi_carbonic', name:'Semi-Carbonic', icon:'🫧',
    description:'Whole-fruit fermentation in CO₂-rich environment before pressing. Produces bright, fruity, low-tannin wines.',
    so2_use:false, timeline_days:{ preparation:3, primary:{min:5,max:10}, secondary:{min:21,max:45}, clarification:{min:14,max:21}, aging:{min:30,max:90} },
    notes:'Inspired by Beaujolais. Works best with whole intact fruit. Excellent for cherry.',
    recommended_for:['sweet_cherry','sour_cherry','plum'] },
];

var YEAST_LIBRARY = [
  { id:'71b', name:'Lalvin 71B', brand:'Lalvin', type:'commercial',
    temp_range:'59–86°F', alcohol_tolerance:'14%',
    character:'Fruity, aromatic, partially reduces malic acid (20–40%)',
    best_for:['sweet_cherry','sour_cherry','raspberry','peach','plum'],
    profile:'Produces fruity, smooth wines with reduced tartness. Enhances red fruit and floral notes.',
    notes:'Top choice for fruit wines. Reduces harsh malic acid without full MLF.' },

  { id:'ec1118', name:'Lalvin EC-1118', brand:'Lalvin', type:'commercial',
    temp_range:'50–86°F', alcohol_tolerance:'18%',
    character:'Neutral, clean, very vigorous',
    best_for:['concord_grape','elderberry','high-sugar musts','stuck fermentation rescue'],
    profile:'Workhorse champagne yeast. Ferments completely dry. Very competitive — suppresses wild yeasts.',
    notes:'Use when you need reliable fermentation to dryness. Not ideal for delicate aromatics.' },

  { id:'rc212', name:'Lalvin RC212', brand:'Lalvin', type:'commercial',
    temp_range:'60–86°F', alcohol_tolerance:'14%',
    character:'Spicy, structured, enhances color extraction',
    best_for:['concord_grape','blackberry','elderberry','plum'],
    profile:'Burgundy-style yeast. Preserves anthocyanins for deep color. Adds spice and structure.',
    notes:'Excellent for full-bodied, tannic fruit wines. Needs adequate nutrients.' },

  { id:'cote_des_blancs', name:'Red Star Côte des Blancs', brand:'Red Star', type:'commercial',
    temp_range:'50–86°F', alcohol_tolerance:'13%',
    character:'Fruity, low-foaming, emphasizes delicate aromatics',
    best_for:['peach','raspberry','apple','elderberry'],
    profile:'Slow, steady fermentation preserving delicate fruit esters. Slightly sweet finish.',
    notes:'Best used below 65°F for maximum aroma retention. May not fully ferment high-sugar musts.' },

  { id:'premier_classique', name:'Red Star Premier Classique', brand:'Red Star', type:'commercial',
    temp_range:'59–86°F', alcohol_tolerance:'13%',
    character:'Clean, reliable, versatile',
    best_for:['sweet_cherry','blueberry','apple','concord_grape'],
    profile:'All-purpose wine yeast. Reliable fermentation with clean flavor profile.',
    notes:'Good backup yeast. Works across most fruit types.' },

  { id:'d47', name:'Lalvin D47', brand:'Lalvin', type:'commercial',
    temp_range:'50–65°F', alcohol_tolerance:'14%',
    character:'Floral, spicy, complex aromatics',
    best_for:['apple','peach','elderberry'],
    profile:'Produces floral wines with honeyed notes. Must ferment cool — above 65°F produces off-flavors.',
    notes:'Cold-fermentation specialist. Excellent for aromatic styles.' },

  { id:'k1v1116', name:'Lalvin K1V-1116', brand:'Lalvin', type:'commercial',
    temp_range:'50–95°F', alcohol_tolerance:'18%',
    character:'Clean, fruity, enhances varietal character',
    best_for:['raspberry','blackberry','blueberry','sour_cherry'],
    profile:'Montpellier strain — fresh, fruity wines with excellent esters. Very temperature tolerant.',
    notes:'Great for berry wines. Produces fresh, clean fruit character.' },

  { id:'wild_native', name:'Wild / Native Yeast', brand:'Ambient', type:'wild',
    temp_range:'60–80°F', alcohol_tolerance:'variable (8–14%)',
    character:'Complex, unpredictable, terroir-driven',
    best_for:['concord_grape','apple','elderberry'],
    profile:'Uses yeasts naturally present on fruit skins and in the cellar. Unique, site-specific flavors.',
    notes:'Higher risk — possible off-flavors. Do not use SO₂ before fermentation. Monitor closely.' },
];

var RECIPE_TEMPLATES = {
  stone_fruit: {
    name:'Stone Fruit Standard',
    per_gallon:[
      { name:'Fruit (crushed, destemmed)', amount:6.5, unit:'lbs' },
      { name:'Granulated Sugar', amount:2.0, unit:'lbs' },
      { name:'Water (to volume)', amount:0.5, unit:'gallons' },
      { name:'Pectic Enzyme', amount:0.5, unit:'tsp' },
      { name:'Acid Blend', amount:0.5, unit:'tsp' },
      { name:'Yeast Nutrient', amount:1.0, unit:'tsp' },
      { name:'Potassium Metabisulfite', amount:0.25, unit:'tsp' },
    ],
    target_og:1.090, default_yeast:'71b', default_fermentation:'traditional',
    crush_method:'Hand-crush or freeze/thaw', so2_wait_hours:12,
  },
  berry: {
    name:'Berry Standard',
    per_gallon:[
      { name:'Berries (crushed or whole)', amount:6.0, unit:'lbs' },
      { name:'Granulated Sugar', amount:2.25, unit:'lbs' },
      { name:'Water (to volume)', amount:0.6, unit:'gallons' },
      { name:'Pectic Enzyme', amount:0.75, unit:'tsp' },
      { name:'Acid Blend', amount:0.25, unit:'tsp' },
      { name:'Yeast Nutrient', amount:1.0, unit:'tsp' },
      { name:'Potassium Metabisulfite', amount:0.25, unit:'tsp' },
    ],
    target_og:1.090, default_yeast:'k1v1116', default_fermentation:'traditional',
    crush_method:'Freeze then thaw, or gentle crush', so2_wait_hours:12,
  },
  grape: {
    name:'Grape / Labrusca',
    per_gallon:[
      { name:'Grapes (crushed, stems removed)', amount:8.0, unit:'lbs' },
      { name:'Granulated Sugar', amount:1.5, unit:'lbs' },
      { name:'Water (to volume)', amount:0.25, unit:'gallons' },
      { name:'Pectic Enzyme', amount:0.5, unit:'tsp' },
      { name:'Yeast Nutrient', amount:1.0, unit:'tsp' },
      { name:'Potassium Metabisulfite', amount:0.25, unit:'tsp' },
    ],
    target_og:1.085, default_yeast:'rc212', default_fermentation:'traditional',
    crush_method:'Crush and destem', so2_wait_hours:12,
  },
  apple: {
    name:'Apple / Cider-Wine',
    per_gallon:[
      { name:'Fresh Apple Juice (pressed)', amount:1.0, unit:'gallons' },
      { name:'Granulated Sugar', amount:1.0, unit:'lbs' },
      { name:'Yeast Nutrient', amount:0.5, unit:'tsp' },
      { name:'Potassium Metabisulfite', amount:0.25, unit:'tsp' },
      { name:'Pectic Enzyme', amount:0.5, unit:'tsp' },
    ],
    target_og:1.080, default_yeast:'d47', default_fermentation:'cold',
    crush_method:'Press whole fruit for juice', so2_wait_hours:12,
  },
};

// ─── Library Helpers ──────────────────────────────────────────────────
function getFruitById(id) { return FRUIT_LIBRARY.find(f => f.id === id) || null; }
function getYeastById(id) { return YEAST_LIBRARY.find(y => y.id === id) || null; }
function getFermTypeById(id) { return FERMENTATION_TYPES.find(t => t.id === id) || null; }
function getRecipeTemplate(id) { return RECIPE_TEMPLATES[id] || null; }

function scaleRecipe(templateId, gallons) {
  const t = getRecipeTemplate(templateId);
  if (!t) return [];
  return t.per_gallon.map(ing => ({
    ...ing,
    amount: parseFloat((ing.amount * gallons).toFixed(2))
  }));
}

function buildBatchType(fruitId, fermTypeId) {
  const fruit = getFruitById(fruitId);
  const ferm  = getFermTypeById(fermTypeId);
  if (!fruit || !ferm) return 'Custom Batch';
  return `${fruit.name} ${ferm.name}`;
}

function projectTimeline(fermTypeId, startDate) {
  const ferm = getFermTypeById(fermTypeId);
  if (!ferm || !startDate) return null;
  const d = new Date(startDate + 'T00:00:00');
  const add = days => { const r = new Date(d); r.setDate(r.getDate() + days); return r.toISOString().slice(0,10); };
  const tl = ferm.timeline_days;
  const prepEnd    = tl.preparation || 2;
  const primaryEnd = prepEnd + (tl.primary?.min || 7);
  const secondEnd  = primaryEnd + (tl.secondary?.min || 30);
  const clarEnd    = secondEnd + (tl.clarification?.min || 14);
  const bottleDay  = clarEnd + 1;
  const matureEnd  = bottleDay + (tl.aging?.min || 90);
  return {
    preparation:         { start: startDate,       end: add(prepEnd) },
    primary_fermentation:{ start: add(prepEnd),    end: add(primaryEnd) },
    secondary_fermentation:{ start: add(primaryEnd), end: add(secondEnd) },
    clarification:       { start: add(secondEnd),  end: add(clarEnd) },
    bottling:            { start: add(bottleDay),  end: add(bottleDay) },
    aging:               { start: add(bottleDay),  end: add(matureEnd) },
  };
}
