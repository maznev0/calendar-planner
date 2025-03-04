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
  workers: Worker[];
}

interface Worker {
  worker_id: string;
  worker_payment: number;
}

export interface IOrderState {
  order_address: string;
  phone_number: string;
  meters: string;
  price: string;
  workers: string[];
  driver_id: string;
  note: string;
  order_state: string;
}

// export interface Order {
//   order_address: string;
//   phone_number: string;
//   meters: number;
//   price: number;
//   workers: Worker[];
//   driver_id: string;
//   note: string;
//   order_state: string;
// }

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
  order_state: string;
  driver_name: string;
  worker_names: string[];
}[];

export type OrderCardParams = {
  date: string;
};
