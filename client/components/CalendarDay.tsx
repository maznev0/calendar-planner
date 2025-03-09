import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import React, { FC, memo } from "react";
import Text from "./Text";
import { useRouter } from "expo-router";

interface Props {
  date: any;
  state: any;
  marking: any;
}

const CalendarDay: FC<Props> = memo(
  ({ date, state, marking }) => {
    const isSunday = new Date(date.dateString).getDay() === 0;

    const router = useRouter();
    const handlePress = () => {
      router.push(
        `/week/${new Date(date.dateString).toISOString().split("T")[0]}`
      );
    };

    return (
      <TouchableWithoutFeedback style={{ height: 68 }} onPress={handlePress}>
        <View style={styles.container}>
          <Text
            style={[
              styles.dayText,
              isSunday ? styles.sundayText : {},
              // state === "disabled" ? styles.disabledDayText : {},
              state === "today" ? styles.todayText : {},
            ]}
          >
            {date?.day}
          </Text>
          <View style={styles.dots}>
            {marking?.dots?.map((dot: any) => (
              <View key={dot.key} style={styles.dot} />
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.date.dateString === nextProps.date.dateString &&
      prevProps.state === nextProps.state &&
      prevProps.marking === nextProps.marking
    );
  }
);

export default CalendarDay;

const styles = StyleSheet.create({
  container: {
    height: 68,
    // minHeight: 45,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    // borderWidth: 1,
    //  borderBottomWidth: 1,
    borderColor: "#A6A6A6",
  },
  dayText: {
    fontSize: 24,
    color: "#FFF",
    textAlign: "center",
  },
  disabledDayText: {
    color: "#666",
    opacity: 0.5,
  },
  todayText: {
    color: "#E4D478",
  },
  sundayText: {
    color: "#CB4545",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 2,
    flexWrap: "wrap",
    width: "70%",

    //  borderWidth: 1,
    //  borderColor: "#fff",
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#A6A6A6" },
});
