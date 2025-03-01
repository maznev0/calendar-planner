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
  isOpen: boolean;
  setIsOpen: () => void;
}

const SelectInput1: FunctionComponent<Props> = ({
  name,
  placeholder,
  isOpen,
  setIsOpen,
}) => {
  const [selected, setSelected] = useState<string>();

  const data = [
    { key: 1, value: "Петя" },
    { key: 2, value: "Александр" },
    { key: 3, value: "Дмитрий" },
    { key: 4, value: "Егор" },
    { key: 5, value: "Даниил" },
  ];

  return (
    // <View style={[styles.wrapper, { zIndex: isOpen ? 100 : 1 }]}>
    //   <Pressable style={styles.box} onPress={setIsOpen}>
    <View style={styles.container}>
      <View style={styles.label}>
        <Text style={styles.label_text}>{name}</Text>
      </View>
      <SelectList
        setSelected={(value: string) => setSelected(value)}
        data={data}
        placeholder={placeholder}
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
        // dropdownStyles={{
        //   ...styles.dropdownStyles,
        //   display: isOpen ? undefined : "none",
        // }}
        // dropdownStyles={{
        //   ...styles.dropdownStyles,
        //   ...(isOpen ? styles.none : styles.d),
        // }}
        dropdownItemStyles={styles.dropdownItemStyles}
        dropdownTextStyles={styles.dropdownTextStyles}
        // dropdownShown={isOpen}
      />
    </View>
    //   </Pressable>
    // </View>
  );
};
{
  /* </View> */
}

export default SelectInput1;

const styles = StyleSheet.create({
  none: {
    display: "none",
  },
  d: {},
  wrapper: {
    width: "100%",
    position: "relative",
  },
  box: {
    width: "100%",
    height: 51,
    // zIndex: 5,
    // // position: "relative",
    // overflow: "visible",
  },
  container: {
    width: "100%",
    // height: "100%",
    height: 51,

    borderRadius: 20,
    backgroundColor: "#252525",

    // position: "relative",

    // flexDirection: "row",
    // alignItems: "center",

    // overflow: "visible",
  },
  label: {
    height: "100%",

    flexDirection: "row",
    alignItems: "center",

    position: "absolute",
    left: 12,
    zIndex: 20,
  },
  label_text: {
    color: "#A6A6A6",
    fontSize: 20,
  },
  // input_bl: {
  //   width: "10%",
  // },
  input_name: {
    width: "100%",
    color: "#FFF",
    fontSize: 20,
    fontWeight: 200,
  },

  boxStyles: {
    width: "100%",
    height: "100%",
    // flexGrow: 1,

    borderRadius: 20,
    borderWidth: 1,
    // borderColor: "#252525",
    borderColor: "#fff",

    backgroundColor: "#252525",

    zIndex: 10,
    padding: 0,
    margin: 0,
    paddingLeft: 40,
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
    // borderWidth: 0,

    position: "absolute",
    top: 55,
    left: 0,
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
