import React, { useState, useEffect } from 'react';
import {
  Video,
  Maximize2,
  Minimize2,
  Grid,
  Radio,
  Wifi,
  Battery,
  MapPin,
  AlertTriangle,
  Play,
  RotateCw,
  Camera,
  Activity
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { VideoFeed } from '../../types';
import { Badge } from '../common/Badge';

export const VideoMonitoringView: React.FC = () => {
  const { videoFeeds, setActiveTab, setSelectedIncident, incidents } = useCommand();

  const [activeLayout, setActiveLayout] = useState<'grid' | 'single'>('grid');
  const [selectedFeedId, setSelectedFeedId] = useState<string>(videoFeeds[0].id);
  const [filterType, setFilterType] = useState<string>('all');
  const [simulatedTimecode, setSimulatedTimecode] = useState<string>('09:44:12:08');

  // Simulated running timecode for video stream
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const ms = Math.floor(Math.random() * 90 + 10);
      const tc = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}:${ms}`;
      setSimulatedTimecode(tc);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const selectedFeed = videoFeeds.find(f => f.id === selectedFeedId) || videoFeeds[0];

  const filteredFeeds = videoFeeds.filter(f => {
    if (filterType === 'bodycam') return f.type === 'Body-Worn Camera';
    if (filterType === 'cctv') return f.type === 'Static CCTV';
    if (filterType === 'drone') return f.type === 'Aerial Drone';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Live Video Monitoring & Body-Worn Camera Matrix
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
              6 Channels Synchronized
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Simulated low-latency RTP/WebRTC tactical feeds from field police body-cams, aerial drones, and highway surveillance cameras.
          </p>
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-white border border-slate-300 rounded-lg p-1 flex items-center shadow-sm">
            <button
              onClick={() => setActiveLayout('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition-colors ${
                activeLayout === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid Matrix</span>
            </button>
            <button
              onClick={() => setActiveLayout('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition-colors ${
                activeLayout === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Focus Single Cam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-slate-500 font-semibold mr-1">Feed Source:</span>
        {[
          { id: 'all', label: 'All Video Feeds (6)' },
          { id: 'bodycam', label: 'Body-Worn Cameras' },
          { id: 'cctv', label: 'Fixed Junction CCTVs' },
          { id: 'drone', label: 'Aerial Surveillance Drones' },
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setFilterType(btn.id)}
            className={`px-3 py-1 rounded font-medium transition-all ${
              filterType === btn.id
                ? 'bg-slate-800 text-white font-semibold'
                : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Single View Mode */}
      {activeLayout === 'single' ? (
        <div className="space-y-4">
          <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
            {/* Video Canvas Container */}
            <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden scanline">
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background: `radial-gradient(ellipse at center, ${selectedFeed.streamColor} 0%, #030712 100%)`,
                }}
              />

              {/* Simulated Horizon / Tactical Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border border-emerald-500/20 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 border border-dashed border-emerald-500/30 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  </div>
                </div>
                <div className="absolute w-full h-[1px] bg-emerald-500/10" />
                <div className="absolute h-full w-[1px] bg-emerald-500/10" />
              </div>

              {/* Live Telemetry Watermark Overlay */}
              <div className="absolute top-4 left-4 z-10 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-600 text-white flex items-center gap-1 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    REC LIVE
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-emerald-400 border border-emerald-500/40 font-mono">
                    TC: {simulatedTimecode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/80 text-slate-300 border border-slate-700">
                    {selectedFeed.resolution} • {selectedFeed.fps} FPS
                  </span>
                </div>
                <p className="text-white font-bold text-sm tracking-wide drop-shadow-md">
                  {selectedFeed.name}
                </p>
                <p className="text-slate-300 text-xs flex items-center gap-1 drop-shadow">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>{selectedFeed.location}</span>
                </p>
              </div>

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 font-mono text-[11px] text-emerald-400 bg-slate-950/80 p-2 rounded border border-slate-800">
                <span>BITRATE: {selectedFeed.bitrate}</span>
                <span>•</span>
                {selectedFeed.battery && (
                  <span className="flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    {selectedFeed.battery}%
                  </span>
                )}
              </div>

              {/* Bottom Incident Callout if attached */}
              {selectedFeed.incidentId && (
                <div className="absolute bottom-4 left-4 z-10 bg-red-950/90 border border-red-700 p-2.5 rounded-lg flex items-center gap-3 text-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-xs">Linked Active Incident: {selectedFeed.incidentId}</span>
                    <p className="text-[11px] text-red-300">Live surveillance assigned to Sector Control Team</p>
                  </div>
                  <button
                    onClick={() => {
                      const inc = incidents.find(i => i.id === selectedFeed.incidentId);
                      if (inc) setSelectedIncident(inc);
                      setActiveTab('incidents');
                    }}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-bold"
                  >
                    View Incident
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Camera Selector Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
              {videoFeeds.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFeedId(f.id)}
                  className={`px-3 py-2 rounded-lg font-medium text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedFeedId === f.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${f.status === 'LIVE' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                  <span>{f.id}: {f.name.split(':')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Grid Matrix Mode (Section 11) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFeeds.map(feed => {
            const isLive = feed.status === 'LIVE';

            return (
              <div
                key={feed.id}
                className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-md flex flex-col justify-between group hover:border-blue-500 transition-all"
              >
                {/* Simulated Screen */}
                <div className="relative aspect-video w-full flex items-center justify-center scanline">
                  <div
                    className="absolute inset-0 opacity-80"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${feed.streamColor} 0%, #030712 100%)`,
                    }}
                  />

                  {/* Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <div className="w-20 h-20 border border-dashed border-emerald-400 rounded-full" />
                  </div>

                  {/* Top Bar Overlay */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-1 ${
                        isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-700 text-slate-300'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        {feed.status}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900/80 text-emerald-400 border border-slate-700">
                        {simulatedTimecode.slice(0, 8)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedFeedId(feed.id);
                        setActiveLayout('single');
                      }}
                      className="p-1 rounded bg-slate-900/80 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                      title="Fullscreen Focus"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Center Camera Icon / Watermark */}
                  <div className="z-10 text-center opacity-70">
                    <Camera className="w-8 h-8 text-white/50 mx-auto mb-1" />
                    <span className="text-[10px] font-mono text-slate-400">FEED ID: {feed.id}</span>
                  </div>

                  {/* Telemetry bottom bar */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-950/70 px-2 py-1 rounded backdrop-blur">
                    <span>{feed.resolution}</span>
                    <span>{feed.bitrate}</span>
                    {feed.battery && <span>BAT: {feed.battery}%</span>}
                  </div>
                </div>

                {/* Card Footer Details */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-xs truncate max-w-[200px]" title={feed.name}>
                      {feed.name}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                      {feed.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-red-400 flex-shrink-0" />
                    <span className="truncate">{feed.location}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
