import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import {
  createWorkoutDayschema,
  TCreateWorkoutDay,
} from "../../validations/forms";
import ExerciseForm from "./ExerciseForm";
import FinalStep from "./FinalStep";
import { ExercisesFormType } from "../../types/workoutPlans";

const CreateWorkoutDay = ({
  workoutDayId,
  planId,
  openCreateForm,
  setOpenCreateForm,
}: {
  workoutDayId: number;
  planId: number;
  openCreateForm: boolean;
  setOpenCreateForm: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<TCreateWorkoutDay>({
    resolver: zodResolver(createWorkoutDayschema),
    defaultValues: {
      workout_name: "",
      difficulty_level: "",
      description: "",
    },
  });
  const [step, setStep] = useState(1);
  const [exerciseData, setExerciseData] = useState<ExercisesFormType[]>([]);
  const workoutName = watch("workout_name");

  useEffect(() => {
    if (openCreateForm) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [openCreateForm]);

  // Close the modal when clicking outside of the modal content
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpenCreateForm(false);
    }
  };

  const handleCloseBtn = () => {
    reset();
    setOpenCreateForm(false);
  };

  const onSubmit = () => {
    setStep(2);
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="bg-[#00000096] absolute top-0 right-0 left-0 h-screen flex justify-center items-center px-4 font-montserrat"
    >
      {step === 1 && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-SecondaryBackgroundColor w-full rounded-md p-3 flex flex-col gap-4"
        >
          {/* Workout Name */}
          <div className="">
            <label
              htmlFor="workout_name"
              className="text-lg text-SecondaryTextColor font-semibold"
            >
              {" "}
              Workout Name{" "}
            </label>
            <input
              {...register("workout_name")}
              type="text"
              className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
            />
            {errors.workout_name && (
              <p className="text-red-500">{`${errors.workout_name.message}`}</p>
            )}
          </div>

          {/* Difficulty Level */}
          <div className="">
            <label
              htmlFor="difficulty_level"
              className="text-lg text-SecondaryTextColor font-semibold"
            >
              {" "}
              Difficulty Level{" "}
            </label>
            <input
              {...register("difficulty_level")}
              type="text"
              className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
            />
            {errors.difficulty_level && (
              <p className="text-red-500">{`${errors.difficulty_level.message}`}</p>
            )}
          </div>

          {/* Description */}
          <div className="">
            <label
              htmlFor="description"
              className="text-lg text-SecondaryTextColor font-semibold"
            >
              {" "}
              Any Tips?{" "}
            </label>

            <textarea
              {...register("description")}
              className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
            />
            {errors.description && (
              <p className="text-red-500">{`${errors.description.message}`}</p>
            )}
          </div>

          <div className="flex gap-3 justify-evenly">
            <button
              type="button"
              onClick={handleCloseBtn}
              className="bg-red-500 rounded-md h-8 text-lg font-semibold"
            >
              CLOSE
            </button>
            <button
              type="submit"
              disabled={!workoutName?.trim()}
              className={`${
                workoutName?.trim()
                  ? "bg-SecondaryTextColor"
                  : "bg-gray-500 cursor-not-allowed"
              } rounded-md h-8 text-lg font-semibold`}
            >
              NEXT
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <ExerciseForm
          setStep={setStep}
          setExerciseData={setExerciseData}
        />
      )}

      {step === 3 && (
        <FinalStep workoutDetail={{ ...watch(), exercises: exerciseData }} setStep={setStep} workoutDayId={workoutDayId} planId={planId} setOpenCreateForm={setOpenCreateForm} />
      )}
    </div>
  );
};

export default CreateWorkoutDay;
