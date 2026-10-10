import React, { useState } from 'react';
import { DISRUPTION_SCENARIOS } from '../data/worldData';
import { IconPulse, IconCheck, IconAlertTriangle, IconSliders } from './Icons';

export default function RoiSimulatorView({ 
  activeScenario, 
  onInjectScenario, 
  onResolveScenario, 
  macroMetrics,
  onOpenGenomeModal 
}) {
  const scenarios = Object.keys(DISRUPTION_SCENARIOS);
  const [fleetScale, setFleetScale] = useState(150);

  // Dynamic enterprise ROI calculations
  const projectedSavingsM = +(fleetScale * 0.24).toFixed(1);
  const projectedDelayDaysAvoided = Math.round(fleetScale * 18.5);

  return (
    <div className="apple-roi-simulator-view">
      {/* 1. Hero Header */}
      <div className="roi-hero-header">
        <div className="roi-title-group">
          <div className="roi-icon-wrap">
            <IconPulse size={20} className="roi-hero-icon" />
          </div>
          <div>
            <h2 className="roi-main-title">Autonomous Crisis &amp; Financial ROI Simulator</h2>
            <p className="roi-main-subtitle">
              Benchmark legacy supply chain delay (14–21 days) against EvoChain-OS real-time multi-agent autonomous consensus (3.2s).
            </p>
          </div>
        </div>

        <div className="roi-header-actions">
          {activeScenario ? (
            <button type="button" className="apple-btn-pill-primary btn-resolve" onClick={onResolveScenario}>
              <IconCheck size={12} />
              <span>Restore Nominal Fleet</span>
            </button>
          ) : (
            <span className="apple-capsule-badge badge-nominal">SYSTEM NOMINAL • NO ACTIVE CRISIS</span>
          )}
        </div>
      </div>

      {/* 2. Interactive Stress Test Scenarios */}
      <section className="roi-scenarios-section">
        <h3 className="section-mini-heading">SELECT DISRUPTION SCENARIO TO INJECT</h3>
        <div className="roi-scenario-cards-grid">
          {scenarios.map((key) => {
            const sc = DISRUPTION_SCENARIOS[key];
            const isActive = activeScenario?.id === sc.id;
            return (
              <div 
                key={sc.id} 
                className={`apple-roi-scenario-card ${isActive ? 'scenario-active' : ''}`}
                onClick={() => onInjectScenario(key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onInjectScenario(key);
                }}
              >
                <div className="scenario-card-top">
                  <span className={`scenario-dot-indicator ${sc.severity === 'CRITICAL' ? 'dot-critical' : 'dot-elevated'}`}></span>
                  <span className={`apple-tag ${sc.severity === 'CRITICAL' ? 'tag-hazard' : 'tag-neutral'}`}>
                    {sc.severity}
                  </span>
                </div>
                <h4 className="sc-title">{sc.title}</h4>
                <p className="sc-desc">{sc.desc}</p>
                <div className="sc-impact-badges">
                  <span className="impact-pill">Risk: {(sc.impacts.chokepointRisk * 100).toFixed(0)}%</span>
                  {sc.impacts.freightIndexSurge && (
                    <span className="impact-pill">+{sc.impacts.freightIndexSurge}% FBX</span>
                  )}
                  {sc.impacts.bunkerPriceSpike && (
                    <span className="impact-pill">+{sc.impacts.bunkerPriceSpike}% Bunker</span>
                  )}
                </div>
                <button 
                  type="button" 
                  className={`apple-btn-pill-primary sc-inject-btn ${isActive ? 'btn-active-now' : ''}`}
                >
                  {isActive ? 'Active Disruption' : 'Inject Stress Test'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Before vs. After Comparative Matrix */}
      <section className="roi-comparison-section">
        <div className="comparison-card legacy-card">
          <div className="comp-card-header">
            <span className="comp-badge badge-legacy">LEGACY SUPPLY CHAIN (MANUAL)</span>
            <span className="comp-time-stat val-hazard">Latency: 14 – 21 Days</span>
          </div>
          <div className="comp-body">
            <div className="comp-metric-row">
              <span className="comp-lbl">Decision Latency</span>
              <span className="comp-val val-danger">Email chains, manual broker calls, static ERP sync</span>
            </div>
            <div className="comp-metric-row">
              <span className="comp-lbl">Detour Cost Overhead</span>
              <span className="comp-val val-danger">+$8.4M (Unhedged spot rates &amp; demurrage penalties)</span>
            </div>
            <div className="comp-metric-row">
              <span className="comp-lbl">Bullwhip Amplification</span>
              <span className="comp-val val-danger">+48% Panicked ghost supplier duplicate orders</span>
            </div>
            <div className="comp-metric-row">
              <span className="comp-lbl">Carbon Compliance</span>
              <span className="comp-val val-danger">Unmonitored bunker burn exceeds IMO CII thresholds</span>
            </div>
            <div className="comp-metric-row">
              <span className="comp-lbl">Executive Auditability</span>
              <span className="comp-val">Post-mortem spreadsheets with 3-week data lag</span>
            </div>
          </div>
        </div>

        <div className="comparison-card evochain-card">
          <div className="comp-card-header">
            <span className="comp-badge badge-evochain">EVOCHAIN-OS AUTONOMOUS SWARM</span>
            <span className="comp-time-stat val-nominal">Decision Time: 3.2 Seconds</span>
          </div>
          <div className="comp-body">
            <div className="comp-metric-row">
              <span className="comp-lbl">Decision Latency</span>
              <span className="comp-val val-nominal">6-Node closed-loop consensus with Gemini 3.8 Flash</span>
            </div>
            <div className="comp-metric-row">
              <span className="comp-lbl">Detour Cost Overhead</span>
              <span className="comp-val val-nominal">$3.6M (Net Saved: $4.8M via Pareto Cape split)</span>
            </div>
            <div className="comp-metric-row">
              <span className="comp-lbl">Bullwhip Amplification</span>
              <span className="comp-val val-nominal">0% (Synapse dynamic DC buffer dampening)</span>
            </div>
            <div className="comp-metric-row">
              <span className="comp-lbl">Carbon Compliance</span>
              <span className="comp-val val-nominal">GovArbiter verified with cryptographic escrow</span>
            </div>
            <div className="comp-metric-row">
              <span className="comp-lbl">Executive Auditability</span>
              <span className="comp-val val-nominal">Immutable JSON-RPC trace with cryptographic signatures</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Enterprise Fleet Scale ROI Calculator */}
      <section className="roi-calculator-section">
        <div className="calc-header-row">
          <div>
            <h3 className="section-mini-heading">INTERACTIVE ENTERPRISE SCALE CALCULATOR</h3>
            <p className="calc-subtext">Adjust global fleet size to project annual capital saved through autonomous consensus.</p>
          </div>
          <div className="calc-scale-pill">
            <span>ANNUAL FLEET SIZE: </span>
            <strong className="calc-number">{fleetScale} VESSELS</strong>
          </div>
        </div>

        <div className="calc-slider-wrap">
          <input 
            type="range"
            min="25"
            max="1000"
            step="25"
            className="engineered-range"
            value={fleetScale}
            onChange={(e) => setFleetScale(parseInt(e.target.value))}
          />
          <div className="calc-ticks-row">
            <span>25 Vessels</span>
            <span>250 Vessels</span>
            <span>500 Vessels</span>
            <span>750 Vessels</span>
            <span>1,000 Vessels</span>
          </div>
        </div>

        <div className="calc-projection-cards-grid">
          <div className="apple-stat-card">
            <span className="stat-label">PROJECTED ANNUAL CAPITAL SAVED</span>
            <span className="stat-number val-nominal">${projectedSavingsM}M</span>
            <span className="stat-caption">Demurrage, fuel surcharge, and port idle savings</span>
          </div>

          <div className="apple-stat-card">
            <span className="stat-label">CUMULATIVE VOYAGE DELAY AVOIDED</span>
            <span className="stat-number">{projectedDelayDaysAvoided.toLocaleString()} DAYS</span>
            <span className="stat-caption">Across global Cape &amp; Pacific detour corridors</span>
          </div>

          <div className="apple-stat-card">
            <span className="stat-label">DECISION ACCELERATION FACTOR</span>
            <span className="stat-number val-brand">450,000×</span>
            <span className="stat-caption">3.2 seconds vs. 17.5 days human consensus latency</span>
          </div>
        </div>
      </section>

      {/* 5. Live Swarm Telemetry Dashboard */}
      <section className="roi-stats-dashboard">
        <div className="apple-stat-card">
          <span className="stat-label">ACTIVE CAPITAL PROTECTED</span>
          <span className="stat-number val-nominal">${macroMetrics.estimatedCostSavedM}M</span>
          <span className="stat-caption">Avoided detention fees &amp; assembly halt penalties</span>
        </div>

        <div className="apple-stat-card">
          <span className="stat-label">ACTIVE AUTONOMOUS ACTIONS</span>
          <span className="stat-number">{macroMetrics.activeAutonomousDecisions}</span>
          <span className="stat-caption">Decisions executed without human bottleneck</span>
        </div>

        <div className="apple-stat-card">
          <span className="stat-label">SWARM RESILIENCE INDEX</span>
          <span className="stat-number">{macroMetrics.resilienceScore}%</span>
          <span className="stat-caption">Calculated across 5 global trade corridors</span>
        </div>

        <div className="apple-stat-card">
          <span className="stat-label">BULLWHIP DAMPENING FACTOR</span>
          <span className="stat-number">-38.4%</span>
          <span className="stat-caption">Variance reduction across Rotterdam &amp; LA hubs</span>
        </div>
      </section>
    </div>
  );
}
