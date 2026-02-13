"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search as SearchIcon,
  Sparkles,
  Bot,
  Radio,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
} from "lucide-react";
import type { DemoHcpProfile } from "@/lib/demo-seed";
import {
  generateAgentConversation,
  type AgentMessage,
  type AgentRole,
} from "@/lib/agent-conversation";

interface AgentConversationProps {
  profile: DemoHcpProfile;
}

// ─── Agent Metadata ─────────────────────────────────────────────────────────

const AGENT_META: Record<
  AgentRole,
  {
    icon: typeof Bot;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    bubbleBg: string;
    textColor: string;
  }
> = {
  scout: {
    icon: SearchIcon,
    label: "Scout",
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-100 dark:bg-sky-900/50",
    borderColor: "border-sky-200 dark:border-sky-800",
    bubbleBg: "bg-sky-50 dark:bg-sky-950/60",
    textColor: "text-sky-900 dark:text-sky-100",
  },
  strategist: {
    icon: Sparkles,
    label: "Strategist",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-100 dark:bg-violet-900/50",
    borderColor: "border-violet-200 dark:border-violet-800",
    bubbleBg: "bg-violet-50 dark:bg-violet-950/60",
    textColor: "text-violet-900 dark:text-violet-100",
  },
  system: {
    icon: Radio,
    label: "System",
    color: "text-gray-500 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-200 dark:border-gray-700",
    bubbleBg: "bg-gray-50 dark:bg-gray-900",
    textColor: "text-gray-600 dark:text-gray-300",
  },
};

// ─── Simple Markdown Renderer ───────────────────────────────────────────────

function renderSimpleMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Process bold markers
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={j} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={j}>{part}</span>;
    });

    // Handle list items
    if (line.trim().startsWith("- ")) {
      return (
        <div key={i} className="flex gap-2 pl-1">
          <span className="text-gray-400 select-none">-</span>
          <span>{rendered.map((r, k) => (typeof r === "string" ? r : <span key={k}>{r}</span>))}</span>
        </div>
      );
    }

    // Handle numbered lists
    const numberedMatch = line.trim().match(/^(\d+)\.\s/);
    if (numberedMatch) {
      return (
        <div key={i} className="flex gap-2 pl-1">
          <span className="text-gray-400 select-none font-medium min-w-[1.25rem] text-right">
            {numberedMatch[1]}.
          </span>
          <span>
            {rendered}
          </span>
        </div>
      );
    }

    // Empty line = spacing
    if (line.trim() === "") {
      return <div key={i} className="h-2" />;
    }

    return (
      <div key={i}>{rendered}</div>
    );
  });
}

// ─── Message Bubble Component ───────────────────────────────────────────────

function MessageBubble({
  message,
  isAnimating,
}: {
  message: AgentMessage;
  isAnimating: boolean;
}) {
  const meta = AGENT_META[message.role];
  const Icon = meta.icon;
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div
        className={`flex items-center justify-center gap-2 py-3 transition-opacity duration-300 ${
          isAnimating ? "opacity-0 animate-fadeIn" : "opacity-100"
        }`}
      >
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 dark:bg-gray-800">
          <Radio className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {renderSimpleMarkdown(message.content)}
          </span>
        </div>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  const isScout = message.role === "scout";

  return (
    <div
      className={`flex gap-3 ${isScout ? "" : "flex-row-reverse"} transition-opacity duration-300 ${
        isAnimating ? "opacity-0 animate-fadeIn" : "opacity-100"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.bgColor} ${meta.borderColor} border`}
      >
        <Icon className={`h-4 w-4 ${meta.color}`} />
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] ${isScout ? "" : "text-right"}`}>
        <div className={`mb-1 flex items-center gap-1.5 ${isScout ? "" : "justify-end"}`}>
          <span className={`text-xs font-semibold ${meta.color}`}>
            {meta.label}
          </span>
          <span className="text-[10px] text-gray-400">AI Agent</span>
        </div>
        <div
          className={`rounded-2xl ${
            isScout ? "rounded-tl-sm" : "rounded-tr-sm"
          } ${meta.bubbleBg} border ${meta.borderColor} px-4 py-3 text-sm leading-relaxed ${meta.textColor} text-left`}
        >
          {renderSimpleMarkdown(message.content)}
        </div>
      </div>
    </div>
  );
}

// ─── Typing Indicator ───────────────────────────────────────────────────────

function TypingIndicator({ role }: { role: AgentRole }) {
  const meta = AGENT_META[role];
  const Icon = meta.icon;

  if (role === "system") return null;

  const isScout = role === "scout";

  return (
    <div className={`flex gap-3 ${isScout ? "" : "flex-row-reverse"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.bgColor} ${meta.borderColor} border`}
      >
        <Icon className={`h-4 w-4 ${meta.color} animate-pulse`} />
      </div>
      <div
        className={`rounded-2xl ${
          isScout ? "rounded-tl-sm" : "rounded-tr-sm"
        } ${meta.bubbleBg} border ${meta.borderColor} px-4 py-3`}
      >
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function AgentConversation({ profile }: AgentConversationProps) {
  const conversation = generateAgentConversation(profile);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [typingRole, setTypingRole] = useState<AgentRole>("scout");
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalMessages = conversation.messages.length;

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [visibleCount, showTyping, scrollToBottom]);

  // Show next message
  const showNext = useCallback(() => {
    if (visibleCount >= totalMessages) {
      setIsPlaying(false);
      setIsComplete(true);
      setShowTyping(false);
      return;
    }

    const nextMsg = conversation.messages[visibleCount];

    // Show typing indicator first
    setTypingRole(nextMsg.role);
    setShowTyping(true);

    timerRef.current = setTimeout(() => {
      setShowTyping(false);
      setVisibleCount((prev) => prev + 1);

      if (visibleCount + 1 >= totalMessages) {
        setIsPlaying(false);
        setIsComplete(true);
      }
    }, nextMsg.role === "system" ? 400 : 1200);
  }, [visibleCount, totalMessages, conversation.messages]);

  // Playback engine
  useEffect(() => {
    if (!isPlaying || visibleCount >= totalMessages) return;

    const delay = visibleCount === 0 ? 300 : 800;
    timerRef.current = setTimeout(showNext, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, visibleCount, totalMessages, showNext]);

  // Start playing on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handlePlayPause = () => {
    if (isComplete) return;
    setIsPlaying((prev) => !prev);
    if (showTyping && !isPlaying) {
      // Resume — let current typing finish naturally
    }
  };

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowTyping(false);
    setVisibleCount(totalMessages);
    setIsPlaying(false);
    setIsComplete(true);
  };

  const handleRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisibleCount(0);
    setIsPlaying(false);
    setIsComplete(false);
    setShowTyping(false);
    setTimeout(() => setIsPlaying(true), 300);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          {/* Agent avatars */}
          <div className="flex -space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-sky-100 dark:border-gray-900 dark:bg-sky-900/50">
              <SearchIcon className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-violet-100 dark:border-gray-900 dark:bg-violet-900/50">
              <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Strategy Session
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Scout + Strategist agents collaborating
            </p>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-1">
          <span className="mr-2 text-xs tabular-nums text-gray-400">
            {visibleCount}/{totalMessages}
          </span>
          <button
            onClick={handlePlayPause}
            disabled={isComplete}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={handleSkip}
            disabled={isComplete}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            title="Skip to end"
          >
            <SkipForward className="h-4 w-4" />
          </button>
          <button
            onClick={handleRestart}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            title="Replay"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Agent legend */}
      <div className="flex items-center gap-4 border-b border-gray-100 px-4 py-2 dark:border-gray-800/50">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-sky-500" />
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            Scout — Research &amp; Profile Analysis
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            Strategist — Outreach Planning
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
        style={{ minHeight: 0 }}
      >
        {/* Pre-conversation state */}
        {visibleCount === 0 && !showTyping && !isPlaying && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex -space-x-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-sky-100 dark:border-gray-900 dark:bg-sky-900/50">
                <SearchIcon className="h-6 w-6 text-sky-600 dark:text-sky-400" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-violet-100 dark:border-gray-900 dark:bg-violet-900/50">
                <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Two AI agents will analyze Dr. {profile.lastName}&apos;s profile
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Watch them collaborate on a personalized outreach strategy
            </p>
            <button
              onClick={() => setIsPlaying(true)}
              className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              <Play className="h-4 w-4" />
              Start Session
            </button>
          </div>
        )}

        {/* Rendered messages */}
        {conversation.messages.slice(0, visibleCount).map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isAnimating={false}
          />
        ))}

        {/* Typing indicator */}
        {showTyping && <TypingIndicator role={typingRole} />}

        {/* Completion state */}
        {isComplete && (
          <div className="flex flex-col items-center py-4">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 dark:bg-emerald-950/50">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                Strategy session complete
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
