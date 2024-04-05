function watchdog(endpoint) {
  setInterval(() => {
    fetch(endpoint.url).then((res) =>
      console.log(`${endpoint.url}: ${res.ok}`)
    );
  }, endpoint.timeout_duration);
}

module.exports = {
  watchdog: watchdog,
};
