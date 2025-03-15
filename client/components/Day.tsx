import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PixelRatio,
} from "react-native";
import Text from "./Text";
import {
  formatDayMonthUIDate,
  formatFullUIDate,
  getShortDayOfWeek,
} from "../utils/date";

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
          {getShortDayOfWeek(dayDate).toUpperCase()}
        </Text>
        <Text style={styles.day}>{formatDayMonthUIDate(dayDate)}</Text>
      </View>
      <View style={styles.orders_block}>
        <Text style={styles.orders}>{orders}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 27 * PixelRatio.get(),
    backgroundColor: "#252525",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#252525",

    paddingLeft: 17,
    paddingRight: 5,
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
    width: 60,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  orders: {
    height: "100%",
    color: "#E4D478",
    fontSize: 80,
    fontWeight: "100",
  },
});
