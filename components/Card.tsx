import { View, Text, ScrollView } from "react-native";
import React from "react";
import { statusMap } from "@/utility/statusData";
import Task from "./Task";
import { FlatList } from "react-native";

const Card = ({ statusID, tasks }) => {
  const { text, color } = statusMap[statusID] || {};

  return (
    <View className="flex  flex-col rounded-md w-full  bg-white">
      <View
        className={`flex w-full  items-center justify-center py-2 rounded-t-md    ${color}  `}
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
   
    </View>
  );
};

export default Card;
