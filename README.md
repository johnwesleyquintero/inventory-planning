# 📦 Inventory Planning — Hungry Artisan

A comprehensive inventory management and replenishment system for **Hungry Artisan**, built with React + Vite + Tailwind CSS, using Google Sheets as the database via Google Apps Script.

![Status](https://img.shields.io/badge/status-active-success) ![React](https://img.shields.io/badge/React-18.2-61dafb) ![Vite](https://img.shields.io/badge/Vite-6.x-646cff) ![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06b6d4)

---

## 🎯 Overview

This application supports Wesley Quintero's operational workstream at Hungry Artisan, providing end-to-end visibility across:

- **Inventory** across all marketplaces (US, CA, UK) and fulfillment channels (FBA, AWD, WFS, FBT)
- **Sales velocity tracking** and **days-of-cover** forecasting
- **Inbound shipment pipeline** monitoring
- **Freight forwarder quoting** and **total cost of ownership** analysis (R7)
- **Project milestone tracking** for operational stabilization

The system is designed to run **independently** — surfacing reorder triggers proactively, tracking inbound inventory without prompting, and maintaining accurate marketplace records.

---

## ✨ Features

### 📊 Dashboard
- Real-time KPIs: total units on hand, critical SKUs, active shipments, high-priority reorders
- Inventory distribution by fulfillment channel
- Sales velocity trends
- Inventory health pie chart
- Active shipment pipeline summary
- Upcoming milestones tracker

### 📦 Inventory Management
- Full visibility across FBA (US, CA, UK), AWD, WFS, and FBT
- Search and filter by SKU, ASIN, channel, marketplace, and status
- Real-time status indicators (healthy / warning / critical / overstock)
- Days of cover with color-coded thresholds

### 📈 Forecasting & Replenishment
- Core logic: `Sales Velocity + Current Stock + Inbound Inventory + Lead Time → Reorder Window`
- Weekly velocity trend charts
- Days-of-cover vs lead time comparison
- Proactive reorder triggers
- Recommended actions: Transfer / FBA Shipment / Supplier Reorder

### 🚚 Shipments & Inbound Pipeline
- Visual pipeline: At Supplier → On Water → At Port → En Route → Arrived → Received
- Shipment cards with full details (quantity, carrier, route, ETA, tracking)
- Filterable pipeline view

### 🚢 Logistics Optimization (R7)
- Multi-forwarder quoting framework (AGL, Flexport, Freightos, SSD Logistix)
- Total Cost of Ownership analysis
- Amazon ecosystem benefits quantification:
  - Inbound placement fee waivers (~$0.27–$1.58/unit)
  - AGL discount (10–20%)
  - AWD auto-replenishment value
- R7 milestone tracker (Oct / Nov / Dec)

### 🎯 Projects & Milestones
- Workstream relationship diagram (Demand → Supply Planning → Inventory Ops → Replenishment → Logistics → TCO → 2027 Decision)
- Progress tracking across all workstreams
- Operational end-state checklist

### ⚙️ Settings
- Google Sheets connection configuration
- Ready-to-deploy Google Apps Script code
- Sheet structure documentation
- Data flow visualization

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.2 |
| Build Tool | Vite 6.x |
| Styling | Tailwind CSS 4.x |
| Charts | Recharts |
| Icons | Lucide React |
| Database | Google Sheets |
| API Layer | Google Apps Script |
| Routing | React Router DOM |
| Animations | Framer Motion |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Google account (for Sheets integration)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd inventory-planning

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

---

## 📊 Google Sheets Integration

The app uses Google Sheets as its database, with Google Apps Script acting as the API layer.

### Step 1: Create Your Google Sheet

Create a new Google Spreadsheet with the following tabs (sheets):

| Tab Name | Purpose |
|----------|---------|
| `Inventory` | Stock levels by SKU/marketplace |
| `InboundShipments` | Shipment pipeline tracking |
| `Forecast` | Velocity and reorder forecasting |
| `FreightQuotes` | Forwarder quotes and TCO |
| `Milestones` | Project milestone tracking |

### Step 2: Deploy the Apps Script

1. Open your Google Spreadsheet
2. Go to **Extensions → Apps Script**
3. Delete any existing code
4. Paste the script from **Settings → Google Apps Script Setup** in the app (or use the one below)
5. Click **Deploy → New deployment**
6. Select type: **Web app**
7. Set "Execute as": **Me**
8. Set "Who has access": **Anyone**
9. Click **Deploy** and copy the Web App URL

### Step 3: Configure the App

1. Open the app and go to **Settings**
2. Paste your **Spreadsheet ID** (from the URL)
3. Paste your **Apps Script Web App URL**
4. Click **Save Configuration**
5. Click **Test Connection** to verify

### Apps Script Code

The complete Apps Script code is available in-app under **Settings**. It supports:
- `test` — verify connection
- `read` — fetch all rows from a sheet
- `write` — append new rows
- `update` — update a record by ID
- `delete` — remove a record by ID

You can also run `initializeSheets()` in the Apps Script editor to auto-create all tabs with headers.

---

## 📁 Project Structure

```
inventory-planning/
├── public/
│   └── favicon.svg              # App favicon
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   └── StatusBadge.tsx      # Reusable status badge
│   ├── pages/
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── Inventory.tsx        # Inventory management
│   │   ├── Forecasting.tsx      # Forecasting & replenishment
│   │   ├── Shipments.tsx        # Shipment pipeline
│   │   ├── Logistics.tsx        # R7 logistics optimization
│   │   ├── Projects.tsx         # Milestone tracking
│   │   └── Settings.tsx         # Google Sheets config
│   ├── services/
│   │   └── googleSheets.ts      # Sheets API service + mock data
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tsconfig.json
└── README.md
```

---

## 📋 Data Model

### InventoryItem
Tracks stock levels per SKU/marketplace/channel.

| Field | Type | Description |
|-------|------|-------------|
| `asin` | string | Amazon Standard ID |
| `sku` | string | Stock Keeping Unit |
| `marketplace` | 'US' \| 'CA' \| 'UK' | Target market |
| `fulfillmentChannel` | 'FBA' \| 'AWD' \| 'WFS' \| 'FBT' | Fulfillment network |
| `unitsOnHand` | number | Current stock |
| `unitsInTransit` | number | Shipped but not received |
| `unitsInbound` | number | Expected inbound |
| `daysOfCover` | number | Days until stockout |
| `dailyVelocity` | number | Avg daily sales |
| `status` | 'healthy' \| 'warning' \| 'critical' \| 'overstock' | Health status |

### InboundShipment
Tracks each shipment through the supply chain.

| Field | Type | Description |
|-------|------|-------------|
| `shipmentId` | string | Carrier shipment ID |
| `status` | 'at_supplier' \| 'on_water' \| 'at_port' \| 'en_route' \| 'arrived' \| 'received' | Pipeline stage |
| `carrier` | string | Carrier name (AGL, Flexport, etc.) |
| `eta` | string | Expected arrival date |

### FreightQuote
Stores forwarder quotes for TCO analysis.

| Field | Type | Description |
|-------|------|-------------|
| `forwarder` | string | Forwarder name |
| `lane` | string | Route (e.g., "China → US") |
| `ratePerUnit` | number | Cost per unit |
| `placementFeeWaiver` | boolean | Amazon placement fee waived |
| `totalLandedCost` | number | Full TCO including ecosystem benefits |

---

## 🎨 Available Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | KPIs, charts, pipeline overview |
| Inventory | `/inventory` | Stock levels across all channels |
| Forecasting | `/forecasting` | Velocity, cover, reorder logic |
| Shipments | `/shipments` | Inbound pipeline tracker |
| Logistics | `/logistics` | R7 forwarder quoting & TCO |
| Projects | `/projects` | Milestone & workstream tracking |
| Settings | `/settings` | Google Sheets configuration |

---

## 🔑 Key Workstreams

### 1. Inventory & Replenishment Stabilization
Establish reliable, proactive inventory visibility across all marketplaces and fulfillment networks.

### 2. Automated Reorder & Velocity Forecasting
Unified operational model combining multi-channel sales velocity, inventory position, inbound inventory, and lead times.

### 3. FBA & Inventory Operations
Submit FBA shipments, generate labels, track through completion, monitor daily.

### 4. Freight Forwarder / AGL Coordination
Regular communication with AGL, monitor shipment pipeline, keep tracker updated.

### 5. R7 — Logistics Optimization
Build multi-forwarder quoting framework for informed 2027 logistics decision.

---

## 🎯 Target State

By the end of the stabilization period:

- ✅ Full inventory visibility across US, Canada, and UK
- ✅ FBA, AWD, WFS, and FBT inventory tracked
- ✅ Sell-through velocity tracked continuously
- ✅ Reorder triggers surfaced proactively
- ✅ FBA shipments created and tracked without prompting
- ✅ Freight-forwarder communication established and regular
- ✅ Minimum three-forwarder quoting framework operational
- ✅ Logistics costs compared using total cost of ownership
- ✅ Wesley operating independently — ready to expand scope to TrekTek Outfitters in Q1 2027

---

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Type checking
npm run typecheck
```

### Mock Data

The app ships with realistic mock data so you can explore all features without connecting to Google Sheets. Once configured, the app will fetch live data from your sheet.

---

## 📝 Notes

- The app is designed to **preserve the existing planning system** — it adds operational visibility, reorder logic, and logistics analysis where they create a genuine gap rather than rebuilding working components.
- All data is stored in Google Sheets, making it easy to share, audit, and integrate with other tools.
- The Apps Script layer handles all CRUD operations server-side, keeping the client simple.

---

## 📄 License

Internal use — Hungry Artisan operations.

---

## 👤 Owner

**Wesley Quintero** — Operations, Hungry Artisan

---

<p align="center">
  Built with ❤️ for operational excellence
</p>
