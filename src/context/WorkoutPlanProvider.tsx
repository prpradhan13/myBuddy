import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";

interface TPlanInfo {
  planId?: number;
  creatorId?: string;
  dayId?: number;
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
  const { user } = useAuth();

  const [planInfo, setPlanInfoState] = useState<TPlanInfo>(() => {
    const savedPlan = localStorage.getItem("planInfo");
    return savedPlan ? JSON.parse(savedPlan) : {};
  });

  const [creatorOfPlan, setCreatorOfPlan] = useState(false);

  useEffect(() => {
    setCreatorOfPlan(planInfo.creatorId === user?.id);
  }, [planInfo.creatorId, user?.id]);

  useEffect(() => {
    localStorage.setItem("planInfo", JSON.stringify(planInfo));
  }, [planInfo]);

  const setPlanInfo = useCallback((newPlan: TPlanInfo) => {
    setPlanInfoState((prevPlan) => {
      const updatedPlan = { ...prevPlan, ...newPlan };
      localStorage.setItem("planInfo", JSON.stringify(updatedPlan));
      return updatedPlan;
    });
  }, []);

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
