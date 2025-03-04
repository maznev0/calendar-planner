export function formatToUIDate(date: Date): string;
export function formatToUIDate(dateString: string): string;

export function formatToUIDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("ru-RU", {
    month: "short",
    day: "numeric",
  });
}

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

function getFormatWeek(date: Date, formatFunction: (date: Date) => string) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay() + 1);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return { start: formatFunction(startOfWeek), end: formatFunction(endOfWeek) };
}

export function getFormatUIWeek(date: Date): string {
  const { start, end } = getFormatWeek(date, formatToUIDate);

  return `${start} - ${end}`;
}

export function getStartEndWeekDates(date: Date) {
  return getFormatWeek(date, formatDate);
}

const daysOfWeek = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}
