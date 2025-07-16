// src/components/CodePage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import TestCasePanel from "./TestCasePanel";
import ResultsPanel from "./ResultsPanel";
import "../styles.css";

interface Example {
  input: string;
  output: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface StarterCode {
  python: string;
  java?: string;
  cpp?: string;
}

interface Problem {
  slug: string;
  title: string;
  description: string;
  examples: Example[];
  constraints: string[];
  hints: string[];
  testCases: TestCase[];
  starterCode: StarterCode;
}

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
  avgTime: number;
  avgMemory: number;
  results: SubmitResultItem[];
}

interface CodePageProps {
  registerSubmitFn: (fn: () => void) => void;
  registerSubmittingState: (val: boolean) => void;
}

const CodePage: React.FC<CodePageProps> = ({
  registerSubmitFn,
  registerSubmittingState,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>("");
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"cases" | "results">("cases");
  const [showHints, setShowHints] = useState<boolean>(false);

  useEffect(() => {
    setActiveTab("cases");
  }, [slug]);

  useEffect(() => {
    const loadProblem = async () => {
      const currentSlug = slug || "two-sum";
      try {
        const res = await fetch(
          `http://localhost:3000/api/problems/${currentSlug}`
        );
        const data: Problem = await res.json();
        setProblem(data);
        setCode(data.starterCode.python || "");
      } catch (err) {
        console.error("Failed to load problem:", err);
      }
    };
    loadProblem();
  }, [slug]);

  const handleSubmit = useCallback(async () => {
    console.log("handleSubmit() called");
	if (!problem) return;
    setSubmitting(true);
    registerSubmittingState(true);
    setSubmitResult(null);

    try {
      const res = await fetch("http://localhost:3000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: problem.slug,
          language: "python",
          code,
        }),
      });
      const data: SubmitResponse = await res.json();
      setSubmitResult(data);
      setActiveTab("results");
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
      registerSubmittingState(false);
    }
  }, [problem, code, registerSubmittingState]);

  useEffect(() => {
    registerSubmitFn(() => handleSubmit);
  }, [handleSubmit, registerSubmitFn]);

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="code-page-container">
      <div className="problem-panel">
        <h1>{problem.title}</h1>
        <p>{problem.description}</p>

        {problem.constraints?.length > 0 && (
          <>
            <h2>Constraints</h2>
            <ul>
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </>
        )}

        <h2>Examples</h2>
        {problem.examples.map((eg, idx) => (
          <div key={idx} className="example">
            <h3>Example {idx + 1}</h3>
            <p>
              <strong>Input:</strong> {eg.input}
            </p>
            <p>
              <strong>Output:</strong> {eg.output}
            </p>
          </div>
        ))}

        {problem.hints?.length > 0 && (
          <div className="hints-section">
            <button
              className="hints-toggle"
              onClick={() => setShowHints((prev) => !prev)}
            >
              {showHints ? "Hide Hints ▲" : "Show Hints ▼"}
            </button>
            {showHints && (
              <ul>
                {problem.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="code-panel">
        <CodeEditor code={code} onCodeChange={setCode} />

        <div className="panel-tabs">
          <button
            className={activeTab === "cases" ? "active" : ""}
            onClick={() => setActiveTab("cases")}
          >
            Test Cases
          </button>
          <button
            className={activeTab === "results" ? "active" : ""}
            onClick={() => setActiveTab("results")}
            disabled={!submitResult}
          >
            Results
          </button>
        </div>

        {activeTab === "cases" && <TestCasePanel onRun={handleSubmit} />}

        {activeTab === "results" && submitResult && (
          <ResultsPanel result={submitResult} />
        )}
      </div>
    </div>
  );
};

export default CodePage;