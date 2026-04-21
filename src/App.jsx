import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, Users, BookOpen, Banknote, Lightbulb, 
  Zap, Info, Globe, Layers, SlidersHorizontal, Sun, Moon,
  CheckCircle2, HelpCircle, RefreshCw, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

const SystemMapApp = () => {
  const [incubatorSupport, setIncubatorSupport] = useState(20);
  const [educationalAlignment, setEducationalAlignment] = useState(10);
  const [investorRiskAppetite, setInvestorRiskAppetite] = useState(5);
  const [activeNode, setActiveNode] = useState(null);
  const [activeScenario, setActiveScenario] = useState('statusQuo');
  const [activeLoop, setActiveLoop] = useState(null);
  const [theme, setTheme] = useState('light'); 

  // Derived metrics
  const [stigmaLevel, setStigmaLevel] = useState(85);
  const [talentAttraction, setTalentAttraction] = useState(15);
  const [valleyOfDeath, setValleyOfDeath] = useState(90);
  const [innovationScore, setInnovationScore] = useState(10);
  const scenarios = {
    statusQuo: { label: 'Status Quo', incubator: 20, education: 10, investor: 5 },
    reform: { label: 'Edu Reform', incubator: 35, education: 85, investor: 20 },
    transform: { label: 'Full System', incubator: 90, education: 80, investor: 75 },
  };

  const loops = {
    R1: {
      id: 'R1',
      label: 'Virtuous Innovation Cycle',
      description: 'Proof-of-success reduces social stigma, attracting higher-tier STEM talent into the incubator pipeline.',
      nodes: ['incubators', 'outliers', 'success', 'stigma', 'stem'],
      edges: [
        { from: 'incubators', to: 'outliers' },
        { from: 'outliers', to: 'success' },
        { from: 'success', to: 'stigma' },
        { from: 'stigma', to: 'stem' },
        { from: 'stem', to: 'incubators' }
      ]
    },
    B1: {
      id: 'B1',
      label: 'Urban Extraction Trap',
      description: 'Capital focus on urban hubs reinforces rural exclusion, deepening the stigma of agriculture as a "fallback" for those left behind.',
      nodes: ['investors', 'geography', 'stigma', 'stem', 'incubators'],
      edges: [
        { from: 'investors', to: 'geography' },
        { from: 'geography', to: 'stigma' },
        { from: 'stigma', to: 'stem' },
        { from: 'stem', to: 'incubators' }
      ]
    }
  };

  const applyScenario = (id) => {
    setActiveScenario(id);
    const s = scenarios[id];
    setIncubatorSupport(s.incubator);
    setEducationalAlignment(s.education);
    setInvestorRiskAppetite(s.investor);
  };

  useEffect(() => {
    const s = Math.max(10, 100 - incubatorSupport * 0.35 - educationalAlignment * 0.45 - investorRiskAppetite * 0.1);
    const t = Math.min(100, (100 - s) * 0.7 + educationalAlignment * 0.4);
    const v = Math.max(5, 100 - investorRiskAppetite * 0.75 - incubatorSupport * 0.3);
    const i = Math.min(100, t * 0.4 + incubatorSupport * 0.35 + investorRiskAppetite * 0.35);
    setStigmaLevel(s);
    setTalentAttraction(t);
    setValleyOfDeath(v);
    setInnovationScore(i);
  }, [incubatorSupport, educationalAlignment, investorRiskAppetite]);

  // ─── Node Positions (balanced for wide canvas with dynamic sizing) ───
  const nodes = useMemo(() => ({
    outliers: {
      id: 'outliers', label: 'Outlier Innovators', layer: 'Events',
      x: 500, y: 70, icon: Zap, color: '#fbbf24', size: 28 + innovationScore * 0.15,
      desc: 'Youth blending tech and soil — the visible proof-of-concept that starts shifting the cultural narrative around agriculture.'
    },
    success: {
      id: 'success', label: 'Success Visibility & Viability', layer: 'Events',
      x: 720, y: 70, icon: Target, color: '#2dd4bf', size: 26 + innovationScore * 0.1,
      desc: 'Economic proof (Viability) and media social proof (Visibility). This double-impact effectively dismantles the "agri as failure" narrative.'
    },
    stem: {
      id: 'stem', label: 'STEM Talent', layer: 'Patterns',
      x: 280, y: 190, icon: Users, color: '#38bdf8', size: 28 + talentAttraction * 0.12,
      desc: 'The primary talent pool currently avoiding agriculture due to perceived low status and high career risk.'
    },
    geography: {
      id: 'geography', label: incubatorSupport > 60 ? 'Geographic Equity' : 'Urban Hub Bias', layer: 'Patterns',
      x: 720, y: 210, icon: Globe, color: incubatorSupport > 60 ? '#2dd4bf' : '#94a3b8', 
      size: Math.max(16, 32 - incubatorSupport * 0.15),
      desc: incubatorSupport > 60 
        ? 'Decentralized support systems ensuring rural youth have equal access to infrastructure and mentorship.'
        : 'The "Geography of Exclusion" — 40+ innovation hubs in cities while rural youth lack infrastructure and support.'
    },
    incubators: {
      id: 'incubators', label: 'Youth Incubators', layer: 'Structures',
      x: 500, y: 310, icon: Lightbulb, color: '#10b981', size: 30 + incubatorSupport * 0.12,
      desc: 'Bridge-builders providing patient capital ($1k–$3k seed grants) and mentorship that traditional systems ignore.'
    },
    academic: {
      id: 'academic', label: 'Edu Silos', layer: 'Structures',
      x: 260, y: 370, icon: BookOpen, color: '#818cf8', size: 26 + educationalAlignment * 0.1,
      desc: 'Universities separating engineering from agronomy, reinforcing the belief that "tech" only means apps and software.'
    },
    investors: {
      id: 'investors', label: 'Traditional Banks', layer: 'Structures',
      x: 740, y: 370, icon: Banknote, color: '#f59e0b', size: 26 + investorRiskAppetite * 0.1,
      desc: 'Holders of capital who practice "Financial Redlining" — viewing youth + agriculture as a double-blow risk.'
    },
    stigma: {
      id: 'stigma', label: 'Agri Stigma', layer: 'Mental Model',
      x: 500, y: 480, icon: ShieldAlert,
      color: `hsl(${350 + (100 - stigmaLevel) * 0.5}, 80%, ${45 + (100 - stigmaLevel) * 0.2}%)`,
      size: 30 + stigmaLevel * 0.2,
      desc: 'The deeply ingrained belief that farming is a low-status fallback. This mental model anchors the entire negative system.'
    },
  }), [stigmaLevel, innovationScore, talentAttraction, incubatorSupport, educationalAlignment, investorRiskAppetite]);

  const edges = useMemo(() => [
    // Negative / friction
    { from: 'stigma', to: 'stem', type: 'negative', label: 'Deters talent', level: stigmaLevel },
    { from: 'academic', to: 'stigma', type: 'negative', label: 'Reinforces bias', level: 100 - educationalAlignment },
    // Positive / catalytic
    { from: 'incubators', to: 'outliers', type: 'positive', label: 'Seed funding', level: incubatorSupport },
    { from: 'incubators', to: 'geography', type: 'positive', label: 'Expands reach', level: incubatorSupport },
    { from: 'stem', to: 'incubators', type: 'positive', label: 'Talent flow', level: talentAttraction },
    { from: 'outliers', to: 'success', type: 'positive', label: 'Creates proof', level: innovationScore },
    { from: 'success', to: 'stigma', type: 'synergy', label: 'Breaks stigma', level: innovationScore },
    // Barrier
    { from: 'investors', to: 'outliers', type: (valleyOfDeath < 40) ? 'positive' : 'barrier', label: 'Valley of Death', level: (valleyOfDeath < 40) ? investorRiskAppetite : valleyOfDeath },
    // Geography & Urban Bias
    { from: 'investors', to: 'geography', type: 'negative', label: 'Urban focus', level: 100 - investorRiskAppetite },
    { from: 'geography', to: 'stigma', type: 'negative', label: 'Reinforces exclusion', level: 80 },
  ], [stigmaLevel, educationalAlignment, incubatorSupport, talentAttraction, innovationScore, valleyOfDeath, investorRiskAppetite]);

  const isNodeInActiveLoop = (nodeId) => {
    if (!activeLoop) return true;
    return loops[activeLoop].nodes.includes(nodeId);
  };

  const isEdgeInActiveLoop = (from, to) => {
    if (!activeLoop) return true;
    return loops[activeLoop].edges.some(e => e.from === from && e.to === to);
  };

  // Edge path with slight curve
  const edgePath = (from, to) => {
    const s = nodes[from];
    const t = nodes[to];
    const mx = (s.x + t.x) / 2;
    const my = (s.y + t.y) / 2;
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    // perpendicular offset for subtle curve
    const offset = len * 0.08;
    const nx = -dy / len * offset;
    const ny = dx / len * offset;
    return `M${s.x},${s.y} Q${mx + nx},${my + ny} ${t.x},${t.y}`;
  };

  const edgeColor = (type) => {
    if (type === 'negative') return '#f43f5e';
    if (type === 'positive') return '#10b981';
    if (type === 'synergy') return '#2dd4bf';
    if (type === 'barrier') return '#f59e0b';
    return '#334155';
  };

  return (
    <div className={`app-layout ${theme === 'dark' ? 'dark-theme' : ''}`}>
      {/* ═══════ SIDEBAR ═══════ */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-header-top">
            <h1>paMchanga · System Map</h1>
            <button 
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <><Moon size={14} /> <span>Dark Mode</span></>
              ) : (
                <><Sun size={14} /> <span>Light Mode</span></>
              )}
            </button>
          </div>
          <p>Interactive simulation of the Youth Agrifood Ecosystem. Adjust levers to see systemic dynamics.</p>
        </div>

        {/* Scenarios */}
        <div className="sidebar-section">
          <div className="section-label">Scenarios</div>
          <div className="scenario-group">
            {Object.entries(scenarios).map(([id, s]) => (
              <button
                key={id}
                className={`scenario-btn ${activeScenario === id ? 'active' : ''}`}
                onClick={() => applyScenario(id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Levers */}
        <div className="sidebar-section">
          <div className="section-label">Intervention Levers</div>
          <div className="lever-group">
            <Lever
              label="Incubator Support"
              value={incubatorSupport}
              onChange={setIncubatorSupport}
              color="var(--emerald)"
              desc="Patient capital & mentorship for early-stage ideas"
            />
            <Lever
              label="Educational Alignment"
              value={educationalAlignment}
              onChange={setEducationalAlignment}
              color="var(--indigo)"
              desc="Breaking silos between engineering and agronomy"
            />
            <Lever
              label="Investor Risk Appetite"
              value={investorRiskAppetite}
              onChange={setInvestorRiskAppetite}
              color="var(--amber)"
              desc="Willingness of banks to fund youth agri projects"
            />
          </div>
        </div>

        {/* Metrics */}
        <div className="sidebar-section">
          <div className="section-label">System Health</div>
          <div className="metrics-grid">
            <MetricCard label="Stigma" value={stigmaLevel} color="var(--rose)" />
            <MetricCard label="Valley Gap" value={valleyOfDeath} color="var(--amber)" />
            <MetricCard label="Talent Flow" value={talentAttraction} color="var(--sky)" inverted />
            <MetricCard label="Innovation" value={innovationScore} color="var(--emerald)" inverted />
          </div>
        </div>

        {/* Loop Explorer */}
        <div className="sidebar-section" style={{ borderBottom: 'none' }}>
          <div className="section-label">System Loops</div>
          <div className="loop-group">
            {Object.values(loops).map((loop) => (
              <button 
                key={loop.id}
                className={`loop-btn ${activeLoop === loop.id ? 'active' : ''}`}
                onClick={() => setActiveLoop(activeLoop === loop.id ? null : loop.id)}
              >
                <div className="loop-info">
                  <span className="loop-id">{loop.id}</span>
                  <span className="loop-label">{loop.label}</span>
                </div>
                <CheckCircle2 className="loop-check" size={14} />
              </button>
            ))}
          </div>
          {activeLoop && (
            <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', padding: '8px', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
              {loops[activeLoop].description}
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <button className="methodology-btn" onClick={() => setActiveNode('methodology')}>
            <HelpCircle size={14} />
            Relationship Methodology
          </button>
        </div>
      </aside>

      {/* ═══════ CANVAS ═══════ */}
      <main className="canvas-area">
        {/* Header overlay */}
        <div className="canvas-header">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="canvas-title" style={{ color: 'var(--indigo)', fontWeight: '800', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Perspective</span>
            <span className="canvas-title" style={{ fontSize: '16px', fontWeight: '800' }}>The Iceberg Model</span>
          </div>
          <div className="legend">
            <div className="legend-item"><span className="legend-dot" style={{ background: '#f43f5e' }} /> Friction</div>
            <div className="legend-item"><span className="legend-dot" style={{ background: '#10b981' }} /> Catalyst</div>
            <div className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }} /> Barrier</div>
            <div className="legend-item"><span className="legend-dot" style={{ background: '#2dd4bf' }} /> Synergy</div>
            {activeLoop && (
              <button onClick={() => setActiveLoop(null)} style={{ marginLeft: '12px', background: 'var(--indigo)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '10px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RefreshCw size={10} /> Clear Loop
              </button>
            )}
          </div>
        </div>

        {/* SVG Map */}
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#000000" floodOpacity={theme === 'light' ? '0.3' : '0.5'} />
            </filter>
            <marker id="arr-neg" viewBox="0 -4 8 8" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,-4L8,0L0,4" fill="#f43f5e" />
            </marker>
            <marker id="arr-pos" viewBox="0 -4 8 8" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,-4L8,0L0,4" fill="#10b981" />
            </marker>
            <marker id="arr-syn" viewBox="0 -4 8 8" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,-4L8,0L0,4" fill="#2dd4bf" />
            </marker>
            <marker id="arr-bar" viewBox="0 -4 8 8" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,-4L8,0L0,4" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Layer bands */}
          {[
            { y: 0, h: 120, label: 'EVENTS / VISIBLE IMPACT' },
            { y: 120, h: 130, label: 'PATTERNS / BEHAVIORS' },
            { y: 250, h: 180, label: 'STRUCTURES / SYSTEMS' },
            { y: 430, h: 170, label: 'MENTAL MODELS / BELIEFS' },
          ].map((band, i) => (
            <g key={i}>
              <rect x="0" y={band.y} width="1000" height={band.h} fill={theme === 'dark' ? 'white' : 'black'} opacity={i % 2 === 0 ? 'var(--band-opacity)' : 0} />
              <line x1="0" y1={band.y} x2="1000" y2={band.y} stroke={theme === 'dark' ? 'white' : 'black'} strokeWidth="0.8" opacity="0.1" />
              <text x="16" y={band.y + 18} fontSize="9" fontWeight="800" fill={theme === 'dark' ? '#94a3b8' : '#334155'} opacity="0.9"
                    style={{ letterSpacing: '0.2em', fontFamily: 'Space Grotesk, sans-serif' }}>
                {band.label}
              </text>
            </g>
          ))}

          {/* Edges */}
          {edges.map((edge, i) => {
            const color = edgeColor(edge.type);
            const path = edgePath(edge.from, edge.to);
            const isDashed = edge.type === 'barrier';
            const markerMap = { negative: 'url(#arr-neg)', positive: 'url(#arr-pos)', synergy: 'url(#arr-syn)', barrier: 'url(#arr-bar)' };
            const s = nodes[edge.from];
            const t = nodes[edge.to];

            const isCurrentLoopEdge = isEdgeInActiveLoop(edge.from, edge.to);
            const edgeClass = activeLoop ? (isCurrentLoopEdge ? 'edge-highlighted' : 'edge-dimmed') : '';

            return (
              <g key={`e-${i}`} className={edgeClass} style={{ transition: 'opacity 0.4s ease' }}>
                {/* Glow */}
                <path d={path} fill="none" stroke={color} strokeWidth={4 + (edge.level / 20)} opacity="0.08" />
                {/* Main line */}
                <path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth={isCurrentLoopEdge && activeLoop ? 3 : 1 + (edge.level / 40)}
                  strokeDasharray={isDashed ? '6,4' : 'none'}
                  opacity={0.3 + (edge.level / 200)}
                  markerEnd={markerMap[edge.type] || ''}
                />
                {/* Animated particles (frequency scales with intensity) */}
                {!isDashed && Array.from({ length: Math.ceil(edge.level / 33.4) || 1 }).map((_, idx, arr) => {
                  const dur = 5 - (edge.level / 25);
                  return (
                    <circle key={idx} r={2 + (edge.level / 50)} fill={color} opacity={0.6 + (edge.level / 400)}>
                      <animateMotion 
                        dur={`${dur}s`} 
                        begin={`${-(idx * (dur / arr.length))}s`} 
                        repeatCount="indefinite" 
                        path={path} 
                      />
                    </circle>
                  );
                })}
                {/* Label */}
                <text
                  x={(s.x + t.x) / 2}
                  y={(s.y + t.y) / 2 - 10}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="800"
                  fill={color}
                  opacity={0.7 + (edge.level / 300)}
                  style={{ pointerEvents: 'none', letterSpacing: '0.06em', textShadow: theme === 'light' ? '0 1px 2px rgba(255,255,255,0.8)' : '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {Object.values(nodes).map((node) => {
            const Icon = node.icon;
            const hovered = activeNode === node.id;

            const isCurrentLoopNode = isNodeInActiveLoop(node.id);
            const nodeClass = activeLoop ? (isCurrentLoopNode ? '' : 'node-dimmed') : '';

            return (
              <g
                key={node.id}
                className={nodeClass}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                style={{ cursor: 'pointer', transition: 'opacity 0.4s ease, filter 0.4s ease' }}
              >
                {/* Hover ring */}
                <circle
                  r={node.size + 6}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={hovered ? 1.5 : 0}
                  opacity={hovered ? 0.4 : 0}
                  style={{ transition: 'all 0.25s ease' }}
                />
                {/* Abstract Glow/Tint on top of white background */}
                <circle
                  r={node.size}
                  fill={theme === 'dark' ? "var(--node-bg)" : "#ffffff"}
                  stroke={node.color}
                  strokeWidth={hovered ? 2.5 : 1.5}
                  opacity="1"
                  filter={theme === 'light' ? "url(#node-shadow)" : undefined}
                  style={{ transition: 'stroke-width 0.2s ease' }}
                />
                
                {/* Colorful tint fill */}
                <circle
                  r={node.size}
                  fill={node.color}
                  opacity={theme === 'light' ? 0.15 : 0.08}
                />
                {/* Icon */}
                <foreignObject
                  x={-11} y={-11} width="22" height="22"
                  style={{ pointerEvents: 'none' }}
                >
                  <div style={{
                    color: node.color, width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={16} strokeWidth={2} />
                  </div>
                </foreignObject>
                <text
                  y={node.size + 14}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill={theme === 'dark' ? '#f8fafc' : '#0f172a'}
                  opacity={hovered ? 1 : 0.9}
                  style={{
                    pointerEvents: 'none', userSelect: 'none',
                    transition: 'opacity 0.2s ease',
                    fontFamily: 'Space Grotesk, sans-serif',
                    letterSpacing: '0.03em',
                  }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip & Methodology Modal */}
        <AnimatePresence>
          {activeNode === 'methodology' && (
             <motion.div
              className="node-tooltip"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ padding: '24px', maxWidth: '520px', pointerEvents: 'auto' }}
           >
             <div className="tooltip-header">
               <HelpCircle className="tooltip-icon" style={{ background: 'var(--indigo)18', color: 'var(--indigo)' }} size={20} />
               <span className="tooltip-title">Relationship Methodology</span>
               <button onClick={() => setActiveNode(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
               <div>
                 <p style={{ fontSize: '11px', fontWeight: '700', color: '#f43f5e', marginBottom: '4px' }}>FRICTION (Negative)</p>
                 <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Resistive forces that inhibit change or create negative feedback loops.</p>
               </div>
               <div>
                 <p style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>CATALYST (Positive)</p>
                 <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Accelerators that amplify positive outcomes and resource flow.</p>
               </div>
               <div>
                 <p style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>BARRIER (Obstacle)</p>
                 <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Structural "Valleys of Death" that prevent youth from scaling.</p>
               </div>
               <div>
                 <p style={{ fontSize: '11px', fontWeight: '700', color: '#2dd4bf', marginBottom: '4px' }}>SYNERGY (Multiplicative)</p>
                 <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Connections where combined elements create a 1+1=3 effect.</p>
               </div>
             </div>
           </motion.div>
          )}

          {activeNode && nodes[activeNode] && (
            <motion.div
              className="node-tooltip"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="tooltip-header">
                <div className="tooltip-icon" style={{ background: `${nodes[activeNode].color}18`, color: nodes[activeNode].color }}>
                  {React.createElement(nodes[activeNode].icon, { size: 20 })}
                </div>
                <span className="tooltip-title">{nodes[activeNode].label}</span>
                <span className="tooltip-layer">{nodes[activeNode].layer}</span>
              </div>
              <p className="tooltip-desc">{nodes[activeNode].desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

/* ─── Sub-components ─── */

const Lever = ({ label, value, onChange, color, desc }) => (
  <div className="lever">
    <div className="lever-header">
      <span className="lever-label">{label}</span>
      <span className="lever-value" style={{ color }}>{value}%</span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
    <span className="lever-desc">{desc}</span>
  </div>
);

const MetricCard = ({ label, value, color, inverted }) => {
  const displayValue = inverted ? value : value;
  const isGood = inverted ? value > 60 : value < 40;

  return (
    <div className="metric-card">
      <div className="metric-top">
        <span className="metric-title">{label}</span>
        <span className="metric-value" style={{ color }}>{Math.round(displayValue)}%</span>
      </div>
      <div className="metric-bar">
        <div className="metric-bar-fill" style={{ width: `${displayValue}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

export default SystemMapApp;
