---
title: Building IoT Production Monitoring
description: A practical guide to designing industrial IoT monitoring systems — from edge devices to cloud dashboards.
date: 2026-03-11
category: iot
tags:
  - iot
  - golang
  - mqtt
  - esp32
  - architecture
lang: en
---

# Building IoT Production Monitoring

Industrial IoT monitoring requires a clear, layered architecture where each layer has a single responsibility. This article walks through the patterns I've used in real manufacturing deployments.

## The Core Architecture

The foundation of any reliable industrial monitoring system:

```
Edge Device → MQTT Broker → Golang API → PostgreSQL → Dashboard
```

Each component in this chain is independently scalable and replaceable.

## Layer 1: Edge Devices

For most industrial sensor applications, **ESP32** microcontrollers serve as the edge layer. They're cost-effective, support Wi-Fi, and have sufficient processing power for local filtering.

Key responsibilities of the edge layer:
- Read sensor data (temperature, vibration, counters)
- Apply local thresholds before publishing
- Buffer data during network interruptions
- Publish to MQTT on reconnect

**Example firmware loop (simplified):**

```
while true:
  read_sensors()
  if data_changed_significantly():
    publish_mqtt(topic, payload)
  sleep(100ms)
```

## Layer 2: MQTT Broker

MQTT is lightweight enough for constrained devices but powerful enough to handle thousands of concurrent connections. We use topic namespacing to separate machines and data types:

```
factory/{plant_id}/machine/{machine_id}/sensor/{sensor_type}
```

This structure makes wildcard subscriptions trivial and allows per-machine access control.

## Layer 3: Golang API

The backend ingestion service subscribes to MQTT, validates payloads, and persists to PostgreSQL.

Design decisions:
- Use **goroutines** per MQTT topic subscription for parallelism
- **Channel buffering** prevents data loss during DB write spikes
- **TimescaleDB** extension on PostgreSQL for time-series queries

```go
func handleMessage(client mqtt.Client, msg mqtt.Message) {
    payload := parsePayload(msg.Payload())
    go writeToDB(payload) // non-blocking
}
```

## Layer 4: Dashboard

For real-time visualization, **WebSockets** push data from the API to the browser. We avoid polling entirely — latency matters on a production floor.

## Common Pitfalls

1. **Clock drift** — Edge devices need NTP sync or you get out-of-order data
2. **Reconnect storms** — Add jitter to MQTT reconnect logic
3. **Schema rigidity** — Store raw payloads as JSONB alongside structured fields

## Conclusion

The pattern `Edge → MQTT → Golang → TimescaleDB → Dashboard` scales from 10 to 10,000 sensors without architectural changes. Start simple, add buffering and redundancy as you grow.
