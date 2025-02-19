import { Text, View, StyleSheet, ScrollView } from "react-native";

export default function Day() {
  return (
    <View style={styles.container}>
      <View style={styles.date}>
        <Text style={styles.date_text}>{}</Text>
      </View>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <View style={styles.statistics}>
          <Text style={styles.statistics_text}>Добавить</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 28,
    paddingBottom: 20,
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
  statistics: {
    width: "100%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
  },
  statistics_text: {
    width: "100%",
    color: "#E4D478",
    fontSize: 24,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
