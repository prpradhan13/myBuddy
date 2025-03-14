import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import Loader from "../components/loaders/Loader";

interface AuthContextType {
    session: Session | null;
    user: User | null;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: {children: ReactNode}){
    const [session, setSession] = useState<Session | null>(null);
    const [isReady, setIsReady] = useState(false)



    useEffect(() => {
        supabase.auth.getSession().then(({ data: {session} }) => {
            setSession(session);
            setIsReady(true);
        })

        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })
    }, []);

    if (!isReady) return <Loader />;

    return (
        <AuthContext.Provider value={{ session, user: session?.user ?? null, isAuthenticated: !!session?.user }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};