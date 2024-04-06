import http from "http";
import prisma from "./util.js";
import { attach_watchdog, clear_watchdog, update_watchdog } from "./attach.js";

function create_dummy_data() {
  prisma.app
    .create({ data: { name: "aplicatie", userId: "plm" } })
    .then((app) => {
      prisma.endpoint
        .create({
          data: {
            url: "http://google.com",
            method: "POST",
            headers: "",
            appId: app.id,
            body: "",
            interval: 100,
            name: "google",
            method: "GET",
          },
        })
        .then((endpoint) => console.log(endpoint.id));
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
            console.log("creating watchdog")
            console.log(endpoint)
            attach_watchdog(endpoint);

          } else if (req.url == "/delete") {
            clear_watchdog(endpoint);
          } else if (req.url == "/update") {
            update_watchdog(endpoint);
          }
          res.writeHead(200);
          res.end("");
        });
        //
      }
    })
    .listen(8080);
}

//create_dummy_data();
start_http_server();
