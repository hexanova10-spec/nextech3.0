import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { offlineStorage } from '../../services/offlineStorage';
import {
  FileText,
  Layers,
  Sparkles,
  Bookmark,
  Share2,
  Download,
  BookOpen,
  CheckCircle2,
  Cpu,
  RotateCw,
  HelpCircle,
  Copy
} from 'lucide-react';

interface AIStudyStudioViewProps {
  profile: StudentProfile;
  activeSubject: string;
}

type StudioContentType = 'short_notes' | 'summary' | 'flashcards' | 'formulas' | 'mindmap' | 'vocab';

export const AIStudyStudioView: React.FC<AIStudyStudioViewProps> = ({ profile, activeSubject }) => {
  const [contentType, setContentType] = useState<StudioContentType>('short_notes');
  const [topic, setTopic] = useState('Electricity and Circuits');
  const [targetLang, setTargetLang] = useState(profile.tutorLanguage || 'Odia');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [flashcardFlipped, setFlashcardFlipped] = useState<number | null>(null);

  const sampleFlashcards = [
    { q: "What is Ohm's Law formula?", a: "V = I × R (Voltage = Current × Resistance)" },
    { q: "What is the SI unit of Electric Charge?", a: "Coulomb (C)" },
    { q: "What is the function of Chlorophyll in plants?", a: "Absorbs solar light energy to drive photosynthesis" },
    { q: "How is an ammeter connected in an electric circuit?", a: "Always in SERIES to measure the full current" }
  ];

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      const res = await fetch('/api/gemini/study-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contentType,
          topic,
          classNum: profile.classNum,
          subject: activeSubject,
          language: targetLang
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `AI generation failed (HTTP ${res.status})`);
      if (typeof data.content !== 'string' || !data.content.trim()) {
        throw new Error('The live AI returned an empty response. Please try again.');
      }
      setGeneratedContent(data.content);
    } catch (e) {
      console.error('Live Study Studio request failed:', e);
      setGeneratedContent(`LIVE AI ERROR: ${e instanceof Error ? e.message : 'Unknown network or server error'}. No offline sample was substituted. Please check the backend and Gemini configuration, then try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToOfflineNotes = async () => {
    if (!generatedContent) return;
    await offlineStorage.saveNote({
      id: 'studio-note-' + Date.now(),
      title: `${contentType.toUpperCase()}: ${topic}`,
      topic,
      content: generatedContent,
      subject: activeSubject,
      classNum: profile.classNum,
      createdAt: new Date().toISOString()
    });
    alert('Material saved to your Offline Library! Accessible anytime without internet.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#492873] via-[#6842A6] to-[#7E57C2] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#7E57C2]/15 border border-[#B57EDC]/30 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#B57EDC]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B57EDC]/30 text-[#E6E6FA] border border-[#B57EDC]/40 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            PATHSHALA AI • Study Studio (ଅଧ୍ୟୟନ ସୃଷ୍ଟି କେନ୍ଦ୍ର)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Study Material Generator
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm">
            Generate tailored revision sheets, interactive flashcards, formula cheat sheets, and summaries at your exact grade level.
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            1. Select Material Format
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs font-semibold">
            {[
              { id: 'short_notes', label: 'Short Notes', icon: FileText },
              { id: 'summary', label: 'Summary', icon: BookOpen },
              { id: 'flashcards', label: 'Flashcards', icon: Layers },
              { id: 'formulas', label: 'Formula Sheet', icon: Cpu },
              { id: 'mindmap', label: 'Mind Map', icon: Share2 },
              { id: 'vocab', label: 'Vocabulary', icon: HelpCircle },
            ].map((fmt) => {
              const Icon = fmt.icon;
              const isSelected = contentType === fmt.id;
              return (
                <button
                  key={fmt.id}
                  onClick={() => setContentType(fmt.id as StudioContentType)}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{fmt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic & Language inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">
              Chapter or Specific Concept:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Chemical Reactions and Equations"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">
              Output Language:
            </label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
            >
              <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="English">English</option>
              <option value="Urdu">Urdu (اردو)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Bengali">Bengali (বাংলা)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!topic || isGenerating}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Generating {contentType.replace('_', ' ')} in {targetLang}...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Study Material</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Flashcard View */}
      {contentType === 'flashcards' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Interactive Concept Flashcards (Click to flip)
            </h3>
            <span className="text-xs text-slate-400">Class {profile.classNum} • {activeSubject}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sampleFlashcards.map((card, idx) => {
              const isFlipped = flashcardFlipped === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setFlashcardFlipped(isFlipped ? null : idx)}
                  className={`p-5 rounded-2xl border cursor-pointer min-h-[130px] flex flex-col justify-between transition-all duration-200 select-none shadow-sm ${
                    isFlipped
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-indigo-50/60 border-indigo-200 text-indigo-950 hover:bg-indigo-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold opacity-70 mb-2">
                    <span>Card #{idx + 1}</span>
                    <span className="flex items-center gap-1">
                      <RotateCw className="w-3 h-3" />
                      {isFlipped ? 'Answer' : 'Question (Click to flip)'}
                    </span>
                  </div>

                  <p className="font-bold text-sm sm:text-base leading-snug">
                    {isFlipped ? card.a : card.q}
                  </p>

                  <div className="text-[10px] text-right font-medium opacity-60 mt-2">
                    {isFlipped ? 'Tap to see question' : 'Tap to see answer'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Generated Content Output Section */}
      {generatedContent && (
        <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Generated Material: {topic}
                </h3>
                <span className="text-xs text-slate-400">
                  AI-Generated Educational Content • Class {profile.classNum}
                </span>
              </div>
            </div>

            <button
              onClick={handleSaveToOfflineNotes}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Save to Offline Notes
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
            {generatedContent}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 border border-slate-200 flex items-center gap-2">
            <span className="font-bold text-slate-700">Notice:</span>
            <span>This content is AI-generated for learning reinforcement. Please cross-verify formulas and dates with your official prescribed textbook.</span>
          </div>
        </div>
      )}
    </div>
  );
};
