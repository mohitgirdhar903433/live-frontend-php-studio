
import { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { processPhpCode } from "@/lib/php-processor";
import { useIsMobile } from "@/hooks/use-mobile";

interface File {
  id: string;
  name: string;
  type: string;
  content: string;
}

interface PreviewProps {
  files: File[];
}

export default function Preview({ files }: PreviewProps) {
  const isMobile = useIsMobile();
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const processFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (files.length === 0) {
        setOutput("<div>No PHP files to process</div>");
        return;
      }
      
      // Process the single PHP file that contains everything
      const phpFile = files[0];
      const processedOutput = await processPhpCode(phpFile.content);
      
      setOutput(processedOutput);
    } catch (err: any) {
      setError(err.message || "Error processing PHP code");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    processFiles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="border-b border-border p-2 flex justify-between items-center">
        <h3 className="text-sm font-medium">Output Preview</h3>
        <Button
          variant="outline"
          size="icon"
          onClick={processFiles}
          disabled={isLoading}
          className={isMobile ? "h-7 w-7" : ""}
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {error && (
        <div className="error-message p-2 text-xs sm:text-sm">
          {error}
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <iframe
          title="preview"
          srcDoc={output}
          className="w-full h-full bg-white"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
