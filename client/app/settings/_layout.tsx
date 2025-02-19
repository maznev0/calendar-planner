// app/_layout.tsx
import { router, Stack } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

export default function Layout() {
  return (
    <SafeAreaView style={styles.container}>
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
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#3C3C3C",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "inherit",
    paddingHorizontal: 28,
  },
  icon: {},
});
