import { Text, View, StyleSheet, ScrollView } from "react-native";
import { getWeek } from "../utils/date";
import Day from "../components/Day";

export default function Home() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <Day weekday={"пн"} day={"27 янв 2025"} orders={3} />
        <Day weekday={"вт"} day={"28 янв 2025"} orders={0} />
        <Day weekday={"ср"} day={"29 янв 2025"} orders={2} />
        <Day weekday={"чт"} day={"30 янв 2025"} orders={5} />
        <Day weekday={"пт"} day={"31 янв 2025"} orders={1} />
        <Day weekday={"сб"} day={"1 фев 2025"} orders={7} />
        <View style={styles.statistics}>
          <Text style={styles.statistics_text}>Статистика</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  list: {
    height: "100%",
  },
  statistics: {
    width: "100%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
  },
  statistics_text: {
    width: "100%",
    color: "#E4D478",
    fontSize: 24,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
