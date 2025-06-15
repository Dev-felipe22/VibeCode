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

export default function TaskBar() {
  return (
    <div className="taskbar-wrapper">
      <div className="taskbar">
        {/* Left */}
        <div className="taskbar-left">
          <div className="logo">VibeCode</div>
          <button>Problem List</button>
          <ChevronLeft size={20} />
          <ChevronRight size={20} />
          <Shuffle size={20} />
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
