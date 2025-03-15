import { Redirect } from "expo-router";
import { formatDate } from "../utils/date";
import AddCarPage from "./settings/addCar";

export default function Index() {
  // return <Redirect href={`/week/${formatDate(new Date())}`} />;
  return <AddCarPage />;
}
