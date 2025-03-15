import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import React, { useState } from "react";
import Calendar from "../../components/Calendar/Calendar";
import Text from "../../components/Text";
import { useRouter } from "expo-router";

const CalendarPage = () => {
  const router = useRouter();

  const handlePressToday = () => {
    router.dismissAll();
  };

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
      <TouchableWithoutFeedback onPress={handlePressToday}>
        <View style={styles.footer}>
          <Text style={styles.footer_text}>Сегодня</Text>
        </View>
      </TouchableWithoutFeedback>
      {/* <View style={styles.footer}>
        <Text style={styles.footer_text}>Сегодня</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingTop: 20,
    paddingBottom: 10,
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
  footer: {
    height: 34,
    paddingTop: 8,
    borderTopColor: "#A6A6A6",
    borderTopWidth: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  footer_text: {
    fontSize: 22,
    textTransform: "uppercase",
    color: "#E4D478",
  },
});

export default CalendarPage;
