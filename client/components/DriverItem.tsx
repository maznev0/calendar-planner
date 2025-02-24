import { Text, View, StyleSheet } from "react-native";

export default function DriverItem() {
  return (
    <View style={styles.container}>
      <View style={styles.color} />
      <Text style={styles.name}>Владос хуесос</Text>
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
  color: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    backgroundColor: "#EA8D00",
  },
  name: {
    fontSize: 24,
    fontWeight: 300,
    color: "#FFF",
  },
});
