import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import Text from "./Text";
import { deleteUser } from "../api/order";
import { router } from "expo-router";

interface Props {
  id: string;
  name: string;
  carColor: string;
}

export default function DriverItem({ id, name, carColor }: Props) {
  const handleDelete = async () => {
    await deleteUser(id);
    router.back();
    router.push("/users");
  };
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <View style={[styles.color, { backgroundColor: carColor }]} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <TouchableOpacity onPress={handleDelete}>
        <Image source={require("../assets/icons/trash.png")} />
      </TouchableOpacity>
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
    justifyContent: "space-between",
  },
  info: {
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
