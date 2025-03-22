import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Payments } from "../types/order";
import { WorkerResponse } from "../types/users";
import { router, useLocalSearchParams } from "expo-router";

interface Props {
  payments: Payments;
  workers: WorkerResponse[];
  showEdit: boolean;
}

const Payment = ({ payments, workers, showEdit }: Props) => {
  const { date, dayDate, orderId } = useLocalSearchParams();
  const { total_price, driver_price, other_price, polish, profit } = payments;

  const handleEdit = () => {
    router.push(`/week/${date}/day/${dayDate}/order/${orderId}/paymentsEdit`);
  };
  return (
    <View style={styles.container}>
      {showEdit && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleEdit}>
            <Text style={styles.menu_text}>Изменить</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.item}>
        <Text style={styles.name}>Общий расчет</Text>
        <Text style={styles.sum}>{total_price} BYN</Text>
      </View>
      {workers &&
        workers.length > 0 &&
        workers.map(({ worker_id, workername, worker_payment }) => (
          <View style={styles.item} key={worker_id}>
            <Text style={styles.name}>👷‍♂️ {workername}</Text>
            <Text style={styles.sum}>{worker_payment} BYN</Text>
          </View>
        ))}
      <View style={styles.item}>
        <Text style={styles.name}>Расчет водителю</Text>
        <Text style={styles.sum}>{driver_price} BYN</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.name}>Лак</Text>
        <Text style={styles.sum}>{polish} л</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.name}>Расходы</Text>
        <Text style={styles.sum}>{other_price} BYN</Text>
      </View>

      <View style={[styles.item, styles.total]}>
        <Text style={[styles.name, { fontWeight: 400 }]}>Итог</Text>
        <Text style={[styles.sum, { fontWeight: 400 }]}>{profit} BYN</Text>
      </View>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#252525",
    borderRadius: 20,

    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,

    paddingHorizontal: 16,
    paddingVertical: 10,

    //  marginBottom: 12,
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

  item: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 23,
    fontWeight: 200,
    color: "#FFF",
  },
  sum: {
    fontSize: 23,
    fontWeight: 200,
    color: "#E4D478",
  },
  total: {
    borderTopWidth: 1,
    borderTopColor: "#E4D478",
    fontWeight: 400,
    paddingTop: 10,
  },
});
