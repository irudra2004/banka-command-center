import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Users,
  Shield,
  AlertTriangle,
  Compass,
  Layers,
  Battery,
  Wifi,
  Phone,
  MessageSquare,
  Eye,
  CheckCircle2,
  X,
  Navigation,
  MapPin,
  Maximize2
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { Personnel, Incident, GeofenceZone } from '../../types';
import { Badge } from '../common/Badge';

export const LiveMapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);

  const {
    personnel,
    geofences,
    incidents,
    dutyAssignments,
    selectedPersonnel,
    setSelectedPersonnel,
    selectedIncident,
    setSelectedIncident,
    setActiveTab,
  } = useCommand();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showZones, setShowZones] = useState<boolean>(true);
  const [showCheckpoints, setShowCheckpoints] = useState<boolean>(true);
  const [showIncidents, setShowIncidents] = useState<boolean>(true);
  const [inspectorPersonnel, setInspectorPersonnel] = useState<Personnel | null>(selectedPersonnel || null);
  const [inspectorIncident, setInspectorIncident] = useState<Incident | null>(selectedIncident || null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Banka town coords: ~24.84, 86.95
      const map = L.map(mapContainerRef.current, {
        center: [24.82, 86.93],
        zoom: 11,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // High-clarity CartoDB Positron / OSM map tile
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      zonesLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive or clean up
    };
  }, []);

  // Update Geofence Polygons & Checkpoints
  useEffect(() => {
    if (!mapInstanceRef.current || !zonesLayerRef.current) return;
    zonesLayerRef.current.clearLayers();

    if (showZones) {
      geofences.forEach(zone => {
        const isViolated = zone.status === 'Violated';
        const polygonColor = isViolated ? '#ef4444' : zone.color;

        const polygon = L.polygon(zone.coordinates, {
          color: polygonColor,
          weight: isViolated ? 3 : 2,
          opacity: 0.85,
          fillColor: polygonColor,
          fillOpacity: isViolated ? 0.25 : 0.15,
          dashArray: isViolated ? '6, 6' : undefined,
        });

        polygon.bindTooltip(
          `<div class="text-xs font-sans font-semibold p-1">
            <strong>${zone.name}</strong><br/>
            <span class="text-[11px] text-slate-600">Personnel: ${zone.assignedPersonnelCount} • Status: ${zone.status}</span>
          </div>`,
          { sticky: true, className: 'leaflet-tooltip-gov' }
        );

        zonesLayerRef.current?.addLayer(polygon);
      });
    }

    // Add Checkpoints along routes
    if (showCheckpoints) {
      dutyAssignments.forEach(duty => {
        duty.checkpoints.forEach(cp => {
          const cpIcon = L.divIcon({
            className: 'custom-checkpoint-marker',
            html: `
              <div class="relative flex items-center justify-center">
                <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
                  ✓
                </div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const cpMarker = L.marker([cp.lat, cp.lng], { icon: cpIcon });
          cpMarker.bindTooltip(
            `<div class="text-xs font-sans">
              <strong>Checkpoint: ${cp.name}</strong><br/>
              <span class="text-[11px] text-slate-500">${duty.title}</span><br/>
              <span class="text-[11px] font-semibold ${cp.reached ? 'text-emerald-600' : 'text-amber-600'}">
                ${cp.reached ? `Reached at ${cp.reachedTime || 'Shift'}` : 'Pending Arrival'}
              </span>
            </div>`,
            { direction: 'top' }
          );
          zonesLayerRef.current?.addLayer(cpMarker);
        });
      });
    }
  }, [geofences, dutyAssignments, showZones, showCheckpoints]);

  // Update Personnel & Incident Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    // Filter personnel
    const filteredPersonnel = personnel.filter(p => {
      if (activeFilter === 'police') return p.department === 'Police';
      if (activeFilter === 'magistrates') return p.department === 'Magistracy';
      if (activeFilter === 'emergency') return p.department === 'SDRF' || p.department === 'Health';
      if (activeFilter === 'violations') return p.dutyStatus === 'Outside Duty Zone';
      return true;
    });

    // Add personnel markers
    filteredPersonnel.forEach(p => {
      let pinColor = '#10b981'; // Green (Active)
      let pulseRingHtml = '';

      if (p.dutyStatus === 'Outside Duty Zone' || p.dutyStatus === 'Emergency') {
        pinColor = '#ef4444'; // Red (Emergency / Breach)
        pulseRingHtml = '<div class="pulse-ring"></div>';
      } else if (p.batteryLevel < 20 || p.distanceFromAssignedZone > 0) {
        pinColor = '#f59e0b'; // Amber (Warning)
        pulseRingHtml = '<div class="pulse-ring-amber"></div>';
      }

      const pIcon = L.divIcon({
        className: 'custom-personnel-marker',
        html: `
          <div class="relative cursor-pointer group">
            ${pulseRingHtml}
            <div class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center border-2 border-white transition-transform hover:scale-125" style="background-color: ${pinColor}">
              <span class="text-white text-[11px] font-bold font-mono">
                ${p.id.replace('OFF-', '')}
              </span>
            </div>
            <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center text-[8px] font-bold ${
              p.networkStatus === 'Offline' ? 'bg-slate-400' : 'bg-emerald-500 text-white'
            }">
              ${p.networkStatus === 'Offline' ? 'x' : '•'}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([p.currentLocation.lat, p.currentLocation.lng], { icon: pIcon });

      marker.on('click', () => {
        setInspectorPersonnel(p);
        setSelectedPersonnel(p);
        setInspectorIncident(null);
      });

      marker.bindTooltip(
        `<div class="text-xs font-sans">
          <strong>${p.name}</strong> (${p.id})<br/>
          <span class="text-[11px] text-slate-600">${p.designation}</span><br/>
          <span class="text-[11px] font-bold ${
            p.dutyStatus === 'Outside Duty Zone' ? 'text-red-600' : 'text-emerald-700'
          }">${p.dutyStatus} • ${p.locationStatus}</span>
        </div>`,
        { direction: 'top', offset: [0, -12] }
      );

      markersLayerRef.current?.addLayer(marker);
    });

    // Add Incidents
    if (showIncidents) {
      incidents
        .filter(inc => inc.status !== 'Resolved')
        .forEach(inc => {
          const incIcon = L.divIcon({
            className: 'custom-incident-marker',
            html: `
              <div class="relative cursor-pointer">
                <div class="pulse-ring"></div>
                <div class="w-8 h-8 rounded-full bg-purple-700 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
                  ⚠️
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const incMarker = L.marker([inc.location.lat, inc.location.lng], { icon: incIcon });

          incMarker.on('click', () => {
            setInspectorIncident(inc);
            setSelectedIncident(inc);
            setInspectorPersonnel(null);
          });

          incMarker.bindTooltip(
            `<div class="text-xs font-sans">
              <strong class="text-purple-900">${inc.category}: ${inc.title}</strong><br/>
              <span class="text-[11px] text-red-600 font-bold">Severity: ${inc.severity}</span>
            </div>`,
            { direction: 'top', offset: [0, -12] }
          );

          markersLayerRef.current?.addLayer(incMarker);
        });
    }
  }, [personnel, incidents, activeFilter, showIncidents, setSelectedPersonnel, setSelectedIncident]);

  // Center map on selected personnel if chosen from another tab
  useEffect(() => {
    if (selectedPersonnel && mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [selectedPersonnel.currentLocation.lat, selectedPersonnel.currentLocation.lng],
        14,
        { animate: true }
      );
      setInspectorPersonnel(selectedPersonnel);
    }
  }, [selectedPersonnel]);

  const fitBankaBounds = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([24.82, 86.93], 11, { animate: true });
    }
  };

  return (
    <div className="relative h-[calc(100vh-110px)] w-full flex flex-col bg-slate-100 overflow-hidden font-sans">
      {/* Top Filter and Controls Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm z-20">
        {/* Left: Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Filters:
          </span>
          {[
            { id: 'all', label: 'All Forces' },
            { id: 'police', label: 'Police Forces' },
            { id: 'magistrates', label: 'Magistracy' },
            { id: 'emergency', label: 'Emergency / SDRF' },
            { id: 'violations', label: 'Geofence Breaches ⚠️' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                activeFilter === btn.id
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Right: Layer Toggles & Reset View */}
        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={showZones}
              onChange={e => setShowZones(e.target.checked)}
              className="rounded text-blue-600 border-slate-300"
            />
            <span>Duty Zones</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={showCheckpoints}
              onChange={e => setShowCheckpoints(e.target.checked)}
              className="rounded text-blue-600 border-slate-300"
            />
            <span>Checkpoints</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={showIncidents}
              onChange={e => setShowIncidents(e.target.checked)}
              className="rounded text-purple-600 border-slate-300"
            />
            <span>Incidents</span>
          </label>

          <button
            onClick={fitBankaBounds}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold"
            title="Reset District View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full">
        {/* Leaflet DOM container */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Map Legend (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur border border-slate-300 rounded-lg p-3 shadow-lg text-xs space-y-1.5 max-w-[220px]">
          <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px] border-b pb-1">
            Map Indicators & Symbology
          </p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
            <span className="text-slate-700">🟢 Active Deployed Officer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-white" />
            <span className="text-slate-700">🟡 Warning / Low Battery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white" />
            <span className="text-slate-700">🔴 Emergency / Breach</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 border border-white" />
            <span className="text-slate-700">🔵 Assigned Checkpoint</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-700 border border-white" />
            <span className="text-slate-700">🟣 Active Incident Point</span>
          </div>
        </div>

        {/* Floating Side Inspector Panel (Personnel) */}
        {inspectorPersonnel && (
          <div className="absolute top-4 right-4 z-30 w-80 sm:w-96 bg-white border border-slate-300 rounded-xl shadow-2xl overflow-hidden flex flex-col text-xs max-h-[calc(100%-32px)]">
            {/* Header */}
            <div className="bg-[#0b2038] text-white p-3.5 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={inspectorPersonnel.avatar}
                  alt={inspectorPersonnel.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover"
                />
                <div>
                  <h3 className="font-bold text-sm text-white">{inspectorPersonnel.name}</h3>
                  <p className="text-[11px] text-amber-300 font-medium">{inspectorPersonnel.designation}</p>
                  <p className="text-[10px] text-slate-300 font-mono">ID: {inspectorPersonnel.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectorPersonnel(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inspector Body */}
            <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
              {/* Duty & Zone Section */}
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Assignment</p>
                <p className="font-semibold text-slate-800">{inspectorPersonnel.assignedDutyTitle}</p>
                <p className="text-[11px] text-slate-600">
                  Zone: <strong className="text-blue-700">{inspectorPersonnel.assignedZoneName}</strong>
                </p>
                <p className="text-[10px] text-slate-500">Event: {inspectorPersonnel.assignedEvent}</p>
              </div>

              {/* Status Chips */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Duty Status</span>
                  <Badge
                    variant={
                      inspectorPersonnel.dutyStatus === 'Outside Duty Zone' || inspectorPersonnel.dutyStatus === 'Emergency'
                        ? 'crimson'
                        : inspectorPersonnel.dutyStatus === 'Moving'
                        ? 'amber'
                        : 'emerald'
                    }
                    dot
                  >
                    {inspectorPersonnel.dutyStatus}
                  </Badge>
                </div>

                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Geofence Perimeter</span>
                  <span
                    className={`font-semibold ${
                      inspectorPersonnel.distanceFromAssignedZone > 0 ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {inspectorPersonnel.distanceFromAssignedZone > 0
                      ? `⚠ +${inspectorPersonnel.distanceFromAssignedZone}m Breach`
                      : '✓ Secure Inside Zone'}
                  </span>
                </div>
              </div>

              {/* Location & GPS Telemetry */}
              <div className="space-y-1 text-slate-700">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-900 block">{inspectorPersonnel.currentLocation.address}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      GPS: {inspectorPersonnel.currentLocation.lat.toFixed(5)}° N, {inspectorPersonnel.currentLocation.lng.toFixed(5)}° E
                    </span>
                  </div>
                </div>
              </div>

              {/* Device Telemetry Metrics */}
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Hardware & Telemetry</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Battery</span>
                    <div className="flex items-center justify-center gap-1 font-bold text-slate-800">
                      <Battery className={`w-3.5 h-3.5 ${inspectorPersonnel.batteryLevel < 25 ? 'text-red-500' : 'text-emerald-500'}`} />
                      <span>{inspectorPersonnel.batteryLevel}%</span>
                    </div>
                  </div>

                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Network</span>
                    <div className="flex items-center justify-center gap-1 font-bold text-slate-800">
                      <Wifi className="w-3.5 h-3.5 text-blue-500" />
                      <span>{inspectorPersonnel.networkStatus}</span>
                    </div>
                  </div>

                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Speed</span>
                    <div className="flex items-center justify-center gap-1 font-bold text-slate-800">
                      <Navigation className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{inspectorPersonnel.speedKmH} km/h</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Last Signal Update:</span>
                  <span className="font-semibold text-slate-700">{inspectorPersonnel.lastUpdate}</span>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="space-y-1.5 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${inspectorPersonnel.phone}`}
                    className="flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold text-center transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Radio</span>
                  </a>
                  <button
                    onClick={() => {
                      setActiveTab('communication');
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('personnel');
                  }}
                  className="w-full py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Full Personnel Dossier</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Side Inspector Panel (Incident) */}
        {inspectorIncident && (
          <div className="absolute top-4 right-4 z-30 w-80 sm:w-96 bg-white border border-purple-300 rounded-xl shadow-2xl overflow-hidden flex flex-col text-xs max-h-[calc(100%-32px)]">
            <div className="bg-purple-950 text-white p-3.5 flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                  {inspectorIncident.severity} INCIDENT
                </span>
                <h3 className="font-bold text-sm text-white mt-1">{inspectorIncident.title}</h3>
                <p className="text-[11px] text-purple-200">ID: {inspectorIncident.id}</p>
              </div>
              <button
                onClick={() => setInspectorIncident(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Location</p>
                <p className="font-semibold text-slate-800">{inspectorIncident.location.address}</p>
                <p className="text-[11px] text-slate-500">Zone: {inspectorIncident.zoneName || 'General Banka'}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Description</p>
                <p className="text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 leading-relaxed">
                  {inspectorIncident.description}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Assigned Response</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {inspectorIncident.responseTeam.map((member, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px]">
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('incidents')}
                className="w-full py-2 bg-purple-700 hover:bg-purple-600 text-white rounded font-semibold transition-colors mt-2"
              >
                Manage Incident & Dispatch Teams
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
