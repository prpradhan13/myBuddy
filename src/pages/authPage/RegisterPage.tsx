import { useState } from "react";
import { IoEyeOutline, IoMailOutline, IoEyeOffOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import RegisterBtn from "../../components/buttons/RegisterBtn";
import toast from "react-hot-toast";
import { supabase } from "../../utils/supabase";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaTypes } from "../../validations/register";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchemaTypes>({
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
      reset();
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

      <form className="w-full mt-10" onSubmit={handleSubmit(formSubmit)}>
        {/* Email Box */}
        <div>
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
              placeholder="name@mail.com"
              id="email"
              autoCapitalize="none"
              className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
              type="email"
            />
          </div>
          {errors.email && (
            <p className="text-red-500">{`${errors.email.message}`}</p>
          )}
        </div>

        <div className="mt-3">
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
                type={`${passwordVisible ? "text" : "password"}`}
                className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
              />
            </div>

            <button
              type="button"
              onClick={() => setPasswordVisible((prev) => !prev)}
              className="p-1 bg-SecondaryBackgroundColor rounded-md"
            >
              {passwordVisible ? (
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

        <RegisterBtn btnName="log in" loading={isSubmitting} />
      </form>

      <h3 className="text-[#dfdfdf] text-xl my-5 font-semibold"> Or </h3>

      <Link to={"/signUp"} className="text-blue-500 font-medium">
        Create an account?
      </Link>
    </div>
  );
};

export default RegisterPage;
