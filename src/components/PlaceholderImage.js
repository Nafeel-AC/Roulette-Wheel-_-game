import React from 'react';

const PlaceholderImage = ({ name, size = 100, borderRadius = 50 }) => {
  // Special cases
  const isGoldenCoin = name.toLowerCase().includes('coin');
  const isCard = name.toLowerCase().includes('card');

  // Generate a deterministic color based on the name
  const getColor = (str) => {
    if (isGoldenCoin) {
      return '#FFD700'; // Gold color for coin
    }
    
    if (isCard) {
      return '#FFFFFF'; // White for card
    }
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#FF5733', // Red-orange
      '#33FFF6', // Cyan
      '#F033FF', // Magenta
      '#33FF57', // Green
      '#FF33F6', // Pink
      '#F3FF33', // Yellow
      '#3357FF'  // Blue
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const color = getColor(name);
  
  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    borderRadius: isCard ? '10%' : '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isGoldenCoin ? '#7F6000' : (isCard ? '#333' : 'white'),
    fontWeight: 'bold',
    textShadow: isGoldenCoin ? '0 1px 2px rgba(255, 215, 0, 0.6)' : '0 1px 2px rgba(0,0,0,0.6)',
    boxShadow: isGoldenCoin 
      ? '0 0 20px rgba(255, 215, 0, 0.7), inset 0 0 15px rgba(255, 255, 255, 0.5)' 
      : (isCard 
        ? '0 0 15px rgba(255, 255, 255, 0.5), 0 0 5px rgba(255, 255, 255, 0.5)'
        : `0 0 15px ${color}80, inset 0 0 10px rgba(255, 255, 255, 0.3)`),
    position: 'relative',
    overflow: 'hidden'
  };
  
  // Add some visual elements to make it more interesting
  const overlayStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: `radial-gradient(circle at center, rgba(255,255,255,${isGoldenCoin ? '0.6' : '0.3'}) 0%, rgba(255,255,255,0) 70%)`,
    borderRadius: isCard ? '10%' : '50%'
  };
  
  // Add highlight
  const highlightStyle = {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '20%',
    height: '20%',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '50%',
    filter: 'blur(5px)'
  };
  
  // Extract first letter of each word for display
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
  
  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>
      <div style={highlightStyle}></div>
      <span style={{ fontSize: size / 3, zIndex: 1 }}>{initials}</span>
      {isGoldenCoin && (
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '2px solid rgba(184, 134, 11, 0.5)',
          boxSizing: 'border-box'
        }}></div>
      )}
      {isCard && (
        <div style={{
          position: 'absolute',
          width: '90%',
          height: '90%',
          borderRadius: '10%',
          border: '2px solid rgba(200, 200, 200, 0.8)',
          boxSizing: 'border-box',
          zIndex: 2
        }}></div>
      )}
      {isCard && (
        <div style={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          border: '1px solid rgba(200, 200, 200, 0.8)',
          boxSizing: 'border-box',
          zIndex: 2
        }}></div>
      )}
    </div>
  );
};

export default PlaceholderImage; 