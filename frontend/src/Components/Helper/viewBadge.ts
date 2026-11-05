// ViewBadge.ts (atau viewBadge.ts)
export function getViewBadge(views?: number) {
  const total = views ?? 0;

  if (total >= 300) {
    return {
      label: "Trending",
      icon: "🔥",
      className: "from-pink-500 to-red-500 animate-pulse",
    };
  }

  if (total >= 100) {
    return {
      label: "Most Viewed",
      icon: "👁️",
      className: "from-indigo-500 to-blue-500",
    };
  }

  return {
    label: "Terbaru",
    icon: "🆕",
    className: "from-emerald-400 to-teal-500",
  };
}
