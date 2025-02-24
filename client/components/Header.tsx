import { FunctionComponent } from "react";
import { StyleSheet, View, Text } from "react-native";

interface Props {
  children: string;
}

const Header: FunctionComponent<Props> = ({ children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",

    borderBottomWidth: 1,
    borderColor: "#fff",
    opacity: 0.5,

    paddingBottom: 9,
  },
  text: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
  },
});

export default Header;
