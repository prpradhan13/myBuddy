import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase"
import toast from "react-hot-toast"
import { WorkoutDayWithExerciseType } from "../../types/workoutPlans"

export const useGetWorkoutDay = (workoutDayId: number) => {
    return useQuery<WorkoutDayWithExerciseType>({
        queryKey: [`workoutDay_${workoutDayId}`],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("workoutday_with_exercises")
                .select("*")
                .eq("workoutday_id", workoutDayId)
                .single()

            if (error) {
                toast.error(error.message || "Can not find workout day with exercise id")
            }

            return data || {};
        },
        enabled: !!workoutDayId
    })
}