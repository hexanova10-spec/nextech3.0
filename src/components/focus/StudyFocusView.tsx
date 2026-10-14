import React, { useState, useEffect, useRef } from 'react';
import {
  StudentProfile,
  StudySessionConfig,
  FocusInterruption,
  CameraAlert
} from '../../types';
import { INITIAL_STUDY_SESSION_CONFIGS } from '../../data/mockStore';
import {
  Play,
  Pause,
  Coffee,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Camera,
  CameraOff,
  Maximize2,
  Minimize2,
  Info,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  Award,
  X
} from 'lucide-react';

interface StudyFocusViewProps {
  profile: StudentProfile;
  onNavigateToTutor?: () => void;
  onNavigateToPractice?: () => void;
  onSessionComplete?: (sessionSummary: any) => void;
}

export const StudyFocusView: React.FC<StudyFocusViewProps> = ({
  profile,
  onNavigateToTutor,
  onNavigateToPractice,
  onSessionComplete
}) => {
  // Active session configuration
  const [selectedConfig, setSelectedConfig] = useState<StudySessionConfig>(
    INITIAL_STUDY_SESSION_CONFIGS[0]
  );

  // Session state
  const [sessionActive, setSessionActive] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(selectedConfig.durationMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(selectedConfig.durationMinutes * 60);
  const [activeSecondsCount, setActiveSecondsCount] = useState(0);

  // Activities & checklists
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(4);
  const [interruptions, setInterruptions] = useState<FocusInterruption[]>([]);

  // Interruption modal / banner state
  const [interruptionNotice, setInterruptionNotice] = useState<string | null>(null);
  const awayStartRef = useRef<number | null>(null);
  const awayMilestonesRef = useRef<Set<number>>(new Set());
  const focusSessionIdRef = useRef<string>(''); 

  const sendFocusMilestone = async (seconds: number, level: 'student' | 'parent' | 'alarm') => {
    const storedUser = (() => {
      try { return JSON.parse(localStorage.getItem('pathashala_user') || '{}'); } catch { return {}; }
    })();
    const studentId = storedUser.id || 'STU-2026-1082';
    const studentName = storedUser.name || profile.name;
    try {
      await fetch('/api/focus-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          studentName,
          sessionId: focusSessionIdRef.current || 'FOCUS-SESSION',
          level,
          awaySeconds: seconds,
          reason: document.hidden ? 'tab_hidden' : 'window_not_focused'
        })
      });
    } catch (error) {
      console.warn('Focus event could not be synced to the server:', error);
    }
  };

  const showFocusNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try { new Notification(title, { body, tag: title }); } catch {}
    }
  };

  const playFocusAlarm = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.7);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.72);
      oscillator.onended = () => { void context.close(); };
    } catch {}
  };

  const processAwayDuration = (duration: number) => {
    if (!sessionActive || isOnBreak || duration < 60) return;
    const milestones: { seconds: number; level: 'student' | 'parent' | 'alarm'; title: string; body: string }[] = [
      { seconds: 60, level: 'student', title: 'Time to refocus', body: 'Your study window has been inactive for about one minute. Please check in and resume when ready.' },
      { seconds: 300, level: 'parent', title: 'Parent check-in', body: 'The study window has been inactive for about five minutes. A parent check-in has been recorded.' },
      { seconds: 600, level: 'alarm', title: 'Study focus alert', body: 'The study window has been inactive for about ten minutes. Please resume or end your session.' }
    ];
    milestones.forEach((milestone) => {
      if (duration >= milestone.seconds && !awayMilestonesRef.current.has(milestone.seconds)) {
        awayMilestonesRef.current.add(milestone.seconds);
        void sendFocusMilestone(milestone.seconds, milestone.level);
        if (milestone.level !== 'parent') showFocusNotification(milestone.title, milestone.body);
        if (milestone.level === 'student') setInterruptionNotice(milestone.body);
        if (milestone.level === 'parent') setInterruptionNotice('A parent check-in notification has been queued after 5 minutes away.');
        if (milestone.level === 'alarm') {
          setInterruptionNotice('10-minute focus alert: a gentle alarm played. Please resume or end the session.');
          showFocusNotification(milestone.title, milestone.body);
          playFocusAlarm();
        }
      }
    });
  };

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Optional Camera Presence Monitoring
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [absenceAlertProvisional, setAbsenceAlertProvisional] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);
  const [screenStayAwake, setScreenStayAwake] = useState(false);
  const [visionStatus, setVisionStatus] = useState('Waiting for camera');
  const [personDetected, setPersonDetected] = useState<boolean | null>(null);
  const [gazeEstimate, setGazeEstimate] = useState('Not available');
  const [drowsyEstimate, setDrowsyEstimate] = useState('Not available');
  const visionEngineRef = useRef<any>(null);
  const visionFrameRef = useRef<number | null>(null);
  const closedEyesSinceRef = useRef<number | null>(null);
  const lastVisionTimeRef = useRef<number>(0);


  // Attach the stream after React mounts the conditional video element.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = cameraStream;
    if (cameraStream) {
      void video.play().catch((error) => {
        console.warn('Camera preview could not start:', error);
        setInterruptionNotice('Camera is allowed, but the preview could not start. Check browser camera permissions and try again.');
      });
    }
  }, [cameraStream, cameraActive]);


  // Optional on-device face landmark analysis. Video frames are processed locally;
  // the app does not upload frames or identify who the person is.
  useEffect(() => {
    let cancelled = false;
    let lastVideoTime = -1;
    const boot = async () => {
      if (!cameraActive || !cameraStream || !videoRef.current) {
        if (visionFrameRef.current !== null) cancelAnimationFrame(visionFrameRef.current);
        visionFrameRef.current = null;
        if (visionEngineRef.current) {
          try { visionEngineRef.current.close(); } catch {}
          visionEngineRef.current = null;
        }
        setVisionStatus(cameraActive ? 'Waiting for video frames' : 'Camera analysis off');
        setPersonDetected(null);
        setGazeEstimate('Not available');
        setDrowsyEstimate('Not available');
        closedEyesSinceRef.current = null;
        return;
      }
      setVisionStatus('Loading on-device vision model…');
      try {
        // Loaded only when the user enables the camera. The model runs in-browser.
        const visionModule: any = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm');
        if (cancelled) return;
        const files = await visionModule.FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm'
        );
        const landmarker = await visionModule.FaceLandmarker.createFromOptions(files, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'CPU'
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false
        });
        if (cancelled) { landmarker.close(); return; }
        visionEngineRef.current = landmarker;
        setVisionStatus('Analyzing locally');
        const distance = (a: any, b: any) => Math.hypot(a.x-b.x, a.y-b.y);
        const ear = (p: any[], a: number, b: number, c: number, d: number, e: number, f: number) => {
          const vertical = distance(p[b],p[f]) + distance(p[c],p[e]);
          const horizontal = 2 * distance(p[a],p[d]);
          return horizontal ? vertical / horizontal : 0;
        };
        const loop = (now: number) => {
          if (cancelled) return;
          const video = videoRef.current;
          if (video && video.readyState >= 2 && video.currentTime !== lastVideoTime && now-lastVisionTimeRef.current > 180) {
            lastVideoTime = video.currentTime;
            lastVisionTimeRef.current = now;
            try {
              const result = landmarker.detectForVideo(video, now);
              const face = result.faceLandmarks?.[0];
              if (!face) {
                setPersonDetected(false);
                setGazeEstimate('No face detected');
                setDrowsyEstimate('Cannot estimate');
                closedEyesSinceRef.current = null;
                setVisionStatus('No face detected — adjust lighting or camera angle');
              } else {
                setPersonDetected(true);
                const leftEar = ear(face,33,160,158,133,153,144);
                const rightEar = ear(face,362,385,387,263,373,380);
                const avgEar = (leftEar + rightEar) / 2;
                const nose = face[1];
                const leftCorner = face[33], rightCorner = face[263];
                const eyeMid = (leftCorner.x + rightCorner.x) / 2;
                const faceWidth = Math.abs(rightCorner.x-leftCorner.x) || 0.001;
                const horizontalOffset = (nose.x-eyeMid)/faceWidth;
                const verticalOffset = (nose.y-(face[159].y+face[386].y)/2);
                const looksForward = Math.abs(horizontalOffset) < 0.16 && Math.abs(verticalOffset) < 0.16;
                setGazeEstimate(looksForward ? 'Facing screen (estimate)' : 'Possibly looking away');
                if (avgEar < 0.17) {
                  if (closedEyesSinceRef.current === null) closedEyesSinceRef.current = now;
                  const closedMs = now-closedEyesSinceRef.current;
                  setDrowsyEstimate(closedMs > 2500 ? 'Possible prolonged eye closure' : 'Eyes appear closed');
                } else {
                  closedEyesSinceRef.current = null;
                  setDrowsyEstimate('Eyes appear open');
                }
                setVisionStatus('Face landmarks detected locally');
              }
            } catch (error) {
              console.warn('Local face analysis frame failed:', error);
              setVisionStatus('Analysis frame failed; retrying');
            }
          }
          visionFrameRef.current = requestAnimationFrame(loop);
        };
        visionFrameRef.current = requestAnimationFrame(loop);
      } catch (error) {
        console.error('Could not initialize local vision model:', error);
        setVisionStatus('Model could not load — check internet access and reload');
      }
    };
    void boot();
    return () => {
      cancelled = true;
      if (visionFrameRef.current !== null) cancelAnimationFrame(visionFrameRef.current);
      visionFrameRef.current = null;
      if (visionEngineRef.current) {
        try { visionEngineRef.current.close(); } catch {}
        visionEngineRef.current = null;
      }
    };
  }, [cameraActive, cameraStream]);

  // Ask the browser to keep the display awake during an active study session.
  // This cannot lock the device or prevent users from leaving the page.
  useEffect(() => {
    if (!sessionActive || isOnBreak) {
      if (wakeLockRef.current) {
        void wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
      setScreenStayAwake(false);
      return;
    }
    let cancelled = false;
    const requestWakeLock = async () => {
      try {
        const api = (navigator as Navigator & { wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void>; addEventListener?: (type: string, listener: () => void) => void }> } }).wakeLock;
        if (!api) { setScreenStayAwake(false); return; }
        const lock = await api.request('screen');
        if (cancelled) { await lock.release().catch(() => {}); return; }
        wakeLockRef.current = lock;
        setScreenStayAwake(true);
        lock.addEventListener?.('release', () => {
          wakeLockRef.current = null;
          setScreenStayAwake(false);
        });
      } catch { setScreenStayAwake(false); }
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) void requestWakeLock();
    };
    void requestWakeLock();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      if (wakeLockRef.current) {
        void wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [sessionActive, isOnBreak]);

  // Completed session modal summary
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (sessionActive && !isOnBreak && remainingSeconds > 0) {
      interval = setInterval(() => {
        if (awayStartRef.current) {
          processAwayDuration(Math.round((Date.now() - awayStartRef.current) / 1000));
        }
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleEndSession();
            return 0;
          }
          return prev - 1;
        });
        setActiveSecondsCount((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionActive, isOnBreak, remainingSeconds]);

  // Interruption listener: tab visibility & window blur
  useEffect(() => {
    if (!sessionActive || isOnBreak) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        awayStartRef.current = Date.now();
      } else {
        if (awayStartRef.current) {
          const duration = Math.round((Date.now() - awayStartRef.current) / 1000);
          awayStartRef.current = null;
          processAwayDuration(duration);
          if (duration >= 3) {
            const newInterruption: FocusInterruption = {
              id: `INT-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              durationSeconds: duration,
              reason: 'tab_hidden'
            };
            setInterruptions((prev) => [...prev, newInterruption]);
            setInterruptionNotice(
              `Welcome back! Application was in background for ${duration}s. Let's resume your focus.`
            );
          }
        }
      }
    };

    const handleWindowBlur = () => {
      if (!awayStartRef.current) {
        awayStartRef.current = Date.now();
      }
    };

    const handleWindowFocus = () => {
      if (awayStartRef.current) {
        const duration = Math.round((Date.now() - awayStartRef.current) / 1000);
        awayStartRef.current = null;
        processAwayDuration(duration);
        if (duration >= 3) {
          const newInterruption: FocusInterruption = {
            id: `INT-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            durationSeconds: duration,
            reason: 'window_blur'
          };
          setInterruptions((prev) => [...prev, newInterruption]);
          setInterruptionNotice(
            `Welcome back! Window lost focus for ${duration}s. Your timer was gently held.`
          );
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [sessionActive, isOnBreak, profile.name]);

  // Browser-level soft lock: warn before accidental tab/window close while studying.
  // This is not a kiosk lock; browsers and operating systems can always override it.
  useEffect(() => {
    if (!sessionActive || isOnBreak) return;
    const warnBeforeExit = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeExit);
    return () => window.removeEventListener('beforeunload', warnBeforeExit);
  }, [sessionActive, isOnBreak]);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Handle camera toggling
  const handleToggleCamera = async () => {
    if (cameraActive) {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
        setCameraStream(null);
      }
      setCameraActive(false);
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setCameraStream(stream);
        setCameraActive(true);
        setCameraPermissionGranted(true);

      } else {
        setCameraPermissionGranted(false);
        setCameraActive(false);
        setInterruptionNotice('This browser does not support camera access. Try the latest Chrome or Edge over HTTPS.');
      }
    } catch (e) {
      console.warn('Camera permission dismissed or hardware unavailable:', e);
      // Still allow non-camera study
      setCameraPermissionGranted(false);
      setCameraActive(false);
      setInterruptionNotice(
        'Camera presence check unavailable or permission declined. Continuing in standard Focus Mode.'
      );
    }
  };

  const handleStartSession = () => {
    setSessionActive(true);
    setIsOnBreak(false);
    setRemainingSeconds(selectedConfig.durationMinutes * 60);
    setTotalSeconds(selectedConfig.durationMinutes * 60);
    setActiveSecondsCount(0);
    setInterruptions([]);
    setInterruptionNotice(null);
  };

  const handleToggleBreak = () => {
    setIsOnBreak(!isOnBreak);
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setShowSummaryModal(true);

    // Stop camera if active
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
      setCameraActive(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleActivity = (act: string) => {
    if (completedActivities.includes(act)) {
      setCompletedActivities(completedActivities.filter((a) => a !== act));
    } else {
      setCompletedActivities([...completedActivities, act]);
    }
  };

  // Format time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(
    100,
    Math.round(((totalSeconds - remainingSeconds) / (totalSeconds || 1)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Disclaimer */}
      <div className="bg-white rounded-3xl p-5 border border-[#D5E9DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF3E8] border border-[#D5E9DC] text-[#006A4E] text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5" />
            Structured Study Focus Mode
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18352A] tracking-tight">
            Study Session • Class {selectedConfig.classNum} {selectedConfig.subject}
          </h1>
          <p className="text-xs text-[#64776B] mt-0.5">
            Designed to help students develop disciplined, distraction-free study habits with gentle pacing and breaks.
          </p>
        </div>

        {/* Technical Transparency Note */}
        <div className="p-3 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC] max-w-sm text-[11px] text-[#64776B] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" />
          <span>
            <strong>Device Policy:</strong> This is a supportive in-app focus mode, not a device lock. Browsers cannot prevent closing the tab or opening other apps; school-managed kiosk controls are needed for true lockdown. Students can end a session or take a break.
          </span>
        </div>
      </div>

      {/* Main Focus Control Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timer & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D5E9DC] shadow-sm text-center relative overflow-hidden">
            {/* Active Status Badge */}
            <div className="flex items-center justify-between mb-6">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  isOnBreak
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : sessionActive
                    ? 'bg-[#DFF3E8] text-[#004B38] border border-[#D5E9DC]'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnBreak
                      ? 'bg-amber-500 animate-pulse'
                      : sessionActive
                      ? 'bg-[#006A4E] animate-pulse'
                      : 'bg-slate-400'
                  }`}
                />
                {isOnBreak
                  ? 'On Break (Paused)'
                  : sessionActive
                  ? 'Focus Active'
                  : 'Ready to Begin'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl text-[#64776B] hover:text-[#18352A] hover:bg-[#F4FBF6] border border-[#D5E9DC] text-xs font-bold transition flex items-center gap-1"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
                </button>

                <button
                  onClick={handleToggleCamera}
                  className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                    cameraActive
                      ? 'bg-[#006A4E] text-white border-[#004B38]'
                      : 'bg-white text-[#64776B] border-[#D5E9DC] hover:bg-[#F4FBF6]'
                  }`}
                  title="Classroom Presence Check"
                >
                  {cameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Presence Check {cameraActive ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Respectful Interruption Toast */}
            {interruptionNotice && (
              <div className="mb-6 p-3 rounded-2xl bg-[#DFF3E8] border border-[#D5E9DC] text-[#004B38] text-xs flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#006A4E]" />
                  <span>{interruptionNotice}</span>
                </div>
                <button
                  onClick={() => setInterruptionNotice(null)}
                  className="text-xs font-bold hover:underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Circular / Large Timer Display */}
            <div className="py-6 sm:py-10">
              <div className="text-6xl sm:text-7xl font-black text-[#18352A] font-mono tracking-tight">
                {formatTime(remainingSeconds)}
              </div>
              <p className="text-xs text-[#64776B] mt-2 font-semibold">
                {selectedConfig.chapter} • Target: {selectedConfig.durationMinutes} Minutes
              </p>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1.5 max-w-md mx-auto mb-8">
              <div className="w-full bg-[#EBF7F0] h-3 rounded-full overflow-hidden border border-[#D5E9DC]">
                <div
                  className="bg-[#006A4E] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#64776B] font-semibold">
                <span>Elapsed: {formatTime(totalSeconds - remainingSeconds)}</span>
                <span>{progressPercent}% Complete</span>
                <span>Remaining: {formatTime(remainingSeconds)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!sessionActive ? (
                <button
                  onClick={handleStartSession}
                  className="px-8 py-3.5 rounded-2xl bg-[#006A4E] hover:bg-[#004B38] text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Focus Session</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleToggleBreak}
                    className={`px-5 py-3 rounded-2xl font-bold text-xs border transition flex items-center gap-2 ${
                      isOnBreak
                        ? 'bg-[#006A4E] text-white border-[#004B38]'
                        : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                    <span>{isOnBreak ? 'Resume Studying' : 'Take 3-Min Break'}</span>
                  </button>

                  <button
                    onClick={handleEndSession}
                    className="px-6 py-3 rounded-2xl bg-white border border-[#D5E9DC] hover:border-rose-400 text-rose-700 hover:bg-rose-50 font-bold text-xs transition flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>End Session</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Permitted Activities Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-[#D5E9DC] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#18352A] text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006A4E]" />
                Teacher-Permitted Learning Activities
              </h3>
              <span className="text-xs text-[#006A4E] font-bold">
                {completedActivities.length} of {selectedConfig.permittedActivities.length} Done
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedConfig.permittedActivities.map((act) => {
                const isChecked = completedActivities.includes(act);
                return (
                  <button
                    key={act}
                    onClick={() => toggleActivity(act)}
                    className={`p-3 rounded-2xl text-left border text-xs font-semibold transition flex items-center justify-between ${
                      isChecked
                        ? 'bg-[#DFF3E8] text-[#004B38] border-[#D5E9DC]'
                        : 'bg-[#F4FBF6] text-[#18352A] border-[#D5E9DC] hover:bg-white'
                    }`}
                  >
                    <span>{act}</span>
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                        isChecked
                          ? 'bg-[#006A4E] text-white border-[#004B38]'
                          : 'bg-white border-[#D5E9DC]'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Camera Presence & Rules & Stats */}
        <div className="space-y-6">
          {/* Optional Classroom Presence Check Preview */}
          <div className="bg-white rounded-3xl p-5 border border-[#D5E9DC] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#18352A] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#006A4E]" />
                Classroom Presence Check
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  cameraActive
                    ? 'bg-[#DFF3E8] text-[#004B38] border border-[#D5E9DC]'
                    : 'bg-slate-100 text-[#64776B]'
                }`}
              >
                {cameraActive ? 'Camera Preview Active' : 'Disabled'}
              </span>
            </div>

            {cameraActive ? (
              <div className="space-y-2">
                <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-[#D5E9DC]">
                  <video
                    ref={(element) => {
                      // Attach the stream exactly when React mounts this conditional element.
                      videoRef.current = element;
                      if (element && cameraStream) {
                        if (element.srcObject !== cameraStream) element.srcObject = cameraStream;
                        void element.play().catch((error) => {
                          console.warn('Camera preview could not start:', error);
                          setInterruptionNotice('Camera permission was granted, but Chrome could not start the video preview. Close other apps using the camera, then turn Presence Check off and on again.');
                        });
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={(event) => {
                      const video = event.currentTarget;
                      if (video.videoWidth === 0 || video.videoHeight === 0) {
                        setInterruptionNotice('Camera opened but has not supplied video frames yet. Turn Presence Check off and on again, and close other apps using the camera.');
                      } else {
                        void video.play().catch((error) => {
                          console.warn('Camera preview play failed after metadata:', error);
                          setInterruptionNotice('Camera is connected but playback failed. Turn Presence Check off and on again.');
                        });
                      }
                    }}
                    onPlaying={() => setInterruptionNotice(null)}
                    onError={() => setInterruptionNotice('The camera stream could not be rendered. Turn Presence Check off and on again; if it remains black, check Chrome camera selection and close other apps using it.')}
                    className="block w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Optical Stream</span>
                  </div>
                </div>

                <p className="text-[10px] text-[#64776B] leading-tight">
                  {cameraStream ? 'Camera stream connected.' : 'No live camera stream is connected.'} {screenStayAwake ? 'Screen stay-awake is active during this study session.' : 'Screen stay-awake activates when a study session starts, if supported by your browser.'}
                </p>
                <p className="text-[10px] text-[#64776B] leading-tight">
                  🔒 <strong>Privacy:</strong> Face landmarks are analyzed locally in this browser; frames are not uploaded or recorded. This is an estimate, not a reliable attention or sleep detector.
                </p>
                <div className="grid grid-cols-1 gap-1.5 rounded-xl border border-[#D5E9DC] bg-[#F4FBF6] p-3 text-[11px] text-[#18352A]" aria-live="polite">
                  <div className="font-bold text-[#006A4E]">On-device presence analysis</div>
                  <div>Model: {visionStatus}</div>
                  <div>Person/face: {personDetected === null ? 'Waiting' : personDetected ? 'Detected' : 'Not detected'}</div>
                  <div>Screen direction: {gazeEstimate}</div>
                  <div>Drowsiness: {drowsyEstimate}</div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC] text-center space-y-2">
                <p className="text-xs text-[#64776B]">
                  Camera preview is optional. Focus tracking detects tab/window changes only; it does not detect whether your face is visible.
                </p>
                <button
                  onClick={handleToggleCamera}
                  className="px-4 py-2 rounded-xl bg-[#006A4E] text-white font-bold text-xs shadow-xs hover:bg-[#004B38] transition"
                >
                  Allow Camera Check
                </button>
              </div>
            )}
          </div>

          {/* Session Rules & Guidelines */}
          <div className="bg-white rounded-3xl p-5 border border-[#D5E9DC] shadow-sm space-y-3">
            <span className="text-xs font-bold text-[#18352A] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#006A4E]" />
              Study Session Norms
            </span>
            <ul className="space-y-2 text-xs text-[#64776B]">
              {selectedConfig.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006A4E] shrink-0 mt-1.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Session Tracker Summary */}
          <div className="bg-white rounded-3xl p-5 border border-[#D5E9DC] shadow-sm space-y-3 text-xs">
            <span className="font-bold text-[#18352A]">Live Session Metrics</span>
            <div className="space-y-2 text-[#64776B]">
              <div className="flex justify-between py-1 border-b border-[#D5E9DC]">
                <span>Active Focused Time:</span>
                <strong className="text-[#18352A]">{formatTime(activeSecondsCount)}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#D5E9DC]">
                <span>Interruptions Detected:</span>
                <strong className="text-[#006A4E]">{interruptions.length}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Quiz Practice Points:</span>
                <strong className="text-amber-600 font-bold">+50 XP</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 bg-[#0C1E16]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#D5E9DC] shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#DFF3E8] border border-[#D5E9DC] flex items-center justify-center mx-auto text-[#006A4E]">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#18352A]">Study Session Completed!</h3>
              <p className="text-xs text-[#64776B]">
                Awesome discipline, Subhashree! Your focus metrics have been recorded in your Daily Activity Timeline.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left p-4 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC] text-xs">
              <div>
                <span className="text-[#64776B] text-[11px] block">Active Focus:</span>
                <strong className="text-base font-extrabold text-[#18352A]">
                  {Math.round(activeSecondsCount / 60)} Minutes
                </strong>
              </div>
              <div>
                <span className="text-[#64776B] text-[11px] block">Focus Quality:</span>
                <strong className="text-base font-extrabold text-[#006A4E]">
                  {interruptions.length === 0 ? '100% Exemplary' : '92% Strong'}
                </strong>
              </div>
              <div>
                <span className="text-[#64776B] text-[11px] block">Tasks Completed:</span>
                <strong className="text-xs font-bold text-[#18352A]">
                  {completedActivities.length} Activities
                </strong>
              </div>
              <div>
                <span className="text-[#64776B] text-[11px] block">XP Points:</span>
                <strong className="text-xs font-bold text-amber-600">+60 XP Earned</strong>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  if (onNavigateToPractice) onNavigateToPractice();
                }}
                className="w-full py-3 rounded-xl bg-[#006A4E] hover:bg-[#004B38] text-white font-bold text-xs shadow-md transition"
              >
                Proceed to Practice Quiz
              </button>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#18352A] font-bold text-xs transition"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
