import { router } from "expo-router";
import { View, StyleSheet, ScrollView } from "react-native";
import DriverItem from "../../components/DriverItem";
import WorkerItem from "../../components/WorkerItem";
import useFetch from "../../hooks/useFetch";
import { getAllUsers } from "../../api/order";
import Text from "../../components/Text";

export default function Users() {
  const { isLoading, data } = useFetch(getAllUsers);

  if (isLoading) return <Text>Loading ...</Text>;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {data &&
          data.map((user) => {
            switch (user.user_role) {
              case "driver":
                return (
                  <DriverItem
                    id={user.id}
                    name={user.username}
                    carColor={user.car_color}
                    key={user.id}
                  />
                );
              case "worker":
                return (
                  <WorkerItem id={user.id} name={user.username} key={user.id} />
                );
            }
          })}
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
