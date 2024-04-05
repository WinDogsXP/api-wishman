import prisma from "./util.js";

const intervals = {};

function report_status(status, duration, endpoint) {
  console.log(endpoint);
  prisma.endpointCall
    .create({
      data: {
        endpointId: endpoint.id,
        status_code: status,
        duration: duration,
        status: "G",
      },
    })
    .then((call) => console.log(call.id));
  console.log(`${endpoint.url}: ${status}, time: ${duration}ms`);
}

export function attach_watchdog(endpoint) {
  const interval = setInterval(() => {
    const start_time = Date.now();
    fetch(endpoint.url)
      .then((res) =>
        report_status(res.status, Date.now() - start_time, endpoint)
      )
      .catch(() => {
        report_status(false, Date.now() - start_time, endpoint);
      });
  }, endpoint.interval);
  intervals[endpoint.id] = interval;
}

export function clear_watchdog(endpoint) {
  clearInterval(intervals[endpoint.id]);
}
