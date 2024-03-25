

import React, { useState } from "react";

const AppContext = React.createContext();

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const value = {
    tasks,
    setTasks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
}
