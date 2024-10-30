import { raw, Request, Response } from "express";
import  { fetchUserById } from "../middlewares/auth";
import { jobQueue } from "../queues/jobQueue";

// Enqueue video processing job
export const processVideo = async (req: Request, res: Response) => {
  try {
    const Data = req.body.videoData;
    const videoData = Data[0];
    const rawData = req.body;
     console.log(rawData);
    const usage = rawData.usage;
    const model = rawData.model;
    const key = rawData.apikey;
    // const authHeader = req.headers["authorization"];
    //  console.log(authHeader);

    if (!videoData || !videoData.userId) {
      return res.status(400).send("Bad Request: Missing video data or userID");
    }
    // auth
    const id = videoData.userId;
    const user = await fetchUserById(id);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    // const token = await verifyUserToken(authHeader);
    // if (!token) {
    //   console.log("Session invalid");
    //   return res.status(401).send("Session invalid");
    // }

    // Add a job to the queue
    const job = await jobQueue.add(
      "video-job",
      {
        Data,
        usage: usage,
        model: model,
        key:key
      },
      {
        removeOnComplete: {
          age: 200,
          count: 1000,
        },
      }
    );

    return res.status(200).json({
      message: "Video submitted for processing, pending validation!",
      jobId: job.id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to enqueue job" });
  }
};

// Get job status by ID (polling approach)
export const getJobStatus = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    const job = await jobQueue.getJob(jobId);

    // Check if the job exists
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Get job progress and state
    const jobState = await job.getState();
    const jobProgress = job.progress;

    // Common response structure
    const response = {
      jobId,
      status: jobState,
      progress: jobProgress,
    };

    // Handle the different job states
    switch (jobState) {
      case "waiting":
        return res.status(200).json({
          ...response,
          message: "Job is in the queue, waiting to be processed.",
        });

      case "active":
        return res.status(200).json({
          ...response,
          message: "Job is actively being processed.",
        });

      case "completed":
        const result = await job.returnvalue;
        return res.status(200).json({
          ...response,
          result,
          message: "Job has been completed successfully.",
        });

      case "failed":
        return res.status(500).json({
          ...response,
          error: job.failedReason,
          message: "Job has failed.",
        });

      case "delayed":
        return res.status(200).json({
          ...response,
          message: "Job is delayed and waiting to be processed.",
        });

      case "unknown":
        return res.status(200).json({
          ...response,
          message: "Job status is unknown or the job may have been cancelled.",
        });

      default:
        return res.status(200).json({
          ...response,
          message: "Job status is not recognized.",
        });
    }
  } catch (err) {
    console.error("Error retrieving job status:", err);
    return res.status(500).json({ error: "Error retrieving job status" });
  }
};



// Dummy health-check method
export const healthCheck = (req: Request, res: Response) => {
  return res.status(200).send("OK");
};

export default {
  processVideo,
  getJobStatus,
  healthCheck,
  // processVideo,
};
