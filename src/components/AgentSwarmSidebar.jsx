import React from 'react';
import { 
  IconSwarm, 
  IconSliders, 
  IconRadar, 
  IconTrendingUp, 
  IconNavigation, 
  IconPackage, 
  IconShieldCheck, 
  IconDna,
  IconChevronRight,
  IconSparkle
} from './Icons';

export const AGENT_THEME_MAP = {
  sentinel: {
    color: '#00c7be',
    lightBg: 'rgba(0, 199, 190, 0.09)',
    border: 'rgba(0, 199, 190, 0.32)',
    glow: 'rgba(0, 199, 190, 0.28)',
    gradient: 'linear-gradient(135deg, rgba(0, 199, 190, 0.20), rgba(0, 245, 212, 0.06))',
    tag: 'SURVEILLANCE'
  },
  oracle: {
    color: '#bf5af2',
    lightBg: 'rgba(191, 90, 242, 0.09)',
    border: 'rgba(191, 90, 242, 0.32)',
    glow: 'rgba(191, 90, 242, 0.28)',
    gradient: 'linear-gradient(135deg, rgba(191, 90, 242, 0.20), rgba(168, 85, 247, 0.06))',
    tag: 'ECONOMETRICS'
  },
  nexus: {
    color: '#0071e3',
    lightBg: 'rgba(0, 113, 227, 0.09)',
    border: 'rgba(0, 113, 227, 0.32)',
    glow: 'rgba(0, 113, 227, 0.28)',
    gradient: 'linear-gradient(135deg, rgba(0, 113, 227, 0.20), rgba(59, 130, 246, 0.06))',
    tag: 'LOGISTICS'
  },
  synapse: {
    color: '#30d158',
    lightBg: 'rgba(48, 209, 88, 0.09)',
    border: 'rgba(48, 209, 88, 0.32)',
    glow: 'rgba(48, 209, 88, 0.28)',
    gradient: 'linear-gradient(135deg, rgba(48, 209, 88, 0.20), rgba(16, 185, 129, 0.06))',
    tag: 'INVENTORY'
  },
  gov: {
    color: '#ff9f0a',
    lightBg: 'rgba(255, 159, 10, 0.09)',
    border: 'rgba(255, 159, 10, 0.32)',
    glow: 'rgba(255, 159, 10, 0.28)',
    gradient: 'linear-gradient(135deg, rgba(255, 159, 10, 0.20), rgba(245, 158, 11, 0.06))',
    tag: 'ESCROW'
  },
  evocore: {
    color: '#ff375f',
    lightBg: 'rgba(255, 55, 95, 0.09)',
    border: 'rgba(255, 55, 95, 0.32)',
    glow: 'rgba(255, 55, 95, 0.28)',
    gradient: 'linear-gradient(135deg, rgba(255, 55, 95, 0.20), rgba(244, 63, 94, 0.06))',
    tag: 'RLAIF'
  }
};

export function getAgentIcon(agentId, size = 15) {
  switch (agentId) {
    case 'sentinel':
      return <IconRadar size={size} />;
    case 'oracle':
      return <IconTrendingUp size={size} />;
    case 'nexus':
      return <IconNavigation size={size} />;
    case 'synapse':
      return <IconPackage size={size} />;
    case 'gov':
      return <IconShieldCheck size={size} />;
    case 'evocore':
      return <IconDna size={size} />;
    default:
      return <IconSwarm size={size} />;
  }
}

export default function AgentSwarmSidebar({ agents, currentGeneration, onSelectAgent }) {
  const agentList = Object.values(agents || {});

  return (
    <aside className="apple-sidebar-panel" aria-label="Autonomous AI Agents">
      {/* Sidebar Header */}
      <div className="sidebar-header-row">
        <div className="sidebar-title-group">
          <div className="sidebar-brand-avatar">
            <IconSwarm size={15} className="sidebar-icon" />
            <span className="sidebar-icon-pulse"></span>
          </div>
          <div>
            <div className="sidebar-title-lockup">
              <h2 className="sidebar-title">Neural Swarm</h2>
              <span className="sidebar-live-pill">
                <span className="live-dot-pulse"></span>
                <span>ONLINE</span>
              </span>
            </div>
            <span className="sidebar-sub-hint">6 Autonomous Multi-Agent Nodes</span>
          </div>
        </div>
        <span className="apple-capsule-badge badge-neutral gen-capsule-badge">
          GEN {currentGeneration}
        </span>
      </div>

      {/* Agent Cards List */}
      <div className="agent-cards-container">
        {agentList.map((agent) => {
          const theme = AGENT_THEME_MAP[agent.id] || {
            color: '#0071e3',
            lightBg: 'rgba(0, 113, 227, 0.08)',
            border: 'rgba(0, 113, 227, 0.25)',
            glow: 'rgba(0, 113, 227, 0.20)',
            gradient: 'linear-gradient(135deg, rgba(0, 113, 227, 0.16), rgba(0, 199, 190, 0.06))',
            tag: agent.badge || 'NODE'
          };

          return (
            <div 
              key={agent.id} 
              className={`apple-agent-card card-${agent.id}`}
              style={{
                '--agent-theme-color': theme.color,
                '--agent-theme-border': theme.border,
                '--agent-theme-glow': theme.glow,
                '--agent-theme-bg': theme.lightBg
              }}
              onClick={() => onSelectAgent(agent)}
              title={`Inspect & Tune ${agent.name}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectAgent(agent);
                }
              }}
            >
              {/* Header with bespoke themed avatar & identity */}
              <div className="agent-card-header">
                <div 
                  className="agent-avatar-node"
                  style={{
                    background: theme.gradient,
                    borderColor: theme.border,
                    color: theme.color,
                    boxShadow: `0 2px 10px ${theme.glow}`
                  }}
                >
                  {getAgentIcon(agent.id, 16)}
                  <span className="avatar-ambient-glow" style={{ backgroundColor: theme.color }}></span>
                </div>
                
                <div className="agent-identity-wrap">
                  <div className="agent-title-row">
                    <div className="agent-title-inner">
                      <span className="agent-name-text">{agent.name}</span>
                      <IconChevronRight size={10} className="agent-inspect-arrow" />
                    </div>
                    <div className="agent-status-cluster">
                      <span className={`status-beacon-dot status-${agent.status}`}></span>
                      <span className="status-label-mono">{agent.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="agent-role-row">
                    <span className="agent-role-text">{agent.role}</span>
                    <span 
                      className="agent-badge-tag"
                      style={{
                        color: theme.color,
                        borderColor: theme.border,
                        backgroundColor: theme.lightBg
                      }}
                    >
                      {agent.badge || theme.tag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Neural Reasoning Feed (Executive AI Terminal Log) */}
              <div 
                className="agent-terminal-feed"
                style={{
                  borderLeft: `2.5px solid ${theme.color}`
                }}
              >
                <div className="terminal-header-line">
                  <span 
                    className="terminal-pulse-dot"
                    style={{
                      backgroundColor: theme.color,
                      boxShadow: `0 0 7px ${theme.color}`
                    }}
                  ></span>
                  <span className="terminal-tag">LIVE REASONING TRACE</span>
                  <span className="terminal-policy-ver">{agent.policyVersion}</span>
                </div>
                <p className="terminal-body-text">{agent.currentThought}</p>
              </div>

              {/* Card Telemetry Footer */}
              <div className="agent-card-footer">
                <div className="agent-meta-item">
                  <span className="meta-lbl">POLICY</span>
                  <span className="meta-val policy-chip">{agent.policyVersion}</span>
                </div>
                
                <div className="agent-confidence-wrap">
                  <div className="confidence-label-row">
                    <span className="meta-lbl">CONFIDENCE</span>
                    <span className="meta-val" style={{ color: theme.color }}>
                      {(agent.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="apple-progress-track">
                    <div 
                      className="apple-progress-fill" 
                      style={{ 
                        width: `${agent.confidence * 100}%`,
                        background: `linear-gradient(90deg, ${theme.color}, #00c7be)`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="agent-meta-item actions-meta-item">
                  <span className="meta-lbl">ACTIONS</span>
                  <span className="meta-val actions-pill">
                    ⚡ {agent.decisionsExecuted || 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
