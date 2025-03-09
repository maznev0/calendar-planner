import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import Header from "../../../../../../../components/Header";
import Button from "../../../../../../../components/Button";
import { useLocalSearchParams } from "expo-router";
import useFetch from "../../../../../../../hooks/useFetch";
import Order from "../../../../../../../components/Order";
import {
  IOrder,
  OrderParams,
  OrderResponse,
} from "../../../../../../../types/order";
import { getOrderByID } from "../../../../../../../api/order";
import { Worker } from "../../../../../../../types/users";
import Notes from "../../../../../../../components/Notes";
import {
  formatFullUIDate,
  getDayOfWeek,
} from "../../../../../../../utils/date";

export default function OrderPage() {
  const { date, dayDate, orderId } = useLocalSearchParams<{
    date: string;
    dayDate: string;
    orderId: string;
  }>();

  const { data, isLoading } = useFetch<OrderResponse, OrderParams>(
    getOrderByID,
    { id: orderId }
  );

  if (isLoading) {
    return <Text>LOADING ...</Text>;
  }

  return (
    <View style={styles.container}>
      <Header>{getDayOfWeek(dayDate) + " " + formatFullUIDate(dayDate)}</Header>
      <ScrollView style={styles.info}>
        <View style={styles.list}>
          <Order order={data!.order} workers={data!.workers} />
          <Notes note={data?.order.note || ""} />
          <Button onPress={() => {}} color="#CB4545">
            Назначить
          </Button>
          <Button onPress={() => {}}>Отправить водителю</Button>
        </View>
      </ScrollView>
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
  info: {
    paddingTop: 10,
    height: "100%",
  },
  list: {
    flexDirection: "column",
    alignItems: "center",
    gap: 9,
  },
  extra: {
    width: "100%",
    backgroundColor: "#252525",
    opacity: 0.7,
    borderRadius: 20,

    paddingHorizontal: 20,
    paddingVertical: 8,

    marginBottom: 12,
  },
  extra_title: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: 200,
    marginBottom: 10,
  },
  extra_text: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: 400,
  },
});
