import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  AccessibilityInfo,
  PixelRatio,
  TouchableWithoutFeedback,
} from "react-native";
import Day from "../../../components/Day";
import Header from "../../../components/Header";
import {
  formatDate,
  formatDayMonthUIDate,
  formatToUIDate,
  getDayOfWeek,
  getFormatUIWeek,
  getStartEndWeekDates,
  getWeekByDate,
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
  const { date } = useLocalSearchParams<{ date: string }>();

  const selectedDate = new Date(date);

  const { data, isLoading } = useFetch<
    OrderQuantityResponse,
    OrderQuantityParams
  >(getOrdersQuantity, getStartEndWeekDates(selectedDate));

  const week = useMemo(
    () => getWeekByDate(data || [], selectedDate),
    [data, date]
  );

  const handleHeaderPress = () => {
    if (!router.canGoBack()) return;
    router.dismissAll();
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header onPress={handleHeaderPress}>
        {getDayOfWeek(formatDate(new Date())) +
          " " +
          formatDayMonthUIDate(formatDate(new Date()))}
      </Header>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {week.map(({ date, orders_quantity }) => (
          <Day key={date} dayDate={date} orders={orders_quantity} />
        ))}
        <Button onPress={() => {}}>Статистика</Button>
      </ScrollView>
    </View>
  );
}
{
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
