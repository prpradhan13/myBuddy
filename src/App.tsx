import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Loader from "./components/loaders/Loader";

const NotAuthLandingPage = lazy(() => import("./pages/authPage/NotAuthLandingPage"))
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
const AllWorkoutPlan = lazy(() => import("./pages/AllWorkoutPlan"));
const SharedPlanDetails = lazy(() => import("./pages/SharedPlanDetails"));
const RecipientAchivementsDetails = lazy(() => import("./pages/RecipientAchivements"));
const PublicPlanPage = lazy(() => import("./pages/PublicPlanPage"));
const ProfilePage = lazy(() => import("./pages/authPage/ProfilePage"));
const CommentsPage = lazy(() => import("./pages/CommentPage"));
const ExerciseVisuals = lazy(() => import("./pages/ExerciseVisuals"));
const UserPrivatePlan = lazy(() => import("./pages/UserPrivatePlan"));
const UserPublicPlanPage = lazy(() => import("./pages/UserPublicPlanPage"));
// const SmallWorkoutPage = lazy(() => import("./pages/SmallWorkoutPage"));
// const SmallWorkoutDetailsPage = lazy(() => import("./pages/SmallWorkoutDetailsPage"));
const ForgotPasswordPage = lazy(() => import("./pages/authPage/ForgotPassword"));
const UpdatePasswordPage = lazy(() => import("./pages/authPage/UpdatePasswordPage"));

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />

        <Suspense fallback={<Loader />}>
          <Routes>
            <Route element={<RegisterLayout />}>
              <Route path="/notAuthLandingPage" element={<NotAuthLandingPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/signUp" element={<SignUpPage />} />
              <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
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
              <Route path="/profilePage/:profileId" element={<ProfilePage />}/>
              <Route path="/comments/:planId" element={<CommentsPage />}/>
              <Route path="/exerciseVisuals/:exerciseId" element={<ExerciseVisuals />}/>
              <Route path="/userPublicPlan/:userId" element={<UserPublicPlanPage />}/>
              <Route path="/userPrivatePlan/:userId" element={<UserPrivatePlan />}/>
              {/* <Route path="/smallWorkouts" element={<SmallWorkoutPage />}/>
              <Route path="/smallWorkoutDetailsPage/:planId" element={<SmallWorkoutDetailsPage />}/> */}
              <Route path="/updatePassword" element={<UpdatePasswordPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
