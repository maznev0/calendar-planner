import { StyleSheet, View, TextInput } from "react-native";
import React, { FunctionComponent, useState } from "react";
import Text from "./Text";

interface Props {
  placeholder: string;
  name: string;
  type?:
    | "default"
    | "phone-pad"
    | "numeric"
    | "decimal-pad"
    | "numbers-and-punctuation"
    | "number-pad";
  defaultValue?: string;
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
}

const Input: FunctionComponent<Props> = ({
  placeholder,
  name,
  type = "default",
  value,
  onChangeText,
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View style={[styles.container, isFocused && styles.focusedInput]}>
      <Text style={styles.input_name}>{name}</Text>
      <TextInput
        value={value}
        maxLength={maxLength}
        onChangeText={(e) => onChangeText(e)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#A6A6A6"
        keyboardType={type}
        allowFontScaling={false}
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

    borderWidth: 1,
    borderColor: "#252525",
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
  focusedInput: {
    borderColor: "#E4D478",
  },
});
