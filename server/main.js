var http = require("http");
var attach = require("./attach.js");

function start_http_server() {
  http
    .createServer(function (req, res) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("Hello World!");
    })
    .listen(8080);
}

function start_watching_endpoints() {
  const endpoints = [
    { url: "http://googler.com", timeout_duration: 1000 },
    { url: "http://microsoft.com", timeout_duration: 1000 },
  ];

  for (endpoint of endpoints) {
    attach.watchdog(endpoint);
    console.log(endpoint);
  }
}

start_watching_endpoints();
