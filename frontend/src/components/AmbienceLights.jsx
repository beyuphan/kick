// src/components/AmbienceLights.jsx
export const AmbienceLights = () => (
  <>
    {/* Sol Üst Spot */}
    <div style={{
      position: 'absolute', top: -50, left: -50,
      width: '300px', height: '300px',
      background: 'radial-gradient(circle, rgba(255,0,255,0.4) 0%, transparent 70%)',
      animation: 'flicker 2s infinite alternate'
    }} />
    {/* Sağ Üst Spot */}
    <div style={{
      position: 'absolute', top: -50, right: -50,
      width: '300px', height: '300px',
      background: 'radial-gradient(circle, rgba(0,255,255,0.4) 0%, transparent 70%)',
      animation: 'flicker 3s infinite alternate-reverse'
    }} />
  </>
);