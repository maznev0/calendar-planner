import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React from "react";
import Header from "../../../../../../../components/Header";
import Button from "../../../../../../../components/Button";
import { router, useLocalSearchParams } from "expo-router";
import useFetch from "../../../../../../../hooks/useFetch";
import Order from "../../../../../../../components/Order";
import { OrderParams, OrderResponse } from "../../../../../../../types/order";
import {
  deleteOrder,
  getOrderByID,
  sendOrderToDriver,
  updateOrder,
} from "../../../../../../../api/order";
import Notes from "../../../../../../../components/Notes";
import {
  formatDate,
  formatDayMonthUIDate,
  getDayOfWeek,
} from "../../../../../../../utils/date";
import Payment from "../../../../../../../components/Payment";
import Loader from "../../../../../../../components/Loader";

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
    const fetchWorkers = data?.workers
      ? data!.workers.map((w) => ({
          worker_id: w.worker_id,
          workername: w.workername,
        }))
      : null;
    const [year, month, day] = data!.order.order_date.split("-");

    const newDateStr = `${day}-${month}-${year}`;

    await sendOrderToDriver({
      order: { ...data!.order, order_date: newDateStr },
      workers: fetchWorkers,
    });

    router.back();
    router.back();
    router.push(`/week/${date}/day/${dayDate}`);
  };

  const handleDelete = async () => {
    await Alert.alert(
      "Подтверждение",
      "Вы уверены, что хотите удалить заказ?",
      [
        {
          text: "Нет",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Да",
          onPress: async () => {
            if (data?.order.id) {
              await deleteOrder(data?.order.id);
              router.back();
              router.back();
              router.replace(`/week/${date}`);
              router.push(`/week/${date}/day/${dayDate}`);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDone = async () => {
    const doneOrder = {
      id: data!.order.id,
      price: data!.order.price,
      meters: data!.order.meters,
      order_date: data!.order.order_date,
      order_address: data!.order.order_address,
      phone_number: data!.order.phone_number,
      note: data!.order.note,
      order_state: "Готов",
    };
    await updateOrder(doneOrder);
    router.back();
    router.back();
    router.push(`/week/${date}/day/${dayDate}`);
  };
  const handleHeaderPress = () => {
    router.replace(`/week/${formatDate(new Date())}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header onPress={handleHeaderPress}>
        {getDayOfWeek(dayDate) + " " + formatDayMonthUIDate(dayDate)}
      </Header>
      <ScrollView style={styles.info} showsVerticalScrollIndicator={false}>
        {data?.order.order_state !== "Отправлено" && (
          <View style={styles.menu}>
            {data?.order.order_state !== "Готов" && (
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/week/${date}/day/${dayDate}/order/${orderId}/edit`
                  )
                }
              >
                <Text style={styles.menu_text}>Изменить</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={handleDelete}>
              <Text style={[styles.menu_text, { color: "#CB4545" }]}>
                Удалить
              </Text>
            </TouchableOpacity>
          </View>
        )}

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

          {(!!data?.payments.total_price || !!data?.payments.driver_price) && (
            <Payment
              payments={data?.payments}
              workers={data?.workers}
              showEdit={data?.order.order_state !== "Готов"}
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.buttons}>
        {
          {
            "Ожидает отправления": (
              <>
                <Button
                  onPress={() => {
                    router.push(
                      `/week/${date}/day/${dayDate}/order/${orderId}/set/${
                        data?.order.driver_id || "null"
                      }`
                    );
                  }}
                  color="#CB4545"
                >
                  Назначить
                </Button>
                <Button onPress={handleSendToDriver}>Отправить водителю</Button>
              </>
            ),
            "Ожидает назначения": (
              <>
                <Button
                  onPress={() => {
                    router.push(
                      `/week/${date}/day/${dayDate}/order/${orderId}/set/${
                        data?.order.driver_id || "null"
                      }`
                    );
                  }}
                  color="#CB4545"
                >
                  Назначить
                </Button>
              </>
            ),
            "Ошибка отправления": (
              <>
                <Button
                  onPress={() => {
                    router.push(
                      `/week/${date}/day/${dayDate}/order/${orderId}/set/${
                        data?.order.driver_id || "null"
                      }`
                    );
                  }}
                  color="#CB4545"
                >
                  Назначить
                </Button>
                <Button onPress={handleSendToDriver}>Отправить водителю</Button>
              </>
            ),

            "Ожидает проверки": (
              <Button color="#4EDC3E" onPress={handleDone}>
                Готов
              </Button>
            ),
            Отправлено: <></>,
            Готов: <></>,
            default: <></>,
          }[data?.order.order_state || "default"]
        }
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

    marginBottom: 5,
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
    paddingTop: 5,
  },
});
