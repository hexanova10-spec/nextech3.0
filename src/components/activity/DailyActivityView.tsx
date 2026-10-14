import React, { useState } from 'react';
import { DailyActivityEvent, StudentProfile } from '../../types';
import { INITIAL_DAILY_ACTIVITIES } from '../../data/mockStore';
import {
  Clock,
  Filter,
  CheckCircle2,
  BookOpen,
  Calendar,
  Sparkles,
  Zap,
  Info,
  LogOut,
  LogIn,
  FileText
} from 'lucide-react';

interface DailyActivityViewProps {
  profile?: StudentProfile;
  isTeacher?: boolean;
}

export const DailyActivityView: React.FC<DailyActivityViewProps> = ({
  profile,
  isTeacher = false
}) => {
  const [events, setEvents] = useState<DailyActivityEvent[]>(INITIAL_DAILY_ACTIVITIES);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredEvents = events.filter((ev) => {
    if (filterCategory !== 'all' && ev.category !== filterCategory) return false;
    if (selectedSubject !== 'all' && ev.subject !== selectedSubject) return false;
    return true;
  });

  const getEventBadge = (type: DailyActivityEvent['eventType']) => {
    switch (type) {
      case 'login':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'study_session_started':
      case 'study_session_completed':
        return 'bg-[#DFF3E8] text-[#006A4E] border-[#D5E9DC]';
      case 'quiz_submitted':
      case 'lesson_completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'homework_submitted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#D5E9DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF3E8] border border-[#D5E9DC] text-[#006A4E] text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5" />
            Verified Daily Learning Timeline
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18352A] tracking-tight">
            Daily Activity Tracker
          </h1>
          <p className="text-xs text-[#64776B] mt-0.5">
            Chronological audit of study sessions, quiz submissions, homework progress, and offline synchronization.
          </p>
        </div>

        {/* Metric Triplet */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="p-3 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC]">
            <span className="text-[10px] text-[#64776B] block">Time in App:</span>
            <strong className="text-sm font-extrabold text-[#18352A]">1h 45m</strong>
          </div>
          <div className="p-3 rounded-2xl bg-[#DFF3E8] border border-[#D5E9DC]">
            <span className="text-[10px] text-[#004B38] block">Active Focus:</span>
            <strong className="text-sm font-extrabold text-[#006A4E]">55m</strong>
          </div>
          <div className="p-3 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC]">
            <span className="text-[10px] text-[#64776B] block">Tracked Tasks:</span>
            <strong className="text-sm font-extrabold text-[#18352A]">6 Events</strong>
          </div>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="p-4 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC] text-xs text-[#64776B] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" />
        <p>
          <strong>Educational Evidence Note:</strong> Time recorded in application reflects device connection and active interaction. Time alone does not prove conceptual mastery, which is evaluated through diagnostic quizzes and teacher homework reviews.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#D5E9DC]">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          <span className="text-[#64776B] text-[11px] mr-1">Category:</span>
          {['all', 'engagement', 'learning', 'assessment', 'focus'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl capitalize transition ${
                filterCategory === cat
                  ? 'bg-[#006A4E] text-white shadow-xs'
                  : 'bg-[#F4FBF6] text-[#64776B] hover:bg-[#DFF3E8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#64776B] font-bold">
          <span>Date: Today (October 14, 2026)</span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D5E9DC] shadow-sm space-y-6">
        <div className="relative border-l-2 border-[#D5E9DC] ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="relative group">
              {/* Dot icon on line */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-white border-2 border-[#006A4E] flex items-center justify-center text-[#006A4E] shadow-xs group-hover:scale-110 transition-transform">
                <div className="w-2 h-2 rounded-full bg-[#006A4E]" />
              </div>

              {/* Event Content Card */}
              <div className="p-4 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC] hover:border-[#006A4E] transition space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#006A4E] font-mono">
                      {ev.timestamp}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getEventBadge(
                        ev.eventType
                      )}`}
                    >
                      {ev.eventType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {ev.subject && (
                    <span className="text-[10px] font-bold text-[#64776B]">
                      {ev.subject}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-[#18352A]">
                  {ev.title}
                </h4>

                <p className="text-xs text-[#64776B] leading-relaxed">
                  {ev.description}
                </p>

                {ev.durationMinutes && (
                  <span className="text-[11px] font-semibold text-[#006A4E] inline-block pt-1">
                    Duration: ~{ev.durationMinutes} minutes
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
