import { FunctionComponent } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Text from "./Text";

interface Props {
  children: string;
  onPress: () => void;
  color?: string;
}

const Button: FunctionComponent<Props> = ({ onPress, color, children }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={[styles.text, { color: color || "#E4D478" }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,

    borderRadius: 20,

    backgroundColor: "#151515",

    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    width: "100%",
    fontSize: 24,
    textTransform: "uppercase",
    textAlign: "center",
  },
});

export default Button;
