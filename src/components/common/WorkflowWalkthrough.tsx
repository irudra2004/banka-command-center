import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  MapPin,
  AlertTriangle,
  Send,
  FileCheck,
  X
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';

export const WorkflowWalkthrough: React.FC = () => {
  const {
    setActiveTab,
    triggerSimulatedBreach,
    triggerSimulatedIncident,
    personnel,
    setSelectedPersonnel,
    incidents,
    setSelectedIncident,
    emergencyAlerts,
    acknowledgeAlert,
    resolveIncident,
  } = useCommand();

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: 'Command Overview',
      desc: 'Inspect district KPIs (128 personnel, 6 geofences, active duties)',
      action: () => {
        setActiveTab('overview');
        setCurrentStep(2);
      },
      buttonText: 'View Dashboard KPIs',
    },
    {
      step: 2,
      title: 'Live Tactical Map',
      desc: 'Track officers, geofence polygons, and checkpoint pins',
      action: () => {
        setActiveTab('live-map');
        setCurrentStep(3);
      },
      buttonText: 'Open Live Leaflet Map',
    },
    {
      step: 3,
      title: 'Select Field Officer',
      desc: 'Inspect Insp. Rajesh Kumar Singh & battery/telemetry diagnostics',
      action: () => {
        const off = personnel.find(p => p.id === 'OFF-1042') || personnel[0];
        setSelectedPersonnel(off);
        setActiveTab('live-map');
        setCurrentStep(4);
      },
      buttonText: 'Inspect Officer 1042',
    },
    {
      step: 4,
      title: 'Trigger Incident & Alert',
      desc: 'Simulate critical distress signal & geofence perimeter breach',
      action: () => {
        triggerSimulatedIncident();
        triggerSimulatedBreach();
        setActiveTab('emergency-alerts');
        setCurrentStep(5);
      },
      buttonText: 'Simulate Incident & Breach',
    },
    {
      step: 5,
      title: 'Acknowledge Alert',
      desc: 'Supervisor confirms emergency alert in crisis console',
      action: () => {
        if (emergencyAlerts.length > 0) {
          acknowledgeAlert(emergencyAlerts[0].id);
        }
        setActiveTab('incidents');
        setCurrentStep(6);
      },
      buttonText: 'Acknowledge Emergency',
    },
    {
      step: 6,
      title: 'Assign Response Squad',
      desc: 'Deploy nearest patrol officers to the distress coordinates',
      action: () => {
        if (incidents.length > 0) {
          setSelectedIncident(incidents[0]);
        }
        setActiveTab('incidents');
        setCurrentStep(7);
      },
      buttonText: 'Manage Incident Queue',
    },
    {
      step: 7,
      title: 'Resolve & Generate Audit Report',
      desc: 'Mark situation cleared and download official analytics report',
      action: () => {
        if (incidents.length > 0) {
          resolveIncident(incidents[0].id, 'Cleared by District Command');
        }
        setActiveTab('analytics');
        setCurrentStep(1);
      },
      buttonText: 'View Final Reports',
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40 font-sans text-xs">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-full shadow-xl border border-blue-400 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Committee Demo Workflow</span>
          <span className="bg-blue-900/80 px-1.5 py-0.5 rounded-full text-[10px]">
            Step {currentStep}/7
          </span>
        </button>
      ) : (
        <div className="bg-white rounded-xl border border-slate-300 shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col animate-in slide-in-from-bottom-2 duration-150">
          {/* Header */}
          <div className="bg-[#0b2038] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <h4 className="font-bold text-xs">Proposal Evaluation Workflow Guide</h4>
                <p className="text-[10px] text-slate-300">Section 21 Command & Control Lifecycle</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Body */}
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {steps.map(s => {
              const isCurrent = s.step === currentStep;
              const isDone = s.step < currentStep;

              return (
                <div
                  key={s.step}
                  className={`p-2.5 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-blue-50 border-blue-300 shadow-sm'
                      : isDone
                      ? 'bg-slate-50 border-slate-200 opacity-70'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          isCurrent
                            ? 'bg-blue-600 text-white'
                            : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isDone ? '✓' : s.step}
                      </span>
                      <span className="font-bold text-slate-900">{s.title}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 pl-7">{s.desc}</p>

                  {isCurrent && (
                    <div className="mt-2.5 pl-7">
                      <button
                        onClick={s.action}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold text-[11px] shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <span>{s.buttonText}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
            <span>District Admin Command Demo Engine</span>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-blue-600 hover:underline font-semibold"
            >
              Restart Tour
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
