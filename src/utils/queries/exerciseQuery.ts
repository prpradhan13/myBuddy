import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import toast from "react-hot-toast";
import { ExerciseWithSetsType } from "../../types/workoutPlans";

export const useGetExercises = (exerciseId: number) => {
    return useQuery<ExerciseWithSetsType>({
        queryKey: [`exercise_${exerciseId}`],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("exercise_with_sets")
                .select("*")
                .eq("exercise_id", exerciseId)
                .single()
            
            if (error) {
                toast.error(error.message || "Error fetching exercises")
            }

            return data || {};
        },
        enabled: !!exerciseId
    })
};