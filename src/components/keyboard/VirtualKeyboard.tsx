import React, { useState } from 'react';
import { REGIONAL_KEYBOARDS } from '../../data/languages';
import { X, Delete, CornerDownLeft, Globe, Space, RotateCcw } from 'lucide-react';

interface VirtualKeyboardProps {
  currentLanguage: string;
  onInsertChar: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit: () => void;
  onClose: () => void;
  onChangeLanguage: (langId: string) => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  currentLanguage,
  onInsertChar,
  onBackspace,
  onClear,
  onSubmit,
  onClose,
  onChangeLanguage,
}) => {
  const [activeTab, setActiveTab] = useState<'consonants' | 'vowels' | 'matras' | 'numbers'>('consonants');

  // Fallback to odia if currentLanguage isn't in regional keyboards
  const keyboardKey = REGIONAL_KEYBOARDS[currentLanguage] ? currentLanguage : 'odia';
  const layout = REGIONAL_KEYBOARDS[keyboardKey];
  const isRtl = layout.rtl;

  const supportedKeyboards = [
    { id: 'odia', label: 'ଓଡ଼ିଆ' },
    { id: 'hindi', label: 'हिन्दी' },
    { id: 'urdu', label: 'اردو' },
    { id: 'telugu', label: 'తెలుగు' },
    { id: 'marathi', label: 'मराठी' },
    { id: 'kannada', label: 'ಕನ್ನಡ' },
    { id: 'tamil', label: 'தமிழ்' },
    { id: 'bengali', label: 'বাংলা' },
    { id: 'gujarati', label: 'ગુજરાતી' },
    { id: 'punjabi', label: 'ਪੰਜਾਬੀ' },
    { id: 'malayalam', label: 'മലയാളം' },
    { id: 'english', label: 'English' },
  ];

  const getActiveChars = () => {
    switch (activeTab) {
      case 'vowels':
        return layout.vowels;
      case 'matras':
        return layout.matras && layout.matras.length > 0 ? layout.matras : layout.vowels;
      case 'numbers':
        return [...layout.numbers, ...(layout.special || [])];
      case 'consonants':
      default:
        return layout.consonants;
    }
  };

  const activeChars = getActiveChars();

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-3 sm:p-4 w-full transition-all duration-200 select-none animate-fadeIn"
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
          <span className="text-slate-400 flex items-center gap-1 text-xs mr-1">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            Script:
          </span>
          {supportedKeyboards.map((kb) => (
            <button
              key={kb.id}
              onClick={() => onChangeLanguage(kb.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                keyboardKey === kb.id
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {kb.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            title="Clear text"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            Clear
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition"
            title="Close keyboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Script category switch (Vowels / Consonants / Matras / Numbers) */}
      <div className="flex items-center justify-between gap-1 mb-2.5 text-xs">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('consonants')}
            className={`px-3 py-1 rounded-md transition ${
              activeTab === 'consonants'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            ବ୍ୟଞ୍ଜନ / Consonants
          </button>
          <button
            onClick={() => setActiveTab('vowels')}
            className={`px-3 py-1 rounded-md transition ${
              activeTab === 'vowels'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            ସ୍ୱର / Vowels
          </button>
          {layout.matras.length > 0 && (
            <button
              onClick={() => setActiveTab('matras')}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === 'matras'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              ମାତ୍ରା / Signs
            </button>
          )}
          <button
            onClick={() => setActiveTab('numbers')}
            className={`px-3 py-1 rounded-md transition ${
              activeTab === 'numbers'
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            ୧୨୩ / 123
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          {layout.name} {isRtl ? '(RTL)' : ''}
        </span>
      </div>

      {/* Keypad Grid */}
      <div
        className={`grid grid-cols-7 sm:grid-cols-9 md:grid-cols-11 gap-1 sm:gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800/80 ${
          isRtl ? 'direction-rtl' : ''
        }`}
      >
        {activeChars.map((char, index) => (
          <button
            key={index}
            onClick={() => onInsertChar(char)}
            className="h-10 sm:h-11 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-indigo-600 active:scale-95 text-base sm:text-lg font-medium text-slate-100 border border-slate-700/60 hover:border-indigo-400 hover:shadow transition-all duration-75"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Bottom control row: Space, Backspace, Send */}
      <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 pt-2 border-t border-slate-800">
        <button
          onClick={() => onInsertChar(' ')}
          className="flex-1 h-10 sm:h-11 flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-xs sm:text-sm font-medium text-slate-200 border border-slate-700 transition"
        >
          <Space className="w-4 h-4 text-slate-400" />
          Space
        </button>

        <button
          onClick={onBackspace}
          className="w-16 sm:w-20 h-10 sm:h-11 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-98 border border-slate-700 transition"
          title="Backspace"
        >
          <Delete className="w-5 h-5 text-amber-400" />
        </button>

        <button
          onClick={onSubmit}
          className="px-4 sm:px-6 h-10 sm:h-11 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 transition"
        >
          <span>Ask</span>
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
