import { ChevronsUpDown, X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { useGetPreviousExercises } from "@/utils/queries/exerciseQuery";
import { ExerciseType } from "@/types/workoutPlans";

interface PreviousExerciseBoxProps {
  planId: number;
  handleClosePreviousBox: () => void;
  handleSelectPreviousExercise: (exercise: ExerciseType) => void;
}

const PreviousExerciseBox = ({
  planId,
  handleClosePreviousBox,
  handleSelectPreviousExercise,
}: PreviousExerciseBoxProps) => {
  const { data: previousExercisesData, isLoading } = useGetPreviousExercises(
    planId!
  );



  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Previous Exercises</h2>
        <button
          onClick={handleClosePreviousBox}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <ScrollArea className="w-full h-[70vh] rounded-lg">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500"></div>
              <p className="text-gray-400 text-lg">Loading exercises...</p>
            </div>
          ) : previousExercisesData &&
            Object.keys(previousExercisesData).length > 0 ? (
            Object.entries(previousExercisesData)
              .sort(([categoryA], [categoryB]) =>
                categoryA.localeCompare(categoryB, "en", {
                  sensitivity: "base",
                })
              )
              .map(([category, exercises]) => (
                <div key={category} className="space-y-3">
                  <h2 className="text-lg font-semibold text-gray-200 capitalize">
                    {category}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exercises.map((exercise: ExerciseType) => (
                      <Collapsible
                        key={exercise.id}
                        className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden transition-all hover:border-gray-600"
                      >
                        <div className="flex items-center justify-between p-3">
                          <button
                            onClick={() =>
                              handleSelectPreviousExercise(exercise)
                            }
                            className="text-left flex-1 text-gray-200 hover:text-white transition-colors"
                          >
                            <h3 className="font-medium capitalize">
                              {exercise.exercise_name}
                            </h3>
                            {exercise.target_muscle && (
                              <p className="text-sm text-gray-400 capitalize">
                                {exercise.target_muscle}
                              </p>
                            )}
                          </button>
                          {(exercise.target_muscle || exercise.description) && (
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white hover:bg-gray-700"
                              >
                                <ChevronsUpDown className="h-4 w-4" />
                                <span className="sr-only">Toggle details</span>
                              </Button>
                            </CollapsibleTrigger>
                          )}
                        </div>
                        <CollapsibleContent className="px-3 pb-3 space-y-2">
                          {exercise.rest && (
                            <div className="flex items-center text-sm text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Rest: {exercise.rest}
                            </div>
                          )}
                          {exercise.description && (
                            <div className="text-sm text-gray-400 whitespace-pre-line">
                              {exercise.description}
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-400 text-lg">
                No previous exercises found
              </p>
              <p className="text-gray-500 text-sm">
                Start by adding some exercises to your workout plan
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PreviousExerciseBox;
