import React, { useState } from 'react';
import { llmService } from '../../core/llmService';
import { authService } from '../../core/authService';
import { IconLock, IconShieldCheck, IconCheck, IconCpu, IconDna, IconSend } from '../Icons';
import SlidingSegmentedControl from '../common/SlidingSegmentedControl';
import { getAgentIcon } from '../AgentSwarmSidebar';

export default function AgentStudioModal({ agent, isOpen, onClose, onUpdatePolicy, onDispatchDirective }) {
  if (!isOpen || !agent) return null;

  const [promptText, setPromptText] = useState(agent.activePrompt || '');
  const [directiveInput, setDirectiveInput] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [weights, setWeights] = useState({ ...agent.policyWeights });
  const [activeTab, setActiveTab] = useState('directive'); // 'directive' | 'prompt' | 'weights' | 'memory'

  const canCommand = authService.canCommandAgents();
  const canEvolve = authService.canEvolveGenome();
  const currentUser = authService.getCurrentUser();

  const handleWeightChange = (key, val) => {
    if (!canEvolve) return;
    const updated = { ...weights, [key]: parseFloat(val) };
    setWeights(updated);
  };

  const handleSaveWeights = () => {
    if (!canEvolve) return;
    onUpdatePolicy(agent.id, weights, promptText);
  };

  const handleSendDirective = async (e) => {
    e.preventDefault();
    if (!directiveInput.trim() || !canCommand) return;

    setIsDispatching(true);
    await onDispatchDirective(agent.id, directiveInput.trim());
    setDirectiveInput('');
    setIsDispatching(false);
  };

  return (
    <div className="apple-modal-overlay" onClick={onClose}>
      <div className="apple-sheet-card agent-studio-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber"></div>

        {/* Modal Header */}
        <div className="sheet-header">
          <div className="agent-studio-identity">
            <div className="agent-avatar-node">
              {getAgentIcon(agent.id, 18)}
            </div>
            <div>
              <div className="agent-studio-title-row">
                <h3 className="sheet-title">{agent.name}</h3>
                <span className="apple-tag tag-neutral">{agent.policyVersion}</span>
                <span className="apple-tag tag-neutral">
                  <IconCpu size={10} /> {llmService.getActiveProviderName()}
                </span>
                {!canCommand ? (
                  <span className="apple-tag tag-neutral">
                    <IconLock size={9} /> AUDITOR READ-ONLY
                  </span>
                ) : (
                  <span className="apple-tag tag-nominal">
                    <IconCheck size={9} /> {currentUser?.role === 'GUEST_JUDGE' ? 'VIP ALL-ACCESS' : 'EXECUTIVE L3'}
                  </span>
                )}
              </div>
              <p className="sheet-subtitle">
                {agent.role} • Status: <strong>{agent.status.toUpperCase()}</strong>
                {agent.pitch ? ` • "${agent.pitch}"` : ''}
              </p>
            </div>
          </div>
          <button type="button" className="apple-done-btn" onClick={onClose}>Done</button>
        </div>

        {/* Tab Selector */}
        <div className="studio-tabs-row">
          <SlidingSegmentedControl
            options={[
              { id: 'directive', label: canCommand ? 'Direct Command' : 'Direct Command (Read-Only)' },
              { id: 'prompt', label: canEvolve ? 'System Prompt' : 'System Prompt (Read-Only)' },
              { id: 'weights', label: canEvolve ? 'Weights & Genome' : 'Weights & Genome (Read-Only)' },
              { id: 'memory', label: `Decision Memory (${agent.decisionsExecuted})` }
            ]}
            value={activeTab}
            onChange={setActiveTab}
            className="studio-segmented"
            ariaLabel="Agent Studio Tabs"
          />
        </div>

        <div className="sheet-content-scroll">
          {/* TAB 1: Direct Command & Directive */}
          {activeTab === 'directive' && (
            <div className="studio-tab-content">
              {!canCommand ? (
                <div className="apple-callout-box rbac-warning-box">
                  <span className="callout-icon"><IconLock size={14} /></span>
                  <div className="callout-text">
                    <strong>Access Restricted</strong>
                    <p>Risk Auditor clearance is read-only. Direct commanding requires Executive Arbiter or VIP Judge clearance.</p>
                  </div>
                </div>
              ) : (
                <div className="apple-callout-box">
                  <span className="callout-icon"><IconCpu size={14} /></span>
                  <div className="callout-text">
                    <strong>Zero-Latency Direct Command</strong>
                    <p>Dispatch real-time instructions to {agent.name}. The agent will synthesize context via {llmService.getActiveProviderName()} and broadcast consensus actions across the bus.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendDirective} className="directive-form">
                <label className="directive-label">NEURAL PROMPT DIRECTIVE:</label>
                <div className="directive-input-row">
                  <input
                    type="text"
                    className="apple-text-input"
                    placeholder={canCommand ? `e.g. "Assess reroute viability if spot rates surge +50%"` : 'Restricted: Read-only audit mode'}
                    value={directiveInput}
                    onChange={(e) => setDirectiveInput(e.target.value)}
                    disabled={isDispatching || !canCommand}
                  />
                  <button 
                    type="submit" 
                    className="apple-btn-pill-primary"
                    disabled={isDispatching || !directiveInput.trim() || !canCommand}
                  >
                    {isDispatching ? 'Reasoning...' : 'Dispatch'}
                  </button>
                </div>
              </form>

              <div className="current-thought-block">
                <span className="directive-label">LATEST NEURAL REASONING TRACE:</span>
                <div className="thought-stream-card">
                  <p className="thought-body">"{agent.currentThought}"</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: System Prompt Editor */}
          {activeTab === 'prompt' && (
            <div className="studio-tab-content">
              {!canEvolve ? (
                <div className="apple-callout-box rbac-warning-box">
                  <span className="callout-icon"><IconLock size={14} /></span>
                  <div className="callout-text">
                    <strong>Access Restricted</strong>
                    <p>Risk Auditor clearance does not permit neural prompt mutations. Switch to Executive Arbiter or VIP Judge.</p>
                  </div>
                </div>
              ) : (
                <div className="apple-callout-box">
                  <span className="callout-icon"><IconDna size={14} /></span>
                  <div className="callout-text">
                    <strong>DSPy Mutable Policy Prompt</strong>
                    <p>In EvoChain-OS, agent prompt instructions are mutable parameters optimized across generations. Edit to inject custom enterprise heuristics.</p>
                  </div>
                </div>
              )}

              <div className="prompt-editor-wrap">
                <label className="directive-label">ACTIVE SYSTEM INSTRUCTIONS:</label>
                <textarea
                  className="apple-textarea"
                  rows={6}
                  value={promptText}
                  onChange={(e) => canEvolve && setPromptText(e.target.value)}
                  readOnly={!canEvolve}
                />
                <button 
                  type="button" 
                  className="apple-btn-pill-primary save-prompt-btn"
                  onClick={handleSaveWeights}
                  disabled={!canEvolve}
                >
                  {canEvolve ? 'Save & Mutate Policy Instructions' : 'Read-Only (Auditor Clearance)'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Decision Weights & Policy */}
          {activeTab === 'weights' && (
            <div className="studio-tab-content">
              {!canEvolve ? (
                <div className="apple-callout-box rbac-warning-box">
                  <span className="callout-icon"><IconLock size={14} /></span>
                  <div className="callout-text">
                    <strong>Access Restricted</strong>
                    <p>Risk Auditor clearance restricts chromosome weight mutation. Switch profile to edit.</p>
                  </div>
                </div>
              ) : (
                <div className="apple-callout-box">
                  <span className="callout-icon"><IconSliders size={14} /></span>
                  <div className="callout-text">
                    <strong>Decision Weight Vector</strong>
                    <p>Adjust the Pareto multi-objective weights that govern trade-offs between speed, cost, and ESG compliance.</p>
                  </div>
                </div>
              )}

              <div className="weights-sliders-list">
                <div className="slider-item">
                  <div className="slider-header">
                    <span>Risk Aversion Coefficient</span>
                    <strong>{(weights.riskAversion * 100).toFixed(0)}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    className="engineered-range"
                    value={weights.riskAversion}
                    onChange={(e) => handleWeightChange('riskAversion', e.target.value)}
                    disabled={!canEvolve}
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-header">
                    <span>Cost Sensitivity Weight</span>
                    <strong>{(weights.costSensitivity * 100).toFixed(0)}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    className="engineered-range"
                    value={weights.costSensitivity}
                    onChange={(e) => handleWeightChange('costSensitivity', e.target.value)}
                    disabled={!canEvolve}
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-header">
                    <span>Speed &amp; Lead-Time Priority</span>
                    <strong>{(weights.speedPriority * 100).toFixed(0)}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    className="engineered-range"
                    value={weights.speedPriority}
                    onChange={(e) => handleWeightChange('speedPriority', e.target.value)}
                    disabled={!canEvolve}
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-header">
                    <span>ESG &amp; Carbon Emission Penalty Cap</span>
                    <strong>{(weights.esgCarbonCap * 100).toFixed(0)}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    className="engineered-range"
                    value={weights.esgCarbonCap}
                    onChange={(e) => handleWeightChange('esgCarbonCap', e.target.value)}
                    disabled={!canEvolve}
                  />
                </div>
              </div>

              {canEvolve && (
                <button 
                  type="button" 
                  className="apple-btn-pill-primary save-prompt-btn" 
                  onClick={handleSaveWeights}
                >
                  Commit Chromosome Weights
                </button>
              )}
            </div>
          )}

          {/* TAB 4: Decision History */}
          {activeTab === 'memory' && (
            <div className="studio-tab-content">
              <div className="memory-stats-row">
                <div className="apple-stat-card">
                  <span className="stat-label">TOTAL DECISIONS</span>
                  <span className="stat-number">{agent.decisionsExecuted}</span>
                </div>
                <div className="apple-stat-card">
                  <span className="stat-label">CONFIDENCE RATING</span>
                  <span className="stat-number val-nominal">{(agent.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="memory-log-list">
                <span className="directive-label">RECENT CLOSED-LOOP ACTIONS:</span>
                <div className="memory-log-card">
                  <span className="log-time">LIVE SESSION</span>
                  <p className="log-text">Agent actively participating in continuous closed-loop swarm consensus across all corridors.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
