import { useState } from "react";
import toast from "react-hot-toast";

const SetsForm = ({
  setStep,
  setValue,
  reset,
  handleCloseBtn,
  exerciseSetsData,
  setExerciseSetsData,
}) => {
  const handleAddSet = () => {
    const lastSet = exerciseSetsData[exerciseSetsData.length - 1];
    if (!lastSet.target_repetitions || !lastSet.target_weight) {
      toast.error("Please complete the current set before adding a new one.");
      return;
    }

    setExerciseSetsData((prev) => [
      ...prev,
      { target_repetitions: "", target_weight: "" },
    ]);
  };

  const handleSetChange = (
    field: "target_repetitions" | "target_weight",
    value: string
  ) => {
    // Update the last set immutably
    setExerciseSetsData((prev) => {
      const updatedSets = [...prev];
      updatedSets[prev.length - 1] = {
        ...updatedSets[prev.length - 1],
        [field]: value,
      };
      return updatedSets;
    });

    // Update form values if needed
    setValue(`sets.${exerciseSetsData.length - 1}.${field}`, value);
  };

  const handleRemoveSet = (index: number) => {
    const updatedSets = exerciseSetsData.filter((_, i) => i !== index);
    setExerciseSetsData(updatedSets);
    reset({ ...exerciseSetsData, sets: updatedSets });
  };

  const handleSaveExercise = () => {
    const validSets = exerciseSetsData.filter(
      (set) => set.target_repetitions && set.target_weight
    );
  
    if (validSets.length === 0) {
      toast.error("No valid sets to save. Please add at least one valid set.");
      return;
    }
  
    setExerciseSetsData(validSets); 
    setStep(3);
    reset();
  };
  

  return (
    <>
      <div className="bg-SecondaryBackgroundColor w-full rounded-md p-3 flex flex-col gap-4">
        <div className="mb-1">
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
                handleSetChange("target_repetitions", e.target.value)
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
                exerciseSetsData[exerciseSetsData.length - 1]?.target_weight ||
                ""
              }
              onChange={(e) => handleSetChange("target_weight", e.target.value)}
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
        {exerciseSetsData.length > 1 && (
          <>
            <div className="bg-[#000] p-2 rounded-md h-[30vh] overflow-y-scroll">
              <h2 className="text-SecondaryTextColor font-semibold mb-2">
                Created Sets For:
              </h2>
              {exerciseSetsData
                .slice(0, -1)
                .filter((set) => set.target_repetitions && set.target_weight)
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
            onClick={handleCloseBtn}
            className={`bg-red-500 rounded-md h-8 text-lg font-semibold mt-4 ${
              exerciseSetsData.length <= 1 ? "w-full" : "w-1/2"
            }`}
          >
            CLOSE
          </button>

          {exerciseSetsData.length > 1 && (
            <button
              type="submit"
              onClick={handleSaveExercise}
              className={`bg-MainButtonColor rounded-md h-8 text-lg font-semibold mt-4 w-1/2`}
            >
              SAVE
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SetsForm;
