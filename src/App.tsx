import { useState } from 'react';
import { TabType } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Forecasting from './pages/Forecasting';
import Shipments from './pages/Shipments';
import Logistics from './pages/Logistics';
import Projects from './pages/Projects';
import Settings from './pages/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'forecasting': return <Forecasting />;
      case 'shipments': return <Shipments />;
      case 'logistics': return <Logistics />;
      case 'projects': return <Projects />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <div className="p-6 max-w-[1400px] mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
