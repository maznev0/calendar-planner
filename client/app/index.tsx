import { Redirect } from "expo-router";
import { formatDate } from "../utils/date";

export default function Index() {
  return <Redirect href={`/week/${formatDate(new Date())}`} />;
}
