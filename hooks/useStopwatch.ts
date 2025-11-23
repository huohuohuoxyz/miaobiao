import { useState, useRef, useEffect, useCallback } from 'react';
import { StopwatchState, Lap } from '../types';

export const useStopwatch = () => {
  const [state, setState] = useState<StopwatchState>(StopwatchState.IDLE);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  
  // Refs for precise timing loop
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    // Current time minus start time plus any time accumulated from previous runs
    const currentTime = Date.now();
    const currentElapsed = currentTime - startTimeRef.current + accumulatedTimeRef.current;
    
    setElapsed(currentElapsed);
    requestRef.current = requestAnimationFrame(() => animate(Date.now()));
  }, []);

  const start = useCallback(() => {
    setState(StopwatchState.RUNNING);
    startTimeRef.current = Date.now();
    requestRef.current = requestAnimationFrame(() => animate(Date.now()));
  }, [animate]);

  const stop = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    // Save the time elapsed so far
    accumulatedTimeRef.current += Date.now() - startTimeRef.current;
    setState(StopwatchState.PAUSED);
  }, []);

  const reset = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
    setElapsed(0);
    setLaps([]);
    setState(StopwatchState.IDLE);
  }, []);

  const lap = useCallback(() => {
    setLaps(prevLaps => {
      const currentTotal = elapsed;
      // If it's the first lap, split is the total. 
      // Otherwise, split is total - sum of previous laps (or just previous lap's end time)
      const lastLapEndTime = prevLaps.length > 0 ? prevLaps[0].endTime : 0;
      const splitDuration = currentTotal - lastLapEndTime;

      const newLap: Lap = {
        id: Date.now(),
        lapIndex: prevLaps.length + 1,
        endTime: currentTotal,
        splitTime: splitDuration
      };

      return [newLap, ...prevLaps];
    });
  }, [elapsed]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return {
    state,
    elapsed,
    laps,
    start,
    stop,
    reset,
    lap
  };
};