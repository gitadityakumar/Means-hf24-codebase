// import { connectToDatabase } from "@/lib/mongodb"
// import { NextRequest, NextResponse } from "next/server"
// // import {  auth } from "@clerk/nextjs/server";

// export async function GET(req: NextRequest) {
//   try {
//     const { userId } = auth();
    
//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const { db } = await connectToDatabase()
    
//     const videos = await db
//       .collection('videoData')
//       .find(
//         {
//            processed: false,
//            userId: userId
//         }
//       )
//       .toArray()

//       if (videos.length === 0) {
//         return NextResponse.json({ message: "No data found", hasExtension: false }, { status: 200 })
//       }

//       return NextResponse.json({ videos, hasExtension: true }, { status: 200 })
//   } catch (error) {
//     console.error('Error fetching videos:', error)
//     return NextResponse.json({ error: 'Error fetching videos' }, { status: 500 })
//   }
// }

// export async function OPTIONS(req: NextRequest) {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Allow': 'GET'
//     }
//   })
// }

// export async function POST(req: NextRequest) {
//   return methodNotAllowed(req)
// }

// export async function PUT(req: NextRequest) {
//   return methodNotAllowed(req)
// }

// export async function DELETE(req: NextRequest) {
//   return methodNotAllowed(req)
// }

// function methodNotAllowed(req: NextRequest) {
//   return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 })
// }