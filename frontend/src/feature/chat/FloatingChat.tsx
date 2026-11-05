// src/pages/SuperAdmin/Component/Feature/FloatingChat.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, SendHorizontal, CheckCheck, User
} from 'lucide-react';

interface FloatingChatProps {
  admin: { id: number; name: string; isOnline: boolean } | null;
  onClose: () => void;
  isLight: boolean;
}

export default function FloatingChat({ admin, onClose, isLight }: FloatingChatProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- DUMMY DATA CHAT ---
  const [messages, setMessages] = useState([
    { id: 1, senderId: admin?.id, text: `Halo Teknisi, ada yang bisa dibantu?`, timestamp: "10:30 AM" },
    { id: 2, senderId: "me", text: `Saya perhatikan ada error 500 saat Anda mengakses modul aset.`, timestamp: "10:35 AM" },
  ]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => { 
    scrollToBottom(); 
  }, [messages, admin]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      senderId: "me" as const,
      text: inputText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  if (!admin) return null;

  const bgPanel = isLight ? "bg-white" : "bg-[#131b2f]";
  const bgBody = isLight ? "bg-slate-50/50" : "bg-[#0b1120]/80";
  const borderCol = isLight ? "border-slate-200" : "border-slate-700/50";
  const textMain = isLight ? "text-slate-800" : "text-slate-100";
  const textMuted = isLight ? "text-slate-500" : "text-slate-400";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
      // FIX: Tinggi dikurangi menjadi h-[480px] agar pas, tidak menutupi layar terlalu banyak
      className={`fixed bottom-6 right-6 z-[9999] w-[340px] h-[380px] max-h-[85vh] flex flex-col rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border ${borderCol} ${bgPanel} overflow-hidden`}
    >
      {/* --- HEADER CHAT --- */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${borderCol} shrink-0 bg-gradient-to-r ${isLight ? 'from-white to-slate-50' : 'from-[#131b2f] to-[#1c2438]'}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center border border-indigo-200 dark:border-indigo-700">
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            {admin.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#131b2f]"></div>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className={`text-[13px] font-bold truncate w-[180px] ${textMain}`}>{admin.name}</h3>
            <span className={`text-[10px] font-semibold ${admin.isOnline ? 'text-emerald-500' : textMuted}`}>
              {admin.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className={`p-1.5 rounded-full transition-colors ${isLight ? 'text-slate-400 hover:bg-rose-50 hover:text-rose-500' : 'text-slate-400 hover:bg-rose-500/20 hover:text-rose-400'}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* --- BODY CHAT (BALON PESAN) --- */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar ${bgBody}`}>
        <div className="flex justify-center mb-4">
          <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isLight ? 'bg-slate-200/60 text-slate-500' : 'bg-slate-800 text-slate-400'}`}>
            Obrolan Dimulai
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === "me";
          return (
            <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col gap-0.5 max-w-[80%]`}>
                <div 
                  className={`relative px-3 py-2 text-[13px] leading-snug shadow-sm ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                      : isLight 
                        ? 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-tl-sm'
                        : 'bg-[#1c2438] text-slate-200 border border-slate-700/50 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 px-1 text-[9px] font-semibold ${textMuted} ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {msg.timestamp}
                  {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* --- FOOTER (INPUT CHAT MINIMALIS) --- */}
      <div className={`p-3 border-t shrink-0 ${borderCol} ${bgPanel}`}>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          
          <div className={`flex-1 flex items-center rounded-2xl border px-3 py-1.5 transition-colors ${isLight ? 'bg-slate-50 border-slate-200 focus-within:border-indigo-400' : 'bg-[#0f172a] border-slate-700 focus-within:border-indigo-500/50'}`}>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis pesan..."
              className="w-full bg-transparent border-none outline-none text-[13px] text-slate-800 dark:text-slate-200"
            />
          </div>

          <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="p-2 shrink-0 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:scale-95"
          >
            <SendHorizontal className="w-4 h-4" />
          </button>
        </form>
      </div>

    </motion.div>
  );
}