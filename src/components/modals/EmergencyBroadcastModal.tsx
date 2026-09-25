import React, { useState } from 'react';
import { X, Radio, AlertTriangle, Send, Users, Shield } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { ChatMessage } from '../../types';

interface EmergencyBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyBroadcastModal: React.FC<EmergencyBroadcastModalProps> = ({ isOpen, onClose }) => {
  const { sendEmergencyBroadcast, geofences } = useCommand();

  const [messageText, setMessageText] = useState('');
  const [recipientGroup, setRecipientGroup] = useState<ChatMessage['recipientGroup']>('All Personnel');
  const [sendSms, setSendSms] = useState(true);
  const [soundVibration, setSoundVibration] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendEmergencyBroadcast(messageText.trim(), recipientGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 font-sans text-xs">
      <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-red-950 text-white p-4 flex items-center justify-between border-b border-red-900">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-400 animate-pulse" />
            <div>
              <h2 className="text-sm font-bold text-white">Transmit District Emergency Broadcast</h2>
              <p className="text-[11px] text-red-200">Force alert flash, push notification, and SMS dispatch</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-800">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Select Target Recipient Tier *
            </label>
            <select
              value={recipientGroup}
              onChange={e => setRecipientGroup(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none"
            >
              <option value="All Personnel">📢 All Deployed Personnel (128 Officers)</option>
              <option value="Specific Zone">📍 Specific Geofence Sector Force</option>
              <option value="Police Team">👮 Bihar Police & QRT Force Only</option>
              <option value="Medical Rapid Response">🚑 Medical & SDRF Rescue Teams</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Emergency Broadcast Message *
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. URGENT: Heavy vehicle diversion active at Gandhi Chowk. All Sector-2 officers report to Main Camp for crowd surge relief."
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
            />
          </div>

          {/* Delivery Channels */}
          <div className="p-3 bg-red-50/50 rounded-lg border border-red-200 space-y-2">
            <span className="text-[10px] uppercase font-bold text-red-900 block">
              Emergency Delivery Channels
            </span>
            <div className="space-y-1.5 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendSms}
                  onChange={e => setSendSms(e.target.checked)}
                  className="rounded text-red-600 border-slate-300"
                />
                <span>SMS Gateway Fallback (Deliver even if mobile internet is poor)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundVibration}
                  onChange={e => setSoundVibration(e.target.checked)}
                  className="rounded text-red-600 border-slate-300"
                />
                <span>Override silent mode / Trigger high-decibel alert chime</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
