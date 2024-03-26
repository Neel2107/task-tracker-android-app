import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useState } from "react";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { Entypo } from "@expo/vector-icons";

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
  const [popoverKey, setPopoverKey] = useState(Math.random());

  const openDeleteModal = () => {
    setPopoverKey(Math.random());
    setIsDeleteModalOpen(true);
  };
  const openEditModal = () => {
    setPopoverKey(Math.random());
    setIsEditModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <View className="my-2 space-y-2 bg-zinc-300 rounded-md p-2">
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
                console.log("Edit");
              }}
              text="Edit"
              customStyles={{
                optionText: { color: "black", fontSize: 15 },
              }}
            />
            <MenuOption>
              <Text style={{ color: "red" }}>Delete</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
      <View className=" flex flex-col  rounded-md">
        <TouchableOpacity
          activeOpacity={1}
          className="  flex items-center justify-center w-20 py-2 px-4 bg-blue-500 text-white   rounded-md"
        >
          <Text className="text-white font-semibold">
            {Number(statusID) === 1 ? "Assign" : status}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Task;
