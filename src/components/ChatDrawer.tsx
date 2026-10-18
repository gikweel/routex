import React, { useState, useRef, useEffect } from 'react';
import { Send, ExternalLink } from 'lucide-react';
import { ChatMessage, PinnedLocation } from '../types';

interface ChatDrawerProps {
  userLocation: { lat: number; lng: number };
  onDropPin: (location: PinnedLocation) => void;
  isOffline: boolean;
  t: (key: string) => any;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  userLocation,
  isOffline,
  t,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: 'Ask any question about locations, local transit, or directions. Responses use real-time Google Search data.',
      timestamp: Date.now(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (isOffline) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'msg-offline-' + Date.now(),
            sender: 'assistant',
            text: 'You are currently in offline mode. Real-time Google Search queries require an active network connection.',
            timestamp: Date.now(),
          },
        ]);
        setIsLoading(false);
        return;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          userLocation,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: 'msg-res-' + Date.now(),
        sender: 'assistant',
        text: data.text || 'No response returned.',
        timestamp: Date.now(),
        groundingChunks: data.groundingChunks || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'assistant',
          text: `Request failed: ${err.message || 'Network error'}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-200">
      {/* Stream */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            <div className="text-[11px] text-neutral-500 mb-1 px-1 font-mono">
              {msg.sender === 'user' ? 'You' : 'Assistant'} · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            <div
              className={`p-3 rounded text-xs leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-neutral-800 text-white'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-200'
              }`}
            >
              {msg.text}

              {/* Verified Sources */}
              {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-neutral-800 flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">Sources:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.groundingChunks.map((chunk, idx) => {
                      const uri = chunk.web?.uri || chunk.maps?.uri;
                      const title = chunk.web?.title || chunk.maps?.title || 'Web Result';
                      if (!uri) return null;
                      return (
                        <a
                          key={idx}
                          href={uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white underline decoration-neutral-700"
                        >
                          <span className="truncate max-w-[220px]">{title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded w-fit text-xs text-neutral-400 font-mono">
            Searching Google data...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t('chat.inputPlaceholder')}
          className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="py-2 px-3 rounded bg-white hover:bg-neutral-100 disabled:opacity-50 text-neutral-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
        >
          <span>{t('chat.send')}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
