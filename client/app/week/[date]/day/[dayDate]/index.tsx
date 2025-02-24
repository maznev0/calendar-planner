import { Text, View, StyleSheet, ScrollView } from "react-native";
import OrderCard from "../../../../../components/OrderCard";
import Header from "../../../../../components/Header";
import Button from "../../../../../components/Button";
import { router } from "expo-router";

export default function Day() {
  return (
    <View style={styles.container}>
      <Header>Понедельник 27 января</Header>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
      </ScrollView>
      <Button
        onPress={() => {
          router.push("/week/1/day/1/order/add");
        }}
      >
        Добавить
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  list: {
    paddingVertical: 15,
    height: "100%",
  },
});
