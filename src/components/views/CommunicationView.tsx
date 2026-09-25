import React, { useState } from 'react';
import {
  MessageSquare,
  Radio,
  Send,
  Phone,
  Video,
  Users,
  Search,
  Hash,
  Shield,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { ChatMessage } from '../../types';
import { EmergencyBroadcastModal } from '../modals/EmergencyBroadcastModal';

export const CommunicationView: React.FC = () => {
  const { messages, personnel, currentUser } = useCommand();

  const [activeChannel, setActiveChannel] = useState<string>('all');
  const [inputText, setInputText] = useState<string>('');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(messages);

  const channels = [
    { id: 'all', name: 'District All-Hands Command', group: 'All Personnel', unread: 2 },
    { id: 'police', name: 'Bihar Police & QRT Force', group: 'Police Team', unread: 1 },
    { id: 'medical', name: 'Medical & Disaster Response', group: 'Medical Rapid Response', unread: 0 },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentChannelObj = channels.find(c => c.id === activeChannel) || channels[0];

    const newMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      senderId: currentUser?.id || 'USR-001',
      senderName: currentUser?.name || 'DM Banka',
      senderRole: currentUser?.role || 'District Administrator',
      recipientGroup: currentChannelObj.group as any,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUrgent: false,
    };

    setChatHistory(prev => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Tactical Communication & Emergency Radio Dispatch
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
              Encrypted VHF & 5G Link Active
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Real-time administrative broadcast, supervisory channels, and field officer radio coordination.
          </p>
        </div>

        <button
          onClick={() => setIsBroadcastOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-sm transition-all"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Send Emergency Broadcast</span>
        </button>
      </div>

      {/* Main Communication Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-4 h-[640px]">
        {/* Left: Channels & Direct Roster */}
        <div className="border-r border-slate-200 bg-slate-50/70 p-3 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-[10px] uppercase font-bold text-slate-500 px-2">
              Operational Channels
            </div>
            <div className="space-y-1">
              {channels.map(chan => (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannel(chan.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                    activeChannel === chan.id
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{chan.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 text-[10px] uppercase font-bold text-slate-500 px-2">
              On-Duty Officers (Direct Line)
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {personnel.slice(0, 6).map(p => (
                <div
                  key={p.id}
                  className="px-2.5 py-1.5 rounded hover:bg-slate-200 flex items-center justify-between text-slate-800 cursor-pointer"
                  onClick={() => alert(`Calling radio link for ${p.name} (${p.phone})...`)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-2 h-2 rounded-full ${p.dutyStatus === 'Offline' ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                    <span className="truncate font-medium">{p.name.split(' ')[0]} {p.name.split(' ')[1] || ''}</span>
                  </div>
                  <Phone className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Voice / Video Call Station */}
          <div className="p-3 bg-slate-900 rounded-lg text-white space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>DISPATCH CONSOLE</span>
              <span className="text-emerald-400 font-mono">CHANNEL 4</span>
            </div>
            <div className="flex items-center justify-around pt-1">
              <button
                onClick={() => alert('Initiating Radio Dispatch Push-To-Talk broadcast to Banka Sector-1...')}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white"
                title="Push to Talk"
              >
                <Radio className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert('Launching Secure Multi-Agency Video Conference...')}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white"
                title="Conference Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 3 Cols: Active Chat Feed */}
        <div className="md:col-span-3 flex flex-col justify-between h-full bg-white">
          {/* Channel Header */}
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-blue-600" />
                <span>{channels.find(c => c.id === activeChannel)?.name}</span>
              </h3>
              <p className="text-[11px] text-slate-500">Official log recorded for post-event audit</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('VHF Radio bridge connected. Frequency 154.250 MHz.')}
                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-semibold flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Patch Radio</span>
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {chatHistory.map(msg => {
              const isMe = msg.senderId === currentUser?.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-400">({msg.senderRole})</span>
                    <span className="text-[10px] text-slate-400 font-mono">• {msg.timestamp}</span>
                    {msg.isUrgent && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-600 text-white uppercase">
                        CRITICAL BROADCAST
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-3 rounded-xl max-w-lg leading-relaxed shadow-sm text-xs ${
                      msg.isUrgent
                        ? 'bg-red-50 text-red-900 border border-red-300 font-medium'
                        : isMe
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Text Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type official dispatch directive or message..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Transmit</span>
            </button>
          </form>
        </div>
      </div>

      {/* Emergency Broadcast Modal */}
      <EmergencyBroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
      />
    </div>
  );
};
