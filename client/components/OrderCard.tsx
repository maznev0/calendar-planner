import { router } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import Text from "./Text";
import { FC } from "react";

// {
//   "id": "ddf51bd1-17be-4122-bfce-78c43efa758b",
//   "order_date": "2025-03-01",
//   "order_address": "Левкова 6-32",
//   "phone_number": "+375291234567",
//   "meters": 50.5,
//   "price": 40,
//   "driver_id": "c200fb3f-468a-4700-ad64-5649efeb0158",
//   "driver_name": "Михаил",
//   "note": "Позвонить за час. Взять со склада 30 литров лака.",
//   "order_state": "Ожидает назначения",
//   "worker_names": [
//       "Вадим",
//       "Леонид"
//   ]
// }

interface IOrder {
  id: string;
  order_date: string;
  order_address: string;
  phone_number: string;
  meters: number;
  price: number;
  order_state: string;
  driver_name: string;
  worker_names: string[];
}

interface Props {
  order: {
    id: string;
    order_date: string;
    order_address: string;
    phone_number: string;
    meters: number;
    price: number;
    order_state: string;
    driver_name: string;
    worker_names: string[];
  };
}

function OrderCard({ order }: Props) {
  const {
    id,
    order_date,
    order_address,
    phone_number,
    meters,
    price,
    order_state,
    driver_name,
    worker_names,
  } = order;

  return (
    <TouchableOpacity
      onPress={() => router.push("/week/1/day/1/order/1")}
      style={styles.container}
    >
      <View style={styles.top}>
        <Text style={styles.top_text}>📍 {order_address}</Text>
        <Text
          style={styles.top_text}
          onPress={() => Linking.openURL(`tel:${phone_number}`)}
        >
          📞 {phone_number}
        </Text>
      </View>
      <View style={styles.bottom}>
        <View style={styles.left}>
          <Text style={styles.worker}>👷‍♂️ {worker_names?.join(", ") || ""}</Text>
          <Text style={styles.driver}>
            <View style={styles.color} /> {driver_name}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.money}>
            {meters} - {price} BYN
          </Text>
          <Text style={styles.type}>{order_state}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 158,
    backgroundColor: "#252525",
    borderRadius: 20,

    paddingHorizontal: 17,
    paddingVertical: 11,

    flexDirection: "column",
    justifyContent: "space-between",

    marginBottom: 12,
  },
  top: {
    width: "100%",
    flexDirection: "column",
    gap: 9,
  },
  top_text: {
    maxWidth: "70%",
    fontSize: 20,
    color: "#E4D478",
  },
  bottom: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
  },
  worker: {
    fontSize: 18,
    color: "#fff",
  },
  color: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    backgroundColor: "#006DEA",
    marginRight: 9,
  },
  driver: {
    fontSize: 15,
    fontWeight: 200,
    color: "#fff",

    opacity: 0.6,
  },
  right: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 16,
  },
  money: {
    fontSize: 18,
    fontWeight: 300,
    color: "#FFF",
  },
  type: {
    fontSize: 16,
    fontWeight: 200,
    color: "#919ED8",
  },
});

export default OrderCard;
