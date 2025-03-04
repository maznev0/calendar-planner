export interface IOrderFetch {
  order: {
    price: number;
    meters: number;
    order_date: string;
    order_address: string;
    phone_number: string;
    driver_id: string;
    note: string;
  };
  workers: {
    worker_id: string;
    worker_payment: number;
  };
}

interface Worker {
  worker_id: string;
  worker_payment: number;
}

export interface Order {
  order_address: string;
  phone_number: string;
  meters: number;
  price: number;
  workers: Worker[];
  driver_id: string;
  note: string;
  order_state: string;
}
