import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [targetId, setTargetId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);

  return (
    <AppContext.Provider
      value={{
        targetId,
        setTargetId,
        progress,
        setProgress,
        status,
        setStatus,
        result,
        setResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
