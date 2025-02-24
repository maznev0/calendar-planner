import { View, StyleSheet, ScrollView } from "react-native";
import Day from "../../../components/Day";
import Header from "../../../components/Header";
import { getWeek } from "../../../utils/date";
import Button from "../../../components/Button";

export default function Home() {
  return (
    <View style={styles.container}>
      <Header>{getWeek()}</Header>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <Day weekday={"пн"} day={"27 янв 2025"} orders={3} />
        <Day weekday={"вт"} day={"28 янв 2025"} orders={0} />
        <Day weekday={"ср"} day={"29 янв 2025"} orders={2} />
        <Day weekday={"чт"} day={"30 янв 2025"} orders={5} />
        <Day weekday={"пт"} day={"31 янв 2025"} orders={1} />
        <Day weekday={"сб"} day={"1 фев 2025"} orders={7} />
        <Button onPress={() => {}}>Статистика</Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  list: {
    height: "100%",
    paddingVertical: 15,
  },
});
