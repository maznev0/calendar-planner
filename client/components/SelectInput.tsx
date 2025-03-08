import { Alert, StyleSheet, View } from "react-native";
import React, { FunctionComponent } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { IDriver } from "../types/users";
import Text from "./Text";

interface Props {
  placeholder: string;
  name: string;
  value: string;
  data: IDriver[];
  onChange: (value: string) => void;
}

// const data = [
//   { key: 1, value: `Владос` },
//   { key: 2, value: "Александр" },
//   { key: 3, value: "Дмитрий" },
//   { key: 4, value: "Егор" },
//   { key: 5, value: "Даниил" },
// ];

const SelectInput: FunctionComponent<Props> = ({
  name,
  placeholder,
  data,
  value,
  onChange,
}) => {
  const formattedData = data.map((e) => ({
    key: e.id,
    // value: `${name} ${e.username}`,
    value: (
      <View style={styles.driver_item}>
        <View style={styles.driver_name}>
          <View
            style={[
              styles.car_color,
              {
                backgroundColor: e.car_color,
              },
            ]}
          />
          <Text style={styles.driver_text}>
            {name || ""} {e.username}
          </Text>
        </View>
        {/* <View> */}
        <Text style={styles.orders}>{e.order_quantity}</Text>
        {/* </View> */}
      </View>
    ),
  }));

  return (
    <SelectList
      // setSelected={(e) => onChange(e.key)}
      setSelected={onChange}
      save="key"
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
  driver_item: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    // borderWidth: 1,
    // borderColor: "#FFF",
  },
  driver_text: {
    width: "100%",
    fontSize: 20,
    color: "#fff",
    fontWeight: 300,
    textAlign: "left",
  },
  car_color: { width: 10, height: 10, borderRadius: "50%" },
  driver_name: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  orders: {
    fontWeight: 300,
    fontSize: 23,
    color: "#FFF",
    textAlign: "center",
  },
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
    height: 200,
    backgroundColor: "#252525",
    borderRadius: 20,
    zIndex: 50,

    marginTop: 10,
    padding: 0,

    borderWidth: 1,
    borderColor: "#A6A6A6",
  },
  dropdownItemStyles: {
    width: "100%",
    height: 47,
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
