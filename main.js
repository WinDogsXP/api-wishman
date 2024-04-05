import http from "http";
import prisma from "./util.js";
import { attach_watchdog, clear_watchdog } from "./attach.js";

function create_dummy_data() {
  prisma.user
    .create({ data: { email: "asdasd123@mata.com", name: "asd" } })
    .then((dev) => {
      prisma.app
        .create({ data: { userId: dev.id, name: "aplicatie" } })
        .then((app) => {
          prisma.endpoint
            .create({
              data: {
                url: "http://google.com",
                // method: "GET",
                headers: "",
                appId: app.id,
                body: "",
                interval: 100,
                isBugged: false,
              },
            })
            .then((endpoint) => console.log(endpoint.id));
        });
    });
}

function start_http_server() {
  http
    .createServer(function (req, res) {
      if (req.method == "POST") {
        const body = [];
        req.on("data", (chunk) => {
          body.push(chunk);
        });
        req.on("end", () => {
          let parsedBody = Buffer.concat(body).toString();
          console.log(parsedBody);
          const endpoint = JSON.parse(parsedBody);
          if (req.url == "/create") {
            attach_watchdog(endpoint);
          } else if (req.url == "/delete") {
            clear_watchdog(endpoint);
          }
          res.writeHead(200);
          res.end("");
        });
        //
      }
    })
    .listen(8080);
}

// function start_watching_endpoints(endpoints) {
//   for (let endpoint of endpoints) {
//     attach_watchdog(endpoint);
//     console.log(endpoint);
//   }
// }
// const endpoints = [
//   { url: "http://googler.com", timeout_duration: 1000 },
//   { url: "http://microsoft.com", timeout_duration: 1000 },
// ];
//start_watching_endpoints(endpoints);

//create_dummy_data();
start_http_server();