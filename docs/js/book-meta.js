(function bookMetaModule() {
  const AUDIOBOOK_OVERRIDE_ROWS = [
    ["A Desolation Called Peace", "Arkady Martine", 4.4, "Amy Landon"],
    ["A Fire Upon the Deep", "Vernor Vinge", 4.1, "Peter Larkin"],
    ["A Memory Called Empire", "Arkady Martine", 4.3, "Amy Landon"],
    ["All Systems Red", "Martha Wells", 4.6, "Kevin R. Free"],
    ["Anathem", "Neal Stephenson", 4.2, "William Dufris"],
    ["Children of Time", "Adrian Tchaikovsky", 4.5, "Mel Hudson"],
    ["Dune", "Frank Herbert", 4.6, "Scott Brick and ensemble cast"],
    ["Left Hand of Darkness", "Ursula K. Le Guin", 4.2, "George Guidall"],
    ["Neuromancer", "William Gibson", 4.0, "Robertson Dean"],
    ["The City & The City", "China Mieville", 4.0, "John Lee"],
    ["The Fifth Season", "N.K. Jemisin", 4.6, "Robin Miles"],
    ["The Name of the Wind", "Patrick Rothfuss", 4.7, "Nick Podehl"],
    ["The Obelisk Gate", "N.K. Jemisin", 4.5, "Robin Miles"],
    ["The Stone Sky", "N.K. Jemisin", 4.5, "Robin Miles"],
    ["The Way of Kings", "Brandon Sanderson", 4.8, "Michael Kramer and Kate Reading"]
  ];

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s&]/gi, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function normalizeTitle(value) {
    return normalizeText(value).replace(/^the\s+/, "");
  }

  function bookKey(book) {
    return `${normalizeTitle(book.title)}|${normalizeText(book.author)}`;
  }

  function keyFromParts(title, author) {
    return `${normalizeTitle(title)}|${normalizeText(author)}`;
  }

  function coverLookupKey(book) {
    return keyFromParts(book.title, book.author);
  }

  function coverUrlFromIsbn(isbn) {
    const clean = String(isbn || "").replace(/[^0-9Xx]/g, "").trim();
    if (!clean) return null;
    return `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg?default=false`;
  }

  function titleAuthorLikelyMatch(targetTitle, targetAuthor, doc) {
    const targetTitleNorm = normalizeTitle(targetTitle);
    const targetAuthorNorm = normalizeText(targetAuthor);
    const docTitleNorm = normalizeTitle(doc.title || "");
    const docAuthorNorm = normalizeText((doc.author_name || []).join(" "));

    if (!docTitleNorm) return false;

    const titleMatch = (
      docTitleNorm === targetTitleNorm
      || docTitleNorm.includes(targetTitleNorm)
      || targetTitleNorm.includes(docTitleNorm)
    );
    if (!titleMatch) return false;

    if (!docAuthorNorm || !targetAuthorNorm) return true;
    return docAuthorNorm.includes(targetAuthorNorm) || targetAuthorNorm.includes(docAuthorNorm);
  }

  function titleLikelyMatch(targetTitle, docTitle) {
    const targetTitleNorm = normalizeTitle(targetTitle);
    const docTitleNorm = normalizeTitle(docTitle || "");
    if (!targetTitleNorm || !docTitleNorm) return false;

    return (
      docTitleNorm === targetTitleNorm
      || docTitleNorm.includes(targetTitleNorm)
      || targetTitleNorm.includes(docTitleNorm)
    );
  }

  function chooseBestCoverDoc(title, author, docs) {
    const withCover = docs.filter((doc) => Number.isFinite(Number(doc.cover_i)));
    if (!withCover.length) return null;

    const strict = withCover.find((doc) => titleAuthorLikelyMatch(title, author, doc));
    if (strict) return strict;

    const titleOnly = withCover.find((doc) => titleLikelyMatch(title, doc.title));
    if (titleOnly) return titleOnly;

    return null;
  }

  async function searchOpenLibraryDocs(query) {
    const response = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=8`);
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload.docs) ? payload.docs : [];
  }

  async function fetchOpenLibraryCoverUrl(title, author) {
    const combined = `${title || ""} ${author || ""}`.trim();
    const titleOnly = `${title || ""}`.trim();
    if (!combined && !titleOnly) return null;

    try {
      let docs = [];
      if (combined) {
        docs = await searchOpenLibraryDocs(encodeURIComponent(combined));
      }

      let best = chooseBestCoverDoc(title, author, docs);
      if (!best && titleOnly) {
        const fallbackDocs = await searchOpenLibraryDocs(encodeURIComponent(titleOnly));
        best = chooseBestCoverDoc(title, author, fallbackDocs);
      }
      if (!best) return null;

      return `https://covers.openlibrary.org/b/id/${best.cover_i}-L.jpg`;
    } catch {
      return null;
    }
  }

  function normalizeGoogleImageUrl(url) {
    const text = String(url || "").trim();
    if (!text) return null;
    return text.replace(/^http:\/\//i, "https://");
  }

  function titleAuthorLikelyMatchGoogle(targetTitle, targetAuthor, item) {
    const info = item.volumeInfo || {};
    const titleMatch = titleLikelyMatch(targetTitle, info.title || "");
    if (!titleMatch) return false;

    const targetAuthorNorm = normalizeText(targetAuthor);
    const authorNames = Array.isArray(info.authors) ? info.authors : [];
    const authorNorm = normalizeText(authorNames.join(" "));
    if (!targetAuthorNorm || !authorNorm) return true;

    return authorNorm.includes(targetAuthorNorm) || targetAuthorNorm.includes(authorNorm);
  }

  function chooseBestGoogleItem(title, author, items) {
    const withImage = (items || []).filter((item) => {
      const links = (item && item.volumeInfo && item.volumeInfo.imageLinks) || {};
      return Boolean(links.thumbnail || links.smallThumbnail);
    });
    if (!withImage.length) return null;

    const strict = withImage.find((item) => titleAuthorLikelyMatchGoogle(title, author, item));
    if (strict) return strict;

    return withImage.find((item) => titleLikelyMatch(title, (item.volumeInfo || {}).title || "")) || null;
  }

  async function fetchGoogleBooksCoverUrl(title, author) {
    const titlePart = String(title || "").trim();
    const authorPart = String(author || "").trim();
    if (!titlePart && !authorPart) return null;

    const titleQuery = titlePart ? `intitle:${titlePart}` : "";
    const authorQuery = authorPart ? `inauthor:${authorPart}` : "";
    const query = [titleQuery, authorQuery].filter(Boolean).join(" ");
    if (!query) return null;

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=8&printType=books`);
      if (!response.ok) return null;
      const payload = await response.json();
      const items = Array.isArray(payload.items) ? payload.items : [];
      const best = chooseBestGoogleItem(title, author, items);
      if (!best) return null;

      const links = (best.volumeInfo && best.volumeInfo.imageLinks) || {};
      return normalizeGoogleImageUrl(links.thumbnail || links.smallThumbnail || "");
    } catch {
      return null;
    }
  }

  const AUDIOBOOK_OVERRIDES = AUDIOBOOK_OVERRIDE_ROWS.reduce((map, [title, author, rating, narrator]) => {
    map[keyFromParts(title, author)] = {
      audiobook_rating: rating,
      audiobook_narrator: narrator
    };
    return map;
  }, {});

  function isValidBookRecord(book) {
    const title = normalizeText(book.title);
    const author = normalizeText(book.author);
    if (!title || !author) return false;
    if (title === "title" && author === "author") return false;
    return true;
  }

  function toNumberOrNull(value) {
    const num = Number(value);
    return Number.isFinite(num) && num > 0 ? num : null;
  }

  function enrichBookMetadata(book) {
    const key = bookKey(book);
    const override = AUDIOBOOK_OVERRIDES[key] || null;
    const audiobookRating = toNumberOrNull(book.audiobook_rating) || (override ? override.audiobook_rating : null);
    const audiobookNarrator = (book.audiobook_narrator || book.narrator || "").trim() || (override ? override.audiobook_narrator : "Unknown narrator");
    const overallRating = toNumberOrNull(book.overall_rating) || audiobookRating;

    return {
      ...book,
      audiobook_rating: audiobookRating,
      audiobook_narrator: audiobookNarrator,
      overall_rating: overallRating,
      rating_source: book.overall_rating ? "source" : (audiobookRating ? "audiobook-proxy" : "missing")
    };
  }

  function cleanCatalog(books) {
    const deduped = new Map();

    (books || []).forEach((book) => {
      if (!isValidBookRecord(book)) return;
      const key = bookKey(book);
      const candidate = enrichBookMetadata(book);
      const existing = deduped.get(key);

      if (!existing) {
        deduped.set(key, candidate);
        return;
      }

      const existingSignals = (toNumberOrNull(existing.overall_rating) ? 1 : 0) + (toNumberOrNull(existing.audiobook_rating) ? 1 : 0) + ((existing.award_summary || "").trim() ? 1 : 0);
      const candidateSignals = (toNumberOrNull(candidate.overall_rating) ? 1 : 0) + (toNumberOrNull(candidate.audiobook_rating) ? 1 : 0) + ((candidate.award_summary || "").trim() ? 1 : 0);

      if (candidateSignals > existingSignals) {
        deduped.set(key, candidate);
      }
    });

    return Array.from(deduped.values());
  }

  window.BookMetaUtils = {
    cleanCatalog,
    enrichBookMetadata,
    normalizeText,
    normalizeTitle,
    coverLookupKey,
    coverUrlFromIsbn,
    fetchOpenLibraryCoverUrl,
    fetchGoogleBooksCoverUrl
  };
})();
