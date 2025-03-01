import { Image, StyleSheet,  View } from "react-native";
import React, { useState } from "react";
import { CalendarList } from "react-native-calendars";
import CalendarDay from "./CalendarDay";
import { LocaleConfig } from "react-native-calendars";
import Text from "./Text";

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

const ordersData = {
  "2025-02-15": 3,
  "2025-02-20": 5,
  "2025-02-25": 1,
  "2025-02-24": 4,
  "2025-03-01": 5,
};

const generateMarkedDates = (orders: { [key: string]: number }) => {
  const markedDates: { [key: string]: any } = {};
  Object.keys(orders).forEach((date) => {
    const dots = Array.from({ length: orders[date] }, (_, i) => ({
      key: `${date}-${i}`,
      color: "#A6A6A6",
    }));
    markedDates[date] = { dots };
  });
  return markedDates;
};

const Calendar = () => {
  const [markedDates, setMarkedDates] = useState(
    generateMarkedDates(ordersData)
  );

  return (
    <View style={styles.container}>
      <CalendarList
        renderHeader={(date) => (
          <View style={styles.header}>
            <Image
              style={styles.icon}
              source={require("../assets/icons/statistics.png")}
            />
            <Text style={styles.monthText}>{date.toString("MMMM")}</Text>
          </View>
        )}
        hideDayNames
        initialNumToRender={3}
        firstDay={1}
        markingType={"multi-dot"}
        markedDates={markedDates}
        animateScroll={false}
        pastScrollRange={12}
        futureScrollRange={12}
        scrollEnabled={true}
        showScrollIndicator={true}
        style={styles.calendar}
        dayComponent={({ date, marking, state }) => (
          <CalendarDay date={date} marking={marking} state={state} />
        )}
        theme={{
          backgroundColor: "#252525",
          calendarBackground: "#252525",
          //  selectedDayTextColor: "#E4D478",
          //  todayTextColor: "#E4D478",
          //  dayTextColor: "#FFF",
          //  monthTextColor: "#E4D478",
          //  textMonthFontSize: 28,
          //  textDayFontSize: 24,
          //  textDayFontWeight: "400",
          //  textMonthFontWeight: "400",
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
    // paddingHorizontal: 15,
  },
  icon: {
    width: 40,
    height: 40,
  },
  monthText: {
    fontSize: 28,
    fontWeight: "400",
    color: "#E4D478",
  },
});

export default Calendar;
