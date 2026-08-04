const params = new URLSearchParams(window.location.search);
const bookId = Number(params.get("id"));
const noteInput = document.getElementById("noteInput");
const saveNoteButton = document.getElementById("saveNoteButton");
const bookMetaUtils = window.BookMetaUtils;
const scoreUtils = window.ScoreUtils;
const favoritesKey = "spec-fiction-favorites";
const completedKey = "spec-fiction-completed";
const recentlyViewedKey = "spec-fiction-recently-viewed";
const coverCacheKey = "spec-fiction-cover-cache";

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

async function resolveDetailCover(book) {
  const image = document.getElementById("detailCoverImage");
  if (!image) return;

  const key = bookMetaUtils.coverLookupKey(book);
  const cache = getCoverCache();
  let coverUrl = book.cover_url || cache[key] || null;

  if (!coverUrl) {
    coverUrl = bookMetaUtils.coverUrlFromIsbn(book.isbn);
  }
  if (!coverUrl) {
    coverUrl = await bookMetaUtils.fetchOpenLibraryCoverUrl(book.title, book.author);
  }
  if (!coverUrl) {
    coverUrl = await bookMetaUtils.fetchGoogleBooksCoverUrl(book.title, book.author);
  }
  if (!coverUrl) return;

  image.src = coverUrl;
  image.alt = book.title || "Book cover";
  if (cache[key] !== coverUrl) {
    cache[key] = coverUrl;
    setCoverCache(cache);
  }
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

function computeOverallScore(book) {
  return scoreUtils.computeOverallScore(book);
}

function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return Number.isFinite(value);
  const text = String(value).trim();
  return text !== "" && text.toLowerCase() !== "n/a";
}

function detailRow(label, value) {
  if (!hasValue(value)) return "";
  return `<p><strong>${label}:</strong> ${value}</p>`;
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

function trackRecentlyViewed(book) {
  const recentItems = getRecentlyViewed().filter(item => Number(item.id) !== Number(book.id));
  recentItems.unshift({
    id: book.id,
    title: book.title || "Untitled",
    author: book.author || "Unknown author"
  });
  saveRecentlyViewed(recentItems.slice(0, 4));
  renderRecentlyViewed();
}

function storageKey() {
  return `book-note-${bookId}`;
}

function loadNote() {
  return localStorage.getItem(storageKey()) || "";
}

function saveNote() {
  localStorage.setItem(storageKey(), noteInput.value);
  alert("Note saved locally.");
}

function makeRecommendations(books, currentBook) {
  const recommendationList = document.getElementById("recommendationList");
  const favoriteIds = new Set(getFavoriteIds());
  const completedIds = new Set(getCompletedIds());

  const currentThemes = ((currentBook.themes || "").split("|")).map(theme => theme.trim().toLowerCase()).filter(Boolean);
  const currentSharedSignals = [
    (currentBook.genre || "").trim().toLowerCase(),
    (currentBook.tone || "").trim().toLowerCase(),
    (currentBook.pacing || "").trim().toLowerCase(),
    (currentBook.series || "").trim().toLowerCase(),
    (currentBook.award_summary || "").trim().toLowerCase(),
    (currentBook.romance || "").trim().toLowerCase(),
    (currentBook.difficulty || "").trim().toLowerCase(),
    (currentBook.violence || "").trim().toLowerCase(),
    (currentBook.magic || "").trim().toLowerCase()
  ].filter(Boolean);

  const candidates = books
    .filter(book => Number(book.id) !== Number(currentBook.id))
    .map(book => {
      let score = 0;
      const bookThemes = ((book.themes || "").split("|")).map(theme => theme.trim().toLowerCase()).filter(Boolean);
      const sharedThemes = currentThemes.filter(theme => bookThemes.includes(theme));
      const bookSignals = [
        (book.genre || "").trim().toLowerCase(),
        (book.tone || "").trim().toLowerCase(),
        (book.pacing || "").trim().toLowerCase(),
        (book.series || "").trim().toLowerCase(),
        (book.award_summary || "").trim().toLowerCase(),
        (book.romance || "").trim().toLowerCase(),
        (book.difficulty || "").trim().toLowerCase(),
        (book.violence || "").trim().toLowerCase(),
        (book.magic || "").trim().toLowerCase()
      ].filter(Boolean);

      if ((book.author || "") === (currentBook.author || "")) score += 5;
      if ((book.genre || "") === (currentBook.genre || "")) score += 6;
      if ((book.tone || "") === (currentBook.tone || "")) score += 4;
      if ((book.pacing || "") === (currentBook.pacing || "")) score += 3;
      if ((book.series || "") === (currentBook.series || "")) score += 5;
      if ((book.award_summary || "") === (currentBook.award_summary || "")) score += 2;
      if ((book.romance || "") === (currentBook.romance || "")) score += 2;
      if ((book.difficulty || "") === (currentBook.difficulty || "")) score += 2;
      if ((book.violence || "") === (currentBook.violence || "")) score += 2;
      if ((book.magic || "") === (currentBook.magic || "")) score += 2;
      score += sharedThemes.length * 4;
      score += bookSignals.filter(signal => currentSharedSignals.includes(signal)).length * 2;

      // Blend similarity with quality so recommendation lists stay aspirational.
      const qualityScore = computeOverallScore(book);
      if (Number.isFinite(qualityScore)) {
        score += qualityScore / 8;
      }

      if (favoriteIds.has(Number(book.id))) score += 3;
      if (completedIds.has(Number(book.id))) score += 3;

      return {
        book,
        score,
        qualityScore,
        sharedThemes,
        isFavorite: favoriteIds.has(Number(book.id)),
        isCompleted: completedIds.has(Number(book.id))
      };
    })
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.book.title.localeCompare(b.book.title))
    .slice(0, 5);

  if (!candidates.length) {
    recommendationList.innerHTML = "<p>No similar books found in the current local dataset.</p>";
    return;
  }

  recommendationList.innerHTML = candidates
    .map(({ book, score, qualityScore, isFavorite, isCompleted, sharedThemes }) => {
      const shelfTag = [isFavorite ? "favorite" : null, isCompleted ? "completed" : null].filter(Boolean).join(" | ");
      const themeHint = sharedThemes.length ? ` shared themes: ${sharedThemes.join(", ")}` : "";
      const qualityHint = Number.isFinite(qualityScore) ? ` quality: ${qualityScore}/100` : "";
      return `<p><a href="book.html?id=${book.id}">${book.title}</a> - ${book.author} <em>(score: ${Math.round(score)})</em>${qualityHint ? `<br><small>${qualityHint}</small>` : ""}${shelfTag ? ` <strong>[${shelfTag}]</strong>` : ""}${themeHint ? `<br><small>${themeHint}</small>` : ""}</p>`;
    })
    .join("");
}

fetch("books.json", { cache: "no-store" })
  .then(response => response.json())
  .then(books => {
    const cleanedBooks = bookMetaUtils.cleanCatalog(books);
    const book = cleanedBooks.find(item => Number(item.id) === bookId);
    const container = document.getElementById("bookDetail");

    if (!book) {
      container.innerHTML = "<p>Book not found.</p>";
      return;
    }

    trackRecentlyViewed(book);

    const coverSrc = book.cover_url || "images/placeholder-cover.svg";
    const coverAlt = book.cover_url ? book.title : "Cover unavailable";
    const coverHtml = `<img id="detailCoverImage" src="${coverSrc}" alt="${coverAlt}" class="cover-image" loading="lazy" onerror="this.onerror=null;this.src='images/placeholder-cover.svg';this.alt='Cover unavailable';">`;

    const favoriteIds = new Set(getFavoriteIds());
    const completedIds = new Set(getCompletedIds());
    const isFavorite = favoriteIds.has(Number(book.id));
    const isCompleted = completedIds.has(Number(book.id));
    const favoriteButtonText = isFavorite ? "Favorite: Yes" : "Favorite: No";
    const completedButtonText = isCompleted ? "Completed: Yes" : "Completed: No";
    const overallScore = computeOverallScore(book);
    const overallScoreText = Number.isFinite(overallScore)
      ? `${overallScore}/100`
      : "Insufficient trusted rating data";
    const audiobookRatingValue = Number(book.audiobook_rating);
    const audiobookRatingText = Number.isFinite(audiobookRatingValue) && audiobookRatingValue > 0
      ? `${audiobookRatingValue.toFixed(1)}/5`
      : "N/A";
    const audiobookNarratorText = (book.audiobook_narrator || "").trim() || "Unknown narrator";

    const seriesLabel = book.standalone === 1 || book.standalone === true
      ? "Standalone"
      : "Series";

    const links = [];
    if (hasValue(book.goodreads_link)) {
      links.push(`<a href="${book.goodreads_link}" target="_blank" rel="noopener">Goodreads</a>`);
    }
    if (hasValue(book.libby_link)) {
      links.push(`<a href="${book.libby_link}" target="_blank" rel="noopener">Libby</a>`);
    }
    const linksRow = links.length ? `<p><strong>Links:</strong> ${links.join(" | ")}</p>` : "";

    const detailRows = [
      detailRow("Author", book.author),
      detailRow("Year", book.year),
      detailRow("Series", book.series),
      detailRow("Series Number", book.series_number),
      detailRow("Type", seriesLabel),
      detailRow("Pages", book.pages),
      detailRow("ISBN", book.isbn),
      detailRow("Publisher", book.publisher),
      detailRow("Language", book.language),
      detailRow("Summary", book.summary),
      detailRow("Genre", book.genre),
      detailRow("Themes", book.themes),
      detailRow("Pacing", book.pacing),
      detailRow("Tone", book.tone),
      detailRow("Romance", book.romance),
      detailRow("Difficulty", book.difficulty),
      detailRow("POV", book.pov),
      detailRow("Ending", book.ending),
      detailRow("Violence", book.violence),
      detailRow("Magic", book.magic),
      detailRow("Reddit Rank", book.reddit_rank),
      detailRow("Reddit Votes", book.reddit_votes),
      detailRow("Audiobook Rating", audiobookRatingText),
      detailRow("Audiobook Narrator", audiobookNarratorText),
      detailRow("Audiobook Rank", book.audiobook_rank),
      detailRow("Overall Rating", book.overall_rating),
      detailRow("Overall Rank", book.overall_rank),
      detailRow("Overall score", overallScoreText),
      detailRow("Awards", summarizeAwards(book.award_summary))
    ].filter(Boolean).join("");

    container.innerHTML = `
      <div class="book detail-book">
        <div class="detail-layout">
          <div class="detail-cover">${coverHtml}</div>
          <div class="detail-content">
            <h2>${book.title}</h2>
            ${detailRows}
            <p>
              <button id="favoriteBookButton">${favoriteButtonText}</button>
              <button id="completedBookButton">${completedButtonText}</button>
            </p>
            ${linksRow}
          </div>
        </div>
      </div>
    `;

    document.getElementById("favoriteBookButton").addEventListener("click", () => {
      const favoriteIds = getFavoriteIds();
      const next = favoriteIds.includes(bookId)
        ? favoriteIds.filter(id => id !== bookId)
        : [...favoriteIds, bookId];
      saveFavoriteIds(next);
      window.location.reload();
    });

    document.getElementById("completedBookButton").addEventListener("click", () => {
      const completedIds = getCompletedIds();
      const next = completedIds.includes(bookId)
        ? completedIds.filter(id => id !== bookId)
        : [...completedIds, bookId];
      saveCompletedIds(next);
      window.location.reload();
    });

    resolveDetailCover(book);
    makeRecommendations(cleanedBooks, book);
    noteInput.value = loadNote();
    saveNoteButton.addEventListener("click", saveNote);
  })
  .catch(error => {
    console.error("Error loading book details:", error);
    document.getElementById("bookDetail").innerHTML = "<p>Unable to load book details.</p>";
  });
