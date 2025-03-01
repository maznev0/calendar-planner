import { router } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import Text from "./Text";

function OrderCard() {
  return (
    <TouchableOpacity
      onPress={() => router.push("/week/1/day/1/order/1")}
      style={styles.container}
    >
      <View style={styles.top}>
        <Text style={styles.top_text}>📍 Левкова 6-24</Text>
        <Text
          style={styles.top_text}
          onPress={() => Linking.openURL("tel:+375296453966")}
        >
          📞 +375296453966
        </Text>
      </View>
      <View style={styles.bottom}>
        <View style={styles.left}>
          <Text style={styles.worker}>👷‍♂️ Игорь, Петр</Text>
          <Text style={styles.driver}>
            <View style={styles.color} /> Александр
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.money}>23.6 - 60 BYN</Text>
          <Text style={styles.type}>Ожидает назначения</Text>
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
