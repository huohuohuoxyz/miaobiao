import React, { useMemo } from 'react';

interface AnalogClockProps {
  elapsed: number;
}

const AnalogClock: React.FC<AnalogClockProps> = ({ elapsed }) => {
  // Constants for sizing
  const size = 320;
  const center = size / 2;
  const radius = size / 2 - 10;
  const tickLengthMajor = 20;
  const tickLengthMinor = 10;

  // Calculate rotations
  const totalSeconds = elapsed / 1000;
  const totalMinutes = totalSeconds / 60;
  
  // Large hand: 60 seconds per rotation
  const secondHandRotation = (totalSeconds % 60) * 6; 
  
  // Small hand: 30 minutes per rotation (standard mechanical stopwatch subdial)
  const minuteHandRotation = (totalMinutes % 30) * (360 / 30); 

  // Generate ticks memoized
  const ticks = useMemo(() => {
    const items = [];
    for (let i = 0; i < 240; i++) {
      // 60 seconds * 4 ticks per second = 240 ticks total
      // Major ticks every 5 seconds (20 ticks)
      // Medium ticks every 1 second (4 ticks)
      const isSecond = i % 4 === 0;
      const isMajor = i % 20 === 0;
      
      const angle = (i * 1.5) * (Math.PI / 180); // 360 degrees / 240 ticks = 1.5 deg per tick
      
      // Rotate starting from -90deg (12 o'clock)
      const adjustedAngle = angle - Math.PI / 2;
      
      const len = isMajor ? tickLengthMajor : (isSecond ? 15 : tickLengthMinor);
      const width = isMajor ? 2.5 : (isSecond ? 1.5 : 1);
      const color = isMajor ? '#ffffff' : (isSecond ? '#a0a0a0' : '#404040');

      const x1 = center + (radius - len) * Math.cos(adjustedAngle);
      const y1 = center + (radius - len) * Math.sin(adjustedAngle);
      const x2 = center + radius * Math.cos(adjustedAngle);
      const y2 = center + radius * Math.sin(adjustedAngle);
      
      // Numbers for major ticks
      let numberElement = null;
      if (isMajor) {
        const numValue = (i / 4); // 0, 5, 10...
        // Push text inward
        const textRadius = radius - 35;
        const tx = center + textRadius * Math.cos(adjustedAngle);
        const ty = center + textRadius * Math.sin(adjustedAngle);
        
        numberElement = (
          <text
            key={`text-${i}`}
            x={tx}
            y={ty}
            fill="white"
            fontSize="24"
            fontWeight="500"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {numValue === 0 ? 60 : numValue}
          </text>
        );
      }

      items.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={width}
        />
      );
      if (numberElement) items.push(numberElement);
    }
    return items;
  }, [center, radius]);

  return (
    <div className="flex justify-center items-center py-4">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Outer Ring Ticks */}
          {ticks}

          {/* Minute Subdial (Top Center) */}
          <g transform={`translate(${center}, ${center - radius * 0.5})`}>
            {/* Subdial Ticks - 30 mins */}
            {Array.from({ length: 30 }).map((_, i) => {
              const angle = (i * (360 / 30) - 90) * (Math.PI / 180);
              const r = 24;
              const x1 = r * Math.cos(angle);
              const y1 = r * Math.sin(angle);
              const x2 = (r - (i % 5 === 0 ? 6 : 3)) * Math.cos(angle);
              const y2 = (r - (i % 5 === 0 ? 6 : 3)) * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 5 === 0 ? "white" : "#666"}
                  strokeWidth={i % 5 === 0 ? 1.5 : 1}
                />
              );
            })}
             {/* Subdial Numbers (5, 10, 15, 20, 25, 30) */}
             {[5, 10, 15, 20, 25, 30].map(n => {
                const angle = (n * (360 / 30) - 90) * (Math.PI / 180);
                const r = 38;
                return (
                    <text
                        key={n}
                        x={r * Math.cos(angle)}
                        y={r * Math.sin(angle)}
                        fill="white"
                        fontSize="10"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >{n}</text>
                )
             })}
            
            {/* Minute Hand */}
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-22}
              stroke="#ff9f0a"
              strokeWidth="2"
              transform={`rotate(${minuteHandRotation})`}
              strokeLinecap="round"
            />
            <circle cx="0" cy="0" r="2" fill="#ff9f0a" />
          </g>

          {/* Second Hand (Main) */}
          <g transform={`translate(${center}, ${center}) rotate(${secondHandRotation})`}>
            {/* Counterweight */}
            <line x1="0" y1="0" x2="0" y2="25" stroke="#ff9f0a" strokeWidth="2" strokeLinecap="round" />
            {/* Main Hand */}
            <line x1="0" y1="0" x2="0" y2={-radius + 5} stroke="#ff9f0a" strokeWidth="2" />
            {/* Center Pivot hole */}
            <circle cx="0" cy="0" r="4" fill="#000" stroke="#ff9f0a" strokeWidth="2" />
          </g>
        </svg>

        {/* Digital Overlay (Optional, iOS usually keeps them separate pages, but we can hybridize or just show analog) */}
        {/* We will leave it pure analog visual here as requested, the text is shown below in the layout */}
      </div>
    </div>
  );
};

export default AnalogClock;