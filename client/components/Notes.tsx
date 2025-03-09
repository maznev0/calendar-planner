import { StyleSheet, Text, View } from "react-native";
import React from "react";

interface Props {
  note: string;
}

const Notes = ({ note }: Props) => {
  return (
    <View style={styles.extra}>
      <Text style={styles.extra_title}>📌 Примечание:</Text>
      <Text style={styles.extra_text}>{note}</Text>
    </View>
  );
};

export default Notes;

const styles = StyleSheet.create({
  extra: {
    width: "100%",
    backgroundColor: "#252525",
    opacity: 0.7,
    borderRadius: 20,

    paddingHorizontal: 20,
    paddingVertical: 8,

    marginBottom: 12,
  },
  extra_title: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: 200,
    marginBottom: 10,
  },
  extra_text: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: 400,
  },
});
