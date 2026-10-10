import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * 60 FPS Phosphor Radar Sweep Canvas
 * Renders circular polar radar, rotating scan beam, node blips across 4 tiers,
 * dynamic contagion infection arcs, quarantine firewalls, and phosphor persistence trail.
 */
export default function ContagionRadarCanvas({
  nodes = [],
  arcs = [],
  contagionState,
  selectedNodeId,
  onSelectNode,
  quarantineActive = false,
  immunizedActive = false
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const sweepAngleRef = useRef(0);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Colors based on biological state
  const isOutbreak = contagionState?.isOutbreak ?? true;
  const isImmunized = contagionState?.isImmunized ?? false;
  const themeColor = isImmunized ? '#10B981' : isOutbreak ? '#EF4444' : '#F59E0B';

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(centerX, centerY) - 24;

    let found = null;
    let minDistance = 22; // threshold pixels

    nodes.forEach((node) => {
      const angleRad = (node.angleDeg * Math.PI) / 180;
      const r = node.distanceNorm * maxRadius;
      const nx = centerX + r * Math.cos(angleRad);
      const ny = centerY + r * Math.sin(angleRad);

      const dist = Math.hypot(mouseX - nx, mouseY - ny);
      if (dist < minDistance) {
        minDistance = dist;
        found = { ...node, screenX: nx, screenY: ny };
      }
    });

    setHoveredNode(found);
  }, [nodes]);

  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  const handleClick = useCallback(() => {
    if (hoveredNode && onSelectNode) {
      onSelectNode(hoveredNode);
    }
  }, [hoveredNode, onSelectNode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Rotation speed: ~38 RPM (2.28 rad/sec)
      sweepAngleRef.current = (sweepAngleRef.current + 1.8 * delta) % (Math.PI * 2);
      const currentSweep = sweepAngleRef.current;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear canvas cleanly so the frosted obsidian modal window shines through
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(cx, cy) - 24;

      // 1. Draw subtle background radial gradient inside polar radar scope
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxRadius);
      bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
      bgGrad.addColorStop(0.7, 'rgba(11, 15, 23, 0.75)');
      bgGrad.addColorStop(1, 'rgba(8, 12, 20, 0.90)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Polar Grid Rings (4 Tier Rings)
      const ringTiers = [
        { rNorm: 0.16, label: 'OEM CORE', dash: [2, 4] },
        { rNorm: 0.40, label: 'TIER-1 ASSEMBLER', dash: [] },
        { rNorm: 0.62, label: 'TIER-2 SUB-ASSEMBLY', dash: [4, 4] },
        { rNorm: 0.86, label: 'TIER-3 RAW SMELTERS', dash: [] }
      ];

      ringTiers.forEach((tier) => {
        const r = tier.rNorm * maxRadius;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.28)';
        ctx.lineWidth = 1;
        if (tier.dash.length) ctx.setLineDash(tier.dash);
        ctx.stroke();

        // Ring label
        ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.font = '9px SF Mono, monospace';
        ctx.fillText(tier.label, cx + 6, cy - r + 11);
        ctx.restore();
      });

      // 3. Polar Crosshair Rays & Degree Coordinates
      const angles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4];
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.22)';
      ctx.lineWidth = 0.75;
      angles.forEach((ang) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + maxRadius * Math.cos(ang), cy + maxRadius * Math.sin(ang));
        ctx.stroke();
      });

      // Outer Range Ring Border
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Degree tick marks on outer rim
      for (let d = 0; d < 360; d += 15) {
        const rad = (d * Math.PI) / 180;
        const tickLen = d % 45 === 0 ? 8 : 4;
        const x1 = cx + (maxRadius - tickLen) * Math.cos(rad);
        const y1 = cy + (maxRadius - tickLen) * Math.sin(rad);
        const x2 = cx + maxRadius * Math.cos(rad);
        const y2 = cy + maxRadius * Math.sin(rad);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = d % 45 === 0 ? 'rgba(148, 163, 184, 0.6)' : 'rgba(71, 85, 105, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 4. Draw Contagion & Biological Arcs
      const nodeMap = new Map();
      nodes.forEach((n) => {
        const ang = (n.angleDeg * Math.PI) / 180;
        const r = n.distanceNorm * maxRadius;
        nodeMap.set(n.id, {
          x: cx + r * Math.cos(ang),
          y: cy + r * Math.sin(ang),
          ...n
        });
      });

      arcs.forEach((arc) => {
        const fromNode = nodeMap.get(arc.from);
        const toNode = nodeMap.get(arc.to);
        if (!fromNode || !toNode) return;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);

        // Slight curved bezier arc toward center
        const midX = (fromNode.x + toNode.x) / 2 + (cx - (fromNode.x + toNode.x) / 2) * 0.15;
        const midY = (fromNode.y + toNode.y) / 2 + (cy - (fromNode.y + toNode.y) / 2) * 0.15;
        ctx.quadraticCurveTo(midX, midY, toNode.x, toNode.y);

        const isArcInfected = fromNode.status === 'infected' || toNode.status === 'infected';
        const isArcQuarantined = quarantineActive || fromNode.status === 'quarantined' || toNode.status === 'quarantined';
        const isArcImmunized = immunizedActive || (fromNode.status === 'immunized' && toNode.status === 'immunized');

        if (isArcImmunized) {
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Flowing immunization particles
          const tP = (time * 0.001 * 0.8) % 1.0;
          const px = (1 - tP) * (1 - tP) * fromNode.x + 2 * (1 - tP) * tP * midX + tP * tP * toNode.x;
          const py = (1 - tP) * (1 - tP) * fromNode.y + 2 * (1 - tP) * tP * midY + tP * tP * toNode.y;
          ctx.fillStyle = '#34D399';
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (isArcQuarantined) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();

          // Draw quarantine firewall barrier icon in middle
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(midX, midY, 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (isArcInfected) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // Flowing infection pathogen particle (crimson pulse)
          const tP = (time * 0.001 * 1.2) % 1.0;
          const px = (1 - tP) * (1 - tP) * fromNode.x + 2 * (1 - tP) * tP * midX + tP * tP * toNode.x;
          const py = (1 - tP) * (1 - tP) * fromNode.y + 2 * (1 - tP) * tP * midY + tP * tP * toNode.y;
          ctx.fillStyle = '#EF4444';
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = 'rgba(71, 85, 105, 0.35)';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }

        ctx.restore();
      });

      // 5. Phosphor Sweep Line & Persistence Trail (Arc Sector)
      ctx.save();
      const trailAngle = Math.PI * 0.28; // ~50 degrees trail
      const sweepGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);

      const beamRgba = isImmunized
        ? 'rgba(16, 185, 129, '
        : isOutbreak
        ? 'rgba(239, 68, 68, '
        : 'rgba(245, 158, 11, ';

      sweepGradient.addColorStop(0, beamRgba + '0.05)');
      sweepGradient.addColorStop(0.7, beamRgba + '0.18)');
      sweepGradient.addColorStop(1, beamRgba + '0.28)');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxRadius, currentSweep - trailAngle, currentSweep, false);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Leading sharp phosphor line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxRadius * Math.cos(currentSweep), cy + maxRadius * Math.sin(currentSweep));
      ctx.strokeStyle = isImmunized ? '#34D399' : isOutbreak ? '#F87171' : '#FBBF24';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      // 6. Draw Node Blips with Excitation Burst & Status
      nodes.forEach((node) => {
        const ang = (node.angleDeg * Math.PI) / 180;
        const r = node.distanceNorm * maxRadius;
        const nx = cx + r * Math.cos(ang);
        const ny = cy + r * Math.sin(ang);

        // Check if sweep line is currently crossing over this node
        let angleDiff = (currentSweep - ang) % (Math.PI * 2);
        if (angleDiff < 0) angleDiff += Math.PI * 2;
        const isExcited = angleDiff < 0.25; // within ~14 degrees

        // Determine dynamic node status based on global flags
        let nodeStatus = node.status;
        if (immunizedActive) nodeStatus = 'immunized';
        else if (quarantineActive && node.status === 'infected') nodeStatus = 'quarantined';

        let blipColor = '#38BDF8';
        if (nodeStatus === 'infected') blipColor = '#EF4444';
        else if (nodeStatus === 'quarantined') blipColor = '#F59E0B';
        else if (nodeStatus === 'immunized') blipColor = '#10B981';

        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNode?.id === node.id;

        ctx.save();

        // Pulsating aura for infected nodes or excited nodes
        if (nodeStatus === 'infected' || isExcited || isSelected) {
          const pulse = (Math.sin(time * 0.006 + node.angleDeg) + 1) / 2;
          const outerR = 7 + pulse * 6 + (isExcited ? 8 : 0);
          ctx.beginPath();
          ctx.arc(nx, ny, outerR, 0, Math.PI * 2);
          ctx.fillStyle = nodeStatus === 'infected' ? `rgba(239, 68, 68, ${0.15 + pulse * 0.2})` : `${blipColor}26`;
          ctx.fill();
        }

        // Selection ring
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(nx, ny, 11, 0, Math.PI * 2);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Node center core
        ctx.beginPath();
        ctx.arc(nx, ny, isSelected ? 5.5 : 4.0, 0, Math.PI * 2);
        ctx.fillStyle = blipColor;
        ctx.shadowColor = blipColor;
        ctx.shadowBlur = isExcited ? 14 : 6;
        ctx.fill();

        // Tier / Node code label
        ctx.fillStyle = isSelected ? '#FFFFFF' : 'rgba(226, 232, 240, 0.75)';
        ctx.font = isSelected ? 'bold 10px SF Pro Text, sans-serif' : '9px SF Pro Text, sans-serif';
        ctx.fillText(node.id, nx + 7, ny - 6);

        ctx.restore();
      });

      // 7. Center Radar Origin Hub (EvoCore Brain Beacon)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = themeColor;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 12;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [nodes, arcs, contagionState, selectedNodeId, hoveredNode, quarantineActive, immunizedActive, themeColor, isOutbreak, isImmunized]);

  return (
    <div
      ref={containerRef}
      className="contagion-radar-canvas-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="contagion-radar-canvas" />

      {/* Floating HUD Reticle Tooltip */}
      {hoveredNode && (
        <div
          className="radar-floating-hud-card"
          style={{
            left: `${hoveredNode.screenX + 16}px`,
            top: `${hoveredNode.screenY - 32}px`
          }}
        >
          <div className="hud-card-header">
            <span className={`hud-status-badge badge-${hoveredNode.status}`}>
              {hoveredNode.status.toUpperCase()}
            </span>
            <span className="hud-node-tier">{hoveredNode.tierLabel}</span>
          </div>
          <div className="hud-node-name">{hoveredNode.name}</div>
          <div className="hud-commodity-txt">{hoveredNode.commodity}</div>
          <div className="hud-metric-row">
            <div className="hud-m-col">
              <span className="hud-m-lbl">DELAY</span>
              <span className="hud-m-val">{hoveredNode.delayHours}h</span>
            </div>
            <div className="hud-m-col">
              <span className="hud-m-lbl">BUFFER STOCK</span>
              <span className="hud-m-val">{hoveredNode.bufferStockDays} days</span>
            </div>
            <div className="hud-m-col">
              <span className="hud-m-lbl">LOSS AT RISK</span>
              <span className="hud-m-val val-danger">${hoveredNode.lossContributionM}M</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
