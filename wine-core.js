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
