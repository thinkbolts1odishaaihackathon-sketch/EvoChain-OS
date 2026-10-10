import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';

/**
 * SlidingSegmentedControl
 * Apple / Linear style segmented control with a hardware-accelerated,
 * continuous sliding pill indicator that glides like butter between active states.
 */
export default function SlidingSegmentedControl({
  options = [],
  value,
  onChange,
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  ariaLabel = 'Segmented navigation'
}) {
  const containerRef = useRef(null);
  const isInitialMount = useRef(true);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    ready: false
  });

  const updateIndicator = () => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.querySelector(`[data-tab-id="${value}"]`);
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        ready: true
      });
      if (isInitialMount.current) {
        requestAnimationFrame(() => {
          isInitialMount.current = false;
        });
      }
    }
  };

  // Measure after layout mounts & updates
  useLayoutEffect(() => {
    updateIndicator();
  }, [value, options]);

  // Handle font loading, resize, and layout settlement
  useEffect(() => {
    updateIndicator();
    const rafId = requestAnimationFrame(updateIndicator);

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateIndicator);
    }

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateIndicator();
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateIndicator);

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, [value, options]);

  return (
    <div 
      ref={containerRef} 
      className={`segmented-control sliding-segmented-control ${className} size-${size}`} 
      role="tablist"
      aria-label={ariaLabel}
    >
      {/* Liquid sliding pill indicator */}
      <div 
        className={`segmented-sliding-pill ${isInitialMount.current ? 'is-initial-placement' : ''}`}
        style={{
          transform: `translate3d(${indicatorStyle.left}px, 0, 0)`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.ready ? 1 : 0
        }}
        aria-hidden="true"
      />

      {/* Segmented buttons */}
      {options.map((opt) => {
        const isActive = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            data-tab-id={opt.id}
            aria-selected={isActive}
            className={`segmented-pill ${isActive ? 'active' : ''}`}
            onClick={() => onChange && onChange(opt.id)}
            title={opt.title || opt.label}
          >
            {opt.icon && <span className="pill-icon">{opt.icon}</span>}
            {opt.shortLabel ? (
              <>
                <span className="pill-text pill-text-full">{opt.label}</span>
                <span className="pill-text pill-text-short">{opt.shortLabel}</span>
              </>
            ) : (
              <span className="pill-text">{opt.label}</span>
            )}
            {opt.shortcut && <span className="pill-shortcut">{opt.shortcut}</span>}
            {opt.badge && <span className="pill-badge">{opt.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
