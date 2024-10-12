import { RateLimiterRedis } from "rate-limiter-flexible";
import Queue from "bull";
import dotenv from "dotenv";
import { Task } from "./index.js";
import Redis from "ioredis";

dotenv.config(); // Load environment variables from .env file

// Initialize Redis client to connect to Redis server
const redisClient = new Redis({
  host: process.env.HOST,
  port: process.env.PORT,
});

// Set up a rate limiter that allows 20 requests per user per minute
const rateLimitPerMin = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "taskRateLimiter",
  points: 20, // Allow 20 tasks per minute
  duration: 60,
});

// Set up a rate limiter that allows 1 request per user per second
const rateLimitPerSec = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "taskRateLimiterSec",
  points: 1, // Allow 1 task per second
  duration: 1,
});

// Object to store queues for each user
const userQueues = {};

// Function to get or create a queue for each user
const getUserQueue = (user_id) => {
  if (!userQueues[user_id]) {
    // If the queue doesn't already exist, create a new one for the user
    userQueues[user_id] = new Queue(`taskQueue_${user_id}`, {
      redis: { port: process.env.PORT, host: process.env.HOST },   // Connect to Redis
    });

    // Process tasks in the user's queue
    userQueues[user_id].process(async (job) => {
      try {
        await rateLimitPerMin.consume(user_id);          // 20 req/min rate limitter
        await rateLimitPerSec.consume(user_id);          // 1 req/sec rate limitter

        await Task(user_id);                             // For requests who meet above criteria ,call Task function.
      } catch (rateLimiterRes) {
        // If rate limiting is hit, wait for the necessary time before retrying
        const msBeforeNext = rateLimiterRes.msBeforeNext;  
        await new Promise((resolve) => setTimeout(resolve, msBeforeNext)); // Delay processing

        // Re-add the task to the user's queue for later execution
        userQueues[user_id].add({ user_id });
      }
    });
  }

  return userQueues[user_id];
};

export const rateLimiter = async (req, res) => {
  try {
    const user_id = req.body.user_id;

    const userQueue = getUserQueue(user_id);

    userQueue.add({ user_id });

    return res.status(200).json({ message: "Your request has been queued." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
