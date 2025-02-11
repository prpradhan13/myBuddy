import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Loader from "./components/loaders/Loader";

const RegisterLayout = lazy(() => import("./layouts/RegisterLayout"));
const RegisterPage = lazy(() => import("./pages/authPage/RegisterPage"));
const SignUpPage = lazy(() => import("./pages/authPage/SignUpPage"));
const PrivateRoute = lazy(
  () => import("./components/authentication/PrivateRoute")
);
const HomePage = lazy(() => import("./pages/HomePage"));
const WorkOutPlanDetails = lazy(() => import("./pages/WorkoutPlanDetails"));
const WorkOutDayDetails = lazy(() => import("./pages/WorkoutDayDetails"));
const ExercisePage = lazy(() => import("./pages/ExercisePage"));
const EditProfilePage = lazy(() => import("./pages/EditProfilePage"));
const AllWorkoutPlan = lazy(() => import("./pages/AllWorkoutPlan"));
const SharedPlanDetails = lazy(() => import("./pages/SharedPlanDetails"));
const RecipientAchivementsDetails = lazy(() => import("./pages/RecipientAchivements"));
const PublicPlanPage = lazy(() => import("./pages/PublicPlanPage"));

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />

        <Suspense fallback={<Loader />}>
          <Routes>
            <Route element={<RegisterLayout />}>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/signUp" element={<SignUpPage />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/editProfile" element={<EditProfilePage />} />
              <Route
                path="/workoutPlanDetails/:planId"
                element={<WorkOutPlanDetails />}
              />
              <Route
                path="/workoutDayDetails/:dayId"
                element={<WorkOutDayDetails />}
              />
              <Route
                path="/exerciseDetails/:exerciseId/:dayId"
                element={<ExercisePage />}
              />
              <Route path="/allWorkoutPlans" element={<AllWorkoutPlan />} />
              <Route path="/sharedplandetails" element={<SharedPlanDetails />}/>
              <Route path="/recipientAchivementsDetails/:setId" element={<RecipientAchivementsDetails />}/>
              <Route path="/publicplan" element={<PublicPlanPage />}/>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
