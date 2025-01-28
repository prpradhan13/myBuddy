import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import toast from "react-hot-toast";
import {
  ExercisesFormType,
  ExerciseWithSetsType,
  SetsFormType,
  WorkoutDayWithExerciseType,
} from "../../types/workoutPlans";
import { useNavigate } from "react-router-dom";

export const useGetExercises = (exerciseId: number) => {
  return useQuery<ExerciseWithSetsType>({
    queryKey: [`exercise_${exerciseId}`],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercise_with_sets")
        .select("*")
        .eq("exercise_id", exerciseId)
        .single();

      if (error) {
        console.log(error.message || "Error fetching exercises");
      }

      return data || {};
    },
    enabled: !!exerciseId,
  });
};

export const useCreateExerciseSets = (exerciseId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ formData }: { formData: SetsFormType[] }) => {
      const { data: exerciseSetsData, error } = await supabase
        .from("exercise_set")
        .insert(formData)
        .select("id");

      if (error) {
        toast.error(error.message);
        return;
      }

      const exerciseWithSets = exerciseSetsData.map((s) => ({
        exercise_id: exerciseId,
        set_id: s.id,
      }));

      const { error: joinError } = await supabase
        .from("exercise_exercise_set")
        .insert(exerciseWithSets);

      if (joinError) {
        toast.error(joinError.message || "Error while joining");
        return;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: `exercise_${exerciseId}` });
      toast.success("New Sets Created");
      navigate(-1);
    },
  });
};

export const useAddExercises = (workoutdayId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ formData }: { formData: ExercisesFormType[] }) => {
      const finalData = formData.map((item) => ({
        exercise_name: item.exercise_name,
        target_muscle: item.target_muscle,
        description: item.exercise_description,
        rest: item.rest
      }));

      const { data, error } = await supabase
        .from("exercise")
        .insert(finalData)
        .select("id");

      if (error) {
        throw new Error(error.message);
      }

      const workoutdayExercise = data?.map((item) => ({
        workoutday_id: workoutdayId,
        exercise_id: item.id,
      }));

      const { error: joinError } = await supabase
        .from("workoutday_exercise")
        .insert(workoutdayExercise);

      if (joinError) {
        throw new Error(joinError.message);
      }

      return data || [];
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [`workoutDay_${workoutdayId}`],
        (oldData: WorkoutDayWithExerciseType | undefined) => {
          if (!oldData) return undefined;

          // Update the specific day in the list
          const updatedDays = oldData.dayexercises?.map((day) =>
            day.id === workoutdayId ? { ...day, ...data } : day
          );

          return {
            ...oldData,
            workoutdays: updatedDays,
          };
        }
      );

      toast.success("Update Success");
      navigate(-1);
    },
  });
};
