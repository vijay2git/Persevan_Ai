
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  BookOpen, 
  Briefcase, 
  Paperclip, 
  X, 
  Loader2, 
  Cpu, 
  ShieldCheck, 
  Calendar, 
  FileText,
  Code,
  Zap,
  Image as ImageIcon,
  BrainCircuit,
  Activity,
  ChevronRight
} from 'lucide-react';
import { getPersevanResponse } from '../services/aiService';
import { Message, MessagePart } from '../types';
import Prism from 'prismjs';

const FilePreviewModal: React.FC<{
  file: { name: string, content: string } | null;
  onClose: () => void;
}> = ({ file, onClose }) => {
  const codeRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (file && codeRef.current) Prism.highlightElement(codeRef.current);
  }, [file]);

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />
      <div className="relative w-full max-w-6xl h-[85vh] flex flex-col glass rounded-[3rem] border-white/10 overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.1)] scale-100 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-8 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/10">
              <Code size={28} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-heading font-black text-2xl text-white tracking-tight">{file.name}</h3>
              <p className="text-[10px] text-blue-500/40 uppercase tracking-[0.5em] font-black">Contextual Architecture Mapping</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-2xl transition-all text-gray-500 hover:text-white"><X size={32} /></button>
        </div>
        <div className="flex-1 overflow-auto p-10 font-mono text-sm leading-relaxed custom-scrollbar bg-[#020202]">
          <pre className="language-clike">
            <code ref={codeRef} className="language-clike">{file.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

const PersevanChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Cognitive Core Alpha Online. Intelligence parity reached. I am Persevan Pro. Upload your architecture, code, or queries to begin.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'study' | 'interview'>('study');
  const [attachedFiles, setAttachedFiles] = useState<{name: string, content: string}[]>([]);
  const [attachedImages, setAttachedImages] = useState<{name: string, mimeType: string, data: string}[]>([]);
  const [previewFileIndex, setPreviewFileIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/');
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = (event.target?.result as string).split(',')[1];
        if (isImage) {
          setAttachedImages(prev => [...prev, { name: file.name, mimeType: file.type, data }]);
        } else {
          setAttachedFiles(prev => [...prev, { name: file.name, content: event.target?.result as string }]);
        }
      };
      if (isImage) reader.readAsDataURL(file);
      else reader.readAsText(file);
    });
  };

  const handleSend = async () => {
    if ((!input.trim() && attachedFiles.length === 0 && attachedImages.length === 0) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || "Initialize context analysis.",
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentFiles = [...attachedFiles];
    const currentImages = [...attachedImages];
    
    setInput('');
    setAttachedFiles([]);
    setAttachedImages([]);
    setIsLoading(true);

    try {
      const response = await getPersevanResponse(currentInput, mode, currentFiles, currentImages);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: response, timestamp: Date.now() }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "SYSTEM ERROR: Cognitive bridge collapsed. Verify API key and link.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (typeof msg.content === 'string') {
      const content = msg.content;
      if (msg.role === 'assistant' && mode === 'interview' && content.includes('---INSIGHTS---')) {
        const [main, insights] = content.split('---INSIGHTS---');
        return (
          <div className="space-y-8">
            <p className="whitespace-pre-wrap leading-[1.8]">{main.trim()}</p>
            <div className="p-8 bg-emerald-500/[0.03] border border-emerald-500/20 rounded-[2.5rem] shadow-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <ShieldCheck size={80} className="text-emerald-500" />
              </div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-emerald-400 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3">
                  <Activity size={18} className="animate-pulse" /> STAFF-ENGINEER INTELLIGENCE
                </h4>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-[9px] text-emerald-400 font-black border border-emerald-500/20 shadow-lg">LEVEL 5 ACCESS</div>
              </div>
              <div className="text-emerald-50/90 text-[15px] leading-[1.7] whitespace-pre-wrap font-medium">
                {insights.trim()}
              </div>
              <div className="mt-8 flex gap-4">
                 <button className="flex-1 flex items-center justify-center gap-3 text-xs font-black text-white bg-emerald-600 px-6 py-4 rounded-2xl hover:bg-emerald-500 transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(16,185,129,0.3)] uppercase tracking-widest">
                  <Calendar size={16} /> Mock Interview Simulator
                </button>
                <button className="px-6 py-4 rounded-2xl glass border-white/10 hover:bg-white/5 transition-all">
                  <ChevronRight size={20} className="text-emerald-400" />
                </button>
              </div>
            </div>
          </div>
        );
      }
      return <p className="whitespace-pre-wrap leading-[1.9]">{content}</p>;
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto pb-10 relative">
      {previewFileIndex !== null && (
        <FilePreviewModal file={attachedFiles[previewFileIndex]} onClose={() => setPreviewFileIndex(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-10 mb-12 sticky top-0 z-10 bg-[#050505]/90 backdrop-blur-3xl">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative w-16 h-16 bg-[#0a0a0a] rounded-[1.5rem] flex items-center justify-center border border-white/20 shadow-2xl">
               <Cpu className="text-blue-500" size={32} />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-heading font-black tracking-tighter aura-text-gradient">PERSEVAN PRO</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
              <span className="text-[11px] uppercase font-black text-emerald-500/60 tracking-[0.5em]">Cognitive Parity Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 glass p-2 rounded-[2rem] border-white/10 shadow-2xl">
          <button onClick={() => setMode('study')} className={`flex items-center gap-3 px-8 py-3.5 rounded-[1.5rem] text-xs font-black tracking-widest transition-all uppercase ${mode === 'study' ? 'bg-blue-600 text-white shadow-[0_10px_40px_rgba(37,99,235,0.4)] scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
            <BookOpen size={18} /> Study Core
          </button>
          <button onClick={() => setMode('interview')} className={`flex items-center gap-3 px-8 py-3.5 rounded-[1.5rem] text-xs font-black tracking-widest transition-all uppercase ${mode === 'interview' ? 'bg-emerald-600 text-white shadow-[0_10px_40px_rgba(5,150,105,0.4)] scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
            <Briefcase size={18} /> Staff Review
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-16 px-4 pb-24 custom-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-10 ${m.role === 'user' ? 'flex-row-reverse' : 'animate-in fade-in slide-in-from-bottom-8 duration-700'}`}>
            <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-2xl border transition-all ${
              m.role === 'user' ? 'bg-blue-600 border-blue-400' : 'bg-black border-white/20 hover:border-emerald-500/50'
            }`}>
              {m.role === 'user' ? <span className="font-black text-xl">U</span> : <BrainCircuit size={30} className="text-emerald-500" />}
            </div>
            <div className={`max-w-[80%] p-10 rounded-[3rem] text-[16px] shadow-2xl border transition-all ${
              m.role === 'user' 
                ? 'bg-blue-600/[0.03] border-blue-500/20 text-blue-100 rounded-tr-none' 
                : 'glass border-white/10 text-gray-50 rounded-tl-none hover:border-white/20'
            }`}>
              {renderMessageContent(m)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-10">
            <div className="w-14 h-14 rounded-[1.5rem] bg-black border border-emerald-500/30 flex items-center justify-center">
              <Loader2 className="animate-spin text-emerald-500" size={28} />
            </div>
            <div className="p-10 rounded-[3rem] glass border-white/10 rounded-tl-none flex flex-col gap-6 min-w-[400px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-emerald-400 text-xs font-black uppercase tracking-[0.5em]">
                  <BrainCircuit size={18} className="animate-pulse" /> Reasoning Phase
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">32K Tokens Budget Active</span>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500/40 animate-[shimmer_1.5s_infinite] w-[70%]" />
                </div>
                <div className="h-1.5 w-[85%] bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500/40 animate-[shimmer_2.5s_infinite] w-[40%]" />
                </div>
              </div>
              <p className="text-[10px] text-emerald-400/40 font-black uppercase tracking-[0.3em]">Synthesizing Architecture & Security Vectors...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-[#050505] pt-10 pb-4">
        <div className="flex flex-col gap-6">
          {(attachedFiles.length > 0 || attachedImages.length > 0) && (
            <div className="flex flex-wrap gap-4 p-6 glass rounded-[2.5rem] border border-white/10 shadow-2xl max-h-48 overflow-y-auto">
              {attachedImages.map((img, idx) => (
                <div key={`img-${idx}`} className="relative group w-20 h-20 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                  <img src={`data:${img.mimeType};base64,${img.data}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <button onClick={() => setAttachedImages(prev => prev.filter((_, i) => i !== idx))} className="absolute top-2 right-2 p-1.5 bg-black/80 rounded-full text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
                </div>
              ))}
              {attachedFiles.map((file, idx) => (
                <div key={`file-${idx}`} onClick={() => setPreviewFileIndex(idx)} className="flex items-center gap-3 bg-white/[0.03] border border-white/10 pl-5 pr-4 py-3 rounded-2xl text-[12px] font-black text-gray-400 cursor-pointer hover:bg-white/[0.08] transition-all group shadow-inner">
                  <FileText size={18} className="group-hover:text-blue-400 transition-colors" />
                  <span className="max-w-[180px] truncate">{file.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); setAttachedFiles(f => f.filter((_, i) => i !== idx)); }} className="p-1.5 hover:text-red-400 transition-colors"><X size={18} /></button>
                </div>
              ))}
            </div>
          )}

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/40 to-emerald-600/40 rounded-[2.8rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
            <div className="relative">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={`Engage Persevan Pro in ${mode} mode...`}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] py-8 pl-24 pr-28 focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-700 text-[17px] resize-none overflow-hidden leading-snug shadow-inner"
                style={{ height: 'auto' }}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-8 top-1/2 -translate-y-1/2 p-4 hover:bg-white/5 rounded-2xl text-gray-500 hover:text-blue-400 transition-all"
                title="Attach Context"
              >
                <Paperclip size={28} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple accept=".ts,.tsx,.js,.jsx,.py,.css,.json,.md,.html,.txt,image/*" />
              <button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && attachedFiles.length === 0 && attachedImages.length === 0)}
                className={`absolute right-6 top-1/2 -translate-y-1/2 p-5 rounded-[2rem] disabled:opacity-20 transition-all shadow-2xl scale-100 active:scale-95 ${mode === 'study' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'}`}
              >
                <Send size={28} />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center px-10">
             <div className="flex items-center gap-3 text-[10px] text-gray-700 font-black uppercase tracking-[0.6em]">
                <Activity size={12} className="text-emerald-500" /> Neural Link Secured
             </div>
             <div className="flex gap-6 items-center opacity-30">
                <ImageIcon size={14} className="text-gray-500" />
                <FileText size={14} className="text-gray-500" />
                <Zap size={14} className="text-blue-500" />
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default PersevanChat;
