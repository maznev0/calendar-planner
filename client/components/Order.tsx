import { router, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import Text from "./Text";
import { STATE_COLOR } from "../constants/order";
import { IOrder } from "../types/order";
import { Worker } from "../types/users";

interface Props {
  order: IOrder;
  workers: Worker[];
}

function Order({ order }: Props) {
  const {
    id,
    order_date,
    order_address,
    phone_number,
    meters,
    price,
    order_state,
    drivername,
    car_color,
  } = order;

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.top_text}>📍 {order_address}</Text>
        <Text
          style={[styles.top_text, { fontStyle: "italic" }]}
          onPress={() => Linking.openURL(`tel:${phone_number}`)}
        >
          📞 {phone_number}
        </Text>
      </View>
      <View style={styles.bottom}>
        <View style={styles.left}>
          {/* <Text style={styles.worker}>👷‍♂️ {worker_names?.join(", ") || ""}</Text> */}
          <View style={styles.driver_item}>
            <View style={styles.driver_name}>
              <View
                style={[
                  styles.car_color,
                  {
                    backgroundColor: car_color,
                  },
                ]}
              />
              <Text style={styles.driver_text}>{drivername}</Text>
            </View>
            <View style={styles.color} /> {drivername}
          </View>
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
    </View>
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
    maxWidth: "100%",
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
  driver_item: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  driver_text: {
    fontSize: 15,
    fontWeight: 200,
    color: "#fff",
    width: "100%",
    // fontSize: 20,
    // color: "#fff",
    // fontWeight: 300,
    textAlign: "left",
  },
  car_color: { width: 10, height: 10, borderRadius: "50%" },
  driver_name: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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

export default Order;
