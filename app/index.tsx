import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "@/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableRipple } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import DatePicker from "react-native-date-picker";
import NoTasks from "@/components/NoTasks";
import { useRouter } from "expo-router";
import Card from "@/components/Card";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AddTask from "@/components/AddTaskModal";
import { dropDownItems } from "@/utility/dropdownData";

interface Task {
  assigneeName: string;
  priority: string;
  startDate: string;
  endDate?: string;
  status: string;
}

const TaskBoard = () => {
  const insets = useSafeAreaInsets();
  const { tasks, setTasks } = useAppContext();
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
  const route = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false); // State to track refreshing


 

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
    if (sortPriority === "p1") {
      if (a.priority === "P1") return -1;
      if (b.priority === "P1") return 1;
      if (a.priority === "P2") return 1;
      if (b.priority === "P2") return -1;
      return 0;
    } else if (sortPriority == "P2") {
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

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  

  const openAddTaskModal = () => {
    bottomSheetModalRef.current?.present();
  };
  const closeAddTaskModal = () => {
    bottomSheetModalRef.current?.dismiss();
  };


  const loadTasks = async () => {
    const result = await AsyncStorage.getItem("tasks");
    const loadedTasks = result ? JSON.parse(result) : [];
    setTasks(loadedTasks);
    setPriorityFilter("All");
    setIsLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Perform your data fetching here
    // For example, reload tasks
    await loadTasks();
    setIsRefreshing(false); // Reset refreshing state
  }, [loadTasks]); // Make sure to include necessary dependencies here
  useEffect(() => {

    loadTasks();
  }, []);
 
 

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
     
      <BottomSheetModal ref={bottomSheetModalRef} snapPoints={["75%"]}>
        <AddTask closeAddTaskModal={closeAddTaskModal} />
      </BottomSheetModal>
      <StatusBar style="dark" />
      <ScrollView  refreshControl={
  <RefreshControl
  refreshing={isRefreshing}
  onRefresh={onRefresh}
/>
      }>

  
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
            <TouchableOpacity
              onPress={openAddTaskModal}
              className=" px-4 rounded-lg py-2 bg-blue-500"
            >
              <View>
                <Text className=" text-lg text-white">Add Task</Text>
              </View>
            </TouchableOpacity>
            <TouchableRipple
              onPress={async () => await AsyncStorage.clear()}
              className=" px-4 rounded-lg py-2 bg-red-500 ml-4"
            >
              <View>
                <Text className=" text-lg text-white">Clear Data</Text>
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
                data={dropDownItems}
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
                data={dropDownItems}
                maxHeight={300}
                labelField="label"
                valueField="key"
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

          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Text key={index}>Loading</Text>
            ))
          ) : Object.entries(tasksByStatus).length === 0 ? (
            <NoTasks />
          ) : (
            <FlatList
              data={Object.entries(tasksByStatus)}
              horizontal
              contentContainerStyle={{ flexGrow: 1 }}
              keyExtractor={([status, tasks]) => status}
              renderItem={({ item: [status, tasks] }) => (
                <Card statusID={status} tasks={tasks} />
              )}
            />
          )}
        </View>
      </View>
      </ScrollView>
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
