import React, { useState, useEffect, useRef } from 'react';
import { 
  WORLD_HUBS, 
  CHOKEPOINTS, 
  TRADE_LANES, 
  INITIAL_VESSELS, 
  INITIAL_MACRO_METRICS, 
  DISRUPTION_SCENARIOS 
} from './data/worldData';
import { 
  AgentMessageBus, 
  SentinelAgent, 
  MarketShiftOracleAgent, 
  NexusLogisticsArbiterAgent, 
  SynapseBufferAgent, 
  GovernanceArbiterAgent, 
  EvoCoreAgent 
} from './core/agents';
import { EvolutionaryEngine } from './core/evolution';

import AppleWindowHeader from './components/AppleWindowHeader';
import MacroTickerPills from './components/MacroTickerPills';
import AgentSwarmSidebar from './components/AgentSwarmSidebar';
import DigitalTwinMap from './components/DigitalTwinMap';
import InterAgentConsole from './components/InterAgentConsole';
import ControlCenter from './components/ControlCenter';
import RoiSimulatorView from './components/RoiSimulatorView';
import AgentSwarmMatrixView from './components/AgentSwarmMatrixView';
import GenomeModal from './components/Modals/GenomeModal';
import VesselModal from './components/Modals/VesselModal';
import AgentStudioModal from './components/Modals/AgentStudioModal';
import AiSettingsModal from './components/Modals/AiSettingsModal';
import AuthModal from './components/Auth/AuthModal';
import MultiverseMatrixDrawer from './components/TimeMachine/MultiverseMatrixDrawer';
import JudgeDemoCelebrationModal from './components/TimeMachine/JudgeDemoCelebrationModal';
import ContagionRadarModal from './components/ContagionRadar/ContagionRadarModal';
import { TIME_HORIZONS } from './core/simulationTimeMachine';
import { llmService } from './core/llmService';
import { authService } from './core/authService';

export default function App() {
  // Core World State
  const [vessels, setVessels] = useState(INITIAL_VESSELS);
  const [chokepoints, setChokepoints] = useState(CHOKEPOINTS);
  const [hubs, setHubs] = useState(WORLD_HUBS);
  const [tradeLanes] = useState(TRADE_LANES);
  const [macroMetrics, setMacroMetrics] = useState(INITIAL_MACRO_METRICS);
  const [activeScenario, setActiveScenario] = useState(null);

  // Supply Chain Contagion Radar & Auto-Immune State
  const [isContagionModalOpen, setIsContagionModalOpen] = useState(false);
  const [contagionState, setContagionState] = useState({
    r0: 2.84,
    isOutbreak: true,
    isImmunized: false,
    beta: 0.86,
    k: 3.10,
    tau: 1.065
  });

  // Supply Chain Time Machine & Parallel Multiverse State
  const [timeOffsetDays, setTimeOffsetDays] = useState(0);
  const [isTimeMachinePlaying, setIsTimeMachinePlaying] = useState(false);
  const [timeMachineSpeed, setTimeMachineSpeed] = useState(1);
  const [activeBranches, setActiveBranches] = useState(['branch_a', 'branch_b']);
  const [isMultiverseDrawerOpen, setIsMultiverseDrawerOpen] = useState(false);
  const [isJudgeDemoActive, setIsJudgeDemoActive] = useState(false);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);

  // Valid Protected Workspace Views
  const VALID_VIEWS = ['overview', 'map', 'agents', 'simulator'];

  const getRouteFromHash = () => {
    if (typeof window === 'undefined') return 'overview';
    const clean = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
    if (VALID_VIEWS.includes(clean)) return clean;
    if (clean === 'digital-twin' || clean === 'twin') return 'map';
    if (clean === 'swarm') return 'agents';
    if (clean === 'crisis' || clean === 'roi') return 'simulator';
    if (clean === 'command') return 'overview';
    return null;
  };

  // Authentication & RBAC States
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLockScreen, setIsLockScreen] = useState(false);

  // Deep Link & Protected Route State
  const [intendedRoute, setIntendedRoute] = useState(() => getRouteFromHash() || 'overview');
  const [activeView, setActiveView] = useState(() => getRouteFromHash() || 'overview');

  // Simulation Controls
  const [simSpeed, setSimSpeed] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const [autonomyLevel, setAutonomyLevel] = useState('SUPERVISED');

  // Logs & Modals
  const [messages, setMessages] = useState([]);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isGenomeModalOpen, setIsGenomeModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiEngineLabel, setAiEngineLabel] = useState(llmService.getActiveProviderName());

    // Theme State: 'dark' (Deep Obsidian Slate) or 'light' (Crisp Studio Porcelain)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('evochain_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('evochain_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Engines Refs & State
  const busRef = useRef(null);
  const evolutionRef = useRef(null);
  const agentsRef = useRef(null);
  const [swarmAgents, setSwarmAgents] = useState(null);
  const [evolutionEngine, setEvolutionEngine] = useState(null);
  const [evolutionState, setEvolutionState] = useState({ currentGeneration: 4, fitnessScore: 88.4 });

  // Initialize Swarm on mount
  useEffect(() => {
    const bus = new AgentMessageBus();
    const evo = new EvolutionaryEngine();
    
    const agents = {
      sentinel: new SentinelAgent(bus),
      oracle: new MarketShiftOracleAgent(bus),
      nexus: new NexusLogisticsArbiterAgent(bus),
      synapse: new SynapseBufferAgent(bus),
      gov: new GovernanceArbiterAgent(bus),
      evocore: new EvoCoreAgent(bus)
    };

    busRef.current = bus;
    evolutionRef.current = evo;
    agentsRef.current = agents;
    bus.agents = agents;
    setSwarmAgents(agents);
    setEvolutionEngine(evo);

    // Listen to messages
    const unsubscribe = bus.onNewMessage((newMsg) => {
      setMessages((prev) => [newMsg, ...prev.slice(0, 100)]);

      // Check if autonomous execution authorized
      if (newMsg.type === 'AUTONOMOUS_EXECUTION_AUTHORIZED' && newMsg.payload?.proposals) {
        applyAutonomousReroutes(newMsg.payload.proposals);
      }

      // Check if swarm policy evolved
      if (newMsg.type === 'SWARM_POLICY_EVOLVED' && newMsg.payload?.newGeneration) {
        setEvolutionState({
          currentGeneration: newMsg.payload.newGeneration,
          fitnessScore: newMsg.payload.fitnessScore
        });
      }
    });

    // Initial broadcast
    bus.broadcast({
      sender: 'evocore',
      senderName: 'EvoCore Brain',
      target: 'all',
      type: 'SWARM_INITIALIZED',
      thought: 'Autonomous Agent Network initialized with 6 active nodes. Evolutionary baseline Gen 4 active.'
    });

    return () => unsubscribe();
  }, []);

  // Handle setting view and synchronizing URL hash in address bar
  const handleSetView = (newView) => {
    setActiveView(newView);
    if (typeof window !== 'undefined') {
      window.location.hash = newView;
    }
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        setIsLockScreen(false);
        setIsAuthModalOpen(false);
        if (intendedRoute && VALID_VIEWS.includes(intendedRoute)) {
          setActiveView(intendedRoute);
          if (typeof window !== 'undefined') {
            window.location.hash = intendedRoute;
          }
        }
      } else {
        setIsLockScreen(false);
      }
    });
    return () => unsubscribe();
  }, [intendedRoute]);

  // URL Hash Routing & Security Guard
  useEffect(() => {
    const handleHashChange = () => {
      const route = getRouteFromHash();
      if (!route) return;

      if (!authService.isAuthenticated()) {
        setIntendedRoute(route);
      } else {
        setActiveView(route);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Synchronize hash with activeView when authenticated
  useEffect(() => {
    if (currentUser && activeView && typeof window !== 'undefined') {
      const currentHash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
      if (currentHash !== activeView) {
        window.location.hash = activeView;
      }
    }
  }, [currentUser, activeView]);

  // Update Gov autonomy level
  useEffect(() => {
    if (agentsRef.current?.gov) {
      agentsRef.current.gov.autonomyLevel = autonomyLevel;
    }
  }, [autonomyLevel]);

  // Keyboard Shortcuts (⌘1-⌘4, Space for pause, Esc for modals)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      
      // Number shortcuts for views (⌘1-4 or Alt 1-4)
      if ((e.metaKey || e.ctrlKey || e.altKey) && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        if (e.key === '1') handleSetView('overview');
        if (e.key === '2') handleSetView('map');
        if (e.key === '3') handleSetView('agents');
        if (e.key === '4') handleSetView('simulator');
        return;
      }

      // ⌘L or Ctrl+L to lock screen
      if ((e.metaKey || e.ctrlKey) && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        setIsLockScreen(true);
        setIsAuthModalOpen(true);
        return;
      }

      // Arrow keys to step Time Machine by 1 day
      if (e.key === 'ArrowLeft' && !isInput) {
        e.preventDefault();
        setTimeOffsetDays(prev => Math.max(TIME_HORIZONS.MIN_DAYS, Math.round(prev) - 1));
        return;
      }
      if (e.key === 'ArrowRight' && !isInput) {
        e.preventDefault();
        setTimeOffsetDays(prev => Math.min(TIME_HORIZONS.MAX_DAYS, Math.round(prev) + 1));
        return;
      }

      // Space to toggle pause / Time Machine playback
      if (e.key === ' ' && !isInput) {
        e.preventDefault();
        setIsRunning(prev => !prev);
        setIsTimeMachinePlaying(prev => !prev);
        return;
      }

      // Escape to close open modals & Multiverse matrix
      if (e.key === 'Escape') {
        setSelectedVessel(null);
        setSelectedAgent(null);
        setIsGenomeModalOpen(false);
        setIsAiModalOpen(false);
        setIsContagionModalOpen(false);
        setIsMultiverseDrawerOpen(false);
        setIsCelebrationModalOpen(false);
        if (!isLockScreen) setIsAuthModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLockScreen]);

  // Simulation Loop
  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId;

    const tick = (currentTime) => {
      if (isRunning && currentUser) {
        const deltaMs = currentTime - lastTime;
        
        // Advance vessels
        setVessels((prevVessels) => 
          prevVessels.map((v) => {
            const lane = tradeLanes.find(l => l.id === v.currentRouteId);
            if (!lane) return v;

            const ratePerSec = 0.003 * simSpeed / (lane.standardDays / 15);
            let nextProgress = v.progress + ratePerSec * (deltaMs / 1000);
            if (nextProgress > 1.0) nextProgress = 0.05;

            const remainingDays = Math.max(0.2, +((1.0 - nextProgress) * lane.standardDays).toFixed(1));
            return {
              ...v,
              progress: nextProgress,
              etaDays: remainingDays
            };
          })
        );

        // Micro market drift
        if (Math.random() < 0.02 * simSpeed) {
          setMacroMetrics((prev) => ({
            ...prev,
            brentCrude: +(prev.brentCrude + (Math.random() - 0.49) * 0.15).toFixed(2),
            freightIndexFBX: Math.round(prev.freightIndexFBX + (Math.random() - 0.48) * 8)
          }));
        }
      }

      lastTime = currentTime;
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, simSpeed, tradeLanes]);

  // Supply Chain Time Machine Scrubber Playback Loop
  useEffect(() => {
    if (!isTimeMachinePlaying || isJudgeDemoActive) return;
    let lastTime = performance.now();
    let animId;

    const tickTimeMachine = (now) => {
      const deltaMs = now - lastTime;
      lastTime = now;

      // Advance by rate (1 day per 2.2 seconds at 1x speed)
      const dayDelta = (deltaMs / 2200) * timeMachineSpeed;
      setTimeOffsetDays((prev) => {
        const next = prev + dayDelta;
        if (next > TIME_HORIZONS.MAX_DAYS) {
          setIsTimeMachinePlaying(false);
          return TIME_HORIZONS.MAX_DAYS;
        }
        return +next.toFixed(2);
      });

      animId = requestAnimationFrame(tickTimeMachine);
    };

    animId = requestAnimationFrame(tickTimeMachine);
    return () => cancelAnimationFrame(animId);
  }, [isTimeMachinePlaying, timeMachineSpeed, isJudgeDemoActive]);

  // Multiverse Branch Toggling
  const handleToggleBranch = (branchId) => {
    setActiveBranches((prev) => {
      if (prev.includes(branchId)) {
        if (prev.length <= 1) return prev; // Keep at least one branch active
        return prev.filter(b => b !== branchId);
      } else {
        return [...prev, branchId];
      }
    });
  };

  const handleForkAllBranches = () => {
    setActiveBranches(['branch_a', 'branch_b', 'branch_c']);
  };

  // 6-Second Choreographed "Judge Wow" Demo
  const handleTriggerJudgeDemo = () => {
    setIsJudgeDemoActive(true);
    setIsCelebrationModalOpen(false);
    setIsMultiverseDrawerOpen(false);
    setIsTimeMachinePlaying(false);
    setTimeOffsetDays(0);
    setActiveBranches(['branch_a', 'branch_b']);

    // Ensure we are in Overview or Map view to see the showcase
    if (activeView !== 'overview' && activeView !== 'map') {
      setActiveView('overview');
    }

    const startTime = performance.now();
    const durationMs = 6000;
    const targetDay = 14;

    const animateJudgeTour = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / durationMs);

      // Smooth easeInOutQuad curve
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentDay = +(easeProgress * targetDay).toFixed(1);
      setTimeOffsetDays(currentDay);

      if (progress < 1.0) {
        requestAnimationFrame(animateJudgeTour);
      } else {
        // Reached T+14d milestone!
        setTimeOffsetDays(targetDay);
        setIsJudgeDemoActive(false);
        setIsCelebrationModalOpen(true);
      }
    };

    requestAnimationFrame(animateJudgeTour);
  };

  // Handle Disruption Injection
  const handleInjectScenario = (scenarioKey) => {
    const scenario = DISRUPTION_SCENARIOS[scenarioKey] || DISRUPTION_SCENARIOS.RED_SEA_MISSILE_CRISIS;
    if (!scenario || !agentsRef.current) return;

    setActiveScenario(scenario);

    // Update chokepoint or hub
    if (scenario.targetChokepoint) {
      setChokepoints((prev) => ({
        ...prev,
        [scenario.targetChokepoint]: {
          ...prev[scenario.targetChokepoint],
          riskLevel: scenario.impacts.chokepointRisk,
          status: 'disrupted'
        }
      }));
    }

    if (scenario.targetHub) {
      setHubs((prev) => ({
        ...prev,
        [scenario.targetHub]: {
          ...prev[scenario.targetHub],
          currentCongestion: scenario.impacts.hubCongestion,
          status: 'congested'
        }
      }));
    }

    // Update macro metrics
    setMacroMetrics((prev) => ({
      ...prev,
      brentCrude: scenario.impacts.bunkerPriceSpike ? +(prev.brentCrude * (1 + scenario.impacts.bunkerPriceSpike / 100)).toFixed(2) : prev.brentCrude,
      crudeTrend: scenario.impacts.bunkerPriceSpike ? `+${scenario.impacts.bunkerPriceSpike}% SHOCK` : prev.crudeTrend,
      freightIndexFBX: scenario.impacts.freightIndexSurge ? Math.round(prev.freightIndexFBX * (1 + scenario.impacts.freightIndexSurge / 100)) : prev.freightIndexFBX,
      freightTrend: scenario.impacts.freightIndexSurge ? `+${scenario.impacts.freightIndexSurge}% VOLATILITY` : prev.freightTrend,
      globalDisruptionIndex: 78.4
    }));

    // Update Contagion R0 to Uncontrolled Outbreak
    setContagionState({
      r0: 2.84,
      isOutbreak: true,
      isImmunized: false,
      beta: 0.86,
      k: 3.10,
      tau: 1.065
    });

    // Trigger Sentinel Agent
    setTimeout(() => {
      agentsRef.current.sentinel.assessDisruption(scenario, {
        vessels,
        chokepoints,
        hubs
      });
    }, 300);
  };

  const applyAutonomousReroutes = (proposals) => {
    if (!proposals || !proposals.length) return;

    setVessels((prev) => 
      prev.map((v) => {
        const prop = proposals.find(p => p.vesselId === v.id);
        if (prop) {
          const oldRoute = v.currentRouteId;
          const newRoute = prop.recommendation.primaryRoute;
          return {
            ...v,
            currentRouteId: newRoute,
            status: 'autonomously_rerouted',
            rerouteDetails: prop.recommendation,
            progress: oldRoute !== newRoute ? Math.max(0.1, v.progress * 0.7) : v.progress
          };
        }
        return v;
      })
    );

    setMacroMetrics((prev) => ({
      ...prev,
      activeAutonomousDecisions: prev.activeAutonomousDecisions + proposals.length,
      estimatedCostSavedM: +(prev.estimatedCostSavedM + 4.8).toFixed(1),
      resilienceScore: 97.4
    }));
  };

  const handleResolveScenario = () => {
    setActiveScenario(null);
    setChokepoints((prev) => {
      const reset = { ...prev };
      Object.keys(reset).forEach(k => {
        reset[k] = { ...reset[k], riskLevel: 0.12, status: 'open' };
      });
      return reset;
    });

    setHubs((prev) => {
      const reset = { ...prev };
      Object.keys(reset).forEach(k => {
        reset[k] = { ...reset[k], currentCongestion: 0.20, status: 'optimal' };
      });
      return reset;
    });

    setVessels((prev) => prev.map(v => ({ ...v, status: 'on_schedule' })));
    setMacroMetrics((prev) => ({
      ...prev,
      globalDisruptionIndex: 18.2
    }));

    setContagionState({
      r0: 0.32,
      isOutbreak: false,
      isImmunized: true,
      beta: 0.20,
      k: 1.20,
      tau: 1.10
    });

    busRef.current?.broadcast({
      sender: 'sentinel',
      senderName: 'Sentinel Radar',
      target: 'all',
      type: 'DISRUPTION_RESTORED',
      thought: 'Disruption parameters normalized across all corridors. Fleet operations returned to nominal.'
    });
  };

  // Contagion Auto-Immune Response Execution Handler
  const handleContagionAutoImmuneDeployed = (defenseResult) => {
    setContagionState({
      r0: 0.32,
      isOutbreak: false,
      isImmunized: true,
      beta: 0.20,
      k: 1.20,
      tau: 1.10
    });

    // Update Macro Metrics
    setMacroMetrics((prev) => ({
      ...prev,
      resilienceScore: 99.4,
      estimatedCostSavedM: +(prev.estimatedCostSavedM + 38.4).toFixed(1),
      globalDisruptionIndex: 12.0,
      activeAutonomousDecisions: prev.activeAutonomousDecisions + 18
    }));

    // Re-route or immunize vessels
    setVessels((prev) =>
      prev.map((v) => ({
        ...v,
        status: v.status === 'disrupted' || v.status === 'delayed' ? 'autonomously_rerouted' : v.status
      }))
    );

    // Broadcast to Swarm Message Bus
    busRef.current?.broadcast({
      sender: 'evocore',
      senderName: 'EvoCore Biological Defense',
      target: 'all',
      type: 'AUTO_IMMUNE_SWARM_INOCULATED',
      thought: 'EvoChain 3-Phase Auto-Immune Response executed. Cellular quarantine corridors sealed, 14,000 MT synthetic antibodies dispatched, RLAIF policy weights permanently inoculated. Disruption R0 suppressed from 2.84 to 0.32. $38.4M financial catastrophe averted.'
    });
  };

  const handleTriggerEvolution = () => {
    if (!evolutionRef.current || !agentsRef.current) return;
    const result = evolutionRef.current.triggerEvolutionStep();
    agentsRef.current.evocore.evaluateAndEvolve(Object.values(agentsRef.current));
    setEvolutionState({
      currentGeneration: result.generation,
      fitnessScore: result.fitness
    });
  };


  // Agent Studio Actions
  const handleUpdatePolicy = (agentId, weights, promptText) => {
    const agent = agentsRef.current?.[agentId];
    if (agent) {
      agent.policyWeights = weights;
      agent.activePrompt = promptText;
      const [maj, min, pat] = agent.policyVersion.replace('v', '').split('.').map(Number);
      agent.policyVersion = `v${maj}.${min}.${pat + 1}`;
      setSelectedAgent({ ...agent });

      busRef.current?.broadcast({
        sender: agent.id,
        senderName: agent.name,
        target: 'all',
        type: 'POLICY_MANUALLY_MUTATED',
        thought: `Manual policy mutation committed. New version: ${agent.policyVersion}. Weights updated: Risk=${(weights.riskAversion*100).toFixed(0)}%, Speed=${(weights.speedPriority*100).toFixed(0)}%.`
      });
    }
  };

  const handleDispatchDirective = async (agentId, directive) => {
    const agent = agentsRef.current?.[agentId];
    if (!agent) return;

    agent.status = 'evaluating';
    agent.currentThought = `Executing live neural reasoning for directive: "${directive}"...`;
    setSelectedAgent({ ...agent });

    const worldContext = {
      directive,
      activeScenario: activeScenario ? activeScenario.title : 'NOMINAL_OPERATIONS',
      vesselCount: vessels.length,
      brentCrude: macroMetrics.brentCrude,
      freightIndexFBX: macroMetrics.freightIndexFBX,
      timestamp: new Date().toISOString()
    };

    const inferenceResult = await agent.thinkAndAct(worldContext, directive);
    setSelectedAgent({ ...agent });

    busRef.current?.broadcast({
      sender: agent.id,
      senderName: agent.name,
      target: 'all',
      type: 'DIRECTIVE_EXECUTED',
      payload: { directive, inferenceResult },
      thought: `[${inferenceResult.provider || 'AI Engine'}] ${inferenceResult.thought}`
    });
  };

  // ZERO-TRUST SECURITY GATEWAY:
  // If user is not authenticated, render ONLY the Executive Security Enclave Gateway.
  // All internal views, simulations, and sensitive metrics are completely blocked.
  if (!currentUser) {
    return (
      <div className={`apple-app-shell theme-${theme} enclave-unauth-gate-root`}>
        <AuthModal
          isOpen={true}
          isLockScreen={true}
          intendedRoute={intendedRoute}
          onClose={() => {}}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setIsLockScreen(false);
            if (intendedRoute && VALID_VIEWS.includes(intendedRoute)) {
              handleSetView(intendedRoute);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={`apple-app-shell theme-${theme}`}>
      {/* 1. Executive Studio Linear Header */}
      <AppleWindowHeader
        simSpeed={simSpeed}
        onSetSpeed={setSimSpeed}
        isRunning={isRunning}
        onTogglePause={() => setIsRunning(!isRunning)}
        autonomyLevel={autonomyLevel}
        onSetAutonomy={setAutonomyLevel}
        onOpenGenomeModal={() => setIsGenomeModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenContagionModal={() => setIsContagionModalOpen(true)}
        contagionState={contagionState}
        aiEngineLabel={aiEngineLabel}
        activeScenario={activeScenario}
        activeView={activeView}
        onSetView={handleSetView}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLockScreen={() => {
          setIsLockScreen(true);
          setIsAuthModalOpen(true);
        }}
        onOpenAuthModal={() => {
          setIsLockScreen(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Macro Ticker Bar */}
      <MacroTickerPills metrics={macroMetrics} />

      {/* 4. Dynamic Workspace View Switcher with Buttery Fluid Transitions */}
      <div className="apple-view-container">
        {/* VIEW 1: Command Center (Integrated Overview) */}
        {activeView === 'overview' && (
          <main key="view-overview" className="apple-workspace-grid apple-view-fluid-enter">
            {/* Left Column: 6 Swarm Nodes */}
            {swarmAgents && (
              <AgentSwarmSidebar 
                agents={swarmAgents} 
                currentGeneration={evolutionState.currentGeneration}
                onSelectAgent={(agent) => setSelectedAgent({ ...agent })}
              />
            )}

            {/* Center: Interactive Digital Twin Canvas Map */}
            <section className="apple-center-viewport">
              <DigitalTwinMap
                vessels={vessels}
                tradeLanes={tradeLanes}
                chokepoints={chokepoints}
                hubs={hubs}
                activeScenario={activeScenario}
                onSelectVessel={(v) => setSelectedVessel(v)}
                timeOffsetDays={timeOffsetDays}
                onSetTimeOffset={setTimeOffsetDays}
                isTimeMachinePlaying={isTimeMachinePlaying}
                onToggleTimeMachinePlay={() => setIsTimeMachinePlaying(prev => !prev)}
                timeMachineSpeed={timeMachineSpeed}
                onSetTimeMachineSpeed={setTimeMachineSpeed}
                activeBranches={activeBranches}
                onToggleBranch={handleToggleBranch}
                onOpenMultiverseDrawer={() => setIsMultiverseDrawerOpen(true)}
                onTriggerJudgeDemo={handleTriggerJudgeDemo}
                isJudgeDemoActive={isJudgeDemoActive}
              />

              {/* Bottom Center: Inter-Agent Consensus Dialogue */}
              <InterAgentConsole messages={messages} />
            </section>

            {/* Right Column: Apple Control Center & Fleet Manifest */}
            <ControlCenter
              onInjectScenario={handleInjectScenario}
              onResolveScenario={handleResolveScenario}
              onTriggerEvolution={handleTriggerEvolution}
              evolutionGenome={evolutionState}
              vessels={vessels}
              onSelectVessel={(v) => setSelectedVessel(v)}
              currentUser={currentUser}
            />
          </main>
        )}

        {/* VIEW 2: Full-Screen Digital Twin Map */}
        {activeView === 'map' && (
          <div key="view-map" className="apple-full-viewport apple-view-fluid-enter">
            <DigitalTwinMap
              vessels={vessels}
              tradeLanes={tradeLanes}
              chokepoints={chokepoints}
              hubs={hubs}
              activeScenario={activeScenario}
              onSelectVessel={(v) => setSelectedVessel(v)}
              timeOffsetDays={timeOffsetDays}
              onSetTimeOffset={setTimeOffsetDays}
              isTimeMachinePlaying={isTimeMachinePlaying}
              onToggleTimeMachinePlay={() => setIsTimeMachinePlaying(prev => !prev)}
              timeMachineSpeed={timeMachineSpeed}
              onSetTimeMachineSpeed={setTimeMachineSpeed}
              activeBranches={activeBranches}
              onToggleBranch={handleToggleBranch}
              onOpenMultiverseDrawer={() => setIsMultiverseDrawerOpen(true)}
              onTriggerJudgeDemo={handleTriggerJudgeDemo}
              isJudgeDemoActive={isJudgeDemoActive}
            />
          </div>
        )}

        {/* VIEW 3: Spacious 6-Agent Swarm Matrix */}
        {activeView === 'agents' && swarmAgents && (
          <div key="view-agents" className="apple-full-viewport apple-view-fluid-enter">
            <AgentSwarmMatrixView
              agents={swarmAgents}
              currentGeneration={evolutionState.currentGeneration}
              fitnessScore={evolutionState.fitnessScore}
              onSelectAgent={(agent) => setSelectedAgent({ ...agent })}
              onOpenGenomeModal={() => setIsGenomeModalOpen(true)}
              onOpenAiModal={() => setIsAiModalOpen(true)}
              onUpdatePolicy={handleUpdatePolicy}
              onDispatchDirective={handleDispatchDirective}
              onInjectScenario={handleInjectScenario}
              onResolveScenario={handleResolveScenario}
              onTriggerEvolution={handleTriggerEvolution}
              activeScenario={activeScenario}
              messages={messages}
            />
          </div>
        )}

        {/* VIEW 4: Crisis & ROI Simulator */}
        {activeView === 'simulator' && (
          <div key="view-simulator" className="apple-full-viewport apple-view-fluid-enter">
            <RoiSimulatorView
              activeScenario={activeScenario}
              onInjectScenario={handleInjectScenario}
              onResolveScenario={handleResolveScenario}
              macroMetrics={macroMetrics}
              onOpenGenomeModal={() => setIsGenomeModalOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {evolutionEngine && (
        <GenomeModal
          isOpen={isGenomeModalOpen}
          onClose={() => setIsGenomeModalOpen(false)}
          evolutionData={evolutionEngine}
          macroMetrics={macroMetrics}
        />
      )}

      <VesselModal
        vessel={selectedVessel}
        isOpen={Boolean(selectedVessel)}
        onClose={() => setSelectedVessel(null)}
      />

      <AgentStudioModal
        agent={selectedAgent}
        isOpen={Boolean(selectedAgent)}
        onClose={() => setSelectedAgent(null)}
        onUpdatePolicy={handleUpdatePolicy}
        onDispatchDirective={handleDispatchDirective}
      />

      <AiSettingsModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onConfigSaved={() => {
          setAiEngineLabel(llmService.getActiveProviderName());
        }}
      />

      {/* Authentication & macOS Lock Screen */}
      <AuthModal
        isOpen={isAuthModalOpen || isLockScreen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setIsLockScreen(false);
        }}
        isLockScreen={isLockScreen}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setIsLockScreen(false);
          setIsAuthModalOpen(false);
        }}
      />

      {/* Parallel Multiverse Comparison Matrix Drawer */}
      <MultiverseMatrixDrawer
        isOpen={isMultiverseDrawerOpen}
        onClose={() => setIsMultiverseDrawerOpen(false)}
        timeOffsetDays={timeOffsetDays}
        activeBranches={activeBranches}
        onToggleBranch={handleToggleBranch}
        onAddBranch={handleForkAllBranches}
      />

      {/* Judge Demo Scorecard Celebration Modal */}
      <JudgeDemoCelebrationModal
        isOpen={isCelebrationModalOpen}
        onClose={() => setIsCelebrationModalOpen(false)}
        onOpenMatrix={() => {
          setIsCelebrationModalOpen(false);
          setIsMultiverseDrawerOpen(true);
        }}
        onScrubToT30={() => {
          setIsCelebrationModalOpen(false);
          setTimeOffsetDays(30);
        }}
        onReplayDemo={handleTriggerJudgeDemo}
      />

      {/* Supply Chain Contagion Radar + Auto-Immune Response Engine Modal */}
      <ContagionRadarModal
        isOpen={isContagionModalOpen}
        onClose={() => setIsContagionModalOpen(false)}
        contagionState={contagionState}
        onContagionStateChange={setContagionState}
        onAutoImmuneDeployed={handleContagionAutoImmuneDeployed}
      />
    </div>
  );
}
