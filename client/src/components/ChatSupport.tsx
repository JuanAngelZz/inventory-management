import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/chat/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "@/components/ui/button";
import { sendMessage } from "@/api/chat";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function ChatSupport() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: '¡Hola! Soy tu asistente virtual personalizado. ¿En qué puedo ayudarte hoy con tu inventario? 📦'
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare history for the API
      // The API expects { messages: [...] }
      const history = [...messages, userMessage];
      
      const response = await sendMessage(history);
      
      const botMessage: Message = { 
        role: 'model', 
        content: response.response 
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ExpandableChat size="lg" position="bottom-right">
      <ExpandableChatHeader className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold">Inventori‑Bot ✨</h1>
        <p>Tu asistente para consultas de stock, reportes y más.</p>
      </ExpandableChatHeader>
      <ExpandableChatBody>
        <ChatMessageList>
          {messages.map((msg, index) => (
            <ChatBubble key={index} variant={msg.role === 'user' ? 'sent' : 'received'}>
              <ChatBubbleAvatar fallback={msg.role === 'user' ? 'YO' : 'AI'} />
              <ChatBubbleMessage variant={msg.role === 'user' ? 'sent' : 'received'}>
                {msg.role === 'model' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar fallback="AI" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
          <div ref={messagesEndRef} />
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter className="bg-background/40">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center w-full">
          <ChatInput 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta..."
            className="min-h-12 pr-12 resize-none rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-primary/30"
          />
          <Button 
            type="submit" 
            size="icon" 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}