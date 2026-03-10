export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string | null;
  mobileNumber: string;
  countryCode: string;
  isMobileVerified: boolean;
  learningPurpose?: string | null;
  onboardingCompleted?: boolean;
  subscriptionPlanId?: number;
  createdAt?: string;
  updatedAt?: string;
  subscriptionPlan?: SubscriptionPlan | null;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface OtpPayload {
  mobileNumber: string;
  expiresAt: string;
  otp?: string;
}

export interface OnboardingQuestion {
  questionKey: string;
  questionText: string;
}

export interface OnboardingAnswer {
  id: number;
  questionKey: string;
  questionText: string;
  answerText: string;
  createdAt: string;
}

export interface DailyVocabularyWord {
  word: string;
  meaningEn: string;
  meaningHi: string;
  example: string;
}

export interface DailyVocabularyPayload {
  dayNumber: number;
  totalDays: number;
  wordsPerDay: number;
  level: 'Simple' | 'Intermediate' | 'Advanced';
  date: string;
  words: DailyVocabularyWord[];
}

export interface GrammarLesson {
  title: string;
  explanation: string;
  formula?: string | null;
  examples: string[];
}

export interface GrammarLessonPayload {
  dayNumber: number;
  totalDays: number;
  level: 'Simple' | 'Intermediate' | 'Advanced';
  lesson: GrammarLesson;
}

export interface CommonSentence {
  sentence: string;
  meaningHi: string;
  usageTip?: string | null;
}

export interface CommonSentencesPayload {
  dayNumber: number;
  totalDays: number;
  sentencesPerDay: number;
  level: 'Simple' | 'Intermediate' | 'Advanced';
  date: string;
  sentences: CommonSentence[];
}

export interface ConversationScriptLine {
  speaker: string;
  text: string;
}

export interface ConversationScript {
  title: string;
  context: string;
  lines: ConversationScriptLine[];
}

export interface ConversationScriptPayload {
  dayNumber: number;
  totalDays: number;
  level: 'Simple' | 'Intermediate' | 'Advanced';
  script: ConversationScript;
}

export interface PronunciationTip {
  title: string;
  guide: string;
  example: string;
}

export interface PronunciationTipsPayload {
  dayNumber: number;
  totalDays: number;
  tipsPerDay: number;
  level: 'Simple' | 'Intermediate' | 'Advanced';
  date: string;
  tips: PronunciationTip[];
}

export interface EnglishLearningTip {
  title: string;
  description: string;
  actionStep?: string | null;
}

export interface EnglishLearningTipsPayload {
  dayNumber: number;
  totalDays: number;
  tipsPerDay: number;
  level: 'Simple' | 'Intermediate' | 'Advanced';
  date: string;
  tips: EnglishLearningTip[];
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  priceInr: string;
  billingCycle: string;
  benefitSummary: string;
  featureList: string[];
  isHighlighted: boolean;
}

export interface MentorResponse {
  correction: string;
  explanation: string;
  nextQuestion: string;
}

export interface ConversationStartPayload {
  sessionId: number;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  message: string;
  createdAt?: string;
}

export interface ConversationSendPayload {
  sessionId: number;
  assistantMessage: string;
}

export interface SpeechToTextPayload {
  text: string;
}

export interface TextToSpeechPayload {
  audioUrl: string;
}
