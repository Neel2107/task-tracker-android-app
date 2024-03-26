// import { View, Text, Button } from "react-native";
// import React, { useState } from "react";
// import { TextInput } from "react-native-paper";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Dropdown } from "react-native-element-dropdown";

// const AddTask = () => {
//   const [selectedPriority, setSelectedPriority] = useState("Priority");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [team, setTeam] = useState("");
//   const [assigneeName, setAssigneeName] = useState("");
//   const [titleError, setTitleError] = useState(false);
//   const [descriptionError, setDescriptionError] = useState(false);
//   const [teamError, setTeamError] = useState(false);
//   const [assigneeNameError, setAssigneeNameError] = useState(false);

//   const data = [
//     { label: "Priority", value: "Priority" },
//     { label: "P0", value: "P0" },
//     { label: "P1", value: "P1" },
//     { label: "P2", value: "P2" },
    
//   ];

//   const handleSubmit = async () => {
//     let tasks = [];
//     try {
//       const value = await AsyncStorage.getItem("tasks");
//       if (value !== null) {
//         tasks = JSON.parse(value);
//       }
//     } catch (e) {
//       // error reading value
//     }

//     const newTask = {
//       title,
//       description,
//       team,
//       assigneeName,
//       priority: selectedPriority === "Priority" ? "P0" : selectedPriority,
//       status: 1,
//       startDate: new Date().toISOString(),
//     };
//     tasks.push(newTask);

//     try {
//       await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
//     } catch (e) {
//       // saving error
//     }

//     resetForm();
//   };

//   const resetForm = () => {
//     setSelectedPriority("Priority");
//     setTitle("");
//     setDescription("");
//     setTeam("");
//     setAssigneeName("");
//   };

//   return (
//     <View className={`flex-1 justify-center items-center`}>
//       <View className={`bg-white w-full p-4 rounded-lg`}>
//         <Text className={`text-lg font-bold mb-4`}>CREATE A TASK</Text>
//         <TextInput
//           className={`border border-gray-300 rounded p-2 mb-4 ${
//             titleError ? "bg-red-200" : ""
//           }`}
//           placeholder="Title"
//           value={title}
//           onChangeText={setTitle}
//         />
//         <TextInput
//           className={`border border-gray-300 rounded p-2 mb-4 ${
//             descriptionError ? "bg-red-200" : ""
//           }`}
//           placeholder="Description"
//           value={description}
//           onChangeText={setDescription}
//           multiline
//         />
//         <TextInput
//           className={`border border-gray-300 rounded p-2 mb-4 ${
//             teamError ? "bg-red-200" : ""
//           }`}
//           placeholder="Team"
//           value={team}
//           onChangeText={setTeam}
//         />
//         <TextInput
//           className={`border border-gray-300 rounded p-2 mb-4 ${
//             assigneeNameError ? "bg-red-200" : ""
//           }`}
//           placeholder="Assignee Name"
//           value={assigneeName}
//           onChangeText={setAssigneeName}
//         />
//         <View>

//         <Dropdown
//           style={{ width: "100%", height: 40, marginBottom: 20 }}
//           data={data}
//           placeholder="Select priority"
//           valueField="value"
//           labelField="label"
//           value={selectedPriority}
//           onChange={(item) => setSelectedPriority(item.value)}
//           />
//           </View>

//         <Button title="Add" onPress={handleSubmit} />
//       </View>
//     </View>
//   );
// };

// export default AddTask;
