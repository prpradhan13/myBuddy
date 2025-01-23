export type WorkoutPlansType = {
    id: number;
    creator_id: string;
    plan_name: string;
    difficulty_level: string;
    description: string;
}

export type WorkoutDayType = {
    id: number;
    day_name: string | null;
    description: string | null;
    difficulty_level: string | null;
    workout_name: string | null;
    is_restday: boolean;
}

export type WorkoutPlanWithDaysType = {
    workoutplan_id: number;
    plan_name: string;
    plan_description: string | null;
    plan_difficulty: string;
    creator_id: string;
    workoutdays: WorkoutDayType[] | null;
}

export type ExerciseType = {
    id: number;
    exercise_name: string;
    description: string | null;
    target_muscle: string | null;
    rest: string | null;
}

export type WorkoutDayWithExerciseType = {
    workoutday_id: number;
    day_name: string;
    workout_name: string;
    day_difficulty: string | null;
    day_description: string | null;
    dayexercises: ExerciseType[] | null;
}