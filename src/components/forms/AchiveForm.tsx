import { achiveSchema, TAchiveSchema } from "@/validations/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Alert from "../extra/Alert";
import { useUpdateAchives } from "@/utils/queries/exerciseQuery";
import ErrorPage from "../loaders/ErrorPage";
import { Loader2 } from "lucide-react";

interface AchiveFormProps {
  exerciseId: number;
  openSetAchivesForm: number | null;
  setOpenSetAchivesForm: Dispatch<SetStateAction<number | null>>;
}

const AchiveForm = ({
  exerciseId,
  openSetAchivesForm,
  setOpenSetAchivesForm,
}: AchiveFormProps) => {
  const form = useForm<TAchiveSchema>({
    resolver: zodResolver(achiveSchema),
    defaultValues: {
      achive_repetitions: "",
      achive_weight: "",
    },
  });

  const setId = openSetAchivesForm!;

  const { mutate, isPending, isError, error } = useUpdateAchives(
    exerciseId,
    setId
  );

  const handleClose = () => {
    setOpenSetAchivesForm(null);
  };

  const handleAddAchive = (data: TAchiveSchema) => {
    mutate({ formData: data })
  };

  if (isError) return <ErrorPage errorMessage={error.message} />;

  return (
    <div className="bg-[#00000096] fixed top-0 right-0 left-0 h-screen flex justify-center items-center px-4 font-montserrat">
      <div className="bg-SecondaryBackgroundColor w-full md:w-[50vw] rounded-md p-3 flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddAchive)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="achive_repetitions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    How many Repetitions you do?
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
              name="achive_weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    How much weight you lift?
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

            <div className="flex gap-3 w-full">
              <Alert
                trigerBtnVarient={"destructive"}
                handleContinueBtn={handleClose}
                triggerBtnClassName="w-1/2"
              />
              <Button type="submit" variant={"secondary"} className="w-1/2">
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AchiveForm;
