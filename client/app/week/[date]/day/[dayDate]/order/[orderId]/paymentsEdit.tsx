import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../../../../../../components/Header";
import Input from "../../../../../../../components/Input";
import InputArea from "../../../../../../../components/InputArea";
import Button from "../../../../../../../components/Button";
import {
  getOrderByID,
  updateOrder,
  updatePayments,
} from "../../../../../../../api/order";
import useFetch from "../../../../../../../hooks/useFetch";
import {
  IOrderUpdate,
  OrderParams,
  OrderResponse,
} from "../../../../../../../types/order";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  formatDayMonthUIDate,
  getDayOfWeek,
} from "../../../../../../../utils/date";
import Text from "../../../../../../../components/Text";
import { WorkerResponse } from "../../../../../../../types/users";
import Loader from "../../../../../../../components/Loader";

const Edit = () => {
  const { date, dayDate, orderId } = useLocalSearchParams<{
    date: string;
    dayDate: string;
    orderId: string;
  }>();

  const { data, isLoading } = useFetch<OrderResponse, OrderParams>(
    getOrderByID,
    { id: orderId }
  );

  const router = useRouter();

  const [order, setOrder] = useState({
    total_price: "",
    driver_price: "",
    polish: "",
    other_price: "",
    workers: [] as WorkerResponse[],
  });

  useEffect(() => {
    if (data) {
      setOrder({
        total_price: data?.payments.total_price + "",
        driver_price: data?.payments.driver_price + "",
        polish: data?.payments.polish + "",
        other_price: data?.payments.other_price + "",
        workers: data?.workers,
      });
    }
  }, [data]);

  const handleChangeText = (field: string, value: string) => {
    setOrder({ ...order, [field]: value });
  };

  const handleSetWorkerPayment = (worker_id: number, value: string) => {
    const w = order.workers.map((w) => {
      if (w.worker_id === worker_id) {
        return { ...w, worker_payment: value };
      } else return w;
    });
    setOrder({ ...order, workers: w });
  };

  const handleSubmit = async () => {
    const fetchPayments = {
      order_id: data?.order.id,
      driver_id: data?.order.driver_id,
      total_price: Number(order.total_price),
      driver_price: Number(order.driver_price),
      polish: Number(order.polish),
      other_price: Number(order.other_price),
      workers_payments: order.workers.map((w) => ({
        worker_id: w.worker_id,
        worker_payment: Number(w.worker_payment),
      })),
    };

    await updatePayments(fetchPayments);
    router.back();
    router.back();
    router.push(`/week/${date}/day/${dayDate}/order/${orderId}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}
    >
      <View style={styles.container}>
        <Header>
          {getDayOfWeek(dayDate) + " " + formatDayMonthUIDate(dayDate)}
        </Header>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.list}>
            <Input
              placeholder=""
              name="Общий расчет"
              type="number-pad"
              value={order.total_price}
              onChangeText={(e: string) => handleChangeText("total_price", e)}
            />
            <Input
              placeholder=""
              name="Расчет водителю"
              type="number-pad"
              value={order.driver_price}
              onChangeText={(e: string) => handleChangeText("driver_price", e)}
            />
            {order.workers.length > 0 &&
              order.workers.map(({ worker_id, workername }) => (
                <Input
                  key={worker_id}
                  placeholder=""
                  name={workername}
                  type="number-pad"
                  value={
                    order.workers.filter((w) => w.worker_id === worker_id)[0]
                      .worker_payment + ""
                  }
                  onChangeText={(e: string) =>
                    handleSetWorkerPayment(worker_id, e)
                  }
                />
              ))}
            <Input
              placeholder=""
              name="Расходы"
              type="number-pad"
              value={order.other_price}
              onChangeText={(e: string) => handleChangeText("other_price", e)}
            />
            <Input
              placeholder=""
              name="Лак"
              type="number-pad"
              value={order.polish}
              onChangeText={(e: string) => handleChangeText("polish", e)}
            />
          </View>
        </ScrollView>
        <Button onPress={handleSubmit}>Изменить</Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  key: {
    flex: 1,
  },
  scroll: {},
  list: {
    marginVertical: 10,
    flexDirection: "column",
    gap: 14,
  },
});
