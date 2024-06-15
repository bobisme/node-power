@bench:
  rewrk -h http://127.0.0.1:3000/slow -t 12 -c 100 -d 10s

@test:
  node --test
