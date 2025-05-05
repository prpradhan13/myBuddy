import { Dispatch, SetStateAction, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPlanSchema, TCreateWorkout } from "@/validations/forms";
import { useCreateWorkoutPlan } from "@/utils/queries/workoutQuery";
import { Button } from "../ui/button";
import { Loader2, Lock } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Alert from "../extra/Alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface CreateWorkoutPlanProps {
  openCreateForm: boolean;
  setOpenCreateForm: Dispatch<SetStateAction<boolean>>;
  accessForCreatePlan: boolean;
}

const CreateWorkoutPlan = ({
  openCreateForm,
  setOpenCreateForm,
  accessForCreatePlan,
}: CreateWorkoutPlanProps) => {
  const form = useForm<TCreateWorkout>({
    resolver: zodResolver(createPlanSchema),
  });

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

  const { mutate, isPending } = useCreateWorkoutPlan(setOpenCreateForm, {
    limit: 5,
  });

  const handleCloseBtn = () => {
    setOpenCreateForm(false);
  };

  const onSubmit = (data: TCreateWorkout) => {
    mutate({
      planFormData: {
        ...data,
        description: data.description ?? null,
      },
    });

    form.reset();
  };

  return (
    <Dialog open={openCreateForm} onOpenChange={setOpenCreateForm}>
      <DialogContent className="sm:max-w-[500px] bg-MainBackgroundColor border-none">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-PrimaryTextColor text-2xl font-bold">
            Create Workout Plan
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Design your personalized workout plan to achieve your fitness goals.
          </DialogDescription>
        </DialogHeader>
        {!accessForCreatePlan ? (
          <div className="flex justify-center items-center py-6">
            <Card className="w-full max-w-md bg-[#2a2a2a] border-[#3a3a3a]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#ff8401] text-center font-medium flex justify-center items-center gap-2">
                  <Lock color="#ff8401" strokeWidth={3} />
                  Access Denied
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-400">
                  You don't have access to create new workout plans. Please
                  contact an admin.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 py-2"
            >
              <FormField
                control={form.control}
                name="plan_name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-PrimaryTextColor text-base font-medium">
                      Plan Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your workout plan name"
                        {...field}
                        value={field.value ?? ""}
                        className="bg-[#2a2a2a] border-[#3a3a3a] text-PrimaryTextColor placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-PrimaryTextColor text-base font-medium">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any tips or notes about your workout plan (optional)"
                        {...field}
                        className="bg-[#2a2a2a] border-[#3a3a3a] text-PrimaryTextColor placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-blue-500 min-h-[100px]"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="difficulty_level"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-PrimaryTextColor text-base font-medium">
                        Difficulty Level
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger
                            className={`bg-[#2a2a2a] border-[#3a3a3a] ${
                              field.value ? "text-white" : "text-gray-500"
                            }`}
                          >
                            <SelectValue placeholder="Select Level" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
                            <SelectGroup>
                              <SelectItem value="beginners" className="hover:bg-[#3a3a3a]">Beginners</SelectItem>
                              <SelectItem value="intermediates" className="hover:bg-[#3a3a3a]">Intermediates</SelectItem>
                              <SelectItem value="advance" className="hover:bg-[#3a3a3a]">Advance</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weeks"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-PrimaryTextColor text-base font-medium">
                        Duration (Weeks)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="bg-[#2a2a2a] border-[#3a3a3a] text-PrimaryTextColor placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-blue-500"
                          onChange={(e) => {
                            const value =
                              e.target.value === "" ? "" : Number(e.target.value);
                            field.onChange(value);
                          }}
                          value={field.value ?? ""}
                          placeholder="Enter weeks"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Alert
                  handleContinueBtn={handleCloseBtn}
                  trigerBtnVarient="outline"
                  triggerBtnClassName="px-6"
                />
                <Button 
                  type="submit" 
                  className="px-6 bg-blue-600 hover:bg-blue-700"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Plan"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkoutPlan;
