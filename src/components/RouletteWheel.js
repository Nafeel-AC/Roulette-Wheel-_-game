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
  jersey: 'https://img.icons8.com/color/96/000000/t-shirt.png',
  shoes: 'https://img.icons8.com/color/96/000000/baseball-cap.png'
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
  const [itemPassingCenter, setItemPassingCenter] = useState(false);
  const containerRef = useRef(null);
  const itemsRef = useRef(null);
  const centerDetectionInterval = useRef(null);

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
  }, [rouletteItems.length]);

  // Check if an item is passing through the center
  useEffect(() => {
    if (spinning) {
      const checkItemInCenter = () => {
        if (!containerRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;
        
        // Get all item elements
        const itemElements = document.querySelectorAll('.roulette-item');
        let foundItemInCenter = false;
        
        itemElements.forEach(item => {
          const itemRect = item.getBoundingClientRect();
          const itemCenterX = itemRect.left + itemRect.width / 2;
          
          // Check if item is close to the center
          if (Math.abs(itemCenterX - centerX) < 30) {
            foundItemInCenter = true;
          }
        });
        
        setItemPassingCenter(foundItemInCenter);
      };
      
      // Run the check frequently during spinning
      centerDetectionInterval.current = setInterval(checkItemInCenter, 50);
      return () => clearInterval(centerDetectionInterval.current);
    } else {
      setItemPassingCenter(false);
    }
  }, [spinning]);

  // Update the selector visibility based on spinning and item position
  useEffect(() => {
    setSelectorVisible(spinning && itemPassingCenter);
  }, [spinning, itemPassingCenter]);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    setWinner(null);

    // Calculate a random winner from the original items
    const randomIndex = Math.floor(Math.random() * rouletteItems.length);

    // Calculate number of full rotations plus the position to the winning item
    const itemWidth = 140; // Width of each item + margin
    const containerWidth = containerRef.current?.clientWidth || 800;
    const centerPosition = containerWidth / 2;

    // We want to do at least 2 full rotations plus the position to the winning item
    const fullRotation = rouletteItems.length * itemWidth;
    const targetPosition = fullRotation * 2 + (randomIndex + rouletteItems.length) * itemWidth - centerPosition + itemWidth / 2;

    // Animation variables
    let startTime = null;
    const duration = 5000; // 5 seconds

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for more realistic spinning
      const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
      const currentPosition = easeOutQuint(progress) * targetPosition;

      // Apply modulo to ensure the position loops back around
      setPosition(currentPosition % (rouletteItems.length * itemWidth * 2));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Spinning complete
        setWinner(randomIndex);
        setTimeout(() => {
          setSpinning(false);
          setSelectorVisible(false);
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="roulette-container">
      <div className="position-relative mb-4" style={{ width: "100%" }}>
        {/* Card selector in the center - only visible during spinning when items pass through */}
        <div className={`card-selector ${selectorVisible ? 'visible' : 'hidden'}`}></div>

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