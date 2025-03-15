import { useRouter } from "expo-router";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import Input from "../../components/Input";
import { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import Button from "../../components/Button";
import { addCar, getDriversWithoutCar } from "../../api/order";
import useFetch from "../../hooks/useFetch";

const COLORS = [
  "#006DEA",
  "#EA0004",
  "#EA8D00",
  "#00C7EA",
  "#7D00EA",
  "#37EA00",
  "#e6ea00",
  "#fbfbfb",
];

export default function AddCarPage() {
  const { data } = useFetch(getDriversWithoutCar);

  const router = useRouter();

  const [car, setCar] = useState({
    carname: "",
    driver_id: "",
    chat_id: "",
    color: "",
  });

  const colors = COLORS.map((color) => ({
    key: color,
    value: (
      <View
        style={{
          ...styles.car_color,
          backgroundColor: color,
        }}
      />
    ),
  }));

  const drivers =
    data?.map((driver) => ({
      key: driver.id,
      value: driver.username,
    })) || [];

  const handleAddCar = async () => {
    const carFetch = {
      ...car,
      chat_id: parseInt(car.chat_id),
      telegram_id: parseInt(car.chat_id),
    };
    await addCar(carFetch);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.list}>
          <Input
            name=""
            placeholder="Введите название"
            value={car.carname}
            onChangeText={(e) => setCar({ ...car, carname: e })}
          />
          <SelectList
            setSelected={(e: string) => setCar({ ...car, color: e })}
            save="key"
            data={colors}
            placeholder="Выберети роль"
            arrowicon={<></>}
            searchicon={<></>}
            search={false}
            boxStyles={styles.boxStyles}
            inputStyles={{
              ...styles.inputStyles,
              color: styles.placeholderText.color,
            }}
            dropdownStyles={styles.dropdownStyles}
            dropdownItemStyles={styles.dropdownItemStyles}
            dropdownTextStyles={styles.dropdownTextStyles}
          />
          <Input
            name=""
            placeholder="Введите telegram id"
            value={car.chat_id}
            onChangeText={(e) => setCar({ ...car, chat_id: e })}
            maxLength={10}
            type="numeric"
          />
          <SelectList
            setSelected={(e: string) => setCar({ ...car, color: e })}
            save="key"
            data={drivers}
            placeholder="Выберети водителя"
            arrowicon={<></>}
            searchicon={<></>}
            search={false}
            boxStyles={styles.boxStyles}
            inputStyles={{
              ...styles.inputStyles,
              color: car.driver_id.length
                ? styles.selectedText.color
                : styles.placeholderText.color,
            }}
            dropdownStyles={styles.dropdownStyles}
            dropdownItemStyles={styles.dropdownItemStyles}
            dropdownTextStyles={styles.dropdownTextStyles}
            notFoundText="Нет водителей без машин"
          />
        </View>
      </ScrollView>
      <Button onPress={handleAddCar}>Добавить</Button>
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

  car_color: {
    width: 19,
    height: 19,
    borderRadius: "50%",
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

    flexDirection: "row",
    alignItems: "center",

    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#252525",

    backgroundColor: "#252525",

    zIndex: 10,
    padding: 0,
    margin: 0,
    paddingLeft: 22,
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
