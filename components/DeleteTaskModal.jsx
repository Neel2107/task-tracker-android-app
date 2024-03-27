import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeleteTaskModal = ({ isOpen, onClose, taskToDelete }) => {
  const { tasks, setTasks } = useAppContext();

  const handleDelete = () => {
    const updatedTasks = tasks.filter((task) => task.id !== taskToDelete.id);
    setTasks(updatedTasks);
    AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    onClose();
  };

  const isCompleted = Number(taskToDelete.statusID) === 3;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <TouchableOpacity activeOpacity={1}>
            <View
              className="w-96  h-56"
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              {/* Your modal content goes here */}
              <Text className=" my-2  text-xl font-semibold">Delete Task</Text>
              <Text className="text-lg text-zinc-700">
                {isCompleted
                  ? "This task is completed and cannot be deleted"
                  : "Do you want to delete this task?"}
              </Text>

              {isCompleted ? (
                <TouchableOpacity
                  className="bg-zinc-400 w-20 p-2 my-2 rounded-lg"
                  onPress={onClose}
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    Close
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className="flex flex-row items-center mt-10 space-x-4">
                  <TouchableOpacity
                    className="bg-zinc-400 w-20 p-2 my-2 rounded-lg"
                    onPress={onClose}
                  >
                    <Text className="text-white text-center text-lg font-semibold">
                      No
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-red-500 w-20 p-2 my-2 rounded-lg"
                    onPress={handleDelete}
                  >
                    <Text className="text-white text-center text-lg font-semibold">
                      Yes
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default DeleteTaskModal;
