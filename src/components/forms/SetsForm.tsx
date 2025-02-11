import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { setSchema, TSetSchema } from "../../validations/forms";
import { useCreateExerciseSets } from "../../utils/queries/exerciseQuery";
import ErrorPage from "../loaders/ErrorPage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import Alert from "../extra/Alert";

interface SetsFormProps {
  exerciseId: number;
  setOpenSetsCreateForm: Dispatch<SetStateAction<boolean>>;
}

const SetsForm = ({ exerciseId, setOpenSetsCreateForm }: SetsFormProps) => {
  const form = useForm<TSetSchema>({
    resolver: zodResolver(setSchema),
  });
  const [exerciseSetsData, setExerciseSetsData] = useState<TSetSchema[]>([]);

  const handleAddSet = (data: TSetSchema) => {
    if (!data.target_repetitions || !data.target_weight) {
      toast.error("Please complete all fields before adding a set.");
      return;
    }

    setExerciseSetsData((prev) => [...prev, { ...data }]);
    form.reset({ target_repetitions: "", target_weight: "" });
  };

  const handleRemoveSet = (index: number) => {
    const updatedSets = exerciseSetsData.filter((_, i) => i !== index);
    setExerciseSetsData(updatedSets);
  };

  const handleClose = () => {
    setExerciseSetsData([]);
    setOpenSetsCreateForm(false);
  };

  const { mutate, isPending, isError, error } =
    useCreateExerciseSets(exerciseId);

  const handleSaveExercise = () => {
    if (exerciseSetsData.length === 0) {
      toast.error("No valid sets to save. Please add at least one valid set.");
      return;
    }

    mutate({ formData: exerciseSetsData });
  };

  if (isError) return <ErrorPage errorMessage={error.message} />;

  return (
    <div className="bg-[#00000096] fixed top-0 right-0 left-0 h-screen flex justify-center items-center px-4 font-montserrat">
      <div className="bg-SecondaryBackgroundColor w-full md:w-[50vw] rounded-md p-3 flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddSet)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="target_repetitions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Target Repetitions
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      className="text-PrimaryTextColor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Target Weight
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      className="text-PrimaryTextColor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-blue-500 py-1 px-2 rounded-md font-semibold"
            >
              Save Set
            </Button>
          </form>
        </Form>

        {/* Display List of Created Sets */}
        {exerciseSetsData.length > 0 && (
          <>
            <div className="bg-[#000] p-2 rounded-md h-[30vh] overflow-y-scroll">
              <h2 className="text-SecondaryTextColor font-semibold mb-2">
                Created Sets For:
              </h2>
              {exerciseSetsData.map((set, index) => (
                <div
                  key={index}
                  className="bg-gray-800 px-4 py-2 rounded-md mb-2"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-white">Set {index + 1}</p>
                    <Button
                      variant="ghost"
                      onClick={() => handleRemoveSet(index)}
                      className="text-red-500 text-sm h-0 hover:text-red-500 hover:bg-transparent"
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400">
                    Reps: {set.target_repetitions} | Weight: {set.target_weight}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-3 w-full">
          <Alert
            trigerBtnVarient={"destructive"}
            handleContinueBtn={handleClose}
            triggerBtnClassName={`${
              exerciseSetsData.length === 0 ? "w-full" : "w-1/2"
            }`}
          />

          {exerciseSetsData.length > 0 && (
            <Button
              variant="secondary"
              disabled={isPending}
              onClick={handleSaveExercise}
              className="w-1/2"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetsForm;
