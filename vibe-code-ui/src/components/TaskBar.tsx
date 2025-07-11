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
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TaskBar() {
  const navigate = useNavigate();
  const location = useLocation();
  // Extract slug from current URL when TaskBar is rendered outside of a Route
  const slug = location.pathname.startsWith("/problem/")
    ? location.pathname.replace("/problem/", "")
    : undefined;

  // Dynamically loaded list of available problem slugs
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
    const prevIndex =
      (safeIndex - 1 + problemSlugs.length) % problemSlugs.length;
    const prevSlug = problemSlugs[prevIndex];
    navigate(`/problem/${prevSlug}`);
  };

  const handleNext = () => {
    if (problemSlugs.length === 0) return;
    const nextIndex = (safeIndex + 1) % problemSlugs.length;
    const nextSlug = problemSlugs[nextIndex];
    navigate(`/problem/${nextSlug}`);
  };
  return (
    <div className="taskbar-wrapper">
      <div className="taskbar">
        {/* Left */}
        <div className="taskbar-left">
          <div className="logo">VibeCode</div>
          <button>Problem List</button>
          <ChevronLeft size={20} onClick={handlePrev} />
          <ChevronRight size={20} onClick={handleNext} />
        </div>

        {/* Center */}
        <div className="taskbar-center">
          <Settings size={20} />
          <Play size={20} />
          <button className="submit">Submit</button>
          <ClipboardList size={20} />
        </div>

        {/* Right */}
        <div className="taskbar-right">
          <UserCircle size={24} />
        </div>
      </div>
    </div>
  );
}
