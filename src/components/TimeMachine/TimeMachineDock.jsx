import React, { useState, useEffect, useRef } from 'react';
import { 
  TIME_HORIZONS, 
  TIME_MILESTONES, 
  MULTIVERSE_BRANCHES, 
  formatTemporalDate 
} from '../../core/simulationTimeMachine';
import { 
  IconPlay, 
  IconPause, 
  IconFastForward, 
  IconRewind, 
  IconFork, 
  IconScale, 
  IconSparkle, 
  IconTimeMachine,
  IconChevronDown,
  IconChevronUp
} from '../Icons';

export default function TimeMachineDock({
  timeOffsetDays,
  onSetTimeOffset,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onSetPlaybackSpeed,
  activeBranches,
  onToggleBranch,
  onOpenMultiverseDrawer,
  onTriggerJudgeDemo,
  isJudgeDemoActive
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHoveringMilestone, setIsHoveringMilestone] = useState(null);
  const sliderRef = useRef(null);

  // Magnetic snap points
  const snapDays = [-7, -3, 0, 7, 14, 30];

  // Holographic date display
  const temporal = formatTemporalDate(Math.round(timeOffsetDays));

  // Magnetic snapping during scrub
  const handleSliderChange = (e) => {
    const rawVal = parseFloat(e.target.value);
    
    // Magnetic pull threshold (within 0.8 days snaps to milestone)
    let snappedVal = rawVal;
    for (const snap of snapDays) {
      if (Math.abs(rawVal - snap) < 0.75) {
        snappedVal = snap;
        break;
      }
    }
    onSetTimeOffset(snappedVal);
  };

  const handleStep = (direction) => {
    const step = direction > 0 ? 1 : -1;
    const current = Math.round(timeOffsetDays);
    const next = Math.max(TIME_HORIZONS.MIN_DAYS, Math.min(TIME_HORIZONS.MAX_DAYS, current + step));
    onSetTimeOffset(next);
  };

  const speedOptions = [1, 5, 20];

  if (isCollapsed) {
    return (
      <aside className="time-machine-dock-wrapper time-machine-dock-collapsed" aria-label="Supply Chain Time Machine (Minimized)">
        <div className="time-machine-collapsed-dock">
          <div 
            className="collapsed-left-info" 
            onClick={() => setIsCollapsed(false)} 
            role="button" 
            tabIndex={0} 
            title="Click to expand full temporal timeline scrubber"
          >
            <div className="collapsed-brand-icon">
              <IconTimeMachine size={13} />
              <span className="dock-brand-pulse"></span>
            </div>
            <div className="collapsed-holographic-readout">
              <span className="collapsed-date-line">{temporal.holographicDisplay}</span>
              <span className="collapsed-sub-line">
                {timeOffsetDays < 0 ? 'HISTORICAL' : timeOffsetDays === 0 ? 'LIVE' : `T+${Math.round(timeOffsetDays)}d SIM`}
              </span>
            </div>
          </div>

          <div className="collapsed-controls">
            <button
              type="button"
              className="collapsed-step-btn"
              onClick={() => handleStep(-1)}
              title="Step Back 1 Day (←)"
              aria-label="Step back 1 day"
            >
              <IconRewind size={10} />
            </button>

            <button
              type="button"
              className={`collapsed-play-btn ${isPlaying ? 'dock-btn-playing' : ''}`}
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause Scrubber (Space)' : 'Play Timeline (Space)'}
              aria-label={isPlaying ? 'Pause time machine' : 'Play time machine'}
            >
              {isPlaying ? <IconPause size={10} /> : <IconPlay size={10} />}
            </button>

            <button
              type="button"
              className="collapsed-step-btn"
              onClick={() => handleStep(1)}
              title="Step Forward 1 Day (→)"
              aria-label="Step forward 1 day"
            >
              <IconFastForward size={10} />
            </button>
          </div>

          <button
            type="button"
            className="collapsed-expand-btn"
            onClick={() => setIsCollapsed(false)}
            title="Expand Full Temporal Timeline & Multiverse Scrubber"
          >
            <IconChevronUp size={11} />
            <span>Timeline</span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="time-machine-dock-wrapper" aria-label="Supply Chain Time Machine">
      {/* 1. Floating Judge Demo Showcase Trigger Pill */}
      <div className="time-machine-showcase-bar">
        <button
          type="button"
          className={`judge-demo-btn ${isJudgeDemoActive ? 'judge-demo-pulse' : ''}`}
          onClick={onTriggerJudgeDemo}
          title="Execute 6-Second Autonomous Multiverse Demonstration"
        >
          <IconSparkle size={13} className="judge-demo-sparkle-icon" />
          <span className="judge-demo-btn-label">Play Time Machine Simulation (Judge Demo)</span>
          <span className="judge-demo-badge">6s WOW TOUR</span>
        </button>

        <button
          type="button"
          className="multiverse-compare-trigger-btn"
          onClick={onOpenMultiverseDrawer}
          title="Open Side-by-Side Multiverse Comparison Matrix"
        >
          <IconScale size={13} />
          <span>Compare Multiverse</span>
          <span className="compare-badge">{activeBranches.length} Branches</span>
        </button>
      </div>

      {/* 2. Main Frosted Glass Pill Dock */}
      <nav className="time-machine-dock" aria-label="Time Machine Controls">
        {/* Left Section: Temporal Brand & Holographic Readout */}
        <div className="dock-left-meta">
          <div className="dock-brand-icon" title="Temporal AIS Vector Scrubber">
            <IconTimeMachine size={15} />
            <span className="dock-brand-pulse"></span>
          </div>
          <div className="dock-holographic-readout">
            <span className="holo-date-line">{temporal.holographicDisplay}</span>
            <span className="holo-sub-line">
              {timeOffsetDays < 0 ? 'HISTORICAL INGESTION' : timeOffsetDays === 0 ? 'REAL-TIME TELEMETRY' : 'PARETO SIMULATION'}
            </span>
          </div>
        </div>

        {/* Center Section: Keyframe Scrub Track & Magnetic Playhead */}
        <div className="dock-scrubber-center">
          {/* Milestone Keyframe Markers */}
          <div className="dock-milestones-track">
            {TIME_MILESTONES.map((m) => {
              // Calculate percent along -7 to 30 span
              const pct = ((m.day - TIME_HORIZONS.MIN_DAYS) / (TIME_HORIZONS.MAX_DAYS - TIME_HORIZONS.MIN_DAYS)) * 100;
              const isPassed = timeOffsetDays >= m.day;
              const isCurrent = Math.abs(timeOffsetDays - m.day) < 0.8;

              return (
                <button
                  key={m.day}
                  type="button"
                  className={`dock-milestone-marker ${isPassed ? 'milestone-passed' : ''} ${isCurrent ? 'milestone-current' : ''}`}
                  style={{ left: `${pct}%` }}
                  onClick={() => onSetTimeOffset(m.day)}
                  onMouseEnter={() => setIsHoveringMilestone(m)}
                  onMouseLeave={() => setIsHoveringMilestone(null)}
                  title={`${m.label}: ${m.title} - ${m.desc}`}
                >
                  <span className="marker-dot"></span>
                  <span className="marker-label">
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Range Input with Custom Styled Playhead */}
          <div className="dock-slider-container">
            <input
              ref={sliderRef}
              type="range"
              min={TIME_HORIZONS.MIN_DAYS}
              max={TIME_HORIZONS.MAX_DAYS}
              step={0.1}
              value={timeOffsetDays}
              onChange={handleSliderChange}
              className="dock-time-slider"
              aria-label="Scrub temporal timeline"
            />
            {/* Progress Fill Line */}
            <div 
              className="dock-slider-fill"
              style={{
                width: `${((timeOffsetDays - TIME_HORIZONS.MIN_DAYS) / (TIME_HORIZONS.MAX_DAYS - TIME_HORIZONS.MIN_DAYS)) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Controls: Play/Pause, Step, and Speed Toggles */}
        <div className="dock-playback-controls">
          <button
            type="button"
            className="dock-step-btn"
            onClick={() => handleStep(-1)}
            title="Step Back 1 Day (←)"
            aria-label="Step back 1 day"
          >
            <IconRewind size={11} />
          </button>

          <button
            type="button"
            className={`dock-play-pause-btn ${isPlaying ? 'dock-btn-playing' : ''}`}
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause Scrubber (Space)' : 'Play Timeline (Space)'}
            aria-label={isPlaying ? 'Pause time machine' : 'Play time machine'}
          >
            {isPlaying ? <IconPause size={12} /> : <IconPlay size={12} />}
          </button>

          <button
            type="button"
            className="dock-step-btn"
            onClick={() => handleStep(1)}
            title="Step Forward 1 Day (→)"
            aria-label="Step forward 1 day"
          >
            <IconFastForward size={11} />
          </button>

          {/* Speed Toggle Pills */}
          <div className="dock-speed-pills">
            {speedOptions.map((spd) => (
              <button
                key={spd}
                type="button"
                className={`speed-pill-btn ${playbackSpeed === spd ? 'speed-active' : ''}`}
                onClick={() => onSetPlaybackSpeed(spd)}
                title={`Playback Speed ${spd}x`}
              >
                {spd}x
              </button>
            ))}
            <button
              type="button"
              className="speed-pill-btn instant-skip-btn"
              onClick={() => onSetTimeOffset(14)}
              title="Instant Skip to T+14d Cape Transit"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Multiverse Branch Selector Pills */}
        <div className="dock-branch-selectors">
          <div className="branch-pills-label" title="Active Parallel Multiverse Realities">
            <IconFork size={11} />
            <span className="branch-pills-label-text">BRANCHES</span>
          </div>

          {Object.values(MULTIVERSE_BRANCHES).map((branch) => {
            const isActive = activeBranches.includes(branch.id);
            const shortName = branch.id === 'branch_a' ? 'Legacy' : branch.id === 'branch_b' ? 'Swarm' : 'Air';
            return (
              <button
                key={branch.id}
                type="button"
                className={`dock-branch-pill ${isActive ? 'branch-pill-active' : 'branch-pill-inactive'} ${branch.badgeClass}`}
                onClick={() => onToggleBranch(branch.id)}
                title={`Toggle ${branch.name}: ${branch.strategy}`}
              >
                <span className="branch-dot" style={{ backgroundColor: branch.color }}></span>
                <span className="branch-name">{shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Minimize / Collapse Button to hide historical bar */}
        <button
          type="button"
          className="dock-collapse-minimize-btn"
          onClick={() => setIsCollapsed(true)}
          title="Minimize timeline dock to maximize map visibility"
          aria-label="Minimize timeline"
        >
          <IconChevronDown size={11} />
          <span>Hide</span>
        </button>
      </nav>

      {/* Floating Milestone Tooltip when hovered */}
      {isHoveringMilestone && (
        <div 
          className="dock-milestone-popover"
          style={{
            left: `${((isHoveringMilestone.day - TIME_HORIZONS.MIN_DAYS) / (TIME_HORIZONS.MAX_DAYS - TIME_HORIZONS.MIN_DAYS)) * 100}%`
          }}
        >
          <div className="popover-badge-row">
            <IconTimeMachine size={12} />
            <span className="popover-title">{isHoveringMilestone.title}</span>
            <span className="popover-badge">{isHoveringMilestone.badge}</span>
          </div>
          <p className="popover-desc">{isHoveringMilestone.desc}</p>
        </div>
      )}
    </aside>
  );
}
