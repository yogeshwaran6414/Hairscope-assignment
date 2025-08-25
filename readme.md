
# Lab Access System

This is a password-protected lab entry system developed as a coding task. The system restricts access to a lab environment based on a hardcoded password and enforces a fixed session time with seamless login, animation, and exit flows.

## Features

- Single hardcoded password authentication (`Hairscope@2025`)
- Fixed session duration: 10 minutes
- On successful login, an animation plays (rotating & fading lock icon with sliding doors effect)
- Displays remaining time inside the lab UI
- Exit button to leave the lab with the remaining time preserved
- Automatic logout and login block when session time is exhausted
- Error messages for incorrect password and session expiration

## Technology Stack

- Frontend: React with Framer Motion for animations
- Backend: Node.js + Express
- No persistent database (session tracked in-memory)

## Project Structure

- `backend/`: Express backend API
- `frontend/`: React frontend app

## Getting Started

### Prerequisites

- Node.js (v14 or newer recommended)
- npm or yarn package manager

### Installation

1. Clone the repository

git clone <repository_url>
cd lab-access-app

text

2. Start the backend server

cd backend
npm install
npm start

text

Backend listens on http://localhost:5000

3. Start the frontend React app

cd ../frontend
npm install
npm start

text

Frontend runs on http://localhost:3000 and communicates with backend API.

## Usage

- Log in with password: `Hairscope@2025`
- Upon correct login, animation plays then lab UI is shown with countdown timer
- Use "Exit Lab" button to leave early and save remaining time
- If time expires, login is disabled until server restart

## Notes

- Session timing and state are stored in backend memory; restarting server resets state and allows new session
- Styling is kept simple but includes smooth animations for login transitions
- Designed to be easily extensible for multiple users or persistent storage if needed

## License

This project is provided as-is for coding assessment purposes.