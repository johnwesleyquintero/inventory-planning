import { SheetConfig, InventoryItem, InboundShipment, ForecastData, FreightQuote, ProjectMilestone } from '../types';

const DEFAULT_CONFIG: SheetConfig = {
  spreadsheetId: '',
  scriptUrl: '',
  connected: false,
  lastSync: '',
};

class GoogleSheetsService {
  private config: SheetConfig;

  constructor() {
    const stored = localStorage.getItem('sheetConfig');
    this.config = stored ? JSON.parse(stored) : DEFAULT_CONFIG;
  }

  getConfig(): SheetConfig {
    return this.config;
  }

  saveConfig(config: SheetConfig): void {
    this.config = config;
    localStorage.setItem('sheetConfig', JSON.stringify(config));
  }

  async testConnection(): Promise<boolean> {
    if (!this.config.scriptUrl) return false;
    try {
      const response = await fetch(this.config.scriptUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'test' }),
        headers: { 'Content-Type': 'text/plain' },
      });
      const data = await response.json();
      return data.success === true;
    } catch {
      return false;
    }
  }

  async fetchData<T>(sheetName: string): Promise<T[]> {
    if (!this.config.scriptUrl) {
      return this.getMockData<T>(sheetName);
    }
    try {
      const response = await fetch(this.config.scriptUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'read', sheet: sheetName }),
        headers: { 'Content-Type': 'text/plain' },
      });
      const data = await response.json();
      return data.data || [];
    } catch {
      return this.getMockData<T>(sheetName);
    }
  }

  async writeData(sheetName: string, data: Record<string, unknown>[]): Promise<boolean> {
    if (!this.config.scriptUrl) return false;
    try {
      const response = await fetch(this.config.scriptUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'write', sheet: sheetName, data }),
        headers: { 'Content-Type': 'text/plain' },
      });
      const result = await response.json();
      return result.success === true;
    } catch {
      return false;
    }
  }

  private getMockData<T>(sheetName: string): T[] {
    const mockData: Record<string, unknown[]> = {
      'Inventory': mockInventory,
      'InboundShipments': mockShipments,
      'Forecast': mockForecast,
      'FreightQuotes': mockQuotes,
      'Milestones': mockMilestones,
    };
    return (mockData[sheetName] || []) as T[];
  }
}

// Mock Data
const mockInventory: InventoryItem[] = [
  { id: '1', asin: 'B09ABC1234', sku: 'HA-CRACK-12OZ', productName: 'Artisan Crackers 12oz', marketplace: 'US', fulfillmentChannel: 'FBA', unitsOnHand: 2450, unitsInTransit: 800, unitsInbound: 1200, daysOfCover: 34, dailyVelocity: 72, reorderPoint: 2160, stockBuffer: 720, lastUpdated: '2026-01-15', status: 'healthy' },
  { id: '2', asin: 'B09DEF5678', sku: 'HA-GRAN-8OZ', productName: 'Granola Clusters 8oz', marketplace: 'US', fulfillmentChannel: 'FBA', unitsOnHand: 890, unitsInTransit: 0, unitsInbound: 0, daysOfCover: 12, dailyVelocity: 74, reorderPoint: 2220, stockBuffer: 740, lastUpdated: '2026-01-15', status: 'critical' },
  { id: '3', asin: 'B09GHI9012', sku: 'HA-NUT-16OZ', productName: 'Mixed Nuts 16oz', marketplace: 'US', fulfillmentChannel: 'AWD', unitsOnHand: 5200, unitsInTransit: 2000, unitsInbound: 3000, daysOfCover: 52, dailyVelocity: 100, reorderPoint: 3000, stockBuffer: 1000, lastUpdated: '2026-01-15', status: 'healthy' },
  { id: '4', asin: 'B09JKL3456', sku: 'HA-CRACK-12OZ', productName: 'Artisan Crackers 12oz', marketplace: 'CA', fulfillmentChannel: 'FBA', unitsOnHand: 680, unitsInTransit: 400, unitsInbound: 0, daysOfCover: 22, dailyVelocity: 31, reorderPoint: 930, stockBuffer: 310, lastUpdated: '2026-01-15', status: 'warning' },
  { id: '5', asin: 'B09MNO7890', sku: 'HA-GRAN-8OZ', productName: 'Granola Clusters 8oz', marketplace: 'UK', fulfillmentChannel: 'FBA', unitsOnHand: 1200, unitsInTransit: 600, unitsInbound: 800, daysOfCover: 40, dailyVelocity: 30, reorderPoint: 900, stockBuffer: 300, lastUpdated: '2026-01-15', status: 'healthy' },
  { id: '6', asin: 'B09PQR1234', sku: 'HA-NUT-16OZ', productName: 'Mixed Nuts 16oz', marketplace: 'US', fulfillmentChannel: 'WFS', unitsOnHand: 340, unitsInTransit: 0, unitsInbound: 500, daysOfCover: 8, dailyVelocity: 42, reorderPoint: 1260, stockBuffer: 420, lastUpdated: '2026-01-15', status: 'critical' },
  { id: '7', asin: 'B09STU5678', sku: 'HA-CRACK-12OZ', productName: 'Artisan Crackers 12oz', marketplace: 'US', fulfillmentChannel: 'FBT', unitsOnHand: 1800, unitsInTransit: 0, unitsInbound: 0, daysOfCover: 45, dailyVelocity: 40, reorderPoint: 1200, stockBuffer: 400, lastUpdated: '2026-01-15', status: 'overstock' },
  { id: '8', asin: 'B09VWX9012', sku: 'HA-GRAN-8OZ', productName: 'Granola Clusters 8oz', marketplace: 'CA', fulfillmentChannel: 'FBA', unitsOnHand: 450, unitsInTransit: 300, unitsInbound: 0, daysOfCover: 15, dailyVelocity: 30, reorderPoint: 900, stockBuffer: 300, lastUpdated: '2026-01-15', status: 'warning' },
];

const mockShipments: InboundShipment[] = [
  { id: '1', shipmentId: 'FBA1234', asin: 'B09ABC1234', sku: 'HA-CRACK-12OZ', quantity: 1200, origin: 'Shanghai, CN', destination: 'ONT8, CA', status: 'on_water', carrier: 'AGL', eta: '2026-02-01', shipDate: '2026-01-10', trackingNumber: 'AGL-2026-001' },
  { id: '2', shipmentId: 'FBA5678', asin: 'B09DEF5678', sku: 'HA-GRAN-8OZ', quantity: 800, origin: 'Shenzhen, CN', destination: 'ABE2, PA', status: 'at_supplier', carrier: 'AGL', eta: '2026-02-15', shipDate: '2026-01-20', trackingNumber: 'AGL-2026-002' },
  { id: '3', shipmentId: 'AWD001', asin: 'B09GHI9012', sku: 'HA-NUT-16OZ', quantity: 3000, origin: 'Ningbo, CN', destination: 'AWD-US', status: 'at_port', carrier: 'AGL', eta: '2026-01-28', shipDate: '2026-01-05', trackingNumber: 'AGL-2026-003' },
  { id: '4', shipmentId: 'FBA9012', asin: 'B09JKL3456', sku: 'HA-CRACK-12OZ', quantity: 400, origin: 'Shanghai, CN', destination: 'YYC4, CA', status: 'en_route', carrier: 'AGL', eta: '2026-01-22', shipDate: '2026-01-08', trackingNumber: 'AGL-2026-004' },
  { id: '5', shipmentId: 'WFS001', asin: 'B09PQR1234', sku: 'HA-NUT-16OZ', quantity: 500, origin: 'Shanghai, CN', destination: 'WFS-US', status: 'on_water', carrier: 'SSD Logistix', eta: '2026-02-05', shipDate: '2026-01-12', trackingNumber: 'SSD-2026-001' },
  { id: '6', shipmentId: 'FBT001', asin: 'B09MNO7890', sku: 'HA-GRAN-8OZ', quantity: 800, origin: 'Shenzhen, CN', destination: 'UK-FBT', status: 'arrived', carrier: 'AGL', eta: '2026-01-18', shipDate: '2026-01-02', trackingNumber: 'AGL-2026-005' },
];

const mockForecast: ForecastData[] = [
  { id: '1', asin: 'B09ABC1234', sku: 'HA-CRACK-12OZ', marketplace: 'US', avgDailySales: 72, weeklyVelocity: [68, 74, 72, 76], daysOfCover: 34, projectedStockoutDate: '2026-02-18', reorderDate: '2026-01-25', leadTimeDays: 35, safetyStockDays: 10, recommendedAction: 'fba_shipment', priority: 'medium' },
  { id: '2', asin: 'B09DEF5678', sku: 'HA-GRAN-8OZ', marketplace: 'US', avgDailySales: 74, weeklyVelocity: [70, 78, 74, 80], daysOfCover: 12, projectedStockoutDate: '2026-01-27', reorderDate: '2026-01-16', leadTimeDays: 35, safetyStockDays: 10, recommendedAction: 'supplier_reorder', priority: 'high' },
  { id: '3', asin: 'B09GHI9012', sku: 'HA-NUT-16OZ', marketplace: 'US', avgDailySales: 100, weeklyVelocity: [95, 105, 100, 98], daysOfCover: 52, projectedStockoutDate: '2026-03-08', reorderDate: '2026-02-01', leadTimeDays: 35, safetyStockDays: 10, recommendedAction: 'none', priority: 'low' },
  { id: '4', asin: 'B09JKL3456', sku: 'HA-CRACK-12OZ', marketplace: 'CA', avgDailySales: 31, weeklyVelocity: [28, 34, 31, 30], daysOfCover: 22, projectedStockoutDate: '2026-02-06', reorderDate: '2026-01-20', leadTimeDays: 40, safetyStockDays: 10, recommendedAction: 'transfer', priority: 'high' },
  { id: '5', asin: 'B09PQR1234', sku: 'HA-NUT-16OZ', marketplace: 'US', avgDailySales: 42, weeklyVelocity: [40, 44, 42, 45], daysOfCover: 8, projectedStockoutDate: '2026-01-23', reorderDate: '2026-01-10', leadTimeDays: 30, safetyStockDays: 10, recommendedAction: 'supplier_reorder', priority: 'high' },
  { id: '6', asin: 'B09STU5678', sku: 'HA-CRACK-12OZ', marketplace: 'US', avgDailySales: 40, weeklyVelocity: [38, 42, 40, 41], daysOfCover: 45, projectedStockoutDate: '2026-03-01', reorderDate: '2026-02-01', leadTimeDays: 30, safetyStockDays: 10, recommendedAction: 'none', priority: 'low' },
];

const mockQuotes: FreightQuote[] = [
  { id: '1', forwarder: 'AGL', lane: 'China → US (AWD)', origin: 'Shanghai', destination: 'US-AWD', ratePerUnit: 0.85, ratePerKg: 2.10, transitTimeDays: 28, placementFeeWaiver: true, aglDiscount: 15, awdAutoReplenish: true, totalLandedCost: 0.85, notes: 'Current primary carrier. Includes placement fee waiver.', validUntil: '2026-03-31' },
  { id: '2', forwarder: 'Flexport', lane: 'China → US (AWD)', origin: 'Shanghai', destination: 'US-AWD', ratePerUnit: 0.72, ratePerKg: 1.85, transitTimeDays: 32, placementFeeWaiver: false, aglDiscount: 0, awdAutoReplenish: false, totalLandedCost: 1.55, notes: 'Lower base rate but loses placement fee waiver (~$0.27-1.58/unit)', validUntil: '2026-02-28' },
  { id: '3', forwarder: 'Freightos', lane: 'China → US (AWD)', origin: 'Shenzhen', destination: 'US-AWD', ratePerUnit: 0.78, ratePerKg: 1.95, transitTimeDays: 30, placementFeeWaiver: false, aglDiscount: 0, awdAutoReplenish: false, totalLandedCost: 1.42, notes: 'Mid-range option. No Amazon ecosystem benefits.', validUntil: '2026-03-15' },
  { id: '4', forwarder: 'AGL', lane: 'China → Canada', origin: 'Shanghai', destination: 'Vancouver FBA', ratePerUnit: 0.92, ratePerKg: 2.30, transitTimeDays: 25, placementFeeWaiver: true, aglDiscount: 12, awdAutoReplenish: false, totalLandedCost: 0.92, notes: 'Direct to Vancouver FBA.', validUntil: '2026-03-31' },
  { id: '5', forwarder: 'SSD Logistix', lane: 'China → UK', origin: 'Shenzhen', destination: 'UK FBA', ratePerUnit: 1.10, ratePerKg: 2.80, transitTimeDays: 35, placementFeeWaiver: false, aglDiscount: 0, awdAutoReplenish: false, totalLandedCost: 1.10, notes: 'Current UK carrier via SSD Logistix.', validUntil: '2026-02-28' },
  { id: '6', forwarder: 'AGL', lane: 'China → UK', origin: 'Shenzhen', destination: 'UK FBA', ratePerUnit: 1.05, ratePerKg: 2.60, transitTimeDays: 33, placementFeeWaiver: true, aglDiscount: 10, awdAutoReplenish: false, totalLandedCost: 1.05, notes: 'AGL UK lane with placement fee benefits.', validUntil: '2026-03-31' },
];

const mockMilestones: ProjectMilestone[] = [
  { id: '1', project: 'Inventory Stabilization', milestone: 'Full inventory audit across all platforms', description: 'Document units on hand, in transit, days of cover by ASIN/SKU across FBA, AWD, WFS, FBT', dueDate: '2026-01-31', status: 'in_progress', owner: 'Wesley', progress: 65 },
  { id: '2', project: 'Inventory Stabilization', milestone: 'Process alignment with Victoria & Justin', description: 'Align on reorder triggers, target days of cover, buffer requirements, shipping workflows', dueDate: '2026-02-15', status: 'in_progress', owner: 'Wesley', progress: 30 },
  { id: '3', project: 'Inventory Stabilization', milestone: 'Inbound pipeline recon complete', description: 'Confirm status of all inbound inventory: at supplier, on water, at port, en route, arrived', dueDate: '2026-01-25', status: 'in_progress', owner: 'Wesley', progress: 80 },
  { id: '4', project: 'Forecasting & Replenishment', milestone: 'Velocity tracking model live', description: 'Track sell-through velocity by ASIN/SKU and marketplace. Calculate days of cover.', dueDate: '2026-02-28', status: 'in_progress', owner: 'Wesley', progress: 45 },
  { id: '5', project: 'Forecasting & Replenishment', milestone: 'Reorder trigger automation', description: 'Proactive flagging of reorder windows before stockout risk', dueDate: '2026-03-15', status: 'not_started', owner: 'Wesley', progress: 10 },
  { id: '6', project: 'FBA Operations', milestone: 'FBA shipment workflow operational', description: 'Submit FBA shipments, generate labels, track through completion', dueDate: '2026-02-28', status: 'in_progress', owner: 'Wesley', progress: 50 },
  { id: '7', project: 'FBA Operations', milestone: 'Daily inventory monitoring cadence', description: 'Monitor inventory daily, surface replenishment requirements proactively', dueDate: '2026-01-31', status: 'completed', owner: 'Wesley', progress: 100 },
  { id: '8', project: 'R7 - Logistics (Oct)', milestone: 'Multi-forwarder quoting system live', description: 'Contact AGL + 2 alternatives. Build quote comparison framework.', dueDate: '2026-10-31', status: 'not_started', owner: 'Wesley', progress: 0 },
  { id: '9', project: 'R7 - Logistics (Nov)', milestone: 'Total Cost of Ownership analysis', description: 'Full logistics cost analysis: AGL vs alternatives including Amazon ecosystem benefits', dueDate: '2026-11-30', status: 'not_started', owner: 'Wesley', progress: 0 },
  { id: '10', project: 'R7 - Logistics (Dec)', milestone: 'Execute & validate new framework', description: 'Execute at least one shipment using new quoting framework. Document complete process.', dueDate: '2026-12-31', status: 'not_started', owner: 'Wesley', progress: 0 },
  { id: '11', project: 'Freight Coordination', milestone: 'AGL introduction & communication cadence', description: 'Introduce to AGL, confirm active shipments, establish regular communication', dueDate: '2026-01-31', status: 'in_progress', owner: 'Wesley', progress: 55 },
  { id: '12', project: 'Freight Coordination', milestone: 'Inventory & Shipping Tracker updated', description: 'Keep tracker updated with current shipment information across all lanes', dueDate: '2026-01-20', status: 'completed', owner: 'Wesley', progress: 100 },
];

export const sheetsService = new GoogleSheetsService();
export { mockInventory, mockShipments, mockForecast, mockQuotes, mockMilestones };
export default sheetsService;
