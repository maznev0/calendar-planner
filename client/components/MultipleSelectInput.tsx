import { StyleSheet, View } from "react-native";
import React, { FunctionComponent, useState } from "react";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { IDriver, IWorker } from "../types/users";

interface Props {
  placeholder: string;

  data: (IWorker | IDriver)[];
  onChange: (value: any) => void;
}

const MultipleSelectInput: FunctionComponent<Props> = ({
  placeholder,
  data,
  onChange,
}) => {
  const formattedData = data.map((e) => ({
    key: e.id,
    value: `👷‍♂️ ${e.username}`,
  }));

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <View>
      <MultipleSelectList
        save="key"
        setSelected={setSelectedKeys}
        onSelect={() => {
          onChange(selectedKeys);
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
        labelStyles={{ display: "none", fontSize: 0, color: "#FFF" }}
        label=" "
      />
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
    minHeight: 51,
  },
  dropdownTextStyles: {
    width: "100%",
    fontSize: 20,
    color: "#fff",
    fontWeight: 300,
  },
  badge_box: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#3C3C3C",
  },
  badgeTextStyles: {
    fontSize: 20,
  },
});
