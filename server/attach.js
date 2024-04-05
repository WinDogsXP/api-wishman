function watchdog(endpoint) {
  setInterval(() => {
    fetch(endpoint.url)
      .then((res) => console.log(`${endpoint.url}: ${res.ok}`))
      .catch(() => {
        console.log(`${endpoint.url}: false`);
      });
  }, endpoint.timeout_duration);
}

module.exports = {
  watchdog: watchdog,
};
