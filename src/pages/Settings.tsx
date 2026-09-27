import React, { useState, useEffect } from 'react';
import { sheetsService } from '../services/googleSheets';
import { SheetConfig } from '../types';
import {
  Database,
  Link,
  CheckCircle,
  XCircle,
  Copy,
  Code,
  Sparkles,
  AlertCircle,
  CheckCheck,
  ExternalLink,
  FileSpreadsheet,
} from 'lucide-react';

export default function Settings() {
  const [config, setConfig] = useState<SheetConfig>(sheetsService.getConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const handleSave = () => {
    sheetsService.saveConfig(config);
    setSaved(true);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await sheetsService.testConnection();
    setTestResult(result);
    setTesting(false);
  };

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(appsScriptCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = appsScriptCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sheetUrl = config.spreadsheetId
    ? `https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/edit`
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure Google Sheets integration and app settings</p>
      </div>

      {/* Connection Status */}
      <div
        className={`rounded-xl border p-5 ${
          config.connected ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <Database size={20} className={config.connected ? 'text-emerald-600' : 'text-slate-400'} />
          <div>
            <p className="text-sm font-semibold text-slate-800">Google Sheets Connection</p>
            <p className="text-xs text-slate-500">
              {config.connected ? 'Connected and syncing' : 'Not connected — using local mock data'}
            </p>
          </div>
          {config.connected && <CheckCircle size={18} className="text-emerald-500 ml-auto" />}
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Link size={16} />
          Google Sheets Configuration
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Google Spreadsheet ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={config.spreadsheetId}
              onChange={(e) => setConfig({ ...config, spreadsheetId: e.target.value })}
              placeholder="e.g., 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            {sheetUrl && (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 text-xs bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <ExternalLink size={12} /> Open
              </a>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Found in the Google Sheets URL: docs.google.com/spreadsheets/d/
            <strong>SPREADSHEET_ID</strong>/edit
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Google Apps Script Web App URL</label>
          <input
            type="text"
            value={config.scriptUrl}
            onChange={(e) => setConfig({ ...config, scriptUrl: e.target.value })}
            placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Deploy the Apps Script below as a Web App to get this URL
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {saved ? '✓ Saved!' : 'Save Configuration'}
          </button>
          <button
            onClick={handleTest}
            disabled={testing || !config.scriptUrl}
            className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          {testResult !== null && (
            <span
              className={`flex items-center gap-1 text-sm ${
                testResult ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {testResult ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {testResult ? 'Connected!' : 'Failed'}
            </span>
          )}
        </div>
      </div>

      {/* Setup Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-amber-500" />
          Setup Checklist
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Follow these steps to connect your Google Sheet. Run the setup functions from the Apps
          Script editor — they will create sheets, format headers, and seed sample data.
        </p>

        <div className="space-y-3">
          <SetupStep
            number={1}
            title="Open your Google Spreadsheet"
            description="Create a new Google Sheet or use an existing one. Copy the Spreadsheet ID from the URL."
            action={
              sheetUrl ? (
                <a
                  href={sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  <FileSpreadsheet size={12} /> Open Sheet
                </a>
              ) : null
            }
          />
          <SetupStep
            number={2}
            title="Open Apps Script editor"
            description="In your spreadsheet, go to Extensions → Apps Script."
          />
          <SetupStep
            number={3}
            title="Paste the code below"
            description="Delete any existing code and paste the Apps Script code from the section below."
            action={
              <button
                onClick={() => {
                  setShowScript(true);
                  setTimeout(() => {
                    document.getElementById('apps-script-code')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <Code size={12} /> Jump to Code
              </button>
            }
          />
          <SetupStep
            number={4}
            title="Run setupSheets()"
            description="In the Apps Script editor, select the setupSheets function from the dropdown and click Run. This creates all 5 tabs with formatted headers."
            highlight
          />
          <SetupStep
            number={5}
            title="Run seedSampleData()"
            description="Select seedSampleData and click Run. This populates all sheets with realistic Hungry Artisan sample data so you can test immediately."
            highlight
          />
          <SetupStep
            number={6}
            title="Deploy as Web App"
            description="Click Deploy → New deployment → Web app. Set 'Execute as: Me' and 'Who has access: Anyone'. Copy the URL."
          />
          <SetupStep
            number={7}
            title="Paste the Web App URL above"
            description="Paste the deployed URL in the configuration form at the top of this page and click Test Connection."
          />
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <strong>Tip:</strong> You can also run <code className="px-1 py-0.5 bg-amber-100 rounded text-[10px]">resetAll()</code> anytime to
              clear all data and re-seed with fresh sample data. Useful for testing or starting over.
            </div>
          </div>
        </div>
      </div>

      {/* Apps Script Code */}
      <div id="apps-script-code" className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4">
          <Code size={16} />
          Google Apps Script Code
        </h3>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <p className="text-xs text-blue-800">
            <strong>What's included:</strong>
          </p>
          <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
            <li>
              <code className="px-1 bg-blue-100 rounded text-[10px]">setupSheets()</code> — Creates all 5 tabs with headers, formatting, frozen header row, and column widths
            </li>
            <li>
              <code className="px-1 bg-blue-100 rounded text-[10px]">seedSampleData()</code> — Populates sheets with realistic Hungry Artisan sample data
            </li>
            <li>
              <code className="px-1 bg-blue-100 rounded text-[10px]">resetAll()</code> — Clears all sheets and re-seeds with fresh sample data
            </li>
            <li>
              <code className="px-1 bg-blue-100 rounded text-[10px]">doPost()</code> / <code className="px-1 bg-blue-100 rounded text-[10px]">doGet()</code> — API endpoints for the React app
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setShowScript(!showScript)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Code size={14} />
            {showScript ? 'Hide' : 'Show'} Apps Script Code
          </button>
          {showScript && (
            <button
              onClick={copyScript}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          )}
        </div>

        {showScript && (
          <div className="relative">
            <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded-lg overflow-x-auto max-h-[500px] overflow-y-auto">
              <code>{appsScriptCode}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Sheet Structure */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Sheet Structure</h3>
        <p className="text-xs text-slate-500 mb-4">
          The <code className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">setupSheets()</code>{' '}
          function creates these tabs automatically:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sheetStructure.map((sheet) => (
            <div key={sheet.name} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">
                  {sheet.name[0]}
                </span>
                {sheet.name}
                <span className="ml-auto text-[10px] text-slate-400">{sheet.columns.length} cols</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-1 ml-7 break-words">
                {sheet.columns.join(' • ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sync Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Data Flow</h3>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex-1 p-3 bg-blue-50 rounded-lg text-center border border-blue-100">
            <p className="font-semibold text-blue-800">React App</p>
            <p className="text-blue-600">User Interface</p>
          </div>
          <div className="text-slate-400">→</div>
          <div className="flex-1 p-3 bg-purple-50 rounded-lg text-center border border-purple-100">
            <p className="font-semibold text-purple-800">Apps Script</p>
            <p className="text-purple-600">API Layer</p>
          </div>
          <div className="text-slate-400">→</div>
          <div className="flex-1 p-3 bg-emerald-50 rounded-lg text-center border border-emerald-100">
            <p className="font-semibold text-emerald-800">Google Sheets</p>
            <p className="text-emerald-600">Database</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-3 text-center">
          The app communicates with Google Sheets through the Apps Script web app endpoint. All CRUD
          operations are handled server-side.
        </p>
      </div>
    </div>
  );
}

function SetupStep({
  number,
  title,
  description,
  action,
  highlight,
}: {
  number: number;
  title: string;
  description: string;
  action?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${
        highlight
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-slate-50 border-slate-100'
      }`}
    >
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          highlight ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
        }`}
      >
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

const sheetStructure = [
  {
    name: 'Inventory',
    columns: [
      'id', 'asin', 'sku', 'productName', 'marketplace', 'fulfillmentChannel',
      'unitsOnHand', 'unitsInTransit', 'unitsInbound', 'daysOfCover', 'dailyVelocity',
      'reorderPoint', 'stockBuffer', 'lastUpdated', 'status',
    ],
  },
  {
    name: 'InboundShipments',
    columns: [
      'id', 'shipmentId', 'asin', 'sku', 'quantity', 'origin', 'destination',
      'status', 'carrier', 'eta', 'shipDate', 'trackingNumber',
    ],
  },
  {
    name: 'Forecast',
    columns: [
      'id', 'asin', 'sku', 'marketplace', 'avgDailySales', 'weeklyVelocity',
      'daysOfCover', 'projectedStockoutDate', 'reorderDate', 'leadTimeDays',
      'safetyStockDays', 'recommendedAction', 'priority',
    ],
  },
  {
    name: 'FreightQuotes',
    columns: [
      'id', 'forwarder', 'lane', 'origin', 'destination', 'ratePerUnit', 'ratePerKg',
      'transitTimeDays', 'placementFeeWaiver', 'aglDiscount', 'awdAutoReplenish',
      'totalLandedCost', 'notes', 'validUntil',
    ],
  },
  {
    name: 'Milestones',
    columns: [
      'id', 'project', 'milestone', 'description', 'dueDate', 'status', 'owner', 'progress',
    ],
  },
];

const appsScriptCode = `/**
 * ============================================================
 *  Inventory Planning — Google Apps Script Backend
 *  Hungry Artisan • Wesley Quintero
 * ============================================================
 *
 *  SETUP FUNCTIONS (run from Apps Script editor):
 *    • setupSheets()        — Creates all 5 tabs with headers + formatting
 *    • seedSampleData()     — Populates sheets with realistic sample data
 *    • resetAll()           — Clears all sheets and re-seeds fresh data
 *
 *  API ENDPOINTS (called by the React app):
 *    • doPost(e)            — Handles read/write/update/delete
 *    • doGet(e)             — Health check / read via GET
 *
 *  DEPLOYMENT:
 *    1. Paste this code into Extensions → Apps Script
 *    2. Run setupSheets() once, then seedSampleData() once
 *    3. Deploy → New deployment → Web app
 *       - Execute as: Me
 *       - Who has access: Anyone
 *    4. Copy the Web App URL into the React app Settings page
 * ============================================================
 */

// ---------- Schema ----------
const SCHEMA = {
  Inventory: [
    'id','asin','sku','productName','marketplace','fulfillmentChannel',
    'unitsOnHand','unitsInTransit','unitsInbound','daysOfCover','dailyVelocity',
    'reorderPoint','stockBuffer','lastUpdated','status'
  ],
  InboundShipments: [
    'id','shipmentId','asin','sku','quantity','origin','destination',
    'status','carrier','eta','shipDate','trackingNumber'
  ],
  Forecast: [
    'id','asin','sku','marketplace','avgDailySales','weeklyVelocity',
    'daysOfCover','projectedStockoutDate','reorderDate','leadTimeDays',
    'safetyStockDays','recommendedAction','priority'
  ],
  FreightQuotes: [
    'id','forwarder','lane','origin','destination','ratePerUnit','ratePerKg',
    'transitTimeDays','placementFeeWaiver','aglDiscount','awdAutoReplenish',
    'totalLandedCost','notes','validUntil'
  ],
  Milestones: [
    'id','project','milestone','description','dueDate','status','owner','progress'
  ]
};

// ---------- SETUP FUNCTIONS ----------

/**
 * Creates all required sheets with formatted headers.
 * Safe to run multiple times — existing sheets are preserved.
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const created = [];
  const skipped = [];

  Object.entries(SCHEMA).forEach(([name, headers]) => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      created.push(name);
    } else {
      skipped.push(name);
    }

    // Write headers
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0f172a');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    sheet.setRowHeight(1, 28);

    // Freeze header row
    sheet.setFrozenRows(1);

    // Auto-resize columns based on header text
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
      // Add a little padding
      const width = sheet.getColumnWidth(i);
      sheet.setColumnWidth(i, Math.max(width + 20, 100));
    }

    // Add alternating row colors via conditional formatting (light gray)
    sheet.setSheetValues; // no-op reference
  });

  // Remove the default "Sheet1" if it exists and we created new sheets
  if (created.length > 0) {
    const defaultSheet = ss.getSheetByName('Sheet1');
    if (defaultSheet && ss.getSheets().length > 1) {
      try { ss.deleteSheet(defaultSheet); } catch (e) { /* ignore */ }
    }
  }

  const msg = '✅ Setup complete.\\n' +
    'Created: ' + (created.length ? created.join(', ') : 'none') + '\\n' +
    'Already existed: ' + (skipped.length ? skipped.join(', ') : 'none') + '\\n\\n' +
    'Next step: run seedSampleData() to populate with sample data.';
  Logger.log(msg);
  return msg;
}

/**
 * Populates all sheets with realistic Hungry Artisan sample data.
 * Appends to existing data — run resetAll() first if you want a clean slate.
 */
function seedSampleData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const stats = {};

  // ---------- Inventory ----------
  const inventorySheet = ss.getSheetByName('Inventory');
  if (inventorySheet) {
    const data = [
      ['1','B09ABC1234','HA-CRACK-12OZ','Artisan Crackers 12oz','US','FBA',2450,800,1200,34,72,2160,720,'2026-01-15','healthy'],
      ['2','B09DEF5678','HA-GRAN-8OZ','Granola Clusters 8oz','US','FBA',890,0,0,12,74,2220,740,'2026-01-15','critical'],
      ['3','B09GHI9012','HA-NUT-16OZ','Mixed Nuts 16oz','US','AWD',5200,2000,3000,52,100,3000,1000,'2026-01-15','healthy'],
      ['4','B09JKL3456','HA-CRACK-12OZ','Artisan Crackers 12oz','CA','FBA',680,400,0,22,31,930,310,'2026-01-15','warning'],
      ['5','B09MNO7890','HA-GRAN-8OZ','Granola Clusters 8oz','UK','FBA',1200,600,800,40,30,900,300,'2026-01-15','healthy'],
      ['6','B09PQR1234','HA-NUT-16OZ','Mixed Nuts 16oz','US','WFS',340,0,500,8,42,1260,420,'2026-01-15','critical'],
      ['7','B09STU5678','HA-CRACK-12OZ','Artisan Crackers 12oz','US','FBT',1800,0,0,45,40,1200,400,'2026-01-15','overstock'],
      ['8','B09VWX9012','HA-GRAN-8OZ','Granola Clusters 8oz','CA','FBA',450,300,0,15,30,900,300,'2026-01-15','warning']
    ];
    inventorySheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    stats.Inventory = data.length;
  }

  // ---------- InboundShipments ----------
  const shipmentsSheet = ss.getSheetByName('InboundShipments');
  if (shipmentsSheet) {
    const data = [
      ['1','FBA1234','B09ABC1234','HA-CRACK-12OZ',1200,'Shanghai, CN','ONT8, CA','on_water','AGL','2026-02-01','2026-01-10','AGL-2026-001'],
      ['2','FBA5678','B09DEF5678','HA-GRAN-8OZ',800,'Shenzhen, CN','ABE2, PA','at_supplier','AGL','2026-02-15','2026-01-20','AGL-2026-002'],
      ['3','AWD001','B09GHI9012','HA-NUT-16OZ',3000,'Ningbo, CN','AWD-US','at_port','AGL','2026-01-28','2026-01-05','AGL-2026-003'],
      ['4','FBA9012','B09JKL3456','HA-CRACK-12OZ',400,'Shanghai, CN','YYC4, CA','en_route','AGL','2026-01-22','2026-01-08','AGL-2026-004'],
      ['5','WFS001','B09PQR1234','HA-NUT-16OZ',500,'Shanghai, CN','WFS-US','on_water','SSD Logistix','2026-02-05','2026-01-12','SSD-2026-001'],
      ['6','FBT001','B09MNO7890','HA-GRAN-8OZ',800,'Shenzhen, CN','UK-FBT','arrived','AGL','2026-01-18','2026-01-02','AGL-2026-005']
    ];
    shipmentsSheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    stats.InboundShipments = data.length;
  }

  // ---------- Forecast ----------
  const forecastSheet = ss.getSheetByName('Forecast');
  if (forecastSheet) {
    const data = [
      ['1','B09ABC1234','HA-CRACK-12OZ','US',72,'68,74,72,76',34,'2026-02-18','2026-01-25',35,10,'fba_shipment','medium'],
      ['2','B09DEF5678','HA-GRAN-8OZ','US',74,'70,78,74,80',12,'2026-01-27','2026-01-16',35,10,'supplier_reorder','high'],
      ['3','B09GHI9012','HA-NUT-16OZ','US',100,'95,105,100,98',52,'2026-03-08','2026-02-01',35,10,'none','low'],
      ['4','B09JKL3456','HA-CRACK-12OZ','CA',31,'28,34,31,30',22,'2026-02-06','2026-01-20',40,10,'transfer','high'],
      ['5','B09PQR1234','HA-NUT-16OZ','US',42,'40,44,42,45',8,'2026-01-23','2026-01-10',30,10,'supplier_reorder','high'],
      ['6','B09STU5678','HA-CRACK-12OZ','US',40,'38,42,40,41',45,'2026-03-01','2026-02-01',30,10,'none','low']
    ];
    forecastSheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    stats.Forecast = data.length;
  }

  // ---------- FreightQuotes ----------
  const quotesSheet = ss.getSheetByName('FreightQuotes');
  if (quotesSheet) {
    const data = [
      ['1','AGL','China → US (AWD)','Shanghai','US-AWD',0.85,2.10,28,true,15,true,0.85,'Current primary carrier. Includes placement fee waiver.','2026-03-31'],
      ['2','Flexport','China → US (AWD)','Shanghai','US-AWD',0.72,1.85,32,false,0,false,1.55,'Lower base rate but loses placement fee waiver (~$0.27-1.58/unit)','2026-02-28'],
      ['3','Freightos','China → US (AWD)','Shenzhen','US-AWD',0.78,1.95,30,false,0,false,1.42,'Mid-range option. No Amazon ecosystem benefits.','2026-03-15'],
      ['4','AGL','China → Canada','Shanghai','Vancouver FBA',0.92,2.30,25,true,12,false,0.92,'Direct to Vancouver FBA.','2026-03-31'],
      ['5','SSD Logistix','China → UK','Shenzhen','UK FBA',1.10,2.80,35,false,0,false,1.10,'Current UK carrier via SSD Logistix.','2026-02-28'],
      ['6','AGL','China → UK','Shenzhen','UK FBA',1.05,2.60,33,true,10,false,1.05,'AGL UK lane with placement fee benefits.','2026-03-31']
    ];
    quotesSheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    stats.FreightQuotes = data.length;
  }

  // ---------- Milestones ----------
  const milestonesSheet = ss.getSheetByName('Milestones');
  if (milestonesSheet) {
    const data = [
      ['1','Inventory Stabilization','Full inventory audit across all platforms','Document units on hand, in transit, days of cover by ASIN/SKU across FBA, AWD, WFS, FBT','2026-01-31','in_progress','Wesley',65],
      ['2','Inventory Stabilization','Process alignment with Victoria & Justin','Align on reorder triggers, target days of cover, buffer requirements, shipping workflows','2026-02-15','in_progress','Wesley',30],
      ['3','Inventory Stabilization','Inbound pipeline recon complete','Confirm status of all inbound inventory: at supplier, on water, at port, en route, arrived','2026-01-25','in_progress','Wesley',80],
      ['4','Forecasting & Replenishment','Velocity tracking model live','Track sell-through velocity by ASIN/SKU and marketplace. Calculate days of cover.','2026-02-28','in_progress','Wesley',45],
      ['5','Forecasting & Replenishment','Reorder trigger automation','Proactive flagging of reorder windows before stockout risk','2026-03-15','not_started','Wesley',10],
      ['6','FBA Operations','FBA shipment workflow operational','Submit FBA shipments, generate labels, track through completion','2026-02-28','in_progress','Wesley',50],
      ['7','FBA Operations','Daily inventory monitoring cadence','Monitor inventory daily, surface replenishment requirements proactively','2026-01-31','completed','Wesley',100],
      ['8','R7 - Logistics (Oct)','Multi-forwarder quoting system live','Contact AGL + 2 alternatives. Build quote comparison framework.','2026-10-31','not_started','Wesley',0],
      ['9','R7 - Logistics (Nov)','Total Cost of Ownership analysis','Full logistics cost analysis: AGL vs alternatives including Amazon ecosystem benefits','2026-11-30','not_started','Wesley',0],
      ['10','R7 - Logistics (Dec)','Execute & validate new framework','Execute at least one shipment using new quoting framework. Document complete process.','2026-12-31','not_started','Wesley',0],
      ['11','Freight Coordination','AGL introduction & communication cadence','Introduce to AGL, confirm active shipments, establish regular communication','2026-01-31','in_progress','Wesley',55],
      ['12','Freight Coordination','Inventory & Shipping Tracker updated','Keep tracker updated with current shipment information across all lanes','2026-01-20','completed','Wesley',100]
    ];
    milestonesSheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    stats.Milestones = data.length;
  }

  const summary = Object.entries(stats)
    .map(([k, v]) => '  • ' + k + ': ' + v + ' rows')
    .join('\\n');

  const msg = '🌱 Seed data complete.\\n' + summary + '\\n\\nYour sheets are ready to use!';
  Logger.log(msg);
  return msg;
}

/**
 * Clears all data from all sheets (preserves headers) and re-seeds with fresh sample data.
 * Use this to start over or refresh the sample dataset.
 */
function resetAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const cleared = [];

  Object.keys(SCHEMA).forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet && sheet.getLastRow() > 1) {
      // Clear data but keep headers
      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();
      sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
      cleared.push(name);
    }
  });

  Logger.log('Cleared: ' + (cleared.length ? cleared.join(', ') : 'none'));

  // Re-seed
  const seedResult = seedSampleData();
  return '🔄 Reset complete.\\n' + seedResult;
}

// ---------- API ENDPOINTS ----------

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch (action) {
      case 'test':
        return jsonResponse({ success: true, message: 'Connection successful' });
      case 'read':
        return handleRead(data.sheet);
      case 'write':
        return handleWrite(data.sheet, data.data);
      case 'update':
        return handleUpdate(data.sheet, data.id, data.data);
      case 'delete':
        return handleDelete(data.sheet, data.id);
      default:
        return jsonResponse({ success: false, error: 'Unknown action: ' + action });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  const sheet = e.parameter.sheet;
  if (sheet) {
    return handleRead(sheet);
  }
  return jsonResponse({
    success: true,
    message: 'Inventory Planning API is running',
    version: '1.1.0',
    sheets: Object.keys(SCHEMA)
  });
}

function handleRead(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return jsonResponse({ success: false, error: 'Sheet not found: ' + sheetName });
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return jsonResponse({ success: true, data: [] });
  }

  const headers = data[0];
  const rows = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });

  return jsonResponse({ success: true, data: rows });
}

function handleWrite(sheetName, records) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    // Auto-create sheet with headers from schema
    const headers = SCHEMA[sheetName] || Object.keys(records[0] || {});
    sheet = ss.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rows = records.map(record =>
    headers.map(header => {
      const val = record[header];
      if (Array.isArray(val)) return val.join(',');
      return val !== undefined && val !== null ? val : '';
    })
  );

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, headers.length).setValues(rows);
  }

  return jsonResponse({ success: true, rowsAdded: rows.length });
}

function handleUpdate(sheetName, id, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return jsonResponse({ success: false, error: 'Sheet not found' });
  }

  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idCol = headers.indexOf('id');

  for (let i = 1; i < allData.length; i++) {
    if (String(allData[i][idCol]) === String(id)) {
      headers.forEach((header, colIdx) => {
        if (data[header] !== undefined) {
          let val = data[header];
          if (Array.isArray(val)) val = val.join(',');
          sheet.getRange(i + 1, colIdx + 1).setValue(val);
        }
      });
      return jsonResponse({ success: true, updated: true });
    }
  }

  return jsonResponse({ success: false, error: 'Record not found' });
}

function handleDelete(sheetName, id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return jsonResponse({ success: false, error: 'Sheet not found' });
  }

  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idCol = headers.indexOf('id');

  for (let i = 1; i < allData.length; i++) {
    if (String(allData[i][idCol]) === String(id)) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ success: true, deleted: true });
    }
  }

  return jsonResponse({ success: false, error: 'Record not found' });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
