import { supabase } from "./supabase";

export const tokenProvider = async () => {
    try {
        const { data, error } = await supabase.functions.invoke('stream-token');
        if (error) throw new Error(error.message);
        
        // console.log("Stream token received:", data.token);

        if (!data?.token) {
            throw new Error("Stream token is missing!");
        }

        return data.token;
    } catch (err) {
        console.error("Token provider error:", err);
        throw err;
    }
}