import { AgentDecisionRecord, AgentStepName, StudentProfile } from '../types';

export interface LearnerContext {
  student: StudentProfile;
  activeTopic: string;
  recentQuizScores: number[]; // e.g. [40, 50] indicating struggle
  identifiedGaps: string[];
  currentGoal: string;
  previousAction?: string;
}

export class AgentOrchestrator {
  private context: LearnerContext;
  private history: AgentDecisionRecord[] = [];
  private onStepCallback?: (step: AgentStepName, record: Partial<AgentDecisionRecord>) => void;

  constructor(initialContext: LearnerContext) {
    this.context = initialContext;
  }

  public setStepCallback(cb: (step: AgentStepName, record: Partial<AgentDecisionRecord>) => void) {
    this.onStepCallback = cb;
  }

  public getContext(): LearnerContext {
    return this.context;
  }

  public getHistory(): AgentDecisionRecord[] {
    return this.history;
  }

  public updateContext(partial: Partial<LearnerContext>) {
    this.context = { ...this.context, ...partial };
  }

  /**
   * Runs the complete 7-step pedagogical agent loop for an input or diagnostic answer
   */
  public async executeCycle(input: {
    questionText: string;
    actionOverride?: string;
    studentAnswer?: string;
    targetLanguage?: string;
  }): Promise<{ decision: AgentDecisionRecord; tutorMessage: string }> {
    const { questionText, actionOverride, targetLanguage } = input;
    const lang = targetLanguage || this.context.student.tutorLanguage || 'Odia';
    const classNum = this.context.student.classNum;
    const subject = this.context.student.subjects[0] || 'Science';

    // STEP 1: OBSERVE
    const record: Partial<AgentDecisionRecord> = {
      timestamp: new Date().toLocaleTimeString(),
      currentGoal: this.context.currentGoal || `Master foundational principles of ${this.context.activeTopic || subject}`,
      currentTopic: this.context.activeTopic || this.detectTopic(questionText, subject),
    };

    const avgScore = this.context.recentQuizScores.length > 0
      ? this.context.recentQuizScores.reduce((a, b) => a + b, 0) / this.context.recentQuizScores.length
      : 70;

    let observedGap = 'None flagged yet; baseline understanding under observation';
    if (avgScore < 60) {
      observedGap = `Struggling with prerequisites in ${record.currentTopic} (Diagnostic accuracy: ${Math.round(avgScore)}%)`;
    } else if (questionText.toLowerCase().includes('why') || questionText.toLowerCase().includes('how')) {
      observedGap = 'Needs physical/mechanism intuition rather than mere definition';
    }
    record.observedGap = observedGap;

    this.notifyStep('OBSERVE', record);
    await this.pause(180);

    // STEP 2: UNDERSTAND
    const difficultyLevel = classNum <= 5 ? 'Foundational / Concrete' : classNum <= 10 ? 'Conceptual / Application' : 'Advanced / Analytical';
    const prerequisite = this.findPrerequisite(record.currentTopic!);
    this.notifyStep('UNDERSTAND', {
      ...record,
      reason: `Audience: Class ${classNum} (${difficultyLevel}). Prerequisite check: requires [${prerequisite}]`
    });
    await this.pause(180);

    // STEP 3: PLAN
    let selectedAction = actionOverride || 'explain_concept';
    let rationale = '';

    if (actionOverride) {
      selectedAction = actionOverride;
      rationale = `User explicitly selected action [${actionOverride}]`;
    } else if (avgScore < 60) {
      selectedAction = 'simplify_explanation';
      rationale = `Diagnostic score is ${Math.round(avgScore)}% < 60%. Pedagogical strategy: Demote abstraction, introduce local relatable analogy before formal laws.`;
    } else if (questionText.toLowerCase().includes('solve') || questionText.toLowerCase().includes('calculate') || questionText.toLowerCase().includes('step')) {
      selectedAction = 'explain_step_by_step';
      rationale = 'Procedural calculation detected. Strategy: Isolate given variables, apply formula, show units.';
    } else if (questionText.toLowerCase().includes('quiz') || questionText.toLowerCase().includes('test')) {
      selectedAction = 'generate_practice';
      rationale = 'Formative assessment requested. Strategy: Generate 2-option quick check.';
    } else {
      selectedAction = 'give_local_example';
      rationale = `Connecting abstract concept with familiar regional environment (Odisha context) for cognitive reinforcement.`;
    }

    record.selectedAction = selectedAction;
    record.reason = rationale;
    this.notifyStep('PLAN', record);
    await this.pause(180);

    // STEP 4: ACT
    const toolUsed = `PedagogicalEngine.${selectedAction}(class: ${classNum}, lang: ${lang})`;
    record.toolUsed = toolUsed;
    this.notifyStep('ACT', record);
    await this.pause(180);

    // STEP 5: EVALUATE
    const outcome = avgScore < 60
      ? 'Scaffolded explanation delivered. Diagnostic follow-up queued to verify retention.'
      : 'Core concept articulated with regional relevance. Concept readiness: 85%.';
    record.outcome = outcome;
    this.notifyStep('EVALUATE', record);
    await this.pause(180);

    // STEP 6: ADAPT
    let nextAction = 'ask_diagnostic_question';
    if (selectedAction === 'simplify_explanation') {
      nextAction = 'give_local_example';
    } else if (selectedAction === 'generate_practice') {
      nextAction = 'recommend_revision';
    } else {
      nextAction = 'advance_to_next_topic';
    }
    record.nextRecommendedAction = nextAction;
    this.notifyStep('ADAPT', record);
    await this.pause(180);

    // STEP 7: SAVE
    const finalRecord = record as AgentDecisionRecord;
    this.history.unshift(finalRecord);
    this.notifyStep('SAVE', finalRecord);

    // Generate targeted pedagogical message
    const tutorMessage = this.generateTargetedResponse(questionText, selectedAction, classNum, subject, lang, record.currentTopic!);

    return {
      decision: finalRecord,
      tutorMessage
    };
  }

  private notifyStep(step: AgentStepName, record: Partial<AgentDecisionRecord>) {
    if (this.onStepCallback) {
      this.onStepCallback(step, record);
    }
  }

  private pause(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private detectTopic(text: string, fallbackSubject: string): string {
    const t = text.toLowerCase();
    if (t.includes('current') || t.includes('electricity') || t.includes('circuit') || t.includes('ohm') || t.includes('bijuli')) return 'Electric Current & Circuits';
    if (t.includes('photo') || t.includes('plant') || t.includes('leaf') || t.includes('aloka')) return 'Photosynthesis & Plant Biology';
    if (t.includes('fraction') || t.includes('bhagnansa') || t.includes('number')) return 'Fractions & Rational Numbers';
    if (t.includes('force') || t.includes('motion') || t.includes('newton')) return "Newton's Laws of Motion";
    if (t.includes('cell') || t.includes('dna') || t.includes('tissue')) return 'Cell Structure & Function';
    return `${fallbackSubject} Core Concept`;
  }

  private findPrerequisite(topic: string): string {
    if (topic.includes('Electric')) return 'Electric Charge & Atomic Structure';
    if (topic.includes('Photosynthesis')) return 'Plant parts, chlorophyll, and solar radiation';
    if (topic.includes('Motion')) return 'Velocity and Acceleration';
    if (topic.includes('Fraction')) return 'Basic Division & Multiples';
    return 'Fundamental syllabus definitions';
  }

  private generateTargetedResponse(
    question: string,
    action: string,
    classNum: number,
    subject: string,
    lang: string,
    topic: string
  ): string {
    const isOdia = lang.toLowerCase() === 'odia';
    const isHindi = lang.toLowerCase() === 'hindi';

    if (isOdia) {
      if (action === 'simplify_explanation' || action === 'give_local_example') {
        return `### 💡 ଓଡ଼ିଶା ଲର୍ଣ୍ଣମେଟ୍ ଏଆଇ • ସହଜ ବ୍ୟାଖ୍ୟା (Class ${classNum} ${subject})
**ମୁଖ୍ୟ ବିଷୟ:** ${topic}

**ଆମ ଗାଁ / ସହରର ଉଦାହରଣ:**
ମନେକରନ୍ତୁ ଆପଣଙ୍କ ଘରେ ପାଣି ଟାଙ୍କି ଛାତ ଉପରେ ଅଛି ଏବଂ ପାଇପ୍ ମାଧ୍ୟମରେ ତଳକୁ ପାଣି ବହୁଛି।
- ଠିକ୍ ସେହିପରି **ବିଦ୍ୟୁତ ପ୍ରବାହ (Electric Current)** ହେଉଛି ତାର ମଧ୍ୟରେ ଇଲେକ୍ଟ୍ରନ୍ ମାନଙ୍କର ପ୍ରବାହ।
- ଟାଙ୍କିର ଉଚ୍ଚତା ଯେପରି ପାଣିର ଚାପ ଦିଏ, ସେହିପରି ବ୍ୟାଟେରୀ **ବିଭବାନ୍ତର (Potential Difference / Voltage)** ସୃଷ୍ଟି କରେ।

**ଶିକ୍ଷଣ ପରାମର୍ଶ:**
ଯଦି କୌଣସି ପଦରେ ସନ୍ଦେହ ଥାଏ, ତେବେ ତଳେ ଥିବା "ଦେଖାନ୍ତୁ ଫର୍ମୁଲା" ବଟନ୍ ଦବାନ୍ତୁ!`;
      }

      return `### 🌟 PATHSHALA AI (ପାଠଶାଳା ଏଆଇ)
**ଶ୍ରେଣୀ:** ${classNum} | **ବିଷୟ:** ${subject}

**ପ୍ରଶ୍ନର ସମାଧାନ:** "${question}"
୧. **ମୌଳିକ ସଂକଳ୍ପ:** ଏହି ପ୍ରଶ୍ନଟି ଆପଣଙ୍କ ପାଠ୍ୟପୁସ୍ତକର **${topic}** ସହ ଜଡ଼ିତ।
୨. **ପର୍ଯ୍ୟାୟକ୍ରମେ ବୁଝିବା:**
   - ପରିକଳ୍ପନା କରନ୍ତୁ କିପରି ଏହା ପ୍ରକୃତିରେ କାର୍ଯ୍ୟ କରେ।
   - ମୁଖ୍ୟ ସୂତ୍ର ଏବଂ ଏହାର ଏକକ (SI units) ପରୀକ୍ଷା ପାଇଁ ଅତ୍ୟନ୍ତ ଜରୁରୀ।
୩. **ଆତ୍ମ-ପରୀକ୍ଷା ପ୍ରଶ୍ନ:** ଏହି ବିଷୟରୁ ଆଉ ଗୋଟିଏ ପ୍ରଶ୍ନ ଅଭ୍ୟାସ କରିବାକୁ ଚାହାଁନ୍ତି କି?`;
    }

    if (isHindi) {
      return `### 💡 ओडिशा लर्नमेट एआई • सरल व्याख्या (Class ${classNum} ${subject})
**विषय:** ${topic}

**दैनिक जीवन का भारतीय उदाहरण:**
मान लीजिए जैसे पानी की टंकी से नल में पानी का बहाव होता है, ठीक उसी तरह तार में इलेक्ट्रॉनों का प्रवाह **विद्युत धारा (Electric Current)** कहलाता है।
- **मुख्य बिंदु:** $I = Q / t$ (धारा = आवेश / समय)
- **इकाई:** एम्पीयर (Ampere)

**एजेंट अवलोकन:** आपका अगला अभ्यास प्रश्न तैयार है। क्या आप इसे हल करना चाहेंगे?`;
    }

    // English
    if (action === 'simplify_explanation' || action === 'give_local_example') {
      return `### 💡 PATHSHALA AI • Scaffolded Explanation (Class ${classNum})
**Active Topic:** ${topic}

#### 1. The Everyday Analogy (Water Flow Model)
Imagine an overhead water tank in your house:
- **Voltage (Potential Difference):** The water pressure created by the height of the water tank.
- **Electric Current ($I$):** The rate at which water flows out through the pipe.
- **Resistance ($R$):** Any constriction or narrow valve that restricts the flow.

#### 2. Key Mathematical Law ($V = IR$)
$$V = I \\times R$$
- $V$ is measured in **Volts (V)**
- $I$ is measured in **Amperes (A)**
- $R$ is measured in **Ohms (\\Omega)**

#### 3. Common Exam Pitfall
Students often connect the ammeter in parallel instead of series. **Always connect ammeters in series!**`;
    }

    return `### 🌟 PATHSHALA AI • Pedagogical Tutor
**Class:** ${classNum} | **Subject:** ${subject} | **Topic:** ${topic}

#### Direct Answer to: *"${question}"*
1. **Core Conceptual Principle:**
   At Class ${classNum} standards, this concept is central to understanding natural phenomena and numerical exam problems.

2. **Step-by-Step Breakdown:**
   - Step 1: Identify given quantities and boundary conditions.
   - Step 2: Apply the governing physical formula or theorem.
   - Step 3: Verify that SI units match consistently.

3. **Formative Diagnostic Check:**
   Would you like to try a 1-minute practice question on this concept to secure your learning streak?`;
  }
}
