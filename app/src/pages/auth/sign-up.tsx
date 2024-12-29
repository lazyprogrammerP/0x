import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const SignUpPage = () => {
  const router = useRouter();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: sign-up api intg

    router.push("/auth/sign-in");
  };

  return (
    <div
      className={
        "w-full min-h-screen flex flex-col items-center justify-center bg-base-300"
      }
    >
      <form
        onSubmit={handleSignUp}
        className={"w-11/12 max-w-2xl p-8 space-y-4 bg-base-100 rounded-md"}
      >
        <input
          type={"email"}
          placeholder={"Email Address"}
          className={"input input-bordered w-full"}
        />

        <input
          type={"password"}
          placeholder={"Password"}
          className={"input input-bordered w-full"}
        />

        <input
          type={"password"}
          placeholder={"Confirm Password"}
          className={"input input-bordered w-full"}
        />

        <button className={"btn btn-accent w-full"}>Sign Up</button>

        <div className={"flex flex-wrap items-center justify-between gap-4"}>
          <Link href={"/auth/sign-in"} className={"text-sm text-base-content"}>
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
