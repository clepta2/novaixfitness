import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

type AssessmentPhase = 'intro' | 'testing' | 'complete';
type TestMetric = 'seconds' | 'reps';

interface AssessmentTest {
  id: string;
  title: string;
  description: string;
  instruction: string;
  metric: TestMetric;
  unit: string;
}

interface PreviousResults {
  id: string;
  user_id: string;
  created_at: string;
  [key: string]: unknown;
}

interface UseGuidedAssessmentReturn {
  phase: AssessmentPhase;
  test: AssessmentTest;
  currentTest: number;
  results: Record<string, number>;
  isRunning: boolean;
  elapsed: number;
  inputValue: string;
  setInputValue: (val: string) => void;
  prevResults: PreviousResults | null;
  formatTime: (s: number) => string;
  handleStart: () => void;
  handleStop: () => void;
  handleNext: () => void;
  totalTests: number;
}

const TESTS: AssessmentTest[] = [
  { id: 'plank', title: 'PRANCHA', description: 'Segure a posição máxima', instruction: 'Corpo reto, cotovelos apoiados', metric: 'seconds', unit: 'seg' },
  { id: 'pushups', title: 'FLEXÕES', description: 'Máximo de flexões', instruction: 'Corpo reto, desça até o peito', metric: 'reps', unit: 'reps' },
  { id: 'squat_hold', title: 'AGACHAMENTO', description: 'Fique agachado o máximo', instruction: 'Joelhos na direção dos pés', metric: 'seconds', unit: 'seg' },
  { id: 'situps', title: 'ABDOMINAIS', description: 'Máximo em 1 minuto', instruction: 'Costas no chão, toque os pés', metric: 'reps', unit: 'reps' },
];

export function useGuidedAssessment(): UseGuidedAssessmentReturn {
  const router = useRouter();
  const { user } = useAuth();
  const [phase, setPhase] = useState<AssessmentPhase>('intro');
  const [currentTest, setCurrentTest] = useState<number>(0);
  const [results, setResults] = useState<Record<string, number>>({});
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [prevResults, setPrevResults] = useState<PreviousResults | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const test: AssessmentTest = TESTS[currentTest];

  useEffect(() => { loadPrevious(); }, [user?.id]);
  useEffect(() => {
    if (isRunning) timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
    else if (timerRef.current) clearInterval(timerRef.current);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  const loadPrevious = useCallback(async (): Promise<void> => {
    if (!user?.id) return;
    const { data } = await supabase.from('fitness_assessments')
      .select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(1).single();
    if (data) setPrevResults(data as PreviousResults);
  }, [user?.id]);

  const formatTime = (s: number): string => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const handleStart = (): void => { setIsRunning(true); setElapsed(0); };
  const handleStop = (): void => { setIsRunning(false); setResults({ ...results, [test.id]: elapsed }); };

  const handleNext = useCallback((): void => {
    if (test.metric === 'reps' && inputValue) {
      setResults({ ...results, [test.id]: parseInt(inputValue) || 0 });
    }
    if (currentTest < TESTS.length - 1) {
      setCurrentTest(currentTest + 1);
      setElapsed(0);
      setInputValue('');
    } else saveResults();
  }, [test, inputValue, currentTest, results]);

  const saveResults = useCallback(async (): Promise<void> => {
    if (!user?.id) return;
    await supabase.from('fitness_assessments').insert({
      user_id: user.id,
      pushups_result: String(results.pushups || 0),
      squat_result: String(results.squat_hold || 0),
      plank_result: String(results.plank || 0),
      overall_score: Object.values(results).reduce((s, v) => s + v, 0),
    });
    setPhase('complete');
  }, [user?.id, results]);

  return {
    phase, test, currentTest, results, isRunning,
    elapsed, inputValue, setInputValue, prevResults,
    formatTime, handleStart, handleStop, handleNext,
    totalTests: TESTS.length,
  };
}
