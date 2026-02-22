'use client';

import { useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const revealImgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = revealImgRef.current;
    if (el) {
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
    }
  };

  const handleMouseLeave = () => {
    const el = revealImgRef.current;
    if (el) {
      el.style.setProperty('--mx', '-9999px');
      el.style.setProperty('--my', '-9999px');
    }
  };

  return (
    <div
      className="landing-section"
      style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          width: '86%',
          maxWidth: '800px',
          padding: '2rem',
          backgroundColor: 'rgba(6, 0, 16, 0.7)',
          borderRadius: '20px',
          border: '2px solid #FF79C6',
          color: 'white',
          textAlign: 'center',
          zIndex: 6,
          backdropFilter: 'blur(8px)',
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}>
          CampusMate
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          AI-Powered College Admission Predictor & Counseling Portal
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/prediction"
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: '#FF79C6',
              color: '#060010',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            Predict Colleges
          </Link>
          <Link
            href="/chatbot"
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: 'transparent',
              color: '#FF79C6',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              border: '2px solid #FF79C6',
              transition: 'all 0.3s ease',
            }}
          >
            Chat with Counselor
          </Link>
        </div>
      </div>

      <img
        ref={revealImgRef}
        src="/images/college-bg.jpg"
        alt="Reveal effect"
        style={
          {
            position: 'absolute',
            width: '100%',
            top: '-50%',
            zIndex: 5,
            mixBlendMode: 'lighten',
            opacity: 0.3,
            pointerEvents: 'none',
            '--mx': '-9999px',
            '--my': '-9999px',
            WebkitMaskImage:
              'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
            maskImage:
              'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          } as React.CSSProperties
        }
      />
    </div>
  );
}