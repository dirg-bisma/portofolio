---
title: Manufacturing ERP
description: Multi-site enterprise resource planning system for a mid-size manufacturing group covering procurement, production, inventory, and finance.
industry: Manufacturing
tech:
  - Golang
  - PostgreSQL
  - React
  - Redis
  - Docker
  - Nginx
featured: true
year: 2023
status: production
cover: /images/project-erp.jpg
lang: en
---

## Overview

A full-cycle ERP system built for a manufacturing conglomerate with 3 production sites and a distribution arm. The system covers the entire operational flow — from supplier purchase orders to customer billing.

## Modules

| Module | Description |
|---|---|
| Procurement | PO, GRN, supplier invoices, 3-way matching |
| Inventory | Multi-warehouse stock, FIFO valuation, stock transfers |
| Production | Work orders, BOM, routing, WIP tracking |
| Sales | Quotations, SO, delivery, customer invoices |
| Finance | General ledger, AR, AP, bank reconciliation |
| HR | Employee records, attendance, leave management |

## Architecture Decisions

**Modular monolith**: All modules share one database but are organized as separate Go packages with explicit boundaries. This avoids the operational complexity of microservices while keeping the codebase organized.

**Event sourcing for inventory**: Every stock movement generates an immutable event. Current stock is a projection. This gives us a complete audit trail and the ability to replay history.

**Redis for locking**: During stock reservations on sales orders, we use distributed locks via Redis to prevent over-selling across concurrent requests.

## Scale

- 85 daily active users across 3 sites
- ~12,000 transactions processed per month
- Sub-100ms response time on all interactive endpoints
- Nightly automated backups with point-in-time recovery configured

## Deployment

```
Nginx (reverse proxy)
  └── Golang API (3 replicas behind load balancer)
        └── PostgreSQL (primary + 1 read replica)
        └── Redis (session + locking)
```

Deployed on a private VPS cluster with Docker Compose. CI/CD via GitHub Actions.
