const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Hardcoded user password as per your frontend
const USER_PASSWORD = "Hairscope@2025";

// Session related variables
let sessionActive = false;
let sessionStartTime = null;
const SESSION_DURATION_MS = 10 * 60 * 1000; // 10 minutes in milliseconds
let sessionExpirationTime = null;
let timeRemainingOnExit = null;
let loginBlocked = false;

// Helper to calculate remaining session time
function getTimeRemaining() {
  if (!sessionStartTime) return 0;
  const now = Date.now();
  const remaining = sessionExpirationTime - now;
  return remaining > 0 ? remaining : 0;
}

// Login API
app.post('/api/login', (req, res) => {
  if (loginBlocked) {
    return res.status(403).json({ success: false, message: 'Session time expired. Login blocked.' });
  }

  const { password } = req.body;
  if (password !== USER_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Incorrect password.' });
  }

  if (!sessionActive) {
    sessionActive = true;
    const now = Date.now();
    if (timeRemainingOnExit !== null) {
      sessionExpirationTime = now + timeRemainingOnExit;
      timeRemainingOnExit = null;
    } else {
      sessionExpirationTime = now + SESSION_DURATION_MS;
    }
    sessionStartTime = now;
  }

  const timeLeft = getTimeRemaining();
  if (timeLeft === 0) {
    loginBlocked = true;
    return res.status(403).json({ success: false, message: 'Session time expired. Login blocked.' });
  }

  res.json({ success: true, timeRemainingMs: timeLeft });
});

// Get remaining time API
app.get('/api/time-remaining', (req, res) => {
  if (!sessionActive) {
    return res.json({ timeRemainingMs: 0 });
  }
  const timeLeft = getTimeRemaining();
  if (timeLeft === 0) {
    loginBlocked = true;
    sessionActive = false;
  }
  res.json({ timeRemainingMs: timeLeft });
});

// Exit API
app.post('/api/exit', (req, res) => {
  if (!sessionActive) {
    return res.json({ success: true });
  }
  const timeLeft = getTimeRemaining();
  timeRemainingOnExit = timeLeft;
  sessionActive = false;
  sessionStartTime = null;
  sessionExpirationTime = null;
  res.json({ success: true, timeRemainingMs: timeLeft });
});

// Periodic check to expire session
setInterval(() => {
  if (sessionActive) {
    if (getTimeRemaining() === 0) {
      sessionActive = false;
      loginBlocked = true;
      sessionStartTime = null;
      sessionExpirationTime = null;
      timeRemainingOnExit = null;
      console.log("Session expired, login blocked until server restart.");
    }
  }
}, 1000);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
