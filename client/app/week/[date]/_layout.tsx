import { router, Stack } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => router.push("/calendar")}>
            <Image
              style={styles.icon}
              source={require("../../../assets/icons/calendar.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Image source={require("../../../assets/icons/menu.png")} />
          </TouchableOpacity>
        </View>
      </View>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: "#3C3C3C",
  },
  header: {
    paddingHorizontal: 20,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  icon: {},
});
