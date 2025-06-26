import TaskBar from "./components/TaskBar";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = React.useState(false);

  return (
    <BrowserRouter>
        <div className={isLoggedIn ? "app-content" : ""}
        style={{
          backgroundColor: isLoggedIn ? "white" : "#f3f4f6",
          minHeight: "100vh",
          paddingTop: isLoggedIn ? "48px" : "0px",
        }}>
          {isLoggedIn && <TaskBar/>}
          
          <Routes>
            {!isLoggedIn ? (
              <Route path="*" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
            ) : (
              <>
              <Route path="/" element={<div style={{ textAlign: "center" }}><h1>Hello World</h1></div>} />
              </>
            )}
          </Routes>
        </div>
    </BrowserRouter>

  );
}

export default App;
