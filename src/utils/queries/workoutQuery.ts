import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase"
import toast from "react-hot-toast"
import { WorkoutPlansType, WorkoutPlanWithDaysType } from "../../types/workoutPlans"

export const useGetUserWorkoutPlans = (userId?: string) => {
    return useQuery<WorkoutPlansType[]>({
        queryKey: [`workoutPlans_${userId}`],
        queryFn: async () => {
            const { data, error} = await supabase
                .from("workoutplan")
                .select("*")
                .eq("creator_id", userId)
            
            if (error) {
                toast.error(error.message || "Workout plans could not be find")
                throw new Error(error.message)
            }

            return data || []
        }
    })
}

export const useGetPlanWithDays = (workoutPlanId: number) => {
    return useQuery<WorkoutPlanWithDaysType>({
        queryKey: [`workoutplan_days_${workoutPlanId}`],
        queryFn: async () => {

            const { data, error} = await supabase
                .from("workoutplan_with_days")
                .select("*")
                .eq("workoutplan_id", workoutPlanId)
                .single();
            
            if (error) {
                toast.error(error.message || "Workout plans could not be find")
            }

            return data || []
        },
    })
}

// const { plan_name, description, difficulty_level, weeks, creator_id } = await req.json();

// const supabase = createClient(
//   Deno.env.get("SUPABASE_URL")!,
//   Deno.env.get("SUPABASE_ANON_KEY")!
// );

// // Step 1: Insert into workoutplan
// const { data: workoutPlan, error } = await supabase
//   .from("workoutplan")
//   .insert({ plan_name, description, difficulty_level, creator_id })
//   .select("id")
//   .single();

// if (error) return new Response(JSON.stringify({ error: "Failed to create plan" }), { status: 400 });

// // Step 2: Create workoutday entries
// const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// const totalDays = weeks * 7;
// const workoutDays = Array.from({ length: totalDays }, (_, index) => ({
//   day_name: daysOfWeek[index % 7],
//   is_restday: false,
// }));

// const { data: workoutDayIds, error: daysError } = await supabase
//   .from("workoutday")
//   .insert(workoutDays)
//   .select("id");

// if (daysError) return new Response(JSON.stringify({ error: "Failed to create days" }), { status: 400 });

// // Step 3: Link workoutplan and workoutday
// const workoutPlanWorkoutDays = workoutDayIds.map((day) => ({
//   workoutplan_id: workoutPlan.id,
//   workoutday_id: day.id,
// }));

// const { error: joinError } = await supabase
//   .from("workoutplan_workoutday")
//   .insert(workoutPlanWorkoutDays);