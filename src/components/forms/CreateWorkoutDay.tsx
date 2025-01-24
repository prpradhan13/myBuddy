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
import { useAddWorkoutDay } from "../../utils/queries/dayQuery";
import ErrorPage from "../loaders/ErrorPage";
import { ClipLoader } from "react-spinners";
import { IoArrowBack } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

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
    setValue,
    formState: { errors },
    reset,
  } = useForm<TCreateWorkoutDay>({
    resolver: zodResolver(createWorkoutDayschema),
    // defaultValues: {
    //   workout_name: "",
    //   difficulty_level: "",
    //   description: "",
    // },
  });
  console.log("render");
  
  const [step, setStep] = useState(1);

  const [exerciseSetsData, setExerciseSetsData] = useState([
    {
      target_repetitions: "",
      target_weight: "",
    },
  ]);

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

  const { mutate, isPending, isError, error } = useAddWorkoutDay(
    workoutDayId,
    planId,
    setOpenCreateForm
  );

  const onSubmit = (data: TCreateWorkoutDay) => {
    const validExerciseSetsData = exerciseSetsData.filter(
        (set) => set.target_repetitions.trim() !== "" && set.target_weight.trim() !== ""
    );

    const formData = {...data, exerciseSetsData: validExerciseSetsData}
    console.log(formData);
    // mutate({ formData: data });
  };

  if (isError) return <ErrorPage errorMessage={error.message} />;

  const handleAddSet = () => {
    setExerciseSetsData([
      ...exerciseSetsData,
      { target_repetitions: "", target_weight: "" },
    ]);
  };

  const handleSetChange = (index: number, field: string, value: string) => {
    const newSets = [...exerciseSetsData];
    newSets[index] = { ...newSets[index], [field]: value };
    setExerciseSetsData(newSets);

    // Reset input fields
    setValue(`sets[${exerciseSetsData.length}].target_repetitions`, "");
    setValue(`sets[${exerciseSetsData.length}].target_weight`, "");
  };

  const handleRemoveSet = (index: number) => {
    const updatedSets = exerciseSetsData.filter((_, i) => i !== index);
    setExerciseSetsData(updatedSets);
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="bg-[#00000096] absolute top-0 right-0 left-0 h-screen flex justify-center items-center px-4 font-montserrat"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-SecondaryBackgroundColor min-h-[30%] w-full rounded-md p-3 flex flex-col gap-4"
      >
        {step === 1 && (
          <>
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

            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-SecondaryTextColor rounded-md h-10 text-xl font-semibold"
            >
              NEXT
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Input Fields for Target Repetition and Weight */}
            <div className="mb-4">
              <div>
                <h1 className="text-SecondaryTextColor font-semibold">
                  Target Repetition
                </h1>
                <input
                  type="text"
                  value={
                    exerciseSetsData[exerciseSetsData.length - 1]
                      ?.target_repetitions || ""
                  }
                  onChange={(e) =>
                    handleSetChange(
                      exerciseSetsData.length - 1,
                      "target_repetitions",
                      e.target.value
                    )
                  }
                  className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
                />
              </div>
              <div>
                <h1 className="text-SecondaryTextColor font-semibold">
                  Target Weight
                </h1>
                <input
                  type="text"
                  value={
                    exerciseSetsData[exerciseSetsData.length - 1]
                      ?.target_weight || ""
                  }
                  onChange={(e) =>
                    handleSetChange(
                      exerciseSetsData.length - 1,
                      "target_weight",
                      e.target.value
                    )
                  }
                  className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSet}
                className="bg-blue-500 py-1 px-2 rounded-md mt-1 font-semibold"
              >
                Save Set
              </button>
            </div>

            {/* Display List of Created Sets */}
            <div>
              <h2 className="text-SecondaryTextColor font-semibold mb-2">
                Created Sets:
              </h2>
              {exerciseSetsData.map((set, index) => (
                <div
                  key={index}
                  className="bg-gray-800 px-4 py-2 rounded-md mb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="text-white">Set {index + 1}</p>
                    <p className="text-sm text-gray-400">
                      Reps: {set.target_repetitions} | Weight:{" "}
                      {set.target_weight}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveSet(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <p className="text-sm text-SecondaryTextColor">
              *After entering repetitions and weight, click "Save Set" to add to
              the list.
            </p>
          </>
        )}
            <button
              type="submit"
            //   disabled={isPending}
              className="bg-MainButtonColor rounded-md h-10 text-xl font-semibold mt-4 z-50"
            >
               CREATE
            </button>
      </form>
    </div>
  );
};

export default CreateWorkoutDay;
