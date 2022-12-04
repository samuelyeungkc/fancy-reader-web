export const getDisplayTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const displaySecondsWithMillis = seconds - minutes * 60;
  const displaySecondsWithMillisPadded = displaySecondsWithMillis < 10 ? `0${displaySecondsWithMillis}` : `${displaySecondsWithMillis}`;
  const displaySeconds = displaySecondsWithMillisPadded.split('.')[0];
  return `${minutes}:${displaySeconds}`;
};
