import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import toast from "react-hot-toast";
import {
  ExercisesFormType,
  ExerciseType,
  ExerciseWithSetsType,
  SetsFormType,
  WorkoutDayType,
  WorkoutDayWithExerciseType,
} from "../../types/workoutPlans";
import { useNavigate } from "react-router-dom";
import { TAchiveSchema, TEditExerciseDetails } from "@/validations/forms";
import { Dispatch, SetStateAction } from "react";

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
      queryClient.invalidateQueries({ queryKey: [`exercise_${exerciseId}`] });
      toast.success("New Sets Created");
      navigate(-1);
    },
  });
};

export const useAddExercises = (
  workoutdayId: number,
  setOpenAddExerciseForm: Dispatch<SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData }: { formData: ExercisesFormType[] }) => {
      const finalData = formData.map((item) => ({
        exercise_name: item.exercise_name,
        target_muscle: item.target_muscle,
        description: item.exercise_description,
        rest: item.rest,
      }));

      const { data, error } = await supabase
        .from("exercise")
        .insert(finalData)
        .select("*");

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

          const updatedExercises = oldData.dayexercises
            ? [...oldData.dayexercises, ...data]
            : data;

          return {
            ...oldData,
            dayexercises: updatedExercises,
          };
        }
      );

      setOpenAddExerciseForm(false);
      toast.success("Update Success");
    },
  });
};

export const useRemoveSet = (exerciseId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ setId }: { setId: number }) => {
      const { data, error } = await supabase
        .from("exercise_set")
        .delete()
        .eq("id", setId)
        .select("*");

      if (error) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`exercise_${exerciseId}`] });
      toast.success("Exercise set deleted");
      navigate(-1);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to Delete");
    },
  });
};

export const useUpdateAchives = (exerciseId: number, setId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ formData }: { formData: TAchiveSchema }) => {
      const currentDateTime = new Date().toISOString();
      const sendingData = { ...formData, achive_date_time: currentDateTime };

      const { error } = await supabase
        .from("exercise_set")
        .update(sendingData)
        .eq("id", setId)
        .single();

      if (error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`exercise_${exerciseId}`] });
      toast.success("Update Success");
      navigate(-1);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update");
    },
  });
};

export const useDeleteExercise = (exerciseId: number, workoutDayId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("exercise")
        .delete()
        .eq("id", exerciseId);

      if (error) {
        toast.error(error.message || "Failed to delete exercise");
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(
        [`workoutDay_${workoutDayId}`],
        (oldData: WorkoutDayWithExerciseType | undefined) => {
          if (!oldData) return undefined;

          const updatedExercises =
            oldData.dayexercises?.filter(
              (exercise) => exercise.id !== exerciseId
            ) || [];

          return {
            ...oldData,
            dayexercises: updatedExercises,
          };
        }
      );
      toast.success("Delete Success");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete exercise");
    },
  });
};

type CategorizedExercisesType = Record<string, ExerciseType[]>

export const useGetPreviousExercises = (planId: number) => {
  return useQuery({
    queryKey: ["previous_exercises", planId],
    queryFn: async () => {
      if (!planId) return [];

      const { data, error } = await supabase
        .from("workoutplan_with_days")
        .select("workoutdays")
        .eq("workoutplan_id", planId)
        .single();

      if (error) {
        console.log(error.message || "Error fetching exercises");
        return [];
      }

      const workoutDays = data?.workoutdays || [];
      const exerciseIds = workoutDays
        .flatMap((day: WorkoutDayType) => day.id)
        .filter((id: number) => id !== undefined);

      if (exerciseIds.length === 0) return [];

      // Fetch exercises
      const { data: exercises, error: exerciseError } = await supabase
        .from("workoutday_exercise")
        .select("exercise_id, exercise:exercise_id(*)")
        .in("workoutday_id",  exerciseIds);

      if (exerciseError) {
        console.error("Error fetching exercises:", exerciseError);
        return [];
      }

      const extractedExercises: ExerciseType[] = exercises.flatMap((arr) => arr.exercise);

      // Remove duplicate exercises (keep only one per name)
      const uniqueExercises: ExerciseType[] = Array.from(
        new Map(extractedExercises.map((e) => [e.exercise_name, e])).values()
      );

      const categorizedExercises: CategorizedExercisesType = {};

      uniqueExercises.forEach((exercise) => {
        const category = exercise.target_muscle || "Other";
        if (!categorizedExercises[category]) {
          categorizedExercises[category] = [];
        }
        categorizedExercises[category].push(exercise);
      });

      return categorizedExercises;
    },
    enabled: !!planId,
  });
};

export const useUpdateExercise = () => {

  return useMutation({
    mutationFn: async ({ exerciseId, editFormData }: {exerciseId: number, editFormData: TEditExerciseDetails}) => {
      const { data, error } = await supabase
        .from("exercise")
        .update(editFormData)
        .eq("id", exerciseId)

      if (error) throw new Error(error.message);

      return data || {};
    }
  })
}
