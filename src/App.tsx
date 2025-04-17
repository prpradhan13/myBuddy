import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loader from "./components/loaders/Loader";
import PrivatePlanRoute from "./components/authentication/PrivatePlanRoute";
import NotFoundPage from "./components/extra/NotFoundPage";

const NotAuthLandingPage = lazy(
  () => import("./pages/authPage/NotAuthLandingPage")
);
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
const ProfilePage = lazy(() => import("./pages/authPage/ProfilePage"));
const CommentsPage = lazy(() => import("./pages/CommentPage"));
const ExerciseVisuals = lazy(() => import("./pages/ExerciseVisuals"));
const UserPrivatePlan = lazy(() => import("./pages/UserPrivatePlan"));
const UserPublicPlanPage = lazy(() => import("./pages/UserPublicPlanPage"));
// const SmallWorkoutPage = lazy(() => import("./pages/SmallWorkoutPage"));
// const SmallWorkoutDetailsPage = lazy(() => import("./pages/SmallWorkoutDetailsPage"));
const ForgotPasswordPage = lazy(
  () => import("./pages/authPage/ForgotPassword")
);
const UpdatePasswordPage = lazy(
  () => import("./pages/authPage/UpdatePasswordPage")
);
const RecipentAchivementDetailsPage = lazy(
  () => import("./pages/RecipentAchivementDetailsPage")
);
const ChatPage = lazy(() => import("./pages/ChatPage"));
const ChatChannel = lazy(() => import("./pages/ChatChannel"));
const CallWithAi = lazy(() => import("./pages/aiPlan/CallWithAi"));
const AiGeneratedPlanPage = lazy(() => import("./pages/aiPlan/AiGeneratedPlanPage"));
const AiGeneratedPlanDetailsPage = lazy(() => import("./pages/aiPlan/AiPlansDetails"));

const router = createBrowserRouter([
  {
    element: <RegisterLayout />,
    children: [
      { path: "/notAuthLandingPage", element: <NotAuthLandingPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/signUp", element: <SignUpPage /> },
      { path: "/forgotPassword", element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "workoutPlanDetails/:planId", element: <WorkOutPlanDetails /> },
      {
        element: <PrivatePlanRoute />,
        children: [
          { path: "workoutDayDetails/:dayId", element: <WorkOutDayDetails /> },
          { path: "exerciseDetails/:exerciseId", element: <ExercisePage /> },
          { path: "exerciseVisuals/:exerciseId", element: <ExerciseVisuals /> },
        ],
      },
      { path: "allWorkoutPlans", element: <AllWorkoutPlan /> },
      { path: "sharedplandetails", element: <SharedPlanDetails /> },
      { path: "profilePage/:profileId", element: <ProfilePage /> },
      { path: "comments/:planId", element: <CommentsPage /> },
      { path: "userPublicPlan/:userId", element: <UserPublicPlanPage /> },
      { path: "userPrivatePlan/:userId", element: <UserPrivatePlan /> },
      { path: "updatePassword", element: <UpdatePasswordPage /> },
      {
        path: "recipientAchivementsDetails/:recipientId",
        element: <RecipentAchivementDetailsPage />,
      },
      { path: "chatPage", element: <ChatPage /> },
      { path: "chatChannel/:cid", element: <ChatChannel /> },
      { path: "callWithAi", element: <CallWithAi /> },
      { path: "aiGeneratedPlan", element: <AiGeneratedPlanPage /> },
      { path: "aiGeneratedPlan/:id", element: <AiGeneratedPlanDetailsPage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Toaster />
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
