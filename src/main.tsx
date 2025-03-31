import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./context/AuthProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WorkoutPlanProvider } from "./context/WorkoutPlanProvider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
        <WorkoutPlanProvider>
          <App />
        </WorkoutPlanProvider>
    </QueryClientProvider>
  </AuthProvider>
);
