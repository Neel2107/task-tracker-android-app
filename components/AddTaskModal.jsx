import { View, Text } from 'react-native'
import React from 'react'
import { useState } from "react";


const AddTaskModal = () => {

    const [selectedPriority, setSelectedPriority] = useState("Priority");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [team, setTeam] = useState("");
  const [assigneeName, setAssigneeName] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [teamError, setTeamError] = useState(false);
  const [assigneeNameError, setAssigneeNameError] = useState(false);

  const handleSubmit = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const newTask = {
      id: uuidv4(), // Add this line
      title,
      description,
      team,
      assigneeName,
      priority: selectedPriority === "Priority" ? "P0" : selectedPriority,
      status: 1,
      startDate: new Date().toISOString(),
    };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedPriority("Priority");
    setTitle("");
    setDescription("");
    setTeam("");
    setAssigneeName("");
  };

  const handleTitleChange = (e) => {
    if (e.target.value.length > 50) {
      setTitleError(true);
    } else {
      setTitleError(false);
      setTitle(e.target.value);
    }
  };

  const handleDescriptionChange = (e) => {
    if (e.target.value.length > 200) {
      setDescriptionError(true);
    } else {
      setDescriptionError(false);
      setDescription(e.target.value);
    }
  };

  const handleTeamChange = (e) => {
    if (e.target.value.length > 30) {
      setTeamError(true);
    } else {
      setTeamError(false);
      setTeam(e.target.value);
    }
  };

  const handleAssigneeNameChange = (e) => {
    if (e.target.value.length > 30) {
      setAssigneeNameError(true);
    } else {
      setAssigneeNameError(false);
      setAssigneeName(e.target.value);
    }
  };
  return (
    <View>
      <Text>AddTaskModal</Text>
    </View>
  )
}

export default AddTaskModal