import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { CAREER_PATHS } from '../../data/curriculum';
import { Compass, GraduationCap, ArrowRight, CheckCircle2, BookOpen, Star, Sparkles, Building2, Terminal } from 'lucide-react';

interface CareerExplorerViewProps {
  profile: StudentProfile;
}

export const CareerExplorerView: React.FC<CareerExplorerViewProps> = ({ profile }) => {
  const [selectedCareer, setSelectedCareer] = useState(CAREER_PATHS[0]);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Technology & Computing', 'Life Sciences & Medicine', 'Agriculture & Sustainability', 'Governance & Public Policy', 'Design & Media Arts', 'Commerce & Business'];

  const filteredCareers = CAREER_PATHS.filter((c) => {
    if (filterCategory !== 'All' && c.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#492873] via-[#6842A6] to-[#7E57C2] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#7E57C2]/15 border border-[#B57EDC]/30 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#B57EDC]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B57EDC]/30 text-[#E6E6FA] border border-[#B57EDC]/40 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-amber-200" />
            PATHSHALA AI • Career Guidance (Class 9-12)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Discover Your Future Pathway
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm">
            Understand how your current subjects in <strong>Class {profile.classNum}</strong> connect directly to promising future careers, entrance exams, and prestigious universities in Odisha and across India.
          </p>
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Careers Cards + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Careers */}
        <div className="space-y-3 lg:col-span-1">
          {filteredCareers.map((c) => {
            const isSelected = selectedCareer.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCareer(c)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm sm:text-base">{c.title}</h3>
                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <div className={`text-xs ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {c.category}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              {selectedCareer.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {selectedCareer.title}
            </h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {selectedCareer.tagline}
            </p>
          </div>

          {/* Key School Subjects & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <span className="font-bold text-indigo-900 uppercase tracking-wider block">
                Relevant School Subjects:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCareer.keySubjects.map((sub, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white text-indigo-700 font-semibold border border-indigo-200 shadow-2xs"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">
                Foundational Skills to Build:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCareer.skillsRequired.map((sk, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white text-slate-700 font-medium border border-slate-200"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Beginner Steps in School */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              What You Can Do Right Now in Class {profile.classNum}:
            </span>
            <div className="space-y-2 text-xs">
              {selectedCareer.beginnerSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notable Colleges & Universities in Odisha and India */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Prestigious Colleges in Odisha & India:
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedCareer.popularCollegesInOdishaAndIndia.map((col, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic">
            Disclaimer: This guidance is informational and educational. Career choices should be made in consultation with teachers, parents, and certified academic counselors.
          </div>
        </div>
      </div>
    </div>
  );
};
