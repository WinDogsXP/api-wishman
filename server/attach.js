function report_status(status, endpoint) {
  console.log(status);
}

function watchdog(endpoint) {
  setInterval(() => {
    fetch(endpoint.url)
      .then((res) => report_status(res.status, endpoint))
      .catch(() => {
        report_status(false);
      });
  }, endpoint.timeout_duration);
}

module.exports = {
  watchdog: watchdog,
};

