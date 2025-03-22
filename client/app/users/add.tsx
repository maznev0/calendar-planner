import { useRouter } from "expo-router";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import Input from "../../components/Input";
import { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import Button from "../../components/Button";
import { createUser } from "../../api/order";
import { UserFetch } from "../../types/users";

const ROLES = [
  {
    key: "driver",
    value: "Водитель",
  },
  {
    key: "worker",
    value: "Рабочий",
  },
];

export default function Users() {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    user_role: "",
  });

  const handleCreateUser = () => {
    if (!user.username.length || !user.user_role.length) {
      Alert.alert("Не заполнены необходимые поля!");
      return;
    }

    createUser(user as UserFetch);

    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.list}>
          <Input
            name=""
            placeholder="Введите имя"
            value={user.username}
            onChangeText={(e) => setUser({ ...user, username: e })}
          />
          <SelectList
            setSelected={(e: string) => setUser({ ...user, user_role: e })}
            save="key"
            data={ROLES}
            placeholder="Выберети роль"
            arrowicon={<></>}
            searchicon={<></>}
            search={false}
            boxStyles={styles.boxStyles}
            inputStyles={{
              ...styles.inputStyles,
              color: user.user_role.length
                ? styles.selectedText.color
                : styles.placeholderText.color,
            }}
            dropdownStyles={styles.dropdownStyles}
            dropdownItemStyles={styles.dropdownItemStyles}
            dropdownTextStyles={styles.dropdownTextStyles}
          />
        </View>
      </ScrollView>
      <Button onPress={handleCreateUser}>Добавить</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  list: {
    flexDirection: "column",
    gap: 15,
    paddingVertical: 15,
  },
  input_name: {
    width: "100%",
    color: "#FFF",
    fontSize: 20,
    fontWeight: 200,
  },

  boxStyles: {
    width: "100%",
    height: 51,

    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#252525",

    backgroundColor: "#252525",

    zIndex: 10,
    padding: 0,
    margin: 0,
    paddingLeft: 25,
  },
  inputStyles: {
    fontSize: 20,
    fontWeight: 300,
    textAlign: "left",
  },
  selectedText: {
    color: "#FFF",
  },
  placeholderText: {
    color: "#A6A6A6",
  },
  dropdownStyles: {
    width: "100%",
    height: 120,
    backgroundColor: "#252525",
    borderRadius: 20,
    zIndex: 50,

    marginTop: 10,
    padding: 0,

    borderWidth: 1,
    borderColor: "#A6A6A6",
  },
  dropdownItemStyles: {
    width: "100%",
    height: 47,
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownTextStyles: {
    width: "100%",
    fontSize: 20,
    color: "#fff",
    fontWeight: 300,
    textAlign: "left",
  },
});
