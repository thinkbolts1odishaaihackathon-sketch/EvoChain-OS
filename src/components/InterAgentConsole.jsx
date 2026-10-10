import React, { useRef, useEffect } from 'react';
import { IconSwarm, IconTerminal } from './Icons';

export default function InterAgentConsole({ messages }) {
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [messages]);

  return (
    <section className="apple-console-panel" aria-label="Inter-Agent Consensus & Dialogue Trace">
      <div className="console-header-bar">
        <div className="console-title-group">
          <IconTerminal size={13} className="console-icon" />
          <h2 className="console-title">Inter-Agent Consensus &amp; Neural Dialogue</h2>
          <span className="console-status-live">LIVE FEED</span>
        </div>
        <div className="console-badges-cluster">
          <span className="apple-tag tag-neutral">A2A JSON-RPC BUS</span>
          <span className="apple-tag tag-nominal">ZERO LATENCY</span>
        </div>
      </div>

      <div className="console-messages-feed" ref={feedRef} role="log" aria-live="polite">
        {messages.map((msg) => (
          <div key={msg.id} className="console-message-row">
            <div className="msg-meta-row">
              <span className="msg-time">{msg.timestamp}</span>
              <span className="msg-sender">
                {msg.senderName || msg.sender}
              </span>
              <span className="msg-type-pill">{msg.type}</span>
              {msg.target && msg.target !== 'all' && (
                <span className="msg-target-arrow">➔ @{msg.target}</span>
              )}
            </div>

            {msg.thought && (
              <p className="msg-thought-body">
                {msg.thought}
              </p>
            )}

            {msg.payload && typeof msg.payload === 'object' && Object.keys(msg.payload).length > 0 && (
              <details className="msg-payload-accordion">
                <summary>Inspect Telemetry Payload ({Object.keys(msg.payload).length} parameters)</summary>
                <pre>{JSON.stringify(msg.payload, null, 2)}</pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
