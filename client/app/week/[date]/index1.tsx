import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
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
    if (!router.canGoBack()) return;
    router.dismissAll();
  };

  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   const data = await getStartEndWeekDates(selectedDate);
  //   week = getWeekByDate(data, selectedDate);
  //   setRefreshing(false);
  // };

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

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={onRefresh}
        //     colors={["#9Bd35A", "#689F38"]}
        //     tintColor="#FFFFFF"
        //   />
        // }
      >
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
