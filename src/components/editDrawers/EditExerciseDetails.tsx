import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editExerciseDetails, TEditExerciseDetails } from "@/validations/forms";
import { targetMuscles } from "@/utils/constants";
import { Button } from "../ui/button";
import { useUpdateExercise } from "@/utils/queries/exerciseQuery";
import { useQueryClient } from "@tanstack/react-query";
import { ExerciseWithSetsType } from "@/types/workoutPlans";

interface EditExerciseDetailsProps {
  editDrawerOpen: boolean;
  setEditDrawerOpen: (value: boolean) => void;
  exerciseId: number;
  exerciseName: string;
  exerciseDescription: string;
  targetMuscle: string;
  rest: string;
}

const EditExerciseDetails = ({
  editDrawerOpen,
  setEditDrawerOpen,
  exerciseId,
  exerciseName,
  exerciseDescription,
  targetMuscle,
  rest,
}: EditExerciseDetailsProps) => {
  const form = useForm<TEditExerciseDetails>({
    resolver: zodResolver(editExerciseDetails),
    defaultValues: {
      exercise_name: exerciseName,
      description: exerciseDescription,
      target_muscle: targetMuscle,
      rest: rest,
    },
  });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useUpdateExercise();

  const onSubmit = async (data: TEditExerciseDetails) => {
    const initialValues = {
      exercise_name: exerciseName,
      exercise_description: exerciseDescription,
      target_muscle: targetMuscle,
      rest: rest,
    };

    const noChanges = Object.keys(initialValues).every(
      (key) =>
        data[key as keyof TEditExerciseDetails] ===
        initialValues[key as keyof typeof initialValues]
    );

    if (noChanges) {
      toast.error("No changes detected.");
      return;
    }

    mutate(
      { exerciseId: exerciseId, editFormData: data },
      {
        onSuccess: (_,givenData) => {
          queryClient.setQueryData(
            [`exercise_${exerciseId}`],
            (oldData: ExerciseWithSetsType | undefined) => {
              if (!oldData) return {};

              return {
                ...oldData,
                exercise_name: givenData.editFormData.exercise_name,
                exercise_description: givenData.editFormData.description,
                target_muscle: givenData.editFormData.target_muscle,
                rest: givenData.editFormData.rest,
              }
            }
          );

          toast.success("Exercise details updated successfully.");
          setEditDrawerOpen(false);
        },
        onError: () => {
          toast.error("Failed to update exercise details.");
          setEditDrawerOpen(false);
        },
      }
    )
    
  };

  return (
    <Drawer open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
      <DrawerContent className="p-4 bg-MainBackgroundColor border-none">
        <DrawerHeader>
          <DrawerTitle className="text-PrimaryTextColor">
            Edit Plan Details
          </DrawerTitle>
          <DrawerDescription>
            You can edit the details of the plan here. You can change the name
            of the plan, the description.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="exercise_name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-lg text-PrimaryTextColor">
                    Your Exercise Name
                  </FormLabel>
                  <FormControl>
                    <input
                      placeholder="Write your workout plan name."
                      {...field}
                      value={field.value}
                      className="text-PrimaryTextColor border-b pb-2 px-2 bg-transparent placeholder:text-[#6c6c6c] outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_muscle"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Target Muscle
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className={`w-[180px] capitalize ${
                          field.value ? "text-white" : "text-white"
                        }`}
                      >
                        <SelectValue>{field.value ?? "Target muscle"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {targetMuscles.map((target, index) => (
                            <SelectItem key={index} value={target} className="capitalize">{target}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Any Tips?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional"
                      {...field}
                      className="text-PrimaryTextColor h-28 placeholder:text-[#6c6c6c]"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rest"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Rest?
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="text-PrimaryTextColor w-28 bg-transparent border p-2 rounded-md"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DrawerFooter className="p-0">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-green-500"
              >
                {isPending ? "Please wait..." : "Save Changes"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default EditExerciseDetails;
