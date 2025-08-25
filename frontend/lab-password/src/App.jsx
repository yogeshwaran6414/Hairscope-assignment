import React from "react";
import axios from "axios";
import LoginPage from "./components/LoginPage";
import "./App.css";
export default function App() {
  // login function passed down to LoginPage to handle backend login call
  const handleLogin = async (password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", { password });
      if (res.data.success) {
        return res.data.timeRemainingMs;
      }
      throw res.data.message || "Login failed";
    } catch (e) {
      // Extract error message from response or fallback
      if (e.response?.data?.message) throw e.response.data.message;
      throw typeof e === "string" ? e : "Login failed";
    }
  };

  return <LoginPage onLogin={handleLogin} />;
}
