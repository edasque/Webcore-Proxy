const express = require("express");
const app = express();
var bodyParser = require("body-parser");

const fetch = require("node-fetch");
const configPath = require.resolve('./config.json');

const readConfig = require('read-config');
const config = readConfig(configPath);

const httpTransport = require("https")
const responseEncoding = "utf8"

var annotations = {
  path: "/api/annotations",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
}

var SDC = require("statsd-client"),
  sdc = new SDC({ host: config.statsd.statsdHost, port: config.statsd.statsdPort, debug: config.statsd.statsdDebug });

// parse application/json
app.use(bodyParser.json())

app.get("/", (req, res) => res.sendStatus(404));

// POST method route for /Gauge
// JSON payload should look like this
// {
//   "metricName": "iot.webcore.device.blink-outside-1.temperature",
//   "metricValue": 23
// }

app.post("/gauge", function(req, res) {
  console.log("Gauge:");
  console.log(req.body);
  const JSONbody = req.body;
  const metricValue = JSONbody.metricValue;
  const metricName = JSONbody.metricName;

  if (!isNaN(metricValue) && metricName) {
    sdc.gauge(metricName, metricValue);
    res.send("OK");
  } else {
    res.sendStatus(422);
  }
});
app.post("/annotations", function(req, res) {
  console.log("Annotation:")
  console.log(req.body);
  const JSONbody = req.body
  const tags = JSONbody.tags
  const text = JSONbody.text

  // console.log("Tags:")
  // console.dir(tags)

  // console.log("Text:")
  // console.dir(text)

  if (text && tags) {
    res.send("OK")
    var body = {
      time: Date.now(),
      tags: tags,
      text: text
    }
    // console.log("body:")
    // console.dir(body)
    // console.log("body in JSON:")
    // console.log(JSON.stringify(body))

    annotations.headers.Authorization = config.annotations.grafana_Authorization

    fetch(
      config.annotations.protocol + "://" + config.annotations.hostname + ":" + config.annotations.port + annotations.path,
      {
        method: annotations.method,
        body: JSON.stringify(body),
        headers: annotations.headers
      }
    )
      .then(res => res.json())
      .then(json => {
        console.log("Response from Grafana:")
        console.log(json)
      })
      .catch(err => console.error(err))

  } else {
    res.sendStatus(422)
  }
});

app.listen(config.serverPort, () =>
  console.log(`Webcore Proxy listening on port ${config.serverPort}!`)
);
