export type WorkoutPlansType = {
  id: number;
  creator_id: string;
  plan_name: string;
  difficulty_level: string | null;
  description: string | null;
  created_at: string | null;
};

export type WorkoutDayType = {
  id: number;
  day_name: string | null;
  description: string | null;
  difficulty_level: string | null;
  workout_name: string | null;
  is_restday: boolean;
};

export type WorkoutPlanWithDaysType = {
  workoutplan_id: number;
  plan_name: string;
  plan_description: string | null;
  plan_difficulty: string;
  creator_id: string;
  workoutdays: WorkoutDayType[] | null;
  created_at: string | null;
};

export type ExerciseType = {
  id: number;
  exercise_name: string;
  description: string | null;
  target_muscle: string | null;
  rest: string | null;
};

export type WorkoutDayWithExerciseType = {
  workoutday_id: number;
  day_name: string;
  workout_name: string;
  day_difficulty: string | null;
  day_description: string | null;
  dayexercises: ExerciseType[] | null;
};

export type SetType = {
  id: number;
  target_repetitions: string | null;
  achive_repetitions: string | null;
  is_skip: boolean;
  target_weight: string | null;
  achive_weight: string | null;
  is_completed: boolean;
  achive_date_time: string | null;
};

export type ExerciseWithSetsType = {
  exercise_id: number;
  exercise_name: string;
  exercise_description: string | null;
  target_muscle: string | null;
  rest: string | null;
  exercise_sets: SetType[] | null;
};

export type CreatePlanType = {
  plan_name: string;
  description: string | null;
  difficulty_level: string | null;
  weeks: number;
};

export type CreateWorkoutDayType = {
  workout_name: string;
  difficulty_level: string | null;
  description: string | null;
};

export type AllWorkoutDataType = {
  workout_name: string;
  difficulty_level: string;
  description: string;
};

export type ExercisesFormType = {
  exercise_name: string;
  target_muscle: string | null;
  exercise_description: string | null;
  rest: string | null;
};

export type FinalWorkoutFormType = {
  workout_name: string;
  difficulty_level: string | null;
  description: string | null;
  exercises: ExercisesFormType[];
};

export type SetsFormType = {
  target_repetitions: string | null;
  target_weight: string | null;
};

export type SendedPlanType = {
  workoutplan_id: number;
  sender_id: string; // creator_id
  user_id: string; // This userId is shared with whom
  workoutplan: {
    plan_name: string;
  };
  profiles: {
    full_name: string;
    username: string;
    email: string;
    avatar_url: string | null;
  };
  created_at: string;
};
