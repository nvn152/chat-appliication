"use client";

import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";

function Register() {
  const router = useRouter();
  const {
    loading,
    currentUser,
    signUpWithEmailPassword,
    signInWithEmailPassword,
    signInWithGoogle,
    signInWithFacebook,
  } = useAuth();

  const handleEmailPasswordSignUp = async (e) => {
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    console.log(email, password);

    await signUpWithEmailPassword(email, password, displayName);
    router.push("/");
  };

  useEffect(() => {
    if (!loading && currentUser) {
      // User Logged In
      router.push("/");
    }
  }, [loading, currentUser]);
  return loading || (!loading && currentUser) ? (
    <Loader />
  ) : (
    <div className="h-[100vh] flex justify-center items-center bg-c1">
      <div className="flex items-center flex-col">
        <div className="text-center ">
          <div className="text-4xl font-bold">Create a New Account</div>
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
              <span>Sign Up with Google</span>
            </div>
          </div>

          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]"
            onClick={signInWithFacebook}
          >
            <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 h-full rounded-md">
              <IoLogoFacebook size={24} />
              <span>Sign Up with Facebook</span>
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
          onSubmit={handleEmailPasswordSignUp}
        >
          <input
            type="text"
            placeholder="Display Name"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none text-c3 px-5"
            autoComplete="off"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none text-c3 px-5"
            autoComplete="off"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none text-c3 px-5"
            autoComplete="off"
          />

          <button className=" mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w ">
            Sign Up
          </button>
        </form>

        <div className="flex justify-center text-c3 gap-1 mt-5">
          <span>Already have an account</span>
          <Link
            href="/login"
            className="font-semibold text-white underline underline-offset-2 cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
