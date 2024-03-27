import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { dropDownItems } from "@/utility/dropdownData";
import { statusMap } from "@/utility/statusData";
import AsyncStorage from "@react-native-async-storage/async-storage";

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key].text === value);
}

const EditTaskModal = ({ isOpen, closeEditModal, taskToEdit }) => {
  const { tasks, setTasks } = useAppContext();
  const [selectedPriority, setSelectedPriority] = useState(taskToEdit.priority);
  const [newStatus, setNewStatus] = useState(taskToEdit.statusID);
  const [isFocus1, setIsFocus1] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);

  const handleSubmit = () => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskToEdit.id) {
        let updatedTask = {
          ...task,
          status: newStatus,
          statusID: getKeyByValue(statusMap, newStatus),
          priority: selectedPriority,
        };
        if (newStatus === getKeyByValue(statusMap, "Completed")) {
          updatedTask.endDate = new Date().toISOString();
        }
        return updatedTask;
      } else {
        return task;
      }
    });
    setTasks(updatedTasks);
    AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    closeEditModal()
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={closeEditModal}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={closeEditModal}
        activeOpacity={1}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <TouchableOpacity className="" activeOpacity={1}>
            <View
              className="w-96  h-auto"
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              {/* Your modal content goes here */}
              <Text className="text-center my-2  text-lg font-semibold">
                Edit Task
              </Text>
              <TextInput
                className={`border rounded-md border-gray-300   p-2 mb-4 bg-gray-200`}
                placeholder="Title"
                value={taskToEdit.title}
                cursorColor="#000"
                style={{ fontSize: 14, color: "#000", height: 30 }}
                placeholderTextColor={"#000"}
                textColor="black"
                activeUnderlineColor="#000"
                underlineColor="transparent"
                underlineColorAndroid={"transparent"}
                readOnly
              />
              <TextInput
                className={`border rounded-md border-gray-300 bg-gray-200 p-2 mb-4 
                }`}
                placeholder="Description"
                value={taskToEdit.description}
                multiline
                cursorColor="#000"
                style={{ fontSize: 14, color: "#000", height: 30 }}
                placeholderTextColor={"#000"}
                textColor="black"
                activeUnderlineColor="#000"
                underlineColor="transparent"
                underlineColorAndroid={"transparent"}
                readOnly
              />
              <TextInput
                className={`border rounded-md border-gray-300 bg-gray-200 p-2 mb-4 
                `}
                placeholder="Team"
                value={taskToEdit.team}
                cursorColor="#000"
                style={{ fontSize: 14, color: "#000", height: 30 }}
                placeholderTextColor={"#000"}
                textColor="black"
                activeUnderlineColor="#000"
                underlineColor="transparent"
                underlineColorAndroid={"transparent"}
                readOnly
              />
              <TextInput
                className={`border rounded-md border-gray-300 bg-gray-200 p-2 mb-4 
                }`}
                placeholder="Assignee Name"
                value={taskToEdit.assigneeName}
                cursorColor="#000"
                style={{ fontSize: 14, color: "#000", height: 30 }}
                placeholderTextColor={"#000"}
                textColor="black"
                activeUnderlineColor="#000"
                underlineColor="transparent"
                underlineColorAndroid={"transparent"}
                readOnly
              />

              <View className="flex flex-row items-center space-x-2">
                <Dropdown
                  className="w-1/2 bg-zinc-200 placeholder:placeholder-gray-500"
                  style={[styles.dropdown, isFocus1 && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={dropDownItems}
                  maxHeight={300}
                  labelField="label"
                  valueField="key"
                  placeholder={!isFocus1 ? "Priority" : "..."}
                  value={selectedPriority}
                  onFocus={() => setIsFocus1(true)}
                  onBlur={() => setIsFocus1(false)}
                  onChange={(item) => {
                    setSelectedPriority(item.key);
                    setIsFocus1(false);
                  }}
                />

                <Dropdown
                  className="w-1/2 bg-zinc-200 placeholder:placeholder-gray-500"
                  style={[styles.dropdown, isFocus2 && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={Object.entries(statusMap).map(([key, { text }]) => ({
                    key,
                    label: text,
                  }))}
                  maxHeight={300}
                  labelField="label"
                  valueField="key"
                  placeholder={!isFocus2 ? "Status" : "..."}
                  value={newStatus}
                  onFocus={() => setIsFocus2(true)}
                  onBlur={() => setIsFocus2(false)}
                  onChange={(item) => {
                    setNewStatus(item.key);
                    setIsFocus2(false);
                  }}
                />
              </View>

              <View className="mt-3  self-end">
                <TouchableOpacity
                  className="bg-blue-500 w-20 p-2  my-2 rounded-lg"
                  onPress={handleSubmit}
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default EditTaskModal;

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
