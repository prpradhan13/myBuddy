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
  description: z.string().nullable()
});

export type TCreateWorkoutDay = z.infer<typeof createWorkoutDayschema>;
