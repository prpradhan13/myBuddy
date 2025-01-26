import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { setSchema, TSetSchema } from "../../validations/forms";
import { useCreateExerciseSets } from "../../utils/queries/exerciseQuery";
import ErrorPage from "../loaders/ErrorPage";
import { ClipLoader } from "react-spinners";

interface SetsFormProps {
  exerciseId: number;
  setOpenSetsCreateForm: Dispatch<SetStateAction<boolean>>
}

const SetsForm = ({ exerciseId, setOpenSetsCreateForm }: SetsFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TSetSchema>({
    resolver: zodResolver(setSchema)
  })

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpenSetsCreateForm(false);
    }
  };

  const [exerciseSetsData, setExerciseSetsData] = useState<TSetSchema[]>([])

  const handleAddSet = (data: TSetSchema) => {
    if (!data.target_repetitions || !data.target_weight) {
      toast.error("Please complete all fields before adding a set.");
      return;
    }

    setExerciseSetsData((prev) => [...prev, { ...data }]);
    reset({target_repetitions: "", target_weight: ""});
  };

  const handleRemoveSet = (index: number) => {
    const updatedSets = exerciseSetsData.filter((_, i) => i !== index);
    setExerciseSetsData(updatedSets);
  };

  const handleClose = () => {
    setExerciseSetsData([]);
    setOpenSetsCreateForm(false);
  }

  const { mutate, isPending, isError, error } = useCreateExerciseSets(exerciseId);

  const handleSaveExercise = () => {
    if (exerciseSetsData.length === 0) {
      toast.error("No valid sets to save. Please add at least one valid set.");
      return;
    }

    mutate({ formData: exerciseSetsData })
  };

  if (isError) return <ErrorPage errorMessage={error.message} />

  return (
    <div onClick={handleOverlayClick} className="bg-[#00000096] absolute top-0 right-0 left-0 h-screen flex justify-center items-center px-4 font-montserrat">
      <div className="bg-SecondaryBackgroundColor w-full rounded-md p-3 flex flex-col gap-4">
        <form onSubmit={handleSubmit(handleAddSet)} className="mb-1">
          <div>
            <h1 className="text-SecondaryTextColor font-semibold">
              Target Repetition
            </h1>
            <input
              {...register("target_repetitions")}
              type="text"
              className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
            />
            {errors.target_repetitions && (
              <p className="text-red-500">{`${errors.target_repetitions.message}`}</p>
            )}
          </div>

          <div>
            <h1 className="text-SecondaryTextColor font-semibold">
              Target Weight
            </h1>
            <input
              {...register("target_weight")}
              type="text"
              className="text-white mt-1 bg-transparent border border-[#5e5e5e] rounded-lg py-2 px-3 w-full focus:outline-none"
            />
            {errors.target_weight && (
              <p className="text-red-500">{`${errors.target_weight.message}`}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 py-1 px-2 rounded-md mt-1 font-semibold"
          >
            Save Set
          </button>
        </form>

        {/* Display List of Created Sets */}
        {exerciseSetsData.length > 0 && (
          <>
            <div className="bg-[#000] p-2 rounded-md h-[30vh] overflow-y-scroll">
              <h2 className="text-SecondaryTextColor font-semibold mb-2">
                Created Sets For:
              </h2>
              {exerciseSetsData
                .map((set, index) => (
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
          </>
        )}

        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={handleClose}
            className={`bg-red-500 rounded-md h-8 text-lg font-semibold mt-4 ${
              exerciseSetsData.length <= 1 ? "w-full" : "w-1/2"
            }`}
          >
            CLOSE
          </button>

          {exerciseSetsData.length > 0 && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleSaveExercise}
              className={`${isPending ? "bg-[#ffff33bb]" : "bg-MainButtonColor"} rounded-md h-8 text-lg font-semibold mt-4 w-1/2`}
            >
              {isPending ? <ClipLoader size={15} /> : "SAVE"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetsForm;
