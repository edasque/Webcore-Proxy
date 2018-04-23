# Webcore Proxy

## Work In Progress

I am still working things out and will likely will be refactored. This is still very much in development, use at your own risk.

I'll add other types of statsd types (counts at least), maybe support tagging. Direct support for a TSB might be worth doing (Graphite or InfluxDB)

## What does it do?

WebCore has a way to make web request (including a POST with a JSON body) but that's not complete enough to work with statsd, Graphite or Grafana without a proxy. Thus this.

It waits on /gauges for a POST request that contains a JSON document MetricName & MetricValue properties and forwards it to a [statsd](https://github.com/etsy/statsd) server as a auge.

It also waits on /annotations for a POST request that contains a JSON document with tags (still working that part out, ugly code) and a Text and pushes it to the [Grafana annotation API](http://docs.grafana.org/http_api/annotations/#create-annotation)

## TODO
* figure out a good way to handle how [WebCore](https://github.com/ady624/webCoRE) can send tags, its escaping of ```"``` and other fantastic beasts.
* support statsd counters
* better error handling
