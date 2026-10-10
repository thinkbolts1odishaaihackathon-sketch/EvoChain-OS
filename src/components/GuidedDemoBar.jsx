import React from 'react';
import { IconSparkle, IconPlay, IconPause, IconCheck } from './Icons';

export default function GuidedDemoBar({ 
  currentStep, 
  onSetStep, 
  isPlaying, 
  onTogglePlay, 
  onReset,
  onClose
}) {
  const steps = [
    {
      num: 1,
      title: 'Baseline Telemetry',
      badge: 'NOMINAL',
      desc: 'All 6 agents in active surveillance. 18 commercial vessels en route across Suez, Malacca, and Panama corridors. Macro metrics stable.',
      actionHint: 'Normal baseline operations.'
    },
    {
      num: 2,
      title: 'Red Sea Disruption',
      badge: 'SHOCK >2.2σ',
      desc: 'Suez chokepoint blocked. Sentinel detects 2.8σ AIS anomaly. Oracle models immediate +28.5% freight rate spike and $450M cargo value at risk.',
      actionHint: 'Injected geopolitical disruption.'
    },
    {
      num: 3,
      title: 'Swarm Consensus & Detour',
      badge: 'CONSENSUS',
      desc: 'Nexus solves 3D Pareto frontier and recommends Cape of Good Hope circumnavigation. Synapse expands EU buffers +24.5%. GovArbiter audits and issues cryptographic signature.',
      actionHint: 'Closed-loop multi-agent consensus reached.'
    },
    {
      num: 4,
      title: 'Self-Evolution & $4.8M Saved',
      badge: 'EVOLVED GEN 5',
      desc: 'Vessels autonomously diverted. Factory halts prevented. EvoCore calculates multi-objective fitness loss and mutates agent genome weights from Gen 4 to Gen 5.',
      actionHint: 'Self-evolution and ROI realized.'
    }
  ];

  const current = steps[currentStep - 1] || steps[0];

  return (
    <div className="apple-guided-demo-banner" role="region" aria-label="Judges MVP Demo Tour">
      <div className="demo-banner-left">
        <div className="demo-badge-wrap">
          <IconSparkle size={12} className="demo-sparkle" />
          <span className="demo-tag">JUDGES DEMO TOUR</span>
        </div>

        {/* Stepper Pills with Tactile Spring Transitions */}
        <div className="demo-stepper-pills" role="tablist">
          {steps.map((s) => (
            <button
              key={s.num}
              type="button"
              role="tab"
              aria-selected={currentStep === s.num}
              className={`demo-step-pill ${currentStep === s.num ? 'step-active' : currentStep > s.num ? 'step-completed' : ''}`}
              onClick={() => onSetStep(s.num)}
              title={s.title}
            >
              <span className="step-num">
                {currentStep > s.num ? <IconCheck size={10} /> : s.num}
              </span>
              <span className="step-title">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Center Narrative Explanation */}
      <div className="demo-narrative-card">
        <div className="narrative-header-row">
          <span className="narrative-step-indicator">
            STEP {current.num} OF 4: {current.title.toUpperCase()}
          </span>
          <span className={`apple-tag ${currentStep === 2 ? 'tag-red' : currentStep === 3 ? 'tag-purple' : currentStep === 4 ? 'tag-green' : 'tag-blue'}`}>
            {current.badge}
          </span>
        </div>
        <p className="narrative-text">{current.desc}</p>
      </div>

      {/* Right Controls */}
      <div className="demo-banner-right">
        <button 
          type="button"
          className={`apple-btn-pill-primary demo-play-btn ${isPlaying ? 'btn-playing' : ''}`}
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause Auto Tour' : 'Auto-play through the 4 demo milestones'}
        >
          {isPlaying ? <IconPause size={10} /> : <IconPlay size={10} />}
          <span>{isPlaying ? 'Pause' : 'Auto Tour'}</span>
        </button>

        <div className="demo-nav-btns">
          <button 
            type="button"
            className="apple-icon-btn" 
            disabled={currentStep <= 1}
            onClick={() => onSetStep(Math.max(1, currentStep - 1))}
            title="Previous Step"
            aria-label="Previous Demo Step"
          >
            ←
          </button>
          <button 
            type="button"
            className="apple-icon-btn" 
            disabled={currentStep >= 4}
            onClick={() => onSetStep(Math.min(4, currentStep + 1))}
            title="Next Step"
            aria-label="Next Demo Step"
          >
            →
          </button>
        </div>

        <button 
          type="button"
          className="demo-reset-link"
          onClick={onReset}
          title="Reset back to step 1"
        >
          Reset
        </button>

        <button 
          type="button"
          className="demo-close-x"
          onClick={onClose}
          title="Dismiss guided tour banner"
          aria-label="Close Tour"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
