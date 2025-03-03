import axios from "axios";
import { Alert } from "react-native";

export async function addOrder(order) {
  try {
    const response = await axios.post(
      "http://100.78.78.230:10000/orders",
      order,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Ответ сервера:", response.data);

    Alert.alert("Успех", "Заказ успешно отправлен!");
  } catch (err: any) {
    Alert.alert("Ошибка", err.message);
  }
}

export async function getDrivers() {
  try {
    const response = await axios.get(
      "http://100.78.78.230:10000/orders/some/path",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    Alert.alert("Ошибка", "Не удалось загрузить данные!");
  }
}
