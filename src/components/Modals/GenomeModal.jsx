import React from 'react';
import { IconDna } from '../Icons';

export default function GenomeModal({ isOpen, onClose, evolutionData, macroMetrics }) {
  if (!isOpen) return null;

  const genome = evolutionData.getGenome();

  return (
    <div className="apple-modal-overlay" onClick={onClose}>
      <div className="apple-sheet-card" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber"></div>
        
        <div className="sheet-header">
          <div className="sheet-title-group">
            <h3 className="sheet-title">Swarm Genome &amp; Generational Evolution</h3>
            <p className="sheet-subtitle">DSPy Prompt Compilation + Genetic Hyper-Parameter Recombination</p>
          </div>
          <button type="button" className="apple-done-btn" onClick={onClose}>Done</button>
        </div>

        <div className="sheet-content-scroll">
          {/* Top 3 KPI squircle cards */}
          <div className="sheet-kpi-grid">
            <div className="sheet-kpi-card">
              <span className="kpi-label">CURRENT GENERATION</span>
              <span className="kpi-value text-pink">Gen {evolutionData.currentGeneration}</span>
            </div>
            <div className="sheet-kpi-card">
              <span className="kpi-label">SWARM PARETO FITNESS</span>
              <span className="kpi-value text-blue">{evolutionData.fitnessScore}/100</span>
            </div>
            <div className="sheet-kpi-card">
              <span className="kpi-label">CUMULATIVE COST SAVED</span>
              <span className="kpi-value text-green">${macroMetrics.estimatedCostSavedM.toFixed(1)}M</span>
            </div>
          </div>

          {/* Active Hyper-Parameter Genome */}
          <div className="sheet-section-block">
            <h4 className="section-heading">Active Hyper-Parameter Genome</h4>
            <div className="apple-list-grouped">
              <div className="grouped-row">
                <span className="row-label">Anomaly Sigma Threshold (σ)</span>
                <span className="row-value">{genome.anomalySigmaThreshold}σ</span>
              </div>
              <div className="grouped-row">
                <span className="row-label">Air-Bridge Cargo Valuation Trigger</span>
                <span className="row-value">${genome.airBridgeThresholdPerTEU.toLocaleString()} / TEU</span>
              </div>
              <div className="grouped-row">
                <span className="row-label">Regional DC Safety Stock Multiplier</span>
                <span className="row-value">{genome.safetyBufferMultiplier}x</span>
              </div>
              <div className="grouped-row">
                <span className="row-label">Fiduciary Escrow Auto-Approval Cap</span>
                <span className="row-value">${genome.fiduciaryAutoApprovalCapM}M USD</span>
              </div>
              <div className="grouped-row">
                <span className="row-label">Bunker Fuel Hedging Sensitivity</span>
                <span className="row-value">{(genome.bunkerHedgingSensitivity * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Generational Evolution History */}
          <div className="sheet-section-block">
            <h4 className="section-heading">Generational Prompt Mutation History</h4>
            <div className="prompt-timeline">
              {evolutionData.promptEvolutionTree.map((entry) => (
                <div 
                  key={entry.gen} 
                  className={`timeline-entry ${entry.gen === evolutionData.currentGeneration ? 'timeline-active' : ''}`}
                >
                  <div className="timeline-header-row">
                    <span className="timeline-title">{entry.title}</span>
                    <span className="apple-tag tag-blue">Fitness: {entry.fitness}/100</span>
                  </div>
                  <pre className="timeline-diff-box">{entry.promptDelta}</pre>
                  <span className="timeline-note">{entry.failureMode}</span>
                </div>
              )).reverse()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
