const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend origins (without trailing slashes)
const allowedOrigins = [
  'https://hairscope-assignment-sjrt.vercel.app',
  'http://localhost:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // Normalize origin by removing trailing slash
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    if (allowedOrigins.includes(normalizedOrigin)) {
      // Respond with original origin exactly as sent by browser (no trailing slash added)
      callback(null, origin);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Hardcoded password for lab entry
const USER_PASSWORD = "Hairscope@2025";

let sessionActive = false;
let sessionStartTime = null;
const SESSION_DURATION_MS = 10 * 60 * 1000; // 10 minutes
let sessionExpirationTime = null;
let timeRemainingOnExit = null;
let loginBlocked = false;

function getTimeRemaining() {
  if (!sessionStartTime) return 0;
  const now = Date.now();
  const remaining = sessionExpirationTime - now;
  return remaining > 0 ? remaining : 0;
}

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
  console.log(`Backend server running on port ${PORT}`);
});
