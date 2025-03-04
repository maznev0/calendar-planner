import axios from "axios";
import { Alert } from "react-native";
import { IUser, IUserResponse } from "../types/users";
import { IOrderFetch } from "../types/order";

export const addOrder = async (order: IOrderFetch) => {
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

    Alert.alert("Успех", "Заказ успешно отправлен!");
  } catch (err: any) {
    Alert.alert("Ошибка", err.message);
  }
};

export const getWorkersDrivers = async () => {
  try {
    const response = await axios.get<IUserResponse[]>(
      "http://100.78.76.123:10000//users/workers&drivers",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const data = response.data;
    const workers: IUser[] = data
      .filter((e) => e.user_role === "worker")
      .map((e) => ({
        id: e.id,
        username: e.username,
      }));
    const drivers: IUser[] = data
      .filter((e) => e.user_role === "driver")
      .map((e) => ({
        id: e.id,
        username: e.username,
      }));
    return { workers, drivers };
  } catch (err) {
    Alert.alert("Ошибка", "Не удалось загрузить данные!");
    return { workers: [], drivers: [] };
  }
};
