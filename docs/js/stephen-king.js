const kingCatalog = [
  {
    title: 'The Shining',
    year: 1977,
    kind: 'Novel',
    subgenre: 'Psychological horror',
    tier: 'S',
    score: 96,
    evidence: ['Unforgettable atmosphere', 'Severe psychological pressure', 'Enduring cultural influence']
  },
  {
    title: 'It',
    year: 1986,
    kind: 'Novel',
    subgenre: 'Cosmic horror',
    tier: 'S',
    score: 95,
    evidence: ['Monstrous mythic scope', 'Powerful childhood memory framework', 'Huge emotional and narrative reach']
  },
  {
    title: 'The Stand',
    year: 1978,
    kind: 'Novel',
    subgenre: 'Post-apocalyptic horror',
    tier: 'S',
    score: 94,
    evidence: ['Epic scale', 'Strong world-building', 'Highly influential apocalyptic structure']
  },
  {
    title: 'The Dark Tower I: The Gunslinger',
    year: 1982,
    kind: 'Novel',
    subgenre: 'Dark fantasy',
    tier: 'S',
    score: 92,
    evidence: ['Distinctive mythic voice', 'Dense symbolic texture', 'Foundational for King’s larger mythos']
  },
  {
    title: 'Pet Sematary',
    year: 1983,
    kind: 'Novel',
    subgenre: 'Horror',
    tier: 'S',
    score: 91,
    evidence: ['Deeply unsettling premise', 'Excellent emotional cruelty', 'Strong aftertaste and thematic force']
  },
  {
    title: 'Carrie',
    year: 1974,
    kind: 'Novel',
    subgenre: 'Supernatural horror',
    tier: 'A',
    score: 89,
    evidence: ['A breakout voice', 'Sharp social horror', 'Economical and devastating']
  },
  {
    title: 'Misery',
    year: 1987,
    kind: 'Novel',
    subgenre: 'Psychological horror',
    tier: 'A',
    score: 88,
    evidence: ['Perfectly controlled tension', 'Brutal obsession narrative', 'Excellent pacing and pressure']
  },
  {
    title: 'Salem’s Lot',
    year: 1975,
    kind: 'Novel',
    subgenre: 'Gothic horror',
    tier: 'A',
    score: 87,
    evidence: ['Classic vampire atmosphere', 'Strong small-town dread', 'High mood and setting value']
  },
  {
    title: 'The Dead Zone',
    year: 1979,
    kind: 'Novel',
    subgenre: 'Psychological thriller',
    tier: 'A',
    score: 86,
    evidence: ['Strong moral tension', 'Compelling premise', 'Excellent psychological stakes']
  },
  {
    title: 'The Talisman',
    year: 1984,
    kind: 'Novel',
    subgenre: 'Fantasy adventure',
    tier: 'A',
    score: 85,
    evidence: ['Imaginative world-building', 'Adventure momentum', 'Cross-genre ambition']
  },
  {
    title: 'The Green Mile',
    year: 1996,
    kind: 'Novel',
    subgenre: 'Supernatural drama',
    tier: 'A',
    score: 84,
    evidence: ['Powerful emotional architecture', 'Memorable moral center', 'Affecting and humane']
  },
  {
    title: 'The Dark Tower II: The Drawing of the Three',
    year: 1987,
    kind: 'Novel',
    subgenre: 'Dark fantasy',
    tier: 'A',
    score: 83,
    evidence: ['Sharper character focus', 'Strong momentum', 'More accessible than the first volume']
  },
  {
    title: 'The Dark Tower III: The Waste Lands',
    year: 1991,
    kind: 'Novel',
    subgenre: 'Dark fantasy',
    tier: 'A',
    score: 82,
    evidence: ['Excellent escalation', 'Stronger plotting', 'A major step in the mythic arc']
  },
  {
    title: 'Different Seasons',
    year: 1982,
    kind: 'Collection',
    subgenre: 'Short fiction',
    tier: 'A',
    score: 80,
    evidence: ['Contains major novellas', 'Excellent range and control', 'Ostensibly short-form but deeply resonant']
  },
  {
    title: 'The Long Walk',
    year: 1979,
    kind: 'Novella',
    subgenre: 'Dystopian horror',
    tier: 'B',
    score: 79,
    evidence: ['Brutal and direct', 'High-pressure narrative', 'A compact and effective concept']
  },
  {
    title: 'The Mist',
    year: 1980,
    kind: 'Novella',
    subgenre: 'Cosmic horror',
    tier: 'B',
    score: 78,
    evidence: ['Excellent short-form dread', 'Strong ending', 'A lean and effective horror piece']
  },
  {
    title: 'Doctor Sleep',
    year: 2013,
    kind: 'Novel',
    subgenre: 'Dark fantasy',
    tier: 'B',
    score: 77,
    evidence: ['Ambitious sequel work', 'Memorable haunted imagery', 'Less unified than the original']
  },
  {
    title: 'Joyland',
    year: 2013,
    kind: 'Novel',
    subgenre: 'Mystery',
    tier: 'B',
    score: 76,
    evidence: ['Strong voice and warmth', 'Good emotional precision', 'More intimate than his louder blockbusters']
  },
  {
    title: 'The Outsider',
    year: 2018,
    kind: 'Novel',
    subgenre: 'Crime horror',
    tier: 'B',
    score: 75,
    evidence: ['Solid procedural engine', 'Some strong dread', 'Less distinctive than the best King']
  },
  {
    title: 'Christine',
    year: 1983,
    kind: 'Novel',
    subgenre: 'Science fiction horror',
    tier: 'B',
    score: 74,
    evidence: ['High-concept momentum', 'Good horror mechanics', 'Somewhat thinner than the major classics']
  },
  {
    title: 'Under the Dome',
    year: 2009,
    kind: 'Novel',
    subgenre: 'Science fiction',
    tier: 'B',
    score: 72,
    evidence: ['Huge premise', 'Good setup and momentum', 'Sometimes overextended']
  },
  {
    title: 'The Institute',
    year: 2020,
    kind: 'Novel',
    subgenre: 'Dark thriller',
    tier: 'B',
    score: 71,
    evidence: ['Clean pacing', 'Compelling premise', 'Less haunting than the best King']
  },
  {
    title: 'The Girl Who Loved Tom Gordon',
    year: 1999,
    kind: 'Novel',
    subgenre: 'Survival horror',
    tier: 'B',
    score: 70,
    evidence: ['Tight and unsettling', 'Excellent tension and dread', 'More spare than his loudest work']
  },
  {
    title: 'Lisey’s Story',
    year: 2006,
    kind: 'Novel',
    subgenre: 'Literary horror',
    tier: 'B',
    score: 69,
    evidence: ['Emotionally rich', 'Intimate and personal', 'Less immediate than the major works']
  },
  {
    title: 'Gerald’s Game',
    year: 1992,
    kind: 'Novel',
    subgenre: 'Psychological horror',
    tier: 'B',
    score: 67,
    evidence: ['Single-location intensity', 'Strong psychological focus', 'A bit more austere than his grander works']
  },
  {
    title: 'Bag of Bones',
    year: 1998,
    kind: 'Novel',
    subgenre: 'Ghost story',
    tier: 'C',
    score: 65,
    evidence: ['Atmospheric and moody', 'Effective haunted-house texture', 'Less propulsive than the best of King']
  },
  {
    title: 'Insomnia',
    year: 1994,
    kind: 'Novel',
    subgenre: 'Dark fantasy',
    tier: 'C',
    score: 64,
    evidence: ['Ambitious and strange', 'Interesting conceptual scope', 'More diffuse than his strongest work']
  },
  {
    title: 'The Boogeyman',
    year: 1973,
    kind: 'Novella',
    subgenre: 'Horror',
    tier: 'C',
    score: 63,
    evidence: ['Solid short-form horror', 'Good claustrophobic effect', 'More compact than essential']
  },
  {
    title: 'Night Shift',
    year: 1978,
    kind: 'Collection',
    subgenre: 'Short fiction',
    tier: 'C',
    score: 62,
    evidence: ['Valuable early collection', 'Some excellent pieces', 'Uneven as a whole']
  },
  {
    title: 'The Dark Half',
    year: 1989,
    kind: 'Novel',
    subgenre: 'Psychological horror',
    tier: 'C',
    score: 61,
    evidence: ['Readable and effective', 'Good thematic hook', 'Less distinctive than the major classics']
  }
].map((item) => ({
  ...item,
  searchText: `${item.title} ${item.subgenre}`.toLowerCase()
}));

const kingStateKey = 'stephen-king-ranking-state';
let searchTimer;

const rubricDimensions = [
  { label: 'Craft & prose', weight: 25, note: 'Sentence control, voice, pacing, and density of imagery.' },
  { label: 'Atmosphere', weight: 20, note: 'Mood, dread, place, and the power of the setting to linger.' },
  { label: 'Story architecture', weight: 20, note: 'Plot momentum, escalation, and the strength of the underlying design.' },
  { label: 'Emotional impact', weight: 20, note: 'The capacity to haunt, move, or unsettle after the book is done.' },
  { label: 'Influence', weight: 15, note: 'How much the work shaped the wider landscape of horror and fantasy.' }
];

const subgenreGuides = [
  { title: 'Horror', blurb: 'For readers who want dread, cruelty, and a lasting aftertaste.', picks: ['The Shining', 'It', 'Pet Sematary', 'Misery'] },
  { title: 'Dark fantasy', blurb: 'For readers drawn to mythic worlds, symbols, and the strange.', picks: ['The Dark Tower I: The Gunslinger', 'The Talisman', 'Doctor Sleep', 'Insomnia'] },
  { title: 'Crime and thriller', blurb: 'For readers who like pressure, moral ambiguity, and procedural momentum.', picks: ['The Dead Zone', 'The Outsider', 'The Institute', 'Joyland'] },
  { title: 'Short-form', blurb: 'For readers who want compact, high-impact stories with strong endings.', picks: ['Different Seasons', 'The Mist', 'The Long Walk', 'The Boogeyman'] }
];

const starterPicks = [
  { title: 'The Shining', reason: 'Best if you want pure atmosphere and a classic horror engine.' },
  { title: 'It', reason: 'Best for a sprawling, emotional, and genuinely immersive King novel.' },
  { title: 'The Stand', reason: 'Best if you want epic scope, huge stakes, and a landmark apocalyptic read.' },
  { title: 'The Green Mile', reason: 'Best for readers who want King at his most humane and affecting.' }
];

function tierClass(tier) {
  return `tier-${tier.toLowerCase()}`;
}

function renderSummary() {
  const container = document.getElementById('summaryGrid');
  if (!container) return;

  const tierCounts = kingCatalog.reduce((acc, item) => {
    acc[item.tier] = (acc[item.tier] || 0) + 1;
    return acc;
  }, {});

  const avgScore = (kingCatalog.reduce((sum, item) => sum + item.score, 0) / kingCatalog.length).toFixed(1);
  const topTierCount = tierCounts.S || 0;
  const total = kingCatalog.length;

  const cards = [
    { label: 'Entries', value: total },
    { label: 'S tier', value: topTierCount },
    { label: 'Average score', value: avgScore },
    { label: 'A/B/C mix', value: `${tierCounts.A || 0}/${tierCounts.B || 0}/${tierCounts.C || 0}` }
  ];

  container.innerHTML = cards.map((card) => `
    <article class="summary-card">
      <div>${card.label}</div>
      <div class="summary-number">${card.value}</div>
    </article>
  `).join('');
}

function renderRubric() {
  const container = document.getElementById('rubricGrid');
  if (!container) return;

  container.innerHTML = rubricDimensions.map((dimension) => `
    <article class="rubric-item">
      <div class="rubric-label">${dimension.label}</div>
      <div class="rubric-weight">${dimension.weight}%</div>
      <p>${dimension.note}</p>
    </article>
  `).join('');
}

function renderMatrix() {
  const container = document.getElementById('matrixGrid');
  if (!container) return;

  container.innerHTML = subgenreGuides.map((guide) => `
    <article class="matrix-item">
      <h4>${guide.title}</h4>
      <p>${guide.blurb}</p>
      <ul class="matrix-list">
        ${guide.picks.map((pick) => `<li>${pick}</li>`).join('')}
      </ul>
    </article>
  `).join('');
}

function renderStarterPicks() {
  const container = document.getElementById('starterGrid');
  if (!container) return;

  container.innerHTML = starterPicks.map((pick) => `
    <article class="starter-item">
      <h4>${pick.title}</h4>
      <p>${pick.reason}</p>
    </article>
  `).join('');
}

function renderCatalog(items) {
  const container = document.getElementById('rankingList');
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<p class="empty-state">No titles match these filters yet.</p>';
    return;
  }

  container.innerHTML = items.map((item) => `
    <article class="ranking-card">
      <div class="ranking-header">
        <div>
          <span class="tier-pill ${tierClass(item.tier)}">${item.tier} tier</span>
          <h3>${item.title}</h3>
          <p class="ranking-meta">${item.year} • ${item.kind} • ${item.subgenre}</p>
        </div>
        <div class="ranking-metrics">
          <span>${item.score}</span>
          <span>Score</span>
        </div>
      </div>
      <p class="ranking-summary">Score rationale: ${item.evidence[0].toLowerCase()}, ${item.evidence[1].toLowerCase()}, and ${item.evidence[2].toLowerCase()}.</p>
      <details class="ranking-evidence">
        <summary>View scoring evidence</summary>
        <ul class="evidence-list">
          ${item.evidence.map((point) => `<li>${point}</li>`).join('')}
        </ul>
      </details>
    </article>
  `).join('');
}

function applyFilters() {
  const searchInput = document.getElementById('kingSearch');
  const tierSelect = document.getElementById('kingTierFilter');
  const kindSelect = document.getElementById('kingKindFilter');

  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const tierValue = tierSelect ? tierSelect.value : 'all';
  const kindValue = kindSelect ? kindSelect.value : 'all';

  const filtered = kingCatalog.filter((item) => {
    const matchesSearch = !searchValue || item.searchText.includes(searchValue);
    const matchesTier = tierValue === 'all' || item.tier === tierValue;
    const matchesKind = kindValue === 'all' || item.kind === kindValue;
    return matchesSearch && matchesTier && matchesKind;
  });

  const sorted = filtered.slice().sort((a, b) => {
    const tierRank = ['S', 'A', 'B', 'C'].indexOf(a.tier) - ['S', 'A', 'B', 'C'].indexOf(b.tier);
    if (tierRank !== 0) return tierRank;
    return b.score - a.score;
  });

  renderCatalog(sorted);
  saveState();
}

function saveState() {
  const state = {
    search: document.getElementById('kingSearch').value,
    tier: document.getElementById('kingTierFilter').value,
    kind: document.getElementById('kingKindFilter').value
  };
  localStorage.setItem(kingStateKey, JSON.stringify(state));
  const params = new URLSearchParams();
  if (state.search) params.set('q', state.search);
  if (state.tier !== 'all') params.set('tier', state.tier);
  if (state.kind !== 'all') params.set('kind', state.kind);
  history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}`);
}

function restoreState() {
  const params = new URLSearchParams(location.search);
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(kingStateKey) || '{}');
  } catch {
    stored = {};
  }
  document.getElementById('kingSearch').value = params.get('q') || stored.search || '';
  document.getElementById('kingTierFilter').value = params.get('tier') || stored.tier || 'all';
  document.getElementById('kingKindFilter').value = params.get('kind') || stored.kind || 'all';
}

function attachEvents() {
  const searchInput = document.getElementById('kingSearch');
  const tierSelect = document.getElementById('kingTierFilter');
  const kindSelect = document.getElementById('kingKindFilter');

  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 200);
  });
  [tierSelect, kindSelect].forEach((element) => element.addEventListener('change', applyFilters));
  document.querySelectorAll('.tier-jumps button').forEach((button) => {
    button.addEventListener('click', () => {
      tierSelect.value = button.dataset.tier;
      applyFilters();
      document.getElementById('rankingList').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSummary();
  renderRubric();
  renderMatrix();
  renderStarterPicks();
  restoreState();
  applyFilters();
  attachEvents();
});
