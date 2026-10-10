import React from 'react';
import { IconAlertTriangle, IconCheck, IconDna, IconRadar, IconLock, IconShieldCheck } from './Icons';
import { authService } from '../core/authService';

export default function ControlCenter({ 
  onInjectScenario, 
  onResolveScenario, 
  onTriggerEvolution, 
  evolutionGenome, 
  vessels, 
  onSelectVessel,
  currentUser 
}) {
  const canInjectCrisis = authService.canInjectCrisis();
  const canEvolveGenome = authService.canEvolveGenome();
  const user = currentUser || authService.getCurrentUser();

  const handleScenarioClick = (scenarioKey) => {
    if (!canInjectCrisis) return;
    onInjectScenario(scenarioKey);
  };

  const handleEvolutionClick = () => {
    if (!canEvolveGenome) return;
    onTriggerEvolution();
  };

  return (
    <aside className="apple-control-panel" aria-label="Control Center and Manifests">
      {/* 1. Chaos & Disruption Stress Testing Module */}
      <div className="apple-widget-card">
        <div className="widget-header">
          <div className="widget-header-title-wrap">
            <span className="widget-title">Disruption Injector</span>
            {!canInjectCrisis && (
              <span className="apple-tag tag-neutral rbac-gated-pill" title="Compliance clearance restricts crisis injection">
                <IconLock size={9} /> AUDITOR READ-ONLY
              </span>
            )}
            {canInjectCrisis && (
              <span className="apple-tag tag-hazard">CHAOS ENGINE</span>
            )}
          </div>
        </div>

        <p className="widget-description">
          {canInjectCrisis 
            ? 'Inject real-time geopolitical, meteorological, or macroeconomic shocks to test swarm consensus.'
            : 'Compliance clearance active. Direct chaos injection restricted for Risk Auditor. Switch profile to trigger.'}
        </p>

        <div className={`scenario-buttons-grid ${!canInjectCrisis ? 'rbac-disabled-grid' : ''}`}>
          <button 
            type="button"
            className={`apple-action-tile tile-crisis ${!canInjectCrisis ? 'tile-restricted' : ''}`}
            onClick={() => handleScenarioClick('RED_SEA_MISSILE_CRISIS')}
            disabled={!canInjectCrisis}
            title={canInjectCrisis ? "Inject Bab el-Mandeb Red Sea Naval Threat" : "Restricted: Requires INJECT_CRISIS permission"}
          >
            <span className="tile-indicator indicator-hazard"></span>
            <div className="tile-text-wrap">
              <span className="tile-title">Red Sea Threat</span>
              <span className="tile-sub">Bab el-Mandeb Interdiction</span>
            </div>
            {!canInjectCrisis && <IconLock size={12} className="tile-lock-icon" />}
          </button>

          <button 
            type="button"
            className={`apple-action-tile tile-crisis ${!canInjectCrisis ? 'tile-restricted' : ''}`}
            onClick={() => handleScenarioClick('TAIWAN_SUPER_TYPHOON')}
            disabled={!canInjectCrisis}
            title={canInjectCrisis ? "Inject Taiwan Strait Super Typhoon" : "Restricted: Requires INJECT_CRISIS permission"}
          >
            <span className="tile-indicator indicator-hazard"></span>
            <div className="tile-text-wrap">
              <span className="tile-title">Super Typhoon</span>
              <span className="tile-sub">Taiwan Strait Closure</span>
            </div>
            {!canInjectCrisis && <IconLock size={12} className="tile-lock-icon" />}
          </button>

          <button 
            type="button"
            className={`apple-action-tile tile-crisis ${!canInjectCrisis ? 'tile-restricted' : ''}`}
            onClick={() => handleScenarioClick('ROTTERDAM_STRIKE_DROUGHT')}
            disabled={!canInjectCrisis}
            title={canInjectCrisis ? "Inject Port of Rotterdam Strike & Rhine Drought" : "Restricted: Requires INJECT_CRISIS permission"}
          >
            <span className="tile-indicator indicator-hazard"></span>
            <div className="tile-text-wrap">
              <span className="tile-title">Rotterdam Strike</span>
              <span className="tile-sub">Rhine Water Drought</span>
            </div>
            {!canInjectCrisis && <IconLock size={12} className="tile-lock-icon" />}
          </button>

          <button 
            type="button"
            className={`apple-action-tile tile-crisis ${!canInjectCrisis ? 'tile-restricted' : ''}`}
            onClick={() => handleScenarioClick('CRUDE_OIL_SUPPLY_SHOCK')}
            disabled={!canInjectCrisis}
            title={canInjectCrisis ? "Inject OPEC+ Global Fuel Surcharge Shock" : "Restricted: Requires INJECT_CRISIS permission"}
          >
            <span className="tile-indicator indicator-hazard"></span>
            <div className="tile-text-wrap">
              <span className="tile-title">OPEC+ Oil Shock</span>
              <span className="tile-sub">+38% Marine Bunker Spike</span>
            </div>
            {!canInjectCrisis && <IconLock size={12} className="tile-lock-icon" />}
          </button>

          <button 
            type="button"
            className={`apple-action-tile tile-restore ${!canInjectCrisis ? 'tile-restricted' : ''}`}
            onClick={onResolveScenario}
            disabled={!canInjectCrisis}
            title={canInjectCrisis ? "Normalize all corridors and restore fleet to nominal" : "Restricted: Requires INJECT_CRISIS permission"}
          >
            <span className="tile-indicator indicator-nominal"></span>
            <div className="tile-text-wrap">
              <span className="tile-title">Restore Nominal</span>
              <span className="tile-sub">Clear Disruption Vectors</span>
            </div>
            {!canInjectCrisis && <IconLock size={12} className="tile-lock-icon" />}
          </button>
        </div>
      </div>

      {/* 2. Swarm Evolution Engine Widget */}
      <div className="apple-widget-card">
        <div className="widget-header">
          <span className="widget-title">Swarm Evolution Engine</span>
          <button 
            type="button"
            className={`apple-btn-micro ${!canEvolveGenome ? 'btn-restricted' : ''}`}
            onClick={handleEvolutionClick}
            disabled={!canEvolveGenome}
            title={canEvolveGenome ? "Mutate agent chromosomes through RLAIF prompt synthesis" : "Restricted: Read-only audit clearance"}
          >
            {canEvolveGenome ? '+ Step Mutation' : <span className="btn-locked-inner"><IconLock size={9} /> Read-Only</span>}
          </button>
        </div>
        <div className="evo-metrics-row">
          <div className="evo-score-circle">
            <span className="score-number">{evolutionGenome.fitnessScore}</span>
            <span className="score-max">/100</span>
          </div>
          <div className="evo-details-col">
            <span className="evo-gen-label">GENERATION {evolutionGenome.currentGeneration}</span>
            <span className="evo-subtext">RLAIF Generational Prompt Compiler</span>
            <span className="apple-tag tag-neutral">PARETO OPTIMAL</span>
          </div>
        </div>
      </div>

      {/* 3. Monitored Fleet Manifest (Stitch High-Density Telemetry Table) */}
      <div className="apple-widget-card fleet-widget">
        <div className="widget-header">
          <span className="widget-title">Monitored Fleet Manifest</span>
          <span className="apple-tag tag-neutral">{vessels.length} VESSELS</span>
        </div>

        {/* 28px Table Header */}
        <div className="stitch-table-header-row" role="row">
          <span className="th-col-primary">VESSEL &amp; ROUTE</span>
          <span className="th-col-metric">CARGO / ETA</span>
          <span className="th-col-status">STATUS</span>
        </div>

        <div className="fleet-scroll-list" role="table" aria-label="Fleet Telemetry Table">
          {vessels.map((v) => {
            const isRerouted = v.status === 'autonomously_rerouted';
            return (
              <div 
                key={v.id} 
                className={`fleet-item-row ${isRerouted ? 'rerouted-item' : ''}`}
                onClick={() => onSelectVessel(v)}
                role="row"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectVessel(v);
                }}
                title={`Inspect telemetry and escrow clearance for ${v.name}`}
              >
                <div className="fleet-col-primary">
                  <span className="vessel-title">{v.name}</span>
                  <span className="vessel-dest-code">➔ {v.destination.toUpperCase()}</span>
                </div>
                <div className="fleet-col-metric">
                  <span className="vessel-metric-val">${v.cargoValueM}M</span>
                  <span className="vessel-eta-val">{v.etaDays}d</span>
                </div>
                <div className="fleet-col-status">
                  <span className={`stitch-status-pill ${isRerouted ? 'pill-divergent' : 'pill-proof'}`}>
                    <span className="pill-beacon-dot"></span>
                    {isRerouted ? 'REROUTE' : 'EN ROUTE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
