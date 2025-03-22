import { StyleSheet, View } from "react-native";
import Text from "./Text";

interface Props {
  payments: {
    total_price_week: number;
    total_price_workers: number;
    total_other_price: number;
    total_polish: number;
    medium_meters: number;
    done_orders: number;
    left_orders: number;
    total_profit: number;
  };
}

const StatisticsWeek = ({ payments }: Props) => {
  const {
    total_price_week,
    total_price_workers,
    total_other_price,
    total_polish,
    medium_meters,
    done_orders,
    left_orders,
    total_profit,
  } = payments;

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.name}>Общий расчет</Text>
        <Text style={styles.sum}>{total_price_week} BYN</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.name}>Расчет рабочим</Text>
        <Text style={styles.sum}>{total_price_workers} BYN</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.name}>Все расходы</Text>
        <Text style={styles.sum}>{total_other_price} BYN</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.name}>Средний метраж</Text>
        <Text style={styles.sum}>{medium_meters.toFixed(2)} М²</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.name}>Всего лака</Text>
        <Text style={styles.sum}>{total_polish} л</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.name}>Выполнено заказов</Text>
        <Text style={styles.sum}>{done_orders}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.name}>Невыполненных заказов</Text>
        <Text style={styles.sum}>{left_orders}</Text>
      </View>
      <View style={[styles.item, styles.total]}>
        <Text style={[styles.name, { fontWeight: 500 }]}>Итог</Text>
        <Text style={[styles.sum, { fontWeight: 500 }]}>
          {total_profit} BYN
        </Text>
      </View>
    </View>
  );
};

export default StatisticsWeek;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: "100%",
    backgroundColor: "#252525",
    borderRadius: 20,
    padding: 20,
    flexDirection: "column",
    gap: 15,
  },
  br: {
    height: 30,
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
