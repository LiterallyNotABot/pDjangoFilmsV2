export function transformRatingStats(stats) {
  if (!stats || !stats.distribution) return null;
  const segments = Object.entries(stats.distribution).map(([value, count]) => ({
    value: parseFloat(value),
    count,
  }));
  return {
    average: stats.average,
    total: stats.count,
    segments,
  };
}