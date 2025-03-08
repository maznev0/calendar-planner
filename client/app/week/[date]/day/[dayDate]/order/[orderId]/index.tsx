import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import Header from "../../../../../../../components/Header";
import OrderCard from "../../../../../../../components/OrderCard";
import Button from "../../../../../../../components/Button";
import { useLocalSearchParams } from "expo-router";
import useFetch from "../../../../../../../hooks/useFetch";
import OrderC from "../../../../../../../components/Order";
import {
  IOrder,
  OrderParams,
  OrderResponse,
} from "../../../../../../../types/order";
import { getOrderByID } from "../../../../../../../api/order";
import { Worker } from "../../../../../../../types/users";

export default function Order() {
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
      <Header>Понедельник 27 января</Header>
      <ScrollView style={styles.info}>
        <View style={styles.list}>
          <OrderC order={data!.order} workers={data!.workers} />
          <View style={styles.extra}>
            <Text style={styles.extra_title}>📌 Примечание:</Text>
            <Text style={styles.extra_text}>
              Александра Нужно взять лак со склада Позвонить за час Саня
              халтурщик укпукпыпыкупе
              упыкуывпшгфрапшгрыушкщгпршущгырпупргущшгпрщшу ывщшаофщшукпрощукш
              Дима забирает все деньги
            </Text>
          </View>
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
