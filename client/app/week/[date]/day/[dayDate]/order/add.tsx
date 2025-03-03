import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../../../../../components/Header";
import Input from "../../../../../../components/Input";
import SelectInput from "../../../../../../components/SelectInput";
import InputArea from "../../../../../../components/InputArea";
import Button from "../../../../../../components/Button";
import axios from "axios";
import MultipleSelectInput from "../../../../../../components/MultipleSelectInput";
import { addOrder, getWorkersDrivers } from "../../../../../../api/order";
import useFetch from "../../../../../../hooks/useFetch";

interface IUser {
  id: string;
  username: string;
}

interface IWorkersIDrivers {
  workers: IUser[];
  drivers: IUser[];
}

interface Worker {
  worker_id: string;
  worker_payment: number;
}

interface Order {
  order_address: string;
  phone_number: string;
  meters: string;
  price: string;
  workers: Worker[]; // Указываем, что это массив объектов Worker
  driver_id: string;
  note: string;
  order_state: string;
}

const Add = () => {
  const { data, isLoading } = useFetch<IWorkersIDrivers>(getWorkersDrivers);

  // data = {
  //   ...data,
  //   order_address: data.order_address || "",
  //   phone_number: data.phone_number || "+375",
  //   meters: data.meters || "",
  //   price: data.price || "",
  //   worker: data.worker || "",
  //   note: data.note || "",
  //   order_state: data.order_state || "",
  // };

  const [order, setOrder] = useState<Order>({
    order_address: "",
    phone_number: "+375",
    meters: "",
    price: "",
    workers: [],
    driver_id: "",
    note: "",
    order_state: "",
  });

  const handleChangeText = (field: string, value: string) => {
    setOrder({ ...order, [field]: value });
  };

  const handleAddWorker = (id: string) => {
    setOrder((prev) => ({
      ...prev,
      workers: [...prev.workers, { worker_id: id, worker_payment: 0 }],
    }));
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://100.78.78.230:10000//users/workers&drivers"
  //       );
  //       const data = response.data;

  //       setOrder({
  //         ...order,
  //         order_address: data.order_address || "",
  //         phone_number: data.phone_number || "+375",
  //         meters: data.meters || "",
  //         price: data.price || "",
  //         worker: data.worker || "",
  //         note: data.note || "",
  //         order_state: data.order_state || "",
  //       });
  //     } catch (err) {
  //       Alert.alert("Ошибка", "Не удалось загрузить данные!");
  //     }
  //   };

  //   fetchData();
  // }, []);

  const handleSubmit = async () => {
    const fetchOrder = {
      order: {
        price: Number(order.price),
        meters: parseFloat(order.meters),
        order_date: new Date().toISOString().split("T")[0],
        order_address: order.order_address,
        phone_number: order.phone_number,
        driver_id: order.driver_id,
        note: order.note,
      },
      workers: order.workers,
    };
    Alert.alert(order.driver_id);
    // Alert.alert(order.)

    addOrder(fetchOrder);
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}
    >
      <View style={styles.container}>
        <Header>Понедельник 27 января</Header>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.list}>
            <Input
              placeholder="Площадь"
              name="М²"
              type="numbers-and-punctuation"
              value={order.meters}
              onChangeText={(e) => handleChangeText("meters", e)}
            />
            <Input
              placeholder="Цена за квадрат"
              name="BYN"
              type="numeric"
              value={order.price}
              onChangeText={(e) => handleChangeText("price", e)}
            />
            <Input
              placeholder="Адрес"
              name="📍"
              value={order.order_address}
              onChangeText={(e) => handleChangeText("order_address", e)}
            />
            <Input
              placeholder="+375"
              name=""
              type="phone-pad"
              value={order.phone_number}
              onChangeText={(e) => handleChangeText("phone_number", e)}
            />
            <SelectInput
              name=""
              placeholder="Водитель"
              data={data?.drivers || []}
              value={order.worker}
              onChange={(value) => handleChangeText("driver_id", value)}
            />
            <MultipleSelectInput
              name="👷‍♂️"
              placeholder="Рабочий"
              data={data?.workers || []}
              value={order.driver_id}
              onChange={(value) => handleAddWorker(value)}
            />
            <InputArea
              name="📌"
              placeholder="Примечания"
              value={order.note}
              onChangeText={(e) => handleChangeText("note", e)}
            />
            <View
              style={{
                minHeight: 300,
                flexGrow: 1,
                width: "100%",
                // borderWidth: 1,
                // borderColor: "#fff",
              }}
            />
          </View>
        </ScrollView>
        <Button onPress={handleSubmit}>Добавить</Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C3C3C",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  key: {
    flex: 1,
  },
  scroll: {
    // borderWidth: 2,
    // borderColor: "#1c1c1c1",
  },
  list: {
    marginVertical: 10,
    flexDirection: "column",
    gap: 14,
  },
});
