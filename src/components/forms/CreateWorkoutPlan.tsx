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
import { Loader2 } from "lucide-react";
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Lock } from 'lucide-react';

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
    <Drawer
      open={openCreateForm}
      onOpenChange={setOpenCreateForm}
      onClose={handleCloseBtn}
    >
      <DrawerContent className="p-4 bg-MainBackgroundColor border-none">
        <DrawerHeader>
          <DrawerTitle className="text-PrimaryTextColor">
            Create Plan
          </DrawerTitle>
          <DrawerDescription>
            Here you can create your own weekly workout plan.
          </DrawerDescription>
        </DrawerHeader>
        {!accessForCreatePlan ? (
          <div className="flex justify-center items-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-[#ff8401] text-center font-medium flex justify-center items-center gap-2">
                  <Lock color="#ff8401" strokeWidth={3} />
                  Access Denied
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-primaryTextColor">
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
              className="w-full md:w-[50vw] space-y-4"
            >
              <FormField
                control={form.control}
                name="plan_name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-PrimaryTextColor text-lg">
                      Your Plan Name
                    </FormLabel>
                    <FormControl>
                      <input
                        placeholder="Write your workout plan name."
                        {...field}
                        value={field.value ?? ""}
                        className="text-PrimaryTextColor border-b pb-2 px-2 bg-transparent placeholder:text-[#6c6c6c] outline-none"
                      />
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
                name="difficulty_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-PrimaryTextColor text-lg">
                      Level
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          className={`w-[180px] ${
                            field.value ? "text-white" : "text-muted-foreground"
                          }`}
                        >
                          <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="beginners">Beginners</SelectItem>
                            <SelectItem value="intermediates">
                              Intermediates
                            </SelectItem>
                            <SelectItem value="advance">Advance</SelectItem>
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
                name="weeks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-PrimaryTextColor text-lg">
                      How many week ?
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="text-PrimaryTextColor w-[70px]"
                        onChange={(e) => {
                          const value =
                            e.target.value === "" ? "" : Number(e.target.value);
                          field.onChange(value);
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 justify-evenly">
                <Alert
                  handleContinueBtn={handleCloseBtn}
                  trigerBtnVarient="destructive"
                  triggerBtnClassName="w-1/2 font-semibold"
                />
                <Button type="submit" variant="secondary" className="w-1/2">
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CreateWorkoutPlan;
