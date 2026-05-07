
import React, { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const cursor = cursorDotRef.current;
    if (!cursor) return;
    
    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const mouseX = clientX;
      const mouseY = clientY;
      
      cursor.style.transform = `translate3d(${mouseX - 8}px, ${mouseY - 8}px, 0)`;
    };
    
    const growCursor = () => {
      cursor.classList.add('scale-150');
    };
    
    const shrinkCursor = () => {
      cursor.classList.remove('scale-150');
    };
    
    document.addEventListener('mousemove', moveCursor);
    
    const clickables = document.querySelectorAll('a, button, [role="button"], input, textarea, select, details, summary');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', growCursor);
      el.addEventListener('mouseleave', shrinkCursor);
    });
    
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      clickables.forEach(el => {
        el.removeEventListener('mouseenter', growCursor);
        el.removeEventListener('mouseleave', shrinkCursor);
      });
    };
  }, []);
  
  return (
    <div 
      ref={cursorDotRef} 
      className="cursor-dot transition-transform duration-100 ease-out hidden md:block" 
    />
  );
}
