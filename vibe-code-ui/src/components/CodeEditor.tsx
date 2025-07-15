// src/components/CodeEditor.tsx
import React from "react";
import "../styles.css";

interface CodeEditorProps {
  code: string;
  onCodeChange: (newCode: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange }) => {
  return (
    <div className="editor-wrapper">
      <div className="editor-header">
        <span className="editor-tab">&lt;/&gt; Code</span>
        <div className="editor-toolbar">
          <span>Python ▼</span>
        </div>
      </div>
      <textarea
        className="editor-textarea"
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
      />
      <div className="editor-footer">Saved</div>
    </div>
  );
};

export default CodeEditor;