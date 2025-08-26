import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaReact, FaAngular, FaNodeJs, FaHtml5, FaPython, FaPhp
} from "react-icons/fa";
import { SiCplusplus, SiTailwindcss, SiTensorflow, SiGraphql, SiJavascript,SiNextdotjs } from "react-icons/si";

import "./LabPage.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function formatTime(ms) {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const techs = [
  { name: "React", icon: FaReact, color: "#38bdf8" },
  { name: "Angular", icon: FaAngular, color: "#ef4444" },
  { name: "Python", icon: FaPython, color: "#facc15" },
  { name: "Node.js", icon: FaNodeJs, color: "#22c55e" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#14b8a6" },
  { name: "PHP", icon: FaPhp, color: "#6366f1" },
  { name: "TensorFlow", icon: SiTensorflow, color: "#f97316" },
  { name: "C++", icon: SiCplusplus, color: "#0ea5e9" },
  { name: "GraphQL", icon: SiGraphql, color: "#e879f9" },
  { name: "HTML5", icon: FaHtml5, color: "#f97316" },
  { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },  
  { name: "Next.js", icon: SiNextdotjs, color: "#000000" }
];

export default function LabPage({ onExit }) {
  const [timeRemainingMs, setTimeRemainingMs] = useState(0);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    // Fetch initial remaining time
    const fetchTime = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/time-remaining`);
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
        const res = await axios.get(`${backendUrl}/api/time-remaining`);
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
      await axios.post(`${backendUrl}/api/exit`);
      if (intervalRef.current) clearInterval(intervalRef.current);
      onExit(timeRemainingMs);
    } catch {
      setError("Failed to exit. Try again.");
    }
  };

  return (
    <div className="lab-dashboard-bg">
      <div className="lab-dashboard-container">
        {/* Left Controls */}
        <div className="dashboard-left-controls">
          <div className="control-panel">
            <select className="control-dropdown neon-control">
              <option>Exercises</option>
              <option>Projects</option>
              <option>Time Spent</option>
            </select>
            <div className="control-arrows">
              <button className="neon-btn">{'←'}</button>
              <button className="neon-btn">{'→'}</button>
            </div>
            <button className="neon-enter-btn">Enter Lab</button>
          </div>
          <div className="timer-panel">
            <h2 className="neon-timer-title">Welcome to the Lab</h2>
            <span className="neon-timer">Remaining Time: {formatTime(timeRemainingMs)}</span>
            <button className="lab-exit-btn neon-exit-btn"
              onClick={handleExitClick}
              disabled={timeRemainingMs <= 0}
            >
              Exit Lab
            </button>
            {error && <div className="lab-error">{error}</div>}
          </div>
        </div>
        {/* Tech Icon Grid */}
        <div className="dashboard-grid">
          {techs.map(({ name, icon: Icon, color }, i) => (
            <div className="tech-grid-item" key={name}>
              <Icon
                className="tech-icon"
                style={{
                  color,
                  transition: "transform 0.3s, box-shadow 0.3s, filter 0.3s"
                }}
                onMouseEnter={e => {
                  e.target.style.filter = `drop-shadow(0 0 16px ${color})`;
                  e.target.style.transform = "scale(1.16)";
                }}
                onMouseLeave={e => {
                  e.target.style.filter = "";
                  e.target.style.transform = "";
                }}
              />
              <span className="tech-label" style={{ color }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}






/*
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./LabPage.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
        const res = await axios.get(`${backendUrl}/api/time-remaining`);
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
        const res = await axios.get(`${backendUrl}/api/time-remaining`);
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
      await axios.post(`${backendUrl}/api/exit`);
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

*/