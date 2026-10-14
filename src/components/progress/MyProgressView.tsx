import React, { useState } from 'react';
import { StudentProfile, TopicMasteryRecord } from '../../types';
import { INITIAL_TOPIC_MASTERY } from '../../data/mockStore';
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Check,
  Zap,
  Info
} from 'lucide-react';

interface MyProgressViewProps {
  profile: StudentProfile;
  onReviseTopic?: (topic: string) => void;
}

export const MyProgressView: React.FC<MyProgressViewProps> = ({
  profile,
  onReviseTopic
}) => {
  const [topicRecords, setTopicRecords] = useState<TopicMasteryRecord[]>(
    INITIAL_TOPIC_MASTERY
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<TopicMasteryRecord | null>(
    null
  );

  const subjectList = [
    { name: 'Physics', score: 91, mastered: 5, needingPractice: 1, quizAccuracy: 92, lastActivity: 'Today' },
    { name: 'Mathematics', score: 86, mastered: 4, needingPractice: 1, quizAccuracy: 88, lastActivity: 'Yesterday' },
    { name: 'Chemistry', score: 84, mastered: 4, needingPractice: 2, quizAccuracy: 85, lastActivity: '2 days ago' },
    { name: 'Biology', score: 89, mastered: 6, needingPractice: 1, quizAccuracy: 90, lastActivity: '3 days ago' },
    { name: 'Social Science', score: 92, mastered: 7, needingPractice: 0, quizAccuracy: 94, lastActivity: 'Oct 11' },
    { name: 'Odia Sahitya', score: 95, mastered: 8, needingPractice: 0, quizAccuracy: 96, lastActivity: 'Oct 12' }
  ];

  const currentSubjectTopics = topicRecords.filter(
    (t) => t.subject.toLowerCase() === selectedSubject.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#D5E9DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF3E8] border border-[#D5E9DC] text-[#006A4E] text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Adaptive Learning Analytics
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18352A] tracking-tight">
            My Progress Board • Class {profile.classNum}
          </h1>
          <p className="text-xs text-[#64776B] mt-0.5">
            Holistic mastery tracking across NCERT & Odisha BSE Board syllabus with evidence-based diagnostics.
          </p>
        </div>

        {/* Pedagogical disclaimer badge */}
        <div className="p-3 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC] max-w-sm text-[11px] text-[#64776B] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" />
          <span>
            <strong>Mastery Indicator:</strong> Scores reflect estimated mastery derived from recent practice quizzes and completed homework exercises.
          </span>
        </div>
      </div>

      {/* 6 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-[#D5E9DC] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[#64776B] uppercase tracking-wider block">
            Lessons Done
          </span>
          <div className="text-2xl font-black text-[#18352A]">24</div>
          <span className="text-[10px] font-semibold text-[#006A4E]">Across 6 Subjects</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#D5E9DC] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[#64776B] uppercase tracking-wider block">
            Homework Rate
          </span>
          <div className="text-2xl font-black text-[#006A4E]">94%</div>
          <span className="text-[10px] font-semibold text-emerald-700">3 of 3 on time</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#D5E9DC] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[#64776B] uppercase tracking-wider block">
            Quiz Accuracy
          </span>
          <div className="text-2xl font-black text-[#18352A]">88%</div>
          <span className="text-[10px] font-semibold text-[#006A4E]">42 Practice items</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#D5E9DC] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[#64776B] uppercase tracking-wider block">
            Subjects Studied
          </span>
          <div className="text-2xl font-black text-[#18352A]">6</div>
          <span className="text-[10px] font-semibold text-[#64776B]">Full Syllabus</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#D5E9DC] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[#64776B] uppercase tracking-wider block">
            Topics to Revise
          </span>
          <div className="text-2xl font-black text-amber-600">2</div>
          <span className="text-[10px] font-semibold text-amber-700">Prism & Quadratics</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#D5E9DC] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[#64776B] uppercase tracking-wider block">
            Improvement
          </span>
          <div className="text-2xl font-black text-[#006A4E]">+12%</div>
          <span className="text-[10px] font-semibold text-emerald-700">Past 14 Days</span>
        </div>
      </div>

      {/* Visual Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Subject Mastery Bars */}
        <div className="bg-white rounded-3xl p-6 border border-[#D5E9DC] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#18352A] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#006A4E]" />
              Subject Mastery Comparison (Class {profile.classNum})
            </h3>
            <span className="text-xs font-bold text-[#006A4E]">Average: 89.5%</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {subjectList.map((sub) => (
              <div key={sub.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#18352A]">{sub.name}</span>
                  <span className="font-bold text-[#006A4E]">{sub.score}% Mastery</span>
                </div>
                <div className="w-full bg-[#EBF7F0] h-2.5 rounded-full overflow-hidden border border-[#D5E9DC]">
                  <div
                    className="bg-[#006A4E] h-full rounded-full transition-all duration-700"
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: 7-Day Learning Activity Timeline */}
        <div className="bg-white rounded-3xl p-6 border border-[#D5E9DC] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#18352A] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#006A4E]" />
              7-Day Study & Practice Minutes
            </h3>
            <span className="text-xs font-bold text-[#006A4E]">Avg: 78 min/day</span>
          </div>

          <div className="flex items-end justify-between h-44 pt-6 pb-2 px-2 border-b border-[#D5E9DC]">
            {[
              { day: 'Thu', mins: 65, active: false },
              { day: 'Fri', mins: 80, active: false },
              { day: 'Sat', mins: 95, active: false },
              { day: 'Sun', mins: 60, active: false },
              { day: 'Mon', mins: 85, active: false },
              { day: 'Tue', mins: 90, active: false },
              { day: 'Today', mins: 75, active: true }
            ].map((col) => (
              <div key={col.day} className="flex flex-col items-center gap-2 w-10">
                <span className="text-[10px] font-bold text-[#18352A]">{col.mins}m</span>
                <div
                  className={`w-full rounded-t-xl transition-all ${
                    col.active ? 'bg-[#006A4E]' : 'bg-[#A5D9C2]'
                  }`}
                  style={{ height: `${(col.mins / 100) * 110}px` }}
                />
                <span className="text-[10px] font-bold text-[#64776B]">{col.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#64776B] pt-1">
            <span>🔥 5-Day Consecutive Daily Study Streak</span>
            <span className="font-bold text-[#18352A]">Total: 550 min</span>
          </div>
        </div>
      </div>

      {/* Subject Mastery Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-[#18352A] flex items-center gap-2">
          <Award className="w-4 h-4 text-[#006A4E]" />
          Detailed Subject Mastery Cards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectList.map((sub) => {
            const isSelected = selectedSubject === sub.name;

            return (
              <div
                key={sub.name}
                onClick={() => setSelectedSubject(sub.name)}
                className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer space-y-4 ${
                  isSelected
                    ? 'border-[#006A4E] ring-2 ring-[#006A4E]/20 shadow-md'
                    : 'border-[#D5E9DC] hover:border-[#006A4E]/50 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#18352A]">{sub.name}</span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#DFF3E8] text-[#006A4E] border border-[#D5E9DC]">
                    {sub.score}% Mastery
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#64776B]">
                  <div className="p-2.5 rounded-xl bg-[#F4FBF6] border border-[#D5E9DC]">
                    <span className="block text-[10px] font-bold">Topics Mastered:</span>
                    <strong className="text-xs text-[#18352A]">{sub.mastered} Topics</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F4FBF6] border border-[#D5E9DC]">
                    <span className="block text-[10px] font-bold">Needs Practice:</span>
                    <strong className="text-xs text-amber-700">
                      {sub.needingPractice} Topics
                    </strong>
                  </div>
                </div>

                <div className="text-xs text-[#64776B] flex items-center justify-between pt-1 border-t border-[#D5E9DC]">
                  <span>Quiz Accuracy: <strong className="text-[#18352A]">{sub.quizAccuracy}%</strong></span>
                  <span className="text-[11px] font-semibold text-[#006A4E] flex items-center gap-1">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Subject Topic Breakdown Drawer / View */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D5E9DC] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#D5E9DC]">
          <div>
            <h3 className="text-base font-extrabold text-[#18352A]">
              Topic Mastery Breakdown: {selectedSubject}
            </h3>
            <p className="text-xs text-[#64776B]">
              Granular concept diagnostic based on completed questions and derivations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64776B]">
              Showing {currentSubjectTopics.length} Curated Topics
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {currentSubjectTopics.map((top) => (
            <div
              key={top.topicId}
              onClick={() => setSelectedTopicDetail(top)}
              className="p-4 rounded-2xl border border-[#D5E9DC] bg-[#F4FBF6] hover:bg-white hover:border-[#006A4E] transition cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    top.status === 'Mastered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : top.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {top.status}
                </span>

                <span className="text-xs font-extrabold text-[#006A4E]">
                  {top.masteryPercent}% Mastery
                </span>
              </div>

              <h4 className="font-bold text-xs text-[#18352A] leading-snug">
                {top.topicName}
              </h4>

              <div className="flex items-center justify-between text-[11px] text-[#64776B] pt-1 border-t border-[#D5E9DC]">
                <span>
                  Quizzes: <strong className="text-[#18352A]">{top.correctAnswers}/{top.quizAttempts} correct</strong>
                </span>
                <span className="text-[10px] text-[#006A4E] font-bold">
                  {top.lastPracticed}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Detail Drill-down Modal */}
      {selectedTopicDetail && (
        <div className="fixed inset-0 z-50 bg-[#0C1E16]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#D5E9DC] shadow-2xl space-y-5 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DFF3E8] text-[#006A4E] border border-[#D5E9DC]">
                  Class {selectedTopicDetail.classNum} • {selectedTopicDetail.subject}
                </span>
                <h3 className="text-base font-black text-[#18352A] mt-1.5">
                  {selectedTopicDetail.topicName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTopicDetail(null)}
                className="text-[#64776B] hover:text-[#18352A] font-bold"
              >
                Done
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-[#F4FBF6] border border-[#D5E9DC]">
                <span className="block text-[10px] text-[#64776B] font-bold">Attempts</span>
                <strong className="text-sm font-extrabold text-[#18352A]">
                  {selectedTopicDetail.quizAttempts}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="block text-[10px] text-emerald-800 font-bold">Correct</span>
                <strong className="text-sm font-extrabold text-emerald-700">
                  {selectedTopicDetail.correctAnswers}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <span className="block text-[10px] text-rose-800 font-bold">Mistakes</span>
                <strong className="text-sm font-extrabold text-rose-700">
                  {selectedTopicDetail.incorrectAnswers}
                </strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#DFF3E8] border border-[#D5E9DC] space-y-1">
              <span className="text-[10px] font-bold text-[#004B38] uppercase tracking-wider block">
                AI Recommendation:
              </span>
              <p className="text-[#003627] leading-relaxed">
                {selectedTopicDetail.recommendedLesson}
              </p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#D5E9DC]">
              <button
                onClick={() => {
                  setSelectedTopicDetail(null);
                  if (onReviseTopic) onReviseTopic(selectedTopicDetail.topicName);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#006A4E] text-white font-bold hover:bg-[#004B38] transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Revise with AI Tutor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
