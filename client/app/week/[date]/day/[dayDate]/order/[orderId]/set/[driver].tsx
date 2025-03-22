import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../../../../../../../components/Header";
import Button from "../../../../../../../../components/Button";
import {
  getOrderByID,
  getWorkersDrivers,
  updateDriversWorkers,
  updateOrder,
} from "../../../../../../../../api/order";
import useFetch from "../../../../../../../../hooks/useFetch";

import { useLocalSearchParams, useRouter } from "expo-router";
import {
  formatDayMonthUIDate,
  getDayOfWeek,
} from "../../../../../../../../utils/date";
import Text from "../../../../../../../../components/Text";
import SelectInput from "../../../../../../../../components/SelectInput";
import MultipleSelectInput from "../../../../../../../../components/MultipleSelectInput";
import { WorkersDriversResponse } from "../../../../../../../../types/users";
import { DayDateParams } from "../../../../../../../../types/date";
import Loader from "../../../../../../../../components/Loader";

const Set = () => {
  const { date, dayDate, orderId, driver } = useLocalSearchParams<{
    date: string;
    dayDate: string;
    orderId: string;
    driver: string;
  }>();

  const { data, isLoading } = useFetch<WorkersDriversResponse, DayDateParams>(
    getWorkersDrivers,
    {
      day: dayDate,
    }
  );

  const router = useRouter();

  const [users, setUsers] = useState<{ driver_id: string; workers: string[] }>({
    driver_id: driver !== "null" ? driver : "",
    workers: [],
  });

  const handleSubmit = async () => {
    const fetchUsers = {
      order_id: orderId,
      driver_id: users.driver_id,
      worker_ids: users.workers.length > 0 ? users.workers : null,
    };

    await updateDriversWorkers(fetchUsers);
    router.dismissAll();
    router.push(`/week/${date}`);
    router.push(`/week/${date}/day/${dayDate}`);
    router.push(`/week/${date}/day/${dayDate}/order/${orderId}`);
  };

  const handleSetDriver = (driver: string) => {
    setUsers({ ...users, driver_id: driver });
  };

  const handleAddWorker = (value: string[]) => {
    setUsers({ ...users, workers: value });
  };

  if (isLoading) {
    return <Loader />;
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
            <SelectInput
              name=""
              placeholder="Водитель"
              data={data?.drivers || []}
              value={users.driver_id}
              onChange={(value) => {
                handleSetDriver(value);
              }}
            />
            <MultipleSelectInput
              placeholder="Рабочий"
              data={[...(data?.workers ?? [])]}
              onChange={handleAddWorker}
            />
          </View>
        </ScrollView>
        <Button onPress={handleSubmit}>Назначить</Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Set;

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
