"use client";

import type { DemoHcpProfile, DemoOutreachEvent } from "@/lib/demo-seed";
import {
  Send,
  CalendarClock,
  BarChart3,
  Mail,
  MessageSquare,
  FileText,
  Globe,
  Phone,
} from "lucide-react";

interface OutreachTabProps {
  profile: DemoHcpProfile;
}

export function OutreachTab({ profile }: OutreachTabProps) {
  const { outreach } = profile;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <MiniStat label="Total Touchpoints" value={String(outreach.totalTouchpoints)} />
        <MiniStat label="Engagement Rate" value={`${outreach.engagementRate}%`} />
        <MiniStat
          label="Last Contact"
          value={outreach.events.length > 0 ? outreach.events[0].date : "N/A"}
        />
        <MiniStat label="Next Scheduled" value={outreach.nextScheduled?.date || "N/A"} />
      </div>

      <div className="rounded-xl border border-surface-border bg-surface-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-semibold text-white">Current Outreach Strategy</h3>
        </div>
        <p className="text-sm leading-relaxed text-gray-300">{outreach.currentStrategy}</p>
      </div>

      {outreach.nextScheduled && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
          <div className="mb-3 flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-amber-300">Upcoming Scheduled Outreach</h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChannelIcon channel={outreach.nextScheduled.channel} />
              <div>
                <p className="text-sm font-medium text-white">{outreach.nextScheduled.subject}</p>
                <p className="text-xs text-amber-400/70">
                  via {outreach.nextScheduled.channel} on {outreach.nextScheduled.date}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-amber-500/15 px-3 py-0.5 text-xs font-medium text-amber-400">
              Scheduled
            </span>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-surface-border bg-surface-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Send className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-semibold text-white">Engagement Timeline</h3>
        </div>
        {outreach.events.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">No outreach history.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-surface-border" />
            <div className="space-y-0">
              {outreach.events.map((event, i) => (
                <TimelineItem
                  key={event.id}
                  event={event}
                  isLast={i === outreach.events.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineItem({ event, isLast: _isLast }: { event: DemoOutreachEvent; isLast: boolean }) {
  return (
    <div className="relative flex gap-4 pb-6">
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-surface-card bg-surface-elevated">
        <ChannelIcon channel={event.channel} />
      </div>
      <div className="flex-1 rounded-lg border border-surface-border p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-white">{event.subject}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span>{event.date}</span>
              <span className="capitalize">{event.channel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {event.sentiment && <SentimentBadge sentiment={event.sentiment} />}
            <StatusBadge status={event.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelIcon({ channel }: { channel: string }) {
  const cls = "h-4 w-4 text-gray-500";
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
    sent: "bg-surface-elevated text-gray-300",
    delivered: "bg-cyan-500/15 text-cyan-400",
    opened: "bg-brand-400/10 text-brand-400",
    clicked: "bg-emerald-500/15 text-emerald-400",
    replied: "bg-emerald-500/15 text-emerald-400",
    bounced: "bg-rose-500/15 text-rose-400",
    scheduled: "bg-amber-500/15 text-amber-400",
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
      cls: "bg-emerald-500/20 text-emerald-400",
    },
    neutral: {
      label: "~",
      cls: "bg-surface-border text-gray-400",
    },
    negative: {
      label: "-",
      cls: "bg-rose-500/20 text-rose-400",
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
    <div className="rounded-xl border border-surface-border bg-surface-card p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}
