"use server";
import { Client, Account } from "node-appwrite";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./const";
import { redirect } from "next/navigation";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const session = cookies().get(SESSION_COOKIE);
  if (!session || !session.value) {
    redirect("/sign-up");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function getCurrentSession() {
  try {
    const sessionCookie = cookies().get(SESSION_COOKIE);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const { account } = await createSessionClient();
    const sessionDetails = await account.getSession(sessionCookie.value);
    return sessionDetails;
  } catch (error) {
    return null;
  }
}