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