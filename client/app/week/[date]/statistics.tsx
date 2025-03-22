import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Header from "../../../components/Header";
import {
  formatDate,
  formatDayMonthUIDate,
  getDayOfWeek,
  getStartEndWeekDates,
} from "../../../utils/date";
import { router, useLocalSearchParams } from "expo-router";
import useFetch from "../../../hooks/useFetch";

import Text from "../../../components/Text";
import { CarPayment } from "../../../components/CarPayment";
import StatisticsWeek from "../../../components/Statistics";
import { getWeekStatistics } from "../../../api/order";
import Loader from "../../../components/Loader";

export default function Home() {
  const { date } = useLocalSearchParams<{ date: string }>();

  const selectedDate = new Date(date);

  const { data, isLoading } = useFetch(
    getWeekStatistics,
    getStartEndWeekDates(selectedDate)
  );

  const handleHeaderPress = () => {
    router.replace(`/week/${formatDate(new Date())}`);
  };
  let payments;
  if (data !== null) {
    payments = {
      total_price_week: data!.total_price_week,
      total_price_workers: data!.total_price_workers,
      total_polish: data!.total_polish,
      medium_meters: data!.medium_meters,
      done_orders: data!.done_orders,
      left_orders: data!.left_orders,
      total_profit: data!.total_profit,
      total_other_price: data!.total_other_price,
    };
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              style={styles.icon}
              source={require("../../../assets/icons/back.png")}
            />
          </TouchableOpacity>
        </View>
        <Header onPress={handleHeaderPress}>
          {getDayOfWeek(formatDate(new Date())) +
            " " +
            formatDayMonthUIDate(formatDate(new Date()))}
        </Header>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {data && data.cars_statistics && (
            <View style={styles.cars}>
              {data &&
                data.cars_statistics.map((car: any) => (
                  <CarPayment car={car} key={car.color} />
                ))}
            </View>
          )}
          {data && <StatisticsWeek payments={payments!} />}
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
  icon: {},
  list: {
    width: "100%",
    height: "100%",
    flex: 1,
    paddingVertical: 15,
  },
  cars: {
    flexDirection: "column",
    gap: 10,
  },
});
