import axios from "axios";
import { Alert } from "react-native";
import {
  UserFetch,
  UsersResponse,
  WorkersDriversResponse,
} from "../types/users";
import {
  IOrder,
  IOrderFetch,
  IOrderSend,
  IOrderUpdate,
  OrderCardParams,
  OrderCardResponse,
  OrderParams,
  OrderQuantityParams,
  OrderQuantityResponse,
  OrderResponse,
  Payments,
} from "../types/order";
import { DayDateParams } from "../types/date";

const BASE_URL = "172.20.10.7";

export const getAllUsers = async (): Promise<UsersResponse> => {
  try {
    const response = await axios.get<UsersResponse>(
      `http://${BASE_URL}:10000/users/all`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    // Alert.alert("Успех", "Заказы на неделю пришли!");

    return response.data;
  } catch (err: any) {
    Alert.alert("Ошибка", err.message);
    return [] as UsersResponse;
  }
};

interface ICar {
  carname: string;
  driver_id: string;
  color: string;
  //telegram_id: number;
  chat_id: number;
}

export const addCar = async (car: ICar) => {
  try {
    await axios.post(`http://${BASE_URL}:10000/car`, car, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    Alert.alert("Успех", "Машина успешно добавлена!");
  } catch (err: any) {
    Alert.alert("Ошибка", err.message);
  }
};

export const sendOrderToDriver = async (order: IOrderSend) => {
  try {
    await axios.post(`http://${BASE_URL}:10000/orders/send`, order, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    Alert.alert("Заказ успешно отправлен");
  } catch (err: any) {
    Alert.alert("Ошибка", err.message);
  }
};

export const createUser = async (user: UserFetch) => {
  try {
    await axios.post(`http://${BASE_URL}:10000/users`, user, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  } catch (err: any) {
    Alert.alert("Ошибка", err.message);
  }
};

export const updateOrder = async (order: IOrderUpdate) => {
  try {
    await axios.post(`http://${BASE_URL}:10000/orders/update`, order, {
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

interface DW {
  order_id: string;
  driver_id: string;
  worker_ids: string[] | null;
}

export const updateDriversWorkers = async (driversWorkers: DW) => {
  try {
    await axios.post(
      `http://${BASE_URL}:10000/orders/update/workers&drivers`,
      driversWorkers,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    //Alert.alert("Успех", "Заказ успешно отправлен!");
  } catch (err: any) {
    Alert.alert("Ошибка", err.message);
  }
};

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

export const deleteOrder = async (orderId: string) => {
  try {
    await axios.delete(`http://${BASE_URL}:10000/orders/delete/${orderId}`, {
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

export const deleteUser = async (userId: string) => {
  try {
    await axios.delete(`http://${BASE_URL}:10000/users/delete/${userId}`, {
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

    // Alert.alert("Успех", "Заказы успешно пришли!");

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
    // Alert.alert("Успех", "Заказы на неделю пришли!");

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

export const swapCars = async (id1: string, id2: string) => {
  try {
    const response = await axios.post<
      { id: string; username: string; color: string }[]
    >(
      `http://${BASE_URL}:10000/cars/swap`,
      {
        driver_id1: id1,
        driver_id2: id2,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    Alert.alert("Водители успешно поменялись!");
    return response.data;
  } catch (err) {
    Alert.alert("Ошибка", "Не удалось загрузить данные!");
    return [];
  }
};

export const getDriversWithCar = async () => {
  try {
    const response = await axios.get<
      { id: string; username: string; color: string }[]
    >(`http://${BASE_URL}:10000/users/drivers-with-car`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (err) {
    Alert.alert("Ошибка", "Не удалось загрузить данные!");
    return [];
  }
};

export const getDriversWithoutCar = async () => {
  try {
    const response = await axios.get<{ id: string; username: string }[]>(
      `http://${BASE_URL}:10000/users/drivers-without-car`,
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
    return [];
  }
};

export const getOrderByID = async (params?: OrderParams) => {
  const { id } = params || {};
  try {
    const response = await axios.get<OrderResponse>(
      `http://${BASE_URL}:10000/orders/day/${id}`,
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
