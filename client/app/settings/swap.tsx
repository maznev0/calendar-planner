import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import Button from "../../components/Button";
import { getDriversWithCar, swapCars } from "../../api/order";
import Text from "../../components/Text";
import useFetch from "../../hooks/useFetch";
import { router } from "expo-router";

export default function Swap() {
  const { data } = useFetch(getDriversWithCar);

  const [driver1, setDriver1] = useState<string>("");
  const [driver2, setDriver2] = useState<string>("");

  const drivers = data?.map((e) => ({
    key: e.id,
    value: (
      <View style={styles.driver_item}>
        <View style={styles.driver_name}>
          <View
            style={[
              styles.car_color,
              {
                backgroundColor: e.color,
              },
            ]}
          />
          <Text style={styles.driver_text}>{e.username}</Text>
        </View>
      </View>
    ),
  }));

  const handleSwap = async () => {
    if (!driver1.length || !driver2.length) {
      Alert.alert("Не заполнены необходимые поля");
      return;
    }
    await swapCars(driver1, driver2);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.list}>
          <SelectList
            setSelected={setDriver1}
            save="key"
            data={drivers || []}
            placeholder={"Выберите, кого пересадить"}
            arrowicon={<></>}
            searchicon={<></>}
            search={false}
            boxStyles={styles.boxStyles}
            inputStyles={{
              ...styles.inputStyles,
              color: driver1
                ? styles.selectedText.color
                : styles.placeholderText.color,
            }}
            dropdownStyles={styles.dropdownStyles}
            dropdownItemStyles={styles.dropdownItemStyles}
            dropdownTextStyles={styles.dropdownTextStyles}
          />
          <SelectList
            setSelected={setDriver2}
            save="key"
            data={drivers || []}
            placeholder={"Выберите, с кем поменять"}
            arrowicon={<></>}
            searchicon={<></>}
            search={false}
            boxStyles={styles.boxStyles}
            inputStyles={{
              ...styles.inputStyles,
              color: driver2
                ? styles.selectedText.color
                : styles.placeholderText.color,
            }}
            dropdownStyles={styles.dropdownStyles}
            dropdownItemStyles={styles.dropdownItemStyles}
            dropdownTextStyles={styles.dropdownTextStyles}
          />
        </View>
      </ScrollView>
      <Button onPress={handleSwap}>Пересадить</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  list: {
    flexDirection: "column",
    gap: 15,
    paddingVertical: 15,
  },

  driver_item: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
