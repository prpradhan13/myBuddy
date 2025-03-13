import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline, IoMailOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { TbLockPassword } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { signUpSchema, SignUpSchemaTypes } from "../../validations/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";

const SignUpPage = () => {
  const form = useForm<SignUpSchemaTypes>({
    resolver: zodResolver(signUpSchema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const formSubmit = async (e: SignUpSchemaTypes) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: e.email,
      password: e.password,
      options: {
        data: {
          full_name: e.fullname,
          username: e.username,
        },
      },
    });

    if (error) {
      toast.error(error.message || "Error during sign-up");
    } else if (!session) {
      toast.success("Please check your inbox for email verification!");
      form.reset();
      navigate("/register");
    } else {
      toast.success("Sign-in successful");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-MainBackgroundColor justify-center items-center px-8">
      <button
        onClick={handleGoBack}
        className="absolute top-8 left-8 bg-[#656565] rounded-lg p-1"
      >
        <ArrowLeft color="#fff" size={24} />
      </button>
      <h1 className="text-2xl text-PrimaryTextColor font-semibold">
        Create your Account
      </h1>
      <h3 className="text-sm text-[#dadada] text-center mt-5">
        Get started with our app, just create an account and enjoy the
        experience.
      </h3>

      <Form {...form}>
        <form
          className="w-full md:w-[50vw] lg:w-[30vw] mt-10 flex flex-col gap-3"
          onSubmit={form.handleSubmit(formSubmit)}
        >
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Full name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="text-white placeholder:text-[#c2c2c2]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="text-white placeholder:text-[#c2c2c2]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <div className="flex gap-2 items-center border rounded-md px-3 py-1 h-9">
                    <IoMailOutline color="#c2c2c2" size={24} />
                    <Input
                      placeholder="name@mail.com"
                      autoCapitalize="none"
                      {...field}
                      className="text-white placeholder:text-[#c2c2c2] border-none p-0 focus-visible:ring-0"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <div className="flex gap-2 items-center border rounded-md px-3 py-1 h-9">
                    <TbLockPassword size={24} color="#dfdfdf" />
                    <Input
                      placeholder="Password"
                      type={passwordVisible ? "text" : "password"}
                      autoCapitalize="none"
                      {...field}
                      className="text-white placeholder:text-[#c2c2c2] bg-transparent border-none px-0 focus-visible:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible((prev) => !prev)}
                      className="p-1 bg-SecondaryBackgroundColor rounded-md"
                    >
                      {passwordVisible ? (
                        <IoEyeOutline color="#fff" />
                      ) : (
                        <IoEyeOffOutline color="#fff" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant={"secondary"} className="w-full mt-4">
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpPage;
