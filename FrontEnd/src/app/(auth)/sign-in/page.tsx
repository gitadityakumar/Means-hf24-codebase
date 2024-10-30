import {  signUpWithGoogle } from "@/lib/server/oauth";
import { createAdminClient, getLoggedInUser } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/server/const";

async function signInWithEmail(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.table({ email, password });

  const { account } = await createAdminClient();
  const session = await account.createEmailPasswordSession(email, password);

  cookies().set(SESSION_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  redirect("/dashboard");
}

export default async function SignInPage() {
  

  return (
    <div className="max-w-lg w-full mx-auto px-6 py-8 bg-violet-50">
      <h1 className="text-3xl font-bold text-violet-900 text-center mb-8">
        Demo sign in
      </h1>
      <div className="mt-6">
        <form className="bg-white rounded-lg shadow-md p-6" action={signInWithEmail}>
          <ul className="space-y-6">
            <li>
              <label className="block text-violet-700 font-medium mb-2" htmlFor="email">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  className="w-full px-4 py-2 border border-violet-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  autoComplete="off"
                />
              </div>
            </li>
            <li>
              <label className="block text-violet-700 font-medium mb-2" htmlFor="password">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  placeholder="Password"
                  minLength={8}
                  type="password"
                  className="w-full px-4 py-2 border border-violet-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-600 hover:text-violet-800"
                  aria-label="show password"
                >
                  <span aria-hidden="true" className="icon-eye" />
                </button>
              </div>
            </li>
            <li>
              <button 
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                type="submit"
              >
                Sign in
              </button>
            </li>
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-violet-300"></div>
              <span className="flex-shrink mx-4 text-violet-600">or</span>
              <div className="flex-grow border-t border-violet-300"></div>
            </div>
          </ul>
        </form>
        <form action={signUpWithGoogle} className="mt-4">
          <button 
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 border border-violet-300 rounded-md flex items-center justify-center gap-2 transition duration-200"
            type="submit"
          >
            <span className="icon-google" aria-hidden="true" />
            <span>Sign in with Google</span>
          </button>
        </form>
      </div>
      <div className="mt-8 text-center">
        <span className="text-violet-700">
          Don&apos;t have an account?{" "}
          <a className="text-violet-600 hover:text-violet-800 underline" href="/sign-up">
            Sign up
          </a>
        </span>
      </div>
    </div>
  );
}