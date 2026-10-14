import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
    console.log('Gemini API client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// ==========================================
// IN-MEMORY BACKEND DATA STORE FOR PROTOTYPE
// ==========================================

const db: {
  users: any[];
  homework: any[];
  submissions: any[];
  cameraAlerts: any[];
  studentReports: any[];
  parentReports: any[];
  activities: any[];
  notifications: any[];
} = {
  users: [
    {
      id: 'STU-2026-1082',
      name: 'Subhashree Nayak',
      email: 'subha@pathashala.edu',
      role: 'student',
      school: 'Bhubaneswar Government High School, Unit-1',
      identifier: 'BSE-2026-OD-8819',
      assignedClasses: [10, 9], // STRICT TWO-CLASS LIMIT
      preferredLanguage: 'Odia',
      password: 'password123'
    },
    {
      id: 'TCH-504',
      name: 'Smt. Priya Sharma',
      email: 'priya.sharma@pathashala.edu',
      role: 'teacher',
      school: 'Bhubaneswar Government High School, Unit-1',
      identifier: 'TCH-BSE-9811',
      teachingClasses: [10, 9, 8],
      teachingSubjects: ['Physics', 'General Science', 'Mathematics'],
      preferredLanguage: 'English',
      password: 'password123'
    },
    {
      id: 'PAR-912',
      name: 'Ananya Nayak',
      email: 'ananya.nayak@pathashala.edu',
      role: 'parent',
      linkedStudentIds: ['STU-2026-1082'],
      preferredLanguage: 'Odia',
      password: 'password123'
    }
  ],
  homework: [
    {
      id: 'HW-101',
      title: "Ohm's Law Circuit Diagram & V-I Graph Numerical",
      classNum: 10,
      subject: 'Physics',
      teacherId: 'TCH-504',
      teacherName: 'Smt. Priya Sharma',
      instructions: 'Draw circuit diagram and calculate resistance for 6V battery with 2.5mA current.',
      issueDate: '2026-10-10',
      dueDate: '2026-10-16',
      maxMarks: 20,
      submissionType: 'both',
      totalAssigned: 38,
      submittedCount: 31
    },
    {
      id: 'HW-102',
      title: 'Quadratic Equations: Finding Real Roots by Factorisation',
      classNum: 10,
      subject: 'Mathematics',
      teacherId: 'TCH-504',
      teacherName: 'Smt. Priya Sharma',
      instructions: 'Solve Exercises 4.2 Q1, Q3, Q5 and state discriminant nature of roots.',
      issueDate: '2026-10-12',
      dueDate: '2026-10-18',
      maxMarks: 25,
      submissionType: 'text',
      totalAssigned: 38,
      submittedCount: 22
    }
  ],
  submissions: [
    {
      id: 'SUB-01',
      assignmentId: 'HW-101',
      studentId: 'STU-2026-1082',
      studentName: 'Subhashree Nayak',
      classNum: 10,
      subject: 'Physics',
      submittedAt: '2026-10-13 18:45',
      status: 'Completed',
      textAnswer: 'V = I * R => R = 6V / (2.5e-3) = 2400 Ohms = 2.4 kΩ.',
      fileName: 'ohms_law_circuit.pdf',
      marksAwarded: 19,
      maxMarks: 20,
      teacherFeedback: 'Excellent work Subhashree! Accurate SI unit conversion.'
    }
  ],
  cameraAlerts: [
    {
      id: 'CAM-ALT-01',
      sessionId: 'SES-901',
      sessionTitle: 'Deep Focus: Electric Circuits & Numerical Mastery',
      studentId: 'STU-2026-1082',
      studentName: 'Subhashree Nayak',
      classNum: 10,
      timestamp: '2026-10-13 10:14 AM',
      durationSeconds: 32,
      confidence: 0.89,
      message: 'Possible camera absence detected during the learning session. Teacher review required.',
      status: 'verified_break',
      teacherNotes: 'Retrieved textbook and geometry set from shelf.',
      reviewedAt: '2026-10-13 11:30 AM'
    },
    {
      id: 'CAM-ALT-02',
      sessionId: 'SES-904',
      sessionTitle: 'Mathematics Chapter 4 Quadratic Formula Focus',
      studentId: 'STU-2026-1082',
      studentName: 'Subhashree Nayak',
      classNum: 10,
      timestamp: '2026-10-14 09:22 AM',
      durationSeconds: 18,
      confidence: 0.74,
      message: 'Possible camera absence detected during the learning session. Teacher review required.',
      status: 'awaiting_review'
    }
  ],
  studentReports: [
    {
      id: 'REP-10-OCT26',
      studentId: 'STU-2026-1082',
      studentName: 'Subhashree Nayak',
      classNum: 10,
      assignedClasses: [10, 9],
      subject: 'All Subjects (BSE Matriculation Stream)',
      reportingPeriod: 'October 1 – October 14, 2026',
      frequency: 'weekly',
      status: 'Published',
      createdAt: '2026-10-13 14:00',
      publishedAt: '2026-10-13 16:30',
      teacherId: 'TCH-504',
      teacherName: 'Smt. Priya Sharma',
      studentDetails: {
        name: 'Subhashree Nayak',
        id: 'BSE-2026-OD-8819',
        school: 'Bhubaneswar Govt High School, Unit-1',
        board: 'Odisha State Board (BSE)'
      },
      assignedClassesInfo: [10, 9],
      lessonsCompleted: 24,
      studySessionSummary: { totalHours: 18.5, focusScorePercent: 92, sessionsCount: 16 },
      dailyActivitySummary: { daysActive: 14, averageMinutesPerDay: 78 },
      homeworkCompletionRate: 94,
      quizAccuracy: 88,
      subjectMastery: [
        { subject: 'Physics', score: 91 },
        { subject: 'Mathematics', score: 86 },
        { subject: 'Chemistry', score: 84 },
        { subject: 'Biology', score: 89 },
        { subject: 'Social Science', score: 92 },
        { subject: 'Odia Sahitya', score: 95 }
      ],
      topicsRequiringPractice: ['Refraction through Glass Prism', 'Quadratic Word Problems'],
      learningImprovementTrend: '+12% increase in problem-solving accuracy.',
      teacherComments: {
        confidentialNote: 'Attentive student; recommend past board questions.',
        releasedFeedback: 'Subhashree shows exceptional dedication and conceptual clarity.'
      },
      recommendedNextSteps: ['Practice ray optics diagrams', 'Daily 15-min focus sessions']
    }
  ],
  parentReports: [
    {
      id: 'PREP-10-OCT26',
      studentReportId: 'REP-10-OCT26',
      studentId: 'STU-2026-1082',
      studentName: 'Subhashree Nayak',
      classNum: 10,
      reportingPeriod: 'October 1 – October 14, 2026',
      publishedAt: '2026-10-13 16:30',
      teacherName: 'Smt. Priya Sharma',
      lessonsCompleted: 24,
      homeworkStatus: '3 of 3 Assigned Homework Tasks on Schedule (94% Rate)',
      quizPerformance: '88% Average Quiz Accuracy',
      subjectMastery: [
        { subject: 'Physics', score: 91 },
        { subject: 'Mathematics', score: 86 },
        { subject: 'Chemistry', score: 84 },
        { subject: 'Biology', score: 89 },
        { subject: 'Social Science', score: 92 },
        { subject: 'Odia Sahitya', score: 95 }
      ],
      topicsRequiringSupport: ['Refraction through Prism', 'Quadratic word problems'],
      positiveAchievements: ['5-day daily study streak', '19/20 on Electricity homework'],
      teacherFeedback: 'Subhashree is making admirable progress in Class 10 with bilingual explanations.',
      recommendedRevision: ['Practice 2 ray diagram exercises from Chapter 11'],
      status: 'Published'
    }
  ],
  activities: [
    {
      id: 'ACT-01',
      studentId: 'STU-2026-1082',
      studentName: 'Subhashree Nayak',
      classNum: 10,
      timestamp: '09:00 AM',
      eventType: 'login',
      title: 'Student Signed In',
      description: 'Authenticated from school device with verified credentials.',
      category: 'engagement'
    },
    {
      id: 'ACT-02',
      studentId: 'STU-2026-1082',
      studentName: 'Subhashree Nayak',
      classNum: 10,
      subject: 'Physics',
      timestamp: '09:05 AM',
      eventType: 'lesson_opened',
      title: 'Opened Physics: Electric Current & Resistance',
      description: 'Bilingual textbook reading started in Odia and English.',
      category: 'learning',
      durationMinutes: 15
    }
  ],
  notifications: [
    {
      id: 'NOTIF-S1',
      recipientRole: 'student',
      recipientId: 'STU-2026-1082',
      title: 'New Homework Assigned',
      message: 'Smt. Priya Sharma assigned: Quadratic Equations Real Roots Proof. Due Oct 18.',
      category: 'homework',
      timestamp: '1 hour ago',
      read: false,
      actionUrl: '/homework',
      actionLabel: 'View Assignment'
    },
    {
      id: 'NOTIF-T1',
      recipientRole: 'teacher',
      recipientId: 'TCH-504',
      title: 'Provisional Camera Alert',
      message: '1 provisional camera absence alert awaiting review for Class 10.',
      category: 'alert',
      timestamp: '2 hours ago',
      read: false,
      actionUrl: '/teacher/camera-alerts',
      actionLabel: 'Review Alert'
    }
  ]
};

// ==========================================
// REST APIS: HEALTH & AUTHENTICATION
// ==========================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    app: 'PATHASHALA AI',
    version: '2.0.0',
    mode: apiKey ? 'Live AI (Gemini 3.8 Flash)' : 'Demo Agentic Engine',
    database: 'In-Memory Prototype with IndexedDB Offline Sync'
  });
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
  const { identifier, password, role } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Student ID or email is required' });
  }

  const user = db.users.find(
    (u) =>
      (u.email?.toLowerCase() === identifier.toLowerCase() ||
        u.identifier?.toLowerCase() === identifier.toLowerCase() ||
        u.name.toLowerCase() === identifier.toLowerCase()) &&
      (!role || u.role === role)
  );

  if (!user) {
    return res.status(401).json({
      error: 'Invalid credentials. You may use the provided Quick-Fill demo accounts.'
    });
  }

  // In production, compare hashed passwords. For prototype/demo, allow password123 or any test string.
  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      school: user.school,
      identifier: user.identifier,
      assignedClasses: user.assignedClasses || [10],
      teachingClasses: user.teachingClasses,
      linkedStudentIds: user.linkedStudentIds,
      preferredLanguage: user.preferredLanguage
    },
    token: `token_${user.id}_${Date.now()}`
  });
});

// Auth Register (STRICT TWO-CLASS LIMIT ENFORCED)
app.post('/api/auth/register', (req, res) => {
  const { name, email, identifier, school, assignedClasses = [], preferredLanguage, role = 'student' } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (role === 'student') {
    if (assignedClasses.length > 2) {
      return res.status(400).json({
        error:
          'You can access a maximum of two assigned classes. Please contact your teacher if you need to change your class assignment.'
      });
    }
  }

  const newId = `STU-${Date.now().toString().slice(-4)}`;
  const newUser = {
    id: newId,
    name,
    email: email || `${name.toLowerCase().replace(/\s+/g, '')}@pathashala.edu`,
    identifier: identifier || `BSE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    school: school || 'Odisha Model School',
    role,
    assignedClasses: assignedClasses.length > 0 ? assignedClasses.slice(0, 2) : [10],
    preferredLanguage: preferredLanguage || 'Odia'
  };

  db.users.push(newUser);

  return res.json({
    success: true,
    user: newUser,
    message: 'Student account registered successfully.'
  });
});

// Strict Two-Class Limit Verification Endpoint
app.post('/api/student/classes', (req, res) => {
  const { studentId, assignedClasses } = req.body;
  if (!Array.isArray(assignedClasses)) {
    return res.status(400).json({ error: 'assignedClasses must be an array of class numbers' });
  }

  if (assignedClasses.length > 2) {
    return res.status(400).json({
      error:
        'You can access a maximum of two assigned classes. Please contact your teacher if you need to change your class assignment.'
    });
  }

  const user = db.users.find((u) => u.id === studentId);
  if (user) {
    user.assignedClasses = assignedClasses.slice(0, 2);
  }

  return res.json({
    success: true,
    assignedClasses: assignedClasses.slice(0, 2),
    message: 'Classes updated successfully within the maximum two-class limit.'
  });
});

// ==========================================
// HOMEWORK MANAGEMENT ENDPOINTS
// ==========================================

app.get('/api/homework', (req, res) => {
  const { classNum } = req.query;
  let items = db.homework;
  if (classNum) {
    items = items.filter((h) => h.classNum === Number(classNum));
  }
  return res.json({ homework: items, submissions: db.submissions });
});

app.post('/api/homework', (req, res) => {
  const { title, classNum, subject, instructions, dueDate, maxMarks, teacherName } = req.body;
  if (!title || !classNum || !subject) {
    return res.status(400).json({ error: 'Title, class, and subject are required.' });
  }

  const newHw = {
    id: `HW-${Date.now().toString().slice(-3)}`,
    title,
    classNum: Number(classNum),
    subject,
    teacherId: 'TCH-504',
    teacherName: teacherName || 'Smt. Priya Sharma',
    instructions: instructions || 'Complete the exercises and submit before deadline.',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    maxMarks: Number(maxMarks) || 20,
    submissionType: 'both',
    totalAssigned: 38,
    submittedCount: 0
  };

  db.homework.unshift(newHw);
  return res.json({ success: true, homework: newHw });
});

app.post('/api/homework/:id/submit', (req, res) => {
  const { id } = req.params;
  const { studentId, studentName, textAnswer, fileName } = req.body;

  const existingSubIdx = db.submissions.findIndex((s) => s.assignmentId === id && s.studentId === studentId);
  const newSubmission = {
    id: existingSubIdx >= 0 ? db.submissions[existingSubIdx].id : `SUB-${Date.now().toString().slice(-4)}`,
    assignmentId: id,
    studentId: studentId || 'STU-2026-1082',
    studentName: studentName || 'Subhashree Nayak',
    classNum: 10,
    subject: 'Assigned Subject',
    submittedAt: new Date().toLocaleString(),
    status: 'Submitted',
    textAnswer: textAnswer || '',
    fileName: fileName || '',
    maxMarks: 20
  };

  if (existingSubIdx >= 0) {
    db.submissions[existingSubIdx] = { ...db.submissions[existingSubIdx], ...newSubmission };
  } else {
    db.submissions.push(newSubmission);
  }

  // Update homework submitted count
  const hw = db.homework.find((h) => h.id === id);
  if (hw) {
    hw.submittedCount += 1;
  }

  return res.json({ success: true, submission: newSubmission });
});

// ==========================================
// CAMERA PRESENCE CHECK ALERTS ENDPOINTS
// ==========================================

app.get('/api/camera-alerts', (req, res) => {
  return res.json({ alerts: db.cameraAlerts });
});

app.post('/api/camera-alerts', (req, res) => {
  const { sessionId, sessionTitle, studentId, studentName, durationSeconds, confidence } = req.body;
  const newAlert = {
    id: `CAM-ALT-${Date.now().toString().slice(-3)}`,
    sessionId: sessionId || 'SES-FOCUS',
    sessionTitle: sessionTitle || 'Study Focus Session',
    studentId: studentId || 'STU-2026-1082',
    studentName: studentName || 'Subhashree Nayak',
    classNum: 10,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    durationSeconds: Number(durationSeconds) || 20,
    confidence: Number(confidence) || 0.85,
    message: 'Possible camera absence detected during the learning session. Teacher review required.',
    status: 'awaiting_review'
  };

  db.cameraAlerts.unshift(newAlert);
  return res.json({ success: true, alert: newAlert });
});

app.post('/api/camera-alerts/:id/review', (req, res) => {
  const { id } = req.params;
  const { status, teacherNotes } = req.body;

  const alert = db.cameraAlerts.find((a) => a.id === id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  alert.status = status;
  alert.teacherNotes = teacherNotes || '';
  alert.reviewedAt = new Date().toLocaleString();

  return res.json({ success: true, alert });
});

// ==========================================
 // STUDY FOCUS EVENTS & PARENT NOTIFICATIONS
 // Prototype delivery: notifications are stored in memory. Real phone push requires
 // a service worker + Web Push/FCM credentials and an authenticated subscription.
 // ==========================================

app.post('/api/focus-events', (req, res) => {
  const { studentId, studentName, sessionId, level, awaySeconds, reason } = req.body || {};
  const student = db.users.find((u) => u.id === studentId && u.role === 'student');
  if (!student) return res.status(400).json({ error: 'A valid studentId is required.' });

  const seconds = Number(awaySeconds);
  if (![60, 300, 600].includes(seconds) || !['student', 'parent', 'alarm'].includes(level)) {
    return res.status(400).json({ error: 'Unsupported focus event.' });
  }

  const parent = db.users.find((u) => u.role === 'parent' && (u.linkedStudentIds || []).includes(student.id));
  const now = new Date().toISOString();
  const event = {
    id: `FOCUS-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    studentId: student.id,
    studentName: studentName || student.name,
    sessionId: sessionId || 'FOCUS-SESSION',
    level,
    awaySeconds: seconds,
    reason: typeof reason === 'string' ? reason.slice(0, 80) : 'window_not_focused',
    createdAt: now
  };

  if (!db.focusEvents) db.focusEvents = [];
  db.focusEvents.unshift(event);

  const createNotification = (recipientRole, recipientId, title, message, category = 'focus') => {
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      recipientRole,
      recipientId,
      title,
      message,
      category,
      timestamp: now,
      read: false,
      actionUrl: recipientRole === 'parent' ? '/parent' : '/focus-session'
    });
  };

  if (seconds >= 60 && level === 'student') {
    createNotification('student', student.id, 'Let’s return to learning', 'Your study window has been inactive for about 1 minute. Take a breath and resume when ready.');
  }
  if (seconds >= 300 && level === 'parent' && parent) {
    createNotification('parent', parent.id, 'Study session needs a check-in', `${student.name}’s study window has been inactive for about 5 minutes. Please check in supportively.`);
  }
  if (seconds >= 600 && level === 'alarm') {
    createNotification('student', student.id, 'Focus check-in', 'Your study window has been inactive for about 10 minutes. Please resume or end your session.');
    if (parent) createNotification('parent', parent.id, 'Study session alert', `${student.name}’s study window has been inactive for about 10 minutes. Please check in.`, 'alert');
  }

  return res.json({ success: true, event, parentLinked: Boolean(parent) });
});

app.get('/api/notifications', (req, res) => {
  const { recipientRole, recipientId } = req.query;
  if (!recipientRole || !recipientId) {
    return res.status(400).json({ error: 'recipientRole and recipientId are required.' });
  }
  const notifications = db.notifications.filter((n) =>
    n.recipientRole === String(recipientRole) && n.recipientId === String(recipientId)
  );
  return res.json({ notifications });
});

app.post('/api/notifications/:id/read', (req, res) => {
  const item = db.notifications.find((n) => n.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Notification not found.' });
  item.read = true;
  return res.json({ success: true, notification: item });
});

// ==========================================
// TEACHER & PARENT REPORTS ENDPOINTS
// ==========================================

app.get('/api/reports', (req, res) => {
  return res.json({
    studentReports: db.studentReports,
    parentReports: db.parentReports
  });
});

app.post('/api/reports', (req, res) => {
  const reportData = req.body;
  const newReport = {
    ...reportData,
    id: reportData.id || `REP-${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toLocaleString(),
    status: reportData.status || 'Draft'
  };

  db.studentReports.unshift(newReport);
  return res.json({ success: true, report: newReport });
});

app.post('/api/reports/:id/publish', (req, res) => {
  const { id } = req.params;
  const report = db.studentReports.find((r) => r.id === id);
  if (!report) return res.status(404).json({ error: 'Report not found' });

  report.status = 'Published';
  report.publishedAt = new Date().toLocaleString();

  // Create linked parent report
  const parentRep = {
    id: `PREP-${id}`,
    studentReportId: report.id,
    studentId: report.studentId,
    studentName: report.studentName,
    classNum: report.classNum,
    reportingPeriod: report.reportingPeriod,
    publishedAt: report.publishedAt,
    teacherName: report.teacherName,
    lessonsCompleted: report.lessonsCompleted,
    homeworkStatus: `${report.homeworkCompletionRate}% Homework Completed`,
    quizPerformance: `${report.quizAccuracy}% Quiz Accuracy`,
    subjectMastery: report.subjectMastery,
    topicsRequiringSupport: report.topicsRequiringPractice,
    positiveAchievements: [
      'Consistent daily focused study sessions.',
      'Active participation in bilingual doubt-solving.'
    ],
    teacherFeedback: report.teacherComments?.releasedFeedback || 'Good performance.',
    recommendedRevision: report.recommendedNextSteps,
    status: 'Published'
  };

  db.parentReports.unshift(parentRep);

  return res.json({ success: true, studentReport: report, parentReport: parentRep });
});

// ==========================================
// DAILY ACTIVITY & NOTIFICATIONS ENDPOINTS
// ==========================================

app.get('/api/activity', (req, res) => {
  return res.json({ activities: db.activities });
});

app.post('/api/activity', (req, res) => {
  const { eventType, title, description, category, classNum, subject, studentId, studentName } = req.body;
  const newEvent = {
    id: `ACT-${Date.now().toString().slice(-4)}`,
    studentId: studentId || 'STU-2026-1082',
    studentName: studentName || 'Subhashree Nayak',
    classNum: Number(classNum) || 10,
    subject,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    eventType: eventType || 'engagement',
    title: title || 'Learning Interaction',
    description: description || '',
    category: category || 'engagement'
  };

  db.activities.unshift(newEvent);
  return res.json({ success: true, event: newEvent });
});

app.get('/api/notifications', (req, res) => {
  const { role } = req.query;
  let notifs = db.notifications;
  if (role) {
    notifs = notifs.filter((n) => n.recipientRole === role);
  }
  return res.json({ notifications: notifs });
});

// ==========================================
// GEMINI AI INTEGRATION ROUTES
// ==========================================

function buildSystemInstruction(
  classNum: number,
  subject: string,
  board: string,
  targetLanguage: string,
  textbookLanguage?: string,
  action?: string
) {
  let gradeGuidance = '';
  if (classNum <= 2) {
    gradeGuidance =
      'Class 1-2 student: Use ultra-simple words, friendly tone, short sentences, fun analogies, emojis, and maximum concrete clarity. Keep explanation very short.';
  } else if (classNum <= 5) {
    gradeGuidance =
      'Class 3-5 student: Use familiar daily-life examples, intuitive metaphors, step-by-step breakdown, and encouraging cheerful tone.';
  } else if (classNum <= 8) {
    gradeGuidance =
      'Class 6-8 student: Progressive introduction of scientific terms, clear logic, real-world examples, and foundational clarity.';
  } else if (classNum <= 10) {
    gradeGuidance =
      'Class 9-10 student: Strong conceptual clarity, standard textbook terminology (NCERT / BSE Odisha), school exam & board preparation focus, clear formulas, and key points to avoid marks deduction.';
  } else {
    gradeGuidance =
      'Class 11-12 student: Rigorous academic depth, clear derivations, formal equations, SI units, numerical step-by-step methodology, competitive exam alignment (JEE/NEET/CHSE/CBSE).';
  }

  let actionGuidance = '';
  if (action === 'explain_simply') {
    actionGuidance =
      'SPECIFIC ACTION: Explain as simply as possible using a relatable everyday analogy. Avoid heavy jargon.';
  } else if (action === 'explain_detail') {
    actionGuidance =
      'SPECIFIC ACTION: Provide an in-depth academic explanation covering the origin of the concept, governing principles, real-life implications, and exam tips.';
  } else if (action === 'give_example') {
    actionGuidance =
      'SPECIFIC ACTION: Focus primarily on giving concrete, vivid examples from Indian and Odisha everyday life (e.g., paddy fields, monsoon, solar lanterns, bicycles, cooking, local transport).';
  } else if (action === 'show_steps') {
    actionGuidance =
      'SPECIFIC ACTION: Format as a strict Step-by-Step procedural derivation or numerical calculation with given values, formula used, substitution, calculation, and final result with units.';
  } else if (action === 'generate_quiz') {
    actionGuidance =
      'SPECIFIC ACTION: Generate 2 high-quality multiple choice questions (with 4 options each) based on this concept, suitable for Class ' +
      classNum +
      ', along with the correct answer and a brief explanation.';
  } else if (action === 'save_notes') {
    actionGuidance =
      'SPECIFIC ACTION: Format as crisp, bulleted revision study notes highlighting Key Definition, Must-Remember Formula, and High-Yield Board Exam Points.';
  }

  const isUrdu = targetLanguage.toLowerCase() === 'urdu';
  const langGuidance =
    targetLanguage && targetLanguage !== 'English'
      ? `IMPORTANT: Respond in the student's selected language: ${targetLanguage}. Ensure authentic script (${isUrdu ? 'Urdu Arabic script with appropriate RTL phrasing' : 'authentic Indic script'}). If textbook language is ${textbookLanguage || 'English'}, explain the terms in ${targetLanguage} while keeping essential English technical terms in brackets where helpful for examinations.`
      : 'Respond in clear, accessible English with precise terminology.';

  return `You are PATHASHALA AI, an expert agentic educational tutor for Indian school students.
Target Student: Class ${classNum} (${gradeGuidance})
Subject: ${subject}
School Board: ${board || 'Odisha State Board (BSE/CHSE) / CBSE'}
${langGuidance}
${actionGuidance}

Pedagogical Rules:
1. Always adapt vocabulary strictly to Class ${classNum}.
2. Ensure mathematical calculations display step-by-step with units.
3. Keep tone respectful, encouraging, and academically accurate.`;
}

// AI Tutor chat endpoint
app.post('/api/gemini/tutor', async (req, res) => {
  const {
    question,
    classNum = 10,
    subject = 'Physics',
    board = 'Odisha State Board',
    targetLanguage = 'Odia',
    textbookLanguage = 'English',
    action = 'explain_concept',
    imageBase64
  } = req.body;

  if (!question && !imageBase64 && !action) {
    return res.status(400).json({ error: 'Question or action is required' });
  }

  const queryText = question || `Action: ${action} for ${subject}`;
  const systemInstruction = buildSystemInstruction(
    Number(classNum),
    subject,
    board,
    targetLanguage,
    textbookLanguage,
    action
  );

  // If live AI client is available, call Gemini API
  if (aiClient) {
    try {
      const parts: any[] = [
        { text: `${systemInstruction}\n\nStudent Action Requested: ${action}\nStudent Question: ${queryText}` }
      ];

      if (imageBase64) {
        const pureBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        parts.push({
          inlineData: {
            data: pureBase64,
            mimeType
          }
        });
      }

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: parts
      });

      const responseText = response.text;
      if (responseText) {
        return res.json({
          answer: responseText,
          source: 'gemini-2.5-flash',
          isDemo: false,
          language: targetLanguage,
          classNum,
          subject
        });
      }
    } catch (err: any) {
      console.warn('Gemini live call error, falling back to agentic demo engine:', err?.message);
    }
  }

  // Deterministic pedagogical fallback
  const fallbackResponse = generateAgenticFallback(
    queryText,
    Number(classNum),
    subject,
    targetLanguage,
    action
  );
  return res.json({
    ...fallbackResponse,
    isDemo: true,
    demoNotice:
      'DEMO RESPONSE: Generated using PATHASHALA AI local curriculum engine (Configure GEMINI_API_KEY in Secrets for live AI)'
  });
});

// Photo doubt solver vision endpoint
app.post('/api/gemini/vision', async (req, res) => {
  const { imageBase64, classNum = 10, subject = 'Physics', language = 'Odia', prompt } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image base64 data is required' });
  }

  if (aiClient) {
    try {
      const pureBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            text: `You are PATHASHALA AI textbook scanner. The student is in Class ${classNum}, studying ${subject}.
Language preference: ${language}.
Instructions:
1. Identify the textbook question or mathematical formula in the image.
2. Transcribe the exact question text.
3. Provide step-by-step worked solution adhering to Class ${classNum} Indian curriculum standards.
4. If there is a diagram, describe its key components and ray/circuit paths.
Additional Student Request: ${prompt || 'Solve step by step'}`
          },
          {
            inlineData: {
              data: pureBase64,
              mimeType
            }
          }
        ]
      });

      if (response.text) {
        return res.json({
          solution: response.text,
          detectedTopic: `${subject} Textbook Problem`,
          isDemo: false,
          source: 'gemini-2.5-flash'
        });
      }
    } catch (e: any) {
      console.warn('Gemini vision API error:', e?.message);
    }
  }

  return res.json({
    solution: `### 📸 Textbook Doubt Solution (Class ${classNum} • ${subject})

**Detected Question:**
*A 6V battery is connected in series with a resistor R. An ammeter reads 0.25 A. Calculate the value of R and the electrical power dissipated.*

#### Step 1: Given Values
- Potential Difference ($V$) = $6\\text{ V}$
- Current ($I$) = $0.25\\text{ A}$

#### Step 2: Formula & Calculation
Using Ohm's Law:
$$R = \\frac{V}{I} = \\frac{6\\text{ V}}{0.25\\text{ A}} = 24\\ \\Omega$$

Electrical Power:
$$P = V \\times I = 6 \\times 0.25 = 1.5\\text{ Watts}$$

#### Final Answer:
- Resistance: **$24\\ \\Omega$**
- Power Dissipated: **$1.5\\text{ W}$**`,
    detectedTopic: 'Ohm’s Law & Power Dissipation',
    isDemo: true,
    source: 'offline-agent-engine'
  });
});

// Deterministic fallback response generator
function generateAgenticFallback(
  question: string,
  classNum: number,
  subject: string,
  language: string,
  action: string
) {
  const langLower = (language || 'english').toLowerCase();
  const isOdia = langLower === 'odia';

  if (action === 'generate_quiz') {
    if (isOdia) {
      return {
        answer: `### 📝 ଦ୍ରୁତ ପରୀକ୍ଷା (Quick Quiz) • ଶ୍ରେଣୀ ${classNum} ${subject}

**ପ୍ରଶ୍ନ ୧:** ବିଦ୍ୟୁତ ପ୍ରବାହ (Electric Current) ର SI ଏକକ କ’ଣ?
- A) ଭୋଲ୍ଟ (Volt)
- B) ଆମ୍ପିୟର (Ampere)
- C) ଓମ୍ (Ohm)
- D) ଜୁଲ୍ (Joule)
*(ସଠିକ୍ ଉତ୍ତର: B - ଆମ୍ପିୟର)*

**ପ୍ରଶ୍ନ ୨:** ଓମ୍‌ଙ୍କ ନିୟମ ଅନୁସାରେ କେଉଁ ସୂତ୍ରଟି ସଠିକ୍?
- A) $V = I / R$
- B) $V = I \\times R$
- C) $R = V \\times I$
- D) $I = V \\times R$
*(ସଠିକ୍ ଉତ୍ତର: B - $V = IR$)*`,
        source: 'offline-agent-engine',
        language: 'Odia',
        classNum,
        subject
      };
    }

    return {
      answer: `### 📝 Quick Diagnostic Quiz • Class ${classNum} ${subject}

**Question 1:** What is the SI unit of Electric Current?
- A) Volt (V)
- B) Ampere (A)
- C) Ohm (Ω)
- D) Coulomb (C)
*(Correct Answer: B - Ampere)*

**Question 2:** According to Ohm's Law at constant temperature:
- A) $V = I \\times R$
- B) $I = V \\times R$
- C) $V = I / R$
- D) $R = V \\times I$
*(Correct Answer: A - $V = IR$)*`,
      source: 'offline-agent-engine',
      language: language || 'English',
      classNum,
      subject
    };
  }

  if (isOdia) {
    return {
      answer: `### 💡 PATHASHALA AI ଶିକ୍ଷଣ ମାର୍ଗଦର୍ଶକ (Class ${classNum} • ${subject})
**ପ୍ରଶ୍ନ:** "${question}"

**ସରଳ ବୁଝାମଣା:**
ଓମ୍‌ଙ୍କ ନିୟମ ଅନୁସାରେ ଏକ ପରିବାହୀ ଦେଇ ପ୍ରବାହିତ ବିଦ୍ୟୁତ ପ୍ରବାହ ($I$), ତାହାର ଦୁଇ ପ୍ରାନ୍ତ ମଧ୍ୟରେ ଥିବା ବିଦ୍ୟୁତ ବିଭବାନ୍ତର ($V$) ସହିତ ସମାନୁପାତୀ।

**ଗାଣିତିକ ସୂତ୍ର:**
$$V = I \\times R$$
ଯେଉଁଠାରେ:
- $V$ = ବିଭବାନ୍ତର (ଭୋଲ୍ଟ)
- $I$ = ବିଦ୍ୟୁତ ପ୍ରବାହ (ଆମ୍ପିୟର)
- $R$ = ପରିବାହୀର ପ୍ରତିରୋଧ (ଓମ୍, $\\Omega$)

*ପରୀକ୍ଷା ପାଇଁ ମନେରଖନ୍ତୁ: ତାପମାତ୍ରା ସ୍ଥିର ରହିବା ଆବଶ୍ୟକ!* ✨`,
      source: 'offline-agent-engine',
      language: 'Odia',
      classNum,
      subject
    };
  }

  return {
    answer: `### 💡 PATHASHALA AI Concept Guide (Class ${classNum} • ${subject})
**Question / Topic:** *"${question}"*

#### 1. Core Principle
At the Class ${classNum} level, this fundamental concept connects mathematical principles with practical applications.

#### 2. Key Formula & Relationship
$$V = I \\times R$$
- **Voltage ($V$):** Potential difference measured in Volts.
- **Current ($I$):** Rate of charge flow measured in Amperes.
- **Resistance ($R$):** Property opposing current flow measured in Ohms ($\\Omega$).

#### 3. Recommended Action
Practice one of the quick options below: **Show Steps** or **Generate Quiz** to test your exam readiness!`,
    source: 'offline-agent-engine',
    language: language || 'English',
    classNum,
    subject
  };
}

// Start Server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PATHASHALA AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
