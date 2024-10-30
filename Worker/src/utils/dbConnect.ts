// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();

// const MONGODB_URI = process.env.DB_URL || " ";

// const dbConnect = async (): Promise<void> => {
//   if (mongoose.connection.readyState >= 1) {
//     return;
//   }

//   try {
//     await mongoose.connect(MONGODB_URI); 
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     throw error;
//   }
// };

// export default dbConnect;
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.DB_URL || '';

const dbConnect = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'videoDataDB', // Explicitly set the database name
    } as ConnectOptions);
    console.log('Connected to MongoDB - videoDataDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export default dbConnect;
