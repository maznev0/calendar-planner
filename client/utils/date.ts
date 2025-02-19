const formatDate = (date: Date) => {
  return date.toLocaleDateString("ru-RU", {
    month: "short",
    day: "numeric",
  });
};

export function getWeek() {
  const today = new Date();

  const dayOfWeek = today.getDay();

  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Если сегодня воскресенье, отнимаем 6 дней

  const sunday = new Date(today);
  sunday.setDate(today.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek)); // Если сегодня воскресенье, воскресенье — это сегодня
  return `${formatDate(monday)} — ${formatDate(sunday)}`;
}
