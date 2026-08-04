const POLL_META = {
  sourceName: "r/Fantasy Top Novels 2025 Results",
  sourceUrl: "https://www.reddit.com/r/Fantasy/comments/1jjif55/rfantasy_top_novels_2025_results/",
  individualVoters: 1074,
  totalVotesApprox: 10000,
  fullListEntriesApprox: 1348
};

const RANKINGS = [
  { rank: 1, title: "Middle-Earth Universe", votes: 404, author: "J.R.R. Tolkien", change: "1" },
  { rank: 2, title: "First Law World", votes: 353, author: "Joe Abercrombie", change: "1" },
  { rank: 3, title: "A Song of Ice and Fire", votes: 336, author: "George R.R. Martin", change: "1" },
  { rank: 4, title: "The Stormlight Archive", votes: 293, author: "Brandon Sanderson", change: "-3" },
  { rank: 5, title: "Realm of the Elderlings", votes: 269, author: "Robin Hobb", change: "2" },
  { rank: 6, title: "Malazan Universe", votes: 240, author: "Steven Erikson and Ian C. Esslemont", change: "3" },
  { rank: 7, title: "Wheel of Time", votes: 222, author: "Robert Jordan", change: "-1" },
  { rank: 8, title: "Discworld", votes: 210, author: "Terry Pratchett", change: "0" },
  { rank: 8, title: "Mistborn", votes: 210, author: "Brandon Sanderson", change: "-3" },
  { rank: 10, title: "The Green Bone Saga", votes: 163, author: "Fonda Lee", change: "0" },
  { rank: 11, title: "Red Rising", votes: 160, author: "Pierce Brown", change: "0" },
  { rank: 12, title: "Harry Potter", votes: 145, author: "J.K. Rowling", change: "0" },
  { rank: 13, title: "Gentleman Bastard", votes: 130, author: "Scott Lynch", change: "-2" },
  { rank: 14, title: "Piranesi", votes: 118, author: "Susanna Clarke", change: "9" },
  { rank: 15, title: "Dune", votes: 117, author: "Frank Herbert", change: "0" },
  { rank: 16, title: "Earthsea Cycle", votes: 113, author: "Ursula K. Le Guin", change: "4" },
  { rank: 17, title: "Dungeon Crawler Carl", votes: 112, author: "Matt Dinniman", change: "103" },
  { rank: 18, title: "The Kingkiller Chronicle", votes: 111, author: "Patrick Rothfuss", change: "-5" },
  { rank: 19, title: "The Locked Tomb", votes: 98, author: "Tamsyn Muir", change: "2" },
  { rank: 20, title: "Cradle", votes: 96, author: "Will Wight", change: "-3" },
  { rank: 21, title: "The Murderbot Diaries", votes: 92, author: "Martha Wells", change: "-3" },
  { rank: 22, title: "The Wandering Inn", votes: 85, author: "Pirateaba", change: "79" },
  { rank: 23, title: "The Broken Earth", votes: 84, author: "N.K. Jemisin", change: "-4" },
  { rank: 24, title: "Sun Eater", votes: 81, author: "Christopher Ruocchio", change: "57" },
  { rank: 25, title: "The Expanse", votes: 77, author: "James S.A. Corey", change: "0" },
  { rank: 26, title: "Osten Ard Saga", votes: 74, author: "Tad Williams", change: "17" },
  { rank: 27, title: "Jonathan Strange & Mr Norrell", votes: 72, author: "Susanna Clarke", change: "0" },
  { rank: 28, title: "The Dresden Files", votes: 69, author: "Jim Butcher", change: "-12" },
  { rank: 29, title: "Hierarchy", votes: 66, author: "James Islington", change: "NEW" },
  { rank: 29, title: "Sarantine Universe", votes: 66, author: "Guy Gavriel Kay", change: "60" },
  { rank: 31, title: "Hainish Cycle", votes: 65, author: "Ursula K. Le Guin", change: "8" },
  { rank: 32, title: "The Broken Empire Universe", votes: 58, author: "Mark Lawrence", change: "69" },
  { rank: 33, title: "The Chronicles of Osreth", votes: 57, author: "Katherine Addison", change: "3" },
  { rank: 34, title: "The Second Apocalypse", votes: 55, author: "R. Scott Bakker", change: "27" },
  { rank: 35, title: "Cosmere", votes: 54, author: "Brandon Sanderson", change: "NEW" },
  { rank: 36, title: "His Dark Materials", votes: 52, author: "Philip Pullman", change: "-8" },
  { rank: 36, title: "The Witcher", votes: 52, author: "Andrzej Sapkowski", change: "-14" },
  { rank: 36, title: "The Chronicles of the Black Company", votes: 52, author: "Glen Cook", change: "17" },
  { rank: 36, title: "Solar Cycle", votes: 52, author: "Gene Wolfe", change: "3" },
  { rank: 40, title: "The Dark Tower", votes: 50, author: "Stephen King", change: "-16" },
  { rank: 40, title: "The Scholomance", votes: 50, author: "Naomi Novik", change: "12" },
  { rank: 40, title: "Hyperion Cantos", votes: 50, author: "Dan Simmons", change: "-14" },
  { rank: 43, title: "Project Hail Mary", votes: 48, author: "Andy Weir", change: "2" },
  { rank: 44, title: "The Dandelion Dynasty", votes: 47, author: "Ken Liu", change: "40" },
  { rank: 45, title: "The Sword of Kaigen", votes: 46, author: "M.L. Wang", change: "31" },
  { rank: 46, title: "World of the Five Gods", votes: 45, author: "Lois McMaster Bujold", change: "-1" },
  { rank: 47, title: "The Spear Cuts Through Water", votes: 44, author: "Simon Jimenez", change: "188" },
  { rank: 48, title: "Wayfarers", votes: 43, author: "Becky Chambers", change: "-16" },
  { rank: 49, title: "Riyria Revelations", votes: 42, author: "Michael J. Sullivan", change: "-15" },
  { rank: 50, title: "One Piece", votes: 41, author: "Eiichiro Oda", change: "7" },
  { rank: 51, title: "The Banished Lands", votes: 40, author: "John Gwynne", change: "-15" },
  { rank: 51, title: "Vorkosigan Saga", votes: 40, author: "Lois McMaster Bujold", change: "33" },
  { rank: 53, title: "Blood Over Bright Haven", votes: 35, author: "M.L. Wang", change: "NEW" },
  { rank: 53, title: "Ender's Saga", votes: 35, author: "Orson Scott Card", change: "-5" },
  { rank: 53, title: "Kushiel's Universe", votes: 35, author: "Jacqueline Carey", change: "8" },
  { rank: 56, title: "The Masquerade", votes: 34, author: "Seth Dickinson", change: "-3" },
  { rank: 56, title: "Shadow of the Leviathan", votes: 34, author: "Robert Jackson Bennett", change: "NEW" },
  { rank: 56, title: "Teixcalaan", votes: 34, author: "Arkady Martine", change: "-15" },
  { rank: 59, title: "This Is How You Lose the Time War", votes: 33, author: "Amal El-Mohtar and Max Gladstone", change: "22" },
  { rank: 60, title: "Children of Time", votes: 32, author: "Adrian Tchaikovsky", change: "-25" },
  { rank: 60, title: "New Crobuzon", votes: 32, author: "China Mieville", change: "18" },
  { rank: 60, title: "Tortall", votes: 32, author: "Tamora Pierce", change: "5" },
  { rank: 60, title: "Remembrance of Earth's Past", votes: 32, author: "Cixin Liu", change: "10" },
  { rank: 64, title: "Hitchhiker's Guide to the Galaxy", votes: 31, author: "Douglas Adams", change: "-33" },
  { rank: 64, title: "The Old Kingdom", votes: 31, author: "Garth Nix", change: "-16" },
  { rank: 66, title: "The Library at Mount Char", votes: 30, author: "Scott Hawkins", change: "-1" },
  { rank: 67, title: "Blacktongue", votes: 29, author: "Christopher Buehlman", change: "26" },
  { rank: 67, title: "Grishaverse", votes: 29, author: "Leigh Bardugo", change: "-9" },
  { rank: 69, title: "Tigana", votes: 27, author: "Guy Gavriel Kay", change: "-8" },
  { rank: 69, title: "The Band", votes: 27, author: "Nicholas Eames", change: "-33" },
  { rank: 69, title: "Powder Mage", votes: 27, author: "Brian McClellan", change: "-26" },
  { rank: 72, title: "The Left Hand of Darkness", votes: 26, author: "Ursula K. Le Guin", change: "-33" },
  { rank: 72, title: "Rook & Rose", votes: 26, author: "M.A. Carrick", change: "54" },
  { rank: 72, title: "Circe", votes: 26, author: "Madeline Miller", change: "-22" },
  { rank: 72, title: "Gormenghast", votes: 26, author: "Mervyn Peake", change: "21" },
  { rank: 83, title: "Between Two Fires", votes: 23, author: "Christopher Buehlman", change: "100" },
  { rank: 83, title: "The World of the White Rat", votes: 23, author: "T. Kingfisher", change: "54" },
  { rank: 89, title: "The Dispossessed", votes: 22, author: "Ursula K. Le Guin", change: "-50" },
  { rank: 89, title: "Lays of the Hearth-Fire", votes: 22, author: "Victoria Goddard", change: "58" },
  { rank: 89, title: "Frankenstein", votes: 22, author: "Mary Shelley", change: "78" },
  { rank: 96, title: "The Song of Achilles", votes: 20, author: "Madeline Miller", change: "-18" },
  { rank: 96, title: "The Tide Child", votes: 20, author: "R.J. Barker", change: "12" },
  { rank: 98, title: "Wars of Light and Shadow", votes: 19, author: "Janny Wurts", change: "28" },
  { rank: 98, title: "The Books of the Raksura", votes: 19, author: "Martha Wells", change: "22" },
  { rank: 102, title: "The Hunger Games", votes: 18, author: "Suzanne Collins", change: "81" },
  { rank: 103, title: "Percy Jackson and the Olympians", votes: 17, author: "Rick Riordan", change: "-74" },
  { rank: 105, title: "Watership Down", votes: 16, author: "Richard Adams", change: "207" },
  { rank: 105, title: "The Books of Babel", votes: 16, author: "Josiah Bancroft", change: "-76" },
  { rank: 111, title: "Babel", votes: 15, author: "R.F. Kuang", change: "15" },
  { rank: 114, title: "1984", votes: 14, author: "George Orwell", change: "87" },
  { rank: 114, title: "Craft Sequence", votes: 14, author: "Max Gladstone", change: "53" },
  { rank: 122, title: "A Practical Guide to Evil", votes: 13, author: "ErraticErrata", change: "113" },
  { rank: 122, title: "Lightbringer", votes: 13, author: "Brent Weeks", change: "-69" },
  { rank: 133, title: "House of Leaves", votes: 12, author: "Mark Z. Danielewski", change: "402" },
  { rank: 133, title: "Legends and Lattes", votes: 12, author: "Travis Baldree", change: "-75" },
  { rank: 139, title: "Warbreaker", votes: 11, author: "Brandon Sanderson", change: "-98" },
  { rank: 139, title: "Cloud Atlas", votes: 11, author: "David Mitchell", change: "239" },
  { rank: 139, title: "The Tyrant Philosophers", votes: 11, author: "Adrian Tchaikovsky", change: "NEW" },
  { rank: 150, title: "The Empyrean", votes: 10, author: "Rebecca Yarros", change: "NEW" },
  { rank: 150, title: "Emily Wilde", votes: 10, author: "Heather Fawcett", change: "NEW" },
  { rank: 150, title: "Watchmen", votes: 10, author: "Alan Moore and Dave Gibbons", change: "228" },
  { rank: 161, title: "Beware of Chicken", votes: 9, author: "CasualFarmer", change: "217" },
  { rank: 161, title: "Covenant of Steel", votes: 9, author: "Anthony Ryan", change: "374" },
  { rank: 161, title: "The Poppy War", votes: 9, author: "R.F. Kuang", change: "-96" },
  { rank: 183, title: "A Court of Thorns and Roses", votes: 8, author: "Sarah J. Maas", change: "352" },
  { rank: 183, title: "The Emperor's Soul", votes: 8, author: "Brandon Sanderson", change: "-99" },
  { rank: 198, title: "The Little Prince", votes: 7, author: "Antoine de Saint-Exupery", change: "NEW" },
  { rank: 198, title: "Fallen Gods", votes: 7, author: "Hannah Kaner", change: "337" },
  { rank: 212, title: "The Stand", votes: 6, author: "Stephen King", change: "-111" },
  { rank: 212, title: "Revelation Space", votes: 6, author: "Alastair Reynolds", change: "166" },
  { rank: 212, title: "American Gods", votes: 6, author: "Neil Gaiman", change: "-167" },
  { rank: 212, title: "The Sign of the Dragon", votes: 6, author: "Mary Soon Lee", change: "323" },
  { rank: 247, title: "Cyteen", votes: 5, author: "C.J. Cherryh", change: "288" },
  { rank: 247, title: "I Who Have Never Known Men", votes: 5, author: "Jacqueline Harpman", change: "NEW" },
  { rank: 247, title: "The Reformatory", votes: 5, author: "Tananarive Due", change: "NEW" },
  { rank: 247, title: "Pale", votes: 5, author: "Wildbow", change: "NEW" },
  { rank: 247, title: "The Lathe of Heaven", votes: 5, author: "Ursula K. Le Guin", change: "NEW" },
  { rank: 247, title: "The Invisible Life of Addie LaRue", votes: 5, author: "V.E. Schwab", change: "-80" },
  { rank: 247, title: "Frieren: Beyond Journey's End", votes: 5, author: "Kanehito Yamada", change: "NEW" },
  { rank: 247, title: "Chain-Gang All-Stars", votes: 5, author: "Nana Kwame Adjei-Brenyah", change: "NEW" }
].map((row) => ({
  ...row,
  searchText: `${row.title} ${row.author}`.toLowerCase(),
  movement: movementType(row.change),
  movementValue: parseChange(row.change) || 0
}));

const redditStateKey = "reddit-2025-explorer-state";
const explorerPageSize = 30;
let visibleRows = explorerPageSize;
let searchTimer;

function parseChange(changeValue) {
  if (changeValue === "NEW") {
    return null;
  }
  const parsed = Number.parseInt(changeValue, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function movementType(changeValue) {
  if (changeValue === "NEW") {
    return "new";
  }
  const numeric = parseChange(changeValue);
  if (numeric > 1) {
    return "up";
  }
  if (numeric < -1) {
    return "down";
  }
  return "flat";
}

function signalLabel(row) {
  const movement = movementType(row.change);
  if (movement === "new") {
    return "New in 2025 cut";
  }
  const delta = parseChange(row.change);
  if (delta >= 50) {
    return "Breakout momentum";
  }
  if (delta >= 15) {
    return "Strong upward pressure";
  }
  if (delta <= -50) {
    return "Major pullback";
  }
  if (delta <= -15) {
    return "Cooling";
  }
  return "Stable core";
}

function summarizeStats(rows) {
  const top10Votes = rows.filter((row) => row.rank <= 10).reduce((acc, row) => acc + row.votes, 0);
  const top25Votes = rows.filter((row) => row.rank <= 25).reduce((acc, row) => acc + row.votes, 0);
  const moversUp = rows.filter((row) => movementType(row.change) === "up").length;
  const moversDown = rows.filter((row) => movementType(row.change) === "down").length;
  const newEntries = rows.filter((row) => movementType(row.change) === "new").length;

  const byAuthor = new Map();
  rows.forEach((row) => {
    byAuthor.set(row.author, (byAuthor.get(row.author) || 0) + 1);
  });
  const topAuthor = [...byAuthor.entries()].sort((a, b) => b[1] - a[1])[0];

  return {
    top10Votes,
    top25Votes,
    moversUp,
    moversDown,
    newEntries,
    topAuthor
  };
}

function renderStats(rows) {
  const stats = summarizeStats(rows);
  const grid = document.getElementById("statsGrid");
  grid.innerHTML = "";

  const cards = [
    {
      label: "Individual ballots",
      value: POLL_META.individualVoters.toLocaleString(),
      note: "From poll host summary"
    },
    {
      label: "Total votes",
      value: `${POLL_META.totalVotesApprox.toLocaleString()}+`,
      note: "Across all nominated entries"
    },
    {
      label: "Full list size",
      value: `${POLL_META.fullListEntriesApprox.toLocaleString()}+`,
      note: "Series and standalone entries"
    },
    {
      label: "Top-10 vote mass",
      value: stats.top10Votes.toLocaleString(),
      note: "Concentration in the elite tier"
    },
    {
      label: "Top-25 vote mass",
      value: stats.top25Votes.toLocaleString(),
      note: "Where consensus is strongest"
    },
    {
      label: "Observed movement split",
      value: `${stats.moversUp} up / ${stats.moversDown} down`,
      note: `${stats.newEntries} new entries in this extracted set`
    }
  ];

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "stat-card";
    article.innerHTML = `
      <div class="stat-label">${card.label}</div>
      <div class="stat-value">${card.value}</div>
      <div class="stat-footnote">${card.note}</div>
    `;
    grid.appendChild(article);
  });
}

function renderTrendCards(rows) {
  const trendRoot = document.getElementById("trendCards");
  trendRoot.innerHTML = "";

  const risers = rows
    .filter((row) => movementType(row.change) === "up")
    .sort((a, b) => parseChange(b.change) - parseChange(a.change))
    .slice(0, 6);

  const fallers = rows
    .filter((row) => movementType(row.change) === "down")
    .sort((a, b) => parseChange(a.change) - parseChange(b.change))
    .slice(0, 6);

  const newEntries = rows
    .filter((row) => movementType(row.change) === "new")
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 6);

  const topSlice = rows.filter((row) => row.rank <= 20);
  const topSliceTotal = topSlice.reduce((acc, row) => acc + row.votes, 0);
  const sandersonVotes = topSlice
    .filter((row) => row.author.includes("Sanderson"))
    .reduce((acc, row) => acc + row.votes, 0);
  const sandersonShare = topSliceTotal > 0 ? Math.round((sandersonVotes / topSliceTotal) * 100) : 0;

  const cards = [
    {
      title: "Fastest climbers",
      items: risers.map((row) => `#${row.rank} ${titleLink(row)} (${row.change})`)
    },
    {
      title: "Steepest declines",
      items: fallers.map((row) => `#${row.rank} ${titleLink(row)} (${row.change})`)
    },
    {
      title: "Strong new arrivals",
      items: newEntries.map((row) => `#${row.rank} ${titleLink(row)} (${row.votes} votes)`)
    },
    {
      title: "Top-tier concentration",
      items: [
        `Top 20 rows in extracted set hold ${topSliceTotal} votes`,
        `Sanderson-linked top-20 share in this cut: ${sandersonShare}% (${topSlice.filter((row) => row.author.includes("Sanderson")).map((row) => titleLink(row)).join(", ")})`,
        "Interpret with caution because aggregation policy is still debated"
      ]
    }
  ];

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "insight-card";
    const list = card.items.map((item) => `<li>${item}</li>`).join("");
    article.innerHTML = `<h4>${card.title}</h4><ul>${list}</ul>`;
    trendRoot.appendChild(article);
  });
}

function renderRecommendationCards() {
  const root = document.getElementById("recommendationCards");
  root.innerHTML = "";

  const cards = [
    {
      title: "Modern consensus starter lane",
      bullets: [
        "Start with First Law, Green Bone, and Piranesi",
        "Then branch to Locked Tomb and Murderbot",
        "Use this lane if you want high community overlap"
      ]
    },
    {
      title: "Momentum and breakout lane",
      bullets: [
        "Dungeon Crawler Carl and The Wandering Inn for fast fandom acceleration",
        "Sun Eater and The Spear Cuts Through Water for sharp upward movement",
        "Add Between Two Fires if you want a cult-to-mainstream crossover"
      ]
    },
    {
      title: "Classic rebound lane",
      bullets: [
        "Frankenstein, 1984, and Watership Down show classic recirculation",
        "Pair with Earthsea or Hainish titles to trace lineage",
        "Useful for readers balancing canon and modern taste"
      ]
    },
    {
      title: "High-volatility lane",
      bullets: [
        "Inspect large drops as opportunity picks: Warbreaker, The Stand, American Gods",
        "Check whether decline is recency fatigue or durable preference shift",
        "Best lane for contrarian and completionist readers"
      ]
    }
  ];

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "insight-card";
    const list = card.bullets.map((bullet) => `<li>${bullet}</li>`).join("");
    article.innerHTML = `<h4>${card.title}</h4><ul>${list}</ul>`;
    root.appendChild(article);
  });
}

function renderCommentarySignals() {
  const root = document.getElementById("commentarySignals");
  const signals = [
    "Middle-Earth retakes #1, ending Stormlight's multi-cycle lead.",
    "First Law reaches #2, indicating sustained long-term momentum.",
    "Dungeon Crawler Carl and Wandering Inn jumps are treated as major fandom-surge events.",
    "Multiple users flagged data-normalization issues (duplicate naming and clumping rules).",
    "Cosmere handling as separate vs consolidated entries is a key methodological pressure point for next cycle.",
    "Readers noted stronger crossover with classics and literary speculative fiction in this cycle.",
    "Several commenters interpret steep declines as taste realignment rather than pure quality loss."
  ];
  root.innerHTML = signals.map((signal) => `<li>${signal}</li>`).join("");
}

function renderDataCaveats() {
  const root = document.getElementById("dataCaveats");
  const caveats = [
    "Universe aggregation is inconsistent in places (for example: separate Sanderson sub-series plus a Cosmere umbrella row).",
    "Potential duplicate naming can split votes (examples called out by readers include Bobiverse and The Siege variants on the full list).",
    "Franchise-level vs book-level voting can mix scopes (for example: Hainish titles as both cycle and standalone entries).",
    "Alias or alternate-title handling may redirect votes unevenly (for example: The Golden Compass vs His Dark Materials discussion).",
    "Clumping policy debates continue for connected works (for example: Lions of Al-Rassan vs Sarantine universe grouping).",
    "Some movement likely reflects community mobilization effects, not only long-term canon shift."
  ];
  root.innerHTML = caveats.map((item) => `<li>${item}</li>`).join("");
}

function movementPill(changeValue) {
  const movement = movementType(changeValue);
  if (movement === "new") {
    return '<span class="change-pill change-new">NEW</span>';
  }
  const delta = parseChange(changeValue);
  if (delta > 1) {
    return `<span class="change-pill change-up">+${delta}</span>`;
  }
  if (delta < -1) {
    return `<span class="change-pill change-down">${delta}</span>`;
  }
  return `<span class="change-pill change-flat">${delta}</span>`;
}

function goodreadsSearchUrl(row) {
  const query = encodeURIComponent(`${row.title} ${row.author}`);
  return `https://www.goodreads.com/search?q=${query}`;
}

function titleLink(row) {
  return `<a class="goodreads-title-link" href="${goodreadsSearchUrl(row)}" target="_blank" rel="noopener noreferrer">${row.title}</a>`;
}

function passesVoteBand(row, band) {
  if (band === "all") {
    return true;
  }
  if (band === "100") {
    return row.votes >= 100;
  }
  if (band === "50") {
    return row.votes >= 50 && row.votes <= 99;
  }
  if (band === "20") {
    return row.votes >= 20 && row.votes <= 49;
  }
  return row.votes >= 5 && row.votes <= 19;
}

function renderTable(rows) {
  const body = document.getElementById("rankTableBody");
  const summary = document.getElementById("tableSummary");
  const search = document.getElementById("rowSearch").value.trim().toLowerCase();
  const changeFilter = document.getElementById("changeFilter").value;
  const voteBand = document.getElementById("voteBandFilter").value;
  const rankRange = document.getElementById("rankRangeFilter").value;
  const sortMode = document.getElementById("sortFilter").value;

  const filtered = rows.filter((row) => {
    const movementOk = changeFilter === "all" ? true : row.movement === changeFilter;
    const searchOk = !search || row.searchText.includes(search);
    const bandOk = passesVoteBand(row, voteBand);
    const rangeOk = rankRange === "all" || row.rank <= Number(rankRange);
    return movementOk && searchOk && bandOk && rangeOk;
  });
  filtered.sort((a, b) => {
    if (sortMode === "votes") return b.votes - a.votes || a.rank - b.rank;
    if (sortMode === "movement") return b.movementValue - a.movementValue || a.rank - b.rank;
    return a.rank - b.rank || b.votes - a.votes;
  });
  const displayed = filtered.slice(0, visibleRows);

  body.innerHTML = displayed.map((row) => `
    <tr>
      <td>${row.rank}</td>
      <td>${titleLink(row)}</td>
      <td>${row.author}</td>
      <td>${row.votes}</td>
      <td>${movementPill(row.change)}</td>
      <td>${signalLabel(row)}</td>
    </tr>
  `).join("");

  summary.textContent = `Showing ${displayed.length} of ${filtered.length} matching rows (${rows.length} extracted rows total).`;
  document.getElementById("loadMoreRowsButton").hidden = displayed.length >= filtered.length;
  saveExplorerState();
}

function renderTop100Table(rows) {
  const body = document.getElementById("top100TableBody");
  const summary = document.getElementById("top100Summary");
  const topRows = rows
    .filter((row) => row.rank <= 100)
    .sort((a, b) => a.rank - b.rank || b.votes - a.votes);

  body.innerHTML = "";
  topRows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.rank}</td>
      <td>${titleLink(row)}</td>
      <td>${row.author}</td>
      <td>${row.votes}</td>
      <td>${movementPill(row.change)}</td>
    `;
    body.appendChild(tr);
  });

  const upCount = topRows.filter((row) => movementType(row.change) === "up").length;
  const downCount = topRows.filter((row) => movementType(row.change) === "down").length;
  const newCount = topRows.filter((row) => movementType(row.change) === "new").length;
  summary.textContent = `Top 100 view contains ${topRows.length} extracted rows: ${upCount} up, ${downCount} down, ${newCount} new.`;
}

function wireControls() {
  document.getElementById("rowSearch").addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      visibleRows = explorerPageSize;
      renderTable(RANKINGS);
    }, 200);
  });
  ["changeFilter", "voteBandFilter", "rankRangeFilter", "sortFilter"].forEach((id) => {
    document.getElementById(id).addEventListener("change", () => {
      visibleRows = explorerPageSize;
      renderTable(RANKINGS);
    });
  });
  document.getElementById("loadMoreRowsButton").addEventListener("click", () => {
    visibleRows += explorerPageSize;
    renderTable(RANKINGS);
  });
}

function saveExplorerState() {
  const state = {
    search: document.getElementById("rowSearch").value,
    movement: document.getElementById("changeFilter").value,
    votes: document.getElementById("voteBandFilter").value,
    range: document.getElementById("rankRangeFilter").value,
    sort: document.getElementById("sortFilter").value
  };
  localStorage.setItem(redditStateKey, JSON.stringify(state));
  const params = new URLSearchParams();
  if (state.search) params.set("q", state.search);
  if (state.movement !== "all") params.set("movement", state.movement);
  if (state.votes !== "all") params.set("votes", state.votes);
  if (state.range !== "all") params.set("range", state.range);
  if (state.sort !== "rank") params.set("sort", state.sort);
  history.replaceState(null, "", `${location.pathname}${params.size ? `?${params}` : ""}`);
}

function restoreExplorerState() {
  const params = new URLSearchParams(location.search);
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(redditStateKey) || "{}");
  } catch {
    saved = {};
  }
  document.getElementById("rowSearch").value = params.get("q") || saved.search || "";
  document.getElementById("changeFilter").value = params.get("movement") || saved.movement || "all";
  document.getElementById("voteBandFilter").value = params.get("votes") || saved.votes || "all";
  document.getElementById("rankRangeFilter").value = params.get("range") || saved.range || "all";
  document.getElementById("sortFilter").value = params.get("sort") || saved.sort || "rank";
}

document.addEventListener("DOMContentLoaded", () => {
  renderStats(RANKINGS);
  renderTrendCards(RANKINGS);
  renderRecommendationCards();
  renderCommentarySignals();
  renderDataCaveats();
  renderTop100Table(RANKINGS);
  restoreExplorerState();
  renderTable(RANKINGS);
  wireControls();
});
