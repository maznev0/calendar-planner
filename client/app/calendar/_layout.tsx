import { router, Stack } from "expo-router";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import Text from "../../components/Text";

export default function Layout() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => router.back()}>
            <View style={{ width: 40, height: 40 }}>
              <Image
                style={styles.icon}
                source={require("../../assets/icons/back.png")}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.year}>{new Date().getFullYear()}</Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  year: {
    fontSize: 22,
    color: "#E4D478",
    fontWeight: 500,
  },
  icon: {},
});
