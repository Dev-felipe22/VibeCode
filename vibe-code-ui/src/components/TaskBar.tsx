// src/components/TaskBar.tsx
import React, { useEffect, useState } from "react";
import {
  Play,
  Settings,
  ClipboardList,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import "../styles.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface TaskBarProps {
  onSubmit: () => void;
  submitting: boolean;
}

export default function TaskBar({ onSubmit, submitting }: TaskBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Extract slug from /problem/:slug
  const slug = location.pathname.startsWith("/problem/")
    ? location.pathname.replace("/problem/", "")
    : undefined;

  const [problemSlugs, setProblemSlugs] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/problems")
      .then((res) => res.json())
      .then((data) => setProblemSlugs(data.map((p: { slug: string }) => p.slug)))
      .catch((err) => console.error("Failed to fetch problem slugs", err));
  }, []);

  const currentIndex = slug ? problemSlugs.indexOf(slug) : 0;
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  const handlePrev = () => {
    if (problemSlugs.length === 0) return;
    const prev = (safeIndex - 1 + problemSlugs.length) % problemSlugs.length;
    navigate(`/problem/${problemSlugs[prev]}`);
  };

  const handleNext = () => {
    if (problemSlugs.length === 0) return;
    const next = (safeIndex + 1) % problemSlugs.length;
    navigate(`/problem/${problemSlugs[next]}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="taskbar-wrapper">
      <div className="taskbar">
        {/* Left */}
        <div className="taskbar-left">
          <div className="logo">VibeCode</div>
          <button onClick={() => navigate("/problem-list")}>Problem List</button>
          <ChevronLeft size={20} onClick={handlePrev} />
          <ChevronRight size={20} onClick={handleNext} />
        </div>

        {/* Center */}
        <div className="taskbar-center">
          <Play size={20} />
          <button
			  className="submit"
			  onClick={() => {
				console.log("TaskBar: clicked Submit");
				onSubmit();
			  }}
			  disabled={submitting}
			>
			  {submitting ? "Submitting..." : "Submit"}
			</button>
        </div>

        {/* Right */}
        <div className="taskbar-right">
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
