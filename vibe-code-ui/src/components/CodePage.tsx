import React from "react";
import CodeEditor from "./CodeEditor";

const CodePage: React.FC = () => {
  return (
    <div className="code-page-container">
      <div className="problem-panel">
        <h2>1. Two Sum</h2>
        <p>
          Given an array of integers <code>nums</code> and an integer{" "}
          <code>target</code>, return <em>indices of the two numbers</em> such
          that they add up to <code>target</code>.
        </p>
        <p>
          You may assume that each input would have{" "}
          <strong>exactly one solution</strong>, and you may not use the same
          element twice.
        </p>
        <h4>Example:</h4>
        <pre>
{`Input: nums = [2,7,11,15], target = 9
Output: [0,1]`}
        </pre>
      </div>
      <div className="code-panel">
        <CodeEditor />

      </div>
    </div>
  );
};

export default CodePage;
