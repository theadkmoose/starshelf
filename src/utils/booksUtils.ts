export const getGoodreadsUrl = (title: string) => {
  // Replace spaces with hyphens and normalize casing
  return `https://www.goodreads.com/search?q=${encodeURIComponent(title.replace(/\s+/g, '-').toLowerCase())}`;
};