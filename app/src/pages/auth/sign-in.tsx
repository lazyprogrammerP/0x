import Link from "next/link";
import { useRouter } from "next/router";

const SignInPage = () => {
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: sign-in api intg

    router.push("/dashboard/overview");
  };

  return (
    <div
      className={
        "w-full min-h-screen flex flex-col items-center justify-center bg-base-300"
      }
    >
      <form
        onSubmit={handleSignIn}
        className={"w-11/12 max-w-2xl p-8 space-y-4 bg-base-100 rounded-2xl"}
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

        <button className={"btn btn-accent w-full"}>Sign In</button>

        <div className={"flex flex-wrap items-center justify-between gap-4"}>
          <Link
            href={"/auth/reset-password"}
            className={"text-sm text-base-content"}
          >
            Forgot your password?
          </Link>

          <Link href={"/auth/sign-up"} className={"text-sm text-base-content"}>
            Don&apos;t have an account?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
