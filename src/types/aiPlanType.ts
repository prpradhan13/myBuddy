export type Routine = {
  name: string;
  reps: number;
  sets: number;
};

export type WorkoutDay = {
  day: string;
  routines: Routine[];
};

export type WorkoutPlan = {
  schedule: string[];
  exercises: WorkoutDay[];
};

export type PlanCardType = {
  id: number;
  created_at: string;
  creator_id: string;
  plan_name: string;
}

export type AiGeneratedPlansType = PlanCardType & {
  workoutplan: WorkoutPlan;
};
