import { View, StyleSheet } from "react-native";
import Text from "./Text";

export default function WorkerItem() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>👷</Text>
      <Text style={styles.name}>Даник педик</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 73,
    backgroundColor: "#252525",

    borderRadius: 20,
    marginBottom: 14,
    paddingHorizontal: 17,

    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 300,
    color: "#FFF",
  },
});
