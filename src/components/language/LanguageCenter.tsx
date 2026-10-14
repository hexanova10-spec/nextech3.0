import React, { useState } from 'react';
import { INDIAN_LANGUAGES } from '../../data/languages';
import { Search, Globe, Check, Settings2, Sparkles, BookOpen, MessageSquare } from 'lucide-react';

interface LanguageCenterProps {
  interfaceLanguage: string;
  tutorLanguage: string;
  textbookLanguage: string;
  onUpdateLanguages: (config: {
    interfaceLanguage?: string;
    tutorLanguage?: string;
    textbookLanguage?: string;
  }) => void;
  onClose: () => void;
}

export const LanguageCenter: React.FC<LanguageCenterProps> = ({
  interfaceLanguage,
  tutorLanguage,
  textbookLanguage,
  onUpdateLanguages,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'tutor' | 'interface' | 'textbook'>('tutor');

  const popularLangs = INDIAN_LANGUAGES.filter((l) => l.popular);
  const filteredLangs = INDIAN_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedForTab = () => {
    if (activeTab === 'interface') return interfaceLanguage;
    if (activeTab === 'textbook') return textbookLanguage;
    return tutorLanguage;
  };

  const handleSelectLang = (langName: string) => {
    if (activeTab === 'interface') {
      onUpdateLanguages({ interfaceLanguage: langName });
    } else if (activeTab === 'textbook') {
      onUpdateLanguages({ textbookLanguage: langName });
    } else {
      onUpdateLanguages({ tutorLanguage: langName });
    }
  };

  const currentSelected = getSelectedForTab();

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 max-w-2xl w-full mx-auto space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Multilingual Language Centre
            </h2>
            <p className="text-xs text-slate-500">
              One AI. 23 Indian Languages. Every Learner.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          Done
        </button>
      </div>

      {/* Language Role Switcher Tabs */}
      <div className="p-1 rounded-xl bg-slate-100 grid grid-cols-3 gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('tutor')}
          className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === 'tutor'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Tutor Language</span>
        </button>
        <button
          onClick={() => setActiveTab('textbook')}
          className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === 'textbook'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Textbook Language</span>
        </button>
        <button
          onClick={() => setActiveTab('interface')}
          className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === 'interface'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>App Interface</span>
        </button>
      </div>

      {/* Pedagogical Bridge Explanation */}
      <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <strong>Bilingual Bridge Active:</strong> When your textbook is in <u>{textbookLanguage}</u> and tutor is set to <u>{tutorLanguage}</u>, PATHSHALA AI explains difficult textbook terms in {tutorLanguage} while maintaining key exam keywords in {textbookLanguage}!
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search language (e.g. Odia, Hindi, Urdu, Bengali...)"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {/* Popular Languages (Priority Bar) */}
      {!searchTerm && (
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Priority & Popular Languages
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {popularLangs.map((lang) => {
              const isSelected = currentSelected.toLowerCase() === lang.name.toLowerCase();
              return (
                <button
                  key={lang.id}
                  onClick={() => handleSelectLang(lang.name)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-semibold'
                      : 'bg-slate-50 hover:bg-indigo-50/50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{lang.nativeName}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`text-xs ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {lang.name} {lang.rtl ? '(RTL)' : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* All 23 Indian Languages Grid */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          All 23 Constitutionally Recognized Languages
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1">
          {filteredLangs.map((lang) => {
            const isSelected = currentSelected.toLowerCase() === lang.name.toLowerCase();
            return (
              <button
                key={lang.id}
                onClick={() => handleSelectLang(lang.name)}
                className={`p-2 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="truncate">
                  <span className="font-bold mr-1.5">{lang.nativeName}</span>
                  <span className={isSelected ? 'text-indigo-100' : 'text-slate-500'}>
                    ({lang.name})
                  </span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
