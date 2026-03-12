---
title: SugarTrack — IoT Sack Counting System
description: Real-time sugar sack counting system using computer vision and IoT, deployed on a manufacturing production line.
industry: Manufacturing
tech:
  - Golang
  - PostgreSQL
  - MQTT
  - ESP32
  - YOLOv8
  - React
  - TimescaleDB
featured: true
year: 2024
status: production
cover: /images/project-iot.jpg
lang: en
---

## Problem

A sugar packaging factory needed a reliable system to count sugar sacks on their production line in real time. Manual counting was error-prone and created discrepancies between production reports and actual stock.

Key requirements:
- Count sacks as they move down a conveyor
- Integrate with their existing weighbridge system
- Real-time dashboard visible to shift supervisors
- Shift summary reports for management

## Solution

We deployed an **edge computer vision system** with a centralized IoT backend:

- **Camera + ESP32** captures frames and triggers detection events
- **YOLOv8** model runs on an edge GPU to detect and count passing sacks
- **MQTT** publishes count events to the central broker
- **Golang API** ingests, validates, and persists production data
- **React dashboard** shows live count, production rate, and shift totals

## Architecture

```
Camera → YOLOv8 (edge) → ESP32 → MQTT Broker → Golang API → TimescaleDB
                                                                    ↓
                                                         React Dashboard (WebSocket)
```

The edge device uses a lightweight YOLO model optimized for conveyor speed. Count events are published every 200ms.

## Data Model

```sql
CREATE TABLE production_events (
  id          BIGSERIAL PRIMARY KEY,
  line_id     INTEGER NOT NULL,
  shift_id    INTEGER,
  counted_at  TIMESTAMPTZ NOT NULL,
  count       INTEGER NOT NULL DEFAULT 1,
  confidence  FLOAT,
  raw_payload JSONB
);
```

TimescaleDB hypertable partitioned by `counted_at` for efficient time-series queries.

## Impact

- **Zero** manual counting errors on counted lines
- Shift supervisors get **real-time** production visibility
- Management receives **automated shift reports** via email
- 3-minute installation per line after initial setup
