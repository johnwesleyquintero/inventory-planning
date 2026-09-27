import React, { useState, useEffect } from 'react';
import { sheetsService } from '../services/googleSheets';
import { SheetConfig } from '../types';
import { Database, Link, CheckCircle, XCircle, Copy, ExternalLink, Code } from 'lucide-react';

export default function Settings() {
  const [config, setConfig] = useState<SheetConfig>(sheetsService.getConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const [showScript, setShowScript] = useState(false);

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

  const copyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure Google Sheets integration and app settings</p>
      </div>

      {/* Connection Status */}
      <div className={`rounded-xl border p-5 ${config.connected ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
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
          <input
            type="text"
            value={config.spreadsheetId}
            onChange={(e) => setConfig({ ...config, spreadsheetId: e.target.value })}
            placeholder="e.g., 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <p className="text-[10px] text-slate-400 mt-1">Found in the Google Sheets URL: docs.google.com/spreadsheets/d/<strong>SPREADSHEET_ID</strong>/edit</p>
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
          <p className="text-[10px] text-slate-400 mt-1">Deploy the Apps Script below as a Web App to get this URL</p>
        </div>

        <div className="flex gap-2">
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
            <span className={`flex items-center gap-1 text-sm ${testResult ? 'text-emerald-600' : 'text-red-600'}`}>
              {testResult ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {testResult ? 'Connected!' : 'Failed'}
            </span>
          )}
        </div>
      </div>

      {/* Apps Script Setup */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4">
          <Code size={16} />
          Google Apps Script Setup
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-800 mb-2">Setup Instructions:</p>
            <ol className="text-xs text-blue-700 space-y-1.5 list-decimal list-inside">
              <li>Open your Google Spreadsheet</li>
              <li>Go to <strong>Extensions → Apps Script</strong></li>
              <li>Delete any existing code and paste the script below</li>
              <li>Click <strong>Deploy → New deployment</strong></li>
              <li>Select type: <strong>Web app</strong></li>
              <li>Set "Execute as": <strong>Me</strong></li>
              <li>Set "Who has access": <strong>Anyone</strong></li>
              <li>Click <strong>Deploy</strong> and copy the Web App URL</li>
              <li>Paste the URL in the configuration above</li>
            </ol>
          </div>

          <button
            onClick={() => setShowScript(!showScript)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
          >
            <Code size={14} />
            {showScript ? 'Hide' : 'Show'} Apps Script Code
          </button>

          {showScript && (
            <div className="relative">
              <button
                onClick={copyScript}
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-xs bg-slate-700 text-white rounded hover:bg-slate-600"
              >
                <Copy size={12} /> Copy
              </button>
              <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
                <code>{appsScriptCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Sheet Structure */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Required Sheet Structure</h3>
        <p className="text-xs text-slate-500 mb-4">Create the following sheets (tabs) in your Google Spreadsheet:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sheetStructure.map((sheet) => (
            <div key={sheet.name} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">
                  {sheet.name[0]}
                </span>
                {sheet.name}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 ml-7">
                Columns: {sheet.columns.join(', ')}
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
          The app communicates with Google Sheets through the Apps Script web app endpoint. All CRUD operations are handled server-side.
        </p>
      </div>
    </div>
  );
}

const sheetStructure = [
  { name: 'Inventory', columns: ['id', 'asin', 'sku', 'productName', 'marketplace', 'fulfillmentChannel', 'unitsOnHand', 'unitsInTransit', 'unitsInbound', 'daysOfCover', 'dailyVelocity', 'reorderPoint', 'stockBuffer', 'lastUpdated', 'status'] },
  { name: 'InboundShipments', columns: ['id', 'shipmentId', 'asin', 'sku', 'quantity', 'origin', 'destination', 'status', 'carrier', 'eta', 'shipDate', 'trackingNumber'] },
  { name: 'Forecast', columns: ['id', 'asin', 'sku', 'marketplace', 'avgDailySales', 'weeklyVelocity', 'daysOfCover', 'projectedStockoutDate', 'reorderDate', 'leadTimeDays', 'safetyStockDays', 'recommendedAction', 'priority'] },
  { name: 'FreightQuotes', columns: ['id', 'forwarder', 'lane', 'origin', 'destination', 'ratePerUnit', 'ratePerKg', 'transitTimeDays', 'placementFeeWaiver', 'aglDiscount', 'awdAutoReplenish', 'totalLandedCost', 'notes', 'validUntil'] },
  { name: 'Milestones', columns: ['id', 'project', 'milestone', 'description', 'dueDate', 'status', 'owner', 'progress'] },
];

const appsScriptCode = `/**
 * Inventory Planning - Google Apps Script Backend
 * Deploy as Web App with "Execute as: Me" and "Access: Anyone"
 */

const SHEETS = {
  INVENTORY: 'Inventory',
  INBOUND: 'InboundShipments',
  FORECAST: 'Forecast',
  FREIGHT: 'FreightQuotes',
  MILESTONES: 'Milestones'
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch(action) {
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
        return jsonResponse({ success: false, error: 'Unknown action' });
    }
  } catch(err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  const sheet = e.parameter.sheet;
  if (sheet) {
    return handleRead(sheet);
  }
  return jsonResponse({ success: true, message: 'Inventory Planning API is running' });
}

function handleRead(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return jsonResponse({ success: false, error: 'Sheet not found: ' + sheetName });
  }
  
  const data = sheet.getDataRange().getValues();
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
    sheet = ss.insertSheet(sheetName);
    // Add headers from first record
    if (records.length > 0) {
      const headers = Object.keys(records[0]);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rows = records.map(record => {
    return headers.map(header => record[header] || '');
  });
  
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
          sheet.getRange(i + 1, colIdx + 1).setValue(data[header]);
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

// Utility: Initialize all sheets with headers
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const sheetConfigs = {
    'Inventory': ['id','asin','sku','productName','marketplace','fulfillmentChannel','unitsOnHand','unitsInTransit','unitsInbound','daysOfCover','dailyVelocity','reorderPoint','stockBuffer','lastUpdated','status'],
    'InboundShipments': ['id','shipmentId','asin','sku','quantity','origin','destination','status','carrier','eta','shipDate','trackingNumber'],
    'Forecast': ['id','asin','sku','marketplace','avgDailySales','weeklyVelocity','daysOfCover','projectedStockoutDate','reorderDate','leadTimeDays','safetyStockDays','recommendedAction','priority'],
    'FreightQuotes': ['id','forwarder','lane','origin','destination','ratePerUnit','ratePerKg','transitTimeDays','placementFeeWaiver','aglDiscount','awdAutoReplenish','totalLandedCost','notes','validUntil'],
    'Milestones': ['id','project','milestone','description','dueDate','status','owner','progress']
  };
  
  Object.entries(sheetConfigs).forEach(([name, headers]) => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  });
}`;
