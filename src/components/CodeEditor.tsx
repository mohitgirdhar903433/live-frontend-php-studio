
import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { FileCode, Play, RefreshCcw, Save } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface File {
  id: string;
  name: string;
  type: "php";
  content: string;
}

interface CodeEditorProps {
  onExecute: (files: File[]) => void;
}

export default function CodeEditor({ onExecute }: CodeEditorProps) {
  const isMobile = useIsMobile();
  const [file, setFile] = useState<File>({
    id: "1",
    name: "index.php",
    type: "php",
    content: `<?php
// Welcome to PHP Editor
echo '<h1>Hello, World!</h1>';

// Define some PHP variables
$backgroundColor = "#f5f5f5";
$textColor = "#333";
$buttonColor = "#4c7bf3";
$buttonHoverColor = "#2b5cd9";

// Output CSS directly in the PHP file
echo '<style>
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background-color: ' . $backgroundColor . ';
    color: ' . $textColor . ';
  }

  h1 {
    color: #333;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: white;
  }

  button {
    background: ' . $buttonColor . ';
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: ' . $buttonHoverColor . ';
  }
</style>';
?>

<div class="container">
  <p>This is HTML directly in the PHP file</p>
  
  <p>
    <?php
    // More PHP code
    $currentTime = date('H:i:s');
    echo "The current time is: $currentTime";
    ?>
  </p>
  
  <button onclick="showMessage()">Click me</button>
</div>

<script>
  // JavaScript code within the PHP file
  function showMessage() {
    alert('This button was clicked at ' + new Date().toLocaleTimeString());
  }
  
  console.log('Script loaded in PHP file');
</script>`,
  });
  
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleContentChange = (value: string | undefined) => {
    if (!value) return;
    
    setFile({ ...file, content: value });
  };

  const handleRun = () => {
    onExecute([file]);
  };

  // Initial execution
  useEffect(() => {
    handleRun();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="editor-container bg-editor">
      <div className="flex flex-wrap items-center border-b border-border">
        <div className="flex overflow-x-auto">
          <div className="editor-tab editor-tab-active">
            <FileCode className="w-4 h-4" />
            {file.name}
          </div>
        </div>
        
        <div className={`${isMobile ? 'w-full pt-1 pb-1 border-t border-border mt-1' : 'ml-auto'} flex items-center p-1`}>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "sm"} 
            className={isMobile ? "flex-1 mr-1" : "ml-2"} 
            onClick={handleRun}
          >
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className={isMobile ? "flex-none" : "ml-2"} 
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
          language="php"
          value={file.content}
          onChange={handleContentChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: !isMobile },
            fontSize: isMobile ? 12 : 14,
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
