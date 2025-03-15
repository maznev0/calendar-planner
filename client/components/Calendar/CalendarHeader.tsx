import { Image, StyleSheet, View } from "react-native";
import Text from "../Text";
import { memo } from "react";

interface Props {
  date: Date;
}

const CalendarHeader = ({ date }: Props) => {
  return (
    <View style={styles.header}>
      <Image
        style={styles.icon}
        source={require("../../assets/icons/statistics.png")}
      />
      <Text style={styles.monthText}>{date.toString("MMMM")}</Text>
    </View>
  );
};

export default memo(CalendarHeader);

const styles = StyleSheet.create({
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
