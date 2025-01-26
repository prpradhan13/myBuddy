import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import toast from "react-hot-toast";
import { ExerciseWithSetsType, SetsFormType } from "../../types/workoutPlans";
import { useNavigate } from "react-router-dom";

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
                console.log(error.message || "Error fetching exercises");
            }

            return data || {};
        },
        enabled: !!exerciseId
    })
};

export const useCreateExerciseSets = (exerciseId: number) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async ({ formData }: {formData: SetsFormType[]}) => {
            const { data: exerciseSetsData, error } = await supabase
                .from("exercise_set")
                .insert(formData)
                .select("id")
            
            if (error) {
                toast.error(error.message)
                return;
            }

            const exerciseWithSets = exerciseSetsData.map((s) => ({
                exercise_id: exerciseId,
                set_id: s.id
            }))

            const { error: joinError } = await supabase
                .from("exercise_exercise_set")
                .insert(exerciseWithSets);

                if (joinError) {
                    toast.error(joinError.message || "Error while joining");
                    return ;
                  }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: `exercise_${exerciseId}` });
            toast.success("New Sets Created");
            navigate(-1);
        }
    })
}