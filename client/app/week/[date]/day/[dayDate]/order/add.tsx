import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import Header from "../../../../../../components/Header";
import Input from "../../../../../../components/Input";
import SelectInput from "../../../../../../components/SelectInput";
import InputArea from "../../../../../../components/InputArea";
import Button from "../../../../../../components/Button";
import MultipleSelectInput from "../../../../../../components/MultipleSelectInput";
import { addOrder, getWorkersDrivers } from "../../../../../../api/order";
import useFetch from "../../../../../../hooks/useFetch";
import { WorkersDriversResponse } from "../../../../../../types/users";
import { IOrderFetch, IOrderState } from "../../../../../../types/order";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DayDateParams } from "../../../../../../types/date";
import {
  formatDayMonthUIDate,
  getDayOfWeek,
} from "../../../../../../utils/date";

type DATE = string;

const Add = () => {
  const { date, dayDate } = useLocalSearchParams<{
    date: string;
    dayDate: string;
  }>();
  const { data } = useFetch<WorkersDriversResponse, DayDateParams>(
    getWorkersDrivers,
    {
      day: dayDate,
    }
  );
  const router = useRouter();

  const [order, setOrder] = useState<IOrderState>({
    order_address: "",
    phone_number: "+375",
    meters: "",
    price: "",
    workers: [],
    driver_id: "",
    note: "",
  });

  const handleChangeText = (field: string, value: string) => {
    setOrder({ ...order, [field]: value });
  };

  const handleSetMeters = (meters: string) => {
    let newValue = meters.replace(/,/g, ".");

    const dotCount = (newValue.match(/\./g) || []).length;
    if (dotCount > 1) return;
    if (dotCount === 1 && newValue.split(".")[1].length > 2) return;

    handleChangeText("meters", newValue);
  };

  const handleAddWorker = (value: string[]) => {
    setOrder({ ...order, workers: value });
  };

  const handleSubmit = async () => {
    if (
      !order.order_address.trim().length ||
      !order.meters.length ||
      !order.price.length
    ) {
      Alert.alert("Не заполнены необходимые поля");
      return;
    }

    if (order.phone_number.length > 13 || order.phone_number.length <= 4) {
      Alert.alert("Неправильно набран номер!");
      return;
    }
    const orderState = !order.driver_id.length
      ? "Ожидает назначения"
      : "Ожидает отправления";

    const fetchOrder: IOrderFetch = {
      order: {
        price: Number(order.price),
        meters: parseFloat(order.meters),
        order_date: dayDate,
        order_address: order.order_address,
        phone_number: order.phone_number,
        driver_id: order.driver_id,
        note: order.note,
        order_state: orderState,
      },
      workers: [
        ...order.workers.map((id) => ({
          worker_id: id,
          worker_payment: 0,
        })),
      ],
    };
    // router.push(`/week/${date}/day/${dayDate}`);
    await addOrder(fetchOrder);
    router.dismissAll();
    router.push(`/week/${date}`);
    router.push(`/week/${date}/day/${dayDate}`);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}
    >
      <View style={styles.container}>
        <Header>
          {getDayOfWeek(dayDate) + " " + formatDayMonthUIDate(dayDate)}
        </Header>
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
              type="decimal-pad"
              value={order.meters}
              onChangeText={handleSetMeters}
            />
            <Input
              placeholder="Цена за квадрат"
              name="BYN"
              type="number-pad"
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
              name="📞"
              type="phone-pad"
              value={order.phone_number}
              onChangeText={(e) => handleChangeText("phone_number", e)}
            />
            <SelectInput
              name=""
              placeholder="Водитель"
              data={data?.drivers || []}
              value={order.driver_id}
              onChange={(value) => {
                handleChangeText("driver_id", value);
              }}
            />
            <MultipleSelectInput
              placeholder="Рабочий"
              data={[...(data?.workers ?? [])]}
              onChange={handleAddWorker}
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
