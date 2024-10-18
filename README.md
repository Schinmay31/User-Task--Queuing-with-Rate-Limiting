# Rate Limiting and Task Queuing System

This Node.js project implements a rate-limiting and task-queuing system using Redis and Bull. The system dynamically creates separate queues for each user, applies rate limits (both per-second and per-minute), and processes tasks asynchronously.

## Features

- **Per-User Task Queues:** Each user has their own dedicated task queue created dynamically.
- **Rate Limiting:** Limits tasks to 1 per second and 20 per minute per user.
- **Asynchronous Task Processing:** Tasks are processed asynchronously without blocking other users.
- **Redis-Backed:** Uses Redis for both rate limiting and task queue storage.

## Technologies Used

- **Node.js**: JavaScript runtime used for backend development.
- **Express.js**: Web framework for building APIs.
- **Redis**: In-memory data store used for rate limiting and task queue management.
- **Bull**: Redis-backed job queue for handling asynchronous tasks.
- **rate-limiter-flexible**: Library used to implement flexible rate limiting rules
- **dotenv**: To manage environment variables.

## Getting Started

### Prerequisites

Ensure that you have the following installed:

- [Node.js](https://nodejs.org/en/)
- [Redis](https://redis.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <server>
2. Install dependencies:
   ```bash
   npm install
3. Set up your environment variables by creating a .env file: 
   ```bash
   HOST=<Redis Host>
   PORT=<Redis Port>
4. Make sure Redis is running on your machine or point the .env to your Redis server.
   
5. Start the application:
```bash
 node index.js


