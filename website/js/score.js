(function scoreModule() {
  function rankToScore(rank, maxRank) {
    const limit = Number.isFinite(maxRank) ? maxRank : 250;
    if (!Number.isFinite(rank) || rank <= 0 || rank >= 999999) return null;
    const clamped = Math.min(rank, limit);
    const pct = 1 - (clamped - 1) / (limit - 1);
    return Math.max(0, Math.min(100, pct * 100));
  }

  function awardToScore(awardSummary) {
    const entries = (awardSummary || "")
      .split("|")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);

    if (!entries.length) return null;

    const scored = entries.map((entry) => {
      let score = 70;
      if (entry.includes("hugo") || entry.includes("nebula")) score = 84;
      else if (entry.includes("locus")) score = 80;

      if (entry.includes("winner")) score += 8;
      else if (entry.includes("finalist") || entry.includes("nominee")) score += 3;

      return Math.min(100, score);
    });

    scored.sort((a, b) => b - a);
    return scored[0];
  }

  function computeScoreDetails(book) {
    const overallRating = Number(book.overall_rating);
    const audiobookRating = Number(book.audiobook_rating);
    const overallRank = Number(book.overall_rank);
    const audiobookRank = Number(book.audiobook_rank);
    const redditRank = Number(book.reddit_rank);

    const signalValues = [
      { weight: 0.35, value: Number.isFinite(overallRating) && overallRating > 0 ? Math.min(100, overallRating * 20) : null },
      { weight: 0.15, value: rankToScore(overallRank) },
      { weight: 0.15, value: Number.isFinite(audiobookRating) && audiobookRating > 0 ? Math.min(100, audiobookRating * 20) : null },
      { weight: 0.1, value: rankToScore(audiobookRank) },
      { weight: 0.1, value: rankToScore(redditRank) },
      { weight: 0.15, value: awardToScore(book.award_summary) }
    ];

    let weightedTotal = 0;
    let usedWeight = 0;
    signalValues.forEach((signal) => {
      if (Number.isFinite(signal.value)) {
        weightedTotal += signal.value * signal.weight;
        usedWeight += signal.weight;
      }
    });

    if (!usedWeight) {
      return {
        overallScore: null,
        scoreConfidence: 0,
        signalCount: 0
      };
    }

    const rawScore = weightedTotal / usedWeight;
    const baseline = 65;
    const confidence = Math.min(1, usedWeight / 0.6);
    const adjustedScore = baseline * (1 - confidence) + rawScore * confidence;
    const signalCount = signalValues.filter((signal) => Number.isFinite(signal.value)).length;

    return {
      overallScore: Math.round(Math.max(0, Math.min(100, adjustedScore))),
      scoreConfidence: Math.round(confidence * 100),
      signalCount
    };
  }

  function computeOverallScore(book) {
    return computeScoreDetails(book).overallScore;
  }

  function qualityTier(score, confidence) {
    if (!Number.isFinite(score)) return "Unrated";
    if (score >= 90 && confidence >= 70) return "Elite";
    if (score >= 80 && confidence >= 60) return "Excellent";
    if (score >= 70 && confidence >= 50) return "Strong";
    if (score >= 60) return "Promising";
    return "Developing";
  }

  window.ScoreUtils = {
    rankToScore,
    awardToScore,
    computeScoreDetails,
    computeOverallScore,
    qualityTier
  };
})();
