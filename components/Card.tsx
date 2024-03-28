import { View, Text, ScrollView } from "react-native";
import React from "react";
import Task from "./Task";
import { FlatList } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

export const statusMap = {
  1: { text: "Pending", color: "#9CA3AF" }, // bg-zinc-400
  2: { text: "In Progress", color: "#FBBF24" }, // bg-yellow-400
  3: { text: "Completed", color: "#34D399" }, // bg-green-400
  4: { text: "Deployed", color: "#3B82F6" }, // bg-blue-500
  5: { text: "Deferred", color: "#EF4444" }, // bg-red-500
};

const Card = ({ statusID, tasks }) => {
  const { text, color } = statusMap[statusID] || {};

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutDown} className="flex  flex-col rounded-md w-[300px] m-2  bg-white">
      <View
        className={`flex w-full  items-center justify-center py-2 rounded-t-md     `}

        style={{ backgroundColor: color }}
      >
        <Text className="text-xl font-semibold text-white"> {text}</Text>
      </View>
     
        <View className="p-2  w-full flex flex-col space-y-2">
          <FlatList
            data={tasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item: task }) => (
              <Task
                title={task.title}
                priority={task.priority}
                assignee={task.assigneeName}
                description={task.description}
                status={text}
                statusID={statusID}
                id={task.id}
                team={task.team}
              />
            )}
          />
        </View>
   
    </Animated.View>
  );
};

export default Card;
