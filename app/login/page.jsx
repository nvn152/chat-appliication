/* eslint-disable react/no-unescaped-entities */
"use client";

import Loader from "@/components/Loader";
import ToastMessage from "@/components/ToastMessage";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");

  const {
    currentUser,
    loading,
    signUpWithEmailPassword,
    signInWithEmailPassword,
    signInWithGoogle,
    signInWithFacebook,
    signOutUser,
    resetPassword,
  } = useAuth();

  const router = useRouter();

  const handleEmailPasswordSignIn = (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    signInWithEmailPassword(email, password);
  };

  useEffect(() => {
    if (!loading && currentUser) {
      // User Logged In
      router.push("/");
    }
  }, [loading, currentUser]);

  //reset Password
  const handleResetPassword = async () => {
    try {
      if (email) {
        await resetPassword(email);
        toast.success("Reset Password link sent to your Email ID👌", {
          autoClose: 5000,
        });
      } else {
        toast.error("Please enter your email first", {
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("Error: You may have entered the wrong Email ID🤯", {
        autoClose: 5000,
      });
      console.error(error);
    }
  };

  return loading || (!loading && currentUser) ? (
    <Loader />
  ) : (
    <div className="h-[100vh] flex justify-center items-center bg-c1">
      <ToastMessage />
      <div className="flex items-center flex-col">
        <div className="text-center ">
          <div className="text-4xl font-bold">Login to your Account</div>
        </div>
        <div className="mt-3 text-c3 ">
          Connect and chat with anyone anywhere
        </div>
        <div className="flex items-center gap-2 w-full mt-10 mb-5">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]"
            onClick={signInWithGoogle}
          >
            <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 h-full rounded-md">
              <IoLogoGoogle size={24} />
              <span>Login With Google</span>
            </div>
          </div>

          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]"
            onClick={signInWithFacebook}
          >
            <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 h-full rounded-md">
              <IoLogoFacebook size={24} />
              <span>Login With Facebook</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 ">
          <span className="w-5 h-[1px] bg-c3"></span>
          <span className="text-c3 font-semibold ">OR</span>
          <span className="w-5 h-[1px] bg-c3"></span>
        </div>
        <form
          className="flex flex-col items-center gap-3 w-[500px] mt-5"
          action=""
          onSubmit={handleEmailPasswordSignIn}
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none text-c3 px-5"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none text-c3 px-5"
            autoComplete="off"
          />
          <div className="text-right w-full text-c3">
            <span onClick={handleResetPassword} className="cursor-pointer">
              Forget Password?
            </span>
          </div>
          <button className=" mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w ">
            Login to Your Account
          </button>
        </form>

        <div className="flex justify-center text-c3 gap-1 mt-5">
          <span>Don't have an account ?</span>
          <Link
            href="/register"
            className="font-semibold text-white underline underline-offset-2 cursor-pointer"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
