// src/components/TestCasePanel.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles.css";

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface TestCasePanelProps {
  onRun: () => void;
}

const TestCasePanel: React.FC<TestCasePanelProps> = ({ onRun }) => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedCase, setSelectedCase] = useState(0);
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  useEffect(() => {
    const currentSlug = slug || "two-sum";
    fetch(`${import.meta.env.VITE_API_URL}/api/problems/${currentSlug}`)
      .then((res) => res.json())
      .then((data) => setTestCases(data.testCases || []))
      .catch((err) => console.error("Failed to load test cases:", err));
  }, [slug]);

  if (testCases.length === 0) {
    return <div className="test-panel">Loading...</div>;
  }

  return (
    <div className="test-panel">
      <div className="case-tabs">
        {testCases.map((_, index) => (
          <button
            key={index}
            className={`case-tab ${selectedCase === index ? "active" : ""}`}
            onClick={() => setSelectedCase(index)}
          >
            {`Case ${index + 1}`}
          </button>
        ))}
      </div>

      <div className="test-fields">
        <label>Input</label>
        <input type="text" value={testCases[selectedCase].input} readOnly />

        <label>Expected Output</label>
        <input
          type="text"
          value={testCases[selectedCase].expectedOutput}
          readOnly
        />
      </div>

      <button className="run-button" onClick={onRun}>
        Run
      </button>
    </div>
  );
};

export default TestCasePanel;
