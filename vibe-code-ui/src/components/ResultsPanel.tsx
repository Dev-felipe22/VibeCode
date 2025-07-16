// src/components/ResultsPanel.tsx
import React, { useState } from "react";
import "../styles.css";

interface SubmitResultItem {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  status: string;
  time: string | null;
  memory: number | null;
}

interface SubmitResponse {
  passed: boolean;
  avgTime?: number;
  avgMemory?: number;
  results: SubmitResultItem[];
}

interface ResultsPanelProps {
  result: SubmitResponse;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result }) => {
  const { passed, avgTime, avgMemory, results } = result;

  // 0 = Summary, 1…n = Case index + 1
  const [activeTab, setActiveTab] = useState<number>(0);

  /** -------- tabs (summary + cases) -------- */
  const renderTabs = () => (
    <div className="case-tabs">
      <button
        className={`case-tab ${activeTab === 0 ? "active" : ""}`}
        onClick={() => setActiveTab(0)}
      >
        Summary
      </button>

      {results.map((r, i) => (
        <button
          key={i}
          className={`case-tab ${
            activeTab === i + 1 ? "active" : ""
          } ${r.passed ? "passed" : "failed"}`}
          onClick={() => setActiveTab(i + 1)}
        >
          Case {i + 1}
        </button>
      ))}
    </div>
  );

  /** -------- panel contents -------- */
  const renderSummary = () => (
    <div className="test-fields">
      <label>All Passed?</label>
      <input type="text" value={passed ? "Yes" : "No"} readOnly />

      <label>Avg Time</label>
      <input
        type="text"
        value={avgTime !== undefined ? `${avgTime.toFixed(3)} s` : "-"}
        readOnly
      />

      <label>Avg Memory</label>
      <input
        type="text"
        value={avgMemory !== undefined ? `${avgMemory} KB` : "-"}
        readOnly
      />
    </div>
  );

  const renderCase = (idx: number) => {
    const r = results[idx];
    return (
      <div className="test-fields">
        <label>Status</label>
        <input type="text" value={r.passed ? "Passed" : "Failed"} readOnly />

        <label>Input</label>
        <input type="text" value={r.input} readOnly />

        <label>Expected</label>
        <input type="text" value={r.expectedOutput} readOnly />

        <label>Output</label>
        <input type="text" value={r.actualOutput} readOnly />

        <label>Time</label>
        <input type="text" value={r.time ? `${r.time}s` : "-"} readOnly />

        <label>Memory</label>
        <input
          type="text"
          value={r.memory ? `${r.memory} KB` : "-"}
          readOnly
        />
      </div>
    );
  };

  return (
    <div className="test-panel">
      {renderTabs()}
      {activeTab === 0 ? renderSummary() : renderCase(activeTab - 1)}
    </div>
  );
};

export default ResultsPanel;