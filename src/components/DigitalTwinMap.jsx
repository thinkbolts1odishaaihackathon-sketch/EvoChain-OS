import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { IconFilter, IconLayers, IconRadar } from './Icons';
import SlidingSegmentedControl from './common/SlidingSegmentedControl';
import TimeMachineDock from './TimeMachine/TimeMachineDock';
import { MULTIVERSE_BRANCHES, calculateVesselMultiverseState } from '../core/simulationTimeMachine';

/**
 * High-Precision Catmull-Rom Spline Shoreline Datasets
 * Detailed continental anchor points for smoothed, organic cartography.
 */
const DETAILED_CONTINENTS = [
  // North America & Greenland
  [
    { x: 0.05, y: 0.16 }, { x: 0.10, y: 0.13 }, { x: 0.16, y: 0.12 }, { x: 0.22, y: 0.14 },
    { x: 0.26, y: 0.18 }, { x: 0.32, y: 0.12 }, { x: 0.36, y: 0.15 }, { x: 0.32, y: 0.24 },
    { x: 0.30, y: 0.32 }, { x: 0.28, y: 0.38 }, { x: 0.26, y: 0.43 }, { x: 0.22, y: 0.44 },
    { x: 0.18, y: 0.47 }, { x: 0.22, y: 0.52 }, { x: 0.16, y: 0.44 }, { x: 0.14, y: 0.38 },
    { x: 0.14, y: 0.30 }, { x: 0.11, y: 0.25 }, { x: 0.06, y: 0.22 }
  ],
  // South America
  [
    { x: 0.24, y: 0.53 }, { x: 0.28, y: 0.52 }, { x: 0.34, y: 0.54 }, { x: 0.39, y: 0.58 },
    { x: 0.42, y: 0.64 }, { x: 0.40, y: 0.72 }, { x: 0.36, y: 0.78 }, { x: 0.33, y: 0.85 },
    { x: 0.30, y: 0.92 }, { x: 0.28, y: 0.86 }, { x: 0.26, y: 0.76 }, { x: 0.24, y: 0.67 },
    { x: 0.23, y: 0.59 }
  ],
  // Eurasia (Europe & Asia Mainland)
  [
    { x: 0.46, y: 0.34 }, { x: 0.48, y: 0.28 }, { x: 0.50, y: 0.20 }, { x: 0.53, y: 0.14 },
    { x: 0.58, y: 0.16 }, { x: 0.66, y: 0.15 }, { x: 0.76, y: 0.16 }, { x: 0.86, y: 0.18 },
    { x: 0.93, y: 0.22 }, { x: 0.90, y: 0.30 }, { x: 0.86, y: 0.36 }, { x: 0.83, y: 0.41 },
    { x: 0.80, y: 0.48 }, { x: 0.77, y: 0.56 }, { x: 0.76, y: 0.59 }, { x: 0.73, y: 0.53 },
    { x: 0.69, y: 0.51 }, { x: 0.67, y: 0.46 }, { x: 0.64, y: 0.44 }, { x: 0.59, y: 0.42 },
    { x: 0.55, y: 0.39 }, { x: 0.52, y: 0.37 }, { x: 0.46, y: 0.38 }
  ],
  // British Isles
  [
    { x: 0.47, y: 0.24 }, { x: 0.49, y: 0.25 }, { x: 0.48, y: 0.29 }, { x: 0.46, y: 0.28 }
  ],
  // Japan Archipelago
  [
    { x: 0.87, y: 0.35 }, { x: 0.89, y: 0.37 }, { x: 0.90, y: 0.42 }, { x: 0.88, y: 0.41 }
  ],
  // Africa
  [
    { x: 0.46, y: 0.40 }, { x: 0.54, y: 0.39 }, { x: 0.58, y: 0.41 }, { x: 0.62, y: 0.48 },
    { x: 0.65, y: 0.53 }, { x: 0.62, y: 0.64 }, { x: 0.59, y: 0.73 }, { x: 0.55, y: 0.82 },
    { x: 0.51, y: 0.78 }, { x: 0.49, y: 0.66 }, { x: 0.44, y: 0.58 }, { x: 0.40, y: 0.50 },
    { x: 0.42, y: 0.43 }
  ],
  // Madagascar
  [
    { x: 0.63, y: 0.70 }, { x: 0.65, y: 0.73 }, { x: 0.63, y: 0.78 }, { x: 0.62, y: 0.74 }
  ],
  // Australia
  [
    { x: 0.81, y: 0.66 }, { x: 0.86, y: 0.66 }, { x: 0.89, y: 0.74 }, { x: 0.87, y: 0.82 },
    { x: 0.81, y: 0.82 }, { x: 0.77, y: 0.77 }, { x: 0.77, y: 0.70 }
  ],
  // New Zealand
  [
    { x: 0.93, y: 0.82 }, { x: 0.95, y: 0.84 }, { x: 0.94, y: 0.88 }, { x: 0.92, y: 0.86 }
  ],
  // Maritime Southeast Asia (Indonesia/Philippines)
  [
    { x: 0.76, y: 0.61 }, { x: 0.82, y: 0.63 }, { x: 0.84, y: 0.66 }, { x: 0.78, y: 0.65 }
  ]
];

/**
 * Ocean Current Streamlines (Gulf Stream, Kuroshio, Equatorial, Circumpolar)
 */
const OCEAN_CURRENTS = [
  // Gulf Stream / North Atlantic Drift
  [
    { x: 0.28, y: 0.43 }, { x: 0.32, y: 0.38 }, { x: 0.38, y: 0.32 }, 
    { x: 0.44, y: 0.27 }, { x: 0.50, y: 0.22 }
  ],
  // Kuroshio Current (Pacific)
  [
    { x: 0.81, y: 0.50 }, { x: 0.84, y: 0.44 }, { x: 0.88, y: 0.38 }, 
    { x: 0.93, y: 0.34 }, { x: 0.98, y: 0.32 }
  ],
  // Atlantic Equatorial Current
  [
    { x: 0.44, y: 0.54 }, { x: 0.38, y: 0.55 }, { x: 0.32, y: 0.54 }, { x: 0.26, y: 0.53 }
  ],
  // Agulhas / Indian Ocean Current
  [
    { x: 0.67, y: 0.58 }, { x: 0.64, y: 0.66 }, { x: 0.59, y: 0.76 }, { x: 0.53, y: 0.82 }
  ],
  // Antarctic Circumpolar Current
  [
    { x: 0.10, y: 0.88 }, { x: 0.30, y: 0.89 }, { x: 0.50, y: 0.88 }, 
    { x: 0.70, y: 0.89 }, { x: 0.90, y: 0.88 }
  ]
];

/**
 * Evaluates Catmull-Rom spline curve through points
 */
function drawCatmullRomSpline(ctx, points, w, h, closePath = true) {
  if (points.length < 3) return;
  const pts = points.map(p => ({ x: p.x * w, y: p.y * h }));
  const n = pts.length;

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);

  for (let i = 0; i < (closePath ? n : n - 1); i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];

    // Convert Catmull-Rom to Cubic Bezier control points
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }

  if (closePath) {
    ctx.closePath();
  }
}

/**
 * Computes Geodesic sampled points along a trade lane route
 * adding natural Great Circle curvature across open ocean spans.
 */
function computeGeodesicRoute(waypoints, samplesPerSegment = 14) {
  if (!waypoints || waypoints.length < 2) return [];
  const fullPath = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);

    // Apply poleward Great Circle arch for transoceanic spans
    const midY = (p1.y + p2.y) / 2;
    const isTransoceanic = dist > 0.08;
    const archFactor = isTransoceanic ? (midY < 0.55 ? -0.10 * dist : 0.08 * dist) : 0;

    for (let s = 0; s < samplesPerSegment; s++) {
      const t = s / samplesPerSegment;
      const x = p1.x + dx * t;
      const y = p1.y + dy * t + 4 * archFactor * t * (1 - t);
      fullPath.push({ x, y });
    }
  }

  fullPath.push(waypoints[waypoints.length - 1]);
  return fullPath;
}

export default function DigitalTwinMap({ 
  vessels, 
  tradeLanes, 
  chokepoints, 
  hubs, 
  activeScenario, 
  onSelectVessel,
  // Temporal Scrubber & Multiverse Branching Props
  timeOffsetDays = 0,
  onSetTimeOffset = () => {},
  isTimeMachinePlaying = false,
  onToggleTimeMachinePlay = () => {},
  timeMachineSpeed = 1,
  onSetTimeMachineSpeed = () => {},
  activeBranches = ['branch_a', 'branch_b'],
  onToggleBranch = () => {},
  onOpenMultiverseDrawer = () => {},
  onTriggerJudgeDemo = () => {},
  isJudgeDemoActive = false
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const hoverEntityRef = useRef(null);
  const ghostEntitiesRef = useRef([]);

  // Layer & Filter States
  const [filterType, setFilterType] = useState('all'); // 'all' | 'rerouted' | 'high_value'
  const [showLanes, setShowLanes] = useState(true);
  const [showChokepoints, setShowChokepoints] = useState(true);
  const [showHubs, setShowHubs] = useState(true);
  const [showCurrents, setShowCurrents] = useState(true);
  const [showGraticule, setShowGraticule] = useState(true);

  // Pan & Zoom States
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [utcTimeStr, setUtcTimeStr] = useState('');

  // Pre-calculate geodesic trajectories for each trade lane
  const geodesicRoutes = useMemo(() => {
    const map = {};
    tradeLanes.forEach(lane => {
      map[lane.id] = {
        lane,
        points: computeGeodesicRoute(lane.waypoints, 16)
      };
    });
    return map;
  }, [tradeLanes]);

  // Live UTC Clock for Nautical chronometer badge
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTimeStr(`${h}:${m}:${s} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute position and heading for any route and progress along geodesic arc
  const getPosForRouteProgress = useCallback((routeId, progress, w, h) => {
    const geo = geodesicRoutes[routeId];
    if (!geo || !geo.points || geo.points.length < 2) {
      return { x: 0.5 * w, y: 0.5 * h, heading: 0, screenX: 0.5 * w, screenY: 0.5 * h };
    }

    const pts = geo.points;
    const totalSegs = pts.length - 1;
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const targetIdx = clampedProgress * totalSegs;
    const idx = Math.min(totalSegs - 1, Math.floor(targetIdx));
    const subT = targetIdx - idx;

    const p1 = pts[idx];
    const p2 = pts[idx + 1];

    const nx = p1.x + (p2.x - p1.x) * subT;
    const ny = p1.y + (p2.y - p1.y) * subT;

    // Apply viewport pan and zoom transformation
    const worldX = nx * w;
    const worldY = ny * h;
    const screenX = worldX * zoom + pan.x;
    const screenY = worldY * zoom + pan.y;

    const heading = Math.atan2((p2.y - p1.y) * h, (p2.x - p1.x) * w);

    return { x: worldX, y: worldY, heading, screenX, screenY };
  }, [geodesicRoutes, zoom, pan]);

  // Compute position and heading for vessel along its current geodesic route
  const getVesselGeodesicPos = useCallback((vessel, w, h) => {
    return getPosForRouteProgress(vessel.currentRouteId, vessel.progress, w, h);
  }, [getPosForRouteProgress]);

  // Pre-render static cartography (Ocean Bathymetry, Coastlines, Shelf Glow, Graticule)
  const renderStaticBackground = (width, height) => {
    let offscreen = offscreenCanvasRef.current;
    if (!offscreen) {
      offscreen = document.createElement('canvas');
      offscreenCanvasRef.current = offscreen;
    }
    const dpr = window.devicePixelRatio || 1;
    offscreen.width = width * dpr;
    offscreen.height = height * dpr;
    const octx = offscreen.getContext('2d');
    octx.scale(dpr, dpr);

    const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') !== 'light';

    // 1. Bathymetric Multi-Stop Ocean Gradient (Disciplined Palantir / Apple Cartography)
    const oceanGrad = octx.createRadialGradient(
      width * 0.5, height * 0.45, width * 0.05,
      width * 0.5, height * 0.5, width * 0.8
    );
    if (isDark) {
      oceanGrad.addColorStop(0, '#0c1322'); // Sub-surface shelf slate
      oceanGrad.addColorStop(0.4, '#090d16'); // Base obsidian slate
      oceanGrad.addColorStop(0.8, '#080c14');
      oceanGrad.addColorStop(1, '#05080f'); // Abyssal trench deep
    } else {
      oceanGrad.addColorStop(0, '#f8fafd'); // Pristine porcelain shelf
      oceanGrad.addColorStop(0.4, '#f1f5fa');
      oceanGrad.addColorStop(0.8, '#eaf0f8');
      oceanGrad.addColorStop(1, '#e2eaf4'); // Soft oceanic gradient
    }
    octx.fillStyle = oceanGrad;
    octx.fillRect(0, 0, width, height);

    // 2. Graticule Lat/Long Grid & Coordinate Micro-Typography
    if (showGraticule) {
      octx.save();
      octx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.04)';
      octx.lineWidth = 1;

      // Longitude meridians
      const lons = [
        { x: 0.166, label: '120°W' },
        { x: 0.333, label: '60°W' },
        { x: 0.500, label: '0°' },
        { x: 0.666, label: '60°E' },
        { x: 0.833, label: '120°E' }
      ];
      lons.forEach(m => {
        const x = m.x * width;
        octx.beginPath();
        octx.moveTo(x, 0);
        octx.lineTo(x, height);
        octx.stroke();

        octx.font = '600 8px "JetBrains Mono", monospace';
        octx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.35)';
        octx.textAlign = 'center';
        octx.fillText(m.label, x, height - 6);
      });

      // Latitude parallels
      const lats = [
        { y: 0.20, label: '60°N' },
        { y: 0.35, label: '30°N' },
        { y: 0.50, label: '0°EQ' },
        { y: 0.65, label: '30°S' },
        { y: 0.80, label: '60°S' }
      ];
      lats.forEach(p => {
        const y = p.y * height;
        octx.beginPath();
        octx.moveTo(0, y);
        octx.lineTo(width, y);
        octx.stroke();

        octx.font = '600 8px "JetBrains Mono", monospace';
        octx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.35)';
        octx.textAlign = 'left';
        octx.fillText(p.label, 8, y - 3);
      });
      octx.restore();
    }

    // 3. Coastal Continental Shelf Glow (Translucent luminous aura)
    octx.save();
    octx.strokeStyle = isDark ? 'rgba(0, 113, 227, 0.08)' : 'rgba(0, 113, 227, 0.06)';
    octx.lineWidth = 5;
    DETAILED_CONTINENTS.forEach(poly => {
      drawCatmullRomSpline(octx, poly, width, height, true);
      octx.stroke();
    });
    octx.restore();

    // 4. Catmull-Rom Spline Landmasses (High Information Density with Sub-pixel hairline outlines)
    octx.save();
    DETAILED_CONTINENTS.forEach(poly => {
      drawCatmullRomSpline(octx, poly, width, height, true);
      octx.fillStyle = isDark ? '#111827' : '#ffffff';
      octx.fill();

      octx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)';
      octx.lineWidth = 1.0;
      octx.stroke();
    });
    octx.restore();

    return offscreen;
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let animTime = 0;

    const handleResize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      renderStaticBackground(rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (time) => {
      animTime = time * 0.001;
      const rect = canvas.parentElement.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dpr = window.devicePixelRatio || 1;

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      // 1. Draw Cached HiDPI Background
      if (offscreenCanvasRef.current) {
        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);
        ctx.drawImage(offscreenCanvasRef.current, 0, 0, w, h);
        ctx.restore();
      }

      // Apply Pan & Zoom Matrix for Dynamic Elements
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // 2. Ocean Current Flowlines (Animated Flow Dash Offset)
      if (showCurrents) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 113, 227, 0.07)';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -animTime * 12;

        OCEAN_CURRENTS.forEach(curr => {
          drawCatmullRomSpline(ctx, curr, w, h, false);
          ctx.stroke();
        });
        ctx.restore();
      }

      // 3. Great Circle Trade Lanes & Fiber-Optic Energy Comets
      if (showLanes) {
        ctx.save();
        Object.values(geodesicRoutes).forEach(({ lane, points }) => {
          if (!points || points.length < 2) return;
          const isDivert = lane.mode === 'ocean_divert';
          const isAir = lane.mode === 'air';

          // Base Conduit Layer
          ctx.save();
          if (isDivert) {
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)'; // Crimson Hazard Detour
            ctx.lineWidth = 1.6;
            ctx.setLineDash([4, 4]);
            ctx.lineDashOffset = -animTime * 14;
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(239, 68, 68, 0.3)';
          } else if (isAir) {
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)'; // Amber Air Express
            ctx.lineWidth = 1.4;
            ctx.setLineDash([3, 4]);
            ctx.shadowBlur = 3;
            ctx.shadowColor = 'rgba(245, 158, 11, 0.25)';
          } else {
            ctx.strokeStyle = 'rgba(0, 113, 227, 0.40)'; // Cobalt Geodesic Conduit
            ctx.lineWidth = 1.2;
            ctx.setLineDash([3, 4]);
            ctx.shadowBlur = 3;
            ctx.shadowColor = 'rgba(0, 113, 227, 0.2)';
          }

          ctx.beginPath();
          points.forEach((pt, i) => {
            const px = pt.x * w;
            const py = pt.y * h;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
          ctx.restore();

          // Luminous Photon Comet Beads with Tangent Gradient Tails
          const numComets = 2;
          for (let c = 0; c < numComets; c++) {
            const cometSpeed = isAir ? 0.22 : 0.12;
            const cometProg = ((animTime * cometSpeed + c * (1 / numComets)) % 1);
            const totalSegs = points.length - 1;
            const segProg = cometProg * totalSegs;
            const segIdx = Math.min(totalSegs - 1, Math.floor(segProg));
            const sub = segProg - segIdx;

            const pA = points[segIdx];
            const pB = points[segIdx + 1];
            const cx = (pA.x + (pB.x - pA.x) * sub) * w;
            const cy = (pA.y + (pB.y - pA.y) * sub) * h;

            const angle = Math.atan2((pB.y - pA.y) * h, (pB.x - pA.x) * w);

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);

            // Comet Tail
            const tailLen = 16;
            const tailGrad = ctx.createLinearGradient(-tailLen, 0, 0, 0);
            const cometColor = isDivert ? '#ef4444' : (isAir ? '#f59e0b' : '#0071e3');
            tailGrad.addColorStop(0, 'rgba(0,0,0,0)');
            tailGrad.addColorStop(1, cometColor);

            ctx.fillStyle = tailGrad;
            ctx.beginPath();
            ctx.moveTo(0, 1.5);
            ctx.lineTo(-tailLen, 0);
            ctx.lineTo(0, -1.5);
            ctx.closePath();
            ctx.fill();

            // Comet Core Head (Crisp luminous bead)
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 4;
            ctx.shadowColor = cometColor;
            ctx.beginPath();
            ctx.arc(0, 0, 2.0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }
        });
        ctx.restore();
      }

      // 4. Strategic Chokepoints & Shockwave Physics
      if (showChokepoints) {
        ctx.save();
        Object.values(chokepoints).forEach(cp => {
          const cx = cp.x * w;
          const cy = cp.y * h;
          const isDisrupted = cp.status === 'disrupted' || cp.riskLevel > 0.5;

          if (isDisrupted) {
            // Crisis Expanding Shockwaves (translucent emergency ripples)
            const rippleCount = 3;
            for (let r = 0; r < rippleCount; r++) {
              const rPhase = ((animTime * 1.4 + r * (1 / rippleCount)) % 1);
              const rRadius = 6 + rPhase * 24;
              const rAlpha = (1 - rPhase) * 0.45;

              ctx.strokeStyle = `rgba(255, 59, 48, ${rAlpha})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(cx, cy, rRadius, 0, Math.PI * 2);
              ctx.stroke();
            }

            // Hazard Beacon Core
            ctx.fillStyle = '#ff3b30';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 59, 48, 0.8)';
            ctx.beginPath();
            ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Nominal Chokepoint Radar Pulse
            const radarPhase = (animTime * 0.8) % 1;
            ctx.strokeStyle = `rgba(0, 113, 227, ${(1 - radarPhase) * 0.35})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(cx, cy, 4 + radarPhase * 12, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#0071e3';
            ctx.beginPath();
            ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Chokepoint Typography
          ctx.font = '600 9px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
          ctx.fillStyle = isDisrupted ? '#d70015' : '#1d1d1f';
          ctx.textAlign = 'center';
          ctx.fillText(cp.name, cx, cy - 10);
        });
        ctx.restore();
      }

      // 5. Seaport Hubs with Clockwise Congestion Gauges
      if (showHubs) {
        ctx.save();
        Object.values(hubs).forEach(hub => {
          const hx = hub.x * w;
          const hy = hub.y * h;
          const cong = hub.currentCongestion || 0.2;

          // Dock Center Node
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#0071e3';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(hx, hy, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Circular Clockwise Congestion Arc Gauge
          const gaugeRadius = 7.5;
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(hx, hy, gaugeRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Active Congestion Arc
          ctx.strokeStyle = cong > 0.6 ? '#ff3b30' : (cong > 0.3 ? '#ff9500' : '#34c759');
          ctx.beginPath();
          ctx.arc(hx, hy, gaugeRadius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * cong);
          ctx.stroke();

          // Clean Monospace City Label
          ctx.font = '500 8.5px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
          ctx.fillStyle = '#3a3a3c';
          ctx.textAlign = 'center';
          ctx.fillText(hub.name.replace('Port of ', ''), hx, hy + 13);
        });
        ctx.restore();
      }

      // 6. Living Vessel Fleet & Nautical Physics
      ctx.save();
      vessels.forEach(v => {
        const isRerouted = v.status === 'autonomously_rerouted';
        const isHighValue = v.cargoValueM >= 300;

        let isVisible = true;
        if (filterType === 'rerouted') isVisible = isRerouted;
        else if (filterType === 'high_value') isVisible = isHighValue;

        const pos = getVesselGeodesicPos(v, w, h);
        const isHovered = hoveredEntity?.type === 'vessel' && hoveredEntity.data.id === v.id;
        const isAir = v.currentRouteId.includes('air');

        ctx.save();
        ctx.globalAlpha = isVisible ? 1.0 : 0.15;
        ctx.translate(pos.x, pos.y);

        // Vessel Wake Trails (Expanding chevron ripples)
        if (!isAir && isVisible) {
          ctx.save();
          ctx.rotate(pos.heading);
          for (let k = 1; k <= 3; k++) {
            const wakeDist = -k * 8;
            const wakeAlpha = (0.35 / k) * (0.8 + 0.2 * Math.sin(animTime * 6 + k));
            ctx.strokeStyle = `rgba(0, 113, 227, ${wakeAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(wakeDist, -k * 3.5);
            ctx.lineTo(wakeDist + 3, 0);
            ctx.lineTo(wakeDist, k * 3.5);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Tactile Hover Elevation & Reticle Crosshairs
        if (isHovered) {
          ctx.save();
          const reticleRadius = 14;
          ctx.strokeStyle = '#0071e3';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.arc(0, 0, reticleRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Compass Crosshairs
          ctx.setLineDash([]);
          ctx.strokeStyle = 'rgba(0, 113, 227, 0.6)';
          ctx.beginPath();
          ctx.moveTo(-reticleRadius - 4, 0); ctx.lineTo(-reticleRadius, 0);
          ctx.moveTo(reticleRadius, 0); ctx.lineTo(reticleRadius + 4, 0);
          ctx.moveTo(0, -reticleRadius - 4); ctx.lineTo(0, -reticleRadius);
          ctx.moveTo(0, reticleRadius); ctx.lineTo(0, reticleRadius + 4);
          ctx.stroke();
          ctx.restore();
        }

        // Tapered Nautical Hull Orientation
        ctx.save();
        ctx.rotate(pos.heading);
        if (isHovered) ctx.scale(1.3, 1.3);

        const hullColor = isRerouted ? '#ef4444' : (isAir ? '#f59e0b' : (isHighValue ? '#0071e3' : '#10b981'));

        if (isAir) {
          // Aircraft Silhouette
          ctx.fillStyle = hullColor;
          ctx.beginPath();
          ctx.moveTo(9, 0);
          ctx.lineTo(-4, -6);
          ctx.lineTo(-2, 0);
          ctx.lineTo(-4, 6);
          ctx.closePath();
          ctx.fill();
        } else {
          // Sleek Tapered Nautical Hull
          ctx.fillStyle = hullColor;
          ctx.shadowBlur = isHovered ? 6 : 2;
          ctx.shadowColor = hullColor;
          ctx.beginPath();
          ctx.moveTo(10, 0);      // Sharp Bow
          ctx.lineTo(3, -3.5);    // Port Beam
          ctx.lineTo(-8, -3.0);   // Port Quarter
          ctx.lineTo(-9, 0);      // Transom
          ctx.lineTo(-8, 3.0);    // Starboard Quarter
          ctx.lineTo(3, 3.5);     // Starboard Beam
          ctx.closePath();
          ctx.fill();

          // Sub-pixel Bridge Deckhouse
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-2, 0, 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // High Value Diamond Insignia
        if (isHighValue && isVisible) {
          ctx.save();
          ctx.fillStyle = '#0071e3';
          ctx.beginPath();
          ctx.moveTo(0, -9);
          ctx.lineTo(3, -6);
          ctx.lineTo(0, -3);
          ctx.lineTo(-3, -6);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Vessel Telemetry Label (Tabular figures)
        if (isVisible) {
          ctx.font = '600 8.5px "JetBrains Mono", monospace';
          const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') !== 'light';
          ctx.fillStyle = isRerouted ? '#ef4444' : (isDark ? '#e2e8f0' : '#1e293b');
          ctx.textAlign = 'left';
          ctx.fillText(`${v.name.split(' ')[0]} • ${v.etaDays}d`, 12, -4);
        }

        ctx.restore();
      });
      ctx.restore();

      // 7. Parallel Multiverse Trajectories & Ghost Vessel Hulls
      const currentGhostEntities = [];
      if (activeBranches && activeBranches.length > 0) {
        ctx.save();

        // 7A. Branch Ghost Trajectories
        activeBranches.forEach((branchId) => {
          const branchMeta = MULTIVERSE_BRANCHES[branchId];
          if (!branchMeta) return;

          // Branch A: Legacy Status Quo route (via Suez)
          if (branchId === 'branch_a' && geodesicRoutes['asia_europe_suez']) {
            const pts = geodesicRoutes['asia_europe_suez'].points;
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 59, 48, 0.75)'; // Crimson Ghost Trail
            ctx.lineWidth = 2.4;
            ctx.setLineDash([6, 5]);
            ctx.lineDashOffset = -animTime * 14;
            ctx.shadowBlur = 9;
            ctx.shadowColor = 'rgba(255, 59, 48, 0.6)';

            ctx.beginPath();
            pts.forEach((pt, i) => {
              const px = pt.x * w;
              const py = pt.y * h;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            });
            ctx.stroke();
            ctx.restore();

            // Bab el-Mandeb Hazard Beacons & Stoppage Zone (when timeOffsetDays >= -3)
            if (timeOffsetDays >= -3) {
              const babCp = chokepoints['bab_el_mandeb'] || { x: 0.612, y: 0.495 };
              const bx = babCp.x * w;
              const by = babCp.y * h;

              // Pulsing emergency shockwaves
              for (let r = 0; r < 3; r++) {
                const phase = ((animTime * 1.5 + r * 0.33) % 1);
                ctx.save();
                ctx.strokeStyle = `rgba(255, 59, 48, ${(1 - phase) * 0.65})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(bx, by, 8 + phase * 28, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
              }

              // Pulsing Hazard Icon
              ctx.save();
              ctx.fillStyle = '#ff3b30';
              ctx.shadowBlur = 12;
              ctx.shadowColor = '#ff3b30';
              ctx.beginPath();
              ctx.arc(bx, by, 5, 0, Math.PI * 2);
              ctx.fill();

              // Micro label
              ctx.font = '700 8.5px "JetBrains Mono", monospace';
              ctx.fillStyle = '#ff3b30';
              ctx.textAlign = 'center';
              ctx.fillText('🔴 BAB EL-MANDEB QUEUE (84 STRANDED)', bx, by - 14);
              ctx.restore();
            }
          }

          // Branch B: Autonomous Swarm Route (via Cape of Good Hope)
          if (branchId === 'branch_b' && geodesicRoutes['asia_europe_cape']) {
            const pts = geodesicRoutes['asia_europe_cape'].points;
            ctx.save();
            ctx.strokeStyle = 'rgba(0, 199, 190, 0.85)'; // Glowing Cyan
            ctx.lineWidth = 2.6;
            ctx.setLineDash([8, 4]);
            ctx.lineDashOffset = -animTime * 20;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0, 199, 190, 0.7)';

            ctx.beginPath();
            pts.forEach((pt, i) => {
              const px = pt.x * w;
              const py = pt.y * h;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            });
            ctx.stroke();
            ctx.restore();

            // Energy comets along Cape detour
            const numComets = 2;
            for (let c = 0; c < numComets; c++) {
              const cometProg = ((animTime * 0.15 + c * 0.5) % 1);
              const totalSegs = pts.length - 1;
              const segProg = cometProg * totalSegs;
              const segIdx = Math.min(totalSegs - 1, Math.floor(segProg));
              const sub = segProg - segIdx;
              const pA = pts[segIdx];
              const pB = pts[segIdx + 1];
              const cx = (pA.x + (pB.x - pA.x) * sub) * w;
              const cy = (pA.y + (pB.y - pA.y) * sub) * h;
              const angle = Math.atan2((pB.y - pA.y) * h, (pB.x - pA.x) * w);

              ctx.save();
              ctx.translate(cx, cy);
              ctx.rotate(angle);
              ctx.fillStyle = '#00c7be';
              ctx.shadowBlur = 10;
              ctx.shadowColor = '#00c7be';
              ctx.beginPath();
              ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }

          // Branch C: Emergency Air Express Route
          if (branchId === 'branch_c' && geodesicRoutes['air_bridge_urgent']) {
            const pts = geodesicRoutes['air_bridge_urgent'].points;
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 149, 0, 0.85)'; // Amber Trail
            ctx.lineWidth = 2.0;
            ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = -animTime * 24;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(255, 149, 0, 0.6)';

            ctx.beginPath();
            pts.forEach((pt, i) => {
              const px = pt.x * w;
              const py = pt.y * h;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            });
            ctx.stroke();
            ctx.restore();
          }
        });

        // 7B. Ghost Vessel Hulls Rendering
        vessels.forEach((v) => {
          activeBranches.forEach((branchId) => {
            const branchMeta = MULTIVERSE_BRANCHES[branchId];
            if (!branchMeta) return;

            const bState = calculateVesselMultiverseState(v, timeOffsetDays, branchId);
            const pos = getPosForRouteProgress(bState.routeId, bState.progress, w, h);

            // Record entity for hit detection
            const ghostEntity = {
              id: `${v.id}_${branchId}`,
              vessel: v,
              branchId,
              branchMeta,
              bState,
              pos
            };
            currentGhostEntities.push(ghostEntity);

            const isHovered = hoveredEntity?.type === 'ghost_vessel' && hoveredEntity.data.id === ghostEntity.id;

            ctx.save();
            ctx.translate(pos.x, pos.y);

            // Hover crosshairs for ghost hull
            if (isHovered) {
              ctx.save();
              ctx.strokeStyle = branchMeta.color;
              ctx.lineWidth = 1.6;
              ctx.setLineDash([3, 3]);
              ctx.beginPath();
              ctx.arc(0, 0, 16, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();
            }

            // Ghost Vessel Wake
            if (!bState.isAir && !bState.isStranded) {
              ctx.save();
              ctx.rotate(pos.heading);
              for (let k = 1; k <= 2; k++) {
                const wakeDist = -k * 7;
                ctx.strokeStyle = branchMeta.glowColor;
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.moveTo(wakeDist, -k * 3);
                ctx.lineTo(wakeDist + 3, 0);
                ctx.lineTo(wakeDist, k * 3);
                ctx.stroke();
              }
              ctx.restore();
            }

            // Stranded Warning Rings (Branch A)
            if (bState.isStranded) {
              const ringPhase = (animTime * 2) % 1;
              ctx.save();
              ctx.strokeStyle = `rgba(255, 59, 48, ${(1 - ringPhase) * 0.8})`;
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              ctx.arc(0, 0, 8 + ringPhase * 14, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();
            }

            // Render Hull
            ctx.save();
            ctx.rotate(pos.heading);
            if (isHovered) ctx.scale(1.25, 1.25);

            if (bState.isAir) {
              // Airplane silhouette
              ctx.fillStyle = branchMeta.color;
              ctx.shadowBlur = 8;
              ctx.shadowColor = branchMeta.glowColor;
              ctx.beginPath();
              ctx.moveTo(9, 0);
              ctx.lineTo(-4, -6);
              ctx.lineTo(-2, 0);
              ctx.lineTo(-4, 6);
              ctx.closePath();
              ctx.fill();
            } else {
              // Ghost Vessel Hull (Translucent with Glowing Border)
              ctx.fillStyle = branchId === 'branch_a' 
                ? 'rgba(255, 59, 48, 0.75)' 
                : branchId === 'branch_b'
                ? 'rgba(0, 199, 190, 0.85)'
                : 'rgba(255, 149, 0, 0.8)';
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.0;
              ctx.shadowBlur = isHovered ? 10 : 6;
              ctx.shadowColor = branchMeta.color;

              ctx.beginPath();
              ctx.moveTo(10, 0);
              ctx.lineTo(3, -3.5);
              ctx.lineTo(-8, -3.0);
              ctx.lineTo(-9, 0);
              ctx.lineTo(-8, 3.0);
              ctx.lineTo(3, 3.5);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              // Superstructure
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(-2, 0, 1.2, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();

            // Holographic Ghost Telemetry Label
            ctx.save();
            ctx.font = '700 8px "JetBrains Mono", monospace';
            ctx.textAlign = 'left';

            if (bState.isStranded) {
              ctx.fillStyle = '#ff3b30';
              ctx.fillText(`${v.name.split(' ')[0]} [STRANDED]`, 12, -4);
              ctx.font = '600 7.5px "JetBrains Mono", monospace';
              ctx.fillStyle = '#d70015';
              ctx.fillText(`+$${Math.min(2.4, Math.max(0, (timeOffsetDays - 2) * 0.18)).toFixed(1)}M Demurrage`, 12, 6);
            } else if (branchId === 'branch_b') {
              ctx.fillStyle = '#0071e3';
              ctx.fillText(`${v.name.split(' ')[0]} [SWARM] • ${bState.etaDays}d`, 12, -4);
              if (timeOffsetDays >= 14 && v.id === 'VSL-9821') {
                ctx.fillStyle = '#34c759';
                ctx.font = '600 7.5px "JetBrains Mono", monospace';
                ctx.fillText(`🟢 $4.48M Saved`, 12, 6);
              }
            } else if (branchId === 'branch_c') {
              ctx.fillStyle = '#ff9500';
              ctx.fillText(`${v.name.split(' ')[0]} [AIRLIFT] • ${bState.etaDays}d`, 12, -4);
            } else {
              ctx.fillStyle = branchMeta.color;
              ctx.fillText(`${v.name.split(' ')[0]} [${branchMeta.tag}] • ${bState.etaDays}d`, 12, -4);
            }
            ctx.restore();

            ctx.restore();
          });
        });

        ctx.restore();
      }
      ghostEntitiesRef.current = currentGhostEntities;

      ctx.restore(); // Restore pan & zoom matrix
      ctx.restore(); // Restore root canvas transform

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [vessels, geodesicRoutes, chokepoints, hubs, filterType, showLanes, showChokepoints, showHubs, showCurrents, showGraticule, zoom, pan, hoveredEntity, timeOffsetDays, activeBranches, getPosForRouteProgress, getVesselGeodesicPos]);

  // Mouse Interaction: Hover Detection, Pan Momentum, and Click Navigation
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Handle map drag panning
    if (isDraggingRef.current) {
      const dx = mouseX - dragStartRef.current.x;
      const dy = mouseY - dragStartRef.current.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      dragStartRef.current = { x: mouseX, y: mouseY };
      return;
    }

    const w = rect.width;
    const h = rect.height;

    // Transform mouse coordinate into unscaled world coordinates
    const worldMouseX = (mouseX - pan.x) / zoom;
    const worldMouseY = (mouseY - pan.y) / zoom;

    let found = null;
    const threshold = 18 / zoom;

    // Check Ghost Vessels First
    if (ghostEntitiesRef.current && ghostEntitiesRef.current.length > 0) {
      ghostEntitiesRef.current.forEach(item => {
        if (!found && Math.hypot(item.pos.x - worldMouseX, item.pos.y - worldMouseY) < threshold) {
          found = {
            type: 'ghost_vessel',
            data: item,
            screenX: mouseX,
            screenY: mouseY
          };
        }
      });
    }

    // Check Vessels
    if (!found) {
      vessels.forEach(v => {
        const pos = getVesselGeodesicPos(v, w, h);
        if (Math.hypot(pos.x - worldMouseX, pos.y - worldMouseY) < threshold) {
          found = { 
            type: 'vessel', 
            data: v, 
            screenX: mouseX, 
            screenY: mouseY 
          };
        }
      });
    }

    // Check Chokepoints
    if (!found && showChokepoints) {
      Object.values(chokepoints).forEach(cp => {
        const x = cp.x * w;
        const y = cp.y * h;
        if (Math.hypot(x - worldMouseX, y - worldMouseY) < threshold) {
          found = { 
            type: 'chokepoint', 
            data: cp, 
            screenX: mouseX, 
            screenY: mouseY 
          };
        }
      });
    }

    // Check Seaport Hubs
    if (!found && showHubs) {
      Object.values(hubs).forEach(hub => {
        const x = hub.x * w;
        const y = hub.y * h;
        if (Math.hypot(x - worldMouseX, y - worldMouseY) < threshold) {
          found = { 
            type: 'hub', 
            data: hub, 
            screenX: mouseX, 
            screenY: mouseY 
          };
        }
      });
    }

    hoverEntityRef.current = found;
    setHoveredEntity(found);
  };

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    dragStartRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    setZoom(prevZoom => {
      const newZoom = Math.max(0.75, Math.min(3.5, prevZoom * zoomFactor));
      // Zoom centered at mouse position
      setPan(prevPan => ({
        x: mouseX - (mouseX - prevPan.x) * (newZoom / prevZoom),
        y: mouseY - (mouseY - prevPan.y) * (newZoom / prevZoom)
      }));
      return newZoom;
    });
  };

  const handleCanvasClick = () => {
    if (hoveredEntity && hoveredEntity.type === 'vessel') {
      onSelectVessel(hoveredEntity.data);
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <section 
      ref={containerRef}
      className="apple-map-container" 
      aria-label="Interactive Global Digital Twin"
      style={{ cursor: isDraggingRef.current ? 'grabbing' : (hoveredEntity ? 'pointer' : 'grab') }}
    >
      <canvas 
        ref={canvasRef} 
        className="apple-canvas-viewport"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
      />

      {/* Top Left: VisionOS Glass AIS Stream Badge */}
      <div className="map-glass-badge" title="Live AIS Telemetry Synchronized">
        <IconRadar size={13} className="badge-radar-icon" />
        <span>LIVE AIS STREAM</span>
        <span className="badge-vessel-count">{vessels.length} FLEET VESSELS</span>
      </div>

      {/* Top Right: Minimalist Glowing Compass Rose & UTC Chronometer */}
      <div className="map-compass-badge" title="Global Coordinated Time & True Bearing">
        <div className="compass-dial" aria-hidden="true">
          <span className="compass-needle-n"></span>
          <span className="compass-needle-s"></span>
        </div>
        <span className="compass-utc-text">{utcTimeStr}</span>
      </div>

      {/* Floating Interactive visionOS Glass Tooltip */}
      {hoveredEntity && (
        <div 
          className="map-interactive-tooltip"
          style={{ left: `${hoveredEntity.screenX}px`, top: `${hoveredEntity.screenY}px` }}
        >
          {hoveredEntity.type === 'ghost_vessel' && (
            <>
              <div className="tooltip-header">
                <span className="tooltip-title">{hoveredEntity.data.vessel.name}</span>
                <span 
                  className="tooltip-badge"
                  style={{ 
                    backgroundColor: hoveredEntity.data.branchMeta.accentBg, 
                    color: hoveredEntity.data.branchMeta.color,
                    borderColor: hoveredEntity.data.branchMeta.color 
                  }}
                >
                  {hoveredEntity.data.branchMeta.tag}
                </span>
              </div>
              <p className="tooltip-sub">{hoveredEntity.data.branchMeta.name} • {hoveredEntity.data.branchMeta.strategy}</p>

              <div className="tooltip-stats-grid">
                <div className="tooltip-stat-item">
                  <span className="tooltip-stat-lbl">REALITY STATUS</span>
                  <span className="tooltip-stat-val" style={{ color: hoveredEntity.data.branchMeta.color }}>
                    {hoveredEntity.data.bState.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <div className="tooltip-stat-item">
                  <span className="tooltip-stat-lbl">ETA TARGET</span>
                  <span className="tooltip-stat-val">{hoveredEntity.data.bState.etaDays} Days</span>
                </div>
                <div className="tooltip-stat-item">
                  <span className="tooltip-stat-lbl">CARGO VALUE</span>
                  <span className="tooltip-stat-val val-green">${hoveredEntity.data.vessel.cargoValueM}M</span>
                </div>
                <div className="tooltip-stat-item">
                  <span className="tooltip-stat-lbl">TIME HORIZON</span>
                  <span className="tooltip-stat-val val-blue">
                    {timeOffsetDays >= 0 ? `T+${Math.round(timeOffsetDays)}d` : `T${Math.round(timeOffsetDays)}d`}
                  </span>
                </div>
              </div>

              {hoveredEntity.data.bState.isStranded && (
                <div className="tooltip-ai-note tooltip-note-danger">
                  [HOLD] Canal Queue Deadlock: Vessel anchored in Bab el-Mandeb chokepoint. $130,000/day detention penalty active. 3 assembly lines halted.
                </div>
              )}

              {hoveredEntity.data.branchId === 'branch_b' && (
                <div className="tooltip-ai-note tooltip-note-success">
                  [CONSENSUS] Swarm Consensus Detour: Cape of Good Hope corridor bypasses missile hazard. 100% SLA delivery met; $4.48M capital preserved.
                </div>
              )}

              {hoveredEntity.data.branchId === 'branch_c' && (
                <div className="tooltip-ai-note tooltip-note-warning">
                  [AIRLIFT] Urgent Polar Airlift: Fast arrival (-4 days) achieved via express air corridor at +$3.2M freight cost.
                </div>
              )}
            </>
          )}

          {hoveredEntity.type === 'vessel' && (
            <>
              <div className="tooltip-header">
                <span className="tooltip-title">{hoveredEntity.data.name}</span>
                <span className={`tooltip-badge ${hoveredEntity.data.status === 'autonomously_rerouted' ? 'badge-alert' : 'badge-safe'}`}>
                  {hoveredEntity.data.status === 'autonomously_rerouted' ? 'DETOUR' : 'NOMINAL'}
                </span>
              </div>
              <p className="tooltip-sub">{hoveredEntity.data.type} • IMO {hoveredEntity.data.id}</p>
              
              <div className="tooltip-stats-grid">
                <div className="tooltip-stat-item">
                  <span className="tooltip-stat-lbl">CARGO MANIFEST</span>
                  <span className="tooltip-stat-val val-green">${hoveredEntity.data.cargoValueM}M</span>
                </div>
                <div className="tooltip-stat-item">
                  <span className="tooltip-stat-lbl">ETA TARGET</span>
                  <span className="tooltip-stat-val">{hoveredEntity.data.etaDays} Days</span>
                </div>
                <div className="tooltip-stat-item">
                  <span className="tooltip-stat-lbl">SPEED / TELEMETRY</span>
                  <span className="tooltip-stat-val">{hoveredEntity.data.speedKnots} kts</span>
                </div>
                <div className="tooltip-stat-item">
                  <span className="tooltip-stat-lbl">DESTINATION</span>
                  <span className="tooltip-stat-val val-blue">{hoveredEntity.data.destination || 'Rotterdam'}</span>
                </div>
              </div>

              {hoveredEntity.data.status === 'autonomously_rerouted' && (
                <div className="tooltip-ai-note">
                  [CONSENSUS] Swarm Consensus Detour Active: Cape of Good Hope reroute confirmed to avoid Red Sea missile corridor.
                </div>
              )}
            </>
          )}

          {hoveredEntity.type === 'chokepoint' && (
            <>
              <div className="tooltip-header">
                <span className="tooltip-title">{hoveredEntity.data.name}</span>
                <span className={`tooltip-badge ${hoveredEntity.data.riskLevel > 0.5 ? 'badge-alert' : 'badge-safe'}`}>
                  {(hoveredEntity.data.riskLevel * 100).toFixed(0)}% RISK
                </span>
              </div>
              <p className="tooltip-sub">Strategic Maritime Bottleneck</p>
              <div className="tooltip-stats-grid">
                <div className="tooltip-stat-item">
                  <span className="tooltip-stat-lbl">DAILY TRANSITS</span>
                  <span className="tooltip-stat-val">{hoveredEntity.data.flowRate} Vessels/Day</span>
                </div>
                <div className="tooltip-stat-item">
                  <span className="tooltip-stat-lbl">STATUS</span>
                  <span className="tooltip-stat-val val-blue">{hoveredEntity.data.status.toUpperCase()}</span>
                </div>
              </div>
              <div className="tooltip-ai-note">
                Vulnerability: {hoveredEntity.data.vulnerability}
              </div>
            </>
          )}

          {hoveredEntity.type === 'hub' && (
            <>
              <div className="tooltip-header">
                <span className="tooltip-title">{hoveredEntity.data.name}</span>
                <span className="tooltip-badge badge-safe">PORT HUB</span>
              </div>
              <p className="tooltip-sub">{hoveredEntity.data.city}</p>
              <div className="tooltip-stats-grid">
                <div className="tooltip-stat-item">
                  <span className="tooltip-stat-lbl">ANNUAL TEU</span>
                  <span className="tooltip-stat-val val-blue">{(hoveredEntity.data.capacityTEU / 1000000).toFixed(1)}M TEU</span>
                </div>
                <div className="tooltip-stat-item">
                  <span className="tooltip-stat-lbl">CONGESTION</span>
                  <span className="tooltip-stat-val val-green">{(hoveredEntity.data.currentCongestion * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="tooltip-ai-note">
                Role: {hoveredEntity.data.role}
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating HUD Controls: Vessel Filters, Layer Toggles, and Zoom Momentum */}
      <div className="map-floating-hud">
        {/* Fleet Filters */}
        <div className="hud-group">
          <span className="hud-label">
            <IconFilter size={11} />
            <span>FLEET:</span>
          </span>
          <SlidingSegmentedControl
            options={[
              { id: 'all', label: 'All' },
              { id: 'rerouted', label: 'Rerouted' },
              { id: 'high_value', label: 'High Value' }
            ]}
            value={filterType}
            onChange={setFilterType}
            size="sm"
            className="hud-segmented"
            ariaLabel="Vessel Filters"
          />
        </div>

        {/* Layer Toggles */}
        <div className="hud-group">
          <span className="hud-label">
            <IconLayers size={11} />
            <span>LAYERS:</span>
          </span>
          <button 
            type="button"
            className={`hud-pill ${showLanes ? 'active' : ''}`}
            onClick={() => setShowLanes(!showLanes)}
            title="Toggle Trade Lanes & Fiber-Optic Energy Comets"
          >
            Lanes
          </button>
          <button 
            type="button"
            className={`hud-pill ${showChokepoints ? 'active' : ''}`}
            onClick={() => setShowChokepoints(!showChokepoints)}
            title="Toggle Strategic Chokepoint Shockwaves"
          >
            Chokepoints
          </button>
          <button 
            type="button"
            className={`hud-pill ${showHubs ? 'active' : ''}`}
            onClick={() => setShowHubs(!showHubs)}
            title="Toggle Global Seaport Hubs & Congestion Gauges"
          >
            Ports
          </button>
          <button 
            type="button"
            className={`hud-pill ${showCurrents ? 'active' : ''}`}
            onClick={() => setShowCurrents(!showCurrents)}
            title="Toggle Ocean Current Flowlines (Gulf Stream / Kuroshio)"
          >
            Currents
          </button>
          <button 
            type="button"
            className={`hud-pill ${showGraticule ? 'active' : ''}`}
            onClick={() => setShowGraticule(!showGraticule)}
            title="Toggle Latitude / Longitude Graticule"
          >
            Grid
          </button>
        </div>

        {/* Smooth Zoom Controls */}
        <div className="map-zoom-controls">
          <button 
            type="button" 
            className="zoom-btn" 
            onClick={() => setZoom(z => Math.min(3.5, z * 1.25))}
            title="Zoom In"
            aria-label="Zoom in"
          >
            +
          </button>
          <button 
            type="button" 
            className="zoom-btn" 
            onClick={() => setZoom(z => Math.max(0.75, z * 0.8))}
            title="Zoom Out"
            aria-label="Zoom out"
          >
            −
          </button>
          <button 
            type="button" 
            className="zoom-btn zoom-btn-reset" 
            onClick={resetView}
            title="Reset View Fit"
          >
            FIT
          </button>
        </div>
      </div>

      {/* Floating Time Machine Scrubber Bar (.time-machine-dock) */}
      <TimeMachineDock
        timeOffsetDays={timeOffsetDays}
        onSetTimeOffset={onSetTimeOffset}
        isPlaying={isTimeMachinePlaying}
        onTogglePlay={onToggleTimeMachinePlay}
        playbackSpeed={timeMachineSpeed}
        onSetPlaybackSpeed={onSetTimeMachineSpeed}
        activeBranches={activeBranches}
        onToggleBranch={onToggleBranch}
        onOpenMultiverseDrawer={onOpenMultiverseDrawer}
        onTriggerJudgeDemo={onTriggerJudgeDemo}
        isJudgeDemoActive={isJudgeDemoActive}
      />
    </section>
  );
}
