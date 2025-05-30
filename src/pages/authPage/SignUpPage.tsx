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
import PasswordCheck from "@/components/extra/PasswordCheck";

const SignUpPage = () => {
  const form = useForm<SignUpSchemaTypes>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      fullname: "",
      username: "",
    },
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordForCheck, setPasswordForCheck] = useState("");
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
      toast("Please check your inbox for email verification!", {
        duration: 4000,
        position: "bottom-right",
        style: {
          backgroundColor: "greenyellow",
          color: "#000",
        },
      });
      form.reset();
      navigate("/register");
    } else {
      toast.success("Sign-in successful");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-MainBackgroundColor py-6">
      <div className="px-6">
        <button
          onClick={handleGoBack}
          className=" bg-BtnBgClr rounded-lg w-auto p-1"
        >
          <ArrowLeft color="#000" size={24} />
        </button>
      </div>

      <div className="px-6 mt-4">
        <h1 className="text-2xl text-PrimaryTextColor font-semibold text-center">
          Create your account
        </h1>
        <p className="text-SecondaryTextColor mt-1 text-center">
          Get started with my app, just create an account and enjoy the
          experience.
        </p>
      </div>

      <div className="px-6 mt-6">
        <Form {...form}>
          <form
            className="w-full md:w-[50vw] lg:w-[30vw] space-y-4 text-white"
            onSubmit={form.handleSubmit(formSubmit)}
          >
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Full name</FormLabel>
                  <FormControl>
                    <Input {...field} className="placeholder:text-[#c2c2c2]" />
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
                  <FormLabel className="">Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="placeholder:text-[#c2c2c2]" />
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
                  <FormLabel className="">Email</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center border rounded-md px-3 py-1 h-9">
                      <IoMailOutline color="#c2c2c2" size={24} />
                      <Input
                        placeholder="name@mail.com"
                        autoCapitalize="none"
                        {...field}
                        className="placeholder:text-[#c2c2c2] border-none p-0 focus-visible:ring-0"
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
                  <FormLabel className="">Password</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center border rounded-md px-3 py-1 h-9">
                      <TbLockPassword size={24} color="#dfdfdf" />
                      <Input
                        placeholder="Password"
                        type={passwordVisible ? "text" : "password"}
                        autoCapitalize="none"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setPasswordForCheck(e.target.value);
                        }}
                        className="placeholder:text-[#c2c2c2] bg-transparent border-none px-0 focus-visible:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible((prev) => !prev)}
                      >
                        {passwordVisible ? (
                          <IoEyeOutline size={20} color="#c2c2c2" />
                        ) : (
                          <IoEyeOffOutline size={20} color="#c2c2c2" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />

                  <PasswordCheck
                    isSubmitted={form.formState.isSubmitted}
                    password={passwordForCheck}
                  />
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
    </div>
  );
};

export default SignUpPage;
