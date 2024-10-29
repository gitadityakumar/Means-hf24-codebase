import { currentUser, auth } from "@clerk/nextjs/server";

export const getUserId = () => auth().userId;
export const getUser = () => currentUser();