import { View, StyleSheet } from "react-native";
import Text from "./Text";

interface Props {
  name: string;
  carColor: string;
}

export default function DriverItem({ name, carColor }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.color, { backgroundColor: carColor }]} />
      <Text style={styles.name}>{name}</Text>
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
  },
  name: {
    fontSize: 24,
    fontWeight: 300,
    color: "#FFF",
  },
});
