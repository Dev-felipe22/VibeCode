import TaskBar from "./components/TaskBar";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
        <div style={{ paddingTop: "48px" }}>
          <TaskBar />
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
          </Routes>
        </div>
    </BrowserRouter>

  );
}

export default App;
