# Node Power

Testing out modern node.js features.

- clustering
- worker threads
- node tests

## Benches

### Without cluster

```shell
❯ just bench
Beginning round 1...
Benchmarking 100 connections @ http://127.0.0.1:3000/slow for 10 second(s)
  Latencies:
    Avg      Stdev    Min      Max
    3993.04ms  2279.92ms  985.32ms  7909.36ms
  Requests:
    Total:    6    Req/Sec:  0.60
  Transfer:
    Total: 1.45 KB Transfer Rate: 148.31 B/Sec
```

### With cluster

```shell
❯ just bench
Beginning round 1...
Benchmarking 100 connections @ http://127.0.0.1:3000/slow for 10 second(s)
  Latencies:
    Avg      Stdev    Min      Max
    567.80ms  241.12ms  58.21ms  2569.70ms
  Requests:
    Total:  1695   Req/Sec: 169.74
  Transfer:
    Total: 407.20 KB Transfer Rate: 40.78 KB/Sec
```

### With workers

```shell
❯ rewrk -h http://127.0.0.1:3000/slow-worker -t 12 -c 100 -d 10s
Beginning round 1...
Benchmarking 100 connections @ http://127.0.0.1:3000/slow-worker for 10 second(s)
  Latencies:
    Avg      Stdev    Min      Max
    737.42ms  303.28ms  170.64ms  1701.99ms
  Requests:
    Total:  1298   Req/Sec: 129.91
  Transfer:
    Total: 328.30 KB Transfer Rate: 32.86 KB/Sec
```
