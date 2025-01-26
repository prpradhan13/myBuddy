import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { exerciseSchema, TExerciseForm } from "../../validations/forms";
import { ExercisesFormType } from "../../types/workoutPlans";

interface ExerciseFormProps {
  setStep: Dispatch<SetStateAction<number>>;
  setExerciseData: Dispatch<SetStateAction<ExercisesFormType[]>>;
}

const ExerciseForm = ({
  setStep,
  setExerciseData,
}: ExerciseFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<TExerciseForm>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      exercise_name: "",
      target_muscle: "",
      exercise_description: ""
    },
  });

  const exerciseName = watch("exercise_name");

  const handleNextBtnClick = (data: TExerciseForm) => {
    setExerciseData((prev) => [...prev, {...data}])
    setStep(3)
    reset();
  };
  
  return (
    <div className="w-full">
        <form
          onSubmit={handleSubmit(handleNextBtnClick)}
          className="bg-SecondaryBackgroundColor w-full rounded-md p-3 flex flex-col gap-4"
        >
          {/* Exercise Name */}
          <div className="">
            <label
              htmlFor="exercise_name"
              className="text-lg text-SecondaryTextColor font-semibold"
            >
              Exercise Name
            </label>
            <input
              {...register("exercise_name")}
              type="text"
              className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
            />
            {errors.exercise_name && (
              <p className="text-red-500">{`${errors.exercise_name.message}`}</p>
            )}
          </div>

          {/* Target muscles */}
          <div className="">
            <label
              htmlFor="target_muscle"
              className="text-lg text-SecondaryTextColor font-semibold"
            >
              Which muscles target by this exercise?
            </label>
            <input
              {...register("target_muscle")}
              type="text"
              placeholder="Optional"
              className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
            />
            {errors.target_muscle && (
              <p className="text-red-500">{`${errors.target_muscle.message}`}</p>
            )}
          </div>

          {/* Exercise Description Name */}
          <div className="">
            <label
              htmlFor="exercise_description"
              className="text-lg text-SecondaryTextColor font-semibold"
            >
              How to do this exercise any tips?
            </label>
            <textarea
              {...register("exercise_description")}
              placeholder="Optional"
              className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
            />
            {errors.exercise_description && (
              <p className="text-red-500">{`${errors.exercise_description.message}`}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-blue-500 rounded-md h-8 text-lg font-semibold"
            >
              BACK
            </button>
            <button
              type="submit"
              disabled={!exerciseName?.trim()}
              className={`${
                exerciseName?.trim()
                  ? "bg-SecondaryTextColor"
                  : "bg-gray-500 cursor-not-allowed"
              } rounded-md h-8 text-lg font-semibold`}
            >
              NEXT
            </button>
          </div>
        </form>
    </div>
  );
};

export default ExerciseForm;
