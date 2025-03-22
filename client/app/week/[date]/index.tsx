import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Image,
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
import { useEffect, useMemo, useState } from "react";
import Loader from "../../../components/Loader";

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

  const handleHeaderPress = () => {
    router.replace(`/week/${formatDate(new Date())}`);
  };

  const handleSwipe = (direction: "left" | "right") => {
    const newDate = new Date(selectedDate);

    if (direction === "left") {
      newDate.setDate(newDate.getDate() + 7);
      router.replace({
        pathname: `/week/${formatDate(newDate)}`,
      });
    } else if (direction === "right") {
      newDate.setDate(newDate.getDate() - 7);
      router.replace(`/week/${formatDate(newDate)}`);
    }
  };

  const handleStatistics = () => {
    router.push(`/week/${date}/statistics`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => router.push("/calendar")}>
            <Image
              style={styles.icon}
              source={require("../../../assets/icons/calendar.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Image
              style={styles.icon}
              source={require("../../../assets/icons/menu.png")}
            />
          </TouchableOpacity>
        </View>
        <Header onPress={handleHeaderPress}>
          {getDayOfWeek(formatDate(new Date())) +
            " " +
            formatDayMonthUIDate(formatDate(new Date()))}
        </Header>

        <ScrollView
          horizontal
          style={{
            width: "100%",
          }}
          contentContainerStyle={{ width: "100%" }}
          onMomentumScrollBegin={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const threshold = 60;

            if (offsetX > threshold) {
              handleSwipe("left");
            } else if (offsetX < -threshold) {
              handleSwipe("right");
            }
          }}
        >
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {week.map(({ date, orders_quantity }) => (
              <Day key={date} dayDate={date} orders={orders_quantity} />
            ))}
            <Button onPress={handleStatistics}>Статистика</Button>
          </ScrollView>
        </ScrollView>
      </View>
    </>
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
  header: {
    paddingHorizontal: 20,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    backgroundColor: "#3C3C3C",
  },
  icon: {
    width: 40,
    height: 40,
  },
  list: {
    width: "100%",
    height: "100%",
    flex: 1,
    paddingVertical: 15,
  },
});
