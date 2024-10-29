"use server";
import { createSessionClient } from "@/lib/server/appwrite";
import { SESSION_COOKIE } from "@/lib/server/const";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


 export async function signOut() {


  const { account } = await createSessionClient();

  cookies().delete(SESSION_COOKIE);
  await account.deleteSession("current");

  redirect("/sign-in");
}