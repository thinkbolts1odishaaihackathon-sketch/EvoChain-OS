import React from 'react';
import UserProfilePill from './Auth/UserProfilePill';
import SlidingSegmentedControl from './common/SlidingSegmentedControl';
import { 
  IconCommand, 
  IconGlobe, 
  IconSwarm, 
  IconPulse, 
  IconCpu, 
  IconDna, 
  IconPlay, 
  IconPause,
  IconSun,
  IconMoon
} from './Icons';

export default function AppleWindowHeader({ 
  simSpeed, 
  onSetSpeed, 
  isRunning, 
  onTogglePause, 
  autonomyLevel, 
  onSetAutonomy, 
  onOpenGenomeModal,
  onOpenAiModal,
  onOpenContagionModal,
  contagionState = { r0: 2.84, isOutbreak: true, isImmunized: false },
  aiEngineLabel,
  activeView = 'overview',
  onSetView,
  currentUser,
  theme = 'dark',
  onToggleTheme,
  onLockScreen,
  onOpenAuthModal
}) {
  const cycleSpeed = () => {
    const speeds = [1, 2, 5, 10];
    const nextIdx = (speeds.indexOf(simSpeed) + 1) % speeds.length;
    onSetSpeed(speeds[nextIdx]);
  };

  const cycleAutonomy = () => {
    const levels = ['ADVISORY', 'SUPERVISED', 'FULL_AUTONOMY'];
    const nextIdx = (levels.indexOf(autonomyLevel) + 1) % levels.length;
    onSetAutonomy(levels[nextIdx]);
  };

  const formatAiEngine = (rawLabel) => {
    if (!rawLabel) return { full: 'Gemini 3.8 Flash', short: 'Gemini 3.8', isLive: true };
    if (rawLabel.includes('Gemini')) {
      return { full: 'Gemini 3.8 Flash', short: 'Gemini 3.8', isLive: rawLabel.includes('Live') };
    }
    if (rawLabel.includes('OpenAI')) {
      return { full: 'OpenAI GPT-4o', short: 'GPT-4o', isLive: rawLabel.includes('Live') };
    }
    if (rawLabel.includes('Ollama') || rawLabel.includes('custom') || rawLabel.includes('Local')) {
      return { full: 'Ollama Local', short: 'Ollama', isLive: false };
    }
    return { full: 'Algorithmic L1', short: 'Local AI', isLive: false };
  };
  const aiInfo = formatAiEngine(aiEngineLabel);

  const viewOptions = [
    { id: 'overview', label: 'Command', shortLabel: 'Command', icon: <IconCommand size={13} className="pill-icon" />, shortcut: '⌘1', title: 'Command Center Overview (⌘1)' },
    { id: 'map', label: 'Digital Twin', shortLabel: 'Twin', icon: <IconGlobe size={13} className="pill-icon" />, shortcut: '⌘2', title: 'Full-Screen Digital Twin Map (⌘2)' },
    { id: 'agents', label: 'Neural Swarm', shortLabel: 'Swarm', icon: <IconSwarm size={13} className="pill-icon" />, shortcut: '⌘3', title: '6-Node Swarm Consensus Matrix (⌘3)' },
    { id: 'simulator', label: 'Crisis & ROI', shortLabel: 'Crisis', icon: <IconPulse size={13} className="pill-icon" />, shortcut: '⌘4', title: 'Crisis & Financial ROI Simulator (⌘4)' },
  ];

  return (
    <header className="apple-window-header" role="banner">
      {/* 1. Left: Brand Identity & Autonomy Governance Pill */}
      <div className="window-header-left">
        <div className="apple-app-identity" title="EvoChain-OS Autonomous Swarm">
          <div className="app-brand-glyph">
            <IconGlobe size={15} />
            <span className="brand-pulse-dot" aria-hidden="true"></span>
          </div>
          <div className="app-title-group">
            <span className="app-name">EvoChain</span>
            <span className="app-subname">OS 4.2</span>
          </div>
        </div>

        <div className="header-divider" aria-hidden="true"></div>

        {/* Autonomy Governance Pill */}
        <button 
          type="button"
          className={`apple-autonomy-chip chip-${autonomyLevel.toLowerCase()}`}
          onClick={cycleAutonomy}
          title={`Autonomous Governance: ${autonomyLevel}. Click to cycle Level 1-3.`}
          aria-label="Cycle autonomy governance level"
        >
          <span className="chip-dot"></span>
          <span className="chip-text chip-text-full">
            {autonomyLevel === 'FULL_AUTONOMY' ? 'Autonomous L3' : autonomyLevel === 'SUPERVISED' ? 'Supervised L2' : 'Advisory L1'}
          </span>
          <span className="chip-text chip-text-short">
            {autonomyLevel === 'FULL_AUTONOMY' ? 'L3' : autonomyLevel === 'SUPERVISED' ? 'L2' : 'L1'}
          </span>
        </button>

        {/* Dedicated Biological Resilience Contagion R0 Indicator Pill */}
        <button 
          type="button"
          className={`apple-contagion-pill ${contagionState?.isImmunized ? 'pill-immunized' : 'pill-outbreak'}`}
          onClick={onOpenContagionModal}
          title={`Supply Chain Contagion Engine: R₀ = ${contagionState?.r0?.toFixed(2) || '2.84'}. Click to inspect radar & deploy Auto-Immune Response.`}
          aria-label="Supply Chain Contagion Radar"
        >
          <span className="contagion-pulsing-dot" aria-hidden="true"></span>
          <span className="contagion-text">
            {contagionState?.isImmunized ? (
              <>
                <span className="contagion-text-full">🛡️ Auto-Immunized (R₀: {contagionState?.r0?.toFixed(2) || '0.32'})</span>
                <span className="contagion-text-short">🛡️ Immunized</span>
              </>
            ) : (
              <>
                <span className="contagion-text-full">🧬 Contagion R₀: {contagionState?.r0?.toFixed(2) || '2.84'}</span>
                <span className="contagion-text-short">🧬 R₀ {contagionState?.r0?.toFixed(2) || '2.84'}</span>
              </>
            )}
          </span>
        </button>
      </div>

      {/* 2. Center: Linear-Style Sliding Segmented Navigation Switcher */}
      <nav className="window-header-center" aria-label="Primary Workspace Views">
        <SlidingSegmentedControl
          options={viewOptions}
          value={activeView}
          onChange={onSetView}
          className="view-segmented"
          ariaLabel="Primary Workspace Views"
        />
      </nav>

      {/* 3. Right: Utility Controls (Clean & Focused) */}
      <div className="window-header-right">
        {/* Live AI Engine Chip */}
        <button 
          type="button"
          className="apple-ai-engine-chip"
          onClick={onOpenAiModal}
          title={`Active AI Provider: ${aiEngineLabel || 'Google Gemini 3.8 Flash (Live)'}. Click to configure API keys or switch models.`}
          aria-label="Configure Live AI Provider"
        >
          <IconCpu size={12} className="chip-icon" />
          {aiInfo.isLive && <span className="ai-live-dot" aria-hidden="true"></span>}
          <span className="chip-name chip-name-full">{aiInfo.full}</span>
          <span className="chip-name chip-name-short">{aiInfo.short}</span>
        </button>

        {/* Compact Speed & Pause Controller */}
        <div className="compact-speed-control" role="group" aria-label="Simulation Speed Controls">
          <button 
            type="button"
            className={`speed-cycle-btn ${!isRunning ? 'paused' : ''}`}
            onClick={cycleSpeed}
            title={`Speed: ${simSpeed}x. Click to cycle.`}
          >
            {simSpeed}x
          </button>
          <button 
            type="button"
            className={`pause-toggle-btn ${!isRunning ? 'active-pause' : ''}`}
            onClick={onTogglePause}
            title={isRunning ? 'Pause Simulation (Space)' : 'Resume Simulation (Space)'}
            aria-label={isRunning ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isRunning ? <IconPause size={10} /> : <IconPlay size={10} />}
          </button>
        </div>

        <div className="header-divider" aria-hidden="true"></div>

        {/* Swarm Genome Capsule */}
        <button 
          type="button"
          className="apple-btn-capsule-glass" 
          onClick={onOpenGenomeModal} 
          title="Inspect Swarm Genetic Chromosomes & Prompt Lineage"
        >
          <IconDna size={12} />
          <span>Genome</span>
        </button>

        {/* Theme Toggle Button (Obsidian Slate ↔ Crisp Porcelain) */}
        {onToggleTheme && (
          <button
            type="button"
            className="apple-theme-toggle-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Crisp Studio Porcelain (Light)' : 'Deep Obsidian Slate (Dark)'}`}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <IconSun size={13} /> : <IconMoon size={13} />}
          </button>
        )}

        <div className="header-divider" aria-hidden="true"></div>

        {/* User Profile & Auth Pill */}
        <UserProfilePill 
          currentUser={currentUser}
          onLockScreen={onLockScreen}
          onOpenAuthModal={onOpenAuthModal}
        />
      </div>
    </header>
  );
}
