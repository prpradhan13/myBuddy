import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const NotAuthLandingPage = () => {
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        navigate("/signUp");
    }

    const handleLoginClick = () => {
        navigate("/register");
    }

  return (
    <div className="bg-notAuthPageBg h-screen bg-no-repeat bg-cover bg-center relative font-poppins">
      <div className="absolute bottom-0 left-0 right-0 h-[80vh]  bg-gradient-to-t from-[#000] to-transparent">
        <div className="absolute bottom-28 px-6">
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-white font-bold text-2xl"
          >
            MyBuddy
          </motion.h1>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="text-white text-lg my-6 leading-5"
          >
            Welcome, Your fitness journey continues here. Log in to track your
            progress, crush your goals, and stay motivated every step of the
            way. Let’s make every workout count, log in and get started!
          </motion.p>

          <div className="overflow-hidden py-1">
            <motion.div
             initial={{ y: -50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
             className="inline-block"
            >
              <Button onClick={handleSignUpClick} className="bg-white px-5 text-black hover:bg-white hover:text-black font-medium rounded-full">
                Sign Up
              </Button>
            </motion.div>

            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
              className="inline-block ml-4"
            >
              <Button onClick={handleLoginClick} className="border-2 px-5 bg-transparent hover:bg-transparent hover:text-white rounded-full">
                Log in
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAuthLandingPage;
