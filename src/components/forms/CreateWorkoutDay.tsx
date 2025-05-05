import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createWorkoutDayschema,
  TCreateWorkoutDay,
} from "../../validations/forms";
import ExerciseForm from "./ExerciseForm";
import FinalStep from "./FinalStep";
import { ExercisesFormType } from "../../types/workoutPlans";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Alert from "../extra/Alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";

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
  const form = useForm<TCreateWorkoutDay>({
    resolver: zodResolver(createWorkoutDayschema),
    defaultValues: {
      workout_name: "",
      difficulty_level: "",
      description: "",
    },
  });
  const [step, setStep] = useState(1);
  const [exerciseData, setExerciseData] = useState<ExercisesFormType[]>([]);

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

  const handleCloseBtn = () => {
    form.reset();
    setOpenCreateForm(false);
  };

  const onSubmit = () => {
    setStep(2);
  };

  return (
    <div className="bg-[#00000096] fixed top-0 right-0 left-0 h-screen flex justify-center items-center px-4 font-montserrat z-50">
      {step === 1 && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-SecondaryBackgroundColor w-full md:w-[50vw] rounded-lg p-6 flex flex-col gap-6 shadow-xl"
          >
            <FormField
              control={form.control}
              name="workout_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg font-medium">
                    Workout Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter workout name"
                      {...field}
                      className="text-PrimaryTextColor bg-[#2a2a2a] border-[#3a3a3a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty_level"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-lg text-PrimaryTextColor font-medium">
                    Difficulty Level
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className={`w-[180px] bg-[#2a2a2a] border-[#3a3a3a] text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                      >
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
                        <SelectGroup>
                          <SelectItem value="easy" className="text-white hover:bg-[#3a3a3a]">Easy</SelectItem>
                          <SelectItem value="medium" className="text-white hover:bg-[#3a3a3a]">Medium</SelectItem>
                          <SelectItem value="hard" className="text-white hover:bg-[#3a3a3a]">Hard</SelectItem>
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
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg font-medium">
                    Any Tips?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter workout tips and instructions"
                      {...field}
                      className="text-PrimaryTextColor bg-[#2a2a2a] border-[#3a3a3a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 justify-evenly">
              <Alert
                handleContinueBtn={handleCloseBtn}
                trigerBtnVarient="destructive"
                triggerBtnClassName="w-1/2 text-lg font-medium bg-red-600 hover:bg-red-700"
              />
              <Button 
                type="submit" 
                variant="secondary" 
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                NEXT
              </Button>
            </div>
          </form>
        </Form>
      )}

      {step === 2 && (
        <ExerciseForm setStep={setStep} setExerciseData={setExerciseData} />
      )}

      {step === 3 && (
        <FinalStep
          workoutDetail={{
            ...form.watch(),
            exercises: exerciseData,
            difficulty_level: form.watch("difficulty_level") ?? null,
            description: form.watch("description") ?? null,
          }}
          setExerciseData={setExerciseData}
          setStep={setStep}
          workoutDayId={workoutDayId}
          planId={planId}
          setOpenCreateForm={setOpenCreateForm}
        />
      )}
    </div>
  );
};

export default CreateWorkoutDay;
