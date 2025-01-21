import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline, IoMailOutline } from "react-icons/io5";
import RegisterBtn from "../../components/buttons/RegisterBtn";
import toast from "react-hot-toast";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
        console.log(formData);
        
        const { data: {session}, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullname,
                    username: formData.username
                }
            }
        })

        if (error) {
            console.log("Error during sign-up:", error.message);
            toast.error(error.message || "Error during sign-up");
          } else if (!session) {
            toast.success("Please check your inbox for email verification!");
            navigate("/register");
            console.log(session);
          } else {
            toast.success("Sign-in successful");
          }
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error);
        toast.error(error.message || "Sign Up failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-MainBackgroundColor justify-center items-center px-8">
      <h1 className="text-2xl text-white font-semibold">Create your Account</h1>
      <h3 className="text-sm text-[#dadada] font-semibold text-center mt-5">
        Get started with our app, just create an account and enjoy the
        experience.
      </h3>

      <form className="w-full mt-10 flex flex-col gap-3" onSubmit={handleSubmit}>
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
              placeholder="Enter your name"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
              type="text"
              required
            />
          </div>
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
              placeholder="Enter a Username"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoCapitalize="none"
              className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
              type="text"
              required
            />
          </div>
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
              placeholder="name@mail.com"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoCapitalize="none"
              className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
              type="email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="">
          <label htmlFor="password" className="text-[#dfdfdf] mb-1 font-medium text-lg">
            Password
          </label>
          <div className="flex justify-between border border-[#5e5e5e] rounded-lg py-2 px-3">
            <div className="flex gap-2 items-center">
              <input
                placeholder="Password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoCapitalize="none"
                type={`${passwordShow ? "text" : "password"}`}
                className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
                required
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
        </div>

        <RegisterBtn btnName="sign up" loading={loading} /> 
      </form>
    </div>
  );
};

export default SignUpPage;
