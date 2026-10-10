import React, { useState } from 'react';
import { llmService } from '../../core/llmService';
import { IconCpu, IconCheck, IconAlertTriangle } from '../Icons';
import SlidingSegmentedControl from '../common/SlidingSegmentedControl';

export default function AiSettingsModal({ isOpen, onClose, onConfigSaved }) {
  if (!isOpen) return null;

  const [provider, setProvider] = useState(llmService.provider || 'gemini');
  const [apiKey, setApiKey] = useState(llmService.apiKey || '');
  const [modelName, setModelName] = useState(llmService.modelName || 'gemini-3.8-flash');
  const [customEndpoint, setCustomEndpoint] = useState(llmService.customEndpoint || 'http://localhost:11434/v1');
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // null | 'testing' | 'success' | 'failed'
  const [statusMessage, setStatusMessage] = useState('');

  const handleSave = () => {
    llmService.saveConfig(provider, apiKey, modelName, customEndpoint);
    onConfigSaved({ provider, apiKey, modelName, customEndpoint });
    onClose();
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setStatusMessage('Testing real AI model connection...');

    llmService.saveConfig(provider, apiKey, modelName, customEndpoint);

    try {
      const result = await llmService.executeAgentReasoning({
        agent: {
          id: 'sentinel',
          name: 'Sentinel Radar',
          role: 'Threat Detection',
          policyVersion: 'v1.0.4',
          policyWeights: { riskAversion: 0.65 },
          activePrompt: 'Perform live telemetry ping.'
        },
        worldContext: { test: true, timestamp: new Date().toISOString() },
        promptInput: 'Execute connection verification test ping. Return operational status.'
      });

      if (result.isRealLLM) {
        setTestStatus('success');
        setStatusMessage(`Connected! Provider: ${result.provider}. Response: "${result.thought.substring(0, 80)}..."`);
      } else {
        setTestStatus('success');
        setStatusMessage(`Running in Algorithmic Co-Processor mode. (No external API key set).`);
      }
    } catch (err) {
      setTestStatus('failed');
      setStatusMessage(`Connection failed: ${err.message}`);
    }
  };

  return (
    <div className="apple-modal-overlay" onClick={onClose}>
      <div className="apple-sheet-card ai-settings-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber"></div>

        <div className="sheet-header">
          <div className="sheet-title-group">
            <h3 className="sheet-title">Live AI Model Engine Configuration</h3>
            <p className="sheet-subtitle">Connect Real LLM Reasoning (Google Gemini 3.8 Flash, OpenAI, or Local Ollama)</p>
          </div>
          <button type="button" className="apple-done-btn" onClick={handleSave}>Save</button>
        </div>

        <div className="sheet-content-scroll">
          {/* Provider Card */}
          <div className="sheet-section-block">
            <label className="directive-label">AI MODEL PROVIDER:</label>
            <SlidingSegmentedControl
              options={[
                { id: 'gemini', label: 'Google Gemini' },
                { id: 'openai', label: 'OpenAI' },
                { id: 'custom', label: 'Local / Ollama' }
              ]}
              value={provider}
              onChange={(newP) => {
                setProvider(newP);
                if (newP === 'gemini') setModelName('gemini-3.8-flash');
                else if (newP === 'openai') setModelName('gpt-4o-mini');
                else setModelName('llama3');
              }}
              className="provider-segmented"
              ariaLabel="AI Model Provider"
            />
          </div>

          {/* Model Selection */}
          <div className="sheet-section-block">
            <label className="directive-label">MODEL NAME / IDENTIFIER:</label>
            {provider === 'gemini' ? (
              <select 
                className="apple-text-input" 
                value={modelName} 
                onChange={(e) => setModelName(e.target.value)}
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended: Ultra-fast, Agentic)</option>
                <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Fastest, High-throughput)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Multimodal Reasoning)</option>
              </select>
            ) : provider === 'openai' ? (
              <select 
                className="apple-text-input" 
                value={modelName} 
                onChange={(e) => setModelName(e.target.value)}
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Fast &amp; Accurate)</option>
                <option value="gpt-4o">gpt-4o (Omni Reasoning)</option>
              </select>
            ) : (
              <input 
                type="text" 
                className="apple-text-input" 
                value={modelName}
                placeholder="e.g. llama3, mistral, qwen2.5" 
                onChange={(e) => setModelName(e.target.value)}
              />
            )}
          </div>

          {/* API Key Input */}
          {provider !== 'custom' && (
            <div className="sheet-section-block">
              <div className="label-with-action" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="directive-label">
                  {provider === 'gemini' ? 'GOOGLE GEMINI API KEY:' : 'OPENAI API KEY:'}
                </label>
                <button 
                  type="button" 
                  className="show-key-btn"
                  onClick={() => setShowKey(!showKey)}
                  style={{ background: 'none', border: 'none', color: 'var(--apple-blue)', fontSize: '10px', cursor: 'pointer' }}
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showKey ? 'text' : 'password'}
                className="apple-text-input font-mono"
                placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <span className="input-hint" style={{ fontSize: '9.5px', color: 'var(--apple-tertiary-label)', marginTop: '3px', display: 'block' }}>
                {provider === 'gemini' 
                  ? 'Key is stored locally in your browser session for direct inference.'
                  : 'Key is stored locally in your browser session for direct inference.'}
              </span>
            </div>
          )}

          {/* Custom Endpoint Input */}
          {provider === 'custom' && (
            <div className="sheet-section-block">
              <label className="directive-label">OLLAMA / VLLM BASE URL:</label>
              <input
                type="text"
                className="apple-text-input font-mono"
                placeholder="http://localhost:11434/v1"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
              />
            </div>
          )}

          {/* Test Status Banner */}
          {statusMessage && (
            <div className={`apple-callout-box ${testStatus === 'success' ? 'box-success' : testStatus === 'failed' ? 'box-danger' : ''}`}>
              <div className="callout-icon">
                {testStatus === 'success' ? <IconCheck size={16} /> : <IconAlertTriangle size={16} />}
              </div>
              <div className="callout-text">
                <strong>Connection Status</strong>
                <p>{statusMessage}</p>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="settings-actions-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <button 
              type="button" 
              className="apple-action-tile tile-blue"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
            >
              <IconCpu size={14} className="tile-icon" />
              <div className="tile-text-wrap">
                <span className="tile-title">Test Live AI Connection</span>
                <span className="tile-sub">Send test ping to {provider}</span>
              </div>
            </button>

            <button 
              type="button" 
              className="apple-btn-pill-primary"
              onClick={handleSave}
            >
              Apply Engine Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
