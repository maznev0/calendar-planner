import Text from "./Text";
import { STATE_COLOR } from "../constants/order";
import { IOrder } from "../types/order";
import { Linking, StyleSheet, View } from "react-native";

interface Props {
  order: IOrder;
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
    driver_id,
    car_color,
  } = order;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.address}>📍 {order_address}</Text>
        <Text
          style={styles.phone}
          onPress={() => Linking.openURL(`tel:${phone_number}`)}
        >
          📞 {phone_number}
        </Text>
      </View>
      <View style={styles.bottom}>
        <View style={styles.driver_item}>
          {drivername && drivername?.length > 0 && (
            <>
              <View style={styles.driver}>
                <View
                  style={[
                    styles.car_color,
                    {
                      backgroundColor: car_color,
                    },
                  ]}
                />
                <Text style={styles.driver_name}>{drivername}</Text>
              </View>
            </>
          )}
        </View>
        <View style={styles.right}>
          <Text style={styles.money}>
            {meters} - {price} BYN
          </Text>
          <Text style={[styles.state, { color: STATE_COLOR[order_state!] }]}>
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
    height: "auto",
    backgroundColor: "#252525",
    borderRadius: 20,

    paddingHorizontal: 17,
    paddingVertical: 11,

    flexDirection: "column",
    gap: 10,
  },
  header: {
    width: "100%",
    flexDirection: "column",
    gap: 9,
  },
  address: {
    maxWidth: "100%",
    fontSize: 25,
    color: "#E4D478",
  },
  phone: {
    maxWidth: "100%",
    fontSize: 20,
    color: "#E4D478",
    fontStyle: "italic",
  },
  bottom: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  driver_item: {
    width: "30%",
    alignSelf: "flex-end",
  },
  driver: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  driver_name: {
    fontSize: 16,
    fontWeight: 200,
    color: "#fff",
    width: "100%",
    textAlign: "left",
  },
  car_color: { width: 10, height: 10, borderRadius: "50%" },

  color: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    backgroundColor: "#006DEA",
    marginRight: 9,
  },

  right: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 10,
  },
  money: {
    fontSize: 18,
    fontWeight: 300,
    color: "#FFF",
  },
  state: {
    fontSize: 16,
    fontWeight: 200,
    color: "#919ED8",
  },
});

export default Order;
