import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase"
import toast from "react-hot-toast"
import { WorkoutPlansType } from "../../types/workoutPlans"

export const useGetUserWorkoutPlans = (userId?: string) => {
    return useQuery<WorkoutPlansType[]>({
        queryKey: [`workoutPlans_${userId}`],
        queryFn: async () => {
            const { data, error} = await supabase
                .from("workoutplan")
                .select("*")
                .eq("creator_id", userId)
            
            if (error) {
                toast.error(error.message || "Workout plans could not be find")
                throw new Error(error.message)
            }

            return data || []
        }
    })
}

export const useGetWorkoutPlan = (workoutPlanId?: number) => {
    return useQuery<WorkoutPlansType[]>({
        queryKey: [`workoutPlans_${workoutPlanId}`],
        queryFn: async () => {
            const { data, error} = await supabase
                .from("workoutplan")
                .select("*")
                .eq("id", workoutPlanId)
            
            if (error) {
                toast.error(error.message || "Workout plans could not be find")
            }

            return data || []
        }
    })
}

export const useGetPlanWithDays = (workoutPlanId: number) => {
    return useQuery({
        queryKey: [`workoutplan_days_${workoutPlanId}`],
        queryFn: async () => {
            const { data, error} = await supabase
                .from("workoutplan_with_days")
                .select("*")
                .eq("workoutplan_id", workoutPlanId)
                .single();
            
            if (error) {
                toast.error(error.message || "Workout plans could not be find")
            }

            return data || []
        }
    })
}