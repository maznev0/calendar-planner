import { router, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import Text from "./Text";
import { STATE_COLOR } from "../constants/order";
import { OrderState } from "../types/order";

interface Props {
  order: {
    id: string;
    order_date: string;
    order_address: string;
    phone_number: string;
    meters: number;
    price: number;
    order_state: OrderState;
    driver_name: string;
    car_color: string;
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
    car_color,
    worker_names,
  } = order;
  const { date, dayDate } = useLocalSearchParams<{
    date: string;
    dayDate: string;
  }>();

  let workersString = "";
  if (worker_names?.length) {
    workersString =
      "👷‍♂️" +
      worker_names[0] +
      (worker_names.length - 1 ? ` +${worker_names.length - 1}` : "");
  }

  return (
    <TouchableOpacity
      onPress={() => router.push(`/week/${date}/day/${dayDate}/order/${id}`)}
      style={styles.container}
    >
      <View style={styles.top}>
        <Text style={styles.address_text}>📍 {order_address}</Text>
        <Text
          style={[styles.phone_number, { fontStyle: "italic" }]}
          onPress={() => Linking.openURL(`tel:${phone_number}`)}
        >
          📞 {phone_number}
        </Text>
      </View>
      <View style={styles.bottom}>
        <View style={styles.left}>
          <Text style={styles.worker}>{workersString}</Text>
          <Text style={styles.driver}>
            <View style={[styles.car_color, { backgroundColor: car_color }]} />{" "}
            {driver_name}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.money}>
            {meters} - {price} BYN
          </Text>
          <Text style={[styles.type, { color: STATE_COLOR[order_state] }]}>
            {order_state}
          </Text>
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

    paddingHorizontal: 10,
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
    maxWidth: "100%",
    fontSize: 20,
    color: "#E4D478",
  },
  address_text: {
    fontSize: 25,
    color: "#E4D478",
  },
  phone_number: {
    maxWidth: "60%",
    fontSize: 17,
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
    width: "100%",
    fontSize: 18,
    color: "#fff",
  },
  car_color: {
    width: 9,
    height: 9,
    borderRadius: "50%",
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
