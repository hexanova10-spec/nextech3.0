import React, { useState } from 'react';
import { AgentDecisionRecord, AgentStepName } from '../../types';
import { Bot, ChevronDown, ChevronUp, Cpu, Sparkles, CheckCircle2, ArrowRight, Activity, ShieldCheck, Play } from 'lucide-react';

interface AgentInspectorProps {
  currentDecision?: AgentDecisionRecord | null;
  activeStep?: AgentStepName | null;
  isSimulating?: boolean;
  onRunSimulation?: () => void;
}

const STEPS_LIST: { id: AgentStepName; label: string; number: number; desc: string }[] = [
  { id: 'OBSERVE', label: 'Observe', number: 1, desc: 'Inspects question, class, language & quiz gap records' },
  { id: 'UNDERSTAND', label: 'Understand', number: 2, desc: 'Identifies topic, prerequisite concepts & cognitive hurdles' },
  { id: 'PLAN', label: 'Plan', number: 3, desc: 'Chooses optimal pedagogical strategy & rationale' },
  { id: 'ACT', label: 'Act', number: 4, desc: 'Executes response generation with local analogies & math steps' },
  { id: 'EVALUATE', label: 'Evaluate', number: 5, desc: 'Assesses comprehension & checks diagnostic readiness' },
  { id: 'ADAPT', label: 'Adapt', number: 6, desc: 'Pivots strategy (scaffold or advance to next topic)' },
  { id: 'SAVE', label: 'Save', number: 7, desc: 'Persists progress to learning path & offline cache' },
];

export const AgentInspector: React.FC<AgentInspectorProps> = ({
  currentDecision,
  activeStep = 'OBSERVE',
  isSimulating = false,
  onRunSimulation
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const fallbackDecision: AgentDecisionRecord = {
    timestamp: 'Just now',
    step: 'PLAN',
    currentGoal: 'Understand Electric Current & Potential Difference',
    currentTopic: 'Electric Current & Circuits (Chapter 1)',
    observedGap: 'Diagnostic score 50% — struggled to distinguish Voltage (push) from Current (flow)',
    selectedAction: 'simplify_explanation & give_local_example',
    reason: 'Student missed 2 diagnostic checks; applying water-flow analogy and scaffolding before Ohm’s Law',
    toolUsed: 'PedagogicalEngine.simplify_explanation(class: 10, lang: Odia)',
    outcome: 'Student answered follow-up question correctly; ready for Ohm’s Law numericals',
    nextRecommendedAction: 'advance_to_next_topic (Ohm’s Law & Resistance)'
  };

  const decision = currentDecision || fallbackDecision;

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden transition-all duration-200">
      {/* Header bar */}
      <div
        className="flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-r from-indigo-50/90 via-violet-50/70 to-purple-50/50 cursor-pointer select-none border-b border-indigo-100/70"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm sm:text-base">
                PATHSHALA AI Learning Engine
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Active Loop
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Continuous 7-step pedagogical cycle: Observe → Plan → Act → Evaluate → Adapt
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRunSimulation && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRunSimulation();
              }}
              disabled={isSimulating}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isSimulating ? 'Simulating Loop...' : 'Simulate Loop'}
            </button>
          )}

          <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/80 transition">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Inspector Body */}
      {isExpanded && (
        <div className="p-3.5 sm:p-5 space-y-4">
          {/* Visual 7-step pipeline indicator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                Agent Orchestrator State Machine
              </span>
              <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                Current Phase: <strong className="font-bold">{activeStep || decision.step || 'OBSERVE'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
              {STEPS_LIST.map((step) => {
                const isCurrent = (activeStep || decision.step) === step.id;
                return (
                  <div
                    key={step.id}
                    className={`relative p-1.5 sm:p-2 rounded-xl border transition-all duration-200 ${
                      isCurrent
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102 ring-2 ring-indigo-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100/80'
                    }`}
                  >
                    <div
                      className={`text-[10px] font-bold rounded-full w-4 h-4 mx-auto mb-1 flex items-center justify-center ${
                        isCurrent ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {step.number}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold truncate">{step.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Observable Engine Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Left Column: Goal, Detected Topic, Observed Gap */}
            <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-0.5">
                  Current Goal
                </span>
                <p className="font-semibold text-slate-800 text-xs sm:text-[13px]">{decision.currentGoal}</p>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-0.5">
                  Detected Topic
                </span>
                <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs">
                  {decision.currentTopic}
                </span>
              </div>

              <div>
                <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px] block mb-0.5">
                  Observed Learning Gap / State
                </span>
                <p className="text-slate-700 bg-amber-50 border border-amber-200/80 p-2 rounded-lg leading-relaxed text-xs">
                  {decision.observedGap}
                </p>
              </div>
            </div>

            {/* Right Column: Selected Action, Reason, Result, Next Recommendation */}
            <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div>
                <span className="font-bold text-indigo-700 uppercase tracking-wider text-[10px] block mb-0.5">
                  Selected Action
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">
                    {decision.selectedAction}
                  </span>
                </div>
                <div className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                  <strong className="text-slate-700 font-semibold">Reason:</strong> {decision.reason}
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                <span className="font-bold text-emerald-700 uppercase tracking-wider text-[10px] block mb-0.5">
                  Result
                </span>
                <p className="text-slate-700 text-[11px] leading-relaxed bg-white p-2 rounded-lg border border-slate-200">
                  {decision.outcome}
                </p>
                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-100">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                  <span>Next Recommendation: {decision.nextRecommendedAction}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive simulator button for mobile */}
          {onRunSimulation && (
            <div className="block md:hidden pt-1">
              <button
                onClick={onRunSimulation}
                disabled={isSimulating}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isSimulating ? 'Simulating Loop...' : 'Simulate Agent Adaptation Loop'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
