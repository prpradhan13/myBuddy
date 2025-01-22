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
    isrestday: boolean;
}