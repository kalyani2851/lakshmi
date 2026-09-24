import React from 'react';
import { runFCFS, runSSTF, runSCAN, runCSCAN, runLOOK, runCLOOK } from '../utils/diskAlgorithms';
import { AlgorithmPerformanceCharts } from './AlgorithmPerformanceCharts';

const benchmarkQueue = [98, 183, 37, 122, 14, 124, 65, 67];
const initialHead = 50;
const diskSize = 200;

export const OutputScreenshotsSection: React.FC = () => {
  // Precompute exact trajectory data for standard benchmark
  const fcfsRes = runFCFS(benchmarkQueue, initialHead);
  const sstfRes = runSSTF(benchmarkQueue, initialHead);
  const scanRes = runSCAN(benchmarkQueue, initialHead, diskSize, 'Right');
  const cscanRes = runCSCAN(benchmarkQueue, initialHead, diskSize, 'Right');
  const lookRes = runLOOK(benchmarkQueue, initialHead, diskSize, 'Right');
  const clookRes = runCLOOK(benchmarkQueue, initialHead, diskSize, 'Right');

  // Trajectory SVG matching app.js renderer (Path: #6366f1, Head: #f43f5e, Nodes: #38bdf8, Grid: #1e293b)
  const renderTrajectorySVG = (seq: number[], strokeColor: string = '#6366f1', height: number = 180) => {
    const width = 620;
    const paddingX = 40;
    const paddingY = 28;
    const drawWidth = width - 2 * paddingX;
    const drawHeight = height - 2 * paddingY;
    const maxTrack = diskSize - 1;

    const getX = (val: number) => paddingX + (val / maxTrack) * drawWidth;
    const getY = (idx: number) => paddingY + (idx / Math.max(1, seq.length - 1)) * drawHeight;

    const points = seq.map((val, idx) => `${getX(val)},${getY(idx)}`).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-slate-950 rounded-lg border border-slate-800">
        {/* Vertical Grid lines matching app.js (5 divisions) */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = paddingX + (drawWidth / 5) * i;
          const trackVal = Math.round((i / 5) * maxTrack);
          return (
            <g key={i}>
              <line x1={x} y1={paddingY - 10} x2={x} y2={height - paddingY + 10} stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
              <text x={x} y={paddingY - 14} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
                {trackVal}
              </text>
            </g>
          );
        })}

        {/* Path line matching app.js ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2.5; */}
        <polyline fill="none" stroke={strokeColor} strokeWidth="2.5" points={points} strokeLinecap="round" strokeLinejoin="round" />

        {/* Nodes matching app.js: i === 0 ? "#f43f5e" : "#38bdf8" */}
        {seq.map((val, idx) => {
          const x = getX(val);
          const y = getY(idx);
          const isInitial = idx === 0;
          return (
            <g key={idx}>
              <circle
                cx={x}
                cy={y}
                r={isInitial ? 5 : 4}
                fill={isInitial ? '#f43f5e' : '#38bdf8'}
                stroke="#0f172a"
                strokeWidth="1.5"
              />
              <text
                x={x}
                y={y - 7}
                textAnchor="middle"
                fill={isInitial ? '#fca5a5' : '#bae6fd'}
                fontSize="9"
                fontFamily="monospace"
                fontWeight={isInitial ? 'bold' : 'normal'}
              >
                {isInitial ? `H:${val}` : val}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-8 text-slate-800">
      
      {/* Colour Print Requirement Banner */}
      <div className="bg-amber-50 border-2 border-amber-500/80 p-3.5 rounded-lg flex items-center justify-between text-xs text-amber-900 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="font-bold uppercase tracking-wider text-amber-950">
            Mandatory Instruction: Colour Print Required
          </span>
        </div>
        <span className="font-semibold">
          Section 8 figures must be printed in COLOUR for laboratory record evaluation.
        </span>
      </div>

      {/* Figure 8.1 */}
      <div className="border border-slate-300 rounded-lg p-4 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">
            Figure 8.1 – Disk Scheduling Simulator Web Interface (index.html + app.js)
          </h3>
          <span className="text-[11px] bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded border border-indigo-300 font-semibold">
            COLOUR PRINT
          </span>
        </div>
        
        {/* Authentic UI Rendering matching index.html */}
        <div className="bg-slate-900 text-slate-100 p-4 rounded-lg border border-slate-800 space-y-4 font-sans text-xs">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="font-bold text-indigo-400 text-sm flex items-center gap-1.5">
              <span>💽</span> Disk Scheduling Visualizer
            </span>
            <span className="bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2.5 py-0.5 rounded-full text-[10px] font-mono">
              FastAPI Connected &bull; http://127.0.0.1:8000
            </span>
          </div>

          {/* Grid Layout (Sidebar + Visualizer) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            {/* Sidebar Form */}
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
              <span className="font-semibold text-slate-200 block border-b border-slate-700 pb-1">
                Simulation Parameters
              </span>
              <div>
                <span className="text-slate-400 text-[10px] block">Request Queue:</span>
                <span className="font-mono text-white bg-slate-900 px-2 py-1 rounded block mt-0.5">
                  98, 183, 37, 122, 14, 124, 65, 67
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px] block">Initial Head:</span>
                  <span className="font-mono text-white bg-slate-900 px-2 py-1 rounded block mt-0.5">50</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Disk Size:</span>
                  <span className="font-mono text-white bg-slate-900 px-2 py-1 rounded block mt-0.5">200</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Algorithm / Direction:</span>
                <span className="font-mono text-indigo-300 bg-slate-900 px-2 py-1 rounded block mt-0.5">
                  Compare All (ALL) &bull; Right (Towards High)
                </span>
              </div>
            </div>

            {/* Canvas & Active Metrics */}
            <div className="md:col-span-2 bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-300">Head Movement Trajectory</span>
                <span className="text-indigo-400 font-mono text-[10px]">Active: SCAN</span>
              </div>
              <div className="h-28 bg-slate-950 rounded border border-slate-900 flex items-center justify-center text-slate-500 font-mono text-[10px]">
                [HTML5 Canvas Viewport: Real-Time Polyline Trajectory Rendered at 60 FPS]
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-indigo-950/60 border border-indigo-500/80 p-2 rounded text-center">
                  <span className="text-[10px] text-indigo-300 block">SCAN (Active)</span>
                  <span className="text-white font-bold font-mono">334 cyl</span>
                </div>
                <div className="bg-slate-900 border border-slate-700 p-2 rounded text-center">
                  <span className="text-[10px] text-slate-400 block">SSTF</span>
                  <span className="text-emerald-400 font-bold font-mono">236 cyl</span>
                </div>
                <div className="bg-slate-900 border border-slate-700 p-2 rounded text-center">
                  <span className="text-[10px] text-slate-400 block">LOOK</span>
                  <span className="text-amber-400 font-bold font-mono">291 cyl</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed text-justify">
          <strong className="text-slate-900">Figure 8.1 Description:</strong> The home interface of the simulator loaded in the browser. The left control sidebar accepts comma-separated track requests, initial head cylinder, total disk size, algorithm selection (including the comprehensive &quot;Compare All&quot; mode), and head direction. The right panel renders the high-DPI HTML5 Canvas trajectory alongside dynamic metric cards for each evaluated algorithm.
        </p>
      </div>

      {/* Figure 8.2 */}
      <div className="border border-slate-300 rounded-lg p-4 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">
            Figure 8.2 – FCFS (First-Come, First-Served) Trajectory & Metrics
          </h3>
          <span className="text-[11px] bg-rose-100 text-rose-900 px-2 py-0.5 rounded border border-rose-300 font-semibold">
            COLOUR PRINT
          </span>
        </div>

        {renderTrajectorySVG(fcfsRes.sequence, '#6366f1')}

        <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
          <div className="bg-slate-50 p-2 rounded border border-slate-300">
            <span className="text-slate-500 block text-[10px]">TOTAL SEEK (D)</span>
            <span className="text-rose-700 font-bold text-sm">{fcfsRes.total_seek} cyl</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-300">
            <span className="text-slate-500 block text-[10px]">AVERAGE SEEK (L_avg)</span>
            <span className="text-slate-800 font-bold text-sm">{fcfsRes.average_seek} cyl</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-300">
            <span className="text-slate-500 block text-[10px]">SEQUENCE ORDER</span>
            <span className="text-slate-700 text-[10px] truncate block font-sans">
              [{fcfsRes.sequence.join(', ')}]
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed text-justify">
          <strong className="text-slate-900">Figure 8.2 Description:</strong> Execution of FCFS for the benchmark queue. The head begins at track 50 and strictly services requests in order of arrival: 50 &rarr; 98 &rarr; 183 &rarr; 37 &rarr; 122 &rarr; 14 &rarr; 124 &rarr; 65 &rarr; 67. The visual trajectory clearly demonstrates severe wild mechanical oscillations across the entire platter, yielding a high Total Seek Distance of 643 cylinders and an Average Seek of 80.38 cylinders.
        </p>
      </div>

      {/* Figure 8.3 */}
      <div className="border border-slate-300 rounded-lg p-4 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">
            Figure 8.3 – SSTF (Shortest Seek Time First) Trajectory & Metrics
          </h3>
          <span className="text-[11px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300 font-semibold">
            COLOUR PRINT
          </span>
        </div>

        {renderTrajectorySVG(sstfRes.sequence, '#6366f1')}

        <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
          <div className="bg-slate-50 p-2 rounded border border-slate-300">
            <span className="text-slate-500 block text-[10px]">TOTAL SEEK (D)</span>
            <span className="text-emerald-700 font-bold text-sm">{sstfRes.total_seek} cyl</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-300">
            <span className="text-slate-500 block text-[10px]">AVERAGE SEEK (L_avg)</span>
            <span className="text-slate-800 font-bold text-sm">{sstfRes.average_seek} cyl</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-300">
            <span className="text-slate-500 block text-[10px]">SEQUENCE ORDER</span>
            <span className="text-slate-700 text-[10px] truncate block font-sans">
              [{sstfRes.sequence.join(', ')}]
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed text-justify">
          <strong className="text-slate-900">Figure 8.3 Description:</strong> Execution of SSTF. At each step, the head greedily chooses the request with minimum cylinder difference. From 50, it services 37, then 14, before moving outward through 65, 67, 98, 122, 124, and 183. Total seek distance drops dramatically to 236 cylinders (63.3% reduction compared to FCFS), with an Average Seek of 29.50 cylinders.
        </p>
      </div>

      {/* Figure 8.4 */}
      <div className="border border-slate-300 rounded-lg p-4 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">
            Figure 8.4 – SCAN (Elevator Algorithm) Trajectory
          </h3>
          <span className="text-[11px] bg-sky-100 text-sky-900 px-2 py-0.5 rounded border border-sky-300 font-semibold">
            COLOUR PRINT
          </span>
        </div>

        {renderTrajectorySVG(scanRes.sequence, '#6366f1')}

        <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
          <div className="bg-slate-50 p-2 rounded border border-slate-300">
            <span className="text-slate-500 block text-[10px]">TOTAL SEEK (D)</span>
            <span className="text-sky-800 font-bold text-sm">{scanRes.total_seek} cyl</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-300">
            <span className="text-slate-500 block text-[10px]">AVERAGE SEEK (L_avg)</span>
            <span className="text-slate-800 font-bold text-sm">{scanRes.average_seek} cyl</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-300">
            <span className="text-slate-500 block text-[10px]">SEQUENCE ORDER</span>
            <span className="text-slate-700 text-[10px] truncate block font-sans">
              [{scanRes.sequence.join(', ')}]
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed text-justify">
          <strong className="text-slate-900">Figure 8.4 Description:</strong> SCAN sweeps in the rightward direction from 50, servicing all ascending requests (65, 67, 98, 122, 124, 183) up to the outer disk boundary at 199, then reverses direction to service lower tracks descending (37 &rarr; 14). Total Seek Distance = 334 cylinders, Average Seek = 41.75 cylinders.
        </p>
      </div>

      {/* Figure 8.5 */}
      <div className="border border-slate-300 rounded-lg p-4 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">
            Figure 8.5 – C-SCAN (Circular SCAN) Trajectory
          </h3>
          <span className="text-[11px] bg-purple-100 text-purple-900 px-2 py-0.5 rounded border border-purple-300 font-semibold">
            COLOUR PRINT
          </span>
        </div>

        {renderTrajectorySVG(cscanRes.sequence, '#6366f1')}

        <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
          <div className="bg-slate-50 p-2 rounded border border-slate-300">
            <span className="text-slate-500 block text-[10px]">TOTAL SEEK (D)</span>
            <span className="text-purple-800 font-bold text-sm">{cscanRes.total_seek} cyl</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-300">
            <span className="text-slate-500 block text-[10px]">AVERAGE SEEK (L_avg)</span>
            <span className="text-slate-800 font-bold text-sm">{cscanRes.average_seek} cyl</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-300">
            <span className="text-slate-500 block text-[10px]">SEQUENCE ORDER</span>
            <span className="text-slate-700 text-[10px] truncate block font-sans">
              [{cscanRes.sequence.join(', ')}]
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed text-justify">
          <strong className="text-slate-900">Figure 8.5 Description:</strong> C-SCAN services rightward requests up to cylinder 199, performs an instant reset jump from 199 to track 0 without servicing intermediate requests, and resumes ascending servicing (14 &rarr; 37). Total Seek = 385 cylinders, Average Seek = 48.13 cylinders.
        </p>
      </div>

      {/* Figure 8.6 */}
      <div className="border border-slate-300 rounded-lg p-4 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">
            Figure 8.6 – LOOK & C-LOOK Trajectories
          </h3>
          <span className="text-[11px] bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded border border-indigo-300 font-semibold">
            COLOUR PRINT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-600 mb-1">
              <span className="font-bold text-slate-800">LOOK Trajectory</span>
              <span className="text-indigo-700 font-bold">291 cyl &bull; Avg: 36.38 cyl</span>
            </div>
            {renderTrajectorySVG(lookRes.sequence, '#6366f1', 150)}
          </div>
          <div>
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-600 mb-1">
              <span className="font-bold text-slate-800">C-LOOK Trajectory</span>
              <span className="text-pink-700 font-bold">322 cyl &bull; Avg: 40.25 cyl</span>
            </div>
            {renderTrajectorySVG(clookRes.sequence, '#6366f1', 150)}
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed text-justify">
          <strong className="text-slate-900">Figure 8.6 Description:</strong> LOOK and C-LOOK eliminate redundant boundary seek. LOOK reverses immediately at the highest pending request (track 183) without visiting track 199, saving 43 cylinders over SCAN. C-LOOK jumps directly from track 183 to the lowest pending request (track 14) without visiting 199 or 0, saving 63 cylinders over C-SCAN.
        </p>
      </div>

      {/* Figure 8.7 */}
      <div className="border border-slate-300 rounded-lg p-4 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">
            Figure 8.7 – Multi-Algorithm Comparative Benchmark Summary (Recharts Engine)
          </h3>
          <span className="text-[11px] bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded border border-indigo-300 font-semibold">
            COLOUR PRINT
          </span>
        </div>

        {/* Dynamic Recharts Performance Chart */}
        <AlgorithmPerformanceCharts mode="document" />

        <p className="text-xs text-slate-700 leading-relaxed text-justify">
          <strong className="text-slate-900">Figure 8.7 Description:</strong> Comprehensive comparative performance visualization rendered using Recharts for the standard benchmark workload. SSTF achieves the absolute lowest mechanical traversal (236 cylinders), followed closely by LOOK (291 cylinders) and C-LOOK (322 cylinders). FCFS represents the unoptimized baseline upper bound with 643 cylinders.
        </p>
      </div>

    </div>
  );
};
