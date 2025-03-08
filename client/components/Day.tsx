import { router, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Text from "./Text";
import { formatFullUIDate, getDayOfWeek } from "../utils/date";

interface Props {
  dayDate: string;
  orders: number;
}

export default function Day({ dayDate, orders }: Props) {
  const { date } = useLocalSearchParams<{ date: string }>();

  const isCurrent: boolean =
    formatFullUIDate(new Date()) === formatFullUIDate(new Date(dayDate));

  const handleNavigate = () => router.push(`/week/${date}/day/${dayDate}`);

  return (
    <TouchableOpacity
      style={[styles.container, isCurrent ? styles.current : {}]}
      onPress={handleNavigate}
    >
      <View style={styles.date}>
        <Text style={styles.weekday}>
          {getDayOfWeek(dayDate).toUpperCase()}
        </Text>
        <Text style={styles.day}>{formatFullUIDate(dayDate)}</Text>
      </View>
      <View style={styles.orders_block}>
        <Text style={styles.orders}>{orders}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: "#252525",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#252525",

    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  current: {
    borderColor: "#FFF",
  },
  date: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 10,
  },
  weekday: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "300",
  },
  day: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "300",
  },
  orders_block: {
    flexDirection: "row",
  },
  orders: {
    height: "100%",
    color: "#E4D478",
    fontSize: 80,
    fontWeight: "100",
  },
});
