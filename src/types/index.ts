// Inventory Types
export interface InventoryItem {
  id: string;
  asin: string;
  sku: string;
  productName: string;
  marketplace: 'US' | 'CA' | 'UK';
  fulfillmentChannel: 'FBA' | 'AWD' | 'WFS' | 'FBT';
  unitsOnHand: number;
  unitsInTransit: number;
  unitsInbound: number;
  daysOfCover: number;
  dailyVelocity: number;
  reorderPoint: number;
  stockBuffer: number;
  lastUpdated: string;
  status: 'healthy' | 'warning' | 'critical' | 'overstock';
}

export interface InboundShipment {
  id: string;
  shipmentId: string;
  asin: string;
  sku: string;
  quantity: number;
  origin: string;
  destination: string;
  status: 'at_supplier' | 'on_water' | 'at_port' | 'en_route' | 'arrived' | 'received';
  carrier: string;
  eta: string;
  shipDate: string;
  trackingNumber: string;
}

export interface ForecastData {
  id: string;
  asin: string;
  sku: string;
  marketplace: string;
  avgDailySales: number;
  weeklyVelocity: number[];
  daysOfCover: number;
  projectedStockoutDate: string;
  reorderDate: string;
  leadTimeDays: number;
  safetyStockDays: number;
  recommendedAction: 'transfer' | 'fba_shipment' | 'supplier_reorder' | 'none';
  priority: 'high' | 'medium' | 'low';
}

export interface FreightQuote {
  id: string;
  forwarder: string;
  lane: string;
  origin: string;
  destination: string;
  ratePerUnit: number;
  ratePerKg: number;
  transitTimeDays: number;
  placementFeeWaiver: boolean;
  aglDiscount: number;
  awdAutoReplenish: boolean;
  totalLandedCost: number;
  notes: string;
  validUntil: string;
}

export interface ProjectMilestone {
  id: string;
  project: string;
  milestone: string;
  description: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  owner: string;
  progress: number;
}

export interface SheetConfig {
  spreadsheetId: string;
  scriptUrl: string;
  connected: boolean;
  lastSync: string;
}

export type TabType = 'dashboard' | 'inventory' | 'forecasting' | 'shipments' | 'logistics' | 'projects' | 'settings';
