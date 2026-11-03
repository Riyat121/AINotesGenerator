import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: "default"
})

const cleanMermaidChart = (diagram) => {
  if (!diagram) return "";

  let clean = diagram
    .replace(/\\n/g, "\n")      // literal \n ko real newline banao
    .replace(/\r?\n/g, "\n")
    .trim();

  if (!clean.startsWith("graph")) {
    clean = `graph TD\n${clean}`;
  }

  return clean;
};

// sirf bina-ID wale nodes ko ID deta hai (A[Start] jaise nodes touch nahi hote)
const autoFixBadNodes = (diagram) => {
  let index = 0;

  // 1) bina-ID wale nodes ko ID do: [Start] -> N1[Start]
  let fixed = diagram.replace(/(^|[\s>-])\[(.*?)\]/g, (_, pre, label) => {
    index++;
    return `${pre}N${index}[${label}]`;
  });

  // 2) har label ko quotes mein wrap karo, andar ke quotes aur brackets safe
  fixed = fixed.replace(/(\w+)\[(?!")(.*?)\]/g, (_, id, label) => {
    const safe = label.replace(/"/g, "'");
    return `${id}["${safe}"]`;
  });

  return fixed;
};

function MermaidSetup({ diagram }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!diagram || !containerRef.current) return;

    let cancelled = false;

    const renderDiagram = async () => {
      const uniqueId = `mermaid-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      try {
        containerRef.current.innerHTML = "";

        const safeChart = autoFixBadNodes(cleanMermaidChart(diagram));

        const { svg } = await mermaid.render(uniqueId, safeChart);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error("Mermaid render failed:", error);
        // mermaid error ka bomb SVG body mein chhod deta hai, usse hatao
        document.getElementById(`d${uniqueId}`)?.remove();
        document.getElementById(uniqueId)?.remove();
      }
    };

    renderDiagram();

    return () => { cancelled = true };
  }, [diagram]);

  return (
    <div className='bg-white border rounded-lg p-4 overflow-x-auto'>
      <div ref={containerRef} />
    </div>
  )
}

export default MermaidSetup