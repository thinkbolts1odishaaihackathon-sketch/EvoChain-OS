import React from 'react';

export default function MacroTickerPills({ metrics }) {
  if (!metrics) return null;

  const isDisrupted = metrics.globalDisruptionIndex > 50;

  return (
    <section className="apple-ticker-bar" aria-label="Macro Market & Swarm Economic Indicators">
      <div className="ticker-scroll-inner">
        {/* 1. Brent Crude */}
        <div className="ticker-pill-card" title="Brent Crude spot price per barrel with live market volatility tracking">
          <div className="pill-card-header">
            <span className="pill-card-label">BRENT CRUDE</span>
            <span className="apple-tag tag-neutral">{metrics.crudeTrend || 'STABLE'}</span>
          </div>
          <div className="pill-card-body">
            <span className="pill-card-val">${metrics.brentCrude.toFixed(2)}</span>
            <span className="pill-unit-tag">USD / BBL</span>
          </div>
        </div>

        {/* 2. Freight Index */}
        <div className="ticker-pill-card" title="Freightos Baltic Global Container Index (FBX 40ft equivalent)">
          <div className="pill-card-header">
            <span className="pill-card-label">FREIGHT FBX INDEX</span>
            <span className="apple-tag tag-neutral">{metrics.freightTrend || 'NEUTRAL'}</span>
          </div>
          <div className="pill-card-body">
            <span className="pill-card-val">${metrics.freightIndexFBX.toLocaleString()}</span>
            <span className="pill-unit-tag">/ FEU</span>
          </div>
        </div>

        {/* 3. Semiconductor Lead Time */}
        <div className="ticker-pill-card" title="Global semiconductor foundry lead time benchmark in weeks">
          <div className="pill-card-header">
            <span className="pill-card-label">SEMI LEAD TIME</span>
            <span className="apple-tag tag-nominal">{metrics.semiTrend || 'NOMINAL'}</span>
          </div>
          <div className="pill-card-body">
            <span className="pill-card-val">{metrics.semiConductorLeadWeeks.toFixed(1)}</span>
            <span className="pill-unit-tag">WEEKS</span>
          </div>
        </div>

        {/* 4. Global Disruption Index */}
        <div className="ticker-pill-card" title="Global Maritime Disruption Index tracking chokepoints and hub congestion">
          <div className="pill-card-header">
            <span className="pill-card-label">DISRUPTION INDEX</span>
            <span className={`apple-tag ${isDisrupted ? 'tag-hazard' : 'tag-nominal'}`}>
              {isDisrupted ? 'ELEVATED' : 'NOMINAL'}
            </span>
          </div>
          <div className="pill-card-body">
            <span className={`pill-card-val ${isDisrupted ? 'val-hazard' : 'val-nominal'}`}>
              {metrics.globalDisruptionIndex.toFixed(1)}%
            </span>
            <span className="pill-unit-tag">VOLATILITY</span>
          </div>
        </div>

        {/* 5. Capital Protected */}
        <div className="ticker-pill-card" title="Cumulative enterprise capital protected via closed-loop autonomous rerouting">
          <div className="pill-card-header">
            <span className="pill-card-label">EST. CAPITAL PROTECTED</span>
            <span className="apple-tag tag-nominal">AUTONOMOUS ROI</span>
          </div>
          <div className="pill-card-body">
            <span className="pill-card-val val-nominal">${metrics.estimatedCostSavedM.toFixed(1)}M</span>
            <span className="pill-unit-tag">SAVED</span>
          </div>
        </div>

        {/* 6. Swarm Resilience */}
        <div className="ticker-pill-card" title="Swarm Pareto resilience score calculated across global trade corridors">
          <div className="pill-card-header">
            <span className="pill-card-label">SWARM RESILIENCE</span>
            <span className="apple-tag tag-neutral">PARETO OPTIMAL</span>
          </div>
          <div className="pill-card-body">
            <span className="pill-card-val">{metrics.resilienceScore.toFixed(1)}%</span>
            <span className="pill-unit-tag">HEALTH</span>
          </div>
        </div>
      </div>
    </section>
  );
}
