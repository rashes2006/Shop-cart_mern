import { useEffect } from 'react';

/**
 * Home Page Component
 * Renders the full-viewport 3D hero experience with dark starfield,
 * rotating 3D cylinder carousel, browser mock, and cyan bloom buttons,
 * with all navigation links and details aligned with ShopKart.
 */
function Home() {
  useEffect(() => {
    document.title = 'ShopKart — Streamline the shop virtual';
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#020204',
        margin: 0,
        padding: 0,
        zIndex: 1,
      }}
    >
      <iframe
        src="/hero.html"
        title="ShopKart 3D Experience"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          position: 'absolute',
          inset: 0,
        }}
      />
    </div>
  );
}

export default Home;
