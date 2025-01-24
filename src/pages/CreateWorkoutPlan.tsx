import { useForm } from "react-hook-form";
import { createPlanSchema, TCreateWorkout } from "../validations/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoArrowBack } from "react-icons/io5";
import { useCreateWorkoutPlan } from "../utils/queries/workoutQuery";
import ErrorPage from "../components/loaders/ErrorPage";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const CreateWorkoutPlan = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TCreateWorkout>({
    resolver: zodResolver(createPlanSchema)
  });
  const navigate = useNavigate();

  const clickOnBackBtn = () => {
    navigate(-1);
  }

  const { mutate, isPending ,isError, error } = useCreateWorkoutPlan();

  const onSubmit = (data: TCreateWorkout) => {
    mutate({ planFormData: data });
    reset();
  };

  if (isError) return <ErrorPage errorMessage={error.message} />;

  return (
    <div className="min-h-screen w-full bg-MainBackgroundColor p-4 font-montserrat">
      <div className="flex gap-3 items-center">
        <IoArrowBack onClick={clickOnBackBtn} color="#fff" size={26} />
        <h1 className="text-2xl text-PrimaryTextColor font-bold">Create Plan</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4 flex flex-col gap-3">
        {/* Plan Name */}
        <div className="">
          <label htmlFor="plan_name" className="text-lg text-SecondaryTextColor font-semibold "> What is your Plan name? </label>
          <input
            {...register("plan_name")}
            type="text"
            id="plan_name"
            className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
          />
          {errors.plan_name && (
            <p className="text-red-500">{`${errors.plan_name.message}`}</p>
          )}
        </div>

        {/* Difficulty Level */}
        <div className="my-3">
          <label htmlFor="difficulty_level" className="text-lg text-SecondaryTextColor font-semibold "> What is this Difficulty level? </label>
          <input
            {...register("difficulty_level")}
            type="text"
            id="difficulty_level"
            className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
          />
          {errors.difficulty_level && (
            <p className="text-red-500">{`${errors.difficulty_level.message}`}</p>
          )}
        </div>

        {/* Description */}
        <div className="">
          <label htmlFor="description" className="text-lg text-SecondaryTextColor font-semibold "> Any tips or some important notes? </label>
          <textarea
            {...register("description")}
            id="difficulty_level"
            placeholder="Optional"
            className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
          />
          {errors.description && (
            <p className="text-red-500">{`${errors.description.message}`}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label htmlFor="weeks" className="text-lg text-SecondaryTextColor font-semibold "> How many weeks is this plan? </label>
          <input
            {...register("weeks", { valueAsNumber: true })}
            id="weeks"
            type="number"
            className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-[20%] focus:outline-none"
          />
          {errors.weeks && (
            <p className="text-red-500">{`${errors.weeks.message}`}</p>
          )}
        </div>

        <button type="submit" className={`${isPending ? "bg-[#ffff33a9]" : "bg-MainButtonColor"} mt-4 text-black h-10 font-semibold text-lg rounded-lg flex justify-center items-center`}>
          {isPending ? <ClipLoader size={20} /> : "Create"}
        </button>
      </form>
    </div>
  )
}

export default CreateWorkoutPlan;
