import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Minus } from 'lucide-react';
import { sendAIAssistantMessage } from '@/lib/api';
import type { Product } from '@/types';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  products?: Product[];
}

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hi bestie! I'm your shopping buddy 💜 How can I help you today?"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const res = await sendAIAssistantMessage(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: res.reply,
        products: res.recommendedProducts
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: "I'm having a quick refresh. Feel free to ask about Ribbed Tops or Wide-Leg Jeans!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestionChips = [
    'Find an item',
    'Style me for an occasion',
    'Vibe check outfit',
    'Offers for C-Style',
    'Offers in store'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Icon */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="relative group bg-[#1c1917] text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-2 border-purple-400/40"
          aria-label="Open C-Style AI Assistant"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white text-base shadow-inner">
            C
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
        </motion.button>
      )}

      {/* Floating Chat Widget Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden w-80 sm:w-96 flex flex-col transition-all duration-300 ${
              isMinimized ? 'h-16' : 'h-[520px]'
            }`}
          >
            {/* Header */}
            <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                    C
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#1c1917] text-sm">C</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                      BETA
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">AI Shopping Buddy</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-400">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                          msg.sender === 'user'
                            ? 'bg-[#1c1917] text-white rounded-tr-none'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none font-medium'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Bot Recommended Products */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="mt-2 grid grid-cols-2 gap-2 w-full">
                          {msg.products.map(p => (
                            <Link
                              key={p.id}
                              to={`/product/${p.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="bg-white rounded-xl p-2 border border-gray-100 shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex items-center gap-2 group"
                            >
                              <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform" />
                              <div className="overflow-hidden">
                                <p className="text-[11px] font-bold text-gray-900 truncate group-hover:text-purple-700">{p.name}</p>
                                <p className="text-[10px] text-purple-600 font-semibold">${p.price.toFixed(2)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-2 text-xs text-gray-400 pl-2">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-500" />
                      <span>Thinking...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestion Chips */}
                <div className="px-3 py-2 bg-white border-t border-gray-100 overflow-x-auto flex gap-1.5 no-scrollbar scrollbar-none">
                  {suggestionChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="whitespace-nowrap text-[11px] font-medium bg-gray-100 hover:bg-purple-50 hover:text-purple-700 text-gray-700 px-3 py-1.5 rounded-full transition-all border border-gray-200"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input Area */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || loading}
                    className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full disabled:opacity-40 shadow-sm transition-opacity"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
