import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import Header from "../../../../../../components/Header";
import { SelectList } from "react-native-dropdown-select-list";
import Input from "../../../../../../components/Input";
import SelectInput from "../../../../../../components/SelectInput";

const Add = () => {
  return (
    <View style={styles.container}>
      <Header>Понедельник 27 января</Header>
      {/* <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      > */}
      <View style={styles.list}>
        <Input placeholder="Площадь" name="М²" />
        <Input placeholder="Цена за квадрат" name="BYN" />
        <Input placeholder="Адрес" name="📍" />
        <Input placeholder="+375" name="" />
        <SelectInput />
        <SelectInput />
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  list: {
    marginVertical: 10,
    flexDirection: "column",
    gap: 14,
  },
});
