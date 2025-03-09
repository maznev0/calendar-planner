import { StyleSheet, Text, View } from "react-native";
import React from "react";

interface Props {}

const Payment = () => {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.name}>Общий расчет</Text>
        <Text style={styles.sum}>150 BYN</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.name}>Расчет рабочему</Text>
        <Text style={styles.sum}>150 BYN</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.name}>Расчет водителю</Text>
        <Text style={styles.sum}>150 BYN</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.name}>Расходы</Text>
        <Text style={styles.sum}>150 BYN</Text>
      </View>
      <View style={[styles.item, styles.total]}>
        <Text style={[styles.name, { fontWeight: 400 }]}>Итог</Text>
        <Text style={[styles.sum, { fontWeight: 400 }]}>150 BYN</Text>
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
