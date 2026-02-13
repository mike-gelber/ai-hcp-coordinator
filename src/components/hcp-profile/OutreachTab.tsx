"use client";

import type { DemoHcpProfile, DemoOutreachEvent } from "@/lib/demo-seed";
import { Send, CalendarClock, BarChart3, Mail, MessageSquare, FileText, Globe, Phone } from "lucide-react";

interface OutreachTabProps {
  profile: DemoHcpProfile;
}

export function OutreachTab({ profile }: OutreachTabProps) {
  const { outreach } = profile;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <MiniStat label="Total Touchpoints" value={String(outreach.totalTouchpoints)} />
        <MiniStat label="Engagement Rate" value={`${outreach.engagementRate}%`} />
        <MiniStat
          label="Last Contact"
          value={outreach.events.length > 0 ? outreach.events[0].date : "N/A"}
        />
        <MiniStat
          label="Next Scheduled"
          value={outreach.nextScheduled?.date || "N/A"}
        />
      </div>

      {/* Current Strategy */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Current Outreach Strategy
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {outreach.currentStrategy}
        </p>
      </div>

      {/* Upcoming Scheduled */}
      {outreach.nextScheduled && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950">
          <div className="mb-3 flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              Upcoming Scheduled Outreach
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChannelIcon channel={outreach.nextScheduled.channel} />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  {outreach.nextScheduled.subject}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  via {outreach.nextScheduled.channel} on{" "}
                  {outreach.nextScheduled.date}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-amber-200 px-3 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-800 dark:text-amber-200">
              Scheduled
            </span>
          </div>
        </div>
      )}

      {/* Engagement Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <Send className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Engagement Timeline
          </h3>
        </div>
        {outreach.events.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">
            No outreach history.
          </p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

            <div className="space-y-0">
              {outreach.events.map((event, i) => (
                <TimelineItem key={event.id} event={event} isLast={i === outreach.events.length - 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineItem({ event, isLast }: { event: DemoOutreachEvent; isLast: boolean }) {
  return (
    <div className="relative flex gap-4 pb-6">
      {/* Dot */}
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gray-100 dark:border-gray-900 dark:bg-gray-800">
        <ChannelIcon channel={event.channel} />
      </div>

      {/* Content */}
      <div className="flex-1 rounded-lg border border-gray-100 p-3 dark:border-gray-800">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {event.subject}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{event.date}</span>
              <span className="capitalize">{event.channel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {event.sentiment && (
              <SentimentBadge sentiment={event.sentiment} />
            )}
            <StatusBadge status={event.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelIcon({ channel }: { channel: string }) {
  const cls = "h-4 w-4 text-gray-500 dark:text-gray-400";
  switch (channel) {
    case "email":
      return <Mail className={cls} />;
    case "sms":
      return <MessageSquare className={cls} />;
    case "direct_mail":
      return <FileText className={cls} />;
    case "social":
      return <Globe className={cls} />;
    case "phone":
      return <Phone className={cls} />;
    default:
      return <Send className={cls} />;
  }
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    sent: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    delivered: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
    opened: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    clicked: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    replied: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    bounced: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    scheduled: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
        colors[status] || colors.sent
      }`}
    >
      {status}
    </span>
  );
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    positive: {
      label: "+",
      cls: "bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200",
    },
    neutral: {
      label: "~",
      cls: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    },
    negative: {
      label: "-",
      cls: "bg-rose-200 text-rose-800 dark:bg-rose-800 dark:text-rose-200",
    },
  };
  const s = map[sentiment] || map.neutral;

  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${s.cls}`}
      title={`${sentiment} sentiment`}
    >
      {s.label}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
