import os from "os";
import { Worker } from "worker_threads";
import { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import { Semaphore } from "./semaphore.mjs";

const PORT = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

let app = express();

let semaphore = new Semaphore(2);

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    semaphore.acquire().then((release) => {
      const worker = new Worker(__dirname + "/worker.mjs", { workerData });

      worker.on("message", (data) => {
        resolve(data);
        release();
      });
      worker.on("error", (err) => {
        reject(err);
        release();
      });
      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
        release();
      });
    });
  });
}

app.get("/slow", (req, res) => {
  let total = 0;
  for (let i = 0; i < 100_000_000; i++) {
    total += 1;
  }
  res.send(`/slow totalled ${total}`);
});

app.get("/slow-worker", async (req, res) => {
  let count = await runWorker({ task: "count", data: { times: 100_000_000 } });
  res.send(`/slow-worker totalled ${count}`);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}, pid = ${process.pid}`);
});
