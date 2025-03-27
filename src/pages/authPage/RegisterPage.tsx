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
import { Loader2, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RegisterPage = () => {
  const form = useForm<LoginSchemaTypes>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
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

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-MainBackgroundColor justify-center items-center relative">
      <button
        onClick={handleGoBack}
        className="absolute top-8 left-8 bg-[#656565] rounded-lg p-1"
      >
        <ArrowLeft color="#fff" size={24} />
      </button>

      <Card className="w-full max-w-md p-4 shadow-lg bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-center">
            Log in to access your account and continue where you left off.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col">
            <Form {...form}>
              <form
                className="w-full md:w-[50vw] lg:w-[30vw] space-y-2"
                onSubmit={form.handleSubmit(formSubmit)}
              >
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
                            className="placeholder:text-[#c2c2c2] border-none p-0 focus-visible:ring-0 overflow-hidden"
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
                      <FormLabel className="">Password</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center border rounded-md px-3 py-1 h-9">
                          <TbLockPassword size={24} color="#dfdfdf" />
                          <Input
                            placeholder="Password"
                            type={passwordVisible ? "text" : "password"}
                            autoCapitalize="none"
                            {...field}
                            className="placeholder:text-[#c2c2c2] bg-transparent border-none px-0 focus-visible:ring-0"
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordVisible((prev) => !prev)}
                          >
                            {passwordVisible ? (
                              <IoEyeOutline size={20} color="#000" />
                            ) : (
                              <IoEyeOffOutline size={20} color="#000" />
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

            
            <Link
              to={"/forgotPassword"}
              className="text-blue-500 text-center font-medium underline mt-5"
            >
              Forgot Password?
            </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
