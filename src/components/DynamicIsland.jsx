import React, { useState } from 'react';
import { IconAlertTriangle, IconRadar, IconCheck } from './Icons';

export default function DynamicIsland({ activeScenario, onInspectCrisis }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="dynamic-island-anchor" role="region" aria-label="Swarm Telemetry Island">
      <div 
        className={`floating-dynamic-island ${activeScenario ? 'island-disruption-active' : 'island-nominal'} ${isExpanded ? 'island-is-expanded' : ''}`}
        onClick={onInspectCrisis}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        role="status"
        aria-live="polite"
        title={activeScenario ? 'Critical Disruption Detected. Click to inspect crisis.' : 'EvoChain Autonomous Swarm Nominal. Click to test scenarios.'}
      >
        <div className="island-inner-glow"></div>
        
        {/* Living visionOS Radar Beacon */}
        <div className="island-status-beacon" aria-hidden="true">
          <span className="beacon-core"></span>
          <span className="beacon-ring"></span>
          <span className="beacon-ring-outer"></span>
        </div>

        {/* Primary Stream Content */}
        <div className="island-content-stream">
          <div className="island-headline-row">
            {activeScenario ? (
              <span className="island-badge-indicator badge-disrupt">
                <IconAlertTriangle size={11} />
                <span>ALERT</span>
              </span>
            ) : (
              <span className="island-badge-indicator badge-nominal">
                <IconRadar size={11} />
                <span>LIVE AIS</span>
              </span>
            )}
            <span className="island-main-label">
              {activeScenario 
                ? `CRITICAL DISRUPTION: ${activeScenario.title.toUpperCase()}`
                : 'EVOCHAIN AUTONOMOUS SWARM // 6 NEURAL NODES ACTIVE'}
            </span>
          </div>

          <span className="island-sub-label">
            {activeScenario
              ? `Impact: Chokepoint ${(activeScenario.impacts.chokepointRisk * 100).toFixed(0)}% • Closed-Loop Pareto Detour Dispatched`
              : 'Global AIS Telemetry Stream • 0 Anomalies >2.2σ • Consensus Latency 3.2s'}
          </span>
        </div>

        {/* Status Pill Badge */}
        <div className="island-right-action">
          <span className={`island-capsule-badge ${activeScenario ? 'badge-alert' : 'badge-safe'}`}>
            {activeScenario ? activeScenario.severity : 'NOMINAL'}
          </span>
          <span className="island-interactive-hint">
            {activeScenario ? 'Inspect ➔' : 'Test Crisis ➔'}
          </span>
        </div>

        {/* Smooth Expandable visionOS Drawer Details */}
        {isExpanded && (
          <div className="island-expanded-tray" onClick={(e) => e.stopPropagation()}>
            <div className="tray-metric">
              <span className="tray-lbl">ACTIVE AGENTS</span>
              <span className="tray-val val-green">6/6 SYNCED</span>
            </div>
            <div className="tray-divider"></div>
            <div className="tray-metric">
              <span className="tray-lbl">CONSENSUS LATENCY</span>
              <span className="tray-val">3.2 SECONDS</span>
            </div>
            <div className="tray-divider"></div>
            <div className="tray-metric">
              <span className="tray-lbl">CORRIDOR STATUS</span>
              <span className={`tray-val ${activeScenario ? 'val-red' : 'val-blue'}`}>
                {activeScenario ? 'ACTIVE REROUTE' : 'ALL NOMINAL'}
              </span>
            </div>
            <div className="tray-divider"></div>
            <button 
              type="button" 
              className="island-tray-btn"
              onClick={onInspectCrisis}
            >
              Open Crisis Simulator ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
