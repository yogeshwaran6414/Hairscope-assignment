
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LabPage from "./LabPage";
import "./LoginPage.css";

const FingerprintIcon = ({ glow }) => (
  <div className={`fingerprint-icon${glow ? " glow" : ""}`}>
    <svg width="58" height="58" viewBox="0 0 58 58">
      <g fill="none" stroke="#7ee9f7" strokeWidth="2">
        <ellipse cx="29" cy="29" rx="24" ry="24" opacity="0.17" />
        <ellipse cx="29" cy="29" rx="18" ry="18" opacity="0.13" />
        <path d="M23 32c0-6 5-11 11-11s11 5 11 11" opacity="0.36" />
        <path d="M29 44c7 0 13-6 13-13v-1" opacity="0.8" />
        <path d="M29 36c2 0 4-2 4-4v-1" />
      </g>
    </svg>
  </div>
);

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [animPhase, setAnimPhase] = useState("login"); // login | animating | reveal
  const [shake, setShake] = useState(false);
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setShake(true);
      setTimeout(() => setShake(false), 550);
      setError("Password required");
      return;
    }
    try {
      // Call backend login API via onLogin prop
      const timeRemainingMs = await onLogin(password);
      setAnimPhase("animating");
      setError("");
      setTimeout(() => setAnimPhase("reveal"), 1400);
    } catch (errMsg) {
      setShake(true);
      setTimeout(() => setShake(false), 550);
      setError(errMsg);
    }
  };

  // Container row with left, center, right panels and reveal LabPage when animPhase is "reveal"
  return (
    <div className="login-bg">
      <div className="login-grid-bg" />
      <div className="login-row">
        <AnimatePresence>
          {animPhase !== "reveal" && (
            <>
              <motion.div
                className="login-panel left"
                initial={{ x: 0, opacity: 1 }}
                animate={
                  animPhase === "animating"
                    ? { x: -400, opacity: 0 }
                    : { x: 0, opacity: 1 }
                }
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="login-course">JAVA</div>
                <div className="login-desc">
                  Advanced programming labs. Practice, develop, and master OOP
                  concepts.
                </div>
                <div className="login-stats">
                  <div className="login-stat-row">
                    <span className="staticon">
                      <svg width="18" height="18">
                        <rect
                          width="13"
                          height="13"
                          x="2"
                          y="2"
                          rx="3"
                          stroke="#5ef6ff"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </span>
                    <span className="statlabel">Exercises</span>
                    <span className="statcount">9</span>
                  </div>
                  <div className="login-stat-row">
                    <span className="staticon">
                      <svg width="18" height="18">
                        <circle
                          cx="9"
                          cy="9"
                          r="7"
                          stroke="#5ef6ff"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </span>
                    <span className="statlabel">Projects</span>
                    <span className="statcount">2</span>
                  </div>
                  <div className="login-stat-row">
                    <span className="staticon">
                      <svg width="18" height="18">
                        <path
                          d="M9 2a7 7 0 1 1 0 14A7 7 0 1 1 9 2zm0 4v3l2 2"
                          stroke="#5ef6ff"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </span>
                    <span className="statlabel">Time Spent</span>
                    <span className="statcount">120m</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className={`login-card-center${shake ? " shake" : ""}`}
                initial={false}
                animate={
                  animPhase === "animating"
                    ? {
                        borderRadius: "50%",
                        scale: [1, 1.1, 0.8, 0.7, 0.3],
                        rotate: [0, 240, 570, 800, 900],
                        opacity: [1, 1, 0.8, 0.6, 0],
                        transition: { duration: 1.1, ease: [0.7, 0.06, 0.35, 1] },
                      }
                    : { borderRadius: "34px", scale: 1, rotate: 0, opacity: 1 }
                }
                style={{ zIndex: 10 }}
              >
                <FingerprintIcon glow={true} />
                <form className="login-form-main" onSubmit={handleSubmit}>
                  <input
                    ref={passwordRef}
                    className="login-input"
                    type="password"
                    value={password}
                    disabled={animPhase === "animating"}
                    placeholder="Lab Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="login-btn neon"
                    type="submit"
                    disabled={animPhase === "animating"}
                  >
                    Enter Lab
                    <span className="ripple"></span>
                  </button>
                </form>
                {error && <div className="login-error">{error}</div>}
              </motion.div>
              <motion.div
                className="login-panel right"
                initial={{ x: 0, opacity: 1 }}
                animate={
                  animPhase === "animating"
                    ? { x: 400, opacity: 0 }
                    : { x: 0, opacity: 1 }
                }
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="login-progressbar">
                  <div className="progress-bar-outer">
                    <div className="progress-bar-inner">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="progress-bar-segment"
                          style={{
                            background: i < 5 ? "#7ee9f7" : "#222c34",
                            opacity: i < 5 ? "1" : ".43",
                          }}
                        />
                      ))}
                    </div>
                    <div className="progress-label">50 mins left out of 60 Min</div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {animPhase === "reveal" && (
          <motion.div
            className="labpage-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LabPage
              onExit={(remaining) => {
                setPassword("");
                setAnimPhase("login");
                if (remaining <= 0) setError("Time exhausted. Access denied.");
                else setError("");
                if (passwordRef.current) passwordRef.current.focus();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




/*

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LabPage from "./LabPage";
import "./LoginPage.css";

// SVG Fingerprint for neon glow
const FingerprintIcon = ({ glow }) => (
  <div className={`fingerprint-icon${glow ? " glow" : ""}`}>
    <svg width="58" height="58" viewBox="0 0 58 58">
      <g fill="none" stroke="#7ee9f7" strokeWidth="2">
        <ellipse cx="29" cy="29" rx="24" ry="24" opacity="0.17" />
        <ellipse cx="29" cy="29" rx="18" ry="18" opacity="0.13" />
        <path d="M23 32c0-6 5-11 11-11s11 5 11 11" opacity="0.36" />
        <path d="M29 44c7 0 13-6 13-13v-1" opacity="0.8" />
        <path d="M29 36c2 0 4-2 4-4v-1" />
      </g>
    </svg>
  </div>
);

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [animPhase, setAnimPhase] = useState("login"); // login | animating | reveal
  const [shake, setShake] = useState(false);
  const passwordRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    if (!password) {
      setShake(true);
      setTimeout(() => setShake(false), 550);
      setError("Password required");
      return;
    }
    if (password === "Hairscope@2025") {
      setAnimPhase("animating");
      setError("");
      setTimeout(() => setAnimPhase("reveal"), 1400);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 550);
      setError("Incorrect password");
    }
  }

  // Separate "row" containing all three containers
  return (
    <div className="login-bg">
      <div className="login-grid-bg" />
      <div className="login-row">
        <AnimatePresence>
          {animPhase !== "reveal" && (
            <>
              <motion.div
                className="login-panel left"
                initial={{ x: 0, opacity: 1 }}
                animate={animPhase === "animating"
                  ? { x: -400, opacity: 0 }
                  : { x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="login-course">JAVA</div>
                <div className="login-desc">Advanced programming labs. Practice, develop, and master OOP concepts.</div>
                <div className="login-stats">
                  <div className="login-stat-row">
                    <span className="staticon"><svg width="18" height="18"><rect width="13" height="13" x="2" y="2" rx="3" stroke="#5ef6ff" strokeWidth="2" fill="none"/></svg></span>
                    <span className="statlabel">Exercises</span>
                    <span className="statcount">9</span>
                  </div>
                  <div className="login-stat-row">
                    <span className="staticon"><svg width="18" height="18"><circle cx="9" cy="9" r="7" stroke="#5ef6ff" strokeWidth="2" fill="none"/></svg></span>
                    <span className="statlabel">Projects</span>
                    <span className="statcount">2</span>
                  </div>
                  <div className="login-stat-row">
                    <span className="staticon"><svg width="18" height="18"><path d="M9 2a7 7 0 1 1 0 14A7 7 0 1 1 9 2zm0 4v3l2 2" stroke="#5ef6ff" strokeWidth="2" fill="none"/></svg></span>
                    <span className="statlabel">Time Spent</span>
                    <span className="statcount">120m</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className={`login-card-center${shake ? " shake" : ""}`}
                initial={false}
                animate={
                  animPhase === "animating"
                    ? {
                        borderRadius: "50%",
                        scale: [1, 1.1, 0.8, 0.7, 0.3],
                        rotate: [0, 240, 570, 800, 900],
                        opacity: [1, 1, 0.8, 0.6, 0],
                        transition: { duration: 1.1, ease: [0.7, 0.06, 0.35, 1] }
                      }
                    : { borderRadius: "34px", scale: 1, rotate: 0, opacity: 1 }
                }
                style={{ zIndex: 10 }}
              >
                <FingerprintIcon glow={true} />
                <form className="login-form-main" onSubmit={handleSubmit}>
                  <input
                    ref={passwordRef}
                    className="login-input"
                    type="password"
                    value={password}
                    disabled={animPhase === "animating"}
                    placeholder="Lab Password"
                    onChange={e=>setPassword(e.target.value)}
                  />
                  <button
                    className="login-btn neon"
                    type="submit"
                    disabled={animPhase === "animating"}
                  >
                    Enter Lab
                    <span className="ripple"></span>
                  </button>
                </form>
                {error && <div className="login-error">{error}</div>}
              </motion.div>
              <motion.div
                className="login-panel right"
                initial={{ x: 0, opacity: 1 }}
                animate={animPhase === "animating"
                  ? { x: 400, opacity: 0 }
                  : { x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="login-progressbar">
                  <div className="progress-bar-outer">
                    <div className="progress-bar-inner">
                      {[...Array(6)].map((_,i) => (
                        <div
                          key={i}
                          className="progress-bar-segment"
                          style={{
                            background: i < 5 ? "#7ee9f7" : "#222c34",
                            opacity: i < 5 ? "1" : ".43"
                          }}
                        />
                      ))}
                    </div>
                    <div className="progress-label">50 mins left out of 60 Min</div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {animPhase === "reveal" && (
          <motion.div
            className="labpage-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LabPage time={600} onExit={(remaining) => {
              setPassword("");
              setAnimPhase("login");
              setError(remaining <= 0 ? "Time exhausted. Access denied." : "");
              if (passwordRef.current) passwordRef.current.focus();
            }} />
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


*/