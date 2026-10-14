import { SubjectItem, LearningPathNode, QuizQuestion, CareerPath } from '../types';

export const ALL_CLASSES = [
  { num: 1, label: 'Class 1', group: 'primary', age: '6-7 yrs', stage: 'Early Foundation' },
  { num: 2, label: 'Class 2', group: 'primary', age: '7-8 yrs', stage: 'Early Foundation' },
  { num: 3, label: 'Class 3', group: 'primary', age: '8-9 yrs', stage: 'Preparatory Stage' },
  { num: 4, label: 'Class 4', group: 'primary', age: '9-10 yrs', stage: 'Preparatory Stage' },
  { num: 5, label: 'Class 5', group: 'primary', age: '10-11 yrs', stage: 'Preparatory Stage' },
  { num: 6, label: 'Class 6', group: 'middle', age: '11-12 yrs', stage: 'Middle School' },
  { num: 7, label: 'Class 7', group: 'middle', age: '12-13 yrs', stage: 'Middle School' },
  { num: 8, label: 'Class 8', group: 'middle', age: '13-14 yrs', stage: 'Middle School' },
  { num: 9, label: 'Class 9', group: 'secondary', age: '14-15 yrs', stage: 'Secondary School' },
  { num: 10, label: 'Class 10', group: 'secondary', age: '15-16 yrs', stage: 'Secondary / Board Exam' },
  { num: 11, label: 'Class 11', group: 'higher_secondary', age: '16-17 yrs', stage: 'Higher Secondary / Stream' },
  { num: 12, label: 'Class 12', group: 'higher_secondary', age: '17-18 yrs', stage: 'Higher Secondary / Board Exam' }
];

export function getSubjectsForClass(classNum: number): SubjectItem[] {
  if (classNum <= 5) {
    return [
      { id: 'math', name: 'Mathematics (ଗଣିତ)', icon: 'Calculator', description: 'Numbers, Shapes, Patterns & Mental Math', classGroup: 'primary', topicsCount: 14, color: 'bg-blue-500' },
      { id: 'evs', name: 'Environmental Studies (ପରିବେଶ ବିଜ୍ଞାନ)', icon: 'Leaf', description: 'Nature, Animals, Plants & Family', classGroup: 'primary', topicsCount: 16, color: 'bg-emerald-500' },
      { id: 'english', name: 'English', icon: 'BookOpen', description: 'Phonics, Rhymes, Stories & Simple Grammar', classGroup: 'primary', topicsCount: 12, color: 'bg-violet-500' },
      { id: 'regional', name: 'Odia / Regional Language (ସାହିତ୍ୟ)', icon: 'Languages', description: 'Barnamala, Simple Words & Folktales', classGroup: 'primary', topicsCount: 15, color: 'bg-amber-500' },
      { id: 'hindi', name: 'Hindi (हिन्दी)', icon: 'Type', description: 'Varnamala, Matras & Simple Conversation', classGroup: 'primary', topicsCount: 10, color: 'bg-rose-500' },
      { id: 'science_basics', name: 'General Science Concepts', icon: 'Sparkles', description: 'Fun Experiments, Day & Night, Five Senses', classGroup: 'primary', topicsCount: 8, color: 'bg-cyan-500' }
    ];
  } else if (classNum <= 8) {
    return [
      { id: 'math', name: 'Mathematics (ଗଣିତ)', icon: 'Calculator', description: 'Fractions, Integers, Algebra & Geometry', classGroup: 'middle', topicsCount: 18, color: 'bg-blue-500' },
      { id: 'science', name: 'General Science (ବିଜ୍ଞାନ)', icon: 'Atom', description: 'Physics, Chemistry & Biology Fundamentals', classGroup: 'middle', topicsCount: 20, color: 'bg-teal-500' },
      { id: 'social', name: 'Social Science (ସାମାଜିକ ବିଜ୍ଞାନ)', icon: 'Compass', description: 'Odisha History, Geography & Civics', classGroup: 'middle', topicsCount: 16, color: 'bg-amber-600' },
      { id: 'english', name: 'English Literature & Grammar', icon: 'BookOpen', description: 'Comprehension, Tenses & Creative Writing', classGroup: 'middle', topicsCount: 14, color: 'bg-violet-500' },
      { id: 'regional', name: 'Odia Sahitya (ଓଡ଼ିଆ ସାହିତ୍ୟ)', icon: 'Languages', description: 'Prose, Poetry, Byakarana & Composition', classGroup: 'middle', topicsCount: 16, color: 'bg-orange-500' },
      { id: 'hindi', name: 'Hindi (हिन्दी)', icon: 'Type', description: 'Grammar, Nibandh & Literature', classGroup: 'middle', topicsCount: 12, color: 'bg-rose-500' },
      { id: 'computer', name: 'Computer Basics & Coding', icon: 'Cpu', description: 'Algorithms, Scratch, Typing & Internet Safety', classGroup: 'middle', topicsCount: 10, color: 'bg-indigo-500' }
    ];
  } else if (classNum <= 10) {
    return [
      { id: 'math', name: 'Mathematics (ଗଣିତ)', icon: 'Calculator', description: 'Polynomials, Quadratic Equations, Trigonometry & Coordinate Geometry', classGroup: 'secondary', topicsCount: 22, color: 'bg-blue-600' },
      { id: 'physics', name: 'Physics Concepts (ପଦାର୍ଥ ବିଜ୍ଞାନ)', icon: 'Zap', description: 'Light, Electricity, Magnetic Effects & Sources of Energy', classGroup: 'secondary', topicsCount: 14, color: 'bg-indigo-600' },
      { id: 'chemistry', name: 'Chemistry Concepts (ରସାୟନ ବିଜ୍ଞାନ)', icon: 'FlaskConical', description: 'Chemical Reactions, Acids & Bases, Metals & Carbon Compounds', classGroup: 'secondary', topicsCount: 15, color: 'bg-emerald-600' },
      { id: 'biology', name: 'Biology Concepts (ଜୀବ ବିଜ୍ଞାନ)', icon: 'Dna', description: 'Life Processes, Control & Coordination, Heredity & Environment', classGroup: 'secondary', topicsCount: 16, color: 'bg-teal-600' },
      { id: 'social', name: 'Social Science (History, Geo, Pol Sci, Eco)', icon: 'Globe', description: 'Indian National Movement, Odisha Heritage, Resources & Economy', classGroup: 'secondary', topicsCount: 20, color: 'bg-amber-600' },
      { id: 'english', name: 'English Communicative', icon: 'BookOpen', description: 'Board Format Writing, Formal Letters & Analytical Paragraphs', classGroup: 'secondary', topicsCount: 14, color: 'bg-violet-600' },
      { id: 'regional', name: 'Odia First / Second Language', icon: 'Languages', description: 'BSE Odisha Prescribed Sahitya, Prabandha & Grammar', classGroup: 'secondary', topicsCount: 18, color: 'bg-orange-600' },
      { id: 'computer', name: 'Information Technology / AI', icon: 'Cpu', description: 'Python Basics, Databases, Cyber Ethics & Data Science', classGroup: 'secondary', topicsCount: 12, color: 'bg-cyan-600' }
    ];
  } else {
    // Classes 11 and 12
    return [
      { id: 'physics', name: 'Physics (ପଦାର୍ଥ ବିଜ୍ଞାନ)', icon: 'Zap', description: 'Mechanics, Electromagnetism, Optics, Modern Physics & Numerical Derivations', classGroup: 'higher_secondary', topicsCount: 28, color: 'bg-indigo-600' },
      { id: 'chemistry', name: 'Chemistry (ରସାୟନ ବିଜ୍ଞାନ)', icon: 'FlaskConical', description: 'Physical, Organic, Inorganic, Coordination Chemistry & Reaction Mechanisms', classGroup: 'higher_secondary', topicsCount: 26, color: 'bg-emerald-600' },
      { id: 'math', name: 'Mathematics (ଗଣିତ)', icon: 'Calculator', description: 'Calculus, Vectors, 3D Geometry, Linear Programming & Probability', classGroup: 'higher_secondary', topicsCount: 24, color: 'bg-blue-600' },
      { id: 'biology', name: 'Biology (Botany & Zoology)', icon: 'Dna', description: 'Cell Cycle, Genetics, Biotechnology, Human Physiology & Ecology', classGroup: 'higher_secondary', topicsCount: 25, color: 'bg-teal-600' },
      { id: 'computer_science', name: 'Computer Science', icon: 'Code', description: 'Python, Data Structures, SQL, Computer Networks & Boolean Logic', classGroup: 'higher_secondary', topicsCount: 18, color: 'bg-cyan-600' },
      { id: 'english', name: 'English Core', icon: 'BookOpen', description: 'Flamingo, Vistas, Note Making, Report Writing & Comprehension', classGroup: 'higher_secondary', topicsCount: 15, color: 'bg-violet-600' },
      { id: 'economics', name: 'Economics', icon: 'TrendingUp', description: 'Microeconomics, Macroeconomics & Indian Economic Development', classGroup: 'higher_secondary', topicsCount: 18, color: 'bg-amber-600' },
      { id: 'accountancy', name: 'Accountancy & Business Studies', icon: 'FileText', description: 'Partnership Accounts, Financial Statements & Management Principles', classGroup: 'higher_secondary', topicsCount: 20, color: 'bg-rose-600' },
      { id: 'humanities', name: 'History, Geography & Pol Sci', icon: 'Landmark', description: 'World History, Political Theory, Human Geography & Constitution', classGroup: 'higher_secondary', topicsCount: 22, color: 'bg-orange-600' }
    ];
  }
}

export const SAMPLE_LEARNING_PATH: LearningPathNode[] = [
  {
    id: 'node-1',
    title: 'Electric Charges & Static Electricity',
    chapter: 'Chapter 1: Electricity',
    subject: 'Physics',
    classNum: 10,
    status: 'Completed',
    estimatedMinutes: 25,
    masteryPercent: 92,
    prerequisites: ['Atomic structure basics'],
    recommendedActivity: 'Review quick summary before proceeding to current',
    summary: 'Charges exist as positive and negative. SI unit is Coulomb (C). Like charges repel; opposite charges attract.'
  },
  {
    id: 'node-2',
    title: 'Electric Current & Potential Difference',
    chapter: 'Chapter 1: Electricity',
    subject: 'Physics',
    classNum: 10,
    status: 'Needs Practice',
    estimatedMinutes: 35,
    masteryPercent: 58,
    prerequisites: ['Electric Charges'],
    recommendedActivity: 'Simulate water flow analogy and solve 3 numerical problems on I = Q/t',
    summary: 'Rate of flow of electric charges. Measured in Amperes (A) using an ammeter connected in series. Potential difference V = W/Q in Volts (V).'
  },
  {
    id: 'node-3',
    title: "Ohm's Law & Resistance Factors",
    chapter: 'Chapter 1: Electricity',
    subject: 'Physics',
    classNum: 10,
    status: 'In Progress',
    estimatedMinutes: 40,
    masteryPercent: 42,
    prerequisites: ['Electric Current & Potential Difference'],
    recommendedActivity: 'Graph V vs I and calculate resistance R = V/I. Test wire length and cross-sectional area effects.',
    summary: 'At constant temperature, current is directly proportional to potential difference (V = IR). Resistance depends on length, area, material, and temperature.'
  },
  {
    id: 'node-4',
    title: 'Series & Parallel Resistor Combinations',
    chapter: 'Chapter 1: Electricity',
    subject: 'Physics',
    classNum: 10,
    status: 'Not Started',
    estimatedMinutes: 45,
    masteryPercent: 0,
    prerequisites: ["Ohm's Law"],
    recommendedActivity: 'Complete step-by-step circuit equivalent resistance derivations.',
    summary: 'Series: R_total = R1 + R2 + ...; Parallel: 1/R_total = 1/R1 + 1/R2 + ...'
  },
  {
    id: 'node-5',
    title: 'Heating Effect of Current & Electric Power',
    chapter: 'Chapter 1: Electricity',
    subject: 'Physics',
    classNum: 10,
    status: 'Not Started',
    estimatedMinutes: 30,
    masteryPercent: 0,
    prerequisites: ['Series & Parallel Resistor Combinations'],
    recommendedActivity: 'Solve commercial electrical energy consumption problems (kWh calculations).',
    summary: "Joule's Law of Heating: H = I^2 R t. Power P = VI = I^2 R = V^2 / R."
  }
];

export const SAMPLE_QUIZZES: QuizQuestion[] = [
  {
    id: 'q-1',
    question: 'An electric heater is connected to a 220V supply and draws a current of 5A. What is its resistance?',
    options: ['44 Ω', '1100 Ω', '22 Ω', '0.022 Ω'],
    correctIndex: 0,
    explanation: "By Ohm's Law, R = V / I. Here V = 220 V and I = 5 A. R = 220 / 5 = 44 Ω.",
    concept: "Ohm's Law (V = IR)",
    difficulty: 'Medium',
    classNum: 10,
    subject: 'Physics',
    board: 'Odisha BSE / CBSE'
  },
  {
    id: 'q-2',
    question: 'In Odia culture, which organelle in plant cells is responsible for photosynthesis (ଆଲୋକ ସଂଶ୍ଳେଷଣ)?',
    options: ['Chloroplast (ହରିତକଣିକା)', 'Mitochondria (ମାଇଟୋକଣ୍ଡ୍ରିଆ)', 'Ribosome (ରାଇବୋଜୋମ୍)', 'Nucleus (ନ୍ୟଷ୍ଟି)'],
    correctIndex: 0,
    explanation: 'Chloroplasts contain green chlorophyll pigment that absorbs sunlight to convert carbon dioxide and water into glucose and oxygen.',
    concept: 'Photosynthesis & Plant Cell Structure',
    difficulty: 'Easy',
    classNum: 9,
    subject: 'Biology',
    board: 'Odisha State Board'
  },
  {
    id: 'q-3',
    question: 'If two resistors of 6 Ω and 3 Ω are connected in parallel, what is their equivalent resistance?',
    options: ['9 Ω', '2 Ω', '18 Ω', '0.5 Ω'],
    correctIndex: 1,
    explanation: 'For parallel circuits: 1/Req = 1/R1 + 1/R2 = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2. Therefore, Req = 2 Ω.',
    concept: 'Parallel Resistor Networks',
    difficulty: 'Medium',
    classNum: 10,
    subject: 'Physics'
  },
  {
    id: 'q-4',
    question: 'Class 4 Math: If a farmer in Koraput packs 8 baskets with 25 fresh apples in each basket, how many apples are there in total?',
    options: ['160', '180', '200', '225'],
    correctIndex: 2,
    explanation: 'Multiply the number of baskets by the apples per basket: 8 × 25 = 200 apples.',
    concept: 'Multiplication in Real-life Context',
    difficulty: 'Easy',
    classNum: 4,
    subject: 'Mathematics'
  },
  {
    id: 'q-5',
    question: 'Class 12 Physics: The SI unit of electric permittivity of free space (ε₀) is:',
    options: ['C² N⁻¹ m⁻²', 'N m² C⁻²', 'C N⁻¹ m⁻¹', 'C² N m²'],
    correctIndex: 0,
    explanation: 'From Coulomb’s law: F = (1 / 4πε₀) * (q₁q₂ / r²). Rearranging gives ε₀ = q₁q₂ / (4π F r²), which yields C² / (N m²) = C² N⁻¹ m⁻².',
    concept: "Coulomb's Law & Permittivity Dimensions",
    difficulty: 'Advanced',
    classNum: 12,
    subject: 'Physics'
  }
];

export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'c-1',
    title: 'Software & AI Engineering',
    category: 'Technology & Computing',
    tagline: 'Build apps, AI models, and software platforms for Odisha, India, and the world.',
    keySubjects: ['Mathematics', 'Computer Science / IT', 'Physics'],
    skillsRequired: ['Logical Reasoning', 'Coding (Python/JavaScript)', 'Data Structures', 'Problem Solving'],
    beginnerSteps: [
      'Learn basic Python or web development in Class 9-10.',
      'Participate in national coding competitions like Bebras or Google Code-in.',
      'Prepare for JEE Main / OJEE for top tech colleges.'
    ],
    popularCollegesInOdishaAndIndia: ['IIT Bhubaneswar', 'NIT Rourkela', 'IIIT Bhubaneswar', 'VSSUT Burla', 'OUTR (CET) Bhubaneswar'],
    icon: 'Terminal',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'c-2',
    title: 'Healthcare & Medical Science',
    category: 'Life Sciences & Medicine',
    tagline: 'Heal lives, conduct medical research, and serve community health.',
    keySubjects: ['Biology (Botany & Zoology)', 'Chemistry', 'Physics'],
    skillsRequired: ['Empathy', 'Diagnostic Precision', 'Deep memorization & biological understanding', 'Calm under pressure'],
    beginnerSteps: [
      'Focus deeply on NCERT / Odisha State Board Biology in Class 11-12.',
      'Practice diagrams, genetic crosses, and physiology flowcharts.',
      'Prepare for NEET UG national entrance exam.'
    ],
    popularCollegesInOdishaAndIndia: ['AIIMS Bhubaneswar', 'SCB Medical College Cuttack', 'MKCG Berhampur', 'VIMSAR Burla', 'CMC Vellore'],
    icon: 'Stethoscope',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'c-3',
    title: 'Agritech & Agricultural Sciences',
    category: 'Agriculture & Sustainability',
    tagline: 'Modernize farming with precision robotics, soil sensors, and high-yield seeds.',
    keySubjects: ['Biology', 'Chemistry', 'Agriculture', 'Environmental Studies'],
    skillsRequired: ['Soil Chemistry', 'Crop Genetics', 'Drone & Sensor analytics', 'Sustainable irrigation design'],
    beginnerSteps: [
      'Observe local crops (paddy, millets in Odisha, pulses) and seasonal patterns.',
      'Take Science stream in Class 11-12.',
      'Apply for OUAT (Odisha University of Agriculture and Technology) entrance exam.'
    ],
    popularCollegesInOdishaAndIndia: ['OUAT Bhubaneswar', 'IARI New Delhi', 'GBPUAT Pantnagar', 'Tamil Nadu Agricultural University'],
    icon: 'Sprout',
    color: 'from-amber-600 to-green-700'
  },
  {
    id: 'c-4',
    title: 'Civil Services & Public Administration',
    category: 'Governance & Public Policy',
    tagline: 'Lead policy, district administration, and public welfare reforms.',
    keySubjects: ['Social Science', 'History', 'Geography', 'Political Science & Economics'],
    skillsRequired: ['Critical Reading', 'Impartial Decision Making', 'Ethics & Integrity', 'Clear Writing in English & Odia'],
    beginnerSteps: [
      'Read daily newspapers (The Hindu / Sambad / Samaj).',
      'Build strong grasp of Indian Constitution, Odisha history, and geography.',
      'Any graduation stream qualifies you for UPSC Civil Services / OPSC OAS.'
    ],
    popularCollegesInOdishaAndIndia: ['Utkal University', 'Ravenshaw University', 'Delhi University', 'JNU New Delhi'],
    icon: 'Building2',
    color: 'from-purple-600 to-indigo-800'
  },
  {
    id: 'c-5',
    title: 'Creative Design & Animation',
    category: 'Design & Media Arts',
    tagline: 'Craft game art, UI/UX for digital products, films, and indigenous heritage design.',
    keySubjects: ['Fine Arts', 'Computer Graphics', 'English / Literature', 'Geometry'],
    skillsRequired: ['Visual Storytelling', 'Color Harmony', 'Figma/Blender', 'Design Thinking'],
    beginnerSteps: [
      'Keep a daily sketchbook; practice sketching Pattachitra or digital characters.',
      'Learn basic digital illustration tools on tablet/computer.',
      'Prepare for NID (National Institute of Design) and NIFT entrance tests.'
    ],
    popularCollegesInOdishaAndIndia: ['NID Ahmedabad', 'NIFT Bhubaneswar', 'IIT Bombay IDC', 'Srishti Institute Bengaluru'],
    icon: 'Palette',
    color: 'from-pink-600 to-rose-700'
  },
  {
    id: 'c-6',
    title: 'Chartered Accountancy & Finance',
    category: 'Commerce & Business',
    tagline: 'Master corporate finance, taxation, auditing, and fintech investment.',
    keySubjects: ['Accountancy', 'Business Studies', 'Mathematics', 'Economics'],
    skillsRequired: ['Attention to Detail', 'Analytical Math', 'Tax Law Understanding', 'Financial Modeling'],
    beginnerSteps: [
      'Choose Commerce or Science with Math in Class 11-12.',
      'Register for CA Foundation through ICAI after Class 10/12.',
      'Explore stock markets and government budgeting.'
    ],
    popularCollegesInOdishaAndIndia: ['ICAI (Institute of Chartered Accountants of India)', 'SRCC Delhi', 'BJB Autonomous College Bhubaneswar', 'St. Xavier’s Kolkata'],
    icon: 'Briefcase',
    color: 'from-sky-600 to-cyan-700'
  }
];
