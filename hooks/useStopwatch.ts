import { useState, useRef, useEffect, useCallback } from 'react';
import { StopwatchState, Lap } from '../types';

const STORAGE_KEY = 'stopwatch_data_v1';

interface StoredData {
  state: StopwatchState;
  startTime: number;
  accumulatedTime: number;
  laps: Lap[];
}

export const useStopwatch = () => {
  const [state, setState] = useState<StopwatchState>(StopwatchState.IDLE);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  
  // Refs for precise timing loop and storage
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  // Helper to save state to localStorage
  const persistState = useCallback((
    newState: StopwatchState, 
    newLaps: Lap[], 
    sTime: number, 
    accTime: number
  ) => {
    const data: StoredData = {
      state: newState,
      startTime: sTime,
      accumulatedTime: accTime,
      laps: newLaps
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save stopwatch data", e);
    }
  }, []);

  const animate = useCallback((timestamp: number) => {
    // Current time minus start time plus any time accumulated from previous runs
    const currentTime = Date.now();
    const currentElapsed = currentTime - startTimeRef.current + accumulatedTimeRef.current;
    
    setElapsed(currentElapsed);
    requestRef.current = requestAnimationFrame(() => animate(Date.now()));
  }, []);

  // Initialize from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data: StoredData = JSON.parse(saved);
        
        // Restore Refs
        startTimeRef.current = data.startTime;
        accumulatedTimeRef.current = data.accumulatedTime;
        
        // Restore State
        setLaps(data.laps);
        setState(data.state);

        if (data.state === StopwatchState.RUNNING) {
          // If it was running, it should continue "running" from the original start time
          // effectively catching up to the current time immediately
          requestRef.current = requestAnimationFrame(() => animate(Date.now()));
        } else {
          // If paused, just restore the display to the accumulated time
          setElapsed(data.accumulatedTime);
        }
      } catch (e) {
        console.error("Failed to parse saved stopwatch data", e);
        // Fallback to reset if data is corrupt
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [animate]);

  const start = useCallback(() => {
    setState(StopwatchState.RUNNING);
    startTimeRef.current = Date.now();
    
    // Save immediate state
    persistState(
      StopwatchState.RUNNING, 
      laps, 
      startTimeRef.current, 
      accumulatedTimeRef.current
    );

    requestRef.current = requestAnimationFrame(() => animate(Date.now()));
  }, [animate, laps, persistState]);

  const stop = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    // Calculate final accumulated time
    const now = Date.now();
    const sessionDuration = now - startTimeRef.current;
    accumulatedTimeRef.current += sessionDuration;
    
    // Update elapsed to ensure it matches exactly what we stored
    setElapsed(accumulatedTimeRef.current);
    setState(StopwatchState.PAUSED);

    // Persist
    persistState(
      StopwatchState.PAUSED, 
      laps, 
      0, // Start time doesn't matter when paused
      accumulatedTimeRef.current
    );
  }, [laps, persistState]);

  const reset = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
    setElapsed(0);
    setLaps([]);
    setState(StopwatchState.IDLE);
    
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const lap = useCallback(() => {
    setLaps(prevLaps => {
      // We need to calculate elapsed here manually because state update might be slightly async
      // or we want to use the exact refs for consistency
      let currentTotal = 0;
      if (state === StopwatchState.RUNNING) {
          currentTotal = (Date.now() - startTimeRef.current) + accumulatedTimeRef.current;
      } else {
          currentTotal = accumulatedTimeRef.current;
      }

      const lastLapEndTime = prevLaps.length > 0 ? prevLaps[0].endTime : 0;
      const splitDuration = currentTotal - lastLapEndTime;

      const newLap: Lap = {
        id: Date.now(),
        lapIndex: prevLaps.length + 1,
        endTime: currentTotal,
        splitTime: splitDuration
      };

      const newLapsList = [newLap, ...prevLaps];
      
      // Persist with the new laps
      persistState(
        state, 
        newLapsList, 
        startTimeRef.current, 
        accumulatedTimeRef.current
      );

      return newLapsList;
    });
  }, [state, persistState]);

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