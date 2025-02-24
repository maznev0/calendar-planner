import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { FunctionComponent, useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";

interface Props {
  //   placeholder: string;
  //   name: string;
}

const SelectInput: FunctionComponent<Props> = () => {
  const [selected, setSelected] = useState<string>();

  const data = [
    { key: 1, value: "Петя" },
    { key: 2, value: "Александр" },
    { key: 3, value: "Дмитрий" },
    { key: 4, value: "Егор" },
    { key: 5, value: "Даниил" },
  ];

  return (
    <SelectList
      setSelected={(value: string) => setSelected(value)}
      data={data}
      placeholder="👷‍♂️ Рабочий"
      arrowicon={<></>}
      searchicon={<></>}
      search={false}
      boxStyles={styles.boxStyles}
      inputStyles={{
        ...styles.inputStyles,
        color: selected
          ? styles.selectedText.color
          : styles.placeholderText.color,
      }}
      dropdownStyles={styles.dropdownStyles}
      dropdownItemStyles={styles.dropdownItemStyles}
      dropdownTextStyles={styles.dropdownTextStyles}
      dropdownShown={true}
    />
  );
};

export default SelectInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  boxStyles: {
    width: "100%",
    height: 51,
    borderRadius: 20,
    borderWidth: 0,
    backgroundColor: "#252525",

    //  paddingHorizontal: 12,
  },
  inputStyles: {
    fontSize: 20,
    fontWeight: 300,
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
    borderWidth: 0,

    position: "absolute",
    top: 55,
    left: 0,
    zIndex: 1000,

    marginTop: 10,

    shadowColor: "#000",
    shadowOffset: { width: 10, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  dropdownItemStyles: {
    width: "100%",
    height: 51,
    flexDirection: "row",
    alignItems: "center",

    //  borderWidth: 1,
    //  borderColor: "#fff",
  },
  dropdownTextStyles: {
    width: "100%",
    fontSize: 20,
    color: "#fff",
    fontWeight: 300,
  },
});
