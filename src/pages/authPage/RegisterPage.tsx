import React, { useState } from "react";
import { IoEyeOutline, IoMailOutline, IoEyeOffOutline  } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import RegisterBtn from "../../components/buttons/RegisterBtn";
import toast from "react-hot-toast";
import { supabase } from "../../utils/supabase";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Welcome!')
        navigate("/")
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.message);
      toast.error(err.response?.data?.message || "Log In failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col bg-MainBackgroundColor justify-center items-center px-8">
      <h1 className="text-2xl text-white font-semibold">
        Login to your Account
      </h1>
      <h3 className="text-sm text-[#dadada] font-semibold text-center mt-5">
        Get started with our app, just create an account and enjoy the
        experience.
      </h3>

      <form className="w-full mt-10" onSubmit={handleSubmit}>
        {/* Email Box */}
        <div>
          <label htmlFor="email" className="text-[#dfdfdf] mb-1 font-medium text-lg">Email</label>
          <div className="flex items-center gap-2 border border-[#5e5e5e] rounded-lg py-2 px-3">
            <IoMailOutline color="#c2c2c2" size={20} />
            <input
              placeholder="name@mail.com"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
              type="email"
              required
            />
          </div>
        </div>

        <div className="mt-3">
          <label htmlFor="password" className="text-[#dfdfdf] mb-1 font-medium text-lg">Password</label>
          <div className="flex justify-between border border-[#5e5e5e] rounded-lg py-2 px-3">
            <div className="flex gap-2 items-center">
              <TbLockPassword size={24} color="#dfdfdf" />
              <input
                placeholder="Password"
                id="password"
                name="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoCapitalize="none"
                type={`${passwordVisible ? "text" : "password"}`}
                className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
                required
              />
            </div>

            <button type="button" onClick={() => setPasswordVisible((prev) => !prev)} className="p-1 bg-SecondaryBackgroundColor rounded-md">
              {passwordVisible ? <IoEyeOffOutline color="#fff" /> : <IoEyeOutline color="#fff" />}
            </button>
          </div>
        </div>

        <RegisterBtn btnName="log in" loading={loading} />
      </form>

      <h3 className="text-[#dfdfdf] text-xl my-5 font-semibold"> Or </h3>

      <Link to={"/signUp"} className="text-blue-500 font-medium">
        Create an account?
      </Link>
    </div>
  );
};

export default RegisterPage;
