import {
  User,
  StudentProfile,
  HomeworkAssignment,
  HomeworkSubmission,
  StudySessionConfig,
  CameraAlert,
  StudentReport,
  ParentReport,
  DailyActivityEvent,
  NotificationItem,
  TopicMasteryRecord,
  AILearningInsight
} from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'STU-2026-1082',
    name: 'Subhashree Nayak',
    email: 'subha@pathashala.edu',
    role: 'student',
    school: 'Bhubaneswar Government High School, Unit-1',
    identifier: 'BSE-2026-OD-8819',
    assignedClasses: [10, 9], // STRICT TWO-CLASS LIMIT
    preferredLanguage: 'Odia',
    consentAccepted: true
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
    preferredLanguage: 'English'
  },
  {
    id: 'PAR-912',
    name: 'Ananya Nayak',
    email: 'ananya.nayak@pathashala.edu',
    role: 'parent',
    linkedStudentIds: ['STU-2026-1082'],
    phone: '+91 98610 54321',
    preferredLanguage: 'Odia'
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'STU-2026-1082',
  name: 'Subhashree Nayak',
  nickname: 'Subha',
  studentId: 'BSE-2026-OD-8819',
  email: 'subha@pathashala.edu',
  assignedClasses: [10, 9], // Strictly max 2 classes!
  classNum: 10, // Active class
  schoolBoard: 'Odisha State Board (BSE/CHSE)',
  schoolName: 'Bhubaneswar Government High School, Unit-1',
  interfaceLanguage: 'English',
  tutorLanguage: 'Odia',
  textbookLanguage: 'English',
  subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Social Science', 'Odia'],
  learningGoals: ['Odisha BSE Matric Board Exam 95%+', 'Science Conceptual Clarity'],
  accessibility: {
    fontSize: 'normal',
    highContrast: false,
    speechSpeed: 1.0,
    dyslexiaFont: false
  },
  parentLinked: true,
  parentName: 'Ananya Nayak',
  parentEmail: 'ananya.nayak@pathashala.edu'
};

export const INITIAL_HOMEWORK_ASSIGNMENTS: HomeworkAssignment[] = [
  {
    id: 'HW-101',
    title: "Ohm's Law Circuit Diagram & V-I Graph Numerical",
    classNum: 10,
    subject: 'Physics',
    teacherId: 'TCH-504',
    teacherName: 'Smt. Priya Sharma',
    instructions: '1. Draw the standard schematic circuit diagram with ammeter, voltmeter, rheostat, and key.\n2. State the condition under which Ohm\'s law strictly holds true (temperature).\n3. Solve: A 6V battery is connected across an unknown resistor. A current of 2.5 mA flows. Calculate resistance R in kΩ.',
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
    instructions: 'Solve Exercises 4.2: Q1, Q3, and Q5 from textbook. Verify discriminant D = b² - 4ac for each equation and state whether roots are real, equal, or distinct.',
    issueDate: '2026-10-12',
    dueDate: '2026-10-18',
    maxMarks: 25,
    submissionType: 'text',
    totalAssigned: 38,
    submittedCount: 22
  },
  {
    id: 'HW-103',
    title: 'Life Processes: Aerobic vs Anaerobic Respiration Comparative Table',
    classNum: 10,
    subject: 'Biology',
    teacherId: 'TCH-504',
    teacherName: 'Smt. Priya Sharma',
    instructions: 'Construct a detailed comparison between aerobic cellular respiration and lactic acid anaerobic fermentation in muscle tissue during strenuous exercise.',
    issueDate: '2026-10-08',
    dueDate: '2026-10-14',
    maxMarks: 15,
    submissionType: 'both',
    totalAssigned: 38,
    submittedCount: 36
  },
  {
    id: 'HW-901',
    title: 'Atomic Structure & Bohr Model Electron Shells (Class 9 Revision)',
    classNum: 9,
    subject: 'Chemistry',
    teacherId: 'TCH-504',
    teacherName: 'Smt. Priya Sharma',
    instructions: 'Write the electron configuration of Sodium (Na, Z=11), Chlorine (Cl, Z=17), and Argon (Ar, Z=18). Draw schematic 2D orbital rings.',
    issueDate: '2026-10-09',
    dueDate: '2026-10-15',
    maxMarks: 20,
    submissionType: 'both',
    totalAssigned: 42,
    submittedCount: 39
  }
];

export const INITIAL_HOMEWORK_SUBMISSIONS: HomeworkSubmission[] = [
  {
    id: 'SUB-01',
    assignmentId: 'HW-101',
    studentId: 'STU-2026-1082',
    studentName: 'Subhashree Nayak',
    classNum: 10,
    subject: 'Physics',
    submittedAt: '2026-10-13 18:45',
    status: 'Completed',
    textAnswer: '1. Ohm\'s law states that electric current through a conductor between two points is directly proportional to voltage across two points, provided physical conditions (temperature) remain unchanged.\n2. V = I * R => R = V / I = 6V / (2.5 * 10^-3 A) = 2400 Ohms = 2.4 kΩ.',
    fileName: 'ohms_law_circuit_subhashree.pdf',
    fileSize: '1.2 MB',
    marksAwarded: 19,
    maxMarks: 20,
    teacherFeedback: 'Excellent work Subhashree! Circuit diagram was clean and SI units conversion from mA to A was perfectly executed.'
  },
  {
    id: 'SUB-02',
    assignmentId: 'HW-102',
    studentId: 'STU-2026-1082',
    studentName: 'Subhashree Nayak',
    classNum: 10,
    subject: 'Mathematics',
    status: 'In Progress',
    textAnswer: 'Working on quadratic factorization step 2: 2x^2 - 7x + 3 = 0...',
    maxMarks: 25
  },
  {
    id: 'SUB-03',
    assignmentId: 'HW-103',
    studentId: 'STU-2026-1082',
    studentName: 'Subhashree Nayak',
    classNum: 10,
    subject: 'Biology',
    submittedAt: '2026-10-14 08:30',
    status: 'Submitted',
    textAnswer: 'Comparison completed: Aerobic produces 36-38 ATP in mitochondria; Anaerobic yields 2 ATP in cytoplasm with lactic acid accumulation.',
    fileName: 'cellular_respiration_chart.png',
    fileSize: '840 KB',
    maxMarks: 15
  }
];

export const INITIAL_STUDY_SESSION_CONFIGS: StudySessionConfig[] = [
  {
    id: 'CFG-P10-01',
    title: 'Deep Focus: Electric Circuits & Numerical Mastery',
    classNum: 10,
    subject: 'Physics',
    chapter: 'Electricity & Circuits (ବିଦ୍ୟୁତ)',
    durationMinutes: 30,
    breakIntervalMinutes: 15,
    breakDurationMinutes: 3,
    cameraMonitoringEnabled: true,
    permittedActivities: ['AI Tutor Q&A', 'Formula Derivation', 'Practice Quiz', 'Revision Notes'],
    rules: [
      'Maintain continuous study focus on the assigned topic.',
      'Use the Break button if you need a planned water or stretch break.',
      'Tab switching or window minimization will be recorded as an interruption.'
    ]
  },
  {
    id: 'CFG-M10-02',
    title: 'Trigonometric Identities & Board Problems',
    classNum: 10,
    subject: 'Mathematics',
    chapter: 'Introduction to Trigonometry',
    durationMinutes: 25,
    breakIntervalMinutes: 12,
    breakDurationMinutes: 2,
    cameraMonitoringEnabled: false,
    permittedActivities: ['Step-by-Step Proofs', 'Interactive Practice', 'Board Papers'],
    rules: ['Focus strictly on identity derivations.']
  }
];

export const INITIAL_CAMERA_ALERTS: CameraAlert[] = [
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
    teacherNotes: 'Subhashree notified the chat to retrieve her textbook and geometry kit from her desk shelf. Permitted.',
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
];

export const INITIAL_STUDENT_REPORTS: StudentReport[] = [
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
    studySessionSummary: {
      totalHours: 18.5,
      focusScorePercent: 92,
      sessionsCount: 16
    },
    dailyActivitySummary: {
      daysActive: 14,
      averageMinutesPerDay: 78
    },
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
    topicsRequiringPractice: [
      'Refraction through Glass Prism (Ray diagrams)',
      'Quadratic Word Problems involving Speed & Distance',
      'Balancing Complex Redox Reactions'
    ],
    learningImprovementTrend: '+12% increase in numerical problem-solving accuracy since September.',
    teacherComments: {
      confidentialNote: 'Highly attentive student with strong conceptual foundations. Advised to practice 10-year BSE previous papers for time management.',
      releasedFeedback: 'Subhashree shows exceptional dedication and curiosity. Her understanding of Ohm\'s law and circuit schematics is outstanding. Continuing this pace will assure an exemplary board score.'
    },
    recommendedNextSteps: [
      'Complete 15-minute diagnostic quiz on Ray Optics Prism dispersion.',
      'Review quadratic factorization speed drills in Practice Zone.',
      'Keep revising Odia byakarana grammar notes saved in Offline Centre.'
    ]
  }
];

export const INITIAL_PARENT_REPORTS: ParentReport[] = [
  {
    id: 'PREP-10-OCT26',
    studentReportId: 'REP-10-OCT26',
    studentId: 'STU-2026-1082',
    studentName: 'Subhashree Nayak',
    classNum: 10,
    reportingPeriod: 'October 1 – October 14, 2026',
    publishedAt: '2026-10-13 16:30',
    teacherName: 'Smt. Priya Sharma (Science Teacher)',
    lessonsCompleted: 24,
    homeworkStatus: '3 of 3 Assigned Homework Tasks on Schedule (94% Completion Rate)',
    quizPerformance: '88% Average Quiz Accuracy across 42 practice questions',
    subjectMastery: [
      { subject: 'Physics', score: 91 },
      { subject: 'Mathematics', score: 86 },
      { subject: 'Chemistry', score: 84 },
      { subject: 'Biology', score: 89 },
      { subject: 'Social Science', score: 92 },
      { subject: 'Odia Sahitya', score: 95 }
    ],
    topicsRequiringSupport: [
      'Refraction through Prism (needs slight ray diagram practice)',
      'Quadratic equations involving word problems'
    ],
    positiveAchievements: [
      '5-day consecutive daily study streak achieved.',
      'Full marks scored in Electricity numerical calculation homework.',
      'Active learner in bilingual Odia-English AI Tutor explanations.'
    ],
    teacherFeedback: 'Subhashree is making admirable progress in Class 10. She uses her regional Odia explanations alongside English technical terms very effectively. Please encourage her to take short 5-minute eye breaks during evening study sessions.',
    recommendedRevision: [
      'Practice 2 ray diagram exercises from Chapter 11.',
      'Take the weekly Math mini-mock quiz on Sunday morning.'
    ],
    status: 'Published'
  }
];

export const INITIAL_DAILY_ACTIVITIES: DailyActivityEvent[] = [
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
  },
  {
    id: 'ACT-03',
    studentId: 'STU-2026-1082',
    studentName: 'Subhashree Nayak',
    classNum: 10,
    subject: 'Physics',
    timestamp: '09:20 AM',
    eventType: 'study_session_started',
    title: 'Started Study Focus Session',
    description: 'Session: Deep Focus on Electric Circuits (30 min target).',
    category: 'focus'
  },
  {
    id: 'ACT-04',
    studentId: 'STU-2026-1082',
    studentName: 'Subhashree Nayak',
    classNum: 10,
    subject: 'Physics',
    timestamp: '09:35 AM',
    eventType: 'quiz_submitted',
    title: 'Completed Ohm\'s Law Diagnostic Quiz',
    description: 'Scored 100% (4/4 questions correct). +50 XP awarded.',
    category: 'assessment'
  },
  {
    id: 'ACT-05',
    studentId: 'STU-2026-1082',
    studentName: 'Subhashree Nayak',
    classNum: 10,
    subject: 'Physics',
    timestamp: '09:42 AM',
    eventType: 'notes_saved',
    title: 'Saved Revision Notes to Offline Centre',
    description: 'Key definitions and formula sheet cached for offline access.',
    category: 'system'
  },
  {
    id: 'ACT-06',
    studentId: 'STU-2026-1082',
    studentName: 'Subhashree Nayak',
    classNum: 10,
    subject: 'Physics',
    timestamp: '09:50 AM',
    eventType: 'study_session_completed',
    title: 'Focus Session Finished Successfully',
    description: 'Active focus time: 28 min. 0 unauthorized interruptions.',
    category: 'focus',
    durationMinutes: 30
  },
  {
    id: 'ACT-07',
    studentId: 'STU-2026-1082',
    studentName: 'Subhashree Nayak',
    classNum: 10,
    subject: 'Physics',
    timestamp: '10:15 AM',
    eventType: 'homework_submitted',
    title: 'Submitted Homework Assignment HW-101',
    description: 'Uploaded Ohm\'s Law Circuit diagram and numerical calculations.',
    category: 'assessment'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  // Student
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
    id: 'NOTIF-S2',
    recipientRole: 'student',
    recipientId: 'STU-2026-1082',
    title: 'Homework Feedback Released',
    message: 'Your Physics Ohm\'s Law submission was reviewed: 19/20 marks awarded!',
    category: 'homework',
    timestamp: '3 hours ago',
    read: false,
    actionUrl: '/homework',
    actionLabel: 'Read Feedback'
  },
  {
    id: 'NOTIF-S3',
    recipientRole: 'student',
    recipientId: 'STU-2026-1082',
    title: 'AI Revision Recommendation',
    message: 'Time for a 5-minute revision on Ray Optics: Prism Refraction.',
    category: 'recommendation',
    timestamp: 'Yesterday',
    read: true,
    actionUrl: '/practice',
    actionLabel: 'Start Practice'
  },
  // Teacher
  {
    id: 'NOTIF-T1',
    recipientRole: 'teacher',
    recipientId: 'TCH-504',
    title: 'New Homework Submissions',
    message: '5 new submissions received for Physics Circuit Homework HW-101.',
    category: 'homework',
    timestamp: '30 mins ago',
    read: false,
    actionUrl: '/teacher/homework',
    actionLabel: 'Grade Submissions'
  },
  {
    id: 'NOTIF-T2',
    recipientRole: 'teacher',
    recipientId: 'TCH-504',
    title: 'Provisional Camera Alert',
    message: '1 provisional camera absence alert awaiting review for Class 10.',
    category: 'alert',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/teacher/camera-alerts',
    actionLabel: 'Review Alert'
  },
  // Parent
  {
    id: 'NOTIF-P1',
    recipientRole: 'parent',
    recipientId: 'PAR-912',
    title: 'Published Bi-Weekly Learning Report',
    message: 'Smt. Priya Sharma published Subhashree\'s Class 10 Learning Progress Report.',
    category: 'report',
    timestamp: 'Yesterday at 4:30 PM',
    read: false,
    actionUrl: '/parent/reports',
    actionLabel: 'View Report'
  },
  {
    id: 'NOTIF-P2',
    recipientRole: 'parent',
    recipientId: 'PAR-912',
    title: 'Homework Status Update',
    message: 'Subhashree completed Physics Homework with 19/20 marks.',
    category: 'homework',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/parent/homework',
    actionLabel: 'Check Homework'
  }
];

export const INITIAL_TOPIC_MASTERY: TopicMasteryRecord[] = [
  {
    topicId: 'top-elec-01',
    topicName: 'Electric Current, Potential Difference & Ohm\'s Law',
    subject: 'Physics',
    classNum: 10,
    masteryPercent: 94,
    quizAttempts: 12,
    correctAnswers: 11,
    incorrectAnswers: 1,
    status: 'Mastered',
    lastPracticed: 'Today',
    recommendedLesson: 'Ready to advance to Series and Parallel Resistor Combinations.'
  },
  {
    topicId: 'top-elec-02',
    topicName: 'Series & Parallel Resistors Equivalent Formulae',
    subject: 'Physics',
    classNum: 10,
    masteryPercent: 88,
    quizAttempts: 9,
    correctAnswers: 8,
    incorrectAnswers: 1,
    status: 'Mastered',
    lastPracticed: 'Yesterday',
    recommendedLesson: 'Review power dissipation formula P = I^2 * R.'
  },
  {
    topicId: 'top-opt-01',
    topicName: 'Refraction through Glass Slab & Refractive Index',
    subject: 'Physics',
    classNum: 10,
    masteryPercent: 82,
    quizAttempts: 8,
    correctAnswers: 6,
    incorrectAnswers: 2,
    status: 'In Progress',
    lastPracticed: '3 days ago',
    recommendedLesson: 'Practice Snell\'s law ratio sin(i) / sin(r) = n2 / n1.'
  },
  {
    topicId: 'top-opt-02',
    topicName: 'Refraction through Triangular Prism & Dispersion',
    subject: 'Physics',
    classNum: 10,
    masteryPercent: 54,
    quizAttempts: 6,
    correctAnswers: 3,
    incorrectAnswers: 3,
    status: 'Needs Practice',
    lastPracticed: '4 days ago',
    recommendedLesson: 'Study angle of deviation δ and rainbow formation steps.'
  },
  {
    topicId: 'top-math-01',
    topicName: 'Quadratic Equations: Factorisation & Completing Square',
    subject: 'Mathematics',
    classNum: 10,
    masteryPercent: 85,
    quizAttempts: 14,
    correctAnswers: 12,
    incorrectAnswers: 2,
    status: 'Mastered',
    lastPracticed: 'Yesterday',
    recommendedLesson: 'Practice board word problems with fractional roots.'
  },
  {
    topicId: 'top-math-02',
    topicName: 'Arithmetic Progressions: nth Term & Sum Formulae',
    subject: 'Mathematics',
    classNum: 10,
    masteryPercent: 90,
    quizAttempts: 10,
    correctAnswers: 9,
    incorrectAnswers: 1,
    status: 'Mastered',
    lastPracticed: '5 days ago',
    recommendedLesson: 'Solve application questions on AP word problems.'
  },
  {
    topicId: 'top-chem-01',
    topicName: 'Chemical Equations: Types of Reactions & Balancing',
    subject: 'Chemistry',
    classNum: 10,
    masteryPercent: 84,
    quizAttempts: 11,
    correctAnswers: 9,
    incorrectAnswers: 2,
    status: 'Mastered',
    lastPracticed: '2 days ago',
    recommendedLesson: 'Focus on thermal decomposition of ferrous sulphate.'
  },
  {
    topicId: 'top-bio-01',
    topicName: 'Human Circulatory System & Double Circulation',
    subject: 'Biology',
    classNum: 10,
    masteryPercent: 91,
    quizAttempts: 10,
    correctAnswers: 9,
    incorrectAnswers: 1,
    status: 'Mastered',
    lastPracticed: '3 days ago',
    recommendedLesson: 'Draw neat labeled heart diagram with valves.'
  }
];

export const INITIAL_AI_INSIGHTS: AILearningInsight[] = [
  {
    id: 'INS-01',
    studentId: 'STU-2026-1082',
    studentName: 'Subhashree Nayak',
    classNum: 10,
    subject: 'Physics',
    type: 'gap_identified',
    title: 'Prism Refraction & Angle of Deviation Gap',
    observation: 'Student scored 50% on Prism Dispersion quiz questions and hesitated on ray diagram orientation.',
    evidence: '3 incorrect attempts out of 6 on Topic top-opt-02 in the last 4 days.',
    recommendedAction: 'Assign 10-minute step-by-step visual ray tracing tutorial followed by 2 targeted practice questions.',
    confidenceScore: 0.92,
    createdAt: '2026-10-13'
  },
  {
    id: 'INS-02',
    studentId: 'STU-2026-1082',
    studentName: 'Subhashree Nayak',
    classNum: 10,
    subject: 'Physics',
    type: 'improvement_noticed',
    title: 'Outstanding Progress in Electric Circuit Numericals',
    observation: 'Rapid formula substitution speed and zero units conversion errors in recent exercises.',
    evidence: '100% accuracy on Ohm\'s law diagnostic and 19/20 on teacher homework.',
    recommendedAction: 'Introduce higher-order thinking skill (HOTS) questions on combinations of resistors for Class 10 Board prep.',
    confidenceScore: 0.96,
    createdAt: '2026-10-14'
  },
  {
    id: 'INS-03',
    studentId: 'STU-2026-1082',
    studentName: 'Subhashree Nayak',
    classNum: 10,
    subject: 'Mathematics',
    type: 'learning_recommendation',
    title: 'Pre-requisite Reinforcement: Quadratic Word Problems',
    observation: 'Student factorises algebraic equations quickly, but spends 4x longer translating verbal speed-distance scenarios into quadratic equations.',
    evidence: 'Time-per-question analysis in Practice Zone showed 180s avg on word problems vs 35s on pure algebraic equations.',
    recommendedAction: 'Provide step-by-step table method for Speed, Time, and Distance word problem translations.',
    confidenceScore: 0.88,
    createdAt: '2026-10-12'
  }
];
