const formatDate = (date: Date) => {
  return date.toLocaleDateString("ru-RU", {
    month: "short",
    day: "numeric",
  });
};

export function getWeek(date: Date): string {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay() + 1);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
}
