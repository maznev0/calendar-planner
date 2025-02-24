import { router } from "expo-router";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import DriverItem from "../../components/DriverItem";
import WorkerItem from "../../components/WorkerItem";

export default function Users() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <DriverItem />
        <DriverItem />
        <DriverItem />
        <WorkerItem />
        <WorkerItem />
        <WorkerItem />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 20,
  },
  list: {
    paddingVertical: 15,
  },
  driver: {
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
  driver_name: {
    fontSize: 24,
    color: "#FFF",
  },
});
