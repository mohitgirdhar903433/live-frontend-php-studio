
import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import Preview from "@/components/Preview";
import ResizableLayout from "@/components/ResizableLayout";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

interface File {
  id: string;
  name: string;
  type: string;
  content: string;
}

const Index = () => {
  const isMobile = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);

  const handleExecute = (updatedFiles: File[]) => {
    setFiles(updatedFiles);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-background overflow-hidden">
      <header className={`${isMobile ? 'p-2' : 'p-4'} bg-card`}>
        <h1 className="text-xl sm:text-2xl font-bold flex items-center justify-center sm:justify-start">
          <span className="text-primary">PHP</span>
          <span className="ml-1 text-muted-foreground">Studio</span>
        </h1>
      </header>
      <Separator />
      
      <div className="flex-1 overflow-hidden">
        <ResizableLayout
          leftPanel={<CodeEditor onExecute={handleExecute} />}
          rightPanel={<Preview files={files} />}
          initialLeftWidth={isMobile ? 100 : 55}
        />
      </div>
    </div>
  );
}

export default Index;
