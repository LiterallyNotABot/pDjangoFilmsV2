import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Tooltip({ children, content, position = 'top', bgColor = 'bg-gray-800' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, transform: '' });

  const updateCoords = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const offset = 14;

      const positions = {
        top: {
          top: rect.top - offset,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, -100%)',
        },
        bottom: {
          top: rect.bottom + offset,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 0)',
        },
        left: {
          top: rect.top + rect.height / 2,
          left: rect.left - offset,
          transform: 'translate(-100%, -50%)',
        },
        right: {
          top: rect.top + rect.height / 2,
          left: rect.right + offset,
          transform: 'translate(0, -50%)',
        },
      };

      setCoords(positions[position]);
    }
  };

  useEffect(() => {
    if (visible) {
      updateCoords();
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
    }

    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
    };
  }, [visible, position]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <>
      <div
        ref={ref}
        className="relative inline-block w-full h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              transform: coords.transform,
              zIndex: 9999,
              pointerEvents: 'none',
            }}
            className="relative"
          >
            <style>
              {`
                @keyframes fadeInScale {
                  0% {
                    opacity: 0;
                    transform: scale(0.95);
                  }
                  100% {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
              `}
            </style>
            <div
              className={`${bgColor} text-white text-sm px-3 py-1 rounded shadow-lg relative`}
              style={{
                animation: 'fadeInScale 150ms ease-out forwards',
              }}
            >
              {content}
              <div className={`absolute left-1/2 top-full -translate-x-1/2 w-2 h-2 ${bgColor} rotate-45`} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
