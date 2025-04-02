export type WorkoutPlansType = {
  id: number;
  creator_id: string;
  plan_name: string;
  difficulty_level: string | null;
  description: string | null;
  created_at: string | null;
  is_public: boolean;
  image_content: string | null;
};

export type WorkoutDayType = {
  id: number;
  week_number: number;
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
  creator: {
    full_name: string,
    username: string,
    avatar_url: string | null;
  };
  workoutdays: WorkoutDayType[] | null;
  created_at: string | null;
  is_public: boolean;
  image_content: string | null;
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
  image_content: string | null;
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

export type RecivedPlanType = {
  workoutplan_id: number;
  sender_id: string; // creator_id
  user_id: string; // This userId is shared with whom
  workoutplan: {
    plan_name: string;
    image_content: string | null;
  };
  profiles: {
    full_name: string;
    username: string;
    email: string;
    avatar_url: string | null;
  };
  created_at: string;
};

export type SendedPlanType = {
  workoutplan_id: number;
  sender_id: string; // creator_id
  user_id: string; // This userId is shared with whom
  workoutplan: {
    plan_name: string;
    image_content: string | null;
  };
  created_at: string;
};

export type RecipientAchivementType = {
  plan_id: number;
  day_id: number;
  exercise_id: number;
  recipient_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
    full_name: string;
  }
  set_id: number;
  achive_repetition: string;
  achive_weight: string;
  is_complete: boolean;
  is_skip: boolean;
  created_at: string;
};

export type GetReviewStarType = {
  id: number;
  rating: number;
  reviewed_user: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
  };
  review: string | null;
}

export type searchResultsType = {
  id: number | string;
  plan_name?: string;
  description?: string;
  is_public?: boolean;
  difficulty_level?: string;
  creator_id?: string;
  created_at?: string;
  avatar_url?: string;
  bio?: string;
  email?: string;
  full_name?: string;
  username?: string;
}

export type CommentType = {
  created_at: string;
  id: number;
  parent_comment_id: number | null;
  plan_id: number;
  text: string;
  user_id: string;
}

export type BuildCommentTreeType = CommentType & {
  replies: BuildCommentTreeType[];
};

export type TUserDetailsOfSharedPlan = {
  workoutplan_id: number;
  sender_id: string; // creator_id
  user_id: {
    id: string; // recipient_id
    full_name: string;
    username: string;
    email: string;
    avatar_url: string | null;
  };
  created_at: string;
}

export type SmallWorkoutType = {
  id: number;
  creator_id: string;
  image_content: string | null;
  creator: {
    full_name: string;
    username: string;
    avatar_url: string | null;
  };
  workout_name: string;
  difficulty_level: string;
  is_public: boolean;
  created_at: string;
}

export type SmallExercisesType = {
  id: string;
  plan_id: number;
  exercise_name: string;
  target_muscle: string | null;
  how_to_do: string;
  rest: number;
  video_content: string | null;
  created_at: string;
};