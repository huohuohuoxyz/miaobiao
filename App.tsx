import React from 'react';
import { useStopwatch } from './hooks/useStopwatch';
import LapList from './components/LapList';
import { StopwatchState } from './types';
import { formatTime } from './utils';

const App: React.FC = () => {
  const { state, elapsed, laps, start, stop, reset, lap } = useStopwatch();

  // Calculate the current "live" lap duration for display in the table header
  const lastLapEndTime = laps.length > 0 ? laps[0].endTime : 0;
  const currentLapDuration = elapsed - lastLapEndTime;

  const isRunning = state === StopwatchState.RUNNING;
  const isPaused = state === StopwatchState.PAUSED;
  const isIdle = state === StopwatchState.IDLE;

  return (
    <div className="fixed inset-0 w-full bg-black text-white flex flex-col items-center overflow-hidden">
      
      {/* Content Area */}
      <div className="flex-1 w-full max-w-lg flex flex-col relative overflow-hidden">
        
        {/* Top Digital Readout (Large) */}
        <div className="flex-1 max-h-[40vh] min-h-[200px] flex flex-col items-center justify-center shrink-0">
           <div className="text-7xl font-thin tracking-tight font-variant-numeric tabular-nums">
              {formatTime(elapsed)}
           </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center w-full px-8 pb-8 shrink-0">
            {/* Left Button (Lap / Reset) */}
            <button
              onClick={isRunning ? lap : reset}
              disabled={isIdle}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center text-lg transition-all active:opacity-70
                ${isIdle ? 'bg-gray-900 text-gray-500' : 'bg-gray-800 text-white'}
              `}
            >
               {isRunning ? '计次' : '复位'}
            </button>

            {/* Right Button (Start / Stop) */}
            <button
              onClick={isRunning ? stop : start}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center text-lg transition-all active:opacity-70
                ${isRunning 
                    ? 'bg-red-900/30 text-red-500 border border-red-900/50' 
                    : 'bg-green-900/30 text-green-500 border border-green-900/50'
                }
              `}
              style={{
                  backgroundColor: isRunning ? 'rgba(50, 0, 0, 1)' : 'rgba(0, 50, 0, 1)',
                  color: isRunning ? '#ff453a' : '#30d158'
              }}
            >
              {isRunning ? '停止' : '启动'}
            </button>
        </div>

        {/* Lap List */}
        <div className="flex-1 w-full border-t border-gray-900 bg-black z-10 flex flex-col min-h-0 relative">
            <LapList 
                laps={laps} 
                currentRunningLapTime={currentLapDuration} 
                isRunning={isRunning}
            />
        </div>

      </div>
    </div>
  );
};

export default App;