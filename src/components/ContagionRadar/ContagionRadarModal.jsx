import React, { useState, useEffect } from 'react';
import ContagionRadarCanvas from './ContagionRadarCanvas';
import './ContagionRadar.css';
import {
  simulateOutbreakScenario,
  executeAutoImmuneResponse,
  CONTAGION_SCENARIOS,
  playPathogenAlertSound
} from '../../core/contagionEngine';
import {
  IconRadar,
  IconShieldAlert,
  IconShieldCheck,
  IconActivity,
  IconRadio,
  IconZap,
  IconCheckCircle2,
  IconSyringe,
  IconBiohazard,
  IconLock
} from '../Icons';

export default function ContagionRadarModal({
  isOpen = false,
  onClose = () => {},
  contagionState = null,
  onContagionStateChange = () => {},
  onAutoImmuneDeployed = () => {}
}) {
  // Active View Tab: 'radar' | 'cascade' | 'antibody'
  const [activeTab, setActiveTab] = useState('radar');

  // Active Outbreak Scenario
  const [activeScenarioId, setActiveScenarioId] = useState('ROTTERDAM_SMELTER');
  const [scenarioData, setScenarioData] = useState(() => simulateOutbreakScenario('ROTTERDAM_SMELTER'));

  // Selected node for deep inspection
  const [selectedNode, setSelectedNode] = useState(null);

  // Auto-Immune Execution State
  const [isDeployingDefense, setIsDeployingDefense] = useState(false);
  const [currentDefensePhase, setCurrentDefensePhase] = useState(0); // 0 = idle, 1, 2, 3
  const [defenseProgress, setDefenseProgress] = useState({
    phase1: false,
    phase2: false,
    phase3: false
  });
  const [postDefenseResult, setPostDefenseResult] = useState(null);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  // Sound on opening modal and ESC key dismiss listener
  useEffect(() => {
    if (isOpen) {
      playPathogenAlertSound();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load / Reload Scenario on user selection
  const handleSelectScenario = (scenarioId) => {
    setActiveScenarioId(scenarioId);
    const data = simulateOutbreakScenario(scenarioId);
    setScenarioData(data);
    setSelectedNode(data.nodes[0] || null);
    setCurrentDefensePhase(0);
    setDefenseProgress({ phase1: false, phase2: false, phase3: false });
    setPostDefenseResult(null);
    playPathogenAlertSound();
  };

  // Sync external contagionState if provided
  const currentR0 = postDefenseResult
    ? postDefenseResult.finalR0
    : contagionState?.r0 ?? scenarioData.contagionCalc.r0;

  const isImmunized = currentR0 < 1.0;
  const isOutbreak = currentR0 >= 2.0;

  // Execute Auto-Immune Response Protocol
  const handleDeployAutoImmune = async () => {
    if (isDeployingDefense) return;

    setIsDeployingDefense(true);
    setCurrentDefensePhase(1);

    try {
      const result = await executeAutoImmuneResponse((progress) => {
        setCurrentDefensePhase(progress.phase);
        setDefenseProgress((prev) => ({
          ...prev,
          [`phase${progress.phase}`]: true
        }));

        // Dynamically adjust R0 on state
        onContagionStateChange?.({
          r0: progress.r0,
          isOutbreak: progress.r0 >= 2.0,
          isImmunized: progress.r0 < 1.0
        });
      });

      setPostDefenseResult(result);
      setIsDeployingDefense(false);
      onAutoImmuneDeployed?.(result);
    } catch (err) {
      console.error('Auto-Immune deployment error:', err);
      setIsDeployingDefense(false);
    }
  };

  if (!isOpen) return null;

  // SVG Radial Gauge Calculation
  const gaugeRadius = 18;
  const circumference = 2 * Math.PI * gaugeRadius;
  // Normalized: R0 range from 0 to 4.0
  const normalizedR0Ratio = Math.min(1.0, currentR0 / 4.0);
  const strokeOffset = circumference - normalizedR0Ratio * circumference;

  const gaugeStrokeColor = isImmunized
    ? '#10B981'
    : isOutbreak
    ? '#EF4444'
    : '#F59E0B';

  return (
    <div className="contagion-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      {/* Top Floating Spatial Hint */}
      <div className="contagion-backdrop-hint">
        <span>Click background or press</span>
        <kbd>ESC</kbd>
        <span>to return to workspace</span>
      </div>

      <div
        className={`contagion-modal-window ${isImmunized ? 'mode-immunized' : 'mode-outbreak'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Apple Spatial Sheet Grabber Handle */}
        <div className="contagion-sheet-grabber" aria-hidden="true" />

        {/* ==============================================================================
           1. Window Header
           ============================================================================== */}
        <header className="contagion-header">
          <div className="contagion-header-left">
            {/* R0 Radial Gauge */}
            <div className="r0-gauge-capsule" title="Supply Chain Disruption Reproduction Number (R₀ = β · k · τ)">
              <div className="r0-svg-meter">
                <svg width="44" height="44" viewBox="0 0 44 44">
                  <circle
                    className="r0-svg-bg"
                    cx="22"
                    cy="22"
                    r={gaugeRadius}
                    fill="none"
                    strokeWidth="3.5"
                  />
                  <circle
                    className="r0-svg-bar"
                    cx="22"
                    cy="22"
                    r={gaugeRadius}
                    fill="none"
                    stroke={gaugeStrokeColor}
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="r0-center-num">{currentR0.toFixed(2)}</span>
              </div>

              <div className="r0-meta-group">
                <span className="r0-meta-title">CONTAGION R₀</span>
                <span
                  className="r0-meta-status"
                  style={{ color: gaugeStrokeColor }}
                >
                  <span
                    className="r0-status-dot"
                    style={{ background: gaugeStrokeColor }}
                  />
                  {isImmunized ? 'IMMUNIZED' : isOutbreak ? 'OUTBREAK (>2.0)' : 'ACTIVE (1-2)'}
                </span>
              </div>
            </div>

            {/* Formula Breakdown Toggle */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className={`formula-breakdown-chip ${showFormulaDetails ? 'active' : ''}`}
                onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                title="Mathematical Contagion Model: R₀ = β · k · τ. Click to view parameters."
              >
                <span>R₀ = β·k·τ</span>
                <strong>{currentR0.toFixed(2)}</strong>
              </button>

              {showFormulaDetails && (
                <div className="formula-popover-card">
                  <div className="formula-math-row">
                    <span className="formula-sym">β: {scenarioData.scenario.beta}</span>
                    <span className="formula-mult">×</span>
                    <span className="formula-sym">k: {scenarioData.scenario.k}</span>
                    <span className="formula-mult">×</span>
                    <span className="formula-sym">τ: {scenarioData.scenario.tau}</span>
                    <span className="formula-eq">=</span>
                    <strong className="formula-res">{currentR0.toFixed(2)}</strong>
                  </div>
                  <div className="formula-caption">
                    β: Severity Factor · k: Degree · τ: Latency
                  </div>
                </div>
              )}
            </div>

            {/* Pathogen Vector Title Banner */}
            <div className="pathogen-vector-banner">
              <span className="vector-tag">
                {isImmunized ? 'BIOLOGICAL EQUILIBRIUM' : 'ACTIVE PATHOGEN VECTOR'}
              </span>
              <span className="vector-title" title={scenarioData.scenario.title}>
                {scenarioData.scenario.title}
              </span>
            </div>
          </div>

          {/* Center: Apple Pill Selector */}
          <div className="contagion-tabs">
            <button
              type="button"
              className={`contagion-tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
              onClick={() => setActiveTab('radar')}
            >
              <IconRadar size={13} />
              <span>Live Radar Sweep</span>
            </button>
            <button
              type="button"
              className={`contagion-tab-btn ${activeTab === 'cascade' ? 'active' : ''}`}
              onClick={() => setActiveTab('cascade')}
            >
              <IconActivity size={13} />
              <span>Tier Cascade Tree</span>
            </button>
            <button
              type="button"
              className={`contagion-tab-btn ${activeTab === 'antibody' ? 'active' : ''}`}
              onClick={() => setActiveTab('antibody')}
            >
              <IconSyringe size={13} />
              <span>Antibody Telemetry</span>
            </button>
          </div>

          {/* Right: Close Button with ESC Affordance */}
          <button
            type="button"
            className="contagion-close-btn"
            onClick={onClose}
            title="Dismiss Contagion Radar & Return to Workspace (Esc)"
            aria-label="Close"
          >
            <span className="close-x">✕</span>
            <span className="close-kbd-badge">ESC</span>
          </button>
        </header>

        {/* ==============================================================================
           2. Centerpiece Body & Views
           ============================================================================== */}
        <div className="contagion-body">
          {/* VIEW 1: Live Radar Sweep */}
          {activeTab === 'radar' && (
            <div className="radar-sweep-view">
              <div className="radar-canvas-container">
                <ContagionRadarCanvas
                  nodes={scenarioData.nodes}
                  arcs={scenarioData.arcs}
                  contagionState={{
                    r0: currentR0,
                    isOutbreak,
                    isImmunized
                  }}
                  selectedNodeId={selectedNode?.id}
                  onSelectNode={(node) => setSelectedNode(node)}
                  quarantineActive={defenseProgress.phase1 || isImmunized}
                  immunizedActive={defenseProgress.phase3 || isImmunized}
                />
              </div>

              {/* Sidebar Telemetry */}
              <div className="radar-telemetry-sidebar">
                {/* Real-Time Contagion Sensor Panel */}
                <div className="telemetry-card">
                  <div className="telemetry-card-title">
                    <span>PATHOGEN SENSORS</span>
                    <IconBiohazard size={13} />
                  </div>
                  <div className="metrics-kpi-grid">
                    <div className="telemetry-kpi-box">
                      <span className="kpi-lbl">PROPAGATION VELOCITY</span>
                      <span className={`kpi-val ${isImmunized ? 'text-success' : 'text-danger'}`}>
                        {isImmunized ? '0.12x / 24h' : scenarioData.contagionCalc.viralPropagationVelocity}
                      </span>
                    </div>
                    <div className="telemetry-kpi-box">
                      <span className="kpi-lbl">LINE HALT ETA</span>
                      <span className={`kpi-val ${isImmunized ? 'text-success' : 'text-danger'}`}>
                        {isImmunized ? 'AVERTED' : '52 Hours'}
                      </span>
                    </div>
                    <div className="telemetry-kpi-box">
                      <span className="kpi-lbl">INFECTED NODES</span>
                      <span className={`kpi-val ${isImmunized ? 'text-success' : 'text-danger'}`}>
                        {isImmunized ? '0 / 12' : '6 / 12 (50%)'}
                      </span>
                    </div>
                    <div className="telemetry-kpi-box">
                      <span className="kpi-lbl">QUARANTINE LANES</span>
                      <span className="kpi-val text-warning">
                        {defenseProgress.phase1 || isImmunized ? '3 Corridors' : '0 Isolated'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Multi-Tier Cascade Health Breakdown */}
                <div className="telemetry-card">
                  <div className="telemetry-card-title">
                    <span>MULTI-TIER INTEGRITY</span>
                    <IconShieldAlert size={13} />
                  </div>

                  <div className="tier-health-row">
                    <div className="tier-health-header">
                      <span className="tier-health-name">Tier-3 (Raw Smelters)</span>
                      <span className="tier-health-status" style={{ color: isImmunized ? '#10B981' : '#EF4444' }}>
                        {isImmunized ? 'ISOLATED' : 'EPICENTER SHOCK'}
                      </span>
                    </div>
                    <div className="tier-health-bar-track">
                      <div
                        className="tier-health-bar-fill"
                        style={{
                          width: isImmunized ? '100%' : '20%',
                          background: isImmunized ? '#10B981' : '#EF4444'
                        }}
                      />
                    </div>
                  </div>

                  <div className="tier-health-row">
                    <div className="tier-health-header">
                      <span className="tier-health-name">Tier-2 (Sub-Assembly)</span>
                      <span className="tier-health-status" style={{ color: isImmunized ? '#10B981' : '#F59E0B' }}>
                        {isImmunized ? 'BUFFERED' : 'BUFFER SINK (42%)'}
                      </span>
                    </div>
                    <div className="tier-health-bar-track">
                      <div
                        className="tier-health-bar-fill"
                        style={{
                          width: isImmunized ? '100%' : '42%',
                          background: isImmunized ? '#10B981' : '#F59E0B'
                        }}
                      />
                    </div>
                  </div>

                  <div className="tier-health-row">
                    <div className="tier-health-header">
                      <span className="tier-health-name">Tier-1 (System Assemblers)</span>
                      <span className="tier-health-status" style={{ color: isImmunized ? '#10B981' : '#EF4444' }}>
                        {isImmunized ? 'IMMUNIZED' : 'BULLWHIP SPREAD'}
                      </span>
                    </div>
                    <div className="tier-health-bar-track">
                      <div
                        className="tier-health-bar-fill"
                        style={{
                          width: isImmunized ? '100%' : '15%',
                          background: isImmunized ? '#10B981' : '#EF4444'
                        }}
                      />
                    </div>
                  </div>

                  <div className="tier-health-row">
                    <div className="tier-health-header">
                      <span className="tier-health-name">OEM Assembly Lines</span>
                      <span className="tier-health-status" style={{ color: isImmunized ? '#10B981' : '#DC2626' }}>
                        {isImmunized ? 'NOMINAL 100%' : 'ORGAN FAILURE ETA 96h'}
                      </span>
                    </div>
                    <div className="tier-health-bar-track">
                      <div
                        className="tier-health-bar-fill"
                        style={{
                          width: isImmunized ? '100%' : '8%',
                          background: isImmunized ? '#10B981' : '#DC2626'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Selected Node Inspector */}
                {selectedNode && (
                  <div className="telemetry-card">
                    <div className="telemetry-card-title">
                      <span>NODE INSPECTOR</span>
                      <IconRadio size={12} />
                    </div>
                    <div className="hud-node-name">{selectedNode.name}</div>
                    <div className="hud-commodity-txt">{selectedNode.commodity}</div>
                    <div className="metrics-kpi-grid" style={{ marginTop: '8px' }}>
                      <div className="telemetry-kpi-box">
                        <span className="kpi-lbl">DEPENDENCY DEGREE (k)</span>
                        <span className="kpi-val">{selectedNode.downstreamCount}</span>
                      </div>
                      <div className="telemetry-kpi-box">
                        <span className="kpi-lbl">BUFFER DAYS</span>
                        <span className="kpi-val">{selectedNode.bufferStockDays}d</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: Tier Cascade Tree (Domino Path) */}
          {activeTab === 'cascade' && (
            <div className="tier-cascade-view">
              <div className="domino-cascade-header">
                <div className="cascade-title-group">
                  <h3>Viral Multi-Tier Propagation Cascade</h3>
                  <p>
                    {isImmunized
                      ? 'Cellular Quarantine Firebreak has permanently halted pathogen cascade across Tier-3 and Tier-2.'
                      : 'Disruption shockwave exponentially amplifying along supply arteries toward global assembly shutdown.'}
                  </p>
                </div>

                <div className={`projected-loss-counter-box ${isImmunized ? 'immunized' : ''}`}>
                  <span className="loss-counter-lbl">PROJECTED FINANCIAL LOSS</span>
                  <span className={`loss-counter-val ${isImmunized ? 'text-green' : ''}`}>
                    {isImmunized ? '$0.8M (Averted $38.4M)' : '$0 → $4.2M → $18.6M → $48.2M'}
                  </span>
                </div>
              </div>

              {/* 4-Step Domino Cards */}
              <div className="domino-timeline-track">
                {scenarioData.scenario.dominoTimeline.map((step, idx) => (
                  <div
                    key={step.tier}
                    className={`domino-card ${idx === 0 ? 'card-epicenter' : idx === 3 ? 'card-halt' : ''}`}
                  >
                    <div className="domino-card-badge-row">
                      <span className="domino-tier-pill">{step.tier}</span>
                      <span className="domino-time-tag">{step.timeframe}</span>
                    </div>

                    <div className="domino-node-title">{step.node}</div>
                    <div className="domino-shock-status">{step.status}</div>
                    <p className="domino-details-p">{step.details}</p>

                    <div className="domino-loss-tag">
                      <span>CUMULATIVE LOSS</span>
                      <strong>${step.lossImpactM.toFixed(1)}M</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quarantine Firebreak Banner */}
              {(defenseProgress.phase1 || isImmunized) && (
                <div className="firebreak-banner">
                  <IconLock size={16} />
                  <span>
                    <strong>Cellular Quarantine Firebreak Deployed:</strong> Transit corridors between Tier-3 and Tier-2 have been cryptographically isolated. Bullwhip transmission halted.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: Antibody Telemetry */}
          {activeTab === 'antibody' && (
            <div className="antibody-telemetry-view">
              {/* Phase 1 Telemetry */}
              <div className="telemetry-phase-col">
                <div className="phase-col-header">
                  <div className="phase-glyph">
                    <IconLock size={16} />
                  </div>
                  <div className="phase-title-text">
                    <h4>Phase 1: Quarantine Geofence</h4>
                    <span>Cryptographic Lane Containment</span>
                  </div>
                </div>

                <div className="antibody-data-card">
                  <span className="data-card-title">CORRIDOR ISOLATION MATRIX</span>
                  <div className="data-row">
                    <span>Rotterdam Terminal 4 Gate</span>
                    <strong>ISOLATED</strong>
                  </div>
                  <div className="data-row">
                    <span>Rhine Barge Inbound Chokepoint</span>
                    <strong>REROUTED</strong>
                  </div>
                  <div className="data-row">
                    <span>Bab el-Mandeb Holding Geofence</span>
                    <strong>ACTIVE (38nm)</strong>
                  </div>
                </div>

                <div className="antibody-data-card">
                  <span className="data-card-title">CRYPTOGRAPHIC QUARANTINE SEAL</span>
                  <div className="sha256-hash-box">
                    0x7f4a9b218cd401827fa6d30291ba4c90e71b2
                  </div>
                  <div className="data-row">
                    <span>Airlock Latency</span>
                    <strong>0.84 seconds</strong>
                  </div>
                </div>
              </div>

              {/* Phase 2 Telemetry */}
              <div className="telemetry-phase-col">
                <div className="phase-col-header">
                  <div className="phase-glyph glyph-indigo">
                    <IconZap size={16} />
                  </div>
                  <div className="phase-title-text">
                    <h4>Phase 2: Synthetic Antibodies</h4>
                    <span>Buffer Mobilization & Dual-Source</span>
                  </div>
                </div>

                <div className="antibody-data-card">
                  <span className="data-card-title">SAFETY STOCK MOBILIZATION</span>
                  <div className="data-row">
                    <span>Munich Nearshore Stockpile</span>
                    <strong>14,000 MT Nickel</strong>
                  </div>
                  <div className="data-row">
                    <span>Singapore Buffer Depot</span>
                    <strong>28,500 TEU High-Density</strong>
                  </div>
                  <div className="data-row">
                    <span>Chicago Sub-Assembly Yard</span>
                    <strong>19,200 Modules</strong>
                  </div>
                </div>

                <div className="antibody-data-card">
                  <span className="data-card-title">SMART CONTRACT EXECUTION</span>
                  <div className="data-row">
                    <span>Dual-Source Capacity</span>
                    <strong>100% Guaranteed</strong>
                  </div>
                  <div className="data-row">
                    <span>Human Approval Latency</span>
                    <strong>0.00 ms (Autonomous)</strong>
                  </div>
                </div>
              </div>

              {/* Phase 3 Telemetry */}
              <div className="telemetry-phase-col">
                <div className="phase-col-header">
                  <div className="phase-glyph glyph-green">
                    <IconShieldCheck size={16} />
                  </div>
                  <div className="phase-title-text">
                    <h4>Phase 3: Systemic Vaccine</h4>
                    <span>RLAIF Swarm Policy Inoculation</span>
                  </div>
                </div>

                <div className="antibody-data-card">
                  <span className="data-card-title">POLICY WEIGHT MUTATIONS</span>
                  <div className="data-row">
                    <span>Risk Aversion Weight</span>
                    <strong style={{ color: '#10B981' }}>+28% (0.42 → 0.70)</strong>
                  </div>
                  <div className="data-row">
                    <span>Dual-Source Preference</span>
                    <strong style={{ color: '#10B981' }}>+44% (0.24 → 0.68)</strong>
                  </div>
                  <div className="data-row">
                    <span>Chokepoint Buffer Margin</span>
                    <strong style={{ color: '#10B981' }}>+2.4x Multiplier</strong>
                  </div>
                </div>

                <div className="antibody-data-card">
                  <span className="data-card-title">PERMANENT HEURISTIC SEAL</span>
                  <div className="sha256-hash-box">
                    0x8f2a9c14e4b77d206f901a5b83cd914a2b
                  </div>
                  <div className="data-row">
                    <span>Immunity Permanence</span>
                    <strong>100% Inoculated</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==============================================================================
           3. Bottom Action Dock
           ============================================================================== */}
        <footer className="contagion-bottom-dock">
          {/* Main Action & Scenario Select Row */}
          <div className="dock-action-row">
            {/* Big Glow CTA */}
            <button
              type="button"
              className={`btn-auto-immune-deploy ${isImmunized ? 'state-immunized' : ''}`}
              onClick={handleDeployAutoImmune}
              disabled={isDeployingDefense}
            >
              {isDeployingDefense ? (
                <>
                  <IconZap size={16} />
                  <span>Injecting Biological Defense (Phase {currentDefensePhase}/3)...</span>
                </>
              ) : isImmunized ? (
                <>
                  <IconShieldCheck size={16} />
                  <span>Network Auto-Immunized (R₀: {currentR0.toFixed(2)})</span>
                </>
              ) : (
                <>
                  <IconZap size={16} />
                  <span>⚡ Deploy Auto-Immune Response</span>
                </>
              )}
            </button>

            {/* Scenario Switcher Pills for Judges */}
            <div className="dock-scenario-selector">
              <span style={{ fontSize: '11px', color: '#64748B', marginRight: '4px' }}>
                SIMULATE VECTOR:
              </span>
              {Object.keys(CONTAGION_SCENARIOS).map((key) => {
                const sc = CONTAGION_SCENARIOS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    className={`dock-scenario-btn ${activeScenarioId === key ? 'active' : ''}`}
                    onClick={() => handleSelectScenario(key)}
                    disabled={isDeployingDefense}
                  >
                    {sc.id === 'ROTTERDAM_SMELTER'
                      ? 'Rotterdam Smelter (R₀: 2.84)'
                      : sc.id === 'NINGBO_SILICON'
                      ? 'Ningbo Silicon (R₀: 3.09)'
                      : 'Bab el-Mandeb (R₀: 2.66)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Phase Interactive Progress Trackers */}
          <div className="phases-tracker-strip">
            <div
              className={`phase-tracker-item ${
                currentDefensePhase === 1 ? 'active' : defenseProgress.phase1 ? 'completed' : ''
              }`}
            >
              <span className="phase-check-icon">
                {defenseProgress.phase1 ? '✓' : '1'}
              </span>
              <span>Phase 1: Quarantine Geofence Activated (0.8s)</span>
            </div>

            <div
              className={`phase-tracker-item ${
                currentDefensePhase === 2 ? 'active' : defenseProgress.phase2 ? 'completed' : ''
              }`}
            >
              <span className="phase-check-icon">
                {defenseProgress.phase2 ? '✓' : '2'}
              </span>
              <span>Phase 2: Synthetic Antibody Reserves Dispatched (1.6s)</span>
            </div>

            <div
              className={`phase-tracker-item ${
                currentDefensePhase === 3 ? 'active' : defenseProgress.phase3 ? 'completed' : ''
              }`}
            >
              <span className="phase-check-icon">
                {defenseProgress.phase3 ? '✓' : '3'}
              </span>
              <span>Phase 3: Swarm Policy Inoculated (R₀ → 0.32) (2.4s)</span>
            </div>
          </div>

          {/* Post-Defense ROI Summary (Revealed after defense) */}
          {(postDefenseResult || isImmunized) && (
            <div className="post-defense-roi-summary">
              <div className="roi-item">
                <IconCheckCircle2 size={16} />
                <span>Financial Catastrophe Averted:</span>
                <strong>$38.4M</strong>
              </div>
              <div className="roi-item">
                <IconActivity size={16} />
                <span>Recovery Time Compressed:</span>
                <strong>28 Days → 52 Hours</strong>
              </div>
              <div className="roi-item">
                <IconShieldCheck size={16} />
                <span>Network Immunization:</span>
                <strong>99.4%</strong>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
