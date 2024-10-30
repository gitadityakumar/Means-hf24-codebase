import { NextResponse } from "next/server";
import { getUser } from "@/app/actions/getUser";
require('dotenv').config();

export async function GET() {

    const data =  await getUser();
    const userId = data.userId;
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Prepare the data to be sent to the backend
    const userData = {
        id: userId,
        secret: process.env.SECRET_KEY,
    };

    const backendUrl = process.env.PRIMARY_BACKEND_URL;
    // Send the data to the backend
    try {
        const response = await fetch(`${backendUrl}/api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            console.error('Failed to send user data to backend');
            return new NextResponse('Failed to send user data to backend', { status: 500 });
        }

        const backendResponse = await response.json();
        const message = backendResponse.message;

        return NextResponse.json({ message });
    } catch (error) {
        console.error('Error sending user data to backend:');
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}