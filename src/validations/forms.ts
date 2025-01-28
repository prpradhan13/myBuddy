import { z } from "zod";

export const createPlanSchema = z.object({
  plan_name: z.string().min(3, "Workout Name must be at least 3 characters"),
  difficulty_level: z.string(),
  description: z.string().nullable(),
  weeks: z.number().min(1, "Weeks must be at least 1"),
});

export type TCreateWorkout = z.infer<typeof createPlanSchema>;

export const createWorkoutDayschema = z.object({
  workout_name: z.string().min(3, "Workout Name must be at least 3 characters"),
  difficulty_level: z.string().nullable(),
  description: z.string().nullable(),
});

export type TCreateWorkoutDay = z.infer<typeof createWorkoutDayschema>;

export const exerciseSchema = z.object({
  exercise_name: z
    .string()
    .min(3, "Exercise Name must be at least 3 characters"),
  target_muscle: z.string().nullable(),
  exercise_description: z.string().nullable(),
  rest: z.string().nullable(),
});
export type TExerciseForm = z.infer<typeof exerciseSchema>;

export const setSchema = z.object({
  target_repetitions: z.string().nonempty("Repetitions are required."),
  target_weight: z.string().nonempty("Weight is required."),
});

export type TSetSchema = z.infer<typeof setSchema>;

export const achiveSchema = z.object({
  achive_repetitions: z.string().nonempty("Repetitions are required."),
  achive_weight: z.string().nonempty("Weight is required."),
});

export type TAchiveSchema = z.infer<typeof achiveSchema>;
