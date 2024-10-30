import mongoose, { Schema, Document } from 'mongoose';

interface IVideo extends Document {
  title: string;
  thumbnailUrl: string;
  duration: string;
  processingDate: Date;
  models: string | null;
  usage: string;
  userId: string;  // Clerk user ID to associate the video with a user
  initialData: mongoose.Types.ObjectId[]; // Array of references to InitialData
}

const videoCardSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  processingDate: {
    type: Date,
    default: Date.now
  },
  models: {
    type: String,
    default: null
  },
  usage: {
    type: String,
    required: true
  },
  userId: {
    type: String, // Clerk user ID
    required: true
  },
  initialData: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InitialData' // Reference to InitialData documents
  }]
});

const VideoCard = mongoose.model<IVideo>('VideoCard', videoCardSchema);
export default VideoCard;
