import { View, StyleSheet, ScrollView, Alert } from "react-native";
import Day from "../../../components/Day";
import Header from "../../../components/Header";
import {
  formatToUIDate,
  getDayOfWeek,
  getFormatUIWeek,
  getStartEndWeekDates,
} from "../../../utils/date";
import Button from "../../../components/Button";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { getOrdersQuantity } from "../../../api/order";
import useFetch from "../../../hooks/useFetch";
import {
  OrderQuantityParams,
  OrderQuantityResponse,
} from "../../../types/order";
import Text from "../../../components/Text";
import { useMemo } from "react";

export default function Home() {
  // const { date } = useLocalSearchParams<{ date?: string }>();
  // const isValidDate =
  //   date && /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
  // const selectedDate = isValidDate ? new Date(date) : new Date();

  // const selectedDate = useMemo(() => {
  //   const isValidDate =
  //     date && /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
  //   return isValidDate ? new Date(date) : new Date();
  // }, [date]);

  const { date } = useLocalSearchParams<{ date?: string }>();
  const selectedDate = useMemo(() => {
    return new Date(date || "");
  }, [date]);

  const startEndWeekDates = useMemo(
    () => getStartEndWeekDates(selectedDate),
    [date]
  );

  const { data, isLoading } = useFetch<
    OrderQuantityResponse,
    OrderQuantityParams
  >(getOrdersQuantity, startEndWeekDates);

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleNavigateToDay = (day: string) => {
    router.push(`/week/${date}/day/${day}`);
  };

  return (
    <View style={styles.container}>
      <Header>{getFormatUIWeek(selectedDate)}</Header>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {data?.map(({ date, orders_quantity }) => (
          <Day
            key={date}
            weekday={getDayOfWeek(date)}
            day={formatToUIDate(date)}
            orders={orders_quantity}
            onNavigate={() => handleNavigateToDay(date)}
          />
        ))}
        {/* <Day weekday={"пн"} day={"27 янв 2025"} orders={3} />
        <Day weekday={"вт"} day={"28 янв 2025"} orders={0} />
        <Day weekday={"ср"} day={"29 янв 2025"} orders={2} />
        <Day weekday={"чт"} day={"30 янв 2025"} orders={5} />
        <Day weekday={"пт"} day={"31 янв 2025"} orders={1} />
        <Day weekday={"сб"} day={"1 фев 2025"} orders={7} /> */}
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
