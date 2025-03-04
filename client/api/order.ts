import axios from "axios";
import { Alert } from "react-native";
import { IUser, IUserResponse } from "../types/users";
import {
  IOrderFetch,
  OrderCardParams,
  OrderCardResponse,
  OrderQuantityParams,
  OrderQuantityResponse,
} from "../types/order";

const BASE_URL = "100.78.74.97";

export const addOrder = async (order: IOrderFetch) => {
  try {
    const response = await axios.post(
      `http://${BASE_URL}:10000/orders`,
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

export const getOrderByDay = async (
  params?: OrderCardParams
): Promise<OrderCardResponse> => {
  const { date } = params || {};
  try {
    const response = await axios.get<OrderCardResponse>(
      `http://${BASE_URL}:10000/orders/day?date=${date}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    Alert.alert("Успех", "Заказы успешно пришли!");

    return response.data;
  } catch (err: any) {
    Alert.alert("Ошибка", err.message);
    return [] as OrderCardResponse;
  }
};

export const getOrdersQuantity = async (
  params?: OrderQuantityParams
): Promise<OrderQuantityResponse> => {
  const { start = "2025-03-01", end = "2025-03-07" } = params || {};
  try {
    const response = await axios.get<OrderQuantityResponse>(
      `http://${BASE_URL}:10000/orders/days?start=${start}&end=${end}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    Alert.alert("Успех", "Заказы на неделю пришли!");

    return response.data;
  } catch (err: any) {
    Alert.alert("Ошибка", err.message);
    return [] as OrderQuantityResponse;
  }
};

export const getWorkersDrivers = async () => {
  try {
    const response = await axios.get<IUserResponse[]>(
      `http://${BASE_URL}:10000//users/workers&drivers`,
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
