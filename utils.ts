/**
 * Formats milliseconds into MM:SS.cc or HH:MM:SS.cc if > 1 hour
 */
export const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
};

/**
 * Formats just the minutes and seconds (and hours if needed)
 */
export const formatMinSec = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Formats just the milliseconds part (hundredths)
 */
export const formatCenti = (ms: number): string => {
  const centiseconds = Math.floor((ms % 1000) / 10);
  return centiseconds.toString().padStart(2, '0');
};