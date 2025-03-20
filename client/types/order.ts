import { STATE_COLOR } from "../constants/order";
import { Worker, WorkerFetch, WorkerResponse, WorkerSendFetch } from "./users";

export interface IOrderFetch {
  order: {
    price: number;
    meters: number;
    order_date: string;
    order_address: string;
    phone_number: string;
    driver_id: string;
    note: string;
    order_state: string;
  };
  workers: WorkerFetch[];
}

export interface IOrderState {
  order_address: string;
  phone_number: string;
  meters: string;
  price: string;
  workers: string[];
  driver_id: string;
  note: string;
}

export interface OrderQuantityParams {
  start: string;
  end: string;
}

export type OrderQuantityResponse = {
  date: string;
  orders_quantity: number;
}[];

export type OrderCardResponse = {
  id: string;
  order_date: string;
  order_address: string;
  phone_number: string;
  meters: number;
  price: number;
  order_state: OrderState;
  driver_name: string;
  car_color: string;
  worker_names: string[];
}[];

export type OrderCardParams = {
  date: string;
};

export type OrderState = keyof typeof STATE_COLOR;

export interface OrderParams {
  id: string;
}

export interface OrderResponse {
  order: IOrder;
  workers: WorkerResponse[];
  payments: Payments;
}

export interface IOrderSend {
  order: IOrder;
  workers: WorkerSendFetch[] | null;
}

export interface IOrderUpdate {
  id: string;
  price: number;
  meters: number;
  order_date: string;
  order_address: string;
  phone_number: string;
  note: string;
  order_state: string;
}

export interface IOrder {
  id: string;
  price: number;
  meters: number;
  order_date: string;
  order_address: string;
  phone_number: string;
  driver_id?: string;
  drivername?: string;
  car_color?: string;
  note: string;
  order_state?: OrderState;
  chat_id: number;
}

export interface Payments {
  total_price: number;
  driver_price: number;
  other_price: number;
}
