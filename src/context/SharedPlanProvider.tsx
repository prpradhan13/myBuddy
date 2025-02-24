import { ReactNode, useContext, createContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthProvider";

export interface TSharedPlanInfo {
  recipientId?: string;
}

interface SharedPlanContextType {
  sharedPlanInfo: TSharedPlanInfo;
  setSharedPlanInfo: (newSharedPlan: TSharedPlanInfo) => void;
  isRecipient: boolean;
}

const SharedPlanContext = createContext<SharedPlanContextType | undefined>(
  undefined
);

export const SharedPlanProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [sharedPlanInfo, setSharedPlanInfoState] = useState<TSharedPlanInfo>(
    () => {
      const savedSharedPlan = localStorage.getItem("sharedPlanInfo");
      return savedSharedPlan ? JSON.parse(savedSharedPlan) : {};
    }
  );

  const isRecipient = sharedPlanInfo.recipientId === user?.id;

  useEffect(() => {
    localStorage.setItem("sharedPlanInfo", JSON.stringify(sharedPlanInfo))
  }, [sharedPlanInfo])

  const setSharedPlanInfo = useCallback((newSharedPlan: TSharedPlanInfo) => {
    setSharedPlanInfoState((prev) => {
      const updatedSharedPlan = { ...prev, ...newSharedPlan }
      localStorage.setItem('sharedPlanInfo', JSON.stringify(updatedSharedPlan))
      return updatedSharedPlan
    });
  }, [])

  return (
    <SharedPlanContext.Provider
      value={{ sharedPlanInfo, setSharedPlanInfo, isRecipient }}
    >
      {children}
    </SharedPlanContext.Provider>
  );
};

export const useRecipientPlan = () => {
  const context = useContext(SharedPlanContext);
  if (!context) {
    throw new Error("useSharedPlan must be used within SharedPlanProvider");
  }
  return context;
};
