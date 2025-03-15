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
  worker_payment: string;
  workername: string;
}

export interface WorkerSendFetch {
  workername: string;
  worker_id: number;
}

export interface WorkerResponse extends Worker {
  worker_id: number;
}

export interface WorkerFetch {
  worker_payment: number;
  worker_id: string;
}

export interface WorkersDriversResponse {
  drivers: IDriver[];
  workers: IWorker[];
}

export interface IUser {
  id: string;
  username: string;
  user_role: "worker" | "driver";
}

export interface IWorker extends IUser {
  user_role: "worker";
}

export interface IDriver extends IUser {
  user_role: "driver";
  car_color: string;
}

export type UsersResponse = (IWorker | IDriver)[];

export interface UserFetch {
  username: string;
  user_role: "worker" | "driver" | "admin";
}
