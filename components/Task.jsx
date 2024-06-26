import { View, Text, TouchableOpacity, Modal } from "react-native";
import React from "react";
import { useState } from "react";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { Entypo } from "@expo/vector-icons";
import EditTaskModal from "./EditTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

const Task = ({
  title,
  priority,
  assignee,
  description,
  status,
  id,
  statusID,
  team,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const openDeleteModal = () => {
   
    setIsDeleteModalOpen(true);
  };
  const openEditModal = () => {
   
    setIsEditModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutDown} className="my-2 space-y-2 bg-zinc-200 rounded-md p-2">
      <EditTaskModal
        taskToEdit={{
          title,
          priority,
          assignee,
          description,
          status,
          id,
          statusID,
          team,
        }}
        isOpen={isEditModalOpen}
        closeEditModal={closeEditModal}
      />

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        taskToDelete={{
          title,
          priority,
          assignee,
          description,
          status,
          id,
          statusID,
        }}
      />
      <View className="flex flex-row items-center justify-between border-b pb-2 border-zinc-500">
        <Text className="text-lg font-medium">{title}</Text>
        <View className="p-2 rounded-md bg-blue-500">
          <Text className="text-xs text-white">{priority}</Text>
        </View>
      </View>
      <View className="text-wrap">
        <Text className="text-xs text-wrap break-all">{description}</Text>
      </View>
      <View className="flex flex-row items-center  justify-between">
        <Text className="text-sm font-semibold">@{assignee}</Text>

        <Menu>
          <MenuTrigger>
            <Entypo name="dots-three-vertical" size={17} color="black" />
          </MenuTrigger>
          <MenuOptions
            optionsContainerStyle={{
              backgroundColor: "white",
              padding: 5,
              borderRadius: 10,
            }}
          >
            <MenuOption
              onSelect={() => {
                setIsEditModalOpen(true);
              }}
              text="Edit"
              customStyles={{
                optionText: { color: "black", fontSize: 15 },
              }}
            />
            <MenuOption  onSelect={openDeleteModal}>
              <Text style={{ color: "red" }}>Delete</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
      <View className=" flex flex-col  rounded-md">
        

        <TouchableOpacity
          activeOpacity={1}
          className="  flex items-center justify-center w-28 py-2 px-4 bg-blue-500 text-white   rounded-md"
          >
          <Text className="text-white font-semibold">
            {Number(statusID) === 1 ? "Assign" : status}
          </Text>
        </TouchableOpacity>
      
      </View>
    </Animated.View>
  );
};

export default Task;
