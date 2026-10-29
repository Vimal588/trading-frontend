import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Welcome to Apex Trading! Ask me about live markets, wallet deposits, or placing orders." },
  ]);
  const [draft, setDraft] = useState("");

  function send() {
    if (!draft.trim()) return;
    const query = draft.trim().toLowerCase();
    let reply = "I can guide you through trading! You can explore coins on the Dashboard, deposit via Razorpay or Stripe in your Wallet, and track your executed orders in Activity.";
    
    if (query.includes("deposit") || query.includes("fund") || query.includes("money")) {
      reply = "To deposit funds, navigate to the Wallet page and click 'Top Up'. You can pay via Razorpay or Stripe.";
    } else if (query.includes("trade") || query.includes("buy") || query.includes("sell")) {
      reply = "Click on any cryptocurrency from the Dashboard or Market Detail page to open the Buy/Sell execution dialog.";
    } else if (query.includes("withdraw")) {
      reply = "You can request a withdrawal to your registered bank account from the Withdrawal page.";
    }

    setMessages((m) => [
      ...m,
      { from: "user", text: draft },
      { from: "bot", text: reply },
    ]);
    setDraft("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <div className="mb-3 w-80 rounded-2xl border border-base-border2 bg-base-panel shadow-2xl overflow-hidden flex flex-col max-h-[440px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-border bg-base-panel2">
            <span className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <MessageCircle size={16} className="text-accent" /> Trading Assistant
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-muted hover:text-slate-200"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.from === "bot"
                    ? "bg-base-panel2 text-slate-200 rounded-xl rounded-tl-none px-3.5 py-2 text-xs max-w-[85%]"
                    : "bg-accent text-black font-medium rounded-xl rounded-tr-none px-3.5 py-2 text-xs max-w-[85%] ml-auto"
                }
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-base-border flex items-center gap-2 bg-base-panel/90">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask a question..."
              className="flex-1 h-9 rounded-lg border border-base-border2 bg-base-panel2 px-3 text-xs text-slate-200 placeholder:text-muted focus:outline-none"
            />
            <button
              onClick={send}
              className="h-9 w-9 rounded-lg bg-accent text-black flex items-center justify-center shrink-0 hover:bg-accent/90 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-accent text-black px-4 py-3 text-sm font-bold shadow-2xl hover:bg-accent/90 transition-all hover:scale-105"
      >
        <MessageCircle size={18} />
        Trading AI
      </button>
    </div>
  );
}
