import prisma from "./util.js";

const intervals = {};

function is_success(status) {
  return status == 200 || status == 302;
}

function to_status(arr, cycle) {
  let sum = arr.reduce((prev, curr) => prev + curr, 0);
  if (sum == 0) {
    return "Down";
  } else if (sum < (10 < cycle ? 10 : cycle)) {
    return "Unstable";
  } else {
    return "Stable";
  }
}

async function report_status(
  status_code,
  status,
  duration,
  endpoint,
  response_body,
  response_header
) {
  const body = !!response_body ? await response_body.text() : "";
  const header = !!header
    ? JSON.stringify(Object.fromEntries([...response_header]))
    : "";
  //console.log(status, status_code, header);
  prisma.endpointCall
    .create({
      data: {
        endpointId: endpoint.id,
        statusCode: status_code,
        status: status,
        duration: duration,
        responseBody: body,
        responseHeader: header,
      },
    })
    .then((call) => console.log(call.id));
  prisma.endpoint.update({
    where: {
      id: endpoint.id,
    },
    data: {
      status: status,
    },
  });
  console.log(`${endpoint.url}: ${status}, time: ${duration}ms`);
}

export function attach_watchdog(endpoint) {
  const last = Array(10).fill(0); // 1 = success, 0 = failure
  let cycle = 0;
  const interval = setInterval(() => {
    const start_time = Date.now();
    fetch(endpoint.url, {
      method: endpoint.method,
      headers: endpoint.headers,
      body: endpoint.body,
    })
      .then((res) => {
        last[cycle % 10] = is_success(res.status);
        report_status(
          res.status,
          to_status(last, cycle),
          Date.now() - start_time,
          endpoint,
          res,
          res.headers
        );
        cycle++;
      })
      .catch((e) => {
        console.log(e);
        last[cycle % 10] = 0;
        report_status(
          500,
          to_status(last, cycle),
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
