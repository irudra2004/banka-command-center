import React, { useState } from 'react';
import { CommandProvider, useCommand } from './context/CommandContext';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewView } from './components/views/OverviewView';
import { LiveMapView } from './components/views/LiveMapView';
import { PersonnelView } from './components/views/PersonnelView';
import { DutyAssignmentView } from './components/views/DutyAssignmentView';
import { GeofencingView } from './components/views/GeofencingView';
import { IncidentsView } from './components/views/IncidentsView';
import { EmergencyAlertsView } from './components/views/EmergencyAlertsView';
import { VideoMonitoringView } from './components/views/VideoMonitoringView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { EventManagementView } from './components/views/EventManagementView';
import { CommunicationView } from './components/views/CommunicationView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { SettingsView } from './components/views/SettingsView';
import { WorkflowWalkthrough } from './components/common/WorkflowWalkthrough';

const CommandAppContent: React.FC = () => {
  const { isAuthenticated, activeTab, setActiveTab } = useCommand();

  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // If user explicitly logs out in context
  React.useEffect(() => {
    if (!isAuthenticated && viewMode === 'dashboard') {
      setViewMode('landing');
    }
  }, [isAuthenticated, viewMode]);

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => setViewMode('dashboard')}
        onOpenLogin={() => setViewMode('login')}
      />
    );
  }

  if (viewMode === 'login') {
    return (
      <LoginPage
        onBackToLanding={() => setViewMode('landing')}
        onSuccess={() => setViewMode('dashboard')}
      />
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'live-map':
        return <LiveMapView />;
      case 'personnel':
        return <PersonnelView />;
      case 'duty-assignments':
        return <DutyAssignmentView />;
      case 'geofencing':
        return <GeofencingView />;
      case 'incidents':
        return <IncidentsView />;
      case 'emergency-alerts':
        return <EmergencyAlertsView />;
      case 'video-monitoring':
        return <VideoMonitoringView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'events':
        return <EventManagementView />;
      case 'communication':
        return <CommunicationView />;
      case 'audit-logs':
        return <AuditLogsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Command Header */}
      <Header
        onToggleSidebar={() => {
          if (window.innerWidth < 1024) {
            setMobileSidebarOpen(prev => !prev);
          } else {
            setSidebarCollapsed(prev => !prev);
          }
        }}
        onOpenNotifications={() => setActiveTab('emergency-alerts')}
      />

      {/* Main Body with Sidebar + View Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto bg-slate-100 relative">
          {renderActiveView()}
        </main>
      </div>

      {/* Evaluator Interactive Stepper / Walkthrough Helper */}
      <WorkflowWalkthrough />
    </div>
  );
};

export function App() {
  return (
    <CommandProvider>
      <CommandAppContent />
    </CommandProvider>
  );
}

export default App;
