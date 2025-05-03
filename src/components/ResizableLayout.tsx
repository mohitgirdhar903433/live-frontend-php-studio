
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResizableLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialLeftWidth?: number;
}

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  leftPanel,
  rightPanel,
  initialLeftWidth = 50,
}) => {
  const isMobile = useIsMobile();
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startLeftWidth = useRef(0);

  // Update layout based on mobile detection
  useEffect(() => {
    setIsVerticalLayout(!!isMobile);
  }, [isMobile]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (isVerticalLayout) return;
    
    isDragging.current = true;
    startX.current = e.clientX;
    startLeftWidth.current = leftWidth;
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  }, [leftWidth, isVerticalLayout]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = e.clientX - startX.current;
    const newLeftWidth = Math.min(
      Math.max(20, (startLeftWidth.current + (deltaX / containerWidth) * 100)),
      80
    );
    
    setLeftWidth(newLeftWidth);
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  if (isVerticalLayout) {
    // Vertical layout for mobile
    return (
      <div 
        ref={containerRef}
        className="flex flex-col w-full h-full overflow-hidden"
      >
        <div className="h-1/2 w-full overflow-hidden">
          {leftPanel}
        </div>
        
        <div className="h-1/2 w-full overflow-hidden">
          {rightPanel}
        </div>
      </div>
    );
  }

  // Horizontal layout for desktop
  return (
    <div 
      ref={containerRef}
      className="flex w-full h-full overflow-hidden"
    >
      <div 
        className="h-full overflow-hidden relative" 
        style={{ width: `${leftWidth}%` }}
      >
        {leftPanel}
        <div 
          ref={resizerRef} 
          className="editor-resizer"
          onMouseDown={onMouseDown}
        />
      </div>
      
      <div 
        className="h-full overflow-hidden"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
};

export default ResizableLayout;
