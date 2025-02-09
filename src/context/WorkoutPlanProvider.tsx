import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";

interface TPlanInfo {
  planId?: number;
  creatorId?: string;
}

interface WorkoutPlanContextType {
  planInfo: TPlanInfo;
  setPlanInfo: (newPlan: TPlanInfo) => void;
  creatorOfPlan: boolean;
}

const WorkoutPlanContext = createContext<WorkoutPlanContextType | undefined>(
  undefined
);

export const WorkoutPlanProvider = ({ children }: { children: ReactNode }) => {
  const [planInfo, setPlanInfoState] = useState<TPlanInfo>(() => {
    const savedPlan = localStorage.getItem("planInfo");
    return savedPlan ? JSON.parse(savedPlan) : {};
  });

  const setPlanInfo = (newPlan: TPlanInfo) => {
    localStorage.setItem("planInfo", JSON.stringify(newPlan));
    setPlanInfoState(newPlan);
  };

  const { user } = useAuth();

  const creatorOfPlan = planInfo.creatorId === user?.id;

  return (
    <WorkoutPlanContext.Provider
      value={{ planInfo, setPlanInfo, creatorOfPlan }}
    >
      {children}
    </WorkoutPlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(WorkoutPlanContext);
  if (!context) {
    throw new Error("usePlan must be used within WorkoutPlanProvider");
  }
  return context;
};
