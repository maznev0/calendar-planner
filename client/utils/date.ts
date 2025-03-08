import { OrderQuantityResponse } from "../types/order";

export function formatToUIDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export function formatFullUIDate(date: Date | string) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export function getWeekByDate(orders: OrderQuantityResponse, targetDate: Date) {
  const startDate = new Date(targetDate);
  startDate.setDate(targetDate.getDate() - targetDate.getDay() + 1);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 5);

  const weekDates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    weekDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const result = weekDates.map((date) => {
    const formattedDate = formatDate(date);
    const order = orders.find((order) => order.date === formattedDate);
    return {
      date: formattedDate,
      orders_quantity: order ? order.orders_quantity : 0,
    };
  });

  return result;
}

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

const daysOfWeek = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];

export function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}
