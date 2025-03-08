import { View, StyleSheet, ScrollView, Alert } from "react-native";
import OrderCard from "../../../../../components/OrderCard";
import Header from "../../../../../components/Header";
import Button from "../../../../../components/Button";
import { router, useLocalSearchParams } from "expo-router";
import useFetch from "../../../../../hooks/useFetch";
import { getOrdersByDay } from "../../../../../api/order";
import { OrderCardParams, OrderCardResponse } from "../../../../../types/order";
import Text from "../../../../../components/Text";

export default function Day() {
  const { date, dayDate } = useLocalSearchParams<{
    date: string;
    dayDate: string;
  }>();

  const { data: orders, isLoading } = useFetch<
    OrderCardResponse,
    OrderCardParams
  >(getOrdersByDay, {
    date: dayDate,
  });

  if (isLoading) {
    return (
      <View>
        <Text>Loading ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header>Понедельник 27 января</Header>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {orders?.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ScrollView>
      <Button
        onPress={() => {
          router.push(`/week/${date}/day/${dayDate}/order/add`);
        }}
      >
        Добавить
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  list: {
    paddingVertical: 15,
    height: "100%",
  },
});
