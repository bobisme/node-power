import { test } from "node:test";
import assert from "assert";
import { Semaphore } from "../src/semaphore.mjs"; // Ensure the path is correct

test("Semaphore acquires and releases correctly", async () => {
  const semaphore = new Semaphore(2);
  const release1 = await semaphore.acquire();
  const release2 = await semaphore.acquire();

  assert.strictEqual(
    semaphore.count,
    0,
    "Semaphore count should be 0 after two acquires",
  );

  release1();
  assert.strictEqual(
    semaphore.count,
    1,
    "Semaphore count should be 1 after one release",
  );

  release2();
  assert.strictEqual(
    semaphore.count,
    2,
    "Semaphore count should be 2 after two releases",
  );
});

test("Semaphore limits concurrent tasks correctly", async () => {
  const semaphore = new Semaphore(1);

  const results = [];

  const task = async (id) => {
    const release = await semaphore.acquire();
    results.push(`start ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 20)); // Simulate async task
    results.push(`end ${id}`);
    release();
  };

  const task1 = task(1);
  const task2 = task(2);

  await Promise.all([task1, task2]);

  assert.deepStrictEqual(
    results,
    ["start 1", "end 1", "start 2", "end 2"],
    "Tasks should run sequentially",
  );
});

test("Semaphore handles more tasks than initial count", async () => {
  const semaphore = new Semaphore(2);

  const results = [];

  const task = async (id) => {
    const release = await semaphore.acquire();
    results.push(`start ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 20)); // Simulate async task
    results.push(`end ${id}`);
    release();
  };

  const task1 = task(1);
  const task2 = task(2);
  const task3 = task(3);
  const task4 = task(4);

  await Promise.all([task1, task2, task3, task4]);

  assert.strictEqual(results.length, 8, "All tasks should complete");
  assert(results.indexOf("start 1") < results.indexOf("end 1"));
  assert(results.indexOf("start 2") < results.indexOf("end 2"));
  assert(results.indexOf("start 3") < results.indexOf("end 3"));
  assert(results.indexOf("start 4") < results.indexOf("end 4"));
});
