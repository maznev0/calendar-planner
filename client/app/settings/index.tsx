import { Text, View, StyleSheet, ScrollView } from "react-native";
import { getWeek } from "../../utils/date";

export default function Settings() {
  return (
    <View style={styles.container}>
      <View style={styles.date}>
        <Text style={styles.date_text}>Настройки</Text>
      </View>
      <Text>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 28,
  },
  date: {
    borderBottomWidth: 1,
    borderColor: "#fff",
    opacity: 0.5,
    paddingBottom: 9,
    marginBottom: 15,
  },
  date_text: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
  },
  list: {
    height: "100%",
  },
});
