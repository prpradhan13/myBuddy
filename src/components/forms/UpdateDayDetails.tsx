import { TUpdateDayDetails, updateDayDetails } from "@/validations/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Alert from "../extra/Alert";
import { Button } from "../ui/button";
import { useUpdateDayDetails } from "@/utils/queries/dayQuery";
import { Loader2 } from "lucide-react";

interface UpdateDayDetailsProps {
  openUpdateForm: boolean;
  setOpenUpdateForm: Dispatch<SetStateAction<boolean>>;
  dayId: number;
  planId: number;
}

const UpdateDayDetails = ({
  openUpdateForm,
  setOpenUpdateForm,
  planId,
  dayId,
}: UpdateDayDetailsProps) => {
  const form = useForm<TUpdateDayDetails>({
    resolver: zodResolver(updateDayDetails),
    defaultValues: {
      workout_name: "",
      difficulty_level: "",
      description: "",
    },
  });

  useEffect(() => {
    if (openUpdateForm) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [openUpdateForm]);

  const handleCloseBtn = () => {
    form.reset();
    setOpenUpdateForm(false);
  };

  const { mutate, isPending } = useUpdateDayDetails({
    planId,
    dayId,
    setOpenUpdateForm,
  });

  const onSubmit = (data: TUpdateDayDetails) => {
    mutate(data);
    form.reset();
  };

  return (
    <div className="bg-[#00000096] fixed top-0 right-0 left-0 h-screen flex justify-center items-center px-4 ">
      <Form {...form}>
        
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border bg-SecondaryBackgroundColor w-full md:w-[50vw] rounded-md p-3 flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="workout_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-PrimaryTextColor text-lg">
                  New Workout Name
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
            name="difficulty_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-PrimaryTextColor text-lg">
                  New Difficulty Level
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Optional"
                    {...field}
                    className="text-PrimaryTextColor"
                    value={field.value ?? ""}
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
                  New Tips
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Optional"
                    {...field}
                    className="text-PrimaryTextColor"
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
              triggerBtnClassName="w-1/2 text-lg font-semibold"
            />
            <Button type="submit" variant="secondary" className="w-1/2">
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait
                </>
              ) : (
                "SUBMIT"
              )}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
};

export default UpdateDayDetails;
