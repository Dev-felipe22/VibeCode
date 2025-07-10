import React from "react";
import "../styles.css";

const CodeEditor: React.FC = () => {
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
                defaultValue={`class Solution {\n List<int> twoSum(List<int> nums, int target) {\n\n }\n}`}
            />
            <div className="editor-footer">Saved</div>
        </div>
    );
};

export default CodeEditor;