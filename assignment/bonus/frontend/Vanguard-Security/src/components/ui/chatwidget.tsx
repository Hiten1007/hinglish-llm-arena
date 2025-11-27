import { useState, useRef, useEffect } from "react";
import { Send, X, ShieldAlert, Radio } from "lucide-react";

// Define the Persona Type
type Persona = "David Goggins" | "Alastor Moody";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [persona, setPersona] = useState<Persona>("David Goggins");
  const [isLoading, setIsLoading] = useState(false);
  
  // Chat History State
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    {
      role: "bot",
      text: "VANGUARD COMMAND LINK ESTABLISHED. REPORT STATUS.",
    },
  ]);

  // Auto-scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput(""); // Clear input immediately
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, persona: persona }),
      });

      if (!response.body) throw new Error("No stream body");

      // Handle Streaming Response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botReply = "";

      setMessages((prev) => [...prev, { role: "bot", text: "" }]); // Add empty bot placeholder

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botReply += chunk;

        // Update the last message with the new chunk
        setMessages((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { role: "bot", text: botReply };
          return newHistory;
        });
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ CONNECTION SEVERED. CHECK NETWORK UPLINK." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* 1. THE TOGGLE BUTTON (When closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-full shadow-2xl shadow-red-900/20 transition-all hover:scale-105 border border-red-500"
        >
          <div className="relative">
            <ShieldAlert className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border border-black"></span>
          </div>
          <span className="font-bold tracking-widest">OPEN COMMS</span>
        </button>
      )}

      {/* 2. THE CHAT WINDOW (When open) */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[400px] h-[600px] flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* HEADER */}
          <div className="bg-black p-4 border-b border-zinc-800 flex justify-between items-center relative overflow-hidden">
            {/* Scanline Effect in Header */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/10 to-transparent pointer-events-none opacity-50" />
            
            <div className="z-10">
              <h2 className="text-red-500 font-black text-lg tracking-tighter flex items-center gap-2">
                <Radio className="w-4 h-4 animate-pulse" /> 
                VANGUARD LINK
              </h2>
              <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-2">
                <span>SECURE</span>
                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                <span>ENCRYPTED</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white transition z-10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* PERSONA SWITCHER */}
          <div className="bg-zinc-900 p-2 flex gap-2 border-b border-zinc-800">
            <button
              onClick={() => setPersona("David Goggins")}
              className={`flex-1 text-xs font-bold py-2 rounded border transition-all uppercase ${
                persona === "David Goggins"
                  ? "bg-zinc-800 border-zinc-600 text-white"
                  : "bg-transparent border-transparent text-zinc-600 hover:text-zinc-400"
              }`}
            >
              Chief Goggins
            </button>
            <button
              onClick={() => setPersona("Alastor Moody")}
              className={`flex-1 text-xs font-bold py-2 rounded border transition-all uppercase ${
                persona === "Alastor Moody"
                  ? "bg-zinc-800 border-zinc-600 text-white"
                  : "bg-transparent border-transparent text-zinc-600 hover:text-zinc-400"
              }`}
            >
              Alastor Moody
            </button>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed border ${
                    msg.role === "user"
                      ? "bg-zinc-800 text-white border-zinc-700 rounded-br-none"
                      : "bg-red-950/20 text-red-100 border-red-900/30 rounded-bl-none font-mono"
                  }`}
                >
                  <span className="block text-[9px] opacity-50 mb-1 font-bold uppercase tracking-wider">
                    {msg.role === "user" ? "YOU" : persona.split(" ")[1].toUpperCase()}
                  </span>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-4 bg-black border-t border-zinc-800">
            <div className="flex gap-2">
              <input
                className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                placeholder="State your emergency..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}