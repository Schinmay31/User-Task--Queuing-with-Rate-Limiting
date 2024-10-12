import express from "express";
import bodyParser from "body-parser";
import cluster from "cluster";
import { rateLimiter } from "./controller/rateLimiter.js";

// Check if this process is the primary (master) process for clustering
if (cluster.isPrimary) {
  // Fork two worker processes
  for (let i = 0; i < 2; i++) {
    cluster.fork();
  }
} else {
  const app = express();

  // Parse incoming requests as JSON and URL-encoded data
  app.use(bodyParser.json({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // POST endpoint to handle task requests
  app.post("/api/v1/task", rateLimiter);

  app.listen(3300, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
