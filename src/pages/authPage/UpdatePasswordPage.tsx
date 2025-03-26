import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  TUpdatePasswordSchema,
  UpdatePasswordSchema,
} from "@/validations/register";
import { IoEyeOffOutline, IoEyeOutline, IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PasswordCheck from "@/components/extra/PasswordCheck";
import toast from "react-hot-toast";
import { supabase } from "@/utils/supabase";
import { Loader2 } from "lucide-react";

const UpdatePasswordPage = () => {
  const form = useForm<TUpdatePasswordSchema>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      email: "",
      newPassword: "",
    },
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  const onSubmit = async (data: TUpdatePasswordSchema) => {
    try {
        setUpdating(true);
      const { error } = await supabase.auth.updateUser({
        email: data.email,
        password: data.newPassword,
      });

      if (error) {
        throw new Error(error.message || "Failed to send reset password link");
      }

      form.reset();
      await supabase.auth.signOut();
      toast.success("Password Update successfully, Login again!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
        setUpdating(false);
    }
  };

  return (
    <div className="h-screen w-full bg-MainBackgroundColor flex justify-center items-center">
      <Card className="w-full max-w-md p-6 shadow-lg bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md px-3 py-2 bg-transparent">
                        <IoMailOutline color="#c2c2c2" size={20} />
                        <input
                          placeholder="name@mail.com"
                          autoCapitalize="none"
                          {...field}
                          className="w-full border-none outline-none bg-transparent ml-2 placeholder:text-[#c2c2c2]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">New Password</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md px-3 py-2 bg-transparent">
                        <TbLockPassword size={20} color="#dfdfdf" />
                        <input
                          placeholder="Enter new password"
                          type={passwordVisible ? "text" : "password"}
                          autoCapitalize="none"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setPassword(e.target.value);
                          }}
                          className="border-none outline-none bg-transparent ml-2 placeholder:text-[#c2c2c2] w-full"
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordVisible((prev) => !prev)}
                          className="ml-2 p-1 rounded-md focus:outline-none"
                        >
                          {passwordVisible ? (
                            <IoEyeOutline color="#000" size={20} />
                          ) : (
                            <IoEyeOffOutline color="#000" size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />

                    <PasswordCheck
                      isSubmitted={form.formState.isSubmitted}
                      password={password}
                    />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="secondary"
                className="w-full py-3"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePasswordPage;
