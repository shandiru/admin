import { useEffect, useState } from "react";

export default function Timer({ expireTime, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(Math.floor((expireTime - Date.now())/1000));

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>;
}