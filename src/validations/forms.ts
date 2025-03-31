import { z } from "zod";

export const createPlanSchema = z.object({
  plan_name: z
    .string()
    .min(3, "Workout Name must be at least 3 characters")
    .trim(),
  difficulty_level: z.string().min(1, "Please select a difficulty level"),
  description: z
    .string()
    .optional()
    .transform((val) => (typeof val === "string" ? val.trim() : val)),
  weeks: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(1, "Weeks must be at least 1")
      .max(6, "It can not be more than 6 weeks")
  ),
});

export type TCreateWorkout = z.infer<typeof createPlanSchema>;

export const createWorkoutDayschema = z.object({
  workout_name: z
    .string()
    .min(3, "Workout Name must be at least 3 characters")
    .trim(),
  difficulty_level: z
    .string()
    .optional()
    .transform((val) => (typeof val === "string" ? val.trim() : val)),
  description: z
    .string()
    .optional()
    .transform((val) => (typeof val === "string" ? val.trim() : val)),
});

export type TCreateWorkoutDay = z.infer<typeof createWorkoutDayschema>;

export const exerciseSchema = z.object({
  exercise_name: z
    .string()
    .min(3, "Exercise Name must be at least 3 characters")
    .trim(),
  target_muscle: z.string().min(1, "Please select a target muscle"),
  exercise_description: z
    .string()
    .optional()
    .transform((val) => (typeof val === "string" ? val.trim() : val)),
  rest: z
    .string()
    .min(2, "Add some rest time")
    .trim()
});
export type TExerciseForm = z.infer<typeof exerciseSchema>;

export const setSchema = z.object({
  target_repetitions: z.string().nonempty("Repetitions are required.").trim(),
  target_weight: z.string().nonempty("Weight is required.").trim(),
});

export type TSetSchema = z.infer<typeof setSchema>;

export const achiveSchema = z.object({
  achive_repetitions: z.string().nonempty("Repetitions are required.").trim(),
  achive_weight: z.string().nonempty("Weight is required.").trim(),
});

export type TAchiveSchema = z.infer<typeof achiveSchema>;

export const updateDayDetails = z.object({
  workout_name: z
    .string()
    .min(3, "Workout Name must be at least 3 characters")
    .trim(),
  difficulty_level: z.string().min(1, "Please select a difficulty level"),
  description: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (typeof val === "string" ? val.trim() : val)),
});

export type TUpdateDayDetails = z.infer<typeof updateDayDetails>;

export const recipientAchiveForm = z.object({
  achive_repetition: z.string().nonempty().trim(),
  achive_weight: z.string().nonempty().trim(),
});

export type TRecipientAchiveForm = z.infer<typeof recipientAchiveForm>;

export const reviewForm = z.object({
  review: z
    .string()
    .min(3, { message: "Review cannot be empty" })
    .max(200, { message: "Review maximum 200 characters" })
    .optional()
    .transform((val) => (typeof val === "string" ? val.trim() : val)),
});

export type TReviewForm = z.infer<typeof reviewForm>;

export const editPlanDetails = z.object({
  plan_name: z
    .string()
    .min(3, "Workout Name must be at least 3 characters")
    .trim(),
  difficulty_level: z.string().min(1, "Please select a difficulty level"),
  description: z
    .string()
    .optional()
    .transform((val) => (typeof val === "string" ? val.trim() : val)),
});

export type TEditPlanDetails = z.infer<typeof editPlanDetails>;

export const editExerciseDetails = z.object({
  exercise_name: z
    .string()
    .min(3, "Workout Name must be at least 3 characters")
    .trim(),
  description: z
    .string()
    .optional()
    .transform((val) => (typeof val === "string" ? val.trim() : val)),
  rest: z.string(),
  target_muscle: z.string().min(1, "Please select a target muscle"),
});

export type TEditExerciseDetails = z.infer<typeof editExerciseDetails>;
