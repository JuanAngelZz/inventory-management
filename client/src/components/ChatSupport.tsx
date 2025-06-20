import { Send } from "lucide-react";
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
 
export default function ChatSupport() {
  return (
    <ExpandableChat size="lg" position="bottom-right">
      <ExpandableChatHeader className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold">Inventori‑Bot ✨</h1>
        <p>Tu asistente para consultas de stock, reportes y más.</p>
      </ExpandableChatHeader>
      <ExpandableChatBody>
        <ChatMessageList>
          <ChatBubble>
            <ChatBubbleAvatar />
            <ChatBubbleMessage>¡Hola! Soy tu asistente virtual personalizado. ¿En qué puedo ayudarte hoy con tu inventario? 📦</ChatBubbleMessage>
          </ChatBubble>
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter>
        <ChatInput />
        <Button type="submit" size="icon">
          <Send className="size-4" />
        </Button>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}