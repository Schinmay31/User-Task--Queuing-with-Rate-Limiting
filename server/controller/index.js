import fs from "fs";

const logs = (logMessage) => {
  console.log(logMessage);

  fs.appendFileSync("./taskLogs.txt", logMessage + "\n", (err) => {
    if (err) {
      console.log(err.message);
    }
  });
};

export const Task = async (user_id) => {
  const message = `${user_id}-task completed at-${Date.now()}`;
  logs(message);
};

