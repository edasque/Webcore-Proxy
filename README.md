# Webcore Proxy

## Work In Progress

I am still working things out and will likely will be refactored. This is still very much in development, use at your own risk.

I'll add other types of statsd types (counts at least), maybe support tagging. Direct support for a TSB might be worth doing (Graphite or InfluxDB)

## What does it do?

WebCore has a way to make web request (including a POST with a JSON body) but that's not complete enough to work with statsd, Graphite or Grafana without a proxy. Thus this.

It waits on /gauges for a POST request that contains a JSON document MetricName & MetricValue properties and forwards it to a [statsd](https://github.com/etsy/statsd) server as a auge.

It also waits on /annotations for a POST request that contains a JSON document with tags (still working that part out, ugly code) and a Text and pushes it to the [Grafana annotation API](http://docs.grafana.org/http_api/annotations/#create-annotation)

## Running the proxy

First install dependencies with '''npm install''' or '''yarn install''' while in src. Start with '''npm start''' or '''node index.js'''

Tested on node.js 8.9.x

## TODO
* figure out a good way to handle how [WebCore](https://github.com/ady624/webCoRE) can send tags, its escaping of ```"``` and other fantastic beasts.
* support statsd counters
* better error handling

## Docker

Build the image this way:
```docker build -t webcore-proxy:latest -t webcore-proxy:0.4 .```

and run on docker this way (if you want to keep the external prot to 3000)
```docker run -d -p 3000:3000 --name webcore_proxy webcore-proxy```