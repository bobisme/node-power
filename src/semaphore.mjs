export class Semaphore {
  constructor(count = 1) {
    this.count = count;
    this.tasks = [];

    this.schedule = () => {
      if (this.count > 0 && this.tasks.length > 0) {
        this.count--;
        let next = this.tasks.shift();
        if (next === undefined) {
          throw "Unexpected undefined value in tasks list";
        }

        next();
      }
    };
  }

  acquire() {
    return new Promise((res, _rej) => {
      let task = () => {
        let released = false;
        res(() => {
          if (!released) {
            released = true;
            this.count++;
            this.schedule();
          }
        });
      };
      this.tasks.push(task);
      if (process && process.nextTick) {
        process.nextTick(this.schedule.bind(this));
      } else {
        setImmediate(this.schedule.bind(this));
      }
    });
  }
}
