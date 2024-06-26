import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import { useAppContext } from "@/context/AppContext";

const generateUniqueId = () => {
  // Create a unique ID based on the current time and a random number
  return (
    "id-" +
    new Date().getTime().toString(36) +
    "-" +
    Math.random().toString(36).substr(2, 9)
  );
};
const data = [
  { label: "Priority", value: "Priority" },
  { label: "P0", value: "P0" },
  { label: "P1", value: "P1" },
  { label: "P2", value: "P2" },
];

const AddTask = ({ closeAddTaskModal }) => {
  const { tasks, setTasks } = useAppContext();
  const [selectedPriority, setSelectedPriority] = useState("Priority");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [team, setTeam] = useState("");
  const [assigneeName, setAssigneeName] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [teamError, setTeamError] = useState(false);
  const [assigneeNameError, setAssigneeNameError] = useState(false);

  const validateForm = () => {
    // Check if required fields are not empty and meet character requirements
    if (!title || title.length < 3) {
      return "title";
    }
    if (!description || description.length < 10) {
      return "description";
    }
    if (!team) {
      return "team";
    }
    if (!assigneeName) {
      return "assigneeName";
    }

    // Return true if no errors
    return true;
  };

  const handleSubmit = async () => {
    const validationResult = validateForm();

    if (validationResult !== true) {
      let toastMessage = "";
      switch (validationResult) {
        case "title":
          toastMessage =
            "Title is required and should be at least 3 characters long.";
          break;
        case "description":
          toastMessage =
            "Description is required and should be at least 10 characters long.";
          break;
        case "team":
          toastMessage = "Team is required.";
          break;
        case "assigneeName":
          toastMessage = "Assignee Name is required.";
          break;
      }
      ToastAndroid.show(toastMessage, ToastAndroid.SHORT);
      return; // Prevent form submission if validation fails
    }
    let tasks = [];
    try {
      const value = await AsyncStorage.getItem("tasks");
      if (value !== null) {
        tasks = JSON.parse(value);
      }
    } catch (e) {
      console.error("Error reading tasks from AsyncStorage:", e);
      return; // Exit if reading fails
    }

    const newTask = {
      id: generateUniqueId(), // Use the custom function here
      title,
      description,
      team,
      assigneeName,
      priority: selectedPriority === "Priority" ? "P0" : selectedPriority,
      status: 1,
      startDate: new Date().toISOString(),
    };
    tasks.push(newTask);

    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      setTasks(tasks); // Update tasks in context
      ToastAndroid.show("Task added!", ToastAndroid.SHORT);

      closeAddTaskModal();
    } catch (e) {
      console.error("Error saving tasks to AsyncStorage:", e);
    }

    resetForm();
  };

  // This function resets the form fields to their initial state
  const resetForm = () => {
    setSelectedPriority("Priority");
    setTitle("");
    setDescription("");
    setTeam("");
    setAssigneeName("");
  };

  return (
    <View className={`flex-1 justify-center items-center`}>
      <View className={`h-full flex-1  w-full p-4 `}>
        <Text className={`text-xl font-bold mb-4`}>CREATE A TASK</Text>
        <TextInput
          className={`border rounded-md border-gray-300   p-2 mb-4 ${
            titleError ? "bg-red-200" : "bg-white"
          }`}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          cursorColor="#000"
          style={{ fontSize: 14, color: "#000", height: 30 }}
          placeholderTextColor={"#000"}
          textColor="black"
          activeUnderlineColor="#000"
          underlineColor="transparent"
          underlineColorAndroid={"transparent"}
        />
        <TextInput
          className={`border rounded-md border-gray-300  p-2 mb-4 ${
            descriptionError ? "bg-red-200" : "bg-white"
          }`}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={1} // Initial number of lines
          cursorColor="#000"
          style={{ fontSize: 14, color: "#000" }}
          placeholderTextColor={"#000"}
          textColor="black"
          activeUnderlineColor="#000"
          underlineColor="transparent"
          underlineColorAndroid={"transparent"}
        />
        <TextInput
          className={`border rounded-md border-gray-300  p-2 mb-4 ${
            teamError ? "bg-red-200" : "bg-white"
          }`}
          placeholder="Team"
          value={team}
          onChangeText={setTeam}
          cursorColor="#000"
          style={{ fontSize: 14, color: "#000", height: 30 }}
          placeholderTextColor={"#000"}
          textColor="black"
          activeUnderlineColor="#000"
          underlineColor="transparent"
          underlineColorAndroid={"transparent"}
        />
        <TextInput
          className={`border rounded-md border-gray-300  p-2 mb-4 ${
            assigneeNameError ? "bg-red-200" : "bg-white"
          }`}
          placeholder="Assignee Name"
          value={assigneeName}
          onChangeText={setAssigneeName}
          cursorColor="#000"
          style={{ fontSize: 14, color: "#000", height: 30 }}
          placeholderTextColor={"#000"}
          textColor="black"
          activeUnderlineColor="#000"
          underlineColor="transparent"
          underlineColorAndroid={"transparent"}
        />
        <View>
          <Dropdown
            className="border border-gray-300 px-5 py-2  rounded-md"
            style={{
              width: "100%",
              height: 40,
              marginBottom: 20,
              fontSize: 14,
            }}
            data={data}
            placeholder="Select priority"
            placeholderStyle={{ color: "black", fontSize: 14 }}
            valueField="value"
            labelField="label"
            value={selectedPriority}
            onChange={(item) => setSelectedPriority(item.value)}
          />
        </View>
        <View className="flex items-center justify-center">
          <TouchableOpacity
            className="flex items-center py-2 px-10 justify-center  rounded-lg  bg-blue-500"
            onPress={handleSubmit}
          >
            <Text className={`  text-lg  text-white `}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddTask;
