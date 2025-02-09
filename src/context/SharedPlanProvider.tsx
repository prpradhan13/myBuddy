import {
  ReactNode,
  useContext,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useAuth } from "./AuthProvider";

interface TSharedPlanInfo {
  recipientId: string;
}

interface SharedPlanContextType {
  sharedPlanInfo: TSharedPlanInfo;
  setSharedPlanInfo: Dispatch<SetStateAction<TSharedPlanInfo>>;
  isRecipient: boolean;
}

const SharedPlanContext = createContext<SharedPlanContextType | undefined>(
  undefined
);

export const SharedPlanProvider = ({ children }: { children: ReactNode }) => {
  const [sharedPlanInfo, setSharedPlanInfo] = useState<TSharedPlanInfo>({
    recipientId: "",
  });
  const { user } = useAuth();

  const isRecipient = sharedPlanInfo.recipientId === user?.id;
  
  return (
    <SharedPlanContext.Provider value={{ sharedPlanInfo, setSharedPlanInfo, isRecipient }}>
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
