import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import Header from "../../../../../../components/Header";
import Input from "../../../../../../components/Input";
import SelectInput from "../../../../../../components/SelectInput";
import InputArea from "../../../../../../components/InputArea";
import Button from "../../../../../../components/Button";
import axios from "axios";

const Add = () => {
  const [order, setOrder] = useState({
    order_address: "",
    phone_number: "+375",
    meters: "",
    price: "",
    // worker: "",
    driver_id: "a7d1027a-cb57-4e79-b80f-12f90e78a96d",
    note: "",
    order_state: "",
  });

  const handleChangeText = (field: string, value: string) => {
    setOrder({ ...order, [field]: value });
  };

  // const handleSubmit = () => {
  //   axios.post('')
  // };
  const handleSubmit = async () => {
    // if (!o || !body || !userId) {
    //   Alert.alert("Ошибка", "Пожалуйста, заполните все поля");
    //   return;
    // }

    // setLoading(true);
    // setError(null);

    try {
      const response = await axios.post(
        "http://100.78.78.230:10000/orders",
        {
          order: {
            ...order,
            price: Number(order.price),
            meters: parseFloat(order.meters),
            order_date: new Date().toISOString().split("T")[0],
          },
          workers: [
            {
              worker_id: "58749034-f09e-48d2-b82e-424d1d31af0b",
              worker_payment: 0,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Ответ сервера:", response.data);

      Alert.alert("Успех", "Данные успешно отправлены!");
    } catch (err: any) {
      Alert.alert("Ошибка", err.message);
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}
    >
      <View style={styles.container}>
        <Header>Понедельник 27 января</Header>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.list}>
            <Input
              placeholder="Площадь"
              name="М²"
              type="numbers-and-punctuation"
              value={order.meters}
              onChangeText={(e) => handleChangeText("meters", e)}
            />
            <Input
              placeholder="Цена за квадрат"
              name="BYN"
              type="numeric"
              value={order.price}
              onChangeText={(e) => handleChangeText("price", e)}
            />
            <Input
              placeholder="Адрес"
              name="📍"
              value={order.order_address}
              onChangeText={(e) => handleChangeText("order_address", e)}
            />
            <Input
              placeholder="+375"
              name=""
              type="phone-pad"
              value={order.phone_number}
              onChangeText={(e) => handleChangeText("phone_number", e)}
            />
            {/* <SelectInput
              name="👷‍♂️"
              placeholder="Рабочий"
              value={order.worker}
              onChange={(value) => handleChangeText("worker", value)}
            /> */}
            {/* <SelectInput
              name=""
              placeholder="Водитель"
              value={order.driver}
              onChange={(value) => handleChangeText("driver", value)}
            /> */}
            <InputArea
              name="📌"
              placeholder="Примечания"
              value={order.note}
              onChangeText={(e) => handleChangeText("note", e)}
            />
            <View
              style={{
                minHeight: 300,
                flexGrow: 1,
                width: "100%",
                // borderWidth: 1,
                // borderColor: "#fff",
              }}
            />
          </View>
        </ScrollView>
        <Button onPress={handleSubmit}>Добавить</Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  key: {
    flex: 1,
  },
  scroll: {
    // borderWidth: 2,
    // borderColor: "#1c1c1c1",
  },
  list: {
    marginVertical: 10,
    flexDirection: "column",
    gap: 14,
  },
});
