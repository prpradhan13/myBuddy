export type WorkoutPlansType = {
    id: number;
    creator_id: string;
    plan_name: string;
    difficulty_level: string | null;
    description: string | null;
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

export type SetType = {
    id: number;
    target_repetitions: string | null;
    achive_repetitions: string | null;
    is_skip: boolean;
    target_weight: string | null;
    achive_weight: string | null;
    is_completed: boolean;
}

export type ExerciseWithSetsType = {
    exercise_id: number;
    exercise_name: string;
    exercise_description: string | null;
    target_muscle: string | null;
    rest: string | null;
    exercise_sets: SetType[] | null;
}

export type CreatePlanType = {
    plan_name: string;
    description: string | null;
    difficulty_level: string | null;
    weeks: number;
}

export type CreateWorkoutDayType = {
    workout_name: string;
    difficulty_level: string | null;
    description: string | null;
}