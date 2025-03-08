import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline, IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import toast from "react-hot-toast";
import { supabase } from "../../utils/supabase";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaTypes } from "../../validations/register";
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
import { Loader2 } from "lucide-react";

const RegisterPage = () => {
  const form = useForm<LoginSchemaTypes>({
    resolver: zodResolver(loginSchema),
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const formSubmit = async (e: LoginSchemaTypes) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: e.email,
      password: e.password,
    });

    if (error) {
      toast.error(error.message || "Error signing in");
    } else {
      toast.success("Welcome!");
      form.reset();
      navigate("/");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-MainBackgroundColor justify-center items-center px-8">
      <h1 className="text-2xl text-PrimaryTextColor font-semibold">
        Login to your Account
      </h1>
      <h3 className="text-sm text-SecondaryTextColor text-center mt-5">
        Get started with our app, just create an account and enjoy the
        experience.
      </h3>

      <Form {...form}>
        <form className="w-full md:w-[50vw] lg:w-[30vw] mt-10" onSubmit={form.handleSubmit(formSubmit)}>
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
                      className="text-white placeholder:text-[#c2c2c2] border-none p-0 focus-visible:ring-0 overflow-hidden"
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
              <FormItem className="mt-2">
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

          <Button
            type="submit"
            variant={"secondary"}
            className="w-full mt-4"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>
      </Form>

      <h3 className="text-[#dfdfdf] text-xl my-5 font-semibold"> Or </h3>

      <Link to={"/signUp"} className="text-blue-500 font-medium">
        Create an account?
      </Link>
    </div>
  );
};

export default RegisterPage;
