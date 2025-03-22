import { ActivityIndicator, View } from "react-native";

export default function Loader() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#3C3C3C",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color="#E4D478" />
    </View>
  );
}
