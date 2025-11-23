import React, { useMemo } from 'react';
import { Lap } from '../types';
import { formatTime } from '../utils';

interface LapListProps {
  laps: Lap[];
  currentRunningLapTime: number; // The time of the current lap being run
  isRunning: boolean;
}

const LapList: React.FC<LapListProps> = ({ laps, currentRunningLapTime, isRunning }) => {
  
  // Calculate best and worst split times for coloring
  const { minSplit, maxSplit } = useMemo(() => {
    if (laps.length < 2) return { minSplit: Infinity, maxSplit: -Infinity };
    let min = Infinity;
    let max = -Infinity;
    
    // We only compare completed laps, usually standard iOS behavior compares all static laps in the list
    laps.forEach(l => {
        if (l.splitTime < min) min = l.splitTime;
        if (l.splitTime > max) max = l.splitTime;
    });
    return { minSplit: min, maxSplit: max };
  }, [laps]);

  // The "Lap 1" or "Lap X" currently running (phantom lap)
  const currentLapIndex = laps.length + 1;

  return (
    <div className="flex-1 overflow-y-auto w-full max-w-md mx-auto px-4 mt-4 pb-24">
      <table className="w-full text-lg">
        <tbody>
          {/* Current Live Lap (Phantom Row) */}
           <tr className="border-b border-gray-800 text-white">
              <td className="py-3 pl-2">计次 {currentLapIndex}</td>
              <td className="py-3 pr-2 text-right font-monospaced tabular-nums tracking-wide">
                  {formatTime(currentRunningLapTime)}
              </td>
            </tr>

          {/* Recorded Laps */}
          {laps.map((lap) => {
            const isBest = laps.length >= 2 && lap.splitTime === minSplit;
            const isWorst = laps.length >= 2 && lap.splitTime === maxSplit;
            
            return (
              <tr key={lap.id} className="border-b border-gray-800 text-white last:border-0">
                <td className={`py-3 pl-2 ${isBest ? 'text-green-500' : ''} ${isWorst ? 'text-red-500' : ''}`}>
                  计次 {lap.lapIndex}
                </td>
                <td className={`py-3 pr-2 text-right font-monospaced tabular-nums tracking-wide ${isBest ? 'text-green-500' : ''} ${isWorst ? 'text-red-500' : ''}`}>
                  {formatTime(lap.splitTime)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LapList;