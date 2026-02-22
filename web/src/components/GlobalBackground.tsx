'use client';

import LaserFlow from './LaserFlow';

export default function GlobalBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <LaserFlow
        horizontalBeamOffset={0.0}      // Centered on X-axis
        verticalBeamOffset={0.0}        // Start from top
        horizontalSizing={0.1}          // Minimal horizontal spread (thin vertical beam)
        verticalSizing={3.5}            // Extended vertical reach (full height coverage)
        color="#CF9EFF"
        wispDensity={5}
        wispSpeed={12}                  // Increased for vertical flow effect
        wispIntensity={25}              // Enhanced visibility
        flowSpeed={0.35}                // Faster vertical flow
        flowStrength={0.4}              // Stronger flow pulsing
        fogIntensity={1.2}              // More fog for vertical spread
        fogScale={0.4}                  // Tighter fog scale for vertical column
        fogFallSpeed={1.5}              // Faster downward fog movement
        decay={2.5}                     // Adjusted beam decay for vertical orientation
        falloffStart={1.0}              // Beam falloff tuned for vertical beam
      />
    </div>
  );
}
