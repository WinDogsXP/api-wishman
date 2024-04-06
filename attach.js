import prisma from "./util.js";

const intervals = {};

function report_status(status_code, status, duration, endpoint) {
  console.log(endpoint);
  prisma.endpointCall
    .create({
      data: {
        endpointId: endpoint.id,
        statusCode: status_code,
        status: status,
        duration: duration,
      },
    })
    .then((call) => console.log(call.id));
  //prisma.endpoint.update(data{})
  console.log(`${endpoint.url}: ${status}, time: ${duration}ms`);
}

function is_success(status) {
  return status == 200 || status == 302;
}

function to_status(arr) {
  let sum = arr.reduce((prev, curr) => prev + curr, 0);
  if (sum == 0) {
    return "Down";
  } else if (sum < 10) {
    return "Unstable";
  } else {
    return "Stable";
  }
}

export function attach_watchdog(endpoint) {
  const last = Array(10).fill(1); // 1 = success, 0 = failure
  let cycle = 0;
  const interval = setInterval(() => {
    const start_time = Date.now();
    fetch(endpoint.url)
      .then((res) => {
        last[cycle % 10] = is_success(res.status);
        report_status(
          res.status,
          to_status(last),
          Date.now() - start_time,
          endpoint
        );
        cycle++;
      })
      .catch(() => {
        last[cycle % 10] = 0;
        report_status(
          false,
          to_status(last),
          Date.now() - start_time,
          endpoint
        );
        cycle++;
      });
  }, endpoint.interval);
  intervals[endpoint.id] = interval;
}

export function clear_watchdog(endpoint) {
  clearInterval(intervals[endpoint.id]);
}

export function update_watchdog(endpoint) {
  clear_watchdog(endpoint);
  attach_watchdog(endpoint);
}
