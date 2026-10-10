import React, { useState, useEffect, useRef } from 'react';
import { llmService } from '../core/llmService';
import { 
  IconSwarm, 
  IconCpu, 
  IconDna, 
  IconSend, 
  IconSliders, 
  IconPlay, 
  IconRotateCcw, 
  IconShieldCheck,
  IconRadar,
  IconTrendingUp,
  IconNavigation,
  IconPackage
} from './Icons';
import { getAgentIcon, AGENT_THEME_MAP } from './AgentSwarmSidebar';

export const CONSENSUS_PIPELINE_STEPS = [
  {
    step: 1,
    id: 'sentinel',
    name: 'Sentinel Radar',
    role: 'Threat Detection',
    badge: 'SURVEILLANCE',
    avatar: 'radar',
    pitch: 'Continuous satellite AIS surveillance to intercept chokepoint interdictions and meteorological hazards.',
    storyTitle: 'Disruption Detected',
    storyDetail: 'Detects disruption at Red Sea / Bab-el-Mandeb. Threat severity 0.85 > 0.50 threshold. Broadcasts anomaly telemetry beacon.'
  },
  {
    step: 2,
    id: 'oracle',
    name: 'Market Oracle',
    role: 'Cost & Price Shock',
    badge: 'ECONOMETRICS',
    avatar: 'analyst',
    pitch: 'Bayesian predictive econometric modeling for crude oil spikes, container spot rates, and demurrage risks.',
    storyTitle: 'Macro Impact Projected',
    storyDetail: 'Models macro impact: projects +$1.4M cost risk and +48% spot freight spike across active container vessels.'
  },
  {
    step: 3,
    id: 'nexus',
    name: 'Logistics Arbiter',
    role: 'Smart Rerouting',
    badge: 'LOGISTICS',
    avatar: 'navigator',
    pitch: 'Multi-echelon Pareto frontier routing solver balancing deep ocean transit, express air cargo, and carbon burn.',
    storyTitle: 'Pareto Reroute Dispatched',
    storyDetail: 'Dispatches Cape of Good Hope detour with an urgent 20% air-bridge split for high-value semiconductors.'
  },
  {
    step: 4,
    id: 'synapse',
    name: 'Synapse Buffer',
    role: 'Stock Protection',
    badge: 'INVENTORY',
    avatar: 'warehouse',
    pitch: 'Dynamic multi-echelon safety stock calibration across regional distribution centers to dampen the bullwhip effect.',
    storyTitle: 'DC Buffers Expanded',
    storyDetail: 'Expands Rotterdam DC buffer by +24.5% to absorb arrival delay without factory downtime.'
  },
  {
    step: 5,
    id: 'gov',
    name: 'Governance Arbiter',
    role: 'Safety & Escrow',
    badge: 'GOVERNANCE',
    avatar: 'compliance',
    pitch: 'Audits ESG compliance, OFAC sanctions lists, and cryptographically signs capital escrow releases.',
    storyTitle: 'Cryptographic Escrow Signed',
    storyDetail: 'Verifies OFAC sanctions, validates IMO carbon caps, and signs 256-bit ECDSA cryptographic proof (0x7f9a...c3b1).'
  },
  {
    step: 6,
    id: 'evocore',
    name: 'EvoCore Brain',
    role: 'Self-Evolution',
    badge: 'EVOLUTION',
    avatar: 'brain',
    pitch: 'Applies genetic algorithms and RLAIF prompt mutation to evolve policy chromosomes after disruption events.',
    storyTitle: 'Genomic Evolution Triggered',
    storyDetail: 'Evolving baseline generation Gen 4 ➔ Gen 5, boosting Pareto fitness score to 91.2%.'
  }
];

export const AGENT_NODE_TELEMETRY = {
  sentinel: { pubKey: '0x7F9A...C3B1', weight: '1.20x', latency: '12ms' },
  oracle: { pubKey: '0x3E84...A9F0', weight: '1.35x', latency: '18ms' },
  nexus: { pubKey: '0xB512...82C4', weight: '1.50x', latency: '22ms' },
  synapse: { pubKey: '0x98A1...5E0D', weight: '1.25x', latency: '14ms' },
  gov: { pubKey: '0x42C9...71BA', weight: '1.60x', latency: '16ms' },
  evocore: { pubKey: '0x1F6B...30A8', weight: '1.55x', latency: '24ms' }
};

export default function AgentSwarmMatrixView({ 
  agents, 
  currentGeneration = 4, 
  fitnessScore = 88.4, 
  onSelectAgent,
  onOpenGenomeModal,
  onOpenAiModal,
  onUpdatePolicy,
  onDispatchDirective,
  onInjectScenario,
  onResolveScenario,
  onTriggerEvolution,
  activeScenario,
  messages = []
}) {
  const agentList = Object.values(agents || {});
  const [commandInputs, setCommandInputs] = useState({});
  const [activeRelayStep, setActiveRelayStep] = useState(null);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoBanner, setDemoBanner] = useState(null);
  const [dynamicConfidences, setDynamicConfidences] = useState({});
  const [celebrationBounce, setCelebrationBounce] = useState(false);
  const demoTimersRef = useRef([]);

  // Clear demo timers on unmount
  useEffect(() => {
    return () => {
      demoTimersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  // Sync active relay step from message bus in real time
  useEffect(() => {
    if (!messages.length) return;
    const latest = messages[0];
    if (latest.type === 'EARLY_WARNING_DISRUPTION') {
      setActiveRelayStep(1);
    } else if (latest.type === 'MACRO_IMPACT_FORECAST') {
      setActiveRelayStep(2);
    } else if (latest.type === 'LOGISTICS_RE-ROUTING_PROPOSAL') {
      setActiveRelayStep(3);
    } else if (latest.type === 'INVENTORY_BUFFER_RECALIBRATED') {
      setActiveRelayStep(4);
    } else if (latest.type === 'AUTONOMOUS_EXECUTION_AUTHORIZED') {
      setActiveRelayStep(5);
    } else if (latest.type === 'SWARM_POLICY_EVOLVED') {
      setActiveRelayStep(6);
      setCelebrationBounce(true);
      setTimeout(() => setCelebrationBounce(false), 2200);

      setDemoBanner({
        title: 'AUTONOMOUS CONSENSUS SEALED ACROSS 6 AGENTS',
        amount: '$4.8M Capital Protected',
        escrow: '0x7f9a882c...9b31 (256-bit ECDSA)',
        evolution: `Gen ${currentGeneration + 1} Evolved (+2.4% Pareto Resilience)`
      });
      setIsDemoRunning(false);
    } else if (latest.type === 'DISRUPTION_RESTORED') {
      setActiveRelayStep(null);
      setDemoBanner(null);
      setIsDemoRunning(false);
    }
  }, [messages, currentGeneration]);

  const handleCommandChange = (agentId, text) => {
    setCommandInputs(prev => ({ ...prev, [agentId]: text }));
  };

  const handleCommandSubmit = (e, agentId) => {
    e.preventDefault();
    const text = commandInputs[agentId];
    if (text && text.trim() && onDispatchDirective) {
      onDispatchDirective(agentId, text.trim());
      setCommandInputs(prev => ({ ...prev, [agentId]: '' }));
    }
  };

  // Slider change with real-time confidence recalculation
  const handleSliderChange = (agent, key, rawVal) => {
    const val = parseFloat(rawVal);
    const updatedWeights = {
      ...agent.policyWeights,
      [key]: val
    };

    const risk = updatedWeights.riskAversion ?? 0.65;
    const speed = updatedWeights.speedPriority ?? 0.80;
    const esg = updatedWeights.esgCarbonCap ?? 0.70;
    
    const synergy = 0.86 + (risk * 0.04) + (speed * 0.05) + (esg * 0.04);
    const newConf = Math.min(0.99, Math.max(0.70, +synergy.toFixed(2)));

    setDynamicConfidences(prev => ({ ...prev, [agent.id]: newConf }));

    if (onUpdatePolicy) {
      onUpdatePolicy(agent.id, updatedWeights, agent.activePrompt);
    }
  };

  // 1-Click "Judge Showcase / Auto-Demo" triggers live synchronized 6-stage cascade
  const handleRunJudgeDemo = () => {
    if (isDemoRunning) return;

    setIsDemoRunning(true);
    setDemoBanner(null);
    setActiveRelayStep(1);

    if (onInjectScenario) {
      onInjectScenario('RED_SEA_MISSILE_CRISIS');
    }
  };

  const handleResetRelay = () => {
    setIsDemoRunning(false);
    setActiveRelayStep(null);
    setDemoBanner(null);
    if (onResolveScenario) {
      onResolveScenario();
    }
  };

  const activeStepMeta = activeRelayStep 
    ? CONSENSUS_PIPELINE_STEPS.find(s => s.step === activeRelayStep)
    : null;

  return (
    <div className="apple-swarm-matrix-view apple-matrix-workspace" role="region" aria-label="Autonomous Multi-Agent Swarm Matrix">
      {/* 1. MASTER SWARM COMMAND DECK (Unified Orchestration Cockpit) */}
      <section className="swarm-command-deck" aria-label="Swarm Orchestration Deck">
        {/* Top Deck: Identity & Primary Actions */}
        <div className="deck-header-row">
          <div className="deck-identity-group">
            <div className="deck-glyph-halo">
              <IconSwarm size={20} className="deck-glyph-icon" />
              <span className="deck-radar-pulse" aria-hidden="true" />
            </div>
            <div className="deck-meta-titles">
              <div className="deck-badge-line">
                <span className="live-status-dot" />
                <span className="deck-badge-text">AUTONOMOUS MULTI-AGENT SWARM</span>
                <span className="deck-badge-sep">•</span>
                <span className="deck-badge-sub">6 BFT CONSENSUS NODES</span>
              </div>
              <h2 className="deck-title">EvoChain Neural Swarm</h2>
              <p className="deck-subtitle">
                Autonomous cognitive agents negotiating Pareto-optimal crisis resolution with BFT Byzantine Fault Tolerant consensus.
              </p>
            </div>
          </div>

          <div className="deck-controls-cluster">
            {/* Primary Action Button: 1-Click Judge Showcase */}
            <button 
              type="button" 
              className={`apple-judge-demo-btn ${isDemoRunning ? 'demo-running' : ''}`}
              onClick={handleRunJudgeDemo}
              disabled={isDemoRunning}
              title="Execute choreographed 6-stage Red Sea crisis consensus"
            >
              <span className="demo-btn-content">
                <IconPlay size={13} className={isDemoRunning ? 'spin-icon' : ''} />
                <span>{isDemoRunning ? 'Executing Consensus Cascade...' : 'Run Swarm Consensus (Judge Demo)'}</span>
              </span>
              {isDemoRunning && <span className="demo-btn-pulse-wave" />}
            </button>

            {activeRelayStep && (
              <button 
                type="button" 
                className="apple-btn-pill-secondary reset-relay-btn" 
                onClick={handleResetRelay}
                title="Reset crisis scenario & return to nominal surveillance"
              >
                <IconRotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}

            <button type="button" className="apple-btn-pill-secondary" onClick={onOpenAiModal} title="Configure live AI provider">
              <IconCpu size={12} />
              <span>Engine: {llmService.getActiveProviderName()}</span>
            </button>

            <button 
              type="button" 
              className={`apple-btn-pill-secondary ${celebrationBounce ? 'haptic-celebration-bounce' : ''}`} 
              onClick={onOpenGenomeModal}
              title="Inspect genetic prompt chromosome fitness"
            >
              <IconDna size={12} />
              <span>Genome: Gen {currentGeneration} ({fitnessScore}% Fitness)</span>
            </button>
          </div>
        </div>

        {/* Mid Deck: Integrated BFT Quorum Telemetry Rail */}
        <div className="deck-quorum-rail">
          <div className="quorum-rail-left">
            <span className="quorum-rail-label">BFT QUORUM STATUS</span>
            <span className="quorum-rail-status">
              {isDemoRunning 
                ? `CASCADE IN FLIGHT (STAGE ${activeRelayStep || 1}/6)` 
                : activeRelayStep 
                  ? `QUORUM COMMITTED (STAGE ${activeRelayStep}/6)` 
                  : 'UNANIMOUS QUORUM (6/6 NODES COMMITTED)'}
            </span>
            <div className="quorum-mini-track" role="progressbar" aria-label="Consensus quorum">
              <div 
                className="quorum-mini-fill" 
                style={{ width: isDemoRunning ? '66.7%' : activeRelayStep ? '83.3%' : '100%' }}
              />
            </div>
          </div>

          <div className="quorum-rail-right">
            <span className="quorum-pill-metric pill-proof" title="ECDSA Cryptographic Signature Proof">
              <span className="proof-beacon" />
              ECDSA SHA-256 PROOF
            </span>
            <span className="quorum-pill-metric pill-latency" title="Round-trip consensus latency">
              τ = {isDemoRunning ? '34.2ms' : '16.8ms'} BFT LATENCY
            </span>
            <span className="quorum-pill-metric pill-weight" title="Cumulative voting weight across active nodes">
              WEIGHT: 8.45x
            </span>
          </div>
        </div>

        {/* 6-Stage Sequential Pipeline Track */}
        <div className="deck-pipeline-track" role="tablist" aria-label="6-Stage Consensus Pipeline">
          {CONSENSUS_PIPELINE_STEPS.map((stepItem, idx) => {
            const isActive = activeRelayStep === stepItem.step;
            const isCompleted = activeRelayStep !== null && activeRelayStep > stepItem.step;
            const theme = AGENT_THEME_MAP[stepItem.id] || { color: '#0071e3', lightBg: 'rgba(0,113,227,0.1)', border: 'rgba(0,113,227,0.3)', glow: 'rgba(0,113,227,0.2)' };

            return (
              <React.Fragment key={stepItem.id}>
                <div 
                  className={`pipeline-node-chip ${isActive ? 'chip-active' : ''} ${isCompleted ? 'chip-completed' : ''}`}
                  onClick={() => setActiveRelayStep(stepItem.step)}
                  role="button"
                  tabIndex={0}
                  title={`Stage ${stepItem.step}: ${stepItem.name} — ${stepItem.pitch}`}
                  style={{
                    '--node-accent': theme.color,
                    '--node-bg': theme.lightBg,
                    '--node-border': theme.border,
                    '--node-glow': theme.glow
                  }}
                >
                  <div className="pipeline-node-avatar">
                    <span className="node-avatar-icon" style={{ color: isActive ? theme.color : isCompleted ? '#34c759' : theme.color }}>
                      {getAgentIcon(stepItem.id, 14)}
                    </span>
                    {isActive && <span className="node-ring-pulse" style={{ borderColor: theme.color }} />}
                    {isCompleted && (
                      <span className="node-completed-check">
                        <IconCheck size={9} />
                      </span>
                    )}
                  </div>
                  <div className="pipeline-node-meta">
                    <div className="node-step-legend">
                      <span>STEP {stepItem.step}</span>
                      {isActive && <span className="active-dot" style={{ backgroundColor: theme.color }} />}
                    </div>
                    <div className="node-title-line">{stepItem.name}</div>
                    <div className="node-role-sub">{stepItem.role}</div>
                  </div>
                </div>

                {idx < CONSENSUS_PIPELINE_STEPS.length - 1 && (
                  <div className={`pipeline-rail-divider ${isActive || isCompleted ? 'rail-active' : ''}`}>
                    <div className="rail-line" />
                    <span className="rail-arrow">›</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Narrative Telemetry Terminal (Bottom of Command Deck) */}
        {activeStepMeta ? (
          <div className="deck-narrative-bar" style={{ borderLeftColor: (AGENT_THEME_MAP[activeStepMeta.id]?.color || 'var(--apple-blue)') }}>
            <div 
              className="narrative-step-pill"
              style={{
                backgroundColor: AGENT_THEME_MAP[activeStepMeta.id]?.lightBg || 'rgba(0,113,227,0.1)',
                color: AGENT_THEME_MAP[activeStepMeta.id]?.color || 'var(--apple-blue)'
              }}
            >
              STEP {activeStepMeta.step}: {activeStepMeta.name.toUpperCase()}
            </div>
            <div className="narrative-body">
              <span className="narrative-lead">{activeStepMeta.storyTitle}: </span>
              <span className="narrative-text">{activeStepMeta.storyDetail}</span>
            </div>
          </div>
        ) : (
          <div className="deck-narrative-bar narrative-standby">
            <span className="standby-pulse-beacon" />
            <div className="narrative-body">
              <span className="narrative-lead">Standby Surveillance: </span>
              <span className="narrative-text">
                6 neural nodes continuously monitoring global maritime telemetry across 14 vessels. Click <strong>"Run Swarm Consensus"</strong> to simulate closed-loop Red Sea crisis resolution.
              </span>
            </div>
          </div>
        )}

        {/* Celebratory Completion Alert */}
        {demoBanner && (
          <div className="deck-celebration-banner">
            <div className="celebration-brand">
              <IconShieldCheck size={16} />
              <span>{demoBanner.title}</span>
            </div>
            <div className="celebration-metrics-row">
              <span className="celebration-chip"><strong>Escrow:</strong> {demoBanner.amount}</span>
              <span className="celebration-chip"><strong>Signature:</strong> <code>{demoBanner.escrow}</code></span>
              <span className="celebration-chip"><strong>Evolution:</strong> {demoBanner.evolution}</span>
            </div>
          </div>
        )}
      </section>

      {/* 2. PRECISION 6-NODE AUTONOMOUS AGENT MATRIX */}
      <div className="swarm-matrix-grid">
        {agentList.map((agent) => {
          const confidence = dynamicConfidences[agent.id] ?? agent.confidence ?? 0.94;
          const weights = agent.policyWeights || { riskAversion: 0.65, speedPriority: 0.80, esgCarbonCap: 0.70 };
          const isHighlighted = activeStepMeta && activeStepMeta.id === agent.id;
          const nodeTelemetry = AGENT_NODE_TELEMETRY[agent.id] || { pubKey: '0x7F9A...C3B1', weight: '1.20x', latency: '16ms' };
          const theme = AGENT_THEME_MAP[agent.id] || {
            color: '#0071e3',
            lightBg: 'rgba(0, 113, 227, 0.09)',
            border: 'rgba(0, 113, 227, 0.32)',
            glow: 'rgba(0, 113, 227, 0.28)',
            tag: agent.badge
          };

          return (
            <div 
              key={agent.id}
              className={`apple-matrix-agent-card card-${agent.id} ${isHighlighted ? 'matrix-card-active-step' : ''}`}
              style={{
                '--agent-color': theme.color,
                '--agent-light-bg': theme.lightBg,
                '--agent-border': theme.border,
                '--agent-glow': theme.glow,
                borderTop: `3px solid ${theme.color}`
              }}
            >
              {/* Agent Header */}
              <div className="matrix-card-header">
                <div 
                  className="matrix-avatar-node"
                  style={{
                    backgroundColor: theme.lightBg,
                    borderColor: theme.border,
                    color: theme.color,
                    boxShadow: `0 0 14px ${theme.glow}`
                  }}
                >
                  {getAgentIcon(agent.id, 16)}
                </div>
                
                <div className="matrix-agent-info">
                  <div className="matrix-title-row">
                    <h3 className="matrix-agent-name">{agent.name}</h3>
                    <div className="agent-status-cluster">
                      <span className={`status-beacon-dot status-${agent.status}`}></span>
                      <span className="status-label-mono">{agent.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="matrix-badge-row">
                    <span className="matrix-role-text">{agent.role}</span>
                    <span 
                      className="matrix-badge-code"
                      style={{
                        color: theme.color,
                        backgroundColor: theme.lightBg,
                        borderColor: theme.border
                      }}
                    >
                      {agent.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Node Cryptographic Telemetry Strip (Clean, high-density, no cheesy emojis) */}
              <div className="matrix-node-telemetry-strip">
                <span className="telemetry-pill-mono">Node: <code>{nodeTelemetry.pubKey}</code></span>
                <span className="telemetry-divider">·</span>
                <span className="telemetry-pill-mono">Weight: <strong>{nodeTelemetry.weight}</strong></span>
                <span className="telemetry-divider">·</span>
                <span className="telemetry-pill-mono">Latency: <strong>{nodeTelemetry.latency}</strong></span>
              </div>

              {/* Mission Statement */}
              {agent.pitch && (
                <p className="matrix-pitch-summary">{agent.pitch}</p>
              )}

              {/* Live Neural Reasoning Stream (Obsidian Stream) */}
              <div 
                className="matrix-thought-stream"
                style={{ borderLeftColor: theme.color }}
              >
                <div className="thought-stream-header">
                  <span className="thought-stream-label">
                    <span className="thought-stream-dot" style={{ backgroundColor: theme.color }} />
                    LIVE NEURAL REASONING
                  </span>
                  <span className="thought-version-pill">{agent.policyVersion || 'v1.0.4'}</span>
                </div>
                <p className="thought-stream-code">{agent.currentThought}</p>
              </div>

              {/* Engineered Policy Controls (Interactive Sliders) */}
              <div className="matrix-sliders-section">
                <div className="sliders-section-heading">ENGINEERED POLICY WEIGHTS</div>
                
                {/* 1. Risk Aversion */}
                <div className="slider-item-row">
                  <div className="slider-item-header">
                    <span className="slider-name">Risk Aversion</span>
                    <span className="slider-bounds">Low ↔ High</span>
                    <span className="slider-value" style={{ color: theme.color }}>
                      {((weights.riskAversion ?? 0.65) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    className="engineered-range"
                    value={weights.riskAversion ?? 0.65}
                    onChange={(e) => handleSliderChange(agent, 'riskAversion', e.target.value)}
                    style={{
                      background: `linear-gradient(to right, ${theme.color} 0%, ${theme.color} ${((weights.riskAversion ?? 0.65) * 100)}%, rgba(0,0,0,0.08) ${((weights.riskAversion ?? 0.65) * 100)}%, rgba(0,0,0,0.08) 100%)`
                    }}
                  />
                </div>

                {/* 2. Speed Priority */}
                <div className="slider-item-row">
                  <div className="slider-item-header">
                    <span className="slider-name">Speed Priority</span>
                    <span className="slider-bounds">Economy ↔ Express</span>
                    <span className="slider-value" style={{ color: theme.color }}>
                      {((weights.speedPriority ?? 0.80) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    className="engineered-range"
                    value={weights.speedPriority ?? 0.80}
                    onChange={(e) => handleSliderChange(agent, 'speedPriority', e.target.value)}
                    style={{
                      background: `linear-gradient(to right, ${theme.color} 0%, ${theme.color} ${((weights.speedPriority ?? 0.80) * 100)}%, rgba(0,0,0,0.08) ${((weights.speedPriority ?? 0.80) * 100)}%, rgba(0,0,0,0.08) 100%)`
                    }}
                  />
                </div>

                {/* 3. ESG Carbon Cap */}
                <div className="slider-item-row">
                  <div className="slider-item-header">
                    <span className="slider-name">ESG Carbon Cap</span>
                    <span className="slider-bounds">Flexible ↔ Strict</span>
                    <span className="slider-value" style={{ color: theme.color }}>
                      {((weights.esgCarbonCap ?? 0.70) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    className="engineered-range"
                    value={weights.esgCarbonCap ?? 0.70}
                    onChange={(e) => handleSliderChange(agent, 'esgCarbonCap', e.target.value)}
                    style={{
                      background: `linear-gradient(to right, ${theme.color} 0%, ${theme.color} ${((weights.esgCarbonCap ?? 0.70) * 100)}%, rgba(0,0,0,0.08) ${((weights.esgCarbonCap ?? 0.70) * 100)}%, rgba(0,0,0,0.08) 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Direct Neural Command Prompt Input */}
              <form 
                className="matrix-prompt-form"
                onSubmit={(e) => handleCommandSubmit(e, agent.id)}
              >
                <input 
                  type="text"
                  className="matrix-prompt-input"
                  placeholder={`Dispatch neural prompt to ${agent.name}...`}
                  value={commandInputs[agent.id] || ''}
                  onChange={(e) => handleCommandChange(agent.id, e.target.value)}
                />
                <button 
                  type="submit" 
                  className="matrix-prompt-send-btn"
                  title="Execute prompt via LLM neural inference"
                  disabled={!commandInputs[agent.id]?.trim()}
                  style={{ backgroundColor: commandInputs[agent.id]?.trim() ? theme.color : undefined }}
                >
                  <IconSend size={11} />
                </button>
              </form>

              {/* Card Footer: Real-time Confidence, Decisions, and Deep Studio */}
              <div className="matrix-card-footer">
                <div className="matrix-confidence-group">
                  <div className="confidence-label-row">
                    <span className="confidence-title">CONFIDENCE</span>
                    <span className="confidence-num" style={{ color: theme.color }}>
                      {(confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="apple-progress-track">
                    <div 
                      className="apple-progress-fill" 
                      style={{ 
                        width: `${confidence * 100}%`,
                        background: `linear-gradient(90deg, ${theme.color}88, ${theme.color})`,
                        boxShadow: `0 0 8px ${theme.glow}`
                      }}
                    />
                  </div>
                </div>

                <div className="matrix-actions-group">
                  <span className="actions-title">DECISIONS</span>
                  <span className="actions-num">{agent.decisionsExecuted || 0}</span>
                </div>

                <button 
                  type="button"
                  className="apple-btn-pill-secondary matrix-studio-btn"
                  onClick={() => onSelectAgent(agent)}
                  title="Open Deep Tuning Studio"
                >
                  <IconSliders size={11} />
                  <span>Deep Studio</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
