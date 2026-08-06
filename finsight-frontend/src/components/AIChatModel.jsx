import React, { useState } from 'react';

export default function AIChatModel() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello Ajeyata! I am your FinSight AI assistant. How can I help you optimize your cash flow today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "I've analyzed your ledger. Your cash flow is running stable with a 58.2% net savings rate!";
      
      const query = userMessage.toLowerCase();
      if (query.includes('spend') || query.includes('kharcha') || query.includes('total')) {
        aiReply = "Your total spend for August 2026 is currently ₹21,000. Food & Dining and SaaS form your major expenses.";
      } else if (query.includes('saving') || query.includes('save')) {
        aiReply = "Great job! Your net savings rate is 58.2%, which is marked as 'Optimal Flow'.";
      } else if (query.includes('subscription') || query.includes('saas') || query.includes('aws')) {
        aiReply = "We detected a 14% increase in SaaS overhead due to tools like AWS and GitHub. Consolidating licenses could save you ~₹1,200/mo.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 px-4 py-3 rounded-2xl bg-[#34d399] text-[#0b1220] font-mono text-xs font-bold shadow-2xl flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all z-40"
      >
        <span className="w-2 h-2 rounded-full bg-[#0b1220] animate-ping"></span>
        <span>Ask FinSight AI</span>
      </button>

      {/* Chat Modal Window */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div 
            className="w-full max-w-lg border rounded-3xl shadow-2xl flex flex-col h-[500px] overflow-hidden transition-colors"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]"></span>
                <span className="font-bold" style={{ color: 'var(--text-main)' }}>FinSight Intelligence Engine</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs border cursor-pointer hover:bg-slate-500/10"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              >
                ✕
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl border leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30' 
                        : ''
                    }`}
                    style={{
                      backgroundColor: msg.sender === 'user' ? undefined : 'var(--bg-main)',
                      borderColor: msg.sender === 'user' ? undefined : 'var(--border-color)',
                      color: msg.sender === 'user' ? undefined : 'var(--text-main)'
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl border font-mono text-xs animate-pulse" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                    Analyzing ledger streams...
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t flex gap-2" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
              <input
                type="text"
                placeholder="Ask about spending, savings, or subscriptions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none transition-colors"
                style={{ 
                  backgroundColor: 'var(--bg-surface)', 
                  borderColor: 'var(--border-color)', 
                  color: 'var(--text-main)' 
                }}
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#34d399] text-[#0b1220] font-mono text-xs font-bold cursor-pointer hover:opacity-90 transition-all"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}