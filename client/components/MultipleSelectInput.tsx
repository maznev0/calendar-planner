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
import { IDriver, IWorker } from "../types/users";

interface Props {
  placeholder: string;
  // name: string;
  // value: string;
  data: (IWorker | IDriver)[];
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
  // name,
  placeholder,
  data,
  onChange,
}) => {
  const formattedData = data.map((e) => {
    if (e.user_role === "driver") {
      return {
        key: e.id,
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
              <Text style={styles.driver_text}>{e.username}</Text>
            </View>
            <Text style={styles.orders}>{e.order_quantity}</Text>
          </View>
        ),
      };
    } else {
      return {
        key: e.id,
        value: `👷‍♂️ ${e.username}`,
      };
    }
  });

  const [worker, setWorker] = useState([]);

  return (
    <View>
      <MultipleSelectList
        save="key"
        setSelected={setWorker}
        onSelect={() => {
          // console.log(worker);
          onChange(worker);
        }}
        data={formattedData}
        placeholder={placeholder}
        arrowicon={<></>}
        searchicon={<></>}
        search={false}
        boxStyles={styles.boxStyles}
        inputStyles={styles.inputStyles}
        dropdownStyles={styles.dropdownStyles}
        dropdownItemStyles={styles.dropdownItemStyles}
        dropdownTextStyles={styles.dropdownTextStyles}
        badgeStyles={styles.badge_box}
        badgeTextStyles={styles.badgeTextStyles}
        checkBoxStyles={{ display: "none" }}
        label=""
        labelStyles={{ display: "none" }}
      />
    </View>
  );
};

export default MultipleSelectInput;

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
    gap: 10,
  },
  orders: {
    fontWeight: 300,
    fontSize: 23,
    color: "#FFF",
    textAlign: "center",
  },
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
    color: "#A6A6A6",
  },
  dropdownStyles: {
    width: "100%",
    height: 200,
    backgroundColor: "#252525",
    borderRadius: 20,
    borderWidth: 1,
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
  badge_box: {
    width: 150,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeTextStyles: {
    fontSize: 13,
  },
});
