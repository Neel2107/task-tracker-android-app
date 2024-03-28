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
import { Entypo } from "@expo/vector-icons";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

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
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    let startDate = new Date(task.startDate);
    let endDate = task.endDate ? new Date(task.endDate) : null;

    // Date filters
    if (selectedStartDate && startDate < new Date(selectedStartDate)) {
      return false;
    }
    if (selectedEndDate && (!endDate || endDate > new Date(selectedEndDate))) {
      return false;
    }

    // Assignee name filter
    if (
      !task.assigneeName.toLowerCase().includes(assigneeFilter.toLowerCase())
    ) {
      return false;
    }

    // Priority filter
    if (priorityFilter !== "All" && task.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

  const sortedTasks: Task[] = filteredTasks.sort((a: Task, b: Task) => {
    if (sortPriority === "P1") {
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

    // Reset filters and sorting to their default values
    setAssigneeFilter("");
    setPriorityFilter("All");
    setSortPriority("P0");
    setSelectedStartDate("");
    setSelectedEndDate("");
    // Hide the date pickers
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);

    await loadTasks();
    setIsRefreshing(false); // Reset refreshing state
  }, [loadTasks]); // Make sure to include necessary dependencies here
  useEffect(() => {
    loadTasks();
  }, []);

  console.log("tasksByStatus", tasksByStatus);

  return (
    <View className="flex-1 relative" style={{ paddingTop: insets.top }}>
      <TouchableOpacity
        style={{
          zIndex: 1,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={openAddTaskModal}
        className=" p-3 rounded-full absolute bottom-5 right-5 z-10  bg-blue-500"
      >
        <View>
          <Entypo name="plus" size={35} color="white" />
          {/* <Text className=" text-lg text-white">Add Task</Text> */}
        </View>
      </TouchableOpacity>
      <BottomSheetModal
        backdropComponent={({ style }) => (
          <View
            style={[
              style,
              {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
            ]}
          />
        )}
        ref={bottomSheetModalRef}
        snapPoints={["75%", "100%"]}
      >
        <AddTask closeAddTaskModal={closeAddTaskModal} />
      </BottomSheetModal>
      <StatusBar style="dark" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex flex-col space-y-4 relative py-4">
          <View className="flex flex-row items-center px-4 justify-between">
            <Text className="text-2xl font-bold ">Task Board</Text>

            <Menu>
              <MenuTrigger>
                <Image
                  source={{
                    uri: "https://i.pravatar.cc/150?u=a04258114e29026302d",
                  }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
              </MenuTrigger>

              <MenuOptions
                optionsContainerStyle={{
                  backgroundColor: "white",
                  padding: 5,
                  borderRadius: 10,
                  marginTop: 45,
                }}
              >
                <MenuOption
                onSelect={async () => {
                  await AsyncStorage.clear();
                  await loadTasks();
                }}
                  text="Clear Data"
                  customStyles={{
                    optionText: { color: "black", fontSize: 15 },
                  }}
                />
              </MenuOptions>
            </Menu>
          </View>

          <View className="flex flex-col  space-y-4 justify-between  ">
            {/* <View className="flex flex-row justify-end px-4">
              <TouchableOpacity
                onPress={openAddTaskModal}
                className=" p-3 rounded-full absolute bottom-5 right-5 z-10  bg-blue-500"
              >
                <View>
                <Entypo name="plus" size={24} color="white" />
                </View>
              </TouchableOpacity>
             
            </View> */}
            <View className="flex flex-col space-y-2 px-4">
              <Text className="text-lg font-medium">Filters:</Text>
              <View className="flex flex-row items-center space-x-2">
                <TextInput
                  inputMode="text"
                  cursorColor={"#000000"}
                  value={assigneeFilter}
                  onChangeText={setAssigneeFilter}
                  placeholder="Assignee name"
                  className="text-base font-medium bg-zinc-200 rounded-lg px-2 pr-5 py-2"
                />

                <Dropdown
                  className="w-1/3 bg-zinc-200 placeholder:placeholder-gray-500"
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={[{ key: "all", label: "All" }, ...dropDownItems]}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Priority" : "..."}
                  value={priorityFilter}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setPriorityFilter(item.label);
                    setIsFocus(false);
                  }}
                />
              </View>
              <View className="flex  flex-row items-center space-x-2">
                <TouchableOpacity
                  className="font-medium flex flex-col space-y-2 bg-zinc-200 rounded-lg px-2 pr-6 py-2"
                  onPress={() => setShowStartDatePicker(true)} // Show start date picker
                >
                  <Text>Start:</Text>
                  <Text className="text-base">
                    {selectedStartDate
                      ? selectedStartDate.toLocaleDateString()
                      : "DD/MM/YYYY"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="font-medium flex flex-col space-y-2 bg-zinc-200 rounded-lg px-2 pr-6 py-2"
                  onPress={() => setShowEndDatePicker(true)} // Show end date picker
                >
                  <Text>End Date:</Text>
                  <Text className="text-base">
                    {selectedEndDate
                      ? selectedEndDate.toLocaleDateString()
                      : "DD/MM/YYYY"}
                  </Text>
                </TouchableOpacity>

                {/* Start Date Picker */}
                {showStartDatePicker && (
                  <DatePicker
                    modal
                    theme="auto"
                    open={showStartDatePicker}
                    date={selectedStartDate || new Date()}
                    onConfirm={(date) => {
                      setShowStartDatePicker(false);
                      setSelectedStartDate(date);
                    }}
                    onCancel={() => {
                      setShowStartDatePicker(false);
                    }}
                  />
                )}

                {/* End Date Picker */}
                {showEndDatePicker && (
                  <DatePicker
                    modal
                    theme="auto"
                    
                    open={showEndDatePicker}
                    date={selectedEndDate || new Date()}
                    onConfirm={(date) => {
                      setShowEndDatePicker(false);
                      setSelectedEndDate(date);
                    }}
                    onCancel={() => {
                      setShowEndDatePicker(false);
                    }}
                  />
                )}
              </View>

              <View className="flex flex-row items-center space-x-2">
                <View
                  className="flex p-2 flex-col bg-zinc-200 rounded-md w-1/3
                "
                >
                  <Text>Sort By:</Text>

                  <Dropdown
                    className=" bg-zinc-200 placeholder:placeholder-gray-500"
                    style={[
                      styles.dropdown,
                      isFocus && { borderColor: "blue" },
                    ]}
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
                      setSortPriority(item.label);
                      setIsFocus1(false);
                    }}
                  />
                </View>
              </View>
            </View>

            {isLoading ? (
              <Text className="text-center text-lg font-semibold">
                Loading...
              </Text>
            ) : Object.entries(tasksByStatus).length === 0 ? (
              <NoTasks />
            ) : (
              <View className="flex-1">
                <FlatList
                  horizontal
                  data={Object.entries(tasksByStatus)}
                  keyExtractor={([status, tasks]) => status}
                  renderItem={({ item: [status, tasks] }) => (
                    <Card statusID={status} tasks={tasks} />
                  )}
                />
              </View>
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
