import { StyleSheet, View, TextInput } from "react-native";
import React, { FunctionComponent, useState } from "react";
import Text from "./Text";

interface Props {
  placeholder: string;
  name: string;
  defaultValue?: string;
  value: string;
  onChangeText: (text: string) => void;
}

const InputArea: FunctionComponent<Props> = ({
  placeholder,
  name,

  value,
  onChangeText,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View style={[styles.container, isFocused && styles.focusedInput]}>
      <Text style={styles.input_name}>{name}</Text>
      <TextInput
        value={value}
        onChangeText={(e) => onChangeText(e)}
        placeholder={placeholder}
        placeholderTextColor="#A6A6A6"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        allowFontScaling={false}
        multiline={true}
        style={styles.input}
        textAlignVertical="top"
      />
    </View>
  );
};

export default InputArea;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 258,

    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,

    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 20,
    backgroundColor: "#252525",
    paddingVertical: 8,
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
