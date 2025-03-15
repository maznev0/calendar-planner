import { Image, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { CalendarList, DateData } from "react-native-calendars";
import CalendarDay from "./CalendarDay";
import { LocaleConfig } from "react-native-calendars";
import { getOrdersQuantity } from "../../api/order";
import { OrderQuantityResponse } from "../../types/order";
import CalendarHeader from "./CalendarHeader";

LocaleConfig.locales["ru"] = {
  monthNames: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  monthNamesShort: [
    "Янв",
    "Февр.",
    "Март",
    "Апр",
    "Май",
    "Июнь",
    "Июль",
    "Авг",
    "Сент.",
    "Окт",
    "Нояб.",
    "Дек",
  ],
  dayNames: [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ],
  dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  today: "Сегодня",
};
LocaleConfig.defaultLocale = "ru";

const generateMarkedDates = (orders: OrderQuantityResponse) => {
  const markedDates: { [key: string]: any } = {};
  if (!orders || !orders.length) return markedDates;
  orders.forEach((order) => {
    const { date, orders_quantity } = order;
    const dots = Array.from({ length: orders_quantity }, (_, i) => ({
      key: `${date}-${i}`,
      color: "#A6A6A6",
    }));
    markedDates[date] = { dots };
  });

  return markedDates;
};

const Calendar = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());

  const fetchOrdersForMonth = useCallback(
    async (month: string, year: string) => {
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${new Date(
        +year,
        +month,
        0
      ).getDate()}`;
      try {
        const response = await getOrdersQuantity({
          start: startDate,
          end: endDate,
        });

        const newMarkedDates = generateMarkedDates(response);
        setMarkedDates((prev) => ({ ...prev, ...newMarkedDates }));

        setLoadedMonths(
          (prev: Set<string>) => new Set<string>(prev.add(`${year}-${month}`))
        );
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    },
    []
  );

  const handleVisibleMonthsChange = useCallback((date: DateData[]) => {
    const month = String(date[0].month);
    const year = String(date[0].year);

    if (loadedMonths.has(`${year}-${month}`)) return;
    fetchOrdersForMonth(month, year);
  }, []);

  useEffect(() => {
    (async () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear().toString();
      const currentMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");

      const prevMonthDate = new Date(currentDate);
      prevMonthDate.setMonth(currentDate.getMonth() - 1);
      const prevYear = prevMonthDate.getFullYear().toString();
      const prevMonth = (prevMonthDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");

      const nextMonthDate = new Date(currentDate);
      nextMonthDate.setMonth(currentDate.getMonth() + 1);
      const nextYear = nextMonthDate.getFullYear().toString();
      const nextMonth = (nextMonthDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");

      await Promise.all([
        fetchOrdersForMonth(currentMonth, currentYear),
        fetchOrdersForMonth(prevMonth, prevYear),
        fetchOrdersForMonth(nextMonth, nextYear),
      ]);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <CalendarList
        calendarHeight={600}
        debug={true}
        windowSize={3}
        animateScroll={false}
        pagingEnabled={false}
        disableMonthChange={true}
        keyExtractor={(item, index) => `calendar-${index}`}
        showScrollIndicator={false}
        disableVirtualization={true}
        removeClippedSubviews={false}
        onVisibleMonthsChange={handleVisibleMonthsChange}
        renderHeader={useCallback(
          (date: Date) => (
            <CalendarHeader date={date} />
          ),
          []
        )}
        hideDayNames
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        firstDay={1}
        markingType={"multi-dot"}
        markedDates={markedDates}
        scrollEnabled={true}
        style={styles.calendar}
        dayComponent={({ date, marking, state }) => (
          <CalendarDay date={date} marking={marking} state={state} />
        )}
        theme={{
          backgroundColor: "#252525",
          calendarBackground: "#252525",
          stylesheet: {
            calendar: {
              main: {
                paddingHorizontal: 14,
              },
            },
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252525",
    borderWidth: 1,
    borderColor: "#000",
  },
  calendar: {},
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomWidth: 1,

    borderColor: "#A6A6A6",
  },
  icon: {
    width: 40,
    height: 40,
  },
  monthText: {
    fontSize: 28,
    fontWeight: "500",
    color: "#E4D478",
  },
});

export default Calendar;
