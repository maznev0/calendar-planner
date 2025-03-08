export interface IDriver {
  id: string;
  username: string;
  user_role: "driver";
  car_color: string;
  order_quantity: number;
}
export interface IWorker {
  id: string;
  username: string;
  user_role: "worker";
}

export interface Worker {
  worker_id: string;
  worker_payment: number;
}

export interface WorkersDriversResponse {
  drivers: IDriver[];
  workers: IWorker[];
}
