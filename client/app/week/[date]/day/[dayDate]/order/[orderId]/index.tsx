import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import Header from "../../../../../../../components/Header";
import Button from "../../../../../../../components/Button";
import { router, useLocalSearchParams } from "expo-router";
import useFetch from "../../../../../../../hooks/useFetch";
import Order from "../../../../../../../components/Order";
import { OrderParams, OrderResponse } from "../../../../../../../types/order";
import {
  getOrderByID,
  sendOrderToDriver,
  updateOrder,
} from "../../../../../../../api/order";
import Notes from "../../../../../../../components/Notes";
import {
  formatDayMonthUIDate,
  getDayOfWeek,
} from "../../../../../../../utils/date";
import Payment from "../../../../../../../components/Payment";

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

  const handleSendToDriver = async () => {
    await sendOrderToDriver({
      order: data!.order,
      workers: data!.workers.map((w) => ({
        worker_id: w.worker_id,
        workername: w.workername,
      })),
    });
    router.back();
  };

  if (isLoading) {
    return <Text>LOADING ...</Text>;
  }

  return (
    <View style={styles.container}>
      <Header>
        {getDayOfWeek(dayDate) + " " + formatDayMonthUIDate(dayDate)}
      </Header>
      <ScrollView style={styles.info}>
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={() =>
              router.push(`/week/${date}/day/${dayDate}/order/${orderId}/edit`)
            }
          >
            <Text style={styles.menu_text}>Изменить</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push(`/week/${date}/day/${dayDate}/order/${orderId}/edit`)
            }
          >
            <Text style={[styles.menu_text, { color: "#CB4545" }]}>
              Удалить
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.list}>
          {data?.order && <Order order={data.order} />}

          {data?.workers && (
            <View style={styles.workers}>
              <Text style={styles.workername}>
                {data.workers
                  .map(({ workername }) => "👷‍♂️" + workername)
                  .join("  ")}
              </Text>
            </View>
          )}
          {data?.order.note && data.order.note.length > 0 && (
            <Notes note={data.order.note} />
          )}
        </View>
      </ScrollView>
      <View style={styles.buttons}>
        <Button
          onPress={() => {
            // router.push(`/week/${date}/day/${dayDate}/order/${orderId}/edit`);
          }}
          color="#CB4545"
        >
          Назначить
        </Button>
        <Button onPress={handleSendToDriver}>Отправить водителю</Button>
      </View>
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
  menu: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  menu_text: {
    color: "#E4D478",
    fontSize: 20,
    textDecorationLine: "underline",
  },
  list: {
    flexDirection: "column",
    alignItems: "center",
    gap: 9,
  },
  workers: {
    width: "100%",
    height: "auto",
    backgroundColor: "#252525",
    borderRadius: 20,

    paddingHorizontal: 17,
    paddingVertical: 11,
  },
  workername: {
    fontSize: 18,
    color: "#fff",
    lineHeight: 35,
  },
  buttons: {
    width: "100%",
    flexDirection: "column",
    gap: 10,
  },
});
