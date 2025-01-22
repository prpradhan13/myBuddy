import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline, IoMailOutline } from "react-icons/io5";
import RegisterBtn from "../../components/buttons/RegisterBtn";
import toast from "react-hot-toast";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { TbLockPassword } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { signUpSchema, SignUpSchemaTypes } from "../../validations/register";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SignUpSchemaTypes>({
    resolver: zodResolver(signUpSchema),
  });

  const [passwordShow, setPasswordShow] = useState(false);
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
      reset();
      navigate("/register");
    } else {
      toast.success("Sign-in successful");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-MainBackgroundColor justify-center items-center px-8">
      <h1 className="text-2xl text-PrimaryTextColor font-semibold">
        Create your Account
      </h1>
      <h3 className="text-sm text-[#dadada] text-center mt-5">
        Get started with our app, just create an account and enjoy the
        experience.
      </h3>

      <form
        onSubmit={handleSubmit(formSubmit)}
        className="w-full mt-10 flex flex-col gap-3"
      >
        {/* Full Name */}
        <div className="">
          <label
            htmlFor="fullname"
            className="text-[#dfdfdf] mb-1 font-medium text-lg"
          >
            Full Name
          </label>
          <div className="flex items-center gap-2 border border-[#5e5e5e] rounded-lg py-2 px-3">
            <input
              {...register("fullname")}
              type="text"
              placeholder="Enter your name"
              id="fullname"
              className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
            />
          </div>
          {errors.fullname && (
            <p className="text-red-500">{`${errors.fullname.message}`}</p>
          )}
        </div>

        {/* Username */}
        <div className="">
          <label
            htmlFor="username"
            className="text-[#dfdfdf] mb-1 font-medium text-lg"
          >
            Username
          </label>
          <div className="flex items-center gap-2 border border-[#5e5e5e] rounded-lg py-2 px-3">
            <input
              {...register("username")}
              type="text"
              placeholder="Enter a Username"
              id="username"
              autoCapitalize="none"
              className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
            />
          </div>
          {errors.username && (
            <p className="text-red-500">{`${errors.username.message}`}</p>
          )}
        </div>

        {/* Email */}
        <div className="">
          <label
            htmlFor="email"
            className="text-[#dfdfdf] mb-1 font-medium text-lg"
          >
            Email
          </label>
          <div className="flex items-center gap-2 border border-[#5e5e5e] rounded-lg py-2 px-3">
            <IoMailOutline color="#c2c2c2" size={20} />
            <input
              {...register("email")}
              type="email"
              placeholder="name@mail.com"
              id="email"
              autoCapitalize="none"
              className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
            />
          </div>
          {errors.email && (
            <p className="text-red-500">{`${errors.email.message}`}</p>
          )}
        </div>

        {/* Password */}
        <div className="">
          <label
            htmlFor="password"
            className="text-[#dfdfdf] mb-1 font-medium text-lg"
          >
            Password
          </label>
          <div className="flex justify-between border border-[#5e5e5e] rounded-lg py-2 px-3">
            <div className="flex gap-2 items-center">
              <TbLockPassword size={24} color="#dfdfdf" />
              <input
                {...register("password")}
                placeholder="Password"
                id="password"
                autoCapitalize="none"
                type={`${passwordShow ? "text" : "password"}`}
                className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
              />
            </div>

            <button
              type="button"
              onClick={() => setPasswordShow((prev) => !prev)}
              className="p-1 bg-SecondaryBackgroundColor rounded-md"
            >
              {passwordShow ? (
                <IoEyeOffOutline color="#fff" />
              ) : (
                <IoEyeOutline color="#fff" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500">{`${errors.password.message}`}</p>
          )}
        </div>

        <RegisterBtn btnName="sign up" loading={isSubmitting} />
      </form>

      <button
        type="button"
        onClick={handleGoBack}
        className="text-blue-500 font-medium mt-5"
      >
        Back to Login
      </button>
    </div>
  );
};

export default SignUpPage;
