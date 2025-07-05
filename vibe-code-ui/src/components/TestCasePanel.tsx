import React, { useState } from "react";
import "../styles.css"; // make sure styles are hooked

const TestCasePanel: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState(0);
  const [testCases, setTestCases] = useState([
    { nums: "[2,7,11,15]", target: "9" },
    { nums: "", target: "" },
    { nums: "", target: "" },
  ]);

  const handleInputChange = (index: number, field: "nums" | "target", value: string) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  return (
    <div className="test-panel">
      {/* Case Tabs */}
      <div className="case-tabs">
        {["Case 1", "Case 2", "Case 3"].map((label, index) => (
          <button
            key={index}
            className={`case-tab ${selectedCase === index ? "active" : ""}`}
            onClick={() => setSelectedCase(index)}
          >
            {label}
          </button>
        ))}
        <button className="add-tab">+</button>
      </div>

      {/* Input Fields */}
      <div className="test-fields">
        <label>nums =</label>
        <input
          type="text"
          value={testCases[selectedCase].nums}
          onChange={(e) => handleInputChange(selectedCase, "nums", e.target.value)}
        />

        <label>target =</label>
        <input
          type="text"
          value={testCases[selectedCase].target}
          onChange={(e) => handleInputChange(selectedCase, "target", e.target.value)}
        />
      </div>

      {/* Run Button */}
      <button
        className="run-button"
        onClick={() => alert("Run clicked with: " + JSON.stringify(testCases[selectedCase]))}
      >
        Run
      </button>
    </div>
  );
};

export default TestCasePanel;
