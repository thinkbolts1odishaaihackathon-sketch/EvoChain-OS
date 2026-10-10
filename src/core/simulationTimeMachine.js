/**
 * EvoChain-OS: Simulation Time Machine & Parallel Multiverse Branching Engine
 * 
 * Provides temporal calculations across:
 * - Historical Replay: T - 7d to T0
 * - Predictive Horizons: T + 7d, T + 14d, T + 30d
 * - Multiverse What-If Branches: Legacy Status Quo, Autonomous Swarm, Emergency Air-Only
 */

export const TIME_HORIZONS = {
  MIN_DAYS: -7,
  MAX_DAYS: 30,
  BASE_DATE: new Date('2026-10-10T12:00:00Z') // T0 reference
};

export const TIME_MILESTONES = [
  { 
    day: -7, 
    label: 'T-7d', 
    title: 'Historical Ingestion', 
    badge: 'HISTORICAL', 
    glyph: 'history',
    desc: 'Replay pre-crisis baseline telemetry across Red Sea and Malacca corridors.' 
  },
  { 
    day: -3, 
    label: 'T-3d', 
    title: 'Missile NOTAM', 
    badge: 'CRISIS SHOCK', 
    glyph: 'alert',
    chokepoint: 'bab_el_mandeb',
    desc: 'Drone & missile strikes reported in Bab el-Mandeb. War risk premium spikes 520%.' 
  },
  { 
    day: 0, 
    label: 'T0', 
    title: 'Swarm Consensus', 
    badge: 'LIVE AIS', 
    glyph: 'live',
    desc: 'Live telemetry anchor. Autonomous multi-agent swarm reaches detour consensus.' 
  },
  { 
    day: 7, 
    label: 'T+7d', 
    title: 'Buffer Rebalanced', 
    badge: 'NEAR-TERM', 
    glyph: 'buffer',
    desc: 'Synapse buffer agents expand EU warehouse inventory +24.5% to absorb transit delta.' 
  },
  { 
    day: 14, 
    label: 'T+14d', 
    title: 'Cape Transit', 
    badge: 'MID-TERM', 
    glyph: 'transit',
    desc: 'Diverted fleet rounds Cape of Good Hope; canal queues reach 84 stranded vessels.' 
  },
  { 
    day: 30, 
    label: 'T+30d', 
    title: 'Nominal Delivery', 
    badge: 'LONG-TERM', 
    glyph: 'target',
    desc: 'Full supply chain equilibrium restored. Self-evolution policy Gen 5 deployed.' 
  }
];

export const MULTIVERSE_BRANCHES = {
  branch_a: {
    id: 'branch_a',
    name: 'Legacy Status Quo',
    tag: 'STATUS QUO',
    strategy: 'Do nothing; wait in canal queue',
    color: '#ff3b30',
    glowColor: 'rgba(255, 59, 48, 0.45)',
    accentBg: 'rgba(255, 59, 48, 0.08)',
    borderColor: 'rgba(255, 59, 48, 0.3)',
    visualIndicator: 'Crimson Ghost Trail (#ff3b30) with hazard beacons',
    description: 'Fleet maintains original voyage plans into Bab el-Mandeb despite drone/missile alerts. Results in complete vessel immobilization in the Red Sea and catastrophic downstream factory halts.',
    badgeClass: 'branch-badge-legacy',
    metrics: {
      strandedDaysLabel: '18 Days Stranded',
      demurrageLabel: '$2.4M Demurrage Fees',
      factoryHaltsLabel: '3 Factory Assembly Lines Halted',
      capitalAtRisk: '$4.8M Loss',
      transitVariance: '+18.5 Days Delay',
      slaRate: '42.0%',
      carbonFootprint: '4,260 MT CO2',
      carbonNote: '+11% auxiliary idling burn'
    },
    // Dynamic values as time scrubber moves
    getDynamicMetrics: (tDays) => {
      const strandedDays = tDays > 0 ? Math.min(18, Math.max(0, Math.round(tDays - 1))) : 0;
      const demurrageM = tDays > 2 ? +(Math.min(2.4, (tDays - 2) * 0.19)).toFixed(2) : 0;
      const factoryHalts = tDays >= 14 ? 3 : tDays >= 10 ? 2 : tDays >= 7 ? 1 : 0;
      const capitalLostM = tDays > 0 ? +(Math.min(4.8, 0.8 + tDays * 0.28)).toFixed(2) : 0.8;
      return {
        strandedDays,
        demurrageM,
        factoryHalts,
        capitalLostM,
        transitVariance: `+${(Math.max(1, tDays * 1.25)).toFixed(1)}d Delay`,
        slaRate: `${Math.max(38, Math.round(98 - tDays * 3.8))}%`,
        carbonMT: Math.round(3840 + strandedDays * 35)
      };
    }
  },
  branch_b: {
    id: 'branch_b',
    name: 'Autonomous Swarm (Active)',
    tag: 'ACTIVE SWARM',
    strategy: '80% Cape detour + 20% critical air-bridge',
    color: '#0071e3',
    cyanColor: '#00c7be',
    glowColor: 'rgba(0, 199, 190, 0.45)',
    accentBg: 'rgba(0, 113, 227, 0.08)',
    borderColor: 'rgba(0, 199, 190, 0.35)',
    visualIndicator: 'Glowing Cyan/Blue Trajectory (#0071e3)',
    description: 'Sentinel identifies corridor threat; Nexus reroutes 80% tonnage around Cape of Good Hope while Synapse coordinates express air-bridge for high-value microchips. Zero downtime.',
    badgeClass: 'branch-badge-swarm',
    metrics: {
      strandedDaysLabel: '0 Days Stranded',
      demurrageLabel: '$0 Demurrage',
      factoryHaltsLabel: '0 Factory Downtime (100% SLA)',
      capitalAtRisk: '$320k Bunker Delta',
      transitVariance: '+2.1 Days',
      slaRate: '100% SLA Met',
      carbonFootprint: '4,120 MT CO2',
      carbonNote: 'IMO 2026 Compliant (Slow-steaming trim)'
    },
    getDynamicMetrics: (tDays) => {
      const netSavedM = tDays >= 14 ? 4.48 : tDays > 0 ? +(Math.max(0.6, tDays * 0.32)).toFixed(2) : 0.4;
      return {
        strandedDays: 0,
        demurrageM: 0,
        factoryHalts: 0,
        capitalLostM: 0.32,
        netSavedM,
        transitVariance: '+2.1 Days (Smooth)',
        slaRate: '100%',
        carbonMT: 4120
      };
    }
  },
  branch_c: {
    id: 'branch_c',
    name: 'Emergency Air-Only',
    tag: 'POLAR AIRLIFT',
    strategy: '100% urgent polar air freight',
    color: '#ff9500',
    glowColor: 'rgba(255, 149, 0, 0.45)',
    accentBg: 'rgba(255, 149, 0, 0.08)',
    borderColor: 'rgba(255, 149, 0, 0.3)',
    visualIndicator: 'Amber Trail (#ff9500)',
    description: 'Emergency charter of intercontinental air cargo fleet. Bypasses all maritime corridors for ultra-rapid delivery (-4 days), but incurs massive cost surges and 180% carbon spike.',
    badgeClass: 'branch-badge-air',
    metrics: {
      strandedDaysLabel: '0 Days Stranded',
      demurrageLabel: '$0 Demurrage',
      factoryHaltsLabel: '0 Factory Halts',
      capitalAtRisk: '+$3.2M Freight Surge',
      transitVariance: '-4.0 Days (Fastest)',
      slaRate: '98.5%',
      carbonFootprint: '10,750 MT CO2',
      carbonNote: '+180% Carbon Penalty'
    },
    getDynamicMetrics: (tDays) => {
      return {
        strandedDays: 0,
        demurrageM: 0,
        factoryHalts: 0,
        capitalLostM: tDays > 0 ? 3.20 : 0,
        transitVariance: '-4.0 Days (Express)',
        slaRate: '98.5%',
        carbonMT: 10750
      };
    }
  }
};

/**
 * Formats calendar date based on time offset from T0 reference (2026-10-10)
 */
export function formatTemporalDate(offsetDays) {
  const date = new Date(TIME_HORIZONS.BASE_DATE.getTime());
  date.setDate(date.getDate() + offsetDays);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  let tag = 'PROJECTED';
  let prefix = `T+${offsetDays}d`;
  if (offsetDays < 0) {
    tag = 'HISTORICAL';
    prefix = `T${offsetDays}d`;
  } else if (offsetDays === 0) {
    tag = 'LIVE AIS';
    prefix = 'T0';
  }

  return {
    dateStr,
    prefix,
    tag,
    holographicDisplay: `${dateStr} // ${prefix} [${tag}]`
  };
}

/**
 * Calculates vessel spatial position, heading, and state at time T
 * for a specific multiverse branch reality
 */
export function calculateVesselMultiverseState(vessel, tDays, branchId) {
  const isEuropeSuezCandidate = ['VSL-9821', 'VSL-7719', 'VSL-5520'].includes(vessel.id);
  
  if (!isEuropeSuezCandidate) {
    // Other vessels (Transpacific / Transatlantic) advance with normal physics
    const standardDays = vessel.currentRouteId.includes('transpacific') ? 14 : 9;
    const ratePerDay = 1 / standardDays;
    let progress = Math.max(0.05, Math.min(0.98, vessel.progress + tDays * ratePerDay));
    return {
      routeId: vessel.currentRouteId,
      progress,
      status: 'on_schedule',
      isStranded: false,
      isAir: vessel.currentRouteId.includes('air'),
      etaDays: Math.max(0.2, +((1 - progress) * standardDays).toFixed(1))
    };
  }

  // Branch A: Legacy Status Quo
  if (branchId === 'branch_a') {
    const standardDays = 24;
    const ratePerDay = 1 / standardDays;
    
    if (tDays <= 0) {
      // Historical or T0
      const progress = Math.max(0.05, Math.min(0.48, vessel.progress + tDays * ratePerDay));
      return {
        routeId: 'asia_europe_suez',
        progress,
        status: tDays < -3 ? 'on_schedule' : 'threat_warning',
        isStranded: false,
        isAir: false,
        etaDays: Math.max(1, +((1 - progress) * standardDays).toFixed(1))
      };
    } else {
      // In the future: vessel heads into Red Sea and gets stuck around Bab el-Mandeb (progress 0.49)
      const targetMaxProgress = 0.49;
      const nominalProgress = vessel.progress + tDays * ratePerDay;
      const isStranded = nominalProgress >= targetMaxProgress;
      const progress = Math.min(targetMaxProgress, nominalProgress);
      
      return {
        routeId: 'asia_europe_suez',
        progress,
        status: isStranded ? 'stranded_queue' : 'approaching_chokepoint',
        isStranded,
        isAir: false,
        etaDays: isStranded ? +(18 + tDays * 0.5).toFixed(1) : +((1 - progress) * standardDays).toFixed(1)
      };
    }
  }

  // Branch B: Autonomous Swarm (Cape detour + Air-bridge for critical semiconductor chips)
  if (branchId === 'branch_b') {
    if (tDays <= 0) {
      const standardDays = 24;
      const ratePerDay = 1 / standardDays;
      const progress = Math.max(0.05, Math.min(vessel.progress, vessel.progress + tDays * ratePerDay));
      return {
        routeId: 'asia_europe_suez',
        progress,
        status: 'on_schedule',
        isStranded: false,
        isAir: false,
        etaDays: Math.max(1, +((1 - progress) * standardDays).toFixed(1))
      };
    } else {
      // Diverted to Cape Route (36 standard days)
      const standardDays = 36;
      // Vessel starts detour smoothly from its T0 position mapped onto Cape Route
      const baseCapeProgress = 0.22;
      const progress = Math.min(0.98, baseCapeProgress + (tDays / standardDays));
      return {
        routeId: 'asia_europe_cape',
        progress,
        status: 'swarm_detour_optimal',
        isStranded: false,
        isAir: false,
        etaDays: Math.max(0.5, +((1 - progress) * standardDays).toFixed(1))
      };
    }
  }

  // Branch C: Emergency Air-Only
  if (branchId === 'branch_c') {
    if (tDays <= 0) {
      return {
        routeId: 'asia_europe_suez',
        progress: vessel.progress,
        status: 'nominal',
        isStranded: false,
        isAir: false,
        etaDays: vessel.etaDays
      };
    } else {
      // Switched to urgent Polar Air Corridor (2.5 standard days)
      const airProgress = Math.min(1.0, 0.15 + (tDays / 2.5));
      return {
        routeId: 'air_bridge_urgent',
        progress: airProgress,
        status: airProgress >= 0.99 ? 'delivered_urgent' : 'polar_airlift',
        isStranded: false,
        isAir: true,
        etaDays: Math.max(0, +(Math.max(0, (1 - airProgress) * 2.5)).toFixed(1))
      };
    }
  }

  return {
    routeId: vessel.currentRouteId,
    progress: vessel.progress,
    status: vessel.status,
    isStranded: false,
    isAir: false,
    etaDays: vessel.etaDays
  };
}
