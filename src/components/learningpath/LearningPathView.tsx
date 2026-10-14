import React, { useState } from 'react';
import { LearningPathNode, StudentProfile } from '../../types';
import { SAMPLE_LEARNING_PATH } from '../../data/curriculum';
import { CheckCircle2, Clock, GitCommit, ArrowRight, Sparkles, BookOpen, AlertCircle, PlayCircle } from 'lucide-react';

interface LearningPathViewProps {
  profile: StudentProfile;
  activeSubject: string;
  onSelectTopic: (topic: string) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  profile,
  activeSubject,
  onSelectTopic,
}) => {
  const [nodes, setNodes] = useState<LearningPathNode[]>(SAMPLE_LEARNING_PATH);

  const getStatusBadge = (status: LearningPathNode['status']) => {
    switch (status) {
      case 'Completed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Completed (Mastered)</span>;
      case 'Ready to Advance':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Ready to Advance</span>;
      case 'In Progress':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">In Progress</span>;
      case 'Needs Practice':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Needs Practice</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Not Started</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#492873] via-[#6842A6] to-[#7E57C2] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#7E57C2]/15 border border-[#B57EDC]/30 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#B57EDC]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B57EDC]/30 text-[#E6E6FA] border border-[#B57EDC]/40 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            PATHSHALA AI • Adaptive Roadmap
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Personalized Learning Path
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm">
            Roadmap for <strong>Class {profile.classNum} {activeSubject}</strong> ({profile.schoolBoard}). Topics adapt dynamically based on your quiz retention and prerequisite mastery.
          </p>
        </div>
      </div>

      {/* Nodes Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200 ml-4 sm:ml-6 space-y-6 my-4">
        {nodes.map((node, index) => {
          const isCompleted = node.status === 'Completed';
          const isNeedsPractice = node.status === 'Needs Practice';

          return (
            <div key={node.id} className="relative group">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-xs font-bold shadow-md transition ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isNeedsPractice
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
              </div>

              {/* Node Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                      {node.chapter}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {node.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(node.status)}
                    <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {node.estimatedMinutes} mins
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {node.summary}
                </p>

                {/* Mastery Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-500">Estimated Mastery</span>
                    <span className="font-bold text-indigo-600">{node.masteryPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : isNeedsPractice
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${node.masteryPercent}%` }}
                    />
                  </div>
                </div>

                {/* Prerequisites & Recommended Activity */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                  <div className="text-slate-500">
                    <strong>Prerequisites:</strong> {node.prerequisites.join(', ')}
                  </div>
                  <div className="text-indigo-900 flex items-start gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>AI Agent Recommendation:</strong> {node.recommendedActivity}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onSelectTopic(node.title)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-bold transition shadow-sm"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Study This Topic in AI Tutor</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
