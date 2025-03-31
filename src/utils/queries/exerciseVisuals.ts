import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { ExerciseVisualsType } from "@/types/exerciseVisualsType";

export const useGetExerciseVisuals = (exerciseId: number) => {
  return useQuery<ExerciseVisualsType>({
    queryKey: ["exerciseVisual", exerciseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercise_visuals")
        .select("*")
        .eq("exercise_id", exerciseId)
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
    enabled: !!exerciseId,
  });
};

export const useHasExerciseVisual = (exerciseId: number) => {
  return useQuery<boolean>({
    queryKey: ["hasExerciseVisual", exerciseId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("exercise_visuals")
        .select("*", { count: "exact", head: true })
        .eq("exercise_id", exerciseId);

      if (error) throw new Error(error.message);

      return (count ?? 0) > 0;
    },
    enabled: !!exerciseId,
  });
};

export const useAddExerciseVisual = () => {
  return useMutation({
    mutationFn: async ({
      exerciseId,
      videoUrl,
    }: {
      exerciseId: number;
      videoUrl: string;
    }) => {
      const { error } = await supabase
        .from("exercise_visuals")
        .insert({ exercise_id: exerciseId, content_url: videoUrl });

      if (error) throw new Error(error.message);
    },
  });
};

export const useAddExerciseImage = () => {
  return useMutation({
    mutationFn: async ({
      exerciseId,
      imageUrl,
    }: {
      exerciseId: number;
      imageUrl: string;
    }) => {
      const { error } = await supabase
        .from("exercise")
        .update({ image_content: imageUrl })
        .eq("id", exerciseId);

        if (error) throw new Error(error.message);
    },
  });
};
