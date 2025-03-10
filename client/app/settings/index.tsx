import { router } from "expo-router";
import {  View, StyleSheet, Image, TouchableOpacity } from "react-native";
import Text from "../../components/Text";

export default function Settings() {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Image
          style={styles.icon}
          source={require("../../assets/icons/statistics.png")}
        />
        <Text style={styles.item_text}>Статистика</Text>
      </View>
      <TouchableOpacity onPress={() => router.push("/users")}>
        <View style={styles.item}>
          <Image
            style={styles.icon}
            source={require("../../assets/icons/users.png")}
          />
          <Text style={styles.item_text}>Пользователи</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.item}>
        <Image
          style={styles.icon}
          source={require("../../assets/icons/password.png")}
        />
        <Text style={styles.item_text}>Поменять пароль</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 28,

    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 52,
  },
  item: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  icon: {},
  item_text: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: 200,
  },
});
