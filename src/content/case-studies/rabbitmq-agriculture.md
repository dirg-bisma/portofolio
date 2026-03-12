---
title: "Scalable Data Distribution: Implementing RabbitMQ for Indonesian Agriculture"
description: How we decoupled a sugar factory's management system using RabbitMQ, enabling seamless data flow between core and field servers.
client: Confidential (Agriculture Enterprise)
industry: Agriculture
tech:
  - RabbitMQ
  - Golang
  - NGINX
  - MongoDB
  - MariaDB
  - SQLite
date: 2024-03-01
duration: 4 months
outcome: Decoupled, scalable architecture
featured: true
lang: en
---

## Background

The client, a large-scale agriculture company specializing in sugar production, faced significant scalability issues with its integrated management system. The system relied on synchronous communication between the management server (SIMPG) and field/partner servers (MITRA TANI), leading to performance bottlenecks and data inconsistency during peak usage.

## The Challenge

The primary challenge was to handle high system loads while ensuring reliable data distribution across different server environments. The existing architecture suffered from:
- **Tight coupling** — failure in one component affected the entire data pipeline.
- **Latency issues** — synchronous requests between servers slowed down operations.
- **Data inconsistency** — heavy loads often led to lost or duplicated records.

## Our Approach

### Phase 1: Architectural Redesign

We introduced a message broker architecture to decouple the production and consumption of data. RabbitMQ was chosen for its reliability, extensive community support, and robust handling of high-throughput message queues.

### Phase 2: Message Broker Integration

The system was redesigned using the Producer-Consumer pattern:
1. **Producer (SIMPG Server)**: Asynchronously pushes data changes to RabbitMQ exchanges.
2. **Message Broker (RabbitMQ)**: Routes and Persists messages, ensuring they are queued even if consumers are temporarily offline.
3. **Consumer (MITRA TANI Server)**: Subscribes to specific queues and processes data updates at its own pace.

### Phase 3: Multi-Database Strategy

To optimize performance, we implemented a hybrid database strategy:
- **MariaDB/MongoDB** for primary management data.
- **SQLite** for edge/field server caching.
- **Golang services** for high-performance message processing and notification dispatch.

## Results

The new architecture transformed the system's performance and reliability:
- **100% Data Integrity**: RabbitMQ's persistence mechanisms ensured no data loss during network interruptions.
- **Scalability**: The system can now handle 5x more concurrent users without performance degradation.
- **Fault Tolerance**: The decoupled nature allows servers to be maintained or updated independently without system-wide downtime.

## Key Engineering Decisions

**Asynchronous over Synchronous**: Moving to an async model allowed the management server to remain responsive even during heavy data synchronization tasks.

**RabbitMQ for Reliability**: Used dedicated exchanges and persistent queues to guarantee delivery to field servers, even across unreliable industrial network connections.

**NGINX as Gateway**: Implemented NGINX for load balancing and securing the communication between the distributed server components.

## Lessons Learned

1. **Decoupling is Key**: A modular, event-driven architecture is far more resilient to high loads than a monolith.
2. **Monitoring is Essential**: Implementing robust monitoring for message queues is critical to identify and resolve processing bottlenecks proactively.
3. **Plan for Growth**: By choosing a scalable broker like RabbitMQ from the start, we ensured the system can grow with the client's expanding operations.
