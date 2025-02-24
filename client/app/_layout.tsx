import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, View } from "react-native";

export default function Layout() {
  return (
    <View style={styles.wrapper}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
  },
});
