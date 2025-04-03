import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../supabase"
import { useAuth } from "@/context/AuthProvider"
import { usePlan } from "@/context/WorkoutPlanProvider";

interface AchiveSetFormType {
    exerciseId: number;
    setId: number,
    achive_repetitions: string | undefined;
    achive_weight: string | undefined;
    
}


export const useCreateAchiveSet = () => {
    const { user } = useAuth();
    const { planInfo } = usePlan();
    const currentUserId = user?.id;
    const planId = planInfo.planId;
    const dayId = planInfo.dayId;
    const queryClient = useQueryClient();

    if (!currentUserId || !planId || !dayId) throw new Error("Current User id not found!");

    return useMutation({
        mutationFn: async ({ formData }: {formData: AchiveSetFormType}) => {
            const { error } = await supabase
                .from("recipient_achive")
                .insert({
                    plan_id: planId,
                    day_id: dayId,
                    exercise_id: formData.exerciseId,
                    recipient_id: currentUserId, // This could only be a creator or recipient.
                    set_id: formData.setId,
                    achive_repetition: formData.achive_repetitions, 
                    achive_weight: formData.achive_weight, 
                });

            if (error) throw new Error(error.message);
            
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recipientAchievementDetails", currentUserId] })
        }
    })
}