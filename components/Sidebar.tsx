
import React from 'react';
import { 
  Terminal, 
  History, 
  ChevronLeft, 
  ChevronRight,
  Cpu,
  ShieldCheck,
  Zap,
  Box
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onToggle }) => {
  return (
    <aside className={`${isOpen ? 'w-72' : 'w-24'} glass border-r border-white/5 h-full transition-all duration-500 ease-out flex flex-col z-50 bg-[#020202]/50`}>
      <div className="p-8 flex items-center justify-between">
        <div className={`flex items-center gap-4 ${!isOpen && 'hidden'}`}>
          <div className="w-10 h-10 aura-gradient rounded-xl flex items-center justify-center shadow-2xl ring-1 ring-white/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="font-heading font-black text-2xl tracking-tighter aura-text-gradient">PERSEVAN</span>
        </div>
        <button 
          onClick={onToggle}
          className="p-3 hover:bg-white/5 rounded-2xl transition-all text-gray-500 hover:text-white border border-transparent hover:border-white/10"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-5 space-y-3 mt-8">
        <button
          onClick={() => onNavigate(AppView.PERSEVAN)}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative overflow-hidden ${
            currentView === AppView.PERSEVAN 
              ? 'bg-white/5 text-white shadow-xl ring-1 ring-white/10' 
              : 'text-gray-500 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <Terminal className={`w-5 h-5 ${currentView === AppView.PERSEVAN ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
          {isOpen && <span className="font-black text-xs uppercase tracking-widest">Neural Console</span>}
          {currentView === AppView.PERSEVAN && <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500" />}
        </button>
        <button
          onClick={() => onNavigate(AppView.HISTORY)}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
            currentView === AppView.HISTORY 
              ? 'bg-white/5 text-white shadow-xl ring-1 ring-white/10' 
              : 'text-gray-500 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <History className={`w-5 h-5 ${currentView === AppView.HISTORY ? 'text-gray-300' : 'group-hover:text-white'}`} />
          {isOpen && <span className="font-black text-xs uppercase tracking-widest">Archived Logs</span>}
        </button>
      </nav>

      <div className="p-6 mt-auto space-y-6">
        <div className={`p-6 rounded-3xl glass border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent ${!isOpen && 'hidden'}`}>
           <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] uppercase font-black text-gray-500 tracking-[0.3em]">Core Status</span>
              <div className="flex gap-1">
                 <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                 <div className="w-1 h-1 rounded-full bg-blue-500" />
              </div>
           </div>
           <div className="flex items-center gap-3">
              <Box size={18} className="text-blue-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-300 font-black tracking-wider uppercase">Pro-Inference</span>
                <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Global Grid 01</span>
              </div>
           </div>
        </div>
        
        <div className={`flex flex-col items-center gap-4 p-4 ${!isOpen && 'w-full'}`}>
          <div className="flex items-center gap-3 opacity-30 group hover:opacity-100 transition-opacity">
            <ShieldCheck size={18} className="text-gray-500 group-hover:text-emerald-400" />
            {isOpen && <span className="text-[9px] text-gray-500 group-hover:text-white font-black uppercase tracking-[0.2em]">Guard Protocol Enabled</span>}
          </div>
          <div className="flex items-center gap-3 opacity-30 group hover:opacity-100 transition-opacity">
            <Zap size={18} className="text-gray-500 group-hover:text-blue-400" />
            {isOpen && <span className="text-[9px] text-gray-500 group-hover:text-white font-black uppercase tracking-[0.2em]">Ultra Latency Sync</span>}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
