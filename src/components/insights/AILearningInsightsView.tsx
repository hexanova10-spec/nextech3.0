import React, { useState } from 'react';
import { AILearningInsight, StudentProfile } from '../../types';
import { INITIAL_AI_INSIGHTS } from '../../data/mockStore';
import {
  Sparkles,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Send,
  ShieldCheck,
  Check
} from 'lucide-react';

interface AILearningInsightsViewProps {
  profile?: StudentProfile;
  onAssignRevision?: (insight: AILearningInsight) => void;
}

export const AILearningInsightsView: React.FC<AILearningInsightsViewProps> = ({
  profile,
  onAssignRevision
}) => {
  const [insights, setInsights] = useState<AILearningInsight[]>(INITIAL_AI_INSIGHTS);
  const [assignedStatus, setAssignedStatus] = useState<Record<string, boolean>>({});

  const handleActionClick = (insight: AILearningInsight) => {
    setAssignedStatus((prev) => ({ ...prev, [insight.id]: true }));
    if (onAssignRevision) {
      onAssignRevision(insight);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#D5E9DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF3E8] border border-[#D5E9DC] text-[#006A4E] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptive Pedagogical Intelligence
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18352A] tracking-tight">
            AI Learning Insights & Diagnostics
          </h1>
          <p className="text-xs text-[#64776B] mt-0.5">
            Evidence-backed conceptual observations derived from student quiz patterns, homework submissions, and study pacing.
          </p>
        </div>

        {/* Ethical AI Guardrail Note */}
        <div className="p-3.5 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC] max-w-sm text-xs text-[#64776B] flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight">
            <strong>Advisory Guardrail:</strong> AI suggestions are purely formative recommendations. No high-stakes decisions or grading are made without teacher review.
          </p>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((ins) => {
          const isAssigned = assignedStatus[ins.id];

          return (
            <div
              key={ins.id}
              className="bg-white rounded-3xl p-6 border border-[#D5E9DC] shadow-sm space-y-4 flex flex-col justify-between hover:border-[#006A4E] transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      ins.type === 'gap_identified'
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : ins.type === 'improvement_noticed'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-blue-50 text-blue-900 border-blue-200'
                    }`}
                  >
                    {ins.type === 'gap_identified'
                      ? 'Learning Gap'
                      : ins.type === 'improvement_noticed'
                      ? 'Improvement Detected'
                      : 'Curriculum Pacing'}
                  </span>

                  <span className="text-[10px] font-bold text-[#64776B]">
                    {Math.round(ins.confidenceScore * 100)}% Confidence
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#18352A] leading-snug">
                  {ins.title}
                </h3>

                {/* Observation */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-[#64776B] uppercase tracking-wider block">
                    Observed Student Behavior:
                  </span>
                  <p className="text-[#18352A] leading-relaxed">
                    {ins.observation}
                  </p>
                </div>

                {/* Evidence */}
                <div className="p-3 rounded-xl bg-[#F4FBF6] border border-[#D5E9DC] text-xs space-y-1">
                  <span className="text-[10px] font-bold text-[#006A4E] uppercase tracking-wider block">
                    Underlying Evidence:
                  </span>
                  <p className="text-[#64776B] text-[11px] leading-relaxed">
                    {ins.evidence}
                  </p>
                </div>

                {/* Recommended Action */}
                <div className="p-3.5 rounded-xl bg-[#DFF3E8] border border-[#D5E9DC] text-xs space-y-1">
                  <span className="text-[10px] font-bold text-[#004B38] uppercase tracking-wider block">
                    Teacher Action Recommended:
                  </span>
                  <p className="text-[#003627] font-semibold text-[11px] leading-relaxed">
                    {ins.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#D5E9DC]">
                <button
                  onClick={() => handleActionClick(ins)}
                  disabled={isAssigned}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    isAssigned
                      ? 'bg-slate-100 text-[#64776B] cursor-default'
                      : 'bg-[#006A4E] hover:bg-[#004B38] text-white shadow-xs'
                  }`}
                >
                  {isAssigned ? (
                    <>
                      <Check className="w-4 h-4 text-[#006A4E]" />
                      <span>Revision Assigned to Student</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Assign Recommended Revision</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
