import { router, Stack } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <View style={styles.wrapper}>
      <StatusBar backgroundColor="#3C3C3C" style="light" />
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.navbar}>
            <TouchableOpacity onPress={() => router.push("/calendar")}>
              <Image
                style={styles.icon}
                source={require("../../assets/icons/calendar.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/settings")}>
              <Image source={require("../../assets/icons/menu.png")} />
            </TouchableOpacity>
          </View>
          <View style={styles.header}>
            <Text style={styles.header_text}>{}</Text>
          </View>
        </View>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
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
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#3C3C3C",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "inherit",
    paddingTop: 10,
    paddingHorizontal: 28,
  },
  icon: {},
  header: {
    borderBottomWidth: 1,
    borderColor: "#fff",
    opacity: 0.5,
    paddingBottom: 9,
  },
  header_text: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
  },
});
