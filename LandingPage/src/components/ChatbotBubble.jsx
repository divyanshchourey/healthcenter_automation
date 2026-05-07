import React, { useMemo, useState } from "react";
import { MessageCircle, Send, Paperclip, X } from "lucide-react";

const defaultBotReply = (text) => {
  if (!text) return "Please type your question so I can help.";
  const normalized = text.toLowerCase();

  if (normalized.includes("appointment")) {
    return "You can book appointments from the Appointment tab. Select doctor, date, and time to confirm.";
  }
  if (normalized.includes("bill") || normalized.includes("payment")) {
    return "Billing details are available in the Billing section. You can review paid and pending items there.";
  }
  if (normalized.includes("report") || normalized.includes("test")) {
    return "You can upload reports here and also check available reports in Prescription & Tests.";
  }
  return "Thanks for your query. Our support team will review this and get back to you soon.";
};

const ChatbotBubble = ({ title = "Health Assistant", onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi! This is your Medical AI Assistant.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const hasFiles = useMemo(() => uploadedFiles.length > 0, [uploadedFiles]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text && !hasFiles) return;

    let replyText = "No response recieved.Sorry, I encountered an error connecting to the AI.";
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text || "hey there!",
      files: uploadedFiles.map((f) => f.name),
      time: now,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setUploadedFiles([]);

    const typingId = `bot-typing-${Date.now()}`;
    setMessages((prev) => [...prev, {
      id: typingId,
      sender: "bot",
      text: "AI is thinking...",
      time: now,
    }]);
    if (onSendMessage) {
      try {
        const custom = await onSendMessage({ text, files: userMessage.files });
        if (typeof custom === "string" && custom.trim()) replyText = custom;
      } catch {
        replyText = "Sorry, I encountered an error connecting to the AI.";
      }
    }
    setMessages((prev) => 
      prev.map(m => m.id === typingId ? { 
        ...m, 
        id: `bot-${Date.now()}`, 
        text: replyText, 
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
      } : m)
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[92vw] h-[520px] bg-white rounded-2xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-blue-600 text-white flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-[11px] text-blue-100">Ask queries and upload reports</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-blue-700"
              aria-label="Close chat panel"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-blue-50/30">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 ${
                  m.sender === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-white border border-blue-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{m.text}</p>
                {m.files?.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {m.files.map((fileName) => (
                      <p key={fileName} className="text-[11px] opacity-90">
                        - {fileName}
                      </p>
                    ))}
                  </div>
                )}
                <p className={`text-[10px] mt-1 ${m.sender === "user" ? "text-blue-100" : "text-gray-400"}`}>
                  {m.time}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-blue-100 p-3 bg-white space-y-2">
            {hasFiles && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-2 py-1 max-h-16 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <p key={`${file.name}-${index}`} className="text-[11px] text-blue-700 truncate">
                    {file.name}
                  </p>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <label className="cursor-pointer shrink-0 p-2 rounded-lg border border-blue-200 hover:bg-blue-50">
                <Paperclip size={16} className="text-blue-700" />
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>

              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your query..."
                className="flex-1 resize-none border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                type="button"
                onClick={handleSend}
                className="shrink-0 p-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center"
        aria-label="Open chatbot"
      >
        <MessageCircle size={24} />
      </button>
    </>
  );
};

export default ChatbotBubble;

