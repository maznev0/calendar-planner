import {
  Alert,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { FunctionComponent, useState } from "react";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import Text from "./Text";
import { IUser } from "../types/users";

interface Props {
  placeholder: string;
  name: string;
  // value: string;
  data: IUser[];
  onChange: (value: any) => void;
}

// const data = [
//   { key: 1, value: `Владос` },
//   { key: 2, value: "Александр" },
//   { key: 3, value: "Дмитрий" },
//   { key: 4, value: "Егор" },
//   { key: 5, value: "Даниил" },
// ];

const MultipleSelectInput: FunctionComponent<Props> = ({
  name,
  placeholder,
  data,
  // value,
  onChange,
}) => {
  const formattedData = data.map((e) => ({
    key: e.id,
    value: `${name} ${e.username}`,
  }));

  const [worker, setWorker] = useState([]);

  return (
    <View>
      <MultipleSelectList
        save="key"
        // setSelected={(selectedItems) => {
        //   // selectedItems — это массив выбранных объектов { key, value }
        //   // Преобразуем массив selectedItems в массив id (e.id)
        //   // const selectedIds = selectedItems.map((item) => ({
        //   //   worker_id: item.key,
        //   //   worker_payment: 0,
        //   // }));
        //   // // Передаем массив id в onChange
        //   Alert.alert(typeof selectedItems);
        //   return onChange(selectedItems);
        //   // Alert.alert(selectedItems);
        // }}
        setSelected={(a) => setWorker(a)}
        onSelect={() => {
          onChange(worker);
        }}
        data={formattedData}
        placeholder={name + placeholder}
        arrowicon={<></>}
        searchicon={<></>}
        search={false}
        boxStyles={styles.boxStyles}
        inputStyles={{
          ...styles.inputStyles,
          //color: value ? styles.selectedText.color : styles.placeholderText.color,
        }}
        dropdownStyles={styles.dropdownStyles}
        dropdownItemStyles={styles.dropdownItemStyles}
        dropdownTextStyles={styles.dropdownTextStyles}
        badgeStyles={styles.badge_box}
        checkBoxStyles={{ display: "none" }}
        label="AAA"
        labelStyles={{ display: "none" }}
      />
      {/* <Text>{worker.join(" ")}</Text> */}
    </View>
  );
};

export default MultipleSelectInput;

const styles = StyleSheet.create({
  boxStyles: {
    width: "100%",
    minHeight: 51,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#252525",
    backgroundColor: "#252525",
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
    margin: 0,
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
    borderWidth: 1,

    // borderColor: "#A6A6A6",
  },
  dropdownItemStyles: {
    width: "100%",
    height: 51,
  },
  dropdownTextStyles: {
    width: "100%",
    fontSize: 20,
    color: "#fff",
    fontWeight: 300,
  },
  badge_box: {},
});
