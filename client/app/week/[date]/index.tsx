import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import Day from "../../../components/Day";
import Header from "../../../components/Header";
import {
  formatDate,
  formatDayMonthUIDate,
  getDayOfWeek,
  getStartEndWeekDates,
  getWeekByDate,
} from "../../../utils/date";
import Button from "../../../components/Button";
import { router, useLocalSearchParams } from "expo-router";
import { getOrdersQuantity } from "../../../api/order";
import useFetch from "../../../hooks/useFetch";
import {
  OrderQuantityParams,
  OrderQuantityResponse,
} from "../../../types/order";
import Text from "../../../components/Text";
import { useMemo, useState } from "react";

export default function Home() {
  const { date } = useLocalSearchParams<{ date: string }>();

  const selectedDate = new Date(date);

  const { data, isLoading } = useFetch<
    OrderQuantityResponse,
    OrderQuantityParams
  >(getOrdersQuantity, getStartEndWeekDates(selectedDate));

  let week = useMemo(
    () => getWeekByDate(data || [], selectedDate),
    [data, date]
  );

  // const [refreshing, setRefreshing] = useState(false);

  const handleHeaderPress = () => {
    // if (!router.canGoBack()) return;
    // router.dismissAll();
    router.replace(`/week/${formatDate(new Date())}`);
  };

  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   const data = await getStartEndWeekDates(selectedDate);
  //   week = getWeekByDate(data, selectedDate);
  //   setRefreshing(false);
  // };

  const handleSwipe = (direction: "left" | "right") => {
    const newDate = new Date(selectedDate);

    if (direction === "left") {
      newDate.setDate(newDate.getDate() + 7);
      router.replace({
        pathname: `/week/${formatDate(newDate)}`,
        // animation: "slide_from_left",
      });
    } else if (direction === "right") {
      newDate.setDate(newDate.getDate() - 7);
      router.replace(`/week/${formatDate(newDate)}`);
    }

    // const newDateString = formatDate(newDate);
    // router.push(`/week/${newDateString}`);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#3C3C3C" }}>
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

      <ScrollView
        horizontal
        style={{ width: "100%" }}
        onMomentumScrollBegin={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const threshold = 60;

          if (offsetX > threshold) {
            handleSwipe("left"); // Свайп влево
          } else if (offsetX < -threshold) {
            handleSwipe("right"); // Свайп вправо
          }
        }}
      >
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {week.map(({ date, orders_quantity }) => (
            <Day key={date} dayDate={date} orders={orders_quantity} />
          ))}
          <Button onPress={() => {}}>Статистика</Button>
        </ScrollView>
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
    // width: "100%",
    width: 385,
    height: "100%",
    flex: 1,
    paddingVertical: 15,
    // borderWidth: 1,
    // borderColor: "#FFF",
  },
});

function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date); // Создаем копию исходной даты, чтобы не мутировать её
  result.setDate(result.getDate() + weeks * 7); // Добавляем или вычитаем недели
  return result;
}
