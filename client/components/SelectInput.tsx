import {
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { FunctionComponent, useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import Text from "./Text";

interface Props {
  placeholder: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const data = [
  { key: 1, value: `Владос` },
  { key: 2, value: "Александр" },
  { key: 3, value: "Дмитрий" },
  { key: 4, value: "Егор" },
  { key: 5, value: "Даниил" },
];

const SelectInput: FunctionComponent<Props> = ({
  name,
  placeholder,
  value,
  onChange,
}) => {
  const formattedData = data.map((e) => ({
    key: e.key,
    value: `${name} ${e.value}`,
  }));

  return (
    <SelectList
      setSelected={onChange}
      data={formattedData}
      placeholder={name + placeholder}
      arrowicon={<></>}
      searchicon={<></>}
      search={false}
      boxStyles={styles.boxStyles}
      inputStyles={{
        ...styles.inputStyles,
        color: value ? styles.selectedText.color : styles.placeholderText.color,
      }}
      dropdownStyles={styles.dropdownStyles}
      dropdownItemStyles={styles.dropdownItemStyles}
      dropdownTextStyles={styles.dropdownTextStyles}
    />
  );
};

export default SelectInput;

const styles = StyleSheet.create({
  input_name: {
    width: "100%",
    color: "#FFF",
    fontSize: 20,
    fontWeight: 200,
  },

  boxStyles: {
    width: "100%",
    height: 51,

    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#252525",
    // borderColor: "#fff",

    backgroundColor: "#252525",

    zIndex: 10,
    padding: 0,
    margin: 0,
    paddingLeft: 12,
  },
  inputStyles: {
    fontSize: 20,
    fontWeight: 300,
    textAlign: "left",
  },
  selectedText: {
    color: "#FFF",
  },
  placeholderText: {
    color: "#A6A6A6",
  },
  dropdownStyles: {
    width: "100%",
    height: 170,
    backgroundColor: "#252525",
    borderRadius: 20,
    zIndex: 50,

    marginTop: 10,

    shadowColor: "#FFF",
    shadowOffset: { width: 10, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,

    borderWidth: 1,
    borderColor: "#A6A6A6",
  },
  dropdownItemStyles: {
    width: "100%",
    height: 51,
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownTextStyles: {
    width: "100%",
    fontSize: 20,
    color: "#fff",
    fontWeight: 300,
    textAlign: "left",
  },
});
