import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  Personnel,
  GeofenceZone,
  DutyAssignment,
  Incident,
  EmergencyAlert,
  VideoFeed,
  SystemEvent,
  AuditLog,
  ChatMessage
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PERSONNEL,
  INITIAL_GEOFENCES,
  INITIAL_DUTIES,
  INITIAL_INCIDENTS,
  INITIAL_ALERTS,
  INITIAL_VIDEO_FEEDS,
  INITIAL_EVENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MESSAGES
} from '../data/mockData';

interface CommandContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  switchRole: (roleUser: User) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  personnel: Personnel[];
  selectedPersonnel: Personnel | null;
  setSelectedPersonnel: (p: Personnel | null) => void;

  geofences: GeofenceZone[];
  selectedGeofence: GeofenceZone | null;
  setSelectedGeofence: (g: GeofenceZone | null) => void;

  dutyAssignments: DutyAssignment[];
  selectedDuty: DutyAssignment | null;
  setSelectedDuty: (d: DutyAssignment | null) => void;

  incidents: Incident[];
  selectedIncident: Incident | null;
  setSelectedIncident: (inc: Incident | null) => void;

  emergencyAlerts: EmergencyAlert[];
  videoFeeds: VideoFeed[];
  events: SystemEvent[];
  auditLogs: AuditLog[];
  messages: ChatMessage[];

  // Simulation controls
  demoSimulationActive: boolean;
  toggleDemoSimulation: () => void;
  triggerSimulatedBreach: () => void;
  triggerSimulatedIncident: () => void;
  resetDemoData: () => void;

  // Actions
  addDutyAssignment: (duty: Omit<DutyAssignment, 'id'>) => void;
  addGeofence: (zone: Omit<GeofenceZone, 'id'>) => void;
  reportIncident: (incident: Omit<Incident, 'id' | 'timeline'>) => void;
  acknowledgeAlert: (alertId: string) => void;
  escalateAlert: (alertId: string) => void;
  assignResponseTeam: (incidentId: string, teamMembers: string[]) => void;
  resolveIncident: (incidentId: string, notes?: string) => void;
  sendEmergencyBroadcast: (text: string, recipientGroup: ChatMessage['recipientGroup']) => void;

  currentTime: string;
  notificationCount: number;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export const CommandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const [personnel, setPersonnel] = useState<Personnel[]>(INITIAL_PERSONNEL);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);

  const [geofences, setGeofences] = useState<GeofenceZone[]>(INITIAL_GEOFENCES);
  const [selectedGeofence, setSelectedGeofence] = useState<GeofenceZone | null>(null);

  const [dutyAssignments, setDutyAssignments] = useState<DutyAssignment[]>(INITIAL_DUTIES);
  const [selectedDuty, setSelectedDuty] = useState<DutyAssignment | null>(null);

  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(INITIAL_ALERTS);
  const [videoFeeds, setVideoFeeds] = useState<VideoFeed[]>(INITIAL_VIDEO_FEEDS);
  const [events] = useState<SystemEvent[]>(INITIAL_EVENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const [demoSimulationActive, setDemoSimulationActive] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Clock in IST
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      };
      setCurrentTime(new Intl.DateTimeFormat('en-IN', options).format(now) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const login = (userId: string) => {
    const u = INITIAL_USERS.find(usr => usr.id === userId) || INITIAL_USERS[0];
    setCurrentUser(u);
    setIsAuthenticated(true);
    addAuditLog(`User logged in: ${u.name} (${u.role})`, 'Authentication', 'SUCCESS');
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog(`User logged out: ${currentUser.name}`, 'Authentication', 'SUCCESS');
    }
    setIsAuthenticated(false);
  };

  const switchRole = (roleUser: User) => {
    setCurrentUser(roleUser);
    addAuditLog(`Switched active view role to: ${roleUser.role}`, 'Settings', 'SUCCESS');
  };

  const addAuditLog = useCallback((action: string, module: AuditLog['module'], status: AuditLog['status'] = 'SUCCESS') => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: currentUser ? currentUser.name : 'System Automated Daemon',
      role: currentUser ? currentUser.role : 'System',
      action,
      module,
      ipDevice: '10.24.1.10 (Banka NIC Intranet)',
      status,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  // Demo Simulation Heartbeat
  useEffect(() => {
    if (!demoSimulationActive) return;

    const timer = setInterval(() => {
      setPersonnel(prev =>
        prev.map(p => {
          if (p.dutyStatus === 'Offline') return p;
          // Add small jitter to latitude and longitude
          const dLat = (Math.random() - 0.48) * 0.0006;
          const dLng = (Math.random() - 0.48) * 0.0006;
          const newLat = p.currentLocation.lat + dLat;
          const newLng = p.currentLocation.lng + dLng;

          // Battery fluctuation
          const batteryDrain = Math.random() > 0.85 ? Math.max(5, p.batteryLevel - 1) : p.batteryLevel;
          const newSpeed = p.dutyStatus === 'Moving' ? +(Math.random() * 8 + 3).toFixed(1) : +(Math.random() * 2).toFixed(1);

          return {
            ...p,
            currentLocation: {
              ...p.currentLocation,
              lat: newLat,
              lng: newLng,
            },
            batteryLevel: batteryDrain,
            speedKmH: newSpeed,
            lastUpdate: 'Just now',
          };
        })
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [demoSimulationActive]);

  const toggleDemoSimulation = () => {
    setDemoSimulationActive(prev => {
      const next = !prev;
      addAuditLog(
        next ? 'Demo Simulation Started - Live GPS drift active' : 'Demo Simulation Paused',
        'Live Tracking',
        'SUCCESS'
      );
      return next;
    });
  };

  const triggerSimulatedBreach = () => {
    // Force Officer OFF-1042 or random officer out of zone
    const targetId = 'OFF-1042';
    setPersonnel(prev =>
      prev.map(p => {
        if (p.id === targetId) {
          return {
            ...p,
            dutyStatus: 'Outside Duty Zone',
            locationStatus: 'Violated (+350m)',
            distanceFromAssignedZone: 480,
            currentLocation: {
              ...p.currentLocation,
              lat: 24.7645,
              lng: 86.8335,
              address: 'NH-333 Northern Deviation (+480m from Zone Perimeter)',
            },
          };
        }
        return p;
      })
    );

    const newAlert: EmergencyAlert = {
      id: `ALERT-${Date.now().toString().slice(-3)}`,
      title: 'CRITICAL ALERT: Live Geofence Boundary Breach',
      type: 'Geofence Breach',
      severity: 'Critical',
      location: 'NH-333 Northern Deviation, Katoria Outer Belt',
      lat: 24.7645,
      lng: 86.8335,
      time: 'Just now',
      reportingOfficer: 'Automated Geofence Radar',
      personnelId: targetId,
      status: 'Unacknowledged',
      details: 'Officer Insp. Rajesh Kumar Singh has exceeded the 100m geofence tolerance buffer by 480 meters. Supervisor action required.',
    };

    setEmergencyAlerts(prev => [newAlert, ...prev]);
    addAuditLog('Geofence breach detected for Insp. Rajesh Kumar Singh (+480m)', 'Geofencing', 'WARNING');
  };

  const triggerSimulatedIncident = () => {
    const newInc: Incident = {
      id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Water Cordon Overcrowding at Papaharini Sarovar',
      category: 'Crowd Management',
      severity: 'High',
      status: 'Reported',
      location: {
        lat: 24.8105,
        lng: 87.0255,
        address: 'Papaharini Lake South Pier, Mandar Hill Precinct',
      },
      zoneId: 'ZONE-02',
      zoneName: 'Mandar Hill Pilgrimage & Fair Precinct',
      reportedBy: 'SI Manoj Pandey (OFF-1055)',
      reportedTime: 'Just now',
      responseTeam: ['SDRF Rescue Squad-1', 'Bousi Police Post'],
      description: 'Devotee surge along wooden barriers at sacred water bank. Reinforcement needed to control single-file bathing.',
      timeline: [
        { id: `TL-${Date.now()}`, time: 'Just now', action: 'Emergency reported via Mobile Telemetry', actor: 'SI Manoj Pandey' }
      ]
    };

    const newAlert: EmergencyAlert = {
      id: `ALERT-${Date.now().toString().slice(-3)}`,
      title: `URGENT INCIDENT: ${newInc.title}`,
      type: 'Critical Incident',
      severity: 'Critical',
      location: newInc.location.address,
      lat: newInc.location.lat,
      lng: newInc.location.lng,
      time: 'Just now',
      reportingOfficer: newInc.reportedBy,
      incidentId: newInc.id,
      status: 'Unacknowledged',
      details: newInc.description,
    };

    setIncidents(prev => [newInc, ...prev]);
    setEmergencyAlerts(prev => [newAlert, ...prev]);
    addAuditLog(`New incident reported: ${newInc.title} at ${newInc.location.address}`, 'Incident Response', 'WARNING');
  };

  const resetDemoData = () => {
    setPersonnel(INITIAL_PERSONNEL);
    setGeofences(INITIAL_GEOFENCES);
    setDutyAssignments(INITIAL_DUTIES);
    setIncidents(INITIAL_INCIDENTS);
    setEmergencyAlerts(INITIAL_ALERTS);
    setVideoFeeds(INITIAL_VIDEO_FEEDS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setMessages(INITIAL_MESSAGES);
    setSelectedPersonnel(null);
    setSelectedIncident(null);
    setSelectedGeofence(null);
    addAuditLog('System demo dataset restored to baseline', 'Settings', 'SUCCESS');
  };

  const addDutyAssignment = (duty: Omit<DutyAssignment, 'id'>) => {
    const newId = `DUTY-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newDuty: DutyAssignment = { ...duty, id: newId };
    setDutyAssignments(prev => [newDuty, ...prev]);

    // Update assigned personnel
    setPersonnel(prev =>
      prev.map(p => {
        if (p.id === duty.personnelId) {
          return {
            ...p,
            assignedDutyId: newId,
            assignedDutyTitle: duty.title,
            assignedZoneId: duty.zoneId,
            assignedZoneName: duty.zoneName,
            assignedEvent: duty.eventName,
            dutyStatus: 'On Duty',
          };
        }
        return p;
      })
    );

    addAuditLog(`Duty assignment created: ${duty.title} for ${duty.personnelName}`, 'Duty Assignment', 'SUCCESS');
  };

  const addGeofence = (zone: Omit<GeofenceZone, 'id'>) => {
    const newId = `ZONE-0${geofences.length + 1}`;
    const newZone: GeofenceZone = { ...zone, id: newId };
    setGeofences(prev => [...prev, newZone]);
    addAuditLog(`Geofence boundary defined: ${zone.name}`, 'Geofencing', 'SUCCESS');
  };

  const reportIncident = (incident: Omit<Incident, 'id' | 'timeline'>) => {
    const newId = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newIncident: Incident = {
      ...incident,
      id: newId,
      timeline: [
        {
          id: `TL-1`,
          time: 'Just now',
          action: 'Incident registered in Command Control System',
          actor: currentUser ? currentUser.name : incident.reportedBy,
        }
      ],
    };
    setIncidents(prev => [newIncident, ...prev]);

    // Generate emergency alert if High or Critical
    if (incident.severity === 'High' || incident.severity === 'Critical') {
      const alert: EmergencyAlert = {
        id: `ALERT-${Date.now().toString().slice(-3)}`,
        title: `${incident.severity.toUpperCase()} ALERT: ${incident.title}`,
        type: 'Critical Incident',
        severity: incident.severity === 'Critical' ? 'Critical' : 'Warning',
        location: incident.location.address,
        lat: incident.location.lat,
        lng: incident.location.lng,
        time: 'Just now',
        reportingOfficer: incident.reportedBy,
        incidentId: newId,
        status: 'Unacknowledged',
        details: incident.description,
      };
      setEmergencyAlerts(prev => [alert, ...prev]);
    }

    addAuditLog(`Incident logged: [${incident.category}] ${incident.title}`, 'Incident Response', 'SUCCESS');
  };

  const acknowledgeAlert = (alertId: string) => {
    setEmergencyAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'Acknowledged' } : a))
    );
    addAuditLog(`Alert ${alertId} acknowledged by ${currentUser?.name}`, 'Emergency Alert', 'SUCCESS');
  };

  const escalateAlert = (alertId: string) => {
    setEmergencyAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, severity: 'Critical' } : a))
    );
    addAuditLog(`Alert ${alertId} escalated to VVIP District Emergency Command`, 'Emergency Alert', 'WARNING');
  };

  const assignResponseTeam = (incidentId: string, teamMembers: string[]) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'Team Dispatched',
            responseTeam: [...new Set([...inc.responseTeam, ...teamMembers])],
            timeline: [
              ...inc.timeline,
              {
                id: `TL-${Date.now()}`,
                time: 'Just now',
                action: `Response team deployed: ${teamMembers.join(', ')}`,
                actor: currentUser?.name || 'Command Supervisor',
              }
            ]
          };
        }
        return inc;
      })
    );
    addAuditLog(`Emergency response dispatched for incident ${incidentId}`, 'Incident Response', 'SUCCESS');
  };

  const resolveIncident = (incidentId: string, notes?: string) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'Resolved',
            timeline: [
              ...inc.timeline,
              {
                id: `TL-${Date.now()}`,
                time: 'Just now',
                action: notes ? `Incident marked Resolved: ${notes}` : 'Incident marked Resolved after on-ground clearance',
                actor: currentUser?.name || 'District Magistrate',
              }
            ]
          };
        }
        return inc;
      })
    );

    // Resolve associated alerts
    setEmergencyAlerts(prev =>
      prev.map(a => (a.incidentId === incidentId ? { ...a, status: 'Resolved' } : a))
    );

    addAuditLog(`Incident ${incidentId} marked Resolved`, 'Incident Response', 'SUCCESS');
  };

  const sendEmergencyBroadcast = (text: string, recipientGroup: ChatMessage['recipientGroup']) => {
    const newMsg: ChatMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      senderId: currentUser?.id || 'USR-001',
      senderName: currentUser?.name || 'DM Banka',
      senderRole: currentUser?.role || 'District Administrator',
      recipientGroup,
      text,
      timestamp: 'Just now',
      isUrgent: true,
    };
    setMessages(prev => [newMsg, ...prev]);
    addAuditLog(`Emergency broadcast transmitted to ${recipientGroup}: "${text.slice(0, 40)}..."`, 'Communication', 'SUCCESS');
  };

  const unackAlertsCount = emergencyAlerts.filter(a => a.status === 'Unacknowledged').length;

  return (
    <CommandContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        switchRole,
        activeTab,
        setActiveTab,
        personnel,
        selectedPersonnel,
        setSelectedPersonnel,
        geofences,
        selectedGeofence,
        setSelectedGeofence,
        dutyAssignments,
        selectedDuty,
        setSelectedDuty,
        incidents,
        selectedIncident,
        setSelectedIncident,
        emergencyAlerts,
        videoFeeds,
        events,
        auditLogs,
        messages,
        demoSimulationActive,
        toggleDemoSimulation,
        triggerSimulatedBreach,
        triggerSimulatedIncident,
        resetDemoData,
        addDutyAssignment,
        addGeofence,
        reportIncident,
        acknowledgeAlert,
        escalateAlert,
        assignResponseTeam,
        resolveIncident,
        sendEmergencyBroadcast,
        currentTime,
        notificationCount: unackAlertsCount,
      }}
    >
      {children}
    </CommandContext.Provider>
  );
};

export const useCommand = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommand must be used within a CommandProvider');
  }
  return context;
};
