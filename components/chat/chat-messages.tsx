"use client";

import { Fragment, useEffect, useRef, useState, ElementRef } from "react";
import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { ChatItem } from "./chat-item";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-hook";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
}

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const [pageSize, setPageSize] = useState<number | null>(null);

  useEffect(() => {
    const chatElement = chatRef.current;

    if (!chatElement) {
      return;
    }

    const updatePageSize = () => {
      const nextPageSize = Math.min(100, Math.max(1, Math.ceil(chatElement.clientHeight / 45)));
      setPageSize((currentPageSize) => currentPageSize === nextPageSize ? currentPageSize : nextPageSize);
    };

    const observer = new ResizeObserver(updatePageSize);
    observer.observe(chatElement);
    updatePageSize();

    return () => observer.disconnect();
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
    pageSize,
  });
  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  })

  const latestMessageId = data?.pages[0]?.items.at(-1)?.id;

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [latestMessageId]);

  if (status === "pending") {
    return (
      <div ref={chatRef} className="flex flex-col flex-1 justify-center items-center py-4 overflow-y-auto">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...  
        </p>        
      </div>
    )
  }

  if (status === "error") {
    return (
      <div ref={chatRef} className="flex flex-col flex-1 justify-center items-center py-4 overflow-y-auto">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!  
        </p>        
      </div>
    )
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex flex-col mt-auto">
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          </div>
        )}
        {!hasNextPage && (
          <ChatWelcome
            type={type}
            name={name}
          />
        )}
        {[...(data?.pages ?? [])].reverse().map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                fileType={message.fileType}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}