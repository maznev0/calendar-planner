import { FunctionComponent } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Text from "./Text";

interface Props {
  children: string;
  onPress?: () => void;
}

const Header: FunctionComponent<Props> = ({ children, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={1}>
        <Text style={styles.text}>{children}</Text>
      </TouchableOpacity>
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
