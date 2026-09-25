export type UserRole =
  | 'District Administrator'
  | 'Supervisory Officer'
  | 'Monitoring Officer'
  | 'Field Officer'
  | 'Technical Administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: UserRole;
  designation: string;
  department: string;
  badgeNumber: string;
  avatar: string;
}

export type Department =
  | 'Police'
  | 'Magistracy'
  | 'Health'
  | 'SDRF'
  | 'Transport'
  | 'Excise';

export type DutyStatus =
  | 'On Duty'
  | 'Reached Location'
  | 'Moving'
  | 'Outside Duty Zone'
  | 'Emergency'
  | 'Offline';

export type LocationStatus =
  | 'Inside Zone'
  | 'Zone Boundary'
  | 'Violated (+350m)'
  | 'En Route'
  | 'Stationary';

export interface Personnel {
  id: string;
  name: string;
  employeeId: string;
  designation: string;
  department: Department;
  phone: string;
  avatar: string;
  dutyStatus: DutyStatus;
  locationStatus: LocationStatus;
  assignedZoneId: string;
  assignedZoneName: string;
  assignedDutyId: string;
  assignedDutyTitle: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  distanceFromAssignedZone: number; // in meters (0 = inside)
  batteryLevel: number;
  networkStatus: '5G' | '4G' | '3G' | 'Offline';
  lastUpdate: string;
  assignedEvent: string;
  currentIncidentId?: string;
  bodyCamActive: boolean;
  speedKmH: number;
  headingDeg: number;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'polygon' | 'circle';
  coordinates: [number, number][]; // Lat, Lng
  center: [number, number];
  radiusMeters?: number;
  color: string;
  status: 'Active' | 'Inactive' | 'Violated';
  assignedPersonnelCount: number;
  toleranceBufferMeters: number;
  activeEvent: string;
  riskLevel: 'Normal' | 'Elevated' | 'High';
  description: string;
}

export interface DutyAssignment {
  id: string;
  title: string;
  eventName: string;
  personnelId: string;
  personnelName: string;
  designation: string;
  zoneId: string;
  zoneName: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'Scheduled' | 'Active' | 'Completed' | 'Breached';
  instructions: string;
  checkpoints: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    reached: boolean;
    reachedTime?: string;
  }[];
}

export type IncidentCategory =
  | 'Law & Order'
  | 'Crowd Management'
  | 'Medical Emergency'
  | 'Fire'
  | 'Accident'
  | 'Security Threat'
  | 'Natural Disaster'
  | 'Other';

export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus =
  | 'Reported'
  | 'Acknowledged'
  | 'Team Dispatched'
  | 'In Progress'
  | 'Resolved';

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  zoneId?: string;
  zoneName?: string;
  reportedBy: string;
  reportedTime: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  responseTeam: string[];
  description: string;
  timeline: {
    id: string;
    time: string;
    action: string;
    actor: string;
  }[];
}

export interface EmergencyAlert {
  id: string;
  title: string;
  type:
    | 'Geofence Breach'
    | 'SOS / Panic'
    | 'Critical Incident'
    | 'VVIP Route Deviation'
    | 'Device Offline';
  severity: 'Warning' | 'Critical';
  location: string;
  lat: number;
  lng: number;
  time: string;
  reportingOfficer: string;
  personnelId?: string;
  incidentId?: string;
  status: 'Unacknowledged' | 'Acknowledged' | 'Response Dispatched' | 'Resolved';
  details: string;
}

export interface VideoFeed {
  id: string;
  name: string;
  location: string;
  status: 'LIVE' | 'STANDBY' | 'CONNECTING' | 'OFFLINE';
  type: 'Body-Worn Camera' | 'Static CCTV' | 'Aerial Drone' | 'Patrol Mobile Unit';
  officerId?: string;
  incidentId?: string;
  bitrate: string;
  resolution: string;
  fps: number;
  battery?: number;
  lat: number;
  lng: number;
  streamColor: string;
}

export interface SystemEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  expectedCrowd: string;
  deployedPersonnelCount: number;
  activeIncidentsCount: number;
  status: 'Active' | 'Planning' | 'Standby' | 'Concluded';
  dutyZones: string[];
  securityLevel: 'Standard' | 'Heightened' | 'Maximum';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module:
    | 'Duty Assignment'
    | 'Geofencing'
    | 'Incident Response'
    | 'Emergency Alert'
    | 'Live Tracking'
    | 'Authentication'
    | 'Settings'
    | 'Communication';
  ipDevice: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL_AUDIT';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientGroup: 'All Personnel' | 'Specific Zone' | 'Police Team' | 'Medical Rapid Response' | 'Direct';
  text: string;
  timestamp: string;
  isUrgent?: boolean;
}
