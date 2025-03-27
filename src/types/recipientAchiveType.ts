export type RecipentAchiveDataType = {
    id: number;
    set_id: number;
    setDetails: {
      target_repetitions: string | null;
      target_weight: string | null;
    },
    achive_repetition: string;
    achive_weight: string;
    is_complete: boolean;
    is_skip: boolean;
    created_at: string;
    recipient_id: string;
    recipient: {
      full_name: string;
      username: string;
      avatar_url: string | null;
    };
    day_id: number;
    dayDetails: {
      week_number: number;
      day_name: string;
      workout_name: string;
    };
    exercise_id: number;
    exerciseDetails: {
      exercise_name: string;
    };
    plan_id: number;
    planDetails: {
      plan_name: string;
    }
}

export type TGroupedDataValue = {
    week_number: number;
    day_name: string;
    workout_name: string;
    plan_name: string;
    exercises: RecipentAchiveDataType[];
}