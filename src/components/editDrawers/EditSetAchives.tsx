import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { achiveSchema, TAchiveSchema } from "@/validations/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useCreateAchiveSet } from "@/utils/queries/achiveSetExer";
import toast from "react-hot-toast";

interface EditSetAchivesProps {
  editDrawerOpen: boolean;
  setEditDrawerOpen: (value: boolean) => void;
  setIndex: number;
  setId: number;
  exerciseId: number;
}

const EditSetAchives = ({
  editDrawerOpen,
  setEditDrawerOpen,
  setIndex,
  setId,
  exerciseId
}: EditSetAchivesProps) => {
  const form = useForm<TAchiveSchema>({
    resolver: zodResolver(achiveSchema),
    defaultValues: {
      achive_repetitions: "",
      achive_weight: "",
    },
  });

  const { mutate, isPending } = useCreateAchiveSet();

  const handleAddAchive = (data: TAchiveSchema) => {
    mutate(
      { formData: { ...data, setId, exerciseId } },
      {
        onSuccess: () => {
          form.reset();
          setEditDrawerOpen(false);
          toast.success("Your Set achivment has been added.");
        },
        onError: (error) => {
          form.reset();
          setEditDrawerOpen(false);
          toast.error(error.message);
        },
      }
    )
  };

  return (
    <Drawer open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
      <DrawerContent className="p-4 bg-SecondaryBackgroundColor border-none font-manrope">
        <DrawerHeader>
          <DrawerTitle className="text-PrimaryTextColor">
            Edit Set {setIndex + 1}
          </DrawerTitle>
          <DrawerDescription>
            If you want you can edit your set here for exercise track.
          </DrawerDescription>
        </DrawerHeader>
        {/* Achive form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddAchive)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="achive_repetitions"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="text-PrimaryTextColor text-base">
                    How many Repetitions you do?
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="15 reps"
                      {...field}
                      className="bg-[#dbdbdb] border-none placeholder:text-[#9a9a9a]"
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
                <FormItem className="">
                  <FormLabel className="text-PrimaryTextColor text-base">
                    How much weight you lift?
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="15 kg"
                      {...field}
                      className="bg-[#dbdbdb] border-none placeholder:text-[#9a9a9a]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DrawerFooter className="p-0 flex-row mt-2">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2 bg-transparent text-white"
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                variant={"secondary"}
                disabled={isPending}
                className="w-1/2"
              >
                {isPending ? "Please wait..." : "Save"}
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default EditSetAchives;
