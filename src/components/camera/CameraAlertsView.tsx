import React, { useState } from 'react';
import { CameraAlert } from '../../types';
import { INITIAL_CAMERA_ALERTS } from '../../data/mockStore';
import {
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
  Filter,
  Check,
  X,
  FileText
} from 'lucide-react';

export const CameraAlertsView: React.FC = () => {
  const [alerts, setAlerts] = useState<CameraAlert[]>(INITIAL_CAMERA_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<CameraAlert | null>(alerts[0]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [reviewNote, setReviewNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleResolveAlert = (
    id: string,
    status: 'verified_break' | 'dismissed_glitch' | 'dismissed_lighting'
  ) => {
    const updatedAlerts = alerts.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          status,
          teacherNotes: reviewNote || a.teacherNotes || 'Reviewed by teacher.',
          reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return a;
    });

    setAlerts(updatedAlerts);
    if (selectedAlert?.id === id) {
      setSelectedAlert({
        ...selectedAlert,
        status,
        teacherNotes: reviewNote || selectedAlert.teacherNotes || 'Reviewed by teacher.',
        reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    setActionSuccess('Alert successfully updated and archived with pedagogical resolution notes.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#D5E9DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF3E8] border border-[#D5E9DC] text-[#006A4E] text-xs font-bold mb-2">
            <Camera className="w-3.5 h-3.5" />
            Classroom Presence Check Review
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18352A] tracking-tight">
            Provisional Camera Absence Alerts
          </h1>
          <p className="text-xs text-[#64776B] mt-0.5">
            Teacher supervision queue for provisional alerts generated during authorized online focus sessions.
          </p>
        </div>

        {/* Privacy Notice Badge */}
        <div className="p-3.5 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC] max-w-md text-xs text-[#64776B] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-[11px]">
            <strong className="text-[#18352A] block">Pedagogical Guardrails:</strong>
            <p>
              Camera absence does not infer misconduct. Absence may result from poor lighting, physical textbook lookups, or technical glitches.
            </p>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-[#DFF3E8] border border-[#D5E9DC] text-[#004B38] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#006A4E]" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid: Alert List (Left) & Alert Review Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Alerts List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#18352A] uppercase tracking-wider">
              Alerts Queue ({alerts.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredAlerts.map((alt) => {
              const isSelected = selectedAlert?.id === alt.id;
              return (
                <div
                  key={alt.id}
                  onClick={() => {
                    setSelectedAlert(alt);
                    setReviewNote(alt.teacherNotes || '');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-white border-[#006A4E] ring-2 ring-[#006A4E]/20 shadow-sm'
                      : 'bg-white border-[#D5E9DC] hover:border-[#006A4E]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DFF3E8] text-[#006A4E]">
                      Class {alt.classNum}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        alt.status === 'awaiting_review'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-[#64776B]'
                      }`}
                    >
                      {alt.status === 'awaiting_review' ? 'Awaiting Review' : 'Resolved'}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-[#18352A]">{alt.studentName}</h3>
                  <p className="text-[11px] text-[#64776B] line-clamp-1">{alt.sessionTitle}</p>

                  <div className="flex items-center justify-between text-[10px] text-[#64776B] pt-1 border-t border-[#D5E9DC]">
                    <span>Time: {alt.timestamp}</span>
                    <span>Duration: {alt.durationSeconds}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Detailed Alert Inspection & Disposition */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAlert ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D5E9DC] shadow-sm space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-[#D5E9DC]">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    Provisional Alert Notice
                  </span>
                  <h2 className="text-lg font-black text-[#18352A] mt-1.5">
                    {selectedAlert.studentName} • Class {selectedAlert.classNum}
                  </h2>
                  <p className="text-xs text-[#64776B]">
                    Session: {selectedAlert.sessionTitle}
                  </p>
                </div>

                <div className="text-right text-xs text-[#64776B]">
                  <span className="block font-bold text-[#18352A]">{selectedAlert.timestamp}</span>
                  <span>Absence: {selectedAlert.durationSeconds}s</span>
                </div>
              </div>

              {/* Exact alert text as per specification */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                  Provisional System Detection:
                </span>
                <p className="text-xs font-bold text-amber-950">
                  "{selectedAlert.message}"
                </p>
                <div className="text-[11px] text-amber-800 flex items-center gap-3 pt-1">
                  <span>Confidence: <strong>{Math.round(selectedAlert.confidence * 100)}%</strong></span>
                  <span>Grace Period: <strong>15s Exceeded</strong></span>
                </div>
              </div>

              {/* Resolution Notes */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#18352A]">
                  Teacher Review & Context Notes
                </label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="e.g. Student retrieved textbook from shelf; verified legitimate action."
                  className="w-full p-3.5 rounded-2xl border border-[#D5E9DC] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006A4E] bg-white text-[#18352A]"
                />
              </div>

              {/* Action Buttons for Teacher Disposition */}
              <div className="space-y-2 pt-2 border-t border-[#D5E9DC]">
                <span className="text-[11px] font-bold text-[#64776B] block">
                  Choose Teacher Resolution Action:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
                  <button
                    onClick={() => handleResolveAlert(selectedAlert.id, 'verified_break')}
                    className="p-3 rounded-xl bg-[#006A4E] hover:bg-[#004B38] text-white transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Legitimate Action</span>
                  </button>

                  <button
                    onClick={() => handleResolveAlert(selectedAlert.id, 'dismissed_lighting')}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#18352A] transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Poor Lighting Glitch</span>
                  </button>

                  <button
                    onClick={() => handleResolveAlert(selectedAlert.id, 'dismissed_glitch')}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#18352A] transition flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4 text-rose-600" />
                    <span>Dismiss False Alarm</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#64776B] bg-white rounded-3xl border border-[#D5E9DC]">
              Select an alert from the queue to view session telemetry and record resolution notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
