//ChatHelp.tsx

import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, SendHorizontal, Paperclip, 
  Headset, CheckCheck, CircleDot
} from 'lucide-react';
import { ThemeContextAdmin } from "../../theme/ThemeContextAdmin.tsx";

export default function ChatHelp() {
  const context = useContext(ThemeContextAdmin) as any;
  const theme = context?.theme || "light";
  const isLight = theme === "light";

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- DUMMY DATA CHAT ---
  const [messages, setMessages] = useState([
    { id: 1, sender: "teknisi", text: "Halo Admin! Ada yang bisa saya bantu terkait sistem hari ini?", timestamp: "08:00 AM" },
  ]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "me",
      text: inputText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputText("");

    // Simulasi balasan dari teknisi setelah 1.5 detik
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: "teknisi",
        text: "Pesan diterima. Tim teknisi akan segera mengecek kendala tersebut.",
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  // --- STYLE HELPERS ---
  const bgPanel = isLight ? "bg-white" : "bg-[#131b2f]";
  const bgBody = isLight ? "bg-slate-50/80" : "bg-[#0b1120]/80";
  const borderCol = isLight ? "border-slate-200" : "border-slate-700/50";
  const textMain = isLight ? "text-slate-800" : "text-slate-100";
  const textMuted = isLight ? "text-slate-500" : "text-slate-400";

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start">
      
      {/* --- WIDGET CHAT BOX (MUNCUL KE ATAS) --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9, originX: 0, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
            className={`mb-4 w-[340px] h-[480px] max-h-[80vh] flex flex-col rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border ${borderCol} ${bgPanel} overflow-hidden`}
          >
            {/* --- HEADER CHAT --- */}
            <div className={`flex items-center justify-between px-4 py-3 shrink-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <Headset className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-indigo-600"></div>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[14px] font-extrabold tracking-wide leading-tight">IT Support</h3>
                  <span className="text-[10px] font-medium text-indigo-100 flex items-center gap-1 mt-0.5">
                    <CircleDot className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400 animate-pulse"/> Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* --- BODY CHAT (BALON PESAN) --- */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar ${bgBody}`}>
              <div className="flex justify-center mb-2">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isLight ? 'bg-slate-200/60 text-slate-500' : 'bg-slate-800 text-slate-400'}`}>
                  Koneksi Terenkripsi
                </span>
              </div>

              {messages.map((msg) => {
                const isMe = msg.sender === "me";
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex flex-col gap-1 max-w-[85%]`}>
                      <div 
                        className={`relative px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm' 
                            : isLight 
                              ? 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-sm'
                              : 'bg-[#1c2438] text-slate-200 border border-slate-700/50 rounded-2xl rounded-bl-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className={`flex items-center gap-1 px-1 text-[9px] font-bold ${textMuted} ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {msg.timestamp}
                        {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* --- FOOTER (INPUT CHAT) --- */}
            <div className={`p-3 border-t shrink-0 ${borderCol} ${bgPanel}`}>
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button type="button" className={`p-2 rounded-full transition-colors ${isLight ? 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100' : 'text-slate-500 hover:text-indigo-400 hover:bg-slate-800'}`}>
                  <Paperclip className="w-4 h-4" />
                </button>
                
                <div className={`flex-1 flex items-center rounded-2xl border px-3 py-1.5 transition-colors ${isLight ? 'bg-slate-50 border-slate-200 focus-within:border-indigo-400' : 'bg-[#0f172a] border-slate-700 focus-within:border-indigo-500/50'}`}>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tanya teknisi..."
                    className="w-full bg-transparent border-none outline-none text-[13px] text-slate-800 dark:text-slate-200"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="p-2 shrink-0 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:scale-95"
                >
                  <SendHorizontal className="w-4 h-4" />
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOMBOL TRIGGER (BUBBLE CHAT) --- */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full shadow-[0_8px_20px_rgba(79,70,229,0.4)] hover:shadow-[0_10px_25px_rgba(79,70,229,0.6)] transition-all z-50 group"
      >
        <MessageCircle className={`w-6 h-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-180 scale-0 opacity-0 absolute' : 'rotate-0 scale-100 opacity-100'}`} />
        <X className={`w-6 h-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0 absolute'}`} />
        
        {/* Notifikasi Dot */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border-2 border-white dark:border-[#0a0a0a]"></span>
          </span>
        )}
      </motion.button>

    </div>
  );
}