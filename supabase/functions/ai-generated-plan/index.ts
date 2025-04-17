/* eslint-disable @typescript-eslint/no-explicit-any */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Function started");
const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'));

function validateWorkoutPlan(plan: any) {
  const validatedPlan = {
    schedule: plan.schedule,
    exercises: plan.exercises.map((exercise: any) => ({
      day: exercise.day,
      routines: exercise.routines.map((routine: any) => ({
        name: routine.name,
        sets:
          typeof routine.sets === "number"
            ? routine.sets
            : parseInt(routine.sets) || 1,
        reps:
          typeof routine.reps === "number"
            ? routine.reps
            : parseInt(routine.reps) || 10,
      })),
    })),
  };
  return validatedPlan;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      },
      status: 200,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const payload = await req.json();
    const {
      user_id,
      age,
      injuries,
      fitness_goal,
      workout_days,
      fitness_level,
    } = payload;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        responseMimeType: "application/json",
      },
    });

    const workoutPrompt = `You are an experienced fitness coach creating a personalized workout plan based on:
    Age: ${age}
    Injuries or limitations: ${injuries}
    Available days for workout: ${workout_days}
    Fitness goal: ${fitness_goal}
    Fitness level: ${fitness_level}
    
    As a professional coach:
    - Consider muscle group splits to avoid overtraining the same muscles on consecutive days
    - Design exercises that match the fitness level and account for any injuries
    - Structure the workouts to specifically target the user's fitness goal
    
    CRITICAL SCHEMA INSTRUCTIONS:
    - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
    - "sets" and "reps" MUST ALWAYS be NUMBERS, never strings
    - For example: "sets": 3, "reps": 10
    - Do NOT use text like "reps": "As many as possible" or "reps": "To failure"
    - Instead use specific numbers like "reps": 12 or "reps": 15
    - For cardio, use "sets": 1, "reps": 1 or another appropriate number
    - NEVER include strings for numerical fields
    - NEVER add extra fields not shown in the example below
    
    Return a JSON object with this EXACT structure:
    {
      "schedule": ["Monday", "Wednesday", "Friday"],
      "exercises": [
        {
          "day": "Monday",
          "routines": [
            {
              "name": "Exercise Name",
              "sets": 3,
              "reps": 10
            }
          ]
        }
      ]
    }
    
    DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;

    const workoutResult = await model.generateContent(workoutPrompt);
    const workoutPlanText = workoutResult.response.text();

    let workoutPlan = JSON.parse(workoutPlanText);
    workoutPlan = validateWorkoutPlan(workoutPlan);

    const { error: insertError } = await supabaseClient
      .from("ai_generated_plans")
      .insert({
        creator_id: user_id,
        plan_name: `${fitness_goal} Plan`,
        workoutplan: workoutPlan,
      });

    if (insertError) {
      console.error("Error inserting into Supabase:", insertError);
      return new Response("Failed to save workout plan", { status: 500 });
    }

    return new Response(JSON.stringify(workoutPlan), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("Error creating the plan!", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
