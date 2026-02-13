"use client";

import { useEffect, useState, useRef } from "react";
import type { AgentMessage, AgentDialogueSession } from "@/types/agents";
import { AGENT_PROFILES } from "@/types/agents";
import { Bot, Sparkles, ChevronDown, MessageSquare } from "lucide-react";

interface AgentDialogueProps {
  npi: string;
}

export function AgentDialogue({ npi }: AgentDialogueProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch the dialogue
  useEffect(() => {
    let cancelled = false;

    async function fetchDialogue() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/agents/dialogue?npi=${npi}`);
        if (!res.ok) {
          throw new Error(`Failed to load dialogue (${res.status})`);
        }
        const session: AgentDialogueSession = await res.json();
        if (!cancelled) {
          setMessages(session.messages);
          setVisibleCount(0);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load agent dialogue");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDialogue();
    return () => {
      cancelled = true;
    };
  }, [npi]);

  // Animate messages appearing one by one
  useEffect(() => {
    if (messages.length === 0 || loading) return;

    // Show first message immediately
    if (visibleCount === 0) {
      setVisibleCount(1);
      return;
    }

    if (visibleCount >= messages.length) return;

    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, 1200); // 1.2s between each message appearing

    return () => clearTimeout(timer);
  }, [messages, visibleCount, loading]);

  // Auto-scroll to bottom as new messages appear
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [visibleCount, autoScroll]);

  // Detect if user scrolled up
  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setAutoScroll(isAtBottom);
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setAutoScroll(true);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <Bot className="absolute inset-0 m-auto h-5 w-5 text-indigo-600" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
          Initializing AI Field Force agents...
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          Strategist and Outreach Specialist are analyzing the profile
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
          <MessageSquare className="h-6 w-6 text-red-500" />
        </div>
        <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      </div>
    );
  }

  const visibleMessages = messages.slice(0, visibleCount);
  const isStreaming = visibleCount < messages.length;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            AI Field Force Dialogue
          </h3>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
            {isStreaming ? "Live" : `${messages.length} messages`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <AgentBadge role="strategist" />
          <AgentBadge role="outreach_specialist" />
        </div>
      </div>

      {/* Agent Intros */}
      <div className="grid grid-cols-2 gap-3 border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
        {(["strategist", "outreach_specialist"] as const).map((role) => {
          const agent = AGENT_PROFILES[role];
          return (
            <div
              key={role}
              className="flex items-start gap-2 rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800"
            >
              <span className="text-lg">{agent.avatar}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {agent.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {agent.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-5 py-4"
      >
        <div className="space-y-4">
          {visibleMessages.map((message, idx) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLatest={idx === visibleMessages.length - 1 && isStreaming}
            />
          ))}

          {/* Typing indicator */}
          {isStreaming && visibleCount > 0 && (
            <TypingIndicator
              role={messages[visibleCount]?.role ?? "strategist"}
            />
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {!autoScroll && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <button
            onClick={scrollToBottom}
            className="flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <ChevronDown className="h-3 w-3" />
            New messages
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function AgentBadge({ role }: { role: "strategist" | "outreach_specialist" }) {
  const agent = AGENT_PROFILES[role];
  const dotColor =
    role === "strategist"
      ? "bg-indigo-500"
      : "bg-emerald-500";

  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${dotColor} animate-pulse`} />
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {agent.name}
      </span>
    </div>
  );
}

function MessageBubble({
  message,
  isLatest,
}: {
  message: AgentMessage;
  isLatest: boolean;
}) {
  const agent = AGENT_PROFILES[message.role];
  const isStrategist = message.role === "strategist";

  const bubbleStyles = isStrategist
    ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800"
    : "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800";

  const nameColor = isStrategist
    ? "text-indigo-700 dark:text-indigo-300"
    : "text-emerald-700 dark:text-emerald-300";

  return (
    <div
      className={`flex gap-3 ${
        isLatest ? "animate-fade-in" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
          isStrategist
            ? "bg-indigo-100 dark:bg-indigo-900"
            : "bg-emerald-100 dark:bg-emerald-900"
        }`}
      >
        {agent.avatar}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className={`text-xs font-semibold ${nameColor}`}>
            {agent.name}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {agent.title}
          </span>
          {message.metadata?.type && (
            <MetadataBadge type={message.metadata.type} />
          )}
        </div>
        <div
          className={`rounded-lg border p-4 text-sm leading-relaxed text-gray-800 dark:text-gray-200 ${bubbleStyles}`}
        >
          <FormattedContent content={message.content} />
        </div>

        {/* Tags */}
        {message.metadata?.tags && message.metadata.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {message.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetadataBadge({
  type,
}: {
  type: NonNullable<AgentMessage["metadata"]>["type"];
}) {
  const styles: Record<string, string> = {
    analysis:
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    recommendation:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    action:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    report:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    question:
      "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  };

  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
        styles[type ?? ""] ?? styles.analysis
      }`}
    >
      {type}
    </span>
  );
}

function FormattedContent({ content }: { content: string }) {
  // Split content into lines and render with basic markdown-like formatting
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (line.trim() === "") return <div key={i} className="h-1.5" />;
        if (line.trim() === "---")
          return (
            <hr
              key={i}
              className="my-2 border-gray-300 dark:border-gray-600"
            />
          );

        // Bold text: **text**
        const formattedLine = line.replace(
          /\*\*(.+?)\*\*/g,
          '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>'
        );

        // List items
        if (line.trimStart().startsWith("- ")) {
          return (
            <div key={i} className="flex gap-2 pl-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400 dark:bg-gray-500" />
              <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^(\s*)- /, "") }} />
            </div>
          );
        }

        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      })}
    </div>
  );
}

function TypingIndicator({
  role,
}: {
  role: "strategist" | "outreach_specialist";
}) {
  const agent = AGENT_PROFILES[role];
  const isStrategist = role === "strategist";

  return (
    <div className="flex gap-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
          isStrategist
            ? "bg-indigo-100 dark:bg-indigo-900"
            : "bg-emerald-100 dark:bg-emerald-900"
        }`}
      >
        {agent.avatar}
      </div>
      <div
        className={`rounded-lg border px-4 py-3 ${
          isStrategist
            ? "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/40"
            : "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40"
        }`}
      >
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
          <span className="ml-2 text-xs text-gray-400">
            {agent.name} is typing...
          </span>
        </div>
      </div>
    </div>
  );
}
