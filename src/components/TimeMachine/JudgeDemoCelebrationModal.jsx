import React, { useEffect } from 'react';
import { IconTrophy, IconSparkle, IconCheck, IconScale, IconPlay } from '../Icons';

export default function JudgeDemoCelebrationModal({
  isOpen,
  onClose,
  onOpenMatrix,
  onScrubToT30,
  onReplayDemo
}) {
  if (!isOpen) return null;

  return (
    <div className="celebration-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Simulation Scorecard">
      <div 
        className="celebration-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="celebration-glow-aura" aria-hidden="true"></div>

        {/* Header with Trophy Emblem */}
        <div className="celebration-header">
          <div className="celebration-trophy-badge">
            <IconTrophy size={26} className="trophy-glyph" />
            <span className="trophy-sparkle-ring"></span>
          </div>
          <span className="celebration-pill-tag">AUTONOMOUS MULTIVERSE VERIFIED</span>
          <h2 className="celebration-title">
            $4.48M Capital Protected &amp; 0 Factory Downtime
          </h2>
          <p className="celebration-sub">
            Choreographed simulation verified at <strong>T+14 Days (Mid-Term Horizon)</strong>. The multi-agent swarm successfully avoided 18.5 days of canal deadlock and protected 3 mission-critical production lines.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="celebration-score-grid">
          <div className="score-card score-highlight-green">
            <span className="score-label">NET CAPITAL SAVED</span>
            <div className="score-main-val val-green">$4.48M</div>
            <span className="score-sub-note">93% Net ROI vs Legacy $4.8M Loss</span>
          </div>

          <div className="score-card">
            <span className="score-label">FACTORY LINE INTEGRITY</span>
            <div className="score-main-val val-green">0 Halts</div>
            <span className="score-sub-note">3 European Assembly Lines Saved</span>
          </div>

          <div className="score-card">
            <span className="score-label">PORT DEMURRAGE FEES</span>
            <div className="score-main-val val-blue">$0.00</div>
            <span className="score-sub-note">$2.4M Detention Fees Avoided</span>
          </div>

          <div className="score-card">
            <span className="score-label">IMO 2026 DECARBONIZATION</span>
            <div className="score-main-val val-blue">4,120 MT</div>
            <span className="score-sub-note">100% Compliant (Resolution MEPC.377)</span>
          </div>
        </div>

        {/* Milestone Breakdown Row */}
        <div className="celebration-timeline-recap">
          <div className="recap-step">
            <span className="recap-dot dot-red"></span>
            <div>
              <span className="recap-time">T-3d</span>
              <p className="recap-desc">Missile NOTAM detected by Sentinel</p>
            </div>
          </div>
          <span className="recap-arrow">→</span>
          <div className="recap-step">
            <span className="recap-dot dot-blue"></span>
            <div>
              <span className="recap-time">T0</span>
              <p className="recap-desc">Swarm Consensus authorizes Cape Detour</p>
            </div>
          </div>
          <span className="recap-arrow">→</span>
          <div className="recap-step">
            <span className="recap-dot dot-purple"></span>
            <div>
              <span className="recap-time">T+7d</span>
              <p className="recap-desc">Synapse rebalances EU inventory buffer</p>
            </div>
          </div>
          <span className="recap-arrow">→</span>
          <div className="recap-step">
            <span className="recap-dot dot-green"></span>
            <div>
              <span className="recap-time">T+14d</span>
              <p className="recap-desc">Nominal Cape transit; 0 delays</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="celebration-actions-row">
          <button
            type="button"
            className="celebration-btn-secondary"
            onClick={onReplayDemo}
            title="Replay the 6-second demonstration"
          >
            <IconPlay size={12} />
            <span>Replay Demo</span>
          </button>

          <button
            type="button"
            className="celebration-btn-secondary"
            onClick={onOpenMatrix}
            title="Inspect side-by-side branch comparison matrix"
          >
            <IconScale size={13} />
            <span>Compare Multiverse Matrix</span>
          </button>

          <button
            type="button"
            className="celebration-btn-primary"
            onClick={onScrubToT30}
            title="Fast forward to long-term T+30d equilibrium"
          >
            <span>Advance to T+30d Horizon →</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          className="celebration-close-x"
          onClick={onClose}
          aria-label="Close scorecard"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
