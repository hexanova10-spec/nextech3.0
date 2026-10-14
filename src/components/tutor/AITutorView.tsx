import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, StudentProfile, AgentDecisionRecord } from '../../types';
import { VirtualKeyboard } from '../keyboard/VirtualKeyboard';
import { AgentInspector } from '../agent/AgentInspector';
import { getTransliterationSuggestion } from '../../utils/transliteration';
import { offlineStorage } from '../../services/offlineStorage';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Keyboard,
  Sparkles,
  Bookmark,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Layers,
  ArrowRight,
  BookOpen,
  Image as ImageIcon,
  RotateCcw,
  X,
  AlertCircle,
  CheckCircle2,
  FileText,
  Lightbulb,
  GraduationCap,
  Globe
} from 'lucide-react';

interface AITutorViewProps {
  profile: StudentProfile;
  activeSubject: string;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onOpenClassSelector: () => void;
  onOpenLanguageCenter: () => void;
  onNavigateToPhoto: () => void;
}

const STORAGE_CHAT_KEY = 'pathashala_chat_history_v2';

export const AITutorView: React.FC<AITutorViewProps> = ({
  profile,
  activeSubject,
  onUpdateProfile,
  onOpenClassSelector,
  onOpenLanguageCenter,
  onNavigateToPhoto
}) => {
  // Load initial messages from localStorage if available
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_CHAT_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse saved chat history:', e);
      }
    }

    return [
      {
        id: 'welcome',
        sender: 'tutor',
        text: `ନମସ୍କାର ${profile.nickname || profile.name}! Welcome to PATHASHALA AI.
I am your personal educational AI agent for **Class ${profile.classNum} ${activeSubject}** (${profile.schoolBoard}).

You can ask me questions in **${profile.tutorLanguage}**, type with the regional keyboard below, speak using the microphone, or click any pedagogical action below!`,
        timestamp: 'Just now',
        language: profile.tutorLanguage,
        isDemo: true,
        demoNotice: 'DEMO MODE: Ready for student queries',
        suggestedFollowups: [
          'Explain electric current simply',
          'How does photosynthesis work?',
          'Give an example from daily life in Odisha',
          'Solve step-by-step with formulas'
        ]
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardLanguage, setKeyboardLanguage] = useState(
    profile.tutorLanguage.toLowerCase().includes('odia')
      ? 'odia'
      : profile.tutorLanguage.toLowerCase().includes('urdu')
      ? 'urdu'
      : profile.tutorLanguage.toLowerCase().includes('telugu')
      ? 'telugu'
      : profile.tutorLanguage.toLowerCase().includes('tamil')
      ? 'tamil'
      : profile.tutorLanguage.toLowerCase().includes('bengali')
      ? 'bengali'
      : profile.tutorLanguage.toLowerCase().includes('gujarati')
      ? 'gujarati'
      : profile.tutorLanguage.toLowerCase().includes('punjabi')
      ? 'punjabi'
      : profile.tutorLanguage.toLowerCase().includes('malayalam')
      ? 'malayalam'
      : 'hindi'
  );

  const [transliterationEnabled, setTransliterationEnabled] = useState(true);
  const [transliterationSuggestion, setTransliterationSuggestion] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [notesNotification, setNotesNotification] = useState<string | null>(null);

  // Agent State & Observable Decision Record
  const [currentDecision, setCurrentDecision] = useState<AgentDecisionRecord>({
    timestamp: 'Just now',
    step: 'PLAN',
    currentGoal: `Master Class ${profile.classNum} ${activeSubject} concepts`,
    currentTopic: `${activeSubject} Fundamentals`,
    observedGap: `Baseline evaluation for Class ${profile.classNum}`,
    selectedAction: 'explain_concept',
    reason: `Adapting vocabulary and difficulty strictly for Class ${profile.classNum} in ${profile.tutorLanguage}`,
    toolUsed: `PedagogicalEngine.explain(class: ${profile.classNum}, lang: ${profile.tutorLanguage})`,
    outcome: 'Student profile verified; ready for questions and practice',
    nextRecommendedAction: 'ask_diagnostic_question'
  });

  const [activeStep, setActiveStep] = useState<any>('PLAN');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUrdu = profile.tutorLanguage.toLowerCase() === 'urdu';

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat to localStorage:', e);
    }
  }, [messages]);

  // Sync keyboard script with profile tutorLanguage
  useEffect(() => {
    const lang = profile.tutorLanguage.toLowerCase();
    if (lang.includes('odia')) setKeyboardLanguage('odia');
    else if (lang.includes('urdu')) setKeyboardLanguage('urdu');
    else if (lang.includes('telugu')) setKeyboardLanguage('telugu');
    else if (lang.includes('marathi')) setKeyboardLanguage('marathi');
    else if (lang.includes('kannada')) setKeyboardLanguage('kannada');
    else if (lang.includes('tamil')) setKeyboardLanguage('tamil');
    else if (lang.includes('bengali')) setKeyboardLanguage('bengali');
    else if (lang.includes('gujarati')) setKeyboardLanguage('gujarati');
    else if (lang.includes('punjabi')) setKeyboardLanguage('punjabi');
    else if (lang.includes('malayalam')) setKeyboardLanguage('malayalam');
    else if (lang.includes('english')) setKeyboardLanguage('english');
    else setKeyboardLanguage('hindi');
  }, [profile.tutorLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, attachedImage]);

  // Transliteration logic
  const handleInputChange = (text: string) => {
    setInputText(text);

    if (transliterationEnabled) {
      const words = text.trim().split(/\s+/);
      const lastWord = words[words.length - 1];
      if (lastWord && lastWord.length >= 2) {
        const targetScript = profile.tutorLanguage.toLowerCase().includes('odia') ? 'odia' : 'hindi';
        const suggestion = getTransliterationSuggestion(lastWord, targetScript);
        setTransliterationSuggestion(suggestion);
      } else {
        setTransliterationSuggestion(null);
      }
    } else {
      setTransliterationSuggestion(null);
    }
  };

  const acceptTransliteration = () => {
    if (!transliterationSuggestion) return;
    const words = inputText.trim().split(/\s+/);
    words[words.length - 1] = transliterationSuggestion;
    setInputText(words.join(' ') + ' ');
    setTransliterationSuggestion(null);
    inputRef.current?.focus();
  };

  // Keyboard text insertion at cursor position
  const handleInsertChar = (char: string) => {
    if (!inputRef.current) {
      setInputText((prev) => prev + char);
      return;
    }
    const start = inputRef.current.selectionStart || inputText.length;
    const end = inputRef.current.selectionEnd || inputText.length;
    const nextText = inputText.substring(0, start) + char + inputText.substring(end);
    setInputText(nextText);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(start + char.length, start + char.length);
      }
    }, 0);
  };

  const handleBackspace = () => {
    if (!inputRef.current) {
      setInputText((prev) => prev.slice(0, -1));
      return;
    }
    const start = inputRef.current.selectionStart || inputText.length;
    const end = inputRef.current.selectionEnd || inputText.length;
    if (start === end && start > 0) {
      const nextText = inputText.substring(0, start - 1) + inputText.substring(end);
      setInputText(nextText);
      setTimeout(() => {
        inputRef.current?.setSelectionRange(start - 1, start - 1);
      }, 0);
    } else if (start !== end) {
      const nextText = inputText.substring(0, start) + inputText.substring(end);
      setInputText(nextText);
      setTimeout(() => {
        inputRef.current?.setSelectionRange(start, start);
      }, 0);
    }
  };

  // Voice speech-to-text
  const toggleSpeechRecognition = () => {
    setSpeechError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Voice speech input is not supported in this browser. Please use the on-screen regional keyboard.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const lang = profile.tutorLanguage.toLowerCase();
      if (lang === 'odia') recognition.lang = 'or-IN';
      else if (lang === 'hindi') recognition.lang = 'hi-IN';
      else if (lang === 'urdu') recognition.lang = 'ur-IN';
      else if (lang === 'telugu') recognition.lang = 'te-IN';
      else if (lang === 'tamil') recognition.lang = 'ta-IN';
      else if (lang === 'bengali') recognition.lang = 'bn-IN';
      else if (lang === 'marathi') recognition.lang = 'mr-IN';
      else if (lang === 'gujarati') recognition.lang = 'gu-IN';
      else if (lang === 'punjabi') recognition.lang = 'pa-IN';
      else if (lang === 'malayalam') recognition.lang = 'ml-IN';
      else recognition.lang = 'en-IN';

      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsRecording(false);
      };
      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsRecording(false);
        setSpeechError('Microphone access was denied or not detected. Please verify browser permissions.');
      };
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch (err: any) {
      console.warn('Speech error:', err);
      setIsRecording(false);
      setSpeechError('Speech recognition could not be initialized.');
    }
  };

  // Text-to-speech read aloud
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[#*$`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = profile.accessibility.speechSpeed || 1.0;

    const lang = profile.tutorLanguage.toLowerCase();
    if (lang === 'hindi') utterance.lang = 'hi-IN';
    else if (lang === 'odia') utterance.lang = 'or-IN';
    else if (lang === 'urdu') utterance.lang = 'ur-PK';
    else if (lang === 'telugu') utterance.lang = 'te-IN';
    else if (lang === 'tamil') utterance.lang = 'ta-IN';
    else if (lang === 'bengali') utterance.lang = 'bn-IN';
    else utterance.lang = 'en-IN';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Image Upload handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Image file is too large. Please select an image under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Action Trigger (Explain Simply, Explain in Detail, Give Example, Show Steps, Generate Quiz, Save Notes)
  const handleAction = async (actionType: string) => {
    if (actionType === 'save_notes') {
      // Find last tutor message
      const lastTutorMsg = [...messages].reverse().find((m) => m.sender === 'tutor');
      if (!lastTutorMsg) {
        alert('No tutor response available to save yet. Ask a question first!');
        return;
      }

      try {
        await offlineStorage.saveNote({
          id: 'note-' + Date.now(),
          title: `${activeSubject} Note (Class ${profile.classNum})`,
          topic: activeSubject,
          content: lastTutorMsg.text,
          subject: activeSubject,
          classNum: profile.classNum,
          createdAt: new Date().toISOString()
        });
        setNotesNotification(`Saved "${activeSubject}" notes to Offline Library! Accessible anytime.`);
        setTimeout(() => setNotesNotification(null), 4000);
      } catch (e) {
        console.error('Save notes error:', e);
      }
      return;
    }

    // Execute pedagogy action
    let promptQuery = '';
    if (actionType === 'explain_simply') promptQuery = 'Explain this concept simply with a relatable analogy';
    else if (actionType === 'explain_detail') promptQuery = 'Provide an in-depth academic explanation with key formulas and exam points';
    else if (actionType === 'give_example') promptQuery = 'Give a real-life everyday example from Odisha or India';
    else if (actionType === 'show_steps') promptQuery = 'Show step-by-step mathematical calculation and derivation with units';
    else if (actionType === 'generate_quiz') promptQuery = 'Generate a 2-question quick quiz on this concept';
    else promptQuery = `Action: ${actionType}`;

    await executeSendMessage(promptQuery, actionType);
  };

  // Send message
  const executeSendMessage = async (textToSend: string, actionType: string = 'explain_concept') => {
    const query = textToSend.trim();
    if (!query && !attachedImage) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query || 'Analyze attached textbook question',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: activeSubject,
      classNum: profile.classNum,
      language: profile.tutorLanguage,
      photoUrl: attachedImage || undefined
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setTransliterationSuggestion(null);
    const sentImage = attachedImage;
    setAttachedImage(null);
    setIsLoading(true);

    // Update agent state step 1: OBSERVE
    setActiveStep('OBSERVE');
    const detectedTopic = query.toLowerCase().includes('current') || query.toLowerCase().includes('ohm')
      ? 'Electric Current & Resistance'
      : query.toLowerCase().includes('photo') || query.toLowerCase().includes('leaf')
      ? 'Photosynthesis & Plant Biology'
      : `${activeSubject} Core Concept`;

    // Step 2 & 3: Understand & Plan
    setTimeout(() => setActiveStep('UNDERSTAND'), 200);
    setTimeout(() => setActiveStep('PLAN'), 400);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          classNum: profile.classNum,
          subject: activeSubject,
          board: profile.schoolBoard,
          targetLanguage: profile.tutorLanguage,
          textbookLanguage: profile.textbookLanguage,
          action: actionType,
          imageBase64: sentImage || undefined
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `AI request failed (HTTP ${response.status})`);
      }

      // Step 4, 5, 6, 7: Act, Evaluate, Adapt, Save
      setActiveStep('ACT');
      setTimeout(() => setActiveStep('EVALUATE'), 200);
      setTimeout(() => setActiveStep('ADAPT'), 350);

      const decision: AgentDecisionRecord = {
        timestamp: new Date().toLocaleTimeString(),
        step: 'ADAPT',
        currentGoal: `Master Class ${profile.classNum} ${activeSubject} — ${detectedTopic}`,
        currentTopic: detectedTopic,
        observedGap: actionType === 'explain_simply'
          ? `Requested simplification for Class ${profile.classNum}`
          : actionType === 'show_steps'
          ? 'Procedural calculation breakdown requested'
          : `Formative inquiry in ${profile.tutorLanguage}`,
        selectedAction: actionType,
        reason: `Pedagogical adaptation: Class ${profile.classNum} standard, ${profile.tutorLanguage} script`,
        toolUsed: `GeminiAgent.${actionType}(class: ${profile.classNum}, lang: ${profile.tutorLanguage})`,
        outcome: data.isDemo
          ? 'Formulated scaffolded answer using local pedagogical agent engine'
          : 'Answer synthesized via Gemini 2.5 Flash model',
        nextRecommendedAction: actionType === 'explain_simply' ? 'show_steps' : 'generate_quiz'
      };

      setCurrentDecision(decision);

      const tutorMsg: ChatMessage = {
        id: 'tutor-' + Date.now(),
        sender: 'tutor',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: activeSubject,
        classNum: profile.classNum,
        language: profile.tutorLanguage,
        isDemo: data.isDemo,
        demoNotice: data.demoNotice,
        agentDecision: decision,
        suggestedFollowups: [
          'Show steps with formulas',
          'Give an example from Odisha',
          'Generate a quick quiz on this'
        ]
      };

      setMessages((prev) => [...prev, tutorMsg]);
      setTimeout(() => setActiveStep('SAVE'), 500);
    } catch (err: any) {
      console.warn('API error, using local fallback:', err);
      // Fallback message with clear error handling
      const fallbackMsg: ChatMessage = {
        id: 'tutor-' + Date.now(),
        sender: 'tutor',
        text: `### 🌟 PATHSHALA AI • Pedagogical Tutor (Class ${profile.classNum})
**Subject:** ${activeSubject} | **Language:** ${profile.tutorLanguage}

#### Explanation:
"${query}" is a foundational topic in Class ${profile.classNum} ${activeSubject}.
1. **Core Concept:** Remember to connect the basic principles with daily observations.
2. **Key Formula / Mechanism:** Ensure that all SI units are noted down before starting numerical calculations.
3. **Examination Advice:** In board examinations, always draw a neat labeled diagram where applicable!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: activeSubject,
        classNum: profile.classNum,
        language: profile.tutorLanguage,
        isDemo: true,
        demoNotice: 'DEMO MODE: Generated via resilient offline agent engine (Network unreachable)'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Start a fresh conversation? Saved notes in your offline library will remain safe.')) {
      setMessages([]);
      localStorage.removeItem(STORAGE_CHAT_KEY);
    }
  };

  const popularLanguages = [
    { id: 'Odia', label: 'ଓଡ଼ିଆ' },
    { id: 'Hindi', label: 'हिन्दी' },
    { id: 'English', label: 'English' },
    { id: 'Urdu', label: 'اردو' },
    { id: 'Telugu', label: 'తెలుగు' },
    { id: 'Marathi', label: 'मराठी' },
    { id: 'Kannada', label: 'ಕನ್ನಡ' },
    { id: 'Tamil', label: 'தமிழ்' },
    { id: 'Bengali', label: 'বাংলা' },
    { id: 'Gujarati', label: 'ગુજરાતી' },
    { id: 'Punjabi', label: 'ਪੰਜਾਬੀ' },
    { id: 'Malayalam', label: 'മലയാളം' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] min-h-[580px] max-w-5xl mx-auto space-y-3">
      {/* Top Context Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {/* Quick Class Dropdown */}
          <div className="relative group">
            <button
              onClick={onOpenClassSelector}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition border border-indigo-200"
              title="Change Student Class (1 to 12)"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Class {profile.classNum}</span>
              <span className="text-[10px] font-normal text-indigo-500">
                ({profile.schoolBoard.split(' ')[0]})
              </span>
              <ChevronDown className="w-3 h-3 text-indigo-500" />
            </button>
          </div>

          <span className="text-slate-300">•</span>

          {/* Subject Badge */}
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-700 flex items-center gap-1 truncate max-w-[140px] sm:max-w-none">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{activeSubject}</span>
          </span>

          <span className="text-slate-300">•</span>

          {/* Inline Language Selector (switches without losing conversation) */}
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-violet-600 shrink-0" />
            <select
              value={profile.tutorLanguage}
              onChange={(e) => {
                const newLang = e.target.value;
                onUpdateProfile({ tutorLanguage: newLang });
              }}
              className="px-2 py-1 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold border border-violet-200 text-xs focus:outline-none cursor-pointer"
              title="Switch Tutor Language without losing chat"
            >
              {popularLanguages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label} ({l.id})
                </option>
              ))}
            </select>
            <button
              onClick={onOpenLanguageCenter}
              className="text-[10px] text-violet-600 hover:underline px-1 font-semibold hidden sm:inline"
            >
              All 23
            </button>
          </div>
        </div>

        {/* Right side tools: Clear chat, Ask from Photo link */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={onNavigateToPhoto}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold transition"
            title="Open Fullscreen Photo Doubt Solver"
          >
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Ask from Photo</span>
          </button>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Observable Agent Activity Banner */}
      <AgentInspector currentDecision={currentDecision} activeStep={activeStep} />

      {/* Notifications / Toast Banner */}
      {notesNotification && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notesNotification}</span>
        </div>
      )}

      {speechError && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{speechError}</span>
          </div>
          <button onClick={() => setSpeechError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const msgIsUrdu = (msg.language && msg.language.toLowerCase() === 'urdu') || (isUrdu && isUser);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                dir={msgIsUrdu ? 'rtl' : 'ltr'}
                className={`max-w-[92%] sm:max-w-[80%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-none'
                } ${msgIsUrdu ? 'font-urdu text-right' : ''}`}
              >
                {/* Tutor Header with Source Badge (Demo vs Live) */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-indigo-600 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        PATHSHALA AI
                      </span>

                      {/* Explicit Demo vs Live AI Label */}
                      {msg.isDemo ? (
                        <span
                          className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200"
                          title="Running on local pedagogical agent engine (Gemini API key not configured or simulated)"
                        >
                          Demo Response • Offline Agent
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          Live AI • Gemini 2.5 Flash
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speakText(msg.text)}
                        className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
                        title="Read Aloud"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleAction('save_notes')}
                        className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
                        title="Save to Offline Notes"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Attached Image Thumbnail (if sent by user) */}
                {msg.photoUrl && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-white/20 max-w-[260px] bg-black/10">
                    <img
                      src={msg.photoUrl}
                      alt="Question attachment"
                      className="max-h-48 w-full object-contain"
                    />
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans space-y-2">{msg.text}</div>
                {msg.isDemo && msg.demoNotice && <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-[11px] leading-relaxed text-amber-900">{msg.demoNotice}</div>}

                <div
                  className={`text-[10px] mt-2 pt-1 ${
                    msgIsUrdu ? 'text-left' : 'text-right'
                  } ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Suggested Followups */}
              {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                  {msg.suggestedFollowups.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => executeSendMessage(f)}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 text-xs transition flex items-center gap-1"
                    >
                      <span>{f}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold w-fit animate-pulse border border-indigo-100">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
            <span>
              Agent is formulating pedagogical response for Class {profile.classNum} in {profile.tutorLanguage}...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 6 Explicit Pedagogical Action Buttons (Explain Simply, Explain in Detail, Give Example, Show Steps, Generate Quiz, Save Notes) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" /> Actions:
        </span>
        <button
          onClick={() => handleAction('explain_simply')}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-700 font-semibold transition shrink-0 shadow-2xs"
          title="Explain simply with an intuitive everyday analogy"
        >
          💡 Explain Simply
        </button>
        <button
          onClick={() => handleAction('explain_detail')}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-700 font-semibold transition shrink-0 shadow-2xs"
          title="Comprehensive academic coverage with derivations and exam tips"
        >
          📖 Explain in Detail
        </button>
        <button
          onClick={() => handleAction('give_example')}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-700 font-semibold transition shrink-0 shadow-2xs"
          title="Concrete everyday examples from Indian / Odisha context"
        >
          🌾 Give Example
        </button>
        <button
          onClick={() => handleAction('show_steps')}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-700 font-semibold transition shrink-0 shadow-2xs"
          title="Step-by-step formula derivation or calculation"
        >
          🔢 Show Steps
        </button>
        <button
          onClick={() => handleAction('generate_quiz')}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-700 font-semibold transition shrink-0 shadow-2xs"
          title="Generate a 2-question diagnostic quiz"
        >
          📝 Generate Quiz
        </button>
        <button
          onClick={() => handleAction('save_notes')}
          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-bold transition shrink-0 shadow-2xs flex items-center gap-1"
          title="Save current concept explanation to your Offline Library"
        >
          <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
          <span>Save Notes</span>
        </button>
      </div>

      {/* Transliteration Suggestion Chip */}
      {transliterationSuggestion && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 animate-fadeIn">
          <span className="font-semibold">Transliteration:</span>
          <span>Convert to:</span>
          <button
            onClick={acceptTransliteration}
            className="px-2.5 py-0.5 rounded-md bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-sm transition"
          >
            {transliterationSuggestion} (Press Space)
          </button>
          <button
            onClick={() => setTransliterationSuggestion(null)}
            className="text-amber-700 hover:underline text-[11px]"
          >
            Ignore
          </button>
        </div>
      )}

      {/* Attached Image Preview inside Input Bar */}
      {attachedImage && (
        <div className="flex items-center gap-2 p-2 bg-indigo-50/80 border border-indigo-200 rounded-2xl text-xs animate-fadeIn">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-indigo-300 bg-white shrink-0">
            <img src={attachedImage} alt="Thumbnail preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 truncate">
            <span className="font-bold text-slate-800 block">Textbook Photo Attached</span>
            <span className="text-[11px] text-slate-500">Will be analyzed alongside your question</span>
          </div>
          <button
            onClick={() => setAttachedImage(null)}
            className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-md">
        {/* Language Keyboard Toggle */}
        <button
          onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
          className={`p-2.5 rounded-xl transition ${
            isKeyboardOpen
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
          title="Toggle On-Screen Regional Keyboard"
        >
          <Keyboard className="w-5 h-5" />
        </button>

        {/* Transliteration Toggle Button */}
        <button
          onClick={() => setTransliterationEnabled(!transliterationEnabled)}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition hidden sm:block ${
            transliterationEnabled
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-100 text-slate-500'
          }`}
          title="Type in English to convert phonetically to Indic script"
        >
          {transliterationEnabled ? 'ଅ/अ ON' : 'ଅ/अ OFF'}
        </button>

        {/* Image Attachment Trigger */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition"
          title="Upload or Snap Textbook Photo"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          className="hidden"
        />

        {/* Text Input with RTL support for Urdu */}
        <input
          ref={inputRef}
          type="text"
          dir={isUrdu ? 'rtl' : 'ltr'}
          value={inputText}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              executeSendMessage(inputText);
            } else if (e.key === ' ' && transliterationSuggestion) {
              acceptTransliteration();
            }
          }}
          placeholder={
            isUrdu
              ? `اردو میں سوال لکھیں یا نیچے دیئے گئے بٹن دبائیں...`
              : `Ask any question in ${profile.tutorLanguage} or English...`
          }
          className={`flex-1 px-3 py-2 text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 ${
            isUrdu ? 'font-urdu text-right' : ''
          }`}
        />

        {/* Voice Recognition */}
        <button
          onClick={toggleSpeechRecognition}
          className={`p-2.5 rounded-xl transition ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
          title="Voice Speech Input"
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Send Button */}
        <button
          onClick={() => executeSendMessage(inputText)}
          disabled={(!inputText.trim() && !attachedImage) || isLoading}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
        >
          <span className="hidden sm:inline text-xs font-bold">Ask</span>
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Docked On-Screen Regional Keyboard */}
      {isKeyboardOpen && (
        <VirtualKeyboard
          currentLanguage={keyboardLanguage}
          onInsertChar={handleInsertChar}
          onBackspace={handleBackspace}
          onClear={() => setInputText('')}
          onSubmit={() => executeSendMessage(inputText)}
          onClose={() => setIsKeyboardOpen(false)}
          onChangeLanguage={(lang) => {
            setKeyboardLanguage(lang);
          }}
        />
      )}
    </div>
  );
};
