import React, { useRef, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/RouletteWheel.css';

const prizeImages = {
  ball: 'https://img.icons8.com/color/96/000000/football2--v1.png',
  cap: 'https://img.icons8.com/color/96/000000/baseball-cap.png',
  tshirt: 'https://img.icons8.com/color/96/000000/t-shirt.png',
  trophy: 'https://img.icons8.com/color/96/000000/trophy.png',
  medal: 'https://img.icons8.com/color/96/000000/medal2.png',
  ticket: 'https://img.icons8.com/color/96/000000/ticket.png',
  gift: 'https://img.icons8.com/color/96/000000/gift.png',
  coin: 'https://img.icons8.com/color/96/000000/gold-bars.png',
  jersey: 'https://img.icons8.com/color/96/000000/gold-bars.png',
  shoes: 'https://img.icons8.com/color/96/000000/gold-bars.png'
};

const defaultPrizes = [
  { id: 1, name: 'Sports Ball', type: 'ball' },
  { id: 2, name: 'Cap', type: 'cap' },
  { id: 3, name: 'T-Shirt', type: 'tshirt' },
  { id: 4, name: 'Trophy', type: 'trophy' },
  { id: 5, name: 'Medal', type: 'medal' },
  { id: 6, name: 'Event Ticket', type: 'ticket' },
  { id: 7, name: 'Mystery Gift', type: 'gift' },
  { id: 8, name: 'Gold Coin', type: 'coin' },
  { id: 9, name: 'Jersey', type: 'jersey' },
  { id: 10, name: 'Sports Shoes', type: 'shoes' }
];

const RouletteWheel = ({ items = defaultPrizes }) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [position, setPosition] = useState(0);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const containerRef = useRef(null);
  const itemsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastPositionRef = useRef(0);

  // Map items to include images and special status
  const rouletteItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    special: item.type === 'coin' || item.type === 'trophy',
    image: prizeImages[item.type] || prizeImages.gift // fallback to gift image if type not found
  }));

  // Create a continuous loop of items
  const createContinuousItems = () => {
    return [...rouletteItems, ...rouletteItems, ...rouletteItems];
  };

  const continuousItems = createContinuousItems();

  // Center the first item on mount
  useEffect(() => {
    const itemWidth = 140; // Width of each item + margin
    const containerWidth = containerRef.current?.clientWidth || 800;
    const centerPosition = containerWidth / 2;
    
    // Position to center the first item (using the middle set of items)
    const initialPosition = (rouletteItems.length * itemWidth) + (centerPosition - itemWidth / 2);
    setPosition(initialPosition);
    lastPositionRef.current = initialPosition;
  }, [rouletteItems.length]);

  // Check if an item is in the center
  const checkItemInCenter = (currentPosition) => {
    const itemWidth = 140;
    const remainder = currentPosition % itemWidth;
    // Show selector when item is approaching center (within 20px of center)
    setSelectorVisible(remainder < 20 || remainder > itemWidth - 20);
  };

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    setWinner(null);
    setSelectorVisible(true);

    const randomIndex = Math.floor(Math.random() * rouletteItems.length);
    const itemWidth = 140;
    const containerWidth = containerRef.current?.clientWidth || 800;
    const centerPosition = containerWidth / 2;
    const fullRotation = rouletteItems.length * itemWidth;
    const targetPosition = fullRotation * 2 + (randomIndex + rouletteItems.length) * itemWidth - centerPosition + itemWidth / 2;

    let startTime = null;
    const duration = 5000;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
      const currentPosition = easeOutQuint(progress) * targetPosition;

      // Calculate the actual position after modulo
      const moduloPosition = currentPosition % (rouletteItems.length * itemWidth * 2);
      setPosition(moduloPosition);

      // Check if an item is in the center
      checkItemInCenter(moduloPosition);
      lastPositionRef.current = moduloPosition;

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setWinner(randomIndex);
        setSelectorVisible(true); // Keep selector visible for winner
        setTimeout(() => {
          setSpinning(false);
        }, 500);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="roulette-container">
      <div className="position-relative mb-4" style={{ width: "100%" }}>
        {/* Card selector with visibility class */}
        <div className={`card-selector ${selectorVisible ? 'visible' : ''}`}></div>

        {/* Roulette container */}
        <div ref={containerRef} className="roulette-viewport">
          <div 
            ref={itemsRef} 
            className="items-container" 
            style={{ transform: `translateX(-${position}px)` }}
          >
            {continuousItems.map((item, index) => (
              <div
                key={`item-${index}`}
                className={`roulette-item ${
                  winner !== null && index % rouletteItems.length === winner ? 'winner' : ''
                } ${item.special ? 'special' : ''}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="item-image"
                  crossOrigin="anonymous"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="controls mt-4">
        <button 
          className="btn btn-primary spin-button" 
          onClick={spinWheel} 
          disabled={spinning}
        >
          {spinning ? 'Spinning...' : 'SPIN'}
        </button>
        
        {winner !== null && (
          <div className="winner-display mt-3">
            <h3>You won: {rouletteItems[winner].name}!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouletteWheel; 