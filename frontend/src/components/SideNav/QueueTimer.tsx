import { useState, useEffect } from 'react'

export default function QueueTimer({ queueStartedAt }: { queueStartedAt: number}) {
  const [timer, setTimer] = useState<string>("0:00")

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedMs = Date.now() - queueStartedAt

      setTimer(formatTime(elapsedMs))
    }, 1000)

    return () => { clearInterval(interval) }
  }, [])

  return timer

}
