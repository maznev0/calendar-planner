import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Payment from "../../../components/Payment";
import Calendar from "../../../components/Calendar";

const index = () => {
  return (
    <View style={styles.container}>
      <Calendar />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingBottom: 15,
    //  paddingHorizontal: 20,
  },
});
