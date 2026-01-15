
import React, { useState } from 'react';
import { AppView } from './types';
import Sidebar from './components/Sidebar';
import PersevanChat from './views/NexusChat';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.PERSEVAN);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      <main className="flex-1 flex flex-col transition-all duration-300 relative">
        <div className="h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
          <PersevanChat />
        </div>
        
        {/* Themed Gradients */}
        <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-900/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-emerald-900/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 opacity-50" />
      </main>
    </div>
  );
};

export default App;
