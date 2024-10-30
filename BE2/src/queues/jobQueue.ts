import { Queue  } from 'bullmq';
import { QueueOptions } from 'bullmq';

// Dragonfly connection options
const queueOptions: QueueOptions = {
  connection: {
    host: 'localhost',  // Dragonfly is running locally
    port: 6379,         // Default Dragonfly port
  }
};


export const jobQueue = new Queue('{video-processing}', queueOptions);



