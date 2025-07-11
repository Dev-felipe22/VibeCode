import TaskBar from "./components/TaskBar";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import CodeEditor from "./components/CodeEditor";
import { Code } from "lucide-react";
import CodePage from "./components/CodePage";

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = React.useState(false);

  return (
    <BrowserRouter>
        <div
          className={isLoggedIn ? "app-content" : ""}
          style={{
            backgroundColor: isLoggedIn ? "white" : "#f3f4f6",
            color: isLoggedIn ? "#1a1a1a" : "", // ✅ Add this line
            minHeight: "100vh",
            paddingTop: isLoggedIn ? "48px" : "0px",
          }}
        >
          {isLoggedIn && <TaskBar/>}
          
          <Routes> 
            {!isLoggedIn ? (
              <>
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Login onLogin={() => setIsLoggedIn(true)} />} />

              </>
            ) : (
              <>
                {/* <Route path="/" element={<CodePage />} /> */}
                <Route path="/problem/:slug" element={<CodePage />} />
                <Route path="*" element={<Navigate to="/problem/two-sum" />} />
              </>
            )}
          </Routes>
        </div>
    </BrowserRouter>

  );
}

export default App;
