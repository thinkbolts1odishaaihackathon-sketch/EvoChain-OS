import React, { useState } from 'react';
import { authService } from '../../core/authService';
import { IconShieldCheck, IconLock, IconCheck, IconKey, IconAlertTriangle } from '../Icons';

export default function VesselModal({ vessel, isOpen, onClose }) {
  if (!isOpen || !vessel) return null;

  const [escrowProof, setEscrowProof] = useState(null);
  const [sanctionsProof, setSanctionsProof] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [simulatedEscrowAmountM, setSimulatedEscrowAmountM] = useState(1.8);

  const currentUser = authService.getCurrentUser();
  const isRerouted = vessel.status === 'autonomously_rerouted';
  const defaultCostM = vessel.rerouteDetails?.estimatedCostDeltaK 
    ? +(vessel.rerouteDetails.estimatedCostDeltaK / 1000).toFixed(2)
    : 1.8;

  const currentCostM = simulatedEscrowAmountM || defaultCostM;
  const userThreshold = currentUser?.capitalEscrowThreshold || 0.0;
  const isAuditorLocked = currentUser?.role === 'RISK_AUDITOR';
  const isThresholdExceeded = !isAuditorLocked && !authService.canAuthorizeEscrow(currentCostM);

  const handleAuthorizeEscrow = () => {
    if (isThresholdExceeded || isAuditorLocked) return;

    setIsAuthorizing(true);
    setTimeout(() => {
      const proof = authService.generateEscrowProof(vessel.id, currentCostM, 'AUTONOMOUS_MARITIME_REROUTE');
      setEscrowProof(proof);
      setIsAuthorizing(false);
    }, 500);
  };

  const handleAuditSanctions = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setSanctionsProof({
        timestamp: new Date().toISOString(),
        auditor: currentUser?.name || 'Elena Rostova',
        role: currentUser?.role || 'RISK_AUDITOR',
        ofacStatus: 'VERIFIED_CLEAR',
        imoEsgRating: 'RATED_A_OPTIMAL',
        carbonCompliance: 'EU-ETS ETS_2026_SURRENDER_ALLOWANCE_ACTIVE',
        certificateId: `OFAC-CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      });
      setIsAuthorizing(false);
    }, 450);
  };

  return (
    <div className="apple-modal-overlay" onClick={onClose}>
      <div className="apple-sheet-card vessel-detail-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber"></div>

        <div className="sheet-header">
          <div className="sheet-title-group">
            <h3 className="sheet-title">{vessel.name} [{vessel.id}]</h3>
            <p className="sheet-subtitle">
              {vessel.type} • Origin: <strong>{vessel.origin.toUpperCase()}</strong> ➔ Destination: <strong>{vessel.destination.toUpperCase()}</strong>
            </p>
          </div>
          <button className="apple-done-btn" onClick={onClose}>Done</button>
        </div>

        <div className="sheet-content-scroll">
          {/* Top 4 Stat Widgets */}
          <div className="sheet-kpi-grid-4">
            <div className="sheet-kpi-card">
              <span className="kpi-label">CARGO MANIFEST</span>
              <span className="kpi-value-sm">{vessel.cargo}</span>
            </div>
            <div className="sheet-kpi-card">
              <span className="kpi-label">VALUE AT RISK</span>
              <span className="kpi-value text-blue">${vessel.cargoValueM}M USD</span>
            </div>
            <div className="sheet-kpi-card">
              <span className="kpi-label">REMAINING ETA</span>
              <span className="kpi-value">{vessel.etaDays} Days</span>
            </div>
            <div className="sheet-kpi-card">
              <span className="kpi-label">CARBON FOOTPRINT</span>
              <span className="kpi-value">{vessel.co2FootprintTons} MT CO₂</span>
            </div>
          </div>

          {/* Autonomous Reroute Intelligence */}
          <div className="sheet-section-block">
            <h4 className="section-heading">Autonomous Agent Decision Trace</h4>
            {isRerouted && vessel.rerouteDetails ? (
              <div className="reroute-callout-card">
                <div className="callout-badge-row">
                  <span className="apple-tag tag-pink">AUTONOMOUS DIVERSION COMMITTED</span>
                  <span className="callout-strat">{vessel.rerouteDetails.strategy}</span>
                </div>
                <p className="callout-rationale">
                  <strong>Rationale:</strong> {vessel.rerouteDetails.rationale}
                </p>
                <div className="callout-stats-grid">
                  <div className="callout-stat">
                    <span className="c-label">Modal Allocation</span>
                    <span className="c-val">
                      {vessel.rerouteDetails.airCargoPercent}% Air Express / {vessel.rerouteDetails.oceanDivertPercent}% Cape Transit
                    </span>
                  </div>
                  <div className="callout-stat">
                    <span className="c-label">Cost Delta</span>
                    <span className="c-val text-green">
                      +${vessel.rerouteDetails.estimatedCostDeltaK}k (Avoided $2.4M war insurance & 18d freeze)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="nominal-callout-card">
                <span className="nominal-dot"></span>
                <span>Vessel tracking nominal maritime trajectory. Swarm sensors active.</span>
              </div>
            )}
          </div>

          {/* RBAC Capital Escrow & Sanctions Clearance Card */}
          <div className="sheet-section-block">
            <div className="escrow-header-row">
              <h4 className="section-heading">Capital Escrow &amp; Compliance Clearance (RBAC)</h4>
              <span className="apple-tag tag-purple">
                Active Role: {currentUser?.roleLabel || currentUser?.role}
              </span>
            </div>

            {/* Escrow Tier Tester Buttons for Hackathon Judges */}
            <div className="escrow-tier-switcher">
              <span className="tier-switcher-label">TEST ESCROW SCENARIOS:</span>
              <div className="tier-buttons-row">
                <button
                  type="button"
                  className={`tier-btn ${currentCostM === 1.8 ? 'active-tier' : ''}`}
                  onClick={() => {
                    setSimulatedEscrowAmountM(1.8);
                    setEscrowProof(null);
                  }}
                >
                  Standard Diversion ($1.8M)
                </button>
                <button
                  type="button"
                  className={`tier-btn ${currentCostM === 6.5 ? 'active-tier' : ''}`}
                  onClick={() => {
                    setSimulatedEscrowAmountM(6.5);
                    setEscrowProof(null);
                  }}
                  title="Test exceeding Director $5.0M threshold to verify Multi-Sig Elevation alert"
                >
                  ⚠️ Mega-Carrier Circumvention ($6.5M)
                </button>
              </div>
            </div>

            <div className="escrow-action-card">
              <div className="escrow-info-col">
                <div className="escrow-metric-row">
                  <span className="e-lbl">Required Diversion Escrow:</span>
                  <strong className="e-val">${currentCostM}M USD</strong>
                </div>
                <div className="escrow-metric-row">
                  <span className="e-lbl">Operator Escrow Limit:</span>
                  <span className="e-clearance" style={{ color: currentUser?.badgeColor || '#0071e3' }}>
                    {currentUser?.role === 'GUEST_JUDGE' ? '$10.0M (VIP Sandbox)' : currentUser?.role === 'EXECUTIVE_ARBITER' ? `$${userThreshold}.0M Limit` : 'Audit Only ($0.0M)'}
                  </span>
                </div>
              </div>

              {/* Action based on active RBAC role */}
              <div className="escrow-btn-col">
                {currentUser?.role === 'EXECUTIVE_ARBITER' && (
                  <button 
                    type="button" 
                    className={`apple-btn-pill-primary escrow-commit-btn ${isThresholdExceeded ? 'btn-disabled' : ''}`}
                    onClick={handleAuthorizeEscrow}
                    disabled={isAuthorizing || isThresholdExceeded}
                    title={isThresholdExceeded ? "Exceeds $5.0M limit - elevation required" : "Cryptographically commit escrow via Director signature"}
                  >
                    <IconKey size={12} />
                    <span>
                      {isAuthorizing ? 'Signing 256-bit ECDSA Hash...' : isThresholdExceeded ? '🔒 Limit Exceeded' : `Authorize $${currentCostM}M Escrow (256-bit ECDSA)`}
                    </span>
                  </button>
                )}

                {currentUser?.role === 'GUEST_JUDGE' && (
                  <button 
                    type="button" 
                    className="apple-btn-pill-primary escrow-commit-btn btn-judge-sandbox"
                    onClick={handleAuthorizeEscrow}
                    disabled={isAuthorizing}
                    title="Simulate VIP Sandbox Escrow authorization"
                  >
                    <IconKey size={12} />
                    <span>{isAuthorizing ? 'Simulating...' : `Authorize VIP Sandbox Escrow ($${currentCostM}M)`}</span>
                  </button>
                )}

                {currentUser?.role === 'RISK_AUDITOR' && (
                  <button 
                    type="button" 
                    className="apple-btn-pill-primary escrow-commit-btn btn-auditor-sign"
                    onClick={handleAuditSanctions}
                    disabled={isAuthorizing}
                    title="Execute OFAC sanctions and IMO carbon compliance sign-off"
                  >
                    <IconShieldCheck size={13} />
                    <span>{isAuthorizing ? 'Auditing OFAC/IMO...' : 'Execute Sanctions & ESG Audit'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Escrow Threshold Exceeded Multi-Sig Warning */}
            {isThresholdExceeded && (
              <div className="escrow-threshold-warning-callout" role="alert">
                <IconAlertTriangle size={16} className="warning-callout-icon" />
                <div className="warning-callout-text">
                  <strong>Escrow Threshold Exceeded (${currentCostM}M &gt; ${userThreshold}.0M)</strong>
                  <p>
                    Director single-sign authorization is capped at <strong>$5.0M USD</strong>. Multi-sig arbiter elevation is required before autonomous reroute funds can be committed.
                  </p>
                </div>
              </div>
            )}

            {/* Auditor Read-Only Notice */}
            {isAuditorLocked && !sanctionsProof && (
              <div className="escrow-threshold-warning-callout auditor-info-callout">
                <IconShieldCheck size={16} className="warning-callout-icon" />
                <div className="warning-callout-text">
                  <strong>Compliance &amp; Sanctions Guardian Clearance</strong>
                  <p>
                    Risk Auditor clearance is read-only for capital escrow. Click "Execute Sanctions &amp; ESG Audit" to perform OFAC SDN &amp; IMO CII validation.
                  </p>
                </div>
              </div>
            )}

            {/* Cryptographic Escrow Receipt Display with 256-bit ECDSA Hash */}
            {escrowProof && (
              <div className="escrow-receipt-card">
                <div className="receipt-header">
                  <span className="receipt-status-badge">
                    <IconCheck size={11} /> {escrowProof.status}
                  </span>
                  <span className="receipt-time">{escrowProof.timestamp}</span>
                </div>
                <div className="receipt-body">
                  <div className="receipt-row">
                    <span className="r-label">256-bit ECDSA Hash:</span>
                    <span className="r-hash">{escrowProof.txHash}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="r-label">Block Height:</span>
                    <span className="r-val">#{escrowProof.blockNumber}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="r-label">Authorized Signer:</span>
                    <span className="r-val">{escrowProof.signerName} ({escrowProof.signerRole})</span>
                  </div>
                  <div className="receipt-row">
                    <span className="r-label">Cryptographic Standard:</span>
                    <span className="r-val">{escrowProof.signatureStandard}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sanctions Clearance Certificate Display */}
            {sanctionsProof && (
              <div className="escrow-receipt-card sanctions-certificate-card">
                <div className="receipt-header">
                  <span className="receipt-status-badge badge-sanctions-clear">
                    <IconShieldCheck size={12} /> OFAC &amp; IMO ESG CLEARANCE CONFIRMED
                  </span>
                  <span className="receipt-cert-id">{sanctionsProof.certificateId}</span>
                </div>
                <div className="receipt-body">
                  <div className="receipt-row">
                    <span className="r-label">OFAC Sanctions Status:</span>
                    <span className="r-val text-green">CLEARED (Specially Designated Nationals: NONE)</span>
                  </div>
                  <div className="receipt-row">
                    <span className="r-label">IMO 2026 CII Metric:</span>
                    <span className="r-val text-green">RATED A (182 gCO2/t-nm Optimal Intensity)</span>
                  </div>
                  <div className="receipt-row">
                    <span className="r-label">Auditing Officer:</span>
                    <span className="r-val">{sanctionsProof.auditor} ({sanctionsProof.role})</span>
                  </div>
                  <div className="receipt-row">
                    <span className="r-label">UTC Timestamp:</span>
                    <span className="r-val">{sanctionsProof.timestamp}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
