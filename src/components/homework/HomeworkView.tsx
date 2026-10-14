import React, { useEffect, useRef, useState } from 'react';
import {
  UserRole,
  StudentProfile,
  HomeworkAssignment,
  HomeworkSubmission,
  HomeworkStatus
} from '../../types';
import {
  INITIAL_HOMEWORK_ASSIGNMENTS,
  INITIAL_HOMEWORK_SUBMISSIONS
} from '../../data/mockStore';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Calendar,
  Send,
  Plus,
  Search,
  Filter,
  Check,
  Award,
  ChevronRight,
  Eye,
  MessageSquare,
  FileCheck,
  Sparkles
} from 'lucide-react';

interface HomeworkViewProps {
  role: UserRole;
  profile: StudentProfile;
}

export const HomeworkView: React.FC<HomeworkViewProps> = ({ role, profile }) => {
  const [assignments, setAssignments] = useState<HomeworkAssignment[]>(
    INITIAL_HOMEWORK_ASSIGNMENTS
  );
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(
    INITIAL_HOMEWORK_SUBMISSIONS
  );

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<HomeworkAssignment | null>(
    assignments[0]
  );

  // Student answer state
  const [answerText, setAnswerText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Teacher Create Homework state
  const [isCreatingHomework, setIsCreatingHomework] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState(10);
  const [newSubject, setNewSubject] = useState('Physics');
  const [newInstructions, setNewInstructions] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-10-20');
  const [newMaxMarks, setNewMaxMarks] = useState(20);

  // Teacher Grading Modal state
  const [selectedSubForGrading, setSelectedSubForGrading] = useState<HomeworkSubmission | null>(
    null
  );
  const [gradeMarks, setGradeMarks] = useState(18);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [isSuggestingGrade, setIsSuggestingGrade] = useState(false);
  const [aiGradeSuggestion, setAiGradeSuggestion] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [recordingTitle, setRecordingTitle] = useState('');
  const [recordingFile, setRecordingFile] = useState<File | null>(null);
  const [cameraRecording, setCameraRecording] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<BlobPart[]>([]);
  const [recordingClass, setRecordingClass] = useState(10);
  const [recordingSubject, setRecordingSubject] = useState('Physics');
  const [recordingMessage, setRecordingMessage] = useState<string | null>(null);

  // Teacher and student portals read the same backend source of truth.
  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      try {
        const response = await fetch('/api/homework');
        if (!response.ok) throw new Error(`Homework API returned HTTP ${response.status}`);
        const data = await response.json();
        if (cancelled) return;
        if (Array.isArray(data.homework)) setAssignments(data.homework);
        if (Array.isArray(data.submissions)) setSubmissions(data.submissions);
      } catch (error) {
        console.warn('Could not refresh shared homework records:', error);
      }
    };
    void refresh();
    const timer = window.setInterval(() => { void refresh(); }, 8000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);

  const stopCameraRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    setCameraRecording(false);
  };

  const startCameraRecording = async () => {
    setCameraError(null);
    setRecordingFile(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') throw new Error('Camera recording is not supported by this browser. Upload an MP4/WebM file instead.');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      cameraStreamRef.current = stream;
      recordingChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data.size > 0) recordingChunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || 'video/webm' });
        setRecordingFile(new File([blob], `lesson-recording-${Date.now()}.webm`, { type: blob.type }));
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start(1000);
      setCameraRecording(true);
    } catch (error) {
      setCameraError(error instanceof Error ? error.message : 'Could not start camera recording. Check browser camera/microphone permission.');
    }
  };

  const handlePublishRecording = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setRecordingMessage(null);
    const token = localStorage.getItem('pathashala_token');
    if (!token) { setActionError('Please sign in again as a teacher before publishing.'); return; }
    try {
      if (!recordingFile) throw new Error('Choose a video file or record a lesson with the camera before publishing.');
      const signatureResponse = await fetch('/api/recordings/cloudinary-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({})
      });
      const signed = await signatureResponse.json();
      if (!signatureResponse.ok) throw new Error(signed.error || 'Could not prepare secure video upload.');
      const upload = new FormData();
      upload.append('file', recordingFile);
      upload.append('api_key', signed.apiKey);
      upload.append('timestamp', String(signed.timestamp));
      upload.append('folder', signed.folder);
      upload.append('signature', signed.signature);
      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/video/upload`, { method: 'POST', body: upload });
      const uploaded = await uploadResponse.json();
      if (!uploadResponse.ok || !uploaded.secure_url || !uploaded.public_id) throw new Error(uploaded.error?.message || 'Cloudinary upload failed. Check your Cloudinary settings and upload limits.');
      const response = await fetch('/api/recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: recordingTitle, videoUrl: uploaded.secure_url, publicId: uploaded.public_id, classNum: recordingClass, subject: recordingSubject, durationSeconds: recordingDuration })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Could not publish recording (HTTP ${response.status})`);
      setRecordingTitle('');
      setRecordingFile(null);
      setRecordingDuration(0);
      setRecordingMessage('Recording uploaded and published. Students assigned to this class can now find it in Offline Lessons.');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not publish the class recording.');
    }
  };

  // Find submission for current student & assignment
  const getSubmissionFor = (assignmentId: string) => {
    return submissions.find((s) => s.assignmentId === assignmentId);
  };

  const getCalculatedStatus = (assignment: HomeworkAssignment): HomeworkStatus => {
    const sub = getSubmissionFor(assignment.id);
    if (sub) {
      return sub.status;
    }
    const isPastDue = new Date(assignment.dueDate) < new Date('2026-10-14');
    return isPastDue ? 'Overdue' : 'Not Started';
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    const newSub: HomeworkSubmission = {
      id: `SUB-${Date.now().toString().slice(-4)}`,
      assignmentId: selectedAssignment.id,
      studentId: profile.id,
      studentName: profile.name,
      classNum: selectedAssignment.classNum,
      subject: selectedAssignment.subject,
      submittedAt: new Date().toLocaleString(),
      status: 'Submitted',
      textAnswer: answerText,
      fileName: uploadedFileName || 'solution_notes.pdf',
      maxMarks: selectedAssignment.maxMarks
    };

    try {
      await fetch(`/api/homework/${selectedAssignment.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSub)
      });
    } catch (e) {}

    setSubmissions((prev) => {
      const idx = prev.findIndex((s) => s.assignmentId === selectedAssignment.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newSub;
        return copy;
      }
      return [newSub, ...prev];
    });

    setSubmissionSuccess('Homework submitted successfully to your teacher!');
    setTimeout(() => setSubmissionSuccess(null), 3000);
  };

  const handleTeacherCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    const newHw: HomeworkAssignment = {
      id: `HW-${Date.now().toString().slice(-3)}`,
      title: newTitle,
      classNum: Number(newClass),
      subject: newSubject,
      teacherId: 'TCH-504',
      teacherName: 'Smt. Priya Sharma',
      instructions: newInstructions,
      issueDate: '2026-10-14',
      dueDate: newDueDate,
      maxMarks: Number(newMaxMarks),
      submissionType: 'both',
      totalAssigned: 38,
      submittedCount: 0
    };

    setActionError(null);
    let savedHomework = newHw;
    try {
      const response = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHw)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Could not assign homework (HTTP ${response.status})`);
      savedHomework = data.homework || newHw;
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not save the assignment. Check that the backend is running.');
      return;
    }

    setAssignments((prev) => [savedHomework, ...prev.filter((item) => item.id !== savedHomework.id)]);
    setSelectedAssignment(savedHomework);
    setIsCreatingHomework(false);
    setNewTitle('');
    setNewInstructions('');
  };

  const handleSuggestGrade = async () => {
    if (!selectedSubForGrading) return;
    setIsSuggestingGrade(true);
    setAiGradeSuggestion(null);
    setActionError(null);
    const assignment = assignments.find((item) => item.id === selectedSubForGrading.assignmentId);
    const prompt = [
      'You are assisting a school teacher with a draft assessment. Do not finalize or release marks.',
      `Assignment: ${assignment?.title || selectedSubForGrading.assignmentId}`,
      `Subject: ${assignment?.subject || selectedSubForGrading.subject || 'General'}`,
      `Instructions/question: ${assignment?.instructions || 'Use the assignment title and student answer to infer the task cautiously.'}`,
      `Maximum marks: ${selectedSubForGrading.maxMarks}`,
      `Student answer: ${selectedSubForGrading.textAnswer || '[No typed answer provided; attached file is not available to this AI request.]'}`,
      'Give a suggested score out of the maximum marks, explain which parts are correct or missing, write constructive feedback, and show a concise model answer. State uncertainty where the question or student work is incomplete.'
    ].join('\n\n');
    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: prompt,
          classNum: selectedSubForGrading.classNum || assignments.find((item) => item.id === selectedSubForGrading.assignmentId)?.classNum || profile.classNum,
          subject: assignment?.subject || selectedSubForGrading.subject || 'General',
          board: profile.schoolBoard,
          targetLanguage: profile.tutorLanguage || 'English',
          textbookLanguage: profile.textbookLanguage || 'English',
          action: 'grade_homework'
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `AI grading request failed (HTTP ${response.status})`);
      setAiGradeSuggestion(`${data.answer || 'The AI did not return a grading suggestion.'}${data.isDemo ? `\n\nDemo mode: ${data.demoNotice || 'Configure GEMINI_API_KEY on the backend for live AI.'}` : ''}`);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not generate an AI grading suggestion.');
    } finally {
      setIsSuggestingGrade(false);
    }
  };

  const handleTeacherGradeSubmit = async () => {
    if (!selectedSubForGrading) return;

    const updatedSub: HomeworkSubmission = {
      ...selectedSubForGrading,
      marksAwarded: Number(gradeMarks),
      teacherFeedback: gradeFeedback,
      status: 'Completed'
    };

    setSubmissions((prev) =>
      prev.map((s) => (s.id === selectedSubForGrading.id ? updatedSub : s))
    );
    setSelectedSubForGrading(null);
  };

  const filteredAssignments = assignments.filter((hw) => {
    // If student, filter by assigned classes (max 2 classes!)
    if (role === 'student' && profile.assignedClasses) {
      if (!profile.assignedClasses.includes(hw.classNum)) {
        return false;
      }
    }
    const status = getCalculatedStatus(hw);
    if (filterStatus === 'all') return true;
    return status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {actionError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{actionError}</div>}
      {recordingMessage && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{recordingMessage}</div>}
      {role === 'teacher' && (
        <form onSubmit={handlePublishRecording} className="rounded-3xl border border-indigo-200 bg-indigo-50/70 p-5 space-y-3">
          <div><h2 className="font-black text-slate-900">Record or Upload a Class Lesson</h2><p className="mt-1 text-xs text-slate-600">Videos upload to your configured Cloudinary account. Students can save published videos for offline playback.</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required value={recordingTitle} onChange={(e) => setRecordingTitle(e.target.value)} placeholder="Recording title" className="rounded-xl border border-indigo-200 bg-white p-2.5 text-sm" />
            <select value={recordingClass} onChange={(e) => setRecordingClass(Number(e.target.value))} className="rounded-xl border border-indigo-200 bg-white p-2.5 text-sm">{[1,2,3,4,5,6,7,8,9,10,11,12].map((c) => <option key={c} value={c}>Class {c}</option>)}</select>
            <select value={recordingSubject} onChange={(e) => setRecordingSubject(e.target.value)} className="rounded-xl border border-indigo-200 bg-white p-2.5 text-sm">{['Physics','Mathematics','Chemistry','Biology','Science','English','Odia','Social Science'].map((subject) => <option key={subject} value={subject}>{subject}</option>)}</select>
            <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => { setRecordingFile(e.target.files?.[0] || null); setRecordingDuration(0); }} className="rounded-xl border border-indigo-200 bg-white p-2.5 text-sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            {!cameraRecording ? <button type="button" onClick={() => void startCameraRecording()} className="rounded-xl border border-indigo-300 bg-white px-4 py-2.5 text-xs font-bold text-indigo-700">Start Camera Recording</button> : <button type="button" onClick={stopCameraRecording} className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white">Stop Recording</button>}
            {recordingFile && <span className="self-center text-xs font-semibold text-emerald-700">Ready: {recordingFile.name} ({(recordingFile.size / (1024 * 1024)).toFixed(1)} MB)</span>}
          </div>
          {cameraError && <p role="alert" className="text-xs text-rose-700">{cameraError}</p>}
          <button type="submit" disabled={cameraRecording || !recordingFile} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50">Upload and Publish to Students</button>
        </form>
      )}
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#D5E9DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF3E8] border border-[#D5E9DC] text-[#006A4E] text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            Homework & Subject Assignments
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18352A] tracking-tight">
            {role === 'teacher'
              ? 'Teacher Homework Management'
              : role === 'parent'
              ? `${profile.name}'s Homework Status`
              : 'My Homework & Tasks'}
          </h1>
          <p className="text-xs text-[#64776B] mt-0.5">
            {role === 'teacher'
              ? 'Assign structured tasks, evaluate student submissions, and provide encouraging feedback.'
              : 'Complete assignments on time, verify formulas, and review teacher corrections.'}
          </p>
        </div>

        {role === 'teacher' && (
          <button
            onClick={() => setIsCreatingHomework(true)}
            className="px-5 py-2.5 rounded-xl bg-[#006A4E] hover:bg-[#004B38] text-white font-bold text-xs shadow-md transition flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Assignment</span>
          </button>
        )}
      </div>

      {/* Main Grid: Assignment List (Left) & Detail/Submission View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Assignment List */}
        <div className="space-y-4">
          {/* Status Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            {['all', 'not started', 'submitted', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl capitalize transition shrink-0 ${
                  filterStatus === st
                    ? 'bg-[#006A4E] text-white shadow-xs'
                    : 'bg-white text-[#64776B] border border-[#D5E9DC] hover:bg-[#F4FBF6]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredAssignments.map((hw) => {
              const status = getCalculatedStatus(hw);
              const isSelected = selectedAssignment?.id === hw.id;

              return (
                <div
                  key={hw.id}
                  onClick={() => setSelectedAssignment(hw)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                    isSelected
                      ? 'bg-white border-[#006A4E] ring-2 ring-[#006A4E]/20 shadow-sm'
                      : 'bg-white border-[#D5E9DC] hover:border-[#006A4E]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DFF3E8] text-[#006A4E] border border-[#D5E9DC]">
                      Class {hw.classNum} • {hw.subject}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : status === 'Submitted'
                          ? 'bg-blue-100 text-blue-800'
                          : status === 'Overdue'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-[#18352A] leading-snug line-clamp-2">
                    {hw.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-[#64776B] pt-1 border-t border-[#D5E9DC]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#64776B]" />
                      Due {hw.dueDate}
                    </span>
                    <span className="font-semibold text-[#18352A]">{hw.maxMarks} Marks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Details, Workspace & Submissions */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAssignment ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D5E9DC] shadow-sm space-y-6">
              {/* Assignment Overview */}
              <div className="space-y-3 pb-5 border-b border-[#D5E9DC]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#DFF3E8] text-[#006A4E] text-xs font-bold border border-[#D5E9DC]">
                      Class {selectedAssignment.classNum}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#F4FBF6] text-[#18352A] text-xs font-bold border border-[#D5E9DC]">
                      {selectedAssignment.subject}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#64776B]">
                    Teacher: {selectedAssignment.teacherName}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-[#18352A] tracking-tight">
                  {selectedAssignment.title}
                </h2>

                <div className="p-4 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC] text-xs text-[#18352A] space-y-2">
                  <span className="font-bold text-[#006A4E] uppercase tracking-wider text-[10px] block">
                    Instructions & Problem Statement
                  </span>
                  <p className="whitespace-pre-line leading-relaxed">
                    {selectedAssignment.instructions}
                  </p>
                </div>
              </div>

              {/* Submission State for Student / Parent */}
              {(() => {
                const sub = getSubmissionFor(selectedAssignment.id);

                return (
                  <div className="space-y-4">
                    {sub ? (
                      <div className="p-5 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18352A] flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#006A4E]" />
                            Submission Status: {sub.status}
                          </span>
                          <span className="text-[11px] text-[#64776B]">
                            Submitted: {sub.submittedAt || 'Recently'}
                          </span>
                        </div>

                        {sub.marksAwarded !== undefined && (
                          <div className="p-3 rounded-xl bg-white border border-[#D5E9DC] flex items-center justify-between text-xs">
                            <span className="font-bold text-[#18352A]">Marks Awarded:</span>
                            <span className="text-sm font-extrabold text-[#006A4E]">
                              {sub.marksAwarded} / {sub.maxMarks} Marks
                            </span>
                          </div>
                        )}

                        {sub.teacherFeedback && (
                          <div className="p-3.5 rounded-xl bg-[#DFF3E8] border border-[#D5E9DC] space-y-1">
                            <span className="text-[10px] font-bold text-[#004B38] uppercase tracking-wider block">
                              Teacher Feedback & Comments:
                            </span>
                            <p className="text-xs text-[#003627] leading-relaxed">
                              "{sub.teacherFeedback}"
                            </p>
                          </div>
                        )}

                        <div className="text-xs space-y-1 text-[#64776B]">
                          <span className="font-bold text-[#18352A]">Your Submitted Response:</span>
                          <p className="p-3 rounded-xl bg-white border border-[#D5E9DC] text-[#18352A] whitespace-pre-line">
                            {sub.textAnswer || 'Uploaded file attached.'}
                          </p>
                          {sub.fileName && (
                            <div className="flex items-center gap-1.5 text-[#006A4E] text-[11px] font-bold mt-1">
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>Attached: {sub.fileName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* If not submitted and user is student, show submission form */
                      role === 'student' && (
                        <form onSubmit={handleStudentSubmit} className="space-y-4">
                          <h3 className="text-xs font-bold text-[#18352A] uppercase tracking-wider">
                            Submit Your Solution
                          </h3>

                          <div>
                            <textarea
                              rows={4}
                              required
                              value={answerText}
                              onChange={(e) => setAnswerText(e.target.value)}
                              placeholder="Write your explanation, steps, or numerical solution here..."
                              className="w-full p-3.5 rounded-2xl border border-[#D5E9DC] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006A4E] bg-white text-[#18352A]"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F4FBF6] border border-[#D5E9DC]">
                            <div className="flex items-center gap-2 text-xs text-[#64776B]">
                              <Upload className="w-4 h-4 text-[#006A4E]" />
                              <span>
                                {uploadedFileName
                                  ? `Selected: ${uploadedFileName}`
                                  : 'Optional: Attach worksheet scan (PDF/PNG)'}
                              </span>
                            </div>

                            <label className="cursor-pointer px-4 py-2 rounded-xl bg-white border border-[#D5E9DC] hover:border-[#006A4E] text-xs font-bold text-[#006A4E] transition">
                              <span>Choose File</span>
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setUploadedFileName(e.target.files[0].name);
                                  }
                                }}
                              />
                            </label>
                          </div>

                          {submissionSuccess && (
                            <div className="p-3 rounded-2xl bg-[#DFF3E8] border border-[#D5E9DC] text-[#004B38] text-xs font-bold flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#006A4E]" />
                              <span>{submissionSuccess}</span>
                            </div>
                          )}

                          <button
                            type="submit"
                            className="w-full py-3 rounded-2xl bg-[#006A4E] hover:bg-[#004B38] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            <span>Submit Homework for Review</span>
                          </button>
                        </form>
                      )
                    )}

                    {/* Teacher view: review submissions for this homework */}
                    {role === 'teacher' && (
                      <div className="space-y-3 pt-3 border-t border-[#D5E9DC]">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-[#18352A] uppercase tracking-wider">
                            Student Submissions for this Task ({submissions.filter((s) => s.assignmentId === selectedAssignment.id).length})
                          </h3>
                        </div>

                        <div className="space-y-2">
                          {submissions
                            .filter((s) => s.assignmentId === selectedAssignment.id)
                            .map((subItem) => (
                              <div
                                key={subItem.id}
                                className="p-3.5 rounded-xl border border-[#D5E9DC] bg-[#F4FBF6] flex items-center justify-between text-xs"
                              >
                                <div>
                                  <span className="font-bold text-[#18352A] block">
                                    {subItem.studentName}
                                  </span>
                                  <span className="text-[11px] text-[#64776B]">
                                    Submitted at {subItem.submittedAt || 'Oct 13'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-[#006A4E]">
                                    {subItem.marksAwarded !== undefined
                                      ? `${subItem.marksAwarded}/${subItem.maxMarks} Marks`
                                      : 'Ungraded'}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setSelectedSubForGrading(subItem);
                                      setGradeMarks(subItem.marksAwarded || 18);
                                      setGradeFeedback(subItem.teacherFeedback || '');
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-[#006A4E] text-white font-bold text-[11px] hover:bg-[#004B38] transition"
                                  >
                                    Review & Grade
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="p-12 text-center text-[#64776B] bg-white rounded-3xl border border-[#D5E9DC]">
              Select an assignment to view instructions and submit solutions.
            </div>
          )}
        </div>
      </div>

      {/* Teacher: Create Homework Modal */}
      {isCreatingHomework && (
        <div className="fixed inset-0 z-50 bg-[#0C1E16]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#D5E9DC] shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#18352A]">Create New Homework Assignment</h3>

            <form onSubmit={handleTeacherCreateHomework} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#18352A] mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Electric Circuit Numericals & Diagram"
                  className="w-full p-2.5 rounded-xl border border-[#D5E9DC] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#18352A] mb-1">Target Class</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#D5E9DC] font-bold"
                  >
                    {[9, 10, 11, 12].map((c) => (
                      <option key={c} value={c}>
                        Class {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#18352A] mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5E9DC] font-bold"
                  >
                    {['Physics', 'Mathematics', 'Chemistry', 'Biology'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#18352A] mb-1">Instructions & Questions</label>
                <textarea
                  rows={4}
                  required
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="State the questions, textbook page reference, and mandatory calculations..."
                  className="w-full p-2.5 rounded-xl border border-[#D5E9DC] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#18352A] mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5E9DC] font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18352A] mb-1">Maximum Marks</label>
                  <input
                    type="number"
                    value={newMaxMarks}
                    onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#D5E9DC] font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D5E9DC]">
                <button
                  type="button"
                  onClick={() => setIsCreatingHomework(false)}
                  className="px-4 py-2 rounded-xl text-[#64776B] font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#006A4E] text-white font-bold hover:bg-[#004B38]"
                >
                  Assign to Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher: Review & Grade Modal */}
      {selectedSubForGrading && (
        <div className="fixed inset-0 z-50 bg-[#0C1E16]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-[#D5E9DC] shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-black text-[#18352A]">
              Grade Submission: {selectedSubForGrading.studentName}
            </h3>

            <div className="p-3.5 rounded-xl bg-[#F4FBF6] border border-[#D5E9DC] space-y-1">
              <span className="font-bold text-[#18352A]">Student's Answer:</span>
              <p className="text-[#64776B] whitespace-pre-line leading-relaxed">
                {selectedSubForGrading.textAnswer}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSuggestGrade}
              disabled={isSuggestingGrade}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 font-bold text-violet-800 hover:bg-violet-100 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isSuggestingGrade ? 'AI is reviewing the answer…' : 'Suggest marks & feedback with AI'}
            </button>
            {aiGradeSuggestion && (
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 space-y-2">
                <p className="font-black text-violet-900">AI draft — teacher must verify</p>
                <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{aiGradeSuggestion}</p>
                <button
                  type="button"
                  onClick={() => setGradeFeedback(aiGradeSuggestion)}
                  className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 font-bold text-violet-800 hover:bg-violet-100"
                >
                  Copy AI draft into feedback field
                </button>
              </div>
            )}

            <div>
              <label className="block font-bold text-[#18352A] mb-1">
                Marks (out of {selectedSubForGrading.maxMarks})
              </label>
              <input
                type="number"
                max={selectedSubForGrading.maxMarks}
                value={gradeMarks}
                onChange={(e) => setGradeMarks(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#D5E9DC] font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#18352A] mb-1">Encouraging Teacher Feedback</label>
              <textarea
                rows={3}
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
                placeholder="Write constructive notes for the student..."
                className="w-full p-2.5 rounded-xl border border-[#D5E9DC] font-semibold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#D5E9DC]">
              <button
                type="button"
                onClick={() => setSelectedSubForGrading(null)}
                className="px-4 py-2 rounded-xl text-[#64776B] font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTeacherGradeSubmit}
                className="px-6 py-2 rounded-xl bg-[#006A4E] text-white font-bold hover:bg-[#004B38]"
              >
                Release Grade & Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
