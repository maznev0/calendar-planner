import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../../../../../../components/Header";
import Input from "../../../../../../../components/Input";
import InputArea from "../../../../../../../components/InputArea";
import Button from "../../../../../../../components/Button";
import { getOrderByID, updateOrder } from "../../../../../../../api/order";
import useFetch from "../../../../../../../hooks/useFetch";
import {
  IOrderUpdate,
  OrderParams,
  OrderResponse,
} from "../../../../../../../types/order";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  formatDayMonthUIDate,
  getDayOfWeek,
} from "../../../../../../../utils/date";
import Text from "../../../../../../../components/Text";

const Edit = () => {
  const { date, dayDate, orderId } = useLocalSearchParams<{
    date: string;
    dayDate: string;
    orderId: string;
  }>();

  const { data, isLoading } = useFetch<OrderResponse, OrderParams>(
    getOrderByID,
    { id: orderId }
  );

  const router = useRouter();

  const [order, setOrder] = useState({
    order_address: "",
    phone_number: "+375",
    meters: "",
    price: "",
    note: "",
    order_state: "Ожидает отправки",
  });

  useEffect(() => {
    if (data) {
      setOrder({
        order_address: data.order.order_address || "",
        phone_number: data.order.phone_number || "+375",
        meters: String(data.order.meters) || "",
        price: String(data.order.price) || "",
        note: data.order.note || "",
        order_state: data.order.order_state || "Ожидает отправки",
      });
    }
  }, [data]);

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

    const fetchOrder: IOrderUpdate = {
      id: orderId,
      price: Number(order.price),
      meters: parseFloat(order.meters),
      order_date: dayDate,
      order_address: order.order_address,
      phone_number: order.phone_number,
      note: order.note,
      order_state: order.order_state,
    };

    await updateOrder(fetchOrder);
    router.dismissAll();
    router.push(`/week/${date}`);
    router.push(`/week/${date}/day/${dayDate}`);
    router.push(`/week/${date}/day/${dayDate}/order/${orderId}`);
  };

  if (isLoading) {
    return <Text>LOADING ...</Text>;
  }

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
              onChangeText={(e: string) => handleChangeText("price", e)}
            />
            <Input
              placeholder="Адрес"
              name="📍"
              value={order.order_address}
              onChangeText={(e: string) => handleChangeText("order_address", e)}
            />
            <Input
              placeholder="+375"
              name="📞"
              type="phone-pad"
              value={order.phone_number}
              onChangeText={(e: string) => handleChangeText("phone_number", e)}
            />
            <InputArea
              name="📌"
              placeholder="Примечания"
              value={order.note}
              onChangeText={(e: string) => handleChangeText("note", e)}
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
        <Button onPress={handleSubmit}>Изменить</Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Edit;

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
