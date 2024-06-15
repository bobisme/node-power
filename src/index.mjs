import cluster from "cluster";
import os from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cpuCount = os.cpus().length;

console.log(`pid=${process.pid} running ${cpuCount} threads`);

cluster.setupPrimary({
  exec: __dirname + "/app.mjs",
});

for (let i = 0; i < cpuCount; i++) {
  cluster.fork();
}

cluster.on("exit", (worker, _code, _signal) => {
  console.log(`worker ${worker.process.pid} died, starting new worker`);
  cluster.fork();
});
