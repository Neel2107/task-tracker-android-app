import { View, Text } from 'react-native'
import React from 'react'
import { statusMap } from '@/utility/statusData'

const Card = ({ statusID, tasks }) => {
    const { text, color } = statusMap[statusID] || {};
  return (
    <View className="flex flex-col rounded-md gap-4 shadow-sm bg-white">
      <View
        className={`flex w-full items-center justify-center py-2 text-white rounded-t-md font-semibold ${color}`}
      >
        {text}
      </View>
      <View className="p-2 w-full flex flex-col gap-2">
        {tasks.map((task, index) => {
          return (
            // <Task
            //   key={index}
            //   title={task.title}
            //   priority={task.priority}
            //   assignee={task.assigneeName}
            //   description={task.description}
            //   status={text}
            //   statusID={statusID}
            //   id={task.id}
            //   team={task.team}

            // />
          );
        })}
      </View>
    </Vi>
  )
}

export default Card