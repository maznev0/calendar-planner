import { StyleSheet, View } from "react-native";
import Text from "./Text";

interface Props {
  car: {
    color: string;
    carname: string;
    car_profit: number;
  };
}

export const CarPayment = ({ car }: Props) => {
  const { color, carname, car_profit } = car;
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <View style={[styles.color, { backgroundColor: color }]} />
        <Text style={styles.name}>{carname}</Text>
      </View>
      <Text style={styles.profit}>{car_profit}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 55,
    backgroundColor: "#252525",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  info: {
    flexDirection: "row",
    gap: 11,
    alignItems: "center",
  },
  color: {
    width: 15,
    height: 15,
    borderRadius: "50%",
  },
  name: {
    fontSize: 23,
    fontWeight: 200,
    color: "#FFF",
  },
  profit: {
    fontSize: 35,
    color: "#E4D478",
    fontWeight: "200",
  },
});
