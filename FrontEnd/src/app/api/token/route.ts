
import { getCurrentSession } from "@/lib/server/appwrite";

export async function GET() {
  // Use Clerk's `auth` function to retrieve the current user session.
   const sessionId = await getCurrentSession();

  // Check if a session is available
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  // Get the token (you can also specify the type of token here if needed)
  const token = sessionId;
  
  return new Response(JSON.stringify({ token }), {
    status: 200,
  });
}
