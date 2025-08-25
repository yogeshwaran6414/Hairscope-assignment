import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./LabPage.css";
function formatTime(ms) {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function LabPage({ onExit }) {
  const [timeRemainingMs, setTimeRemainingMs] = useState(0);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    // Fetch initial remaining time
    const fetchTime = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/time-remaining");
        setTimeRemainingMs(res.data.timeRemainingMs);
        if (res.data.timeRemainingMs === 0) {
          setError("Session time expired. Access denied.");
          onExit(0);
        }
      } catch {
        setError("Failed to fetch remaining time.");
      }
    };
    fetchTime();

    // Poll every second
    intervalRef.current = setInterval(async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/time-remaining");
        if (res.data.timeRemainingMs === 0) {
          clearInterval(intervalRef.current);
          setTimeRemainingMs(0);
          setError("Session time expired. Access denied.");
          onExit(0);
        } else {
          setTimeRemainingMs(res.data.timeRemainingMs);
        }
      } catch {
        clearInterval(intervalRef.current);
        setError("Failed to fetch remaining time.");
      }
    }, 1000);

    // Cleanup
    return () => clearInterval(intervalRef.current);
  }, [onExit]);

  const handleExitClick = async () => {
    try {
      await axios.post("http://localhost:5000/api/exit");
      if (intervalRef.current) clearInterval(intervalRef.current);
      onExit(timeRemainingMs);
    } catch {
      setError("Failed to exit. Try again.");
    }
  };

  return (
    <div className="lab-page">
      <h2>Welcome to the Lab</h2>
      <div className="lab-timer">Remaining Time: {formatTime(timeRemainingMs)}</div>
      <button className="lab-exit-btn" onClick={handleExitClick} disabled={timeRemainingMs <= 0}>
        Exit Lab
      </button>
      {error && <div className="lab-error">{error}</div>}
    </div>
  );
}
