import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Calendar from "../../components/Calendar";
import Text from "../../components/Text";

const CalendarPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.weekDays}>
        {["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map((day, index) => (
          <Text key={index} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      <Calendar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingTop: 20,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#A6A6A6",
  },
  weekDay: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "200",
    opacity: 0.5,
    width: "14%",
    textAlign: "center",
  },
});

export default CalendarPage;
