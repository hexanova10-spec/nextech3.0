import React, { useState } from 'react';
import { ALL_CLASSES } from '../../data/curriculum';
import { SchoolBoard } from '../../types';
import { GraduationCap, Check, AlertCircle, ShieldAlert, Sparkles, X } from 'lucide-react';

interface ClassSelectorProps {
  selectedClass: number;
  assignedClasses?: number[]; // Strict max 2 classes
  selectedBoard: SchoolBoard;
  onSelectClass: (classNum: number) => void;
  onSelectBoard: (board: SchoolBoard) => void;
  onClose?: () => void;
  isTeacherAdmin?: boolean; // If teacher, can modify student assignments
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  selectedClass,
  assignedClasses = [10, 9],
  selectedBoard,
  onSelectClass,
  onSelectBoard,
  onClose,
  isTeacherAdmin = false
}) => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const groups = [
    {
      id: 'primary',
      title: 'Primary School (ପ୍ରାଥମିକ ବିଦ୍ୟାଳୟ)',
      grades: ALL_CLASSES.filter((c) => c.group === 'primary'),
      pedagogyNote: 'Concrete, playful, visual learning with daily-life examples and basic foundational arithmetic & languages.',
      badgeColor: 'bg-[#DFF3E8] text-[#006A4E] border-[#D5E9DC]'
    },
    {
      id: 'middle',
      title: 'Middle School (ଉଚ୍ଚ ପ୍ରାଥମିକ)',
      grades: ALL_CLASSES.filter((c) => c.group === 'middle'),
      pedagogyNote: 'Progressive introduction of scientific terms, rational numbers, Odisha history & computing basics.',
      badgeColor: 'bg-[#DFF3E8] text-[#006A4E] border-[#D5E9DC]'
    },
    {
      id: 'secondary',
      title: 'Secondary School (ମାଧ୍ୟମିକ - Class 9 & 10)',
      grades: ALL_CLASSES.filter((c) => c.group === 'secondary'),
      pedagogyNote: 'Deep conceptual rigor, board exam patterns (BSE Odisha / CBSE), chemical equations, physics laws & geometry.',
      badgeColor: 'bg-[#006A4E] text-white border-[#004B38]'
    },
    {
      id: 'higher_secondary',
      title: 'Higher Secondary (ଉଚ୍ଚ ମାଧ୍ୟମିକ - Class 11 & 12)',
      grades: ALL_CLASSES.filter((c) => c.group === 'higher_secondary'),
      pedagogyNote: 'Stream-focused specialization (Science, Commerce, Arts), derivations, numerical problems & NEET / JEE / CHSE preparation.',
      badgeColor: 'bg-[#DFF3E8] text-[#006A4E] border-[#D5E9DC]'
    }
  ];

  const boards: SchoolBoard[] = [
    'Odisha State Board (BSE/CHSE)',
    'CBSE',
    'ICSE / Other'
  ];

  const handleClassClick = (num: number) => {
    // Check if student has assignedClasses and if this class is among them
    if (!isTeacherAdmin && assignedClasses && assignedClasses.length > 0) {
      if (!assignedClasses.includes(num)) {
        setWarningMessage(
          'You can access a maximum of two assigned classes. Please contact your teacher if you need to change your class assignment.'
        );
        return;
      }
    }
    setWarningMessage(null);
    onSelectClass(num);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-[#D5E9DC] max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF3E8] border border-[#D5E9DC] text-[#006A4E] text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            Class Management & Board Selection
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18352A] tracking-tight">
            Select Your Active Class
          </h2>
          <p className="text-[#64776B] text-xs sm:text-sm">
            PATHASHALA AI dynamically adapts conceptual depth, language vocabulary, and exam patterns to your selected class.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64776B] hover:text-[#18352A] hover:bg-[#F4FBF6] transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Strict Two-Class Limit Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#18352A]">
          <span className="font-bold">Your Authorized Classes:</span>
          <div className="flex items-center gap-1.5">
            {assignedClasses.map((cls) => (
              <span
                key={cls}
                className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                  selectedClass === cls
                    ? 'bg-[#006A4E] text-white border-[#004B38]'
                    : 'bg-white text-[#006A4E] border-[#D5E9DC]'
                }`}
              >
                Class {cls} {selectedClass === cls && '• Active'}
              </span>
            ))}
          </div>
        </div>
        <span className="text-[11px] text-[#64776B] hidden sm:inline">
          (Strict limit: Maximum 2 assigned classes per student)
        </span>
      </div>

      {/* Warning Message if 3rd class attempted */}
      {warningMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 animate-fadeIn">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-950">{warningMessage}</p>
            <p className="text-[11px] text-amber-800">
              Only authorized teachers or administrators can modify your registered class assignments.
            </p>
          </div>
        </div>
      )}

      {/* Board Selector */}
      <div className="p-4 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC]">
        <span className="text-xs font-bold text-[#18352A] uppercase tracking-wider block mb-2.5">
          Step 1: Choose School Examination Board
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {boards.map((b) => (
            <button
              key={b}
              onClick={() => onSelectBoard(b)}
              className={`p-3 rounded-xl text-left border text-sm font-semibold transition-all flex items-center justify-between ${
                selectedBoard === b
                  ? 'bg-[#006A4E] text-white border-[#004B38] shadow-md'
                  : 'bg-white text-[#18352A] border-[#D5E9DC] hover:border-[#006A4E] hover:bg-[#DFF3E8]/40'
              }`}
            >
              <div className="truncate">
                <div>{b}</div>
                <div
                  className={`text-[11px] font-normal ${
                    selectedBoard === b ? 'text-[#DFF3E8]' : 'text-[#64776B]'
                  }`}
                >
                  {b.includes('Odisha') ? 'Odia & English mediums' : 'National curriculum'}
                </div>
              </div>
              {selectedBoard === b && <Check className="w-4 h-4 ml-2 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Class Selector Grid */}
      <div className="space-y-4">
        <span className="text-xs font-bold text-[#18352A] uppercase tracking-wider block">
          Step 2: Choose Grade / Class (Classes 1–12)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((grp) => (
            <div
              key={grp.id}
              className="p-4 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#18352A]">{grp.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#D5E9DC] text-[#64776B]">
                  {grp.grades.length} Grades
                </span>
              </div>
              <p className="text-[11px] text-[#64776B] leading-relaxed">{grp.pedagogyNote}</p>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {grp.grades.map((c) => {
                  const isAssigned = assignedClasses.includes(c.num);
                  const isCurrentActive = selectedClass === c.num;
                  return (
                    <button
                      key={c.num}
                      onClick={() => handleClassClick(c.num)}
                      className={`p-2.5 rounded-xl text-center border font-bold text-xs transition-all relative ${
                        isCurrentActive
                          ? 'bg-[#006A4E] text-white border-[#004B38] shadow-sm'
                          : isAssigned
                          ? 'bg-white text-[#006A4E] border-[#006A4E] hover:bg-[#DFF3E8]'
                          : 'bg-white/70 text-[#64776B] border-[#D5E9DC] hover:border-amber-400 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="text-sm">{c.label}</div>
                      <div
                        className={`text-[9px] font-normal ${
                          isCurrentActive ? 'text-[#DFF3E8]' : 'text-[#64776B]'
                        }`}
                      >
                        {isAssigned ? 'Assigned' : 'Unassigned'}
                      </div>
                      {isCurrentActive && (
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Done Button */}
      {onClose && (
        <div className="flex justify-end pt-2 border-t border-[#D5E9DC]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#006A4E] hover:bg-[#004B38] text-white font-bold text-xs shadow-md transition"
          >
            Confirm & Continue
          </button>
        </div>
      )}
    </div>
  );
};
