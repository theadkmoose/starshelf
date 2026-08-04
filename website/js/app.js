let allBooks = [];

const searchInput = document.getElementById("search");
const awardFilter = document.getElementById("awardFilter");
const genreFilter = document.getElementById("genreFilter");
const themeFilter = document.getElementById("themeFilter");
const typeFilter = document.getElementById("typeFilter");
const yearFilter = document.getElementById("yearFilter");
const sortOrder = document.getElementById("sortOrder");
const qualityFloor = document.getElementById("qualityFloor");
const resetButton = document.getElementById("resetButton");
const statusText = document.getElementById("statusText");
const preferenceChips = document.getElementById("preferenceChips");
const showFavoritesOnly = document.getElementById("showFavoritesOnly");
const showCompletedOnly = document.getElementById("showCompletedOnly");
const showHighConfidenceOnly = document.getElementById("showHighConfidenceOnly");
const lockNextBestQueue = document.getElementById("lockNextBestQueue");
const regenerateQueueButton = document.getElementById("regenerateQueueButton");
const queueModeChip = document.getElementById("queueModeChip");
const preferencesKey = "spec-fiction-preferences";
const favoritesKey = "spec-fiction-favorites";
const completedKey = "spec-fiction-completed";
const recentlyViewedKey = "spec-fiction-recently-viewed";
const nextBestQueueKey = "spec-fiction-next-best-queue";
const nextBestQueueLockedKey = "spec-fiction-next-best-queue-locked";
const coverCacheKey = "spec-fiction-cover-cache";
const bookMetaUtils = window.BookMetaUtils;
const scoreUtils = window.ScoreUtils;

fetch("books.json", { cache: "no-store" })
  .then(response => response.json())
  .then(async (books) => {
    const cleanedBooks = bookMetaUtils.cleanCatalog(books);
    allBooks = cleanedBooks.map(enrichBook);
    populateAwardFilter();
    populateGenreFilter();
    populateThemeFilter();
    populatePreferenceChips();
    refreshPreferenceScores();
    displayBooks(allBooks);
    renderRecentlyViewed();

    const cacheHydrated = applyCachedCovers(allBooks);
    if (cacheHydrated > 0) {
      displayBooks(getFilteredBooks());
    }

    const updated = await hydrateMissingCovers(allBooks, 80, () => {
      displayBooks(getFilteredBooks());
    });

    if (updated > 0 && cacheHydrated === 0) {
      displayBooks(getFilteredBooks());
    }
  })
  .catch(error => {
    console.error("Error loading books:", error);
    document.getElementById("books").innerHTML = "<p>Unable to load the book data.</p>";
  });

function getCoverCache() {
  try {
    const parsed = JSON.parse(localStorage.getItem(coverCacheKey) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function setCoverCache(map) {
  localStorage.setItem(coverCacheKey, JSON.stringify(map));
}

function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function applyCachedCovers(books) {
  const cache = getCoverCache();
  let updatedBooks = 0;

  books.forEach((book) => {
    const key = bookMetaUtils.coverLookupKey(book);
    const cached = cache[key];
    if (!book.cover_url && cached) {
      book.cover_url = cached;
      updatedBooks += 1;
    }
  });

  return updatedBooks;
}

async function hydrateMissingCovers(books, maxFetches = 60, onProgress = null) {
  const cache = getCoverCache();
  let cacheChanged = false;
  let updatedBooks = 0;

  const candidates = books.filter(book => !book.cover_url).slice(0, maxFetches);
  const batchSize = 8;

  async function resolveCoverForBook(book) {
    let coverUrl = bookMetaUtils.coverUrlFromIsbn(book.isbn);
    if (!coverUrl) {
      coverUrl = await bookMetaUtils.fetchOpenLibraryCoverUrl(book.title, book.author);
    }
    if (!coverUrl) {
      coverUrl = await bookMetaUtils.fetchGoogleBooksCoverUrl(book.title, book.author);
    }
    if (!coverUrl) return null;
    return { book, coverUrl };
  }

  for (let index = 0; index < candidates.length; index += batchSize) {
    const batch = candidates.slice(index, index + batchSize);
    const results = await Promise.all(batch.map(resolveCoverForBook));
    let batchUpdated = 0;

    results.forEach((result) => {
      if (!result) return;
      const { book, coverUrl } = result;
      const key = bookMetaUtils.coverLookupKey(book);

      book.cover_url = coverUrl;
      if (cache[key] !== coverUrl) {
        cache[key] = coverUrl;
        cacheChanged = true;
      }

      updatedBooks += 1;
      batchUpdated += 1;
    });

    if (batchUpdated > 0 && typeof onProgress === "function") {
      onProgress(updatedBooks);
    }

    await pause(40);
  }

  if (cacheChanged) {
    setCoverCache(cache);
  }

  return updatedBooks;
}

function getStoredArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function saveStoredArray(key, values) {
  localStorage.setItem(key, JSON.stringify(values));
}

function getSelectedPreferences() {
  return getStoredArray(preferencesKey);
}

function saveSelectedPreferences(selectedPreferences) {
  saveStoredArray(preferencesKey, selectedPreferences);
}

function getFavoriteIds() {
  return getStoredArray(favoritesKey);
}

function saveFavoriteIds(ids) {
  saveStoredArray(favoritesKey, ids);
}

function getCompletedIds() {
  return getStoredArray(completedKey);
}

function saveCompletedIds(ids) {
  saveStoredArray(completedKey, ids);
}

function getRecentlyViewed() {
  return getStoredArray(recentlyViewedKey);
}

function saveRecentlyViewed(items) {
  saveStoredArray(recentlyViewedKey, items);
}

function getNextBestQueue() {
  return getStoredArray(nextBestQueueKey);
}

function saveNextBestQueue(items) {
  saveStoredArray(nextBestQueueKey, items);
}

function isQueueLocked() {
  return localStorage.getItem(nextBestQueueLockedKey) === "1";
}

function saveQueueLocked(isLocked) {
  localStorage.setItem(nextBestQueueLockedKey, isLocked ? "1" : "0");
}

function updateQueueModeChip() {
  if (!queueModeChip) return;
  const locked = isQueueLocked();
  queueModeChip.textContent = locked ? "Locked" : "Auto";
  queueModeChip.classList.toggle("locked", locked);
}

function renderRecentlyViewed() {
  const container = document.getElementById("recentlyViewedList");
  if (!container) return;

  const recentItems = getRecentlyViewed();

  if (!recentItems.length) {
    container.innerHTML = '<p class="recent-empty">Open a book to build your recent list.</p>';
    return;
  }

  container.innerHTML = recentItems.map(item => `
    <a class="recent-link" href="book.html?id=${item.id}">
      <span class="recent-title">${item.title || "Untitled"}</span>
      <span class="recent-subtitle">${item.author || "Unknown author"}</span>
    </a>
  `).join("");
}

function summarizeAwards(awardSummary) {
  const entries = (awardSummary || "")
    .split("|")
    .map(entry => entry.trim())
    .filter(Boolean);

  if (!entries.length) return "No major awards";
  if (entries.length === 1) return entries[0];

  const preview = entries.slice(0, 2).join(" | ");
  return entries.length > 2 ? `${preview} +${entries.length - 2} more` : preview;
}

function hasTagValue(value) {
  if (value === null || value === undefined) return false;
  const text = String(value).trim();
  if (!text) return false;
  const normalized = text.toLowerCase();
  return normalized !== "n/a" && normalized !== "none" && normalized !== "unknown";
}

function getBookTags(book) {
  const tags = new Set();

  (book.themes || "")
    .split("|")
    .map(theme => theme.trim())
    .filter(Boolean)
    .forEach(theme => tags.add(theme));

  const extraTagSpecs = [
    { label: "Genre", value: book.genre },
    { label: "Tone", value: book.tone },
    { label: "Pacing", value: book.pacing },
    { label: "Difficulty", value: book.difficulty },
    { label: "Romance", value: book.romance },
    { label: "POV", value: book.pov },
    { label: "Ending", value: book.ending },
    { label: "Magic", value: book.magic },
    { label: "Violence", value: book.violence }
  ];

  extraTagSpecs.forEach(({ label, value }) => {
    if (hasTagValue(value)) {
      tags.add(`${label}: ${String(value).trim()}`);
    }
  });

  return Array.from(tags);
}

const DERIVED_GENRE_RULES = [
  { label: "Epic Fantasy", pattern: /\bstormlight\b|\bwheel of time\b|\bmalazan\b|\bmiddle-earth\b|\bkingkiller\b|\bfirst law\b|\brealm of the elderlings\b|\bcosmere\b|\bmistborn\b|\bbanished lands\b|\bwitcher\b|\bbroken empire\b|\bgreen bone\b|\bsarantine\b|\bsecond apocalypse\b|\bwars of light and shadow\b|\btortall\b|\bwarbreaker\b|\btigana\b/ },
  { label: "Urban Fantasy", pattern: /\bdresden\b|\bcity we became\b|\bnew crobuzon\b|\bamerican gods\b/ },
  { label: "Dark Fantasy", pattern: /\bfirst law\b|\bblacktongue\b|\bbroken empire\b|\bmalazan\b|\bbetween two fires\b|\bpoppy war\b|\bdark tower\b/ },
  { label: "Cozy Fantasy", pattern: /\blegends and lattes\b|\bemily wilde\b|\bwhite rat\b/ },
  { label: "Science Fiction", pattern: /\bdune\b|\bexpanse\b|\bthree-body\b|\bremembrance of earth\b|\bhainish\b|\bender\b|\bchildren of time\b|\bproject hail mary\b|\brevelation space\b|\bteixcalaan\b|\bmurderbot\b|\bsun eater\b|\bneuromancer\b|\bcyteen\b|\bhyperion\b|\bancillary\b|\bdispossessed\b|\blathe of heaven\b|\banathem\b/ },
  { label: "Space Opera", pattern: /\bexpanse\b|\bteixcalaan\b|\bsun eater\b|\ba fire upon the deep\b|\bancillary\b|\brevelation space\b|\bchildren of time\b|\bmemory called empire\b|\bdesolation called peace\b/ },
  { label: "Cyberpunk", pattern: /\bneuromancer\b|\bcyberpunk\b/ },
  { label: "Dystopian", pattern: /\b1984\b|\bhunger games\b|\bchain-gang all-stars\b|\breformatory\b/ },
  { label: "Horror", pattern: /\bhouse of leaves\b|\bbetween two fires\b|\breformatory\b|\bthe stand\b|\blibrary at mount char\b/ },
  { label: "Magical Realism", pattern: /\bpiranesi\b|\bcloud atlas\b|\binvisible life of addie larue\b|\blittle prince\b/ },
  { label: "Progression Fantasy", pattern: /\bcradle\b|\bdungeon crawler carl\b|\bwandering inn\b|\bpractical guide to evil\b|\bbeware of chicken\b|\bpale\b/ },
  { label: "LitRPG", pattern: /\bdungeon crawler carl\b|\blitrpg\b/ },
  { label: "Mythic Retelling", pattern: /\bcirce\b|\bsong of achilles\b|\bpercy jackson\b/ }
];

const CURATED_GENRE_OVERRIDES = {
  "1984|george orwell": ["Dystopian", "Science Fiction"],
  "a court of thorns and roses|sarah j maas": ["Fantasy", "Romantasy"],
  "a song of ice and fire|george rr martin": ["Epic Fantasy"],
  "all systems red|martha wells": ["Science Fiction"],
  "ancillary justice|ann leckie": ["Science Fiction", "Space Opera"],
  "american gods|neil gaiman": ["Urban Fantasy"],
  "children of time|adrian tchaikovsky": ["Science Fiction", "Space Opera"],
  "cradle|will wight": ["Progression Fantasy"],
  "discworld|terry pratchett": ["Fantasy", "Comic Fantasy"],
  "dune|frank herbert": ["Science Fiction", "Space Opera"],
  "dungeon crawler carl|matt dinniman": ["Progression Fantasy", "LitRPG"],
  "frieren beyond journeys end|kanehito yamada": ["Fantasy", "Graphic Narrative"],
  "harry potter|jk rowling": ["Fantasy", "YA Fantasy"],
  "his dark materials|philip pullman": ["Fantasy", "YA Fantasy"],
  "hitchhikers guide to the galaxy|douglas adams": ["Science Fiction", "Comic Science Fiction"],
  "house of leaves|mark z danielewski": ["Horror", "Experimental Fiction"],
  "jonathan strange mr norrell|susanna clarke": ["Historical Fantasy"],
  "legends and lattes|travis baldree": ["Cozy Fantasy"],
  "mistborn|brandon sanderson": ["Epic Fantasy"],
  "neuromancer|william gibson": ["Science Fiction", "Cyberpunk"],
  "one piece|eiichiro oda": ["Fantasy", "Graphic Narrative"],
  "project hail mary|andy weir": ["Science Fiction"],
  "the city the city|china mieville": ["Speculative Fiction", "Weird Fiction"],
  "the dark tower|stephen king": ["Dark Fantasy", "Horror"],
  "the expanse|james sa corey": ["Science Fiction", "Space Opera"],
  "the first law world|joe abercrombie": ["Epic Fantasy", "Dark Fantasy"],
  "the hunger games|suzanne collins": ["Dystopian", "YA Science Fiction"],
  "the little prince|antoine de saintexupery": ["Magical Realism"],
  "the locked tomb|tamsyn muir": ["Science Fiction", "Gothic Science Fiction"],
  "the murderbot diaries|martha wells": ["Science Fiction"],
  "the name of the wind|patrick rothfuss": ["Epic Fantasy"],
  "the witcher|andrzej sapkowski": ["Epic Fantasy"],
  "watchmen|alan moore and dave gibbons": ["Graphic Narrative", "Superhero Deconstruction"]
};

const GENRE_HINTS_FROM_THEMES = {
  fantasy: "Fantasy",
  "science fiction": "Science Fiction",
  "speculative fiction": "Speculative Fiction",
  dystopian: "Dystopian",
  horror: "Horror"
};

const CANONICAL_GENRES = [
  "Speculative Fiction",
  "Fantasy",
  "Science Fiction",
  "Dystopian",
  "Horror"
];

const GENRE_CANONICAL_ALIASES = {
  "cozy fantasy": "Fantasy",
  "comic fantasy": "Fantasy",
  "comic science fiction": "Science Fiction",
  "cyberpunk": "Science Fiction",
  "dark fantasy": "Fantasy",
  "epic fantasy": "Fantasy",
  "experimental fiction": "Speculative Fiction",
  "graphic narrative": "Speculative Fiction",
  "gothic science fiction": "Science Fiction",
  "historical fantasy": "Fantasy",
  "litrpg": "Fantasy",
  "magical realism": "Speculative Fiction",
  "mythic retelling": "Fantasy",
  "progression fantasy": "Fantasy",
  "romantasy": "Fantasy",
  "sci-fi": "Science Fiction",
  "sci fi": "Science Fiction",
  "science-fiction": "Science Fiction",
  "space opera": "Science Fiction",
  "superhero deconstruction": "Speculative Fiction",
  "urban fantasy": "Fantasy",
  "weird fiction": "Speculative Fiction",
  "ya fantasy": "Fantasy",
  "ya science fiction": "Science Fiction"
};

function toCanonicalGenre(tag) {
  const raw = String(tag || "").trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  const mapped = GENRE_CANONICAL_ALIASES[lower] || raw;

  return CANONICAL_GENRES.includes(mapped) ? mapped : null;
}

function getBookGenreTags(book) {
  const tags = new Set();
  const baseGenre = String(book.genre || "").trim();
  const baseCanonical = toCanonicalGenre(baseGenre);
  if (baseCanonical) tags.add(baseCanonical);

  const overrideKey = `${bookMetaUtils.normalizeTitle(book.title)}|${bookMetaUtils.normalizeText(book.author)}`;
  const overrideTags = CURATED_GENRE_OVERRIDES[overrideKey] || [];
  overrideTags.forEach((tag) => {
    const canonical = toCanonicalGenre(tag);
    if (canonical) tags.add(canonical);
  });

  const themeParts = String(book.themes || "")
    .split("|")
    .map(part => part.trim())
    .filter(Boolean);

  themeParts.forEach((theme) => {
    const lower = theme.toLowerCase();
    if (GENRE_HINTS_FROM_THEMES[lower]) {
      const canonical = toCanonicalGenre(GENRE_HINTS_FROM_THEMES[lower]);
      if (canonical) tags.add(canonical);
    }
    if (lower.startsWith("genre:")) {
      const value = theme.split(":")[1] || "";
      const cleaned = value.trim();
      const canonical = toCanonicalGenre(cleaned);
      if (canonical) tags.add(canonical);
    }
  });

  const text = [book.title, book.series, book.themes, book.genre]
    .map(value => String(value || "").toLowerCase())
    .join(" ");

  DERIVED_GENRE_RULES.forEach(({ label, pattern }) => {
    if (pattern.test(text)) {
      const canonical = toCanonicalGenre(label);
      if (canonical) tags.add(canonical);
    }
  });

  if (tags.size === 0) {
    tags.add("Speculative Fiction");
  }

  return Array.from(tags);
}

function getPrimaryGenre(book) {
  const tags = book.genreTags || getBookGenreTags(book);
  const preferred = tags.find(tag => tag !== "Speculative Fiction");
  return preferred || tags[0] || "Speculative Fiction";
}

function computePersonalFit(book) {
  const selectedPreferences = getSelectedPreferences();
  if (!selectedPreferences.length) return 0;

  const bookThemes = getBookTags(book).map(theme => theme.toLowerCase());

  if (!bookThemes.length) return 0;

  const selected = selectedPreferences.map(theme => theme.toLowerCase());
  const overlap = selected.filter(theme => bookThemes.includes(theme)).length;
  return Math.max(0, Math.min(1, overlap / selected.length));
}

function computePickScore(book) {
  const base = Number.isFinite(book.overallScore) ? book.overallScore : 0;
  const fitBoost = (book.personalFit || 0) * 20;
  const confidenceMultiplier = 0.85 + (book.scoreConfidence || 0) / 100 * 0.15;
  return Math.round((base + fitBoost) * confidenceMultiplier);
}

function enrichBook(book) {
  const details = scoreUtils.computeScoreDetails(book);
  const personalFit = computePersonalFit(book);
  const genreTags = getBookGenreTags(book);
  return {
    ...book,
    overallScore: details.overallScore,
    scoreConfidence: details.scoreConfidence,
    signalCount: details.signalCount,
    genreTags,
    primaryGenre: getPrimaryGenre({ ...book, genreTags }),
    personalFit,
    pickScore: computePickScore({ ...book, ...details, personalFit })
  };
}

function getAutoQueueIds(booksToDisplay) {
  return [...booksToDisplay]
    .filter(book => Number.isFinite(book.overallScore))
    .sort((a, b) => {
      if ((b.pickScore || 0) !== (a.pickScore || 0)) return (b.pickScore || 0) - (a.pickScore || 0);
      if ((b.scoreConfidence || 0) !== (a.scoreConfidence || 0)) return (b.scoreConfidence || 0) - (a.scoreConfidence || 0);
      return (b.overallScore || 0) - (a.overallScore || 0);
    })
    .map(book => Number(book.id))
    .slice(0, 24);
}

function syncNextBestQueue(booksToDisplay, forceRefresh = false) {
  const autoIds = getAutoQueueIds(booksToDisplay);

  if (forceRefresh) {
    const forced = autoIds.slice(0, 12);
    saveNextBestQueue(forced);
    return forced;
  }

  if (isQueueLocked()) {
    const existing = getNextBestQueue().map(Number);
    const lockedQueue = existing.filter(id => autoIds.includes(id)).slice(0, 12);
    saveNextBestQueue(lockedQueue);
    return lockedQueue;
  }

  const existing = getNextBestQueue();
  const retained = existing.filter(id => autoIds.includes(Number(id))).map(Number);
  const merged = [...retained, ...autoIds.filter(id => !retained.includes(id))].slice(0, 12);
  saveNextBestQueue(merged);
  return merged;
}

function moveQueueItem(bookId, direction, currentQueue) {
  const queue = [...currentQueue];
  const currentIndex = queue.indexOf(bookId);
  if (currentIndex < 0) return queue;

  const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (swapIndex < 0 || swapIndex >= queue.length) return queue;

  [queue[currentIndex], queue[swapIndex]] = [queue[swapIndex], queue[currentIndex]];
  saveNextBestQueue(queue);
  return queue;
}

function renderNextBestQueue(booksToDisplay, forceRefresh = false) {
  const container = document.getElementById("nextBestQueueList");
  if (!container) return;

  updateQueueModeChip();

  const queue = syncNextBestQueue(booksToDisplay, forceRefresh);
  const byId = new Map(allBooks.map(book => [Number(book.id), book]));

  if (!queue.length) {
    container.innerHTML = '<p class="recent-empty">No queue items for this filter set.</p>';
    return;
  }

  container.innerHTML = queue.map((id, index) => {
    const book = byId.get(Number(id));
    if (!book) return "";

    const quality = Number.isFinite(book.overallScore) ? `${book.overallScore}/100` : "N/A";
    const confidence = `${book.scoreConfidence || 0}%`;
    return `
      <div class="queue-item">
        <div class="queue-rank">${index + 1}</div>
        <div class="queue-main">
          <a class="recent-title" href="book.html?id=${book.id}">${book.title || "Untitled"}</a>
          <div class="recent-subtitle">${book.author || "Unknown author"} | quality ${quality} | confidence ${confidence}</div>
        </div>
        <div class="queue-actions">
          <button type="button" class="queue-move" data-id="${book.id}" data-direction="up" aria-label="Promote ${book.title}">Up</button>
          <button type="button" class="queue-move" data-id="${book.id}" data-direction="down" aria-label="Demote ${book.title}">Down</button>
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".queue-move").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const direction = button.dataset.direction;
      const nextQueue = moveQueueItem(id, direction, queue);
      saveNextBestQueue(nextQueue);
      renderNextBestQueue(booksToDisplay);
    });
  });
}

if (lockNextBestQueue) {
  lockNextBestQueue.checked = isQueueLocked();
  updateQueueModeChip();
  lockNextBestQueue.addEventListener("change", () => {
    saveQueueLocked(lockNextBestQueue.checked);
    displayBooks(getFilteredBooks());
  });
}

if (regenerateQueueButton) {
  regenerateQueueButton.addEventListener("click", () => {
    renderNextBestQueue(getFilteredBooks(), true);
  });
}

function renderTopPicks(booksToDisplay) {
  const container = document.getElementById("topPicksList");
  if (!container) return;

  const picks = [...booksToDisplay]
    .filter(book => Number.isFinite(book.overallScore))
    .sort((a, b) => {
      if ((b.pickScore || 0) !== (a.pickScore || 0)) return (b.pickScore || 0) - (a.pickScore || 0);
      return (b.overallScore || 0) - (a.overallScore || 0);
    })
    .slice(0, 5);

  if (!picks.length) {
    container.innerHTML = '<p class="recent-empty">No ranked picks for this filter set.</p>';
    return;
  }

  container.innerHTML = picks.map(book => {
    const quality = Number.isFinite(book.overallScore) ? `${book.overallScore}/100` : "N/A";
    const confidence = `${book.scoreConfidence || 0}% confidence`;
    const tier = scoreUtils.qualityTier(book.overallScore, book.scoreConfidence || 0);
    return `
      <a class="recent-link" href="book.html?id=${book.id}">
        <span class="recent-title">${book.title || "Untitled"}</span>
        <span class="recent-subtitle">${book.author || "Unknown author"}</span>
        <span class="recent-subtitle">${tier} | quality ${quality} | ${confidence}</span>
      </a>
    `;
  }).join("");
}

function populateAwardFilter() {
  const awards = new Set();

  allBooks.forEach(book => {
    const summary = book.award_summary || "";
    summary.split("|").forEach(entry => {
      const trimmed = entry.trim();
      const awardName = trimmed.match(/^([^\(]+)/);

      if (awardName && awardName[1]) {
        awards.add(awardName[1].trim());
      }
    });
  });

  const options = ["<option value=\"all\">All awards</option>"];
  [...awards].sort().forEach(award => {
    options.push(`<option value="${award}">${award}</option>`);
  });

  awardFilter.innerHTML = options.join("");
}

function populateGenreFilter() {
  const options = ["<option value=\"all\">All genres</option>"];
  CANONICAL_GENRES.forEach(genre => {
    options.push(`<option value="${genre}">${genre}</option>`);
  });

  genreFilter.innerHTML = options.join("");
}

function populateThemeFilter() {
  const themes = new Set();

  allBooks.forEach(book => {
    getBookTags(book).forEach(tag => themes.add(tag));
  });

  const options = ["<option value=\"all\">All motifs / concerns</option>"];
  [...themes].sort().forEach(theme => {
    options.push(`<option value="${theme}">${theme}</option>`);
  });

  themeFilter.innerHTML = options.join("");
}

function populatePreferenceChips() {
  const themes = new Set();

  allBooks.forEach(book => {
    getBookTags(book).forEach(tag => themes.add(tag));
  });

  const selectedPreferences = getSelectedPreferences();
  preferenceChips.innerHTML = [...themes].sort().map(theme => {
    const isSelected = selectedPreferences.includes(theme);
    return `<button class="pref-chip ${isSelected ? "active" : ""}" data-theme="${theme}">${theme}</button>`;
  }).join("");

  preferenceChips.querySelectorAll(".pref-chip").forEach(button => {
    button.addEventListener("click", () => {
      const theme = button.dataset.theme;
      const current = getSelectedPreferences();
      const next = current.includes(theme)
        ? current.filter(item => item !== theme)
        : [...current, theme];

      saveSelectedPreferences(next);
      populatePreferenceChips();
      refreshPreferenceScores();
      displayBooks(getFilteredBooks());
    });
  });
}

function refreshPreferenceScores() {
  allBooks = allBooks.map(enrichBook);
}

function getFilteredBooks() {
  const query = searchInput.value.toLowerCase();
  const awardSelection = awardFilter.value;
  const genreSelection = genreFilter.value;
  const themeSelection = themeFilter.value;
  const typeSelection = typeFilter.value;
  const yearSelection = yearFilter.value.trim();
  const favoritesOnly = showFavoritesOnly.checked;
  const completedOnly = showCompletedOnly.checked;
  const highConfidenceOnly = showHighConfidenceOnly.checked;
  const minimumQuality = Number(qualityFloor.value || 0);
  const favoriteIds = new Set(getFavoriteIds());
  const completedIds = new Set(getCompletedIds());

  return allBooks.filter(book => {
    const title = (book.title || "").toLowerCase();
    const author = (book.author || "").toLowerCase();
    const series = (book.series || "").toLowerCase();
    const awardSummary = (book.award_summary || "").toLowerCase();
    const genreTags = (book.genreTags || getBookGenreTags(book)).map(tag => tag.toLowerCase());
    const themeTags = getBookTags(book).map(tag => tag.toLowerCase());
    const yearValue = String(book.year || "");
    const typeValue = Number(book.standalone) === 1 || book.standalone === true ? "standalone" : "series";
    const matchesFavorites = !favoritesOnly || favoriteIds.has(Number(book.id));
    const matchesCompleted = !completedOnly || completedIds.has(Number(book.id));

    const matchesQuery = title.includes(query) || author.includes(query) || series.includes(query);
    const matchesAward = awardSelection === "all" || awardSummary.includes(awardSelection.toLowerCase());
    const matchesGenre = genreSelection === "all" || genreTags.includes(genreSelection.toLowerCase());
    const matchesTheme = themeSelection === "all" || themeTags.includes(themeSelection.toLowerCase());
    const matchesType = typeSelection === "all" || typeValue === typeSelection;
    const matchesYear = !yearSelection || yearValue === yearSelection;
    const matchesQuality = !minimumQuality || (Number.isFinite(book.overallScore) && book.overallScore >= minimumQuality);
    const matchesConfidence = !highConfidenceOnly || ((book.scoreConfidence || 0) >= 60 && (book.signalCount || 0) >= 3);

    return matchesQuery && matchesAward && matchesGenre && matchesTheme && matchesType && matchesYear && matchesFavorites && matchesCompleted && matchesQuality && matchesConfidence;
  });
}

function displayBooks(booksToDisplay) {
  let container = document.getElementById("books");
  container.innerHTML = "";

  const sortKey = sortOrder.value;
  const sortedBooks = [...booksToDisplay].sort((a, b) => {
    if (sortKey === "bestPick") return (b.pickScore || 0) - (a.pickScore || 0);
    if (sortKey === "confidence") return (b.scoreConfidence || 0) - (a.scoreConfidence || 0);
    if (sortKey === "overallRank") return (Number(a.overall_rank || 999999) - Number(b.overall_rank || 999999));
    if (sortKey === "audiobookRank") return (Number(a.audiobook_rank || 999999) - Number(b.audiobook_rank || 999999));
    if (sortKey === "redditRank") return (Number(a.reddit_rank || 999999) - Number(b.reddit_rank || 999999));
    if (sortKey === "title") return (a.title || "").localeCompare(b.title || "");
    return (b.overallScore || 0) - (a.overallScore || 0);
  });

  statusText.textContent = `${sortedBooks.length} book${sortedBooks.length === 1 ? "" : "s"} shown`;
  renderTopPicks(sortedBooks);
  renderNextBestQueue(sortedBooks);

  if (sortedBooks.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card">
        <h3>No books match these filters</h3>
        <p>Try clearing a filter or switching the sort order to broaden the view.</p>
      </div>
    `;
    return;
  }

  sortedBooks.forEach(book => {
    const awardSummary = book.award_summary || "None";
    const yearText = book.year || "N/A";
    const seriesText = book.series || "N/A";
    const genreText = (book.genreTags && book.genreTags.length)
      ? book.genreTags.join(" | ")
      : (book.genre || "N/A");
    const themesText = book.themes || "N/A";
    const typeText = Number(book.standalone) === 1 || book.standalone === true ? "Standalone" : "Series";
    const favoriteIds = new Set(getFavoriteIds());
    const completedIds = new Set(getCompletedIds());
    const isFavorite = favoriteIds.has(Number(book.id));
    const isCompleted = completedIds.has(Number(book.id));
    const favoriteButtonText = isFavorite ? "Favorite: Yes" : "Favorite: No";
    const completedButtonText = isCompleted ? "Completed: Yes" : "Completed: No";
    const overallScoreText = Number.isFinite(book.overallScore)
      ? `${book.overallScore}/100`
      : "Insufficient trusted rating data";
    const audiobookRatingValue = Number(book.audiobook_rating);
    const audiobookRatingText = Number.isFinite(audiobookRatingValue) && audiobookRatingValue > 0
      ? `${audiobookRatingValue.toFixed(1)}/5`
      : "N/A";
    const audiobookNarratorText = book.audiobook_narrator || "Unknown narrator";
    const confidenceText = `${book.scoreConfidence || 0}% confidence`;
    const qualityBadge = scoreUtils.qualityTier(book.overallScore, book.scoreConfidence || 0);
    const fitText = getSelectedPreferences().length
      ? `${Math.round((book.personalFit || 0) * 100)}% fit`
      : "No fit profile";
    const coverHtml = book.cover_url
      ? `<img src="${book.cover_url}" alt="${book.title}" class="cover-image" loading="lazy" onerror="this.onerror=null;this.src='images/placeholder-cover.svg';this.alt='Cover unavailable';">`
      : `<img src="images/placeholder-cover.svg" alt="Cover unavailable" class="cover-image">`;

    container.innerHTML += `
      <div class="book">
        <div class="book-card-layout">
          <div class="book-cover-cell">${coverHtml}</div>
          <div class="book-text-cell">
            <h2><a href="book.html?id=${book.id}">${book.title}</a></h2>
            <p><strong>Author:</strong> ${book.author || "Unknown"}</p>
            <p><strong>Year:</strong> ${yearText}</p>
            <p><strong>Series:</strong> ${seriesText}</p>
            <p><strong>Type:</strong> ${typeText}</p>
            <p><strong>Genre:</strong> ${genreText}</p>
            <p><strong>Motifs / concerns:</strong> ${themesText}</p>
            <p><strong>Audiobook:</strong> ${audiobookRatingText} by ${audiobookNarratorText}</p>
            <p><strong>Overall score:</strong> ${overallScoreText}</p>
            <p><strong>Quality tier:</strong> ${qualityBadge} (${confidenceText}, ${book.signalCount || 0} signals)</p>
            <p><strong>Personal fit:</strong> ${fitText}</p>
            <p><strong>Awards:</strong> ${summarizeAwards(awardSummary)}</p>
            <p>
              <button class="library-toggle favorite-toggle" data-book-id="${book.id}" data-mode="favorite">${favoriteButtonText}</button>
              <button class="library-toggle completed-toggle" data-book-id="${book.id}" data-mode="completed">${completedButtonText}</button>
            </p>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".favorite-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const bookId = Number(button.dataset.bookId);
      const favoriteIds = getFavoriteIds();
      const next = favoriteIds.includes(bookId)
        ? favoriteIds.filter(id => id !== bookId)
        : [...favoriteIds, bookId];
      saveFavoriteIds(next);
      displayBooks(getFilteredBooks());
    });
  });

  document.querySelectorAll(".completed-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const bookId = Number(button.dataset.bookId);
      const completedIds = getCompletedIds();
      const next = completedIds.includes(bookId)
        ? completedIds.filter(id => id !== bookId)
        : [...completedIds, bookId];
      saveCompletedIds(next);
      displayBooks(getFilteredBooks());
    });
  });
}

function applyFilters() {
  displayBooks(getFilteredBooks());
}

function focusAward(awardName) {
  const normalized = awardName.trim();
  const exists = Array.from(awardFilter.options).some(option => option.value === normalized);
  if (exists) {
    awardFilter.value = normalized;
  } else {
    awardFilter.value = "all";
  }
  applyFilters();
  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
}

document.querySelectorAll(".award-spotlight-card").forEach(button => {
  button.addEventListener("click", () => {
    focusAward(button.dataset.award || "");
  });
});

searchInput.addEventListener("input", applyFilters);
awardFilter.addEventListener("change", applyFilters);
genreFilter.addEventListener("change", applyFilters);
themeFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);
yearFilter.addEventListener("input", applyFilters);
sortOrder.addEventListener("change", applyFilters);
qualityFloor.addEventListener("change", applyFilters);
showFavoritesOnly.addEventListener("change", applyFilters);
showCompletedOnly.addEventListener("change", applyFilters);
showHighConfidenceOnly.addEventListener("change", applyFilters);

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  awardFilter.value = "all";
  genreFilter.value = "all";
  themeFilter.value = "all";
  typeFilter.value = "all";
  yearFilter.value = "";
  sortOrder.value = "overallScore";
  qualityFloor.value = "0";
  showFavoritesOnly.checked = false;
  showCompletedOnly.checked = false;
  showHighConfidenceOnly.checked = false;
  displayBooks(allBooks);
});
