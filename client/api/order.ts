import axios from "axios";
import { Alert } from "react-native";
import { WorkersDriversResponse } from "../types/users";
import {
  IOrder,
  IOrderFetch,
  OrderCardParams,
  OrderCardResponse,
  OrderParams,
  OrderQuantityParams,
  OrderQuantityResponse,
  OrderResponse,
  Payments,
} from "../types/order";
import { DayDateParams } from "../types/date";

const BASE_URL = "192.168.0.108";
// ! телефон по размеру имени рабочего, адрес шрифт на 1-2 пиккселя больше
export const addOrder = async (order: IOrderFetch) => {
  try {
    await axios.post(`http://${BASE_URL}:10000/orders`, order, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    //Alert.alert("Успех", "Заказ успешно отправлен!");
  } catch (err: any) {
    Alert.alert("Ошибка", err.message);
  }
};

export const getOrdersByDay = async (
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

export const getWorkersDrivers = async (params?: DayDateParams) => {
  const { day } = params || {};
  try {
    const response = await axios.get<WorkersDriversResponse>(
      `http://${BASE_URL}:10000/users/workers&drivers?date=${day}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const { workers, drivers } = response.data;

    return { workers, drivers };
  } catch (err) {
    Alert.alert("Ошибка", "Не удалось загрузить данные!");
    return { workers: [], drivers: [] };
  }
};

export const getOrderByID = async (params?: OrderParams) => {
  const { id } = params || {};
  try {
    const response = await axios.get<OrderResponse>(
      `http://${BASE_URL}:10000/orders/day${id}`,
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
    return {
      order: {} as IOrder,
      workers: [] as Worker[],
      payments: {} as Payments,
    } as unknown as OrderResponse;
  }
};
