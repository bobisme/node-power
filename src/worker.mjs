import { parentPort, workerData } from "worker_threads";

function performTask(task, data) {
  // Simulate some processing
  if (task === "count") {
    let total = 0;
    for (let i = 0; i < data.times; i++) {
      total += 1;
    }
    return total;
  } else {
    throw new Error("Unknown task");
  }
}

try {
  const result = performTask(workerData.task, workerData.data);
  parentPort.postMessage(result);
} catch (error) {
  parentPort.postMessage({ error: error.message });
}
