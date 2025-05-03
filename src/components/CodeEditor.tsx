
import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { FileCode, Play, RefreshCcw, Save } from "lucide-react";

type FileType = "php" | "html" | "css" | "js";

interface File {
  id: string;
  name: string;
  type: FileType;
  content: string;
}

interface CodeEditorProps {
  onExecute: (files: File[]) => void;
}

export default function CodeEditor({ onExecute }: CodeEditorProps) {
  const [files, setFiles] = useState<File[]>([
    {
      id: "1",
      name: "index.php",
      type: "php",
      content: "<?php\n// Welcome to PHP Editor\necho '<h1>Hello, World!</h1>';\n\n// You can also write HTML directly\n?>\n\n<div style=\"color: blue;\">\n  <p>This is HTML and CSS in PHP</p>\n  <button onclick=\"alert('This is JavaScript in PHP!')\">\n    Click me\n  </button>\n</div>"
    },
    {
      id: "2",
      name: "styles.css",
      type: "css",
      content: "body {\n  font-family: Arial, sans-serif;\n  margin: 20px;\n}\n\nh1 {\n  color: #333;\n}\n\nbutton {\n  background: #4c7bf3;\n  color: white;\n  padding: 8px 16px;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background: #2b5cd9;\n}"
    },
    {
      id: "3",
      name: "script.js",
      type: "js",
      content: "// Your JavaScript code here\nconsole.log('Script loaded');\n\nfunction greet() {\n  return 'Welcome to the PHP Editor!';\n}"
    }
  ]);
  
  const [activeFile, setActiveFile] = useState<string>("1");
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const editorRef = useRef<any>(null);

  const getLanguageFromType = (type: FileType): string => {
    switch (type) {
      case "php": return "php";
      case "html": return "html";
      case "css": return "css";
      case "js": return "javascript";
      default: return "plaintext";
    }
  };

  const currentFile = files.find(file => file.id === activeFile);
  
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleContentChange = (value: string | undefined) => {
    if (!value) return;
    
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === activeFile ? { ...file, content: value } : file
      )
    );
  };

  const handleRun = () => {
    onExecute(files);
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case "php": return <FileCode className="w-4 h-4" />;
      case "html": return <FileCode className="w-4 h-4" />;
      case "css": return <FileCode className="w-4 h-4" />;
      case "js": return <FileCode className="w-4 h-4" />;
      default: return <FileCode className="w-4 h-4" />;
    }
  };

  // Initial execution
  useEffect(() => {
    handleRun();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="editor-container bg-editor">
      <div className="flex items-center border-b border-border">
        <div className="flex overflow-x-auto">
          {files.map((file) => (
            <div
              key={file.id}
              className={`editor-tab ${activeFile === file.id ? "editor-tab-active" : ""}`}
              onClick={() => setActiveFile(file.id)}
            >
              {getFileIcon(file.type)}
              {file.name}
            </div>
          ))}
        </div>
        
        <div className="ml-auto flex items-center p-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2" 
            onClick={handleRun}
          >
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="ml-2" 
            title="Save File"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          theme={editorTheme}
          language={currentFile ? getLanguageFromType(currentFile.type) : "php"}
          value={currentFile?.content}
          onChange={handleContentChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}
