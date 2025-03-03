import axios from "axios";
import { Alert } from "react-native";

export async function addOrder(order) {
  try {
    const response = await axios.post(
      "http://100.78.76.123:10000/orders",
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

interface IUser {
  user_role: "worker" | "driver";
  id: string;
  username: string;
  telegram_id: string;
}

export async function getWorkersDrivers() {
  try {
    const response = await axios.get<IUser[]>(
      "http://100.78.76.123:10000//users/workers&drivers",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const data = response.data;
    const workers = data
      .filter((e) => e.user_role === "worker")
      .map((e) => ({
        id: e.id,
        username: e.username,
      }));
    const drivers = data
      .filter((e) => e.user_role === "driver")
      .map((e) => ({
        id: e.id,
        username: e.username,
      }));
    return { workers, drivers };
  } catch (err) {
    Alert.alert("Ошибка", "Не удалось загрузить данные!");
  }
}
