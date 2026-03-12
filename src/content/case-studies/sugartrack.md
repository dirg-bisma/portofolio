---
title: "SugarTrack: From Manual Counting to Real-Time IoT"
description: How we replaced error-prone manual sack counting with an edge computer vision system that processes 2,000+ sacks per shift.
client: Confidential (Sugar Manufacturer)
industry: Manufacturing
tech:
  - YOLOv8
  - Golang
  - MQTT
  - ESP32
  - TimescaleDB
  - React
  - WebSocket
date: 2024-08-01
duration: 3 months
outcome: 100% count accuracy
featured: true
lang: en
---

## Background

Our client operates a large-scale sugar packaging facility. With 4 active packaging lines running two shifts daily, manual sack counting was consuming significant labor and producing inconsistent results — sometimes off by 3–5% per shift.

Discrepancies between production records and warehouse stock created quarterly reconciliation headaches, and shift supervisors had no real-time view of output.

## The Challenge

The constraints were significant:
- **Dusty environment** — standard cameras needed industrial enclosures
- **Variable lighting** — production floor has mixed natural and artificial light
- **High throughput** — conveyors run at 1 sack/second at peak
- **Zero tolerance for downtime** — any system failure had to fail gracefully to manual backup

## Our Approach

### Phase 1: Detection Research (2 weeks)

We tested 3 approaches:
1. Traditional computer vision (contour detection) — failed at variable lighting
2. YOLOv4 — accurate but slow on budget edge hardware
3. **YOLOv8 nano** — hit our target: >95% accuracy at 30fps on NVIDIA Jetson Nano

We trained a custom model on ~2,000 annotated images from the client's actual line.

### Phase 2: Edge Architecture (3 weeks)

```
[Industrial Camera]
       ↓ RTSP stream
[Jetson Nano — YOLOv8]
       ↓ count event (JSON)
[ESP32 coordinator]
       ↓ MQTT publish
[Cloud MQTT Broker]
       ↓ subscribe
[Golang Ingestion API]
       ↓ write
[TimescaleDB]
```

The ESP32 acts as a coordinator between the Jetson and the MQTT broker, handling reconnect logic and local buffering (up to 10 minutes of data if network drops).

### Phase 3: Backend & Dashboard (4 weeks)

**Golang API** handles:
- MQTT subscription per production line
- Payload validation and deduplication
- Writing to TimescaleDB hypertables
- WebSocket push to dashboard clients
- Shift aggregation and report generation

**React dashboard** features:
- Live counter per line (updates every second)
- Shift progress vs. target
- Historical charts (by hour, by day, by line)
- Automated PDF shift report at shift end

## Results

| Metric | Before | After |
|---|---|---|
| Count accuracy | ~96% (manual) | 99.8% (automated) |
| Report generation | 30 min manual | Automatic at shift end |
| Supervisor visibility | End-of-shift only | Real-time |
| Reconciliation effort | 2 days/quarter | 0 (automatic) |

## Key Engineering Decisions

**TimescaleDB over raw PostgreSQL**: The time-series queries (e.g., "sacks per hour per line over last 30 days") are 40x faster with TimescaleDB's chunk-based indexing.

**Edge buffering**: The ESP32 stores up to 5,000 events in SPIFFS. If the network drops, events are replayed on reconnect in order. No data is lost.

**WebSocket over polling**: The dashboard uses persistent WebSocket connections. The API pushes new counts in real time. No polling, no 1-second delay.

## Lessons Learned

1. **Train on real data** — generic YOLO weights for "object detection" don't work for industrial-specific shapes. Budget time and cost for custom training.
2. **Design for network failure** — assume the network will drop. Build buffering into the edge layer from day one.
3. **Operators need clarity** — the dashboard was initially too detailed. We simplified to 3 numbers per line: current count, shift total, target. Everything else was moved to a secondary view.
