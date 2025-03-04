export interface IUserResponse {
  user_role: "worker" | "driver";
  id: string;
  username: string;
  telegram_id: string;
}

export type IUser = Pick<IUserResponse, "id" | "username">;
