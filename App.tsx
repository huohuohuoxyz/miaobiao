import React from 'react';
import { useStopwatch } from './hooks/useStopwatch';
import AnalogClock from './components/AnalogClock';
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
    <div className="h-screen w-full bg-black text-white flex flex-col items-center overflow-hidden">
      
      {/* Content Area */}
      <div className="flex-1 w-full max-w-lg flex flex-col relative">
        
        {/* Top Digital Readout (Large) */}
        <div className="pt-16 pb-4 flex flex-col items-center justify-center min-h-[300px]">
           {/* Swipe indicator logic could go here to toggle Analog/Digital, but we'll show Analog by default with digital small underneath or inside */}
           
           <AnalogClock elapsed={elapsed} />
           
           <div className="mt-8 text-5xl font-light tracking-wider font-variant-numeric tabular-nums">
              {formatTime(elapsed)}
           </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center w-full px-8 pb-4">
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

            {/* Page indicator dots (Visual only) */}
            <div className="flex space-x-2 opacity-50">
               <div className="w-2 h-2 rounded-full bg-white"></div>
               <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            </div>

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
        <div className="flex-1 w-full border-t border-gray-900 bg-black z-10">
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