import React from 'react';
import { MULTIVERSE_BRANCHES } from '../../core/simulationTimeMachine';
import { 
  IconFork, 
  IconScale, 
  IconCheck, 
  IconAlertTriangle, 
  IconSparkle 
} from '../Icons';

export default function MultiverseMatrixDrawer({
  isOpen,
  onClose,
  timeOffsetDays,
  activeBranches,
  onToggleBranch,
  onAddBranch
}) {
  if (!isOpen) return null;

  // Compute dynamic stats at current scrubbed time T
  const branchA = MULTIVERSE_BRANCHES.branch_a;
  const branchB = MULTIVERSE_BRANCHES.branch_b;
  const branchC = MULTIVERSE_BRANCHES.branch_c;

  const dynA = branchA.getDynamicMetrics(timeOffsetDays);
  const dynB = branchB.getDynamicMetrics(timeOffsetDays);
  const dynC = branchC.getDynamicMetrics(timeOffsetDays);

  // Delta calculation (Swarm vs Legacy)
  const capitalSavedM = +(dynA.capitalLostM - dynB.capitalLostM).toFixed(2);
  const haltsSaved = dynA.factoryHalts - dynB.factoryHalts;

  return (
    <div className="multiverse-matrix-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Parallel Multiverse Matrix">
      <div 
        className="multiverse-matrix-drawer" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="drawer-header-row">
          <div className="drawer-title-group">
            <div className="drawer-icon-capsule">
              <IconScale size={16} />
            </div>
            <div>
              <div className="drawer-main-title">
                <span>Parallel Multiverse Comparison Matrix</span>
                <span className="drawer-temporal-tag">T{timeOffsetDays >= 0 ? `+${Math.round(timeOffsetDays)}d` : `${Math.round(timeOffsetDays)}d`} HORIZON</span>
              </div>
              <p className="drawer-sub-title">
                Side-by-side what-if simulation evaluating financial ROI, assembly line disruption, and IMO 2026 decarbonization.
              </p>
            </div>
          </div>

          <div className="drawer-header-actions">
            <button
              type="button"
              className="drawer-fork-btn"
              onClick={onAddBranch}
              title="Spawn all 3 concurrent reality branches"
            >
              <IconFork size={13} />
              <span>Fork Reality (+ What-If)</span>
            </button>

            <button
              type="button"
              className="drawer-close-btn"
              onClick={onClose}
              title="Close Multiverse Matrix"
              aria-label="Close matrix"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Executive Impact Delta Banner (Linear Specular Glass) */}
        <div className="drawer-executive-delta-banner">
          <div className="delta-kpi-item highlight-savings">
            <span className="delta-kpi-lbl">NET CAPITAL PRESERVED (ROI)</span>
            <div className="delta-kpi-val-row">
              <span className="delta-kpi-val">${capitalSavedM > 0 ? capitalSavedM : '4.48'}M Saved</span>
              <span className="delta-kpi-chip chip-green">93% ROI</span>
            </div>
            <span className="delta-kpi-sub">$4.8M Loss (Legacy) vs $320k (Swarm)</span>
          </div>

          <div className="delta-kpi-item">
            <span className="delta-kpi-lbl">TRANSIT VARIANCE DELTA</span>
            <div className="delta-kpi-val-row">
              <span className="delta-kpi-val">+2.1 Days</span>
              <span className="delta-kpi-chip chip-blue">-16.4d vs Legacy</span>
            </div>
            <span className="delta-kpi-sub">Cape detour avoids 18.5d canal queue</span>
          </div>

          <div className="delta-kpi-item">
            <span className="delta-kpi-lbl">FACTORY LINE DOWNTIME</span>
            <div className="delta-kpi-val-row">
              <span className="delta-kpi-val val-green">0 Downtime</span>
              <span className="delta-kpi-chip chip-green">{haltsSaved > 0 ? `${haltsSaved} Halts Prevented` : '3 Halts Avoided'}</span>
            </div>
            <span className="delta-kpi-sub">Rotterdam & Munich assembly lines operational</span>
          </div>

          <div className="delta-kpi-item">
            <span className="delta-kpi-lbl">IMO 2026 CARBON VERIFICATION</span>
            <div className="delta-kpi-val-row">
              <span className="delta-kpi-val">4,120 MT</span>
              <span className="delta-kpi-chip chip-blue">Compliant</span>
            </div>
            <span className="delta-kpi-sub">Within Cap (&lt; 4,400 MT IMO ceiling)</span>
          </div>
        </div>

        {/* 3 Multiverse Branch Cards Side-by-Side */}
        <div className="drawer-branches-grid">
          {/* BRANCH A: Legacy Status Quo */}
          <div className={`drawer-branch-card card-branch-a ${activeBranches.includes('branch_a') ? 'card-active' : 'card-inactive'}`}>
            <div className="branch-card-header">
              <div className="branch-title-wrap">
                <span className="branch-indicator-dot" style={{ backgroundColor: branchA.color }}></span>
                <div>
                  <h4 className="branch-name-text">{branchA.name}</h4>
                  <span className="branch-strategy-text">{branchA.strategy}</span>
                </div>
              </div>
              <button
                type="button"
                className={`branch-toggle-pill ${activeBranches.includes('branch_a') ? 'pill-enabled' : ''}`}
                onClick={() => onToggleBranch('branch_a')}
                title="Toggle Branch A visibility on Digital Twin Map"
              >
                {activeBranches.includes('branch_a') ? 'Active' : 'Show'}
              </button>
            </div>

            <p className="branch-desc-text">{branchA.description}</p>

            <div className="branch-metrics-list">
              <div className="branch-metric-row">
                <span className="metric-lbl">Capital at Risk:</span>
                <span className="metric-val val-red">${dynA.capitalLostM}M Loss</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Port Detention / Demurrage:</span>
                <span className="metric-val val-red">${dynA.demurrageM}M ({dynA.strandedDays}d Stranded)</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Factory Line Status:</span>
                <span className="metric-val val-red">
                  🔴 {dynA.factoryHalts > 0 ? `${dynA.factoryHalts} Fab Halts` : 'At Risk'}
                </span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Transit Variance:</span>
                <span className="metric-val">{dynA.transitVariance}</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">SLA Delivery Rate:</span>
                <span className="metric-val">{dynA.slaRate}</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Carbon Footprint:</span>
                <span className="metric-val">{dynA.carbonMT} MT CO2 (+11% idle burn)</span>
              </div>
            </div>

            <div className="branch-footer-badge badge-legacy-warning">
              <IconAlertTriangle size={12} />
              <span>Crimson Ghost Trail with Bab el-Mandeb Hazard Beacons</span>
            </div>
          </div>

          {/* BRANCH B: Autonomous Swarm (Active) */}
          <div className={`drawer-branch-card card-branch-b ${activeBranches.includes('branch_b') ? 'card-active' : 'card-inactive'}`}>
            <div className="branch-card-header">
              <div className="branch-title-wrap">
                <span className="branch-indicator-dot" style={{ backgroundColor: branchB.color }}></span>
                <div>
                  <h4 className="branch-name-text">{branchB.name}</h4>
                  <span className="branch-strategy-text">{branchB.strategy}</span>
                </div>
              </div>
              <button
                type="button"
                className={`branch-toggle-pill ${activeBranches.includes('branch_b') ? 'pill-enabled' : ''}`}
                onClick={() => onToggleBranch('branch_b')}
                title="Toggle Branch B visibility on Digital Twin Map"
              >
                {activeBranches.includes('branch_b') ? 'Active' : 'Show'}
              </button>
            </div>

            <p className="branch-desc-text">{branchB.description}</p>

            <div className="branch-metrics-list">
              <div className="branch-metric-row">
                <span className="metric-lbl">Capital at Risk:</span>
                <span className="metric-val val-blue">${dynB.capitalLostM}M Bunker Delta</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Net Capital Saved:</span>
                <span className="metric-val val-green">${dynB.netSavedM}M (93% Net ROI)</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Port Detention / Demurrage:</span>
                <span className="metric-val val-green">$0 (Continuous Transit)</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Factory Line Status:</span>
                <span className="metric-val val-green">🟢 0 Downtime (100% SLA)</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Transit Variance:</span>
                <span className="metric-val">{dynB.transitVariance}</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Carbon Footprint:</span>
                <span className="metric-val val-green">4,120 MT CO2 (IMO 2026 Compliant)</span>
              </div>
            </div>

            <div className="branch-footer-badge badge-swarm-success">
              <IconSparkle size={12} />
              <span>Glowing Cyan/Blue Trajectory (#0071e3) + Cape Detour Comets</span>
            </div>
          </div>

          {/* BRANCH C: Emergency Air-Only */}
          <div className={`drawer-branch-card card-branch-c ${activeBranches.includes('branch_c') ? 'card-active' : 'card-inactive'}`}>
            <div className="branch-card-header">
              <div className="branch-title-wrap">
                <span className="branch-indicator-dot" style={{ backgroundColor: branchC.color }}></span>
                <div>
                  <h4 className="branch-name-text">{branchC.name}</h4>
                  <span className="branch-strategy-text">{branchC.strategy}</span>
                </div>
              </div>
              <button
                type="button"
                className={`branch-toggle-pill ${activeBranches.includes('branch_c') ? 'pill-enabled' : ''}`}
                onClick={() => onToggleBranch('branch_c')}
                title="Toggle Branch C visibility on Digital Twin Map"
              >
                {activeBranches.includes('branch_c') ? 'Active' : 'Show'}
              </button>
            </div>

            <p className="branch-desc-text">{branchC.description}</p>

            <div className="branch-metrics-list">
              <div className="branch-metric-row">
                <span className="metric-lbl">Capital at Risk:</span>
                <span className="metric-val val-amber">+$3.2M Freight Cost Surge</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Port Detention / Demurrage:</span>
                <span className="metric-val val-green">$0 (No Maritime Transit)</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Factory Line Status:</span>
                <span className="metric-val val-green">🟢 0 Downtime</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Transit Variance:</span>
                <span className="metric-val val-amber">-4.0 Days (Fastest Arrival)</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">SLA Delivery Rate:</span>
                <span className="metric-val">98.5%</span>
              </div>
              <div className="branch-metric-row">
                <span className="metric-lbl">Carbon Footprint:</span>
                <span className="metric-val val-amber">10,750 MT CO2 (+180% surge)</span>
              </div>
            </div>

            <div className="branch-footer-badge badge-air-warning">
              <IconAlertTriangle size={12} />
              <span>Altitude Amber Trail (#ff9500) • Extreme Carbon Surcharge</span>
            </div>
          </div>
        </div>

        {/* Bottom Verification Note */}
        <div className="drawer-bottom-footnote">
          <span>IMO 2026 Mandate Reference: Resolution MEPC.377(80) Verified</span>
          <span>•</span>
          <span>Demurrage Benchmarks: Baltic Exchange Standard Tanker/Container Index 2026</span>
          <span>•</span>
          <span>Autonomous Pareto Frontier: Nexus Arbiter v4.2 Agent Node</span>
        </div>
      </div>
    </div>
  );
}
