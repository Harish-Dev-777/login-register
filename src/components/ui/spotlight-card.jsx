import React, { useEffect, useRef } from 'react';

const GlowCard = ({ 
  children, 
  className = '', 
  glowColor = 'lime',
  size = 'md',
  width,
  height,
  customSize = false
}) => {
  const cardRef = useRef(null);
  const innerRef = useRef(null);

  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    
    const { clientX: x, clientY: y } = e;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    
    const localX = x - left;
    const localY = y - top;
    
    cardRef.current.style.setProperty('--x', localX.toFixed(2));
    cardRef.current.style.setProperty('--y', localY.toFixed(2));
    cardRef.current.style.setProperty('--xp', (localX / width).toFixed(2));
    cardRef.current.style.setProperty('--yp', (localY / height).toFixed(2));
  };


  const glowColorMap = {
    blue: { base: 220, spread: 200 },
    purple: { base: 280, spread: 300 },
    green: { base: 120, spread: 200 },
    lime: { base: 82, spread: 60 },   // #a3e635 ≈ hsl(82, 78%, 55%)
    red: { base: 0, spread: 200 },
    orange: { base: 30, spread: 200 }
  };

  const sizeMap = {
    sm: 'w-48 h-64',
    md: 'w-64 h-80',
    lg: 'w-80 h-96'
  };

  const { base, spread } = glowColorMap[glowColor] || glowColorMap.lime;

  const getSizeClasses = () => {
    if (customSize) return '';
    return sizeMap[size];
  };

  const getInlineStyles = () => {
    const baseStyles = {
      '--base': base,
      '--spread': spread,
      '--radius': '0',
      '--border': '1',
      '--backdrop': 'rgba(255, 255, 255, 0.02)',
      '--backup-border': 'rgba(255, 255, 255, 0.06)',
      '--size': '350',
      '--outer': '1',
      '--border-size': 'calc(var(--border, 2) * 1px)',
      '--spotlight-size': 'calc(var(--size, 150) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 82) 78% 55% / 0.12), transparent
      )`,
      backgroundColor: 'var(--backdrop, transparent)',
      backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative',
      touchAction: 'pan-y',
    };

    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height;
    }

    return baseStyles;
  };

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }

    [data-glow]:hover::before,
    [data-glow]:hover::after {
      opacity: 1;
    }
    
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 82) 78% 55% / 0.7), transparent 100%
      );
      filter: brightness(1.5);
    }
    
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(82 78% 80% / 0.25), transparent 100%
      );
    }
    
    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: blur(calc(var(--border-size) * 10));
      background: none;
      pointer-events: none;
      border: none;
    }
    
    [data-glow] > [data-glow]::before {
      inset: -10px;
      border-width: 10px;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        data-glow
        style={getInlineStyles()}
        className={`
          ${getSizeClasses()}
          ${!customSize ? 'aspect-[3/4]' : ''}
          relative 
          grid 
          grid-rows-[1fr_auto] 
          shadow-2xl 
          p-6
          gap-4 
          backdrop-blur-[12px]
          transition-all duration-300
          hover:scale-[1.02]
          ${className}
        `}
      >
        <div ref={innerRef} data-glow></div>
        {children}
      </div>
    </>
  );
};

export { GlowCard };
