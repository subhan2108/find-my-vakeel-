'use client';

import { useEffect, useRef } from 'react';

export default function SafeScriptExecution({ scripts }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!scripts || !scripts.length || !containerRef.current) return;

    // Clear previous scripts
    containerRef.current.innerHTML = '';

    const loadScript = (index) => {
      if (index >= scripts.length) return;

      const scriptData = scripts[index];
      const script = document.createElement('script');
      script.setAttribute('data-custom-script', 'true');

      if (scriptData.type === 'external') {
        script.src = scriptData.src;
        script.async = true;
        script.onload = () => loadScript(index + 1);
        script.onerror = () => {
          console.error(`Failed to load script: ${scriptData.src}`);
          loadScript(index + 1);
        };
      } else {
        script.text = scriptData.content;
        containerRef.current.appendChild(script);
        loadScript(index + 1);
        return; // Already appended
      }

      containerRef.current.appendChild(script);
    };

    loadScript(0);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [scripts]);

  return <div ref={containerRef} style={{ display: 'none' }} />;
}
