import React, {useEffect, useState} from "react";
import CodeEditor from "./CodeEditor";
import TestCasePanel from "./TestCasePanel";
import { useParams } from "react-router-dom";

interface Example {
  input: string;
  output: string;
}

interface Problem {
  title: string;
  description: string;
  examples: Example[];
}

const CodePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => { 
    const currentSlug = slug || "two-sum";
    fetch(`http://localhost:3000/api/problems/${currentSlug}`)
    .then(res => res.json())
    .then(data => setProblem(data))
    .catch(err => console.error("Failed to load problem: ", err));
  
  }, [slug]);

  if (!problem) return <div>Loading...</div>;
  return (
    <div className="code-page-container">
      <div className="problem-panel">
        <h1>{problem.title}</h1>
        <p>{problem.description}</p>
        <h2>Examples</h2>
        {problem.examples.map((example, index) => (
          <div key={index} className="example">
            <h3>Example {index + 1}</h3>
            <p><strong>Input:</strong> {example.input}</p>
            <p><strong>Output:</strong> {example.output}</p>
          </div>
        ))}
      </div>
      <div className="code-panel">
        <CodeEditor />
        <TestCasePanel />

      </div>
    </div>
  );
};

export default CodePage;
