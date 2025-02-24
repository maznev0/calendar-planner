import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { FunctionComponent } from "react";

interface Props {
  placeholder: string;
  name: string;
}

const Input: FunctionComponent<Props> = ({ placeholder, name }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.input_name}>{name}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#A6A6A6"
        style={styles.input}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 51,

    flexDirection: "row",
    alignItems: "center",
    gap: 10,

    borderRadius: 20,
    backgroundColor: "#252525",

    paddingHorizontal: 12,
  },
  input_name: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: 200,
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontSize: 20,
    fontWeight: 300,
  },
});
