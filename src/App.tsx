import "./App.css";
import Landing from "./components/Landing";
import React from "react";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import ForumPage from "./pages/forum/forumpage";
import QuestionDetailPage from "./pages/forum/questiondetail";
import QuizzesPage from "./pages/quizzes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/code_editor" element={<Landing />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/question/:id" element={<QuestionDetailPage />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
