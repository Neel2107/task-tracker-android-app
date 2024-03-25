import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "@/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableRipple } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import DatePicker from "react-native-date-picker";
import NoTasks from "@/components/NoTasks";

interface Task {
  assigneeName: string;
  priority: string;
  startDate: string;
  endDate?: string;
  status: string;
}

const data = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
];

const TaskBoard = () => {
  const insets = useSafeAreaInsets();
  const { tasks, setTasks } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortPriority, setSortPriority] = useState("P0");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      const result = await AsyncStorage.getItem("tasks");
      const loadedTasks = result ? JSON.parse(result) : [];
      setTasks(loadedTasks);
      setPriorityFilter("All");
      setIsLoading(false);
    };

    loadTasks();
  }, []);
  const closeAddModal = async () => {
    const result = await AsyncStorage.getItem("tasks");
    const loadedTasks = result ? JSON.parse(result) : [];
    setTasks(loadedTasks);
    setIsAddModalOpen(false);
  };

  const filteredTasks: Task[] = tasks.filter((task: Task) => {
    let startDate = new Date(task.startDate);
    let endDate = task.endDate ? new Date(task.endDate) : null;

    if (selectedStartDate && startDate < new Date(selectedStartDate)) {
      return false;
    }

    if (selectedEndDate && (!endDate || endDate > new Date(selectedEndDate))) {
      return false;
    }

    return (
      task.assigneeName.toLowerCase().includes(assigneeFilter.toLowerCase()) &&
      (priorityFilter === "All" || task.priority === priorityFilter)
    );
  });

  const sortedTasks: Task[] = filteredTasks.sort((a: Task, b: Task) => {
    if (sortPriority === "P1") {
      if (a.priority === "P1") return -1;
      if (b.priority === "P1") return 1;
      if (a.priority === "P2") return 1;
      if (b.priority === "P2") return -1;
      return 0;
    } else if (sortPriority === "P2") {
      return b.priority.localeCompare(a.priority);
    } else {
      return a.priority.localeCompare(b.priority);
    }
  });

  const tasksByStatus: Record<string, Task[]> = sortedTasks.reduce(
    (acc: Record<string, Task[]>, task: Task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    },
    {}
  );

  return (
    <View className="flex-1 " style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />
      <View className="flex flex-col space-y-4 p-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-2xl font-bold ">Task Board</Text>

          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=a04258114e29026302d" }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
        </View>

        <View className="flex flex-col  space-y-4 justify-between ">
          <View className="flex flex-row justify-end">
            <TouchableRipple className=" px-4 rounded-lg py-2 bg-blue-500">
              <View>
                <Text className=" text-lg text-white">Add Task</Text>
              </View>
            </TouchableRipple>
          </View>
          <View className="flex flex-col space-y-2">
            <View className="flex flex-row items-center space-x-2">
              <Text className="text-lg font-medium">Filters:</Text>
              <TextInput
                inputMode="text"
                cursorColor={"#000000"}
                value={assigneeFilter}
                onChangeText={setAssigneeFilter}
                placeholder="Assignee name"
                className="text-base font-medium bg-zinc-200 rounded-lg px-2 pr-6 py-2"
              />

              <Dropdown
                className="w-1/3 bg-zinc-200 placeholder:placeholder-gray-500"
                style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? "Priority" : "..."}
                value={priorityFilter}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setPriorityFilter(item.value);
                  setIsFocus(false);
                }}
              />
            </View>
            <View className="flex  flex-row items-center space-x-2">
              <Text>date pickers</Text>
              <Button title="Open" onPress={() => setOpen(true)} />
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>

            <View className="flex flex-row items-center space-x-2">
              <Text className="text-lg font-medium">Sort By:</Text>
              <Dropdown
                className="w-1/3 bg-zinc-200 placeholder:placeholder-gray-500"
                style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus1 ? "Priority" : "..."}
                value={sortPriority}
                onFocus={() => setIsFocus1(true)}
                onBlur={() => setIsFocus1(false)}
                onChange={(item) => {
                  setSortPriority(item.value);
                  setIsFocus1(false);
                }}
              />
            </View>
          </View>

          {isLoading
            ? Array.from({ length: 5 }).map((_, index) =>  <Text key={index}>Loading</Text>)
            : Object.entries(tasksByStatus).length === 0
            ? <NoTasks />
            : Object.entries(tasksByStatus).map(([status, tasks]) => (
                <View className="" key={status}>
                  <Card statusID={status} tasks={tasks} />
                </View>
              ))}
        </View>
      </View>
    </View>
  );
};

export default TaskBoard;
const styles = StyleSheet.create({
  dropdown: {
    height: 45,

    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
