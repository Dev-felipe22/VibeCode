// src/components/ResultsPanel.tsx
import React from "react";
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

  return (
    <div className="test-panel">
      {/* Summary Row */}
      <div className="case-tabs">
        <button className="case-tab active">Summary</button>
      </div>

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

      {/* Per-Case Tabs */}
      <div className="case-tabs">
        {results.map((r, i) => (
          <button
            key={i}
            className={`case-tab ${r.passed ? "passed" : "failed"}`}
          >
            Case {i + 1}
          </button>
        ))}
      </div>

      {/* Per-Case Details */}
      <div className="test-fields">
        {results.map((r, i) => (
          <div key={i} style={{ marginBottom: "0.5rem" }}>
            <label>Case {i + 1}:</label>
            <input
              type="text"
              value={`Output: ${r.actualOutput} | Time: ${r.time ?? "-"}s | Mem: ${
                r.memory ?? "-"
              }KB`}
              readOnly
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPanel;