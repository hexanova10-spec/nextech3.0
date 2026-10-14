export type UserRole = 'student' | 'teacher' | 'parent';

export type SchoolBoard = 'Odisha State Board (BSE/CHSE)' | 'CBSE' | 'ICSE / Other';

export type ClassGroup = 'primary' | 'middle' | 'secondary' | 'higher_secondary';

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'huge';
  highContrast: boolean;
  speechSpeed: number; // 0.8, 1.0, 1.2
  dyslexiaFont: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school?: string;
  identifier?: string;
  phone?: string;
  avatar?: string;
  assignedClasses?: number[]; // Max 2 for students
  linkedStudentIds?: string[]; // For parents
  teachingClasses?: number[]; // For teachers
  teachingSubjects?: string[];
  preferredLanguage?: string;
  preferredSubject?: string;
  consentAccepted?: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  nickname: string;
  studentId: string;
  email?: string;
  assignedClasses: number[]; // STRICT LIMIT: Max 2 classes (e.g. [10, 9])
  classNum: number; // Currently active selected class out of the assigned classes
  schoolBoard: SchoolBoard;
  schoolName: string;
  interfaceLanguage: string;
  tutorLanguage: string;
  textbookLanguage: string;
  subjects: string[];
  learningGoals: string[];
  accessibility: AccessibilitySettings;
  parentLinked?: boolean;
  parentName?: string;
  parentEmail?: string;
}

export interface LanguageInfo {
  id: string;
  name: string;
  nativeName: string;
  script: string;
  rtl?: boolean;
  popular?: boolean;
  hasAudioTTS?: boolean;
}

export interface SubjectItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  classGroup: ClassGroup;
  topicsCount: number;
  color: string;
}

export type AgentStepName = 'OBSERVE' | 'UNDERSTAND' | 'PLAN' | 'ACT' | 'EVALUATE' | 'ADAPT' | 'SAVE';

export interface AgentDecisionRecord {
  timestamp: string;
  step: AgentStepName;
  currentGoal: string;
  currentTopic: string;
  observedGap: string;
  selectedAction: string;
  reason: string;
  toolUsed: string;
  outcome: string;
  nextRecommendedAction: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor' | 'system';
  text: string;
  timestamp: string;
  subject?: string;
  classNum?: number;
  language?: string;
  photoUrl?: string;
  isDemo?: boolean;
  demoNotice?: string;
  agentDecision?: AgentDecisionRecord;
  suggestedFollowups?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  concept: string;
  difficulty: 'Beginner' | 'Easy' | 'Medium' | 'Advanced';
  classNum: number;
  subject: string;
  board?: string;
}

export interface LearningPathNode {
  id: string;
  title: string;
  chapter: string;
  subject: string;
  classNum: number;
  status: 'Not Started' | 'In Progress' | 'Needs Practice' | 'Ready to Advance' | 'Completed';
  estimatedMinutes: number;
  masteryPercent: number;
  prerequisites: string[];
  recommendedActivity: string;
  summary: string;
}

export interface OfflineLesson {
  id: string;
  title: string;
  subject: string;
  classNum: number;
  language: string;
  summary: string;
  keyPoints: string[];
  flashcards: { question: string; answer: string }[];
  savedAt: string;
  synced: boolean;
}

export interface GamificationState {
  streakDays: number;
  xpPoints: number;
  weeklyGoalCompleted: number;
  weeklyGoalTarget: number;
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string;
  }[];
}

export interface CareerPath {
  id: string;
  title: string;
  category: string;
  tagline: string;
  keySubjects: string[];
  skillsRequired: string[];
  beginnerSteps: string[];
  popularCollegesInOdishaAndIndia: string[];
  icon: string;
  color: string;
}

// ==========================================
// NEW TYPES FOR PATHASHALA AI UPGRADES
// ==========================================

export type HomeworkStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Submitted'
  | 'Under Review'
  | 'Needs Revision'
  | 'Completed'
  | 'Overdue';

export interface HomeworkAssignment {
  id: string;
  title: string;
  classNum: number;
  subject: string;
  teacherId: string;
  teacherName: string;
  instructions: string;
  attachments?: { name: string; url: string; size?: string }[];
  issueDate: string;
  dueDate: string;
  maxMarks: number;
  submissionType: 'text' | 'file' | 'both';
  totalAssigned: number;
  submittedCount: number;
}

export interface HomeworkSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  classNum: number;
  subject: string;
  submittedAt?: string;
  status: HomeworkStatus;
  textAnswer?: string;
  fileName?: string;
  fileSize?: string;
  marksAwarded?: number;
  maxMarks: number;
  teacherFeedback?: string;
  returnedForRevision?: boolean;
}

export interface FocusInterruption {
  id: string;
  timestamp: string;
  durationSeconds: number;
  reason: 'tab_hidden' | 'window_blur' | 'manual_pause' | 'camera_absence';
  resumedAt?: string;
}

export interface StudySessionConfig {
  id: string;
  title: string;
  classNum: number;
  subject: string;
  chapter: string;
  durationMinutes: number;
  breakIntervalMinutes: number;
  breakDurationMinutes: number;
  cameraMonitoringEnabled: boolean;
  permittedActivities: string[];
  rules: string[];
}

export interface StudySessionRecord {
  id: string;
  studentId: string;
  config: StudySessionConfig;
  startedAt: string;
  endedAt?: string;
  totalDurationSeconds: number;
  activeFocusSeconds: number;
  completedActivities: string[];
  quizQuestionsAnswered: number;
  interruptions: FocusInterruption[];
  status: 'active' | 'on_break' | 'interrupted' | 'completed' | 'abandoned';
}

export interface CameraAlert {
  id: string;
  sessionId: string;
  sessionTitle: string;
  studentId: string;
  studentName: string;
  classNum: number;
  timestamp: string;
  durationSeconds: number;
  confidence: number; // e.g. 0.88
  message: string;
  status: 'awaiting_review' | 'verified_break' | 'dismissed_glitch' | 'dismissed_lighting';
  teacherNotes?: string;
  reviewedAt?: string;
}

export type ReportStatus = 'Draft' | 'Ready for Review' | 'Published';

export interface StudentReport {
  id: string;
  studentId: string;
  studentName: string;
  classNum: number;
  assignedClasses: number[];
  subject: string;
  reportingPeriod: string; // e.g. 'Oct 1 - Oct 14, 2026'
  frequency: 'daily' | 'weekly' | 'monthly';
  status: ReportStatus;
  createdAt: string;
  publishedAt?: string;
  teacherId: string;
  teacherName: string;
  // 12 Required Sections
  studentDetails: { name: string; id: string; school: string; board: string };
  assignedClassesInfo: number[];
  lessonsCompleted: number;
  studySessionSummary: { totalHours: number; focusScorePercent: number; sessionsCount: number };
  dailyActivitySummary: { daysActive: number; averageMinutesPerDay: number };
  homeworkCompletionRate: number; // %
  quizAccuracy: number; // %
  subjectMastery: { subject: string; score: number }[];
  topicsRequiringPractice: string[];
  learningImprovementTrend: string;
  teacherComments: { confidentialNote?: string; releasedFeedback: string };
  recommendedNextSteps: string[];
}

export interface ParentReport {
  id: string;
  studentReportId: string;
  studentId: string;
  studentName: string;
  classNum: number;
  reportingPeriod: string;
  publishedAt: string;
  teacherName: string;
  lessonsCompleted: number;
  homeworkStatus: string;
  quizPerformance: string;
  subjectMastery: { subject: string; score: number }[];
  topicsRequiringSupport: string[];
  positiveAchievements: string[];
  teacherFeedback: string;
  recommendedRevision: string[];
  status: 'Published';
}

export interface DailyActivityEvent {
  id: string;
  studentId: string;
  studentName: string;
  classNum: number;
  subject?: string;
  timestamp: string;
  eventType:
    | 'login'
    | 'study_session_started'
    | 'study_session_completed'
    | 'lesson_opened'
    | 'lesson_completed'
    | 'quiz_started'
    | 'quiz_submitted'
    | 'homework_opened'
    | 'homework_submitted'
    | 'notes_saved'
    | 'focus_interruption'
    | 'offline_progress_recorded'
    | 'sync_completed'
    | 'sync_failed';
  title: string;
  description: string;
  durationMinutes?: number;
  category: 'engagement' | 'learning' | 'assessment' | 'focus' | 'system';
}

export interface NotificationItem {
  id: string;
  recipientRole: UserRole;
  recipientId: string;
  title: string;
  message: string;
  category: 'homework' | 'report' | 'session' | 'alert' | 'recommendation' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface TopicMasteryRecord {
  topicId: string;
  topicName: string;
  subject: string;
  classNum: number;
  masteryPercent: number;
  quizAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  status: 'Mastered' | 'In Progress' | 'Needs Practice';
  lastPracticed: string;
  recommendedLesson: string;
}

export interface AILearningInsight {
  id: string;
  studentId: string;
  studentName: string;
  classNum: number;
  subject: string;
  type: 'gap_identified' | 'improvement_noticed' | 'learning_recommendation';
  title: string;
  observation: string;
  evidence: string;
  recommendedAction: string;
  confidenceScore: number;
  createdAt: string;
}
