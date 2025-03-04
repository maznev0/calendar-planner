import { router } from "expo-router";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "./Text";

interface Props {
  weekday: string;
  day: string;
  orders: number;
  onNavigate: () => void;
}

export default function Day({ weekday, day, orders, onNavigate }: Props) {
  return (
    <TouchableOpacity onPress={onNavigate}>
      <View style={styles.container}>
        <View style={styles.date}>
          <Text style={styles.weekday}>{weekday.toUpperCase()}</Text>
          <Text style={styles.day}>{day}</Text>
        </View>
        <View>
          <Text style={styles.orders}>{orders}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: "#252525",
    borderRadius: 20,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
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
  orders: {
    color: "#E4D478",
    fontSize: 80,
    fontWeight: "200",
  },
});
