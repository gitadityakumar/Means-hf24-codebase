import { Worker } from 'bullmq';
import { QueueOptions, Job } from 'bullmq';
import { processing } from '../controllers/main';
import { getVideoDuration } from '../utils/durationChecker';

const workerOptions: QueueOptions = {
  connection: {
    host: 'localhost',
    port: 6379,
  }
};

// Video processing worker
const videoWorker = new Worker('{video-processing}', async (job: Job) => {
  if (!job) {
    throw new Error('Job is undefined');
  }

  const data = job.data;
  const videoUrl = data.Data[0].url;
  // const mode = data.usage;
  // const model = data.model;
  // const apikey = data.key;
  
  // console.log(`Processing job ${job.id} for video: ${videoUrl}`);

  try {
    // Step 1: Update initial progress to 10%
    await job.updateProgress(10);

    // Step 2: Validate video duration
    const actualDuration = await getVideoDuration(videoUrl);
    const maxDurationInSeconds = 1800; //30 minute of video

    if (actualDuration > maxDurationInSeconds) {
      console.error(
        `Validation failed for Job ${job.id}: Video exceeds maximum allowed duration of 10 minutes.`
      );
      await job.moveToFailed(
        new Error("Video exceeds maximum allowed duration of 10 minutes"),
        "Video exceeds maximum allowed duration"
      );
      return;
    }

    await job.updateProgress(50);

    const progress = async (progress: number) => {
      await job.updateProgress(progress);
    };
    await processing(data, progress);
    await job.updateProgress(100);
  } catch (err) {
    //@ts-ignore
    console.error(`Error processing job ${job.id}:`, err.message);
    //@ts-ignore
    await job.moveToFailed(err, `Job failed during processing: ${err.message}`);
  }
}, workerOptions);


// When job is marked active
videoWorker.on('active', (job: Job) => {
  console.log(`Job ${job.id} is active!`);
});

// When job is completed successfully
videoWorker.on('completed', (job: Job) => {
  console.log(`Job ${job.id} has completed successfully!`);
});



// When job makes progress updates
videoWorker.on('progress', (job: Job) => {
  console.log(`Job ${job.id} is at ${job.progress}% progress.`);
});

// When job fails
videoWorker.on('failed', (job: Job | undefined, err: Error) => {
  if (job) {
    console.log(`Job ${job.id} has failed with error: ${err.message}`);
  } else {
    console.log(`A job failed with error: ${err.message}`);
  }
});

