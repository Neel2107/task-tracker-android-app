import { View, Text, Image } from "react-native";
import React from "react";
import NoTask from "../assets/images/no-task.svg";

const NoTasks = () => {
  return (
    <View className="w-full py-10 flex items-center justify-center">
       <NoTask width={200} height={200} />
       <Text className="text-lg text-zinc-600"> You don't have any tasks yet.</Text>
    </View>
  );
};

export default NoTasks;
