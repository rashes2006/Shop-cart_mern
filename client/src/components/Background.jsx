import { useEffect, useRef } from 'react';

function Background() {
  const stARef = useRef(null);
  const stBRef = useRef(null);

  useEffect(() => {
    // Generate Starfield Layer A (150 stars, blur 0px, alpha .05 - .30)
    if (stARef.current) {
      const shadowsA = [];
      for (let i = 0; i < 150; i++) {
        const x = (Math.random() * 100).toFixed(2);
        const y = (Math.random() * 100).toFixed(2);
        const a = (0.05 + Math.random() * 0.25).toFixed(3);
        shadowsA.push(`${x}vw ${y}vh 0px 0 rgba(255,255,255,${a})`);
      }
      stARef.current.style.boxShadow = shadowsA.join(',');
    }

    // Generate Starfield Layer B (18 stars, blur 1.2px, alpha .35 - .70)
    if (stBRef.current) {
      const shadowsB = [];
      for (let i = 0; i < 18; i++) {
        const x = (Math.random() * 100).toFixed(2);
        const y = (Math.random() * 100).toFixed(2);
        const a = (0.35 + Math.random() * 0.35).toFixed(3);
        shadowsB.push(`${x}vw ${y}vh 1.2px 0 rgba(255,255,255,${a})`);
      }
      stBRef.current.style.boxShadow = shadowsB.join(',');
    }
  }, []);

  return (
    <div className="vertex-stage-bg" aria-hidden="true">
      <div className="bg-gradient-layer"></div>
      <div className="ambient-glow glow-top"></div>
      <div className="ambient-glow glow-bottom"></div>
      <div className="stars-layer" ref={stARef}></div>
      <div className="stars-layer" ref={stBRef}></div>
    </div>
  );
}

export default Background;
