import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AlgorithmType, DirectionType, SimulationResult } from '../types/simulator';
import { runFCFS, runSSTF, runSCAN, runCSCAN, runLOOK, runCLOOK } from '../utils/diskAlgorithms';
import { AlgorithmPerformanceCharts } from './AlgorithmPerformanceCharts';
import { Play, Pause, RotateCcw, Sliders, HardDrive, CheckCircle2 } from 'lucide-react';

export const InteractiveSimulator: React.FC = () => {
  const [requestQueueStr, setRequestQueueStr] = useState<string>('98, 183, 37, 122, 14, 124, 65, 67');
  const [initialHead, setInitialHead] = useState<number>(50);
  const [diskSize, setDiskSize] = useState<number>(200);
  const [selectedAlgoOption, setSelectedAlgoOption] = useState<string>('ALL');
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Active algorithm being rendered on canvas
  const [activeAlgo, setActiveAlgo] = useState<AlgorithmType>('SCAN');

  // Animation state matching app.js
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(1.0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Parse requests
  const parsedRequests = useMemo(() => {
    return requestQueueStr
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }, [requestQueueStr]);

  // Compute all algorithms matching main1.py simulation logic
  const allResults: Record<string, SimulationResult> = useMemo(() => {
    const emptyRecord: Record<string, SimulationResult> = {};
    if (parsedRequests.length === 0 || initialHead < 0 || diskSize <= 0) return emptyRecord;
    const dirType: DirectionType = direction === 'right' ? 'Right' : 'Left';
    const res: Record<string, SimulationResult> = {
      FCFS: runFCFS(parsedRequests, initialHead),
      SSTF: runSSTF(parsedRequests, initialHead),
      SCAN: runSCAN(parsedRequests, initialHead, diskSize, dirType),
      'C-SCAN': runCSCAN(parsedRequests, initialHead, diskSize, dirType),
      LOOK: runLOOK(parsedRequests, initialHead, diskSize, dirType),
      'C-LOOK': runCLOOK(parsedRequests, initialHead, diskSize, dirType),
    };
    return res;
  }, [parsedRequests, initialHead, diskSize, direction]);

  // Active result currently plotted
  const currentResult = useMemo(() => {
    return allResults[activeAlgo] || null;
  }, [allResults, activeAlgo]);

  // When algorithm selector changes
  useEffect(() => {
    if (selectedAlgoOption === 'ALL') {
      if (!allResults[activeAlgo]) {
        setActiveAlgo('SCAN');
      }
    } else {
      setActiveAlgo(selectedAlgoOption as AlgorithmType);
    }
    setProgress(1.0);
    setIsPlaying(false);
  }, [selectedAlgoOption]);

  // Validate inputs matching main1.py validation rules
  useEffect(() => {
    if (parsedRequests.length === 0) {
      setErrorMsg('Request queue cannot be empty.');
    } else if (initialHead < 0 || initialHead >= diskSize) {
      setErrorMsg(`Head position must be between 0 and ${diskSize - 1}.`);
    } else if (parsedRequests.some((r) => r < 0 || r >= diskSize)) {
      const out = parsedRequests.filter((r) => r < 0 || r >= diskSize);
      setErrorMsg(`Requests [${out.join(', ')}] must be within range 0 to ${diskSize - 1}.`);
    } else {
      setErrorMsg(null);
    }
  }, [initialHead, diskSize, parsedRequests]);

  // Canvas trajectory renderer matching app.js renderChart()
  const renderChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
    const width = rect.width;
    const height = 340;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    if (!currentResult || currentResult.sequence.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Enter parameters and click Run Simulation.', width / 2, height / 2);
      ctx.restore();
      return;
    }

    const seq = currentResult.sequence;
    const padding = 40;
    const drawWidth = width - padding * 2;
    const drawHeight = height - padding * 2;

    // Grid background lines matching app.js
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      const x = padding + (drawWidth / 5) * i;
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);

      const trackVal = Math.round((i / 5) * (diskSize - 1));
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(trackVal.toString(), x, padding - 14);
    }
    ctx.stroke();

    const getX = (val: number) => padding + (val / Math.max(1, diskSize - 1)) * drawWidth;
    const getY = (idx: number) => padding + (idx / Math.max(1, seq.length - 1 || 1)) * drawHeight;

    // Path construction matching app.js
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const totalSegments = seq.length - 1;
    const currentSegment = Math.floor(progress * totalSegments);
    const segmentProgress = progress * totalSegments - currentSegment;

    ctx.moveTo(getX(seq[0]), getY(0));

    for (let i = 0; i < currentSegment; i++) {
      ctx.lineTo(getX(seq[i + 1]), getY(i + 1));
    }

    if (currentSegment < totalSegments) {
      const startX = getX(seq[currentSegment]);
      const startY = getY(currentSegment);
      const endX = getX(seq[currentSegment + 1]);
      const endY = getY(currentSegment + 1);

      const interpX = startX + (endX - startX) * segmentProgress;
      const interpY = startY + (endY - startY) * segmentProgress;
      ctx.lineTo(interpX, interpY);
    }
    ctx.stroke();

    // Trajectory Nodes matching app.js: i === 0 ? "#f43f5e" : "#38bdf8"
    for (let i = 0; i <= currentSegment && i < seq.length; i++) {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#f43f5e' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(getX(seq[i]), getY(i), isHead ? 5 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Node label
      ctx.fillStyle = isHead ? '#fca5a5' : '#e0f2fe';
      ctx.font = isHead ? 'bold 10px monospace' : '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(isHead ? `H:${seq[i]}` : seq[i].toString(), getX(seq[i]), getY(i) - 8);
    }

    ctx.restore();
  };

  useEffect(() => {
    renderChart();
  }, [currentResult, progress, diskSize]);

  // Animation step matching app.js startAnimation()
  useEffect(() => {
    if (!isPlaying) return;

    const step = () => {
      setProgress((prev) => {
        if (prev < 1.0) {
          const next = prev + 0.008;
          if (next >= 1.0) {
            setIsPlaying(false);
            return 1.0;
          }
          return next;
        } else {
          setIsPlaying(false);
          return 1.0;
        }
      });
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handlePlayToggle = () => {
    if (!currentResult) return;
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (progress >= 1.0) {
        setProgress(0.0);
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0.0);
  };

  const loadPreset = (type: 'benchmark' | 'random' | 'dense') => {
    if (type === 'benchmark') {
      setRequestQueueStr('98, 183, 37, 122, 14, 124, 65, 67');
      setInitialHead(50);
      setDiskSize(200);
      setDirection('right');
    } else if (type === 'dense') {
      setRequestQueueStr('15, 30, 45, 60, 75, 90, 105, 120, 135, 150');
      setInitialHead(80);
      setDiskSize(200);
      setDirection('left');
    } else if (type === 'random') {
      const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 180) + 10);
      setRequestQueueStr(arr.join(', '));
      setInitialHead(Math.floor(Math.random() * 150) + 20);
      setDiskSize(200);
    }
    setProgress(1.0);
    setIsPlaying(false);
  };

  // Algorithms to display cards for
  const displayedAlgos: AlgorithmType[] =
    selectedAlgoOption === 'ALL'
      ? ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK']
      : [selectedAlgoOption as AlgorithmType];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl text-slate-100 p-6 space-y-6">
      
      {/* Header matching index.html navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>Disk Scheduling Visualizer</span>
            </h2>
            <p className="text-xs text-slate-400">
              Direct implementation of index.html, app.js, and main1.py simulation logic
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-3 py-1 rounded-full font-mono text-[11px]">
            FastAPI Connected &bull; http://127.0.0.1:8000
          </span>
          <button
            onClick={() => loadPreset('benchmark')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded border border-slate-700 text-xs font-mono transition"
          >
            Load Benchmark
          </button>
          <button
            onClick={() => loadPreset('random')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs font-mono transition"
          >
            Randomize
          </button>
        </div>
      </div>

      {/* Main Workspace matching index.html layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Simulation Control Sidebar */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setProgress(0.0);
              setIsPlaying(true);
            }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold border-b border-slate-700 pb-2 text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Simulation Parameters</span>
            </h3>

            {errorMsg && (
              <div className="bg-rose-900/50 border border-rose-500 text-rose-200 text-xs p-3 rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Input Queue */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Request Queue (comma-separated)
              </label>
              <input
                type="text"
                value={requestQueueStr}
                onChange={(e) => setRequestQueueStr(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Initial Head & Disk Capacity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Initial Head</label>
                <input
                  type="number"
                  value={initialHead}
                  min={0}
                  max={diskSize - 1}
                  onChange={(e) => setInitialHead(parseInt(e.target.value) || 0)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Disk Size</label>
                <input
                  type="number"
                  value={diskSize}
                  min={10}
                  onChange={(e) => setDiskSize(parseInt(e.target.value) || 200)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Algorithm Selector matching index.html */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Algorithm</label>
              <select
                value={selectedAlgoOption}
                onChange={(e) => setSelectedAlgoOption(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-medium"
              >
                <option value="ALL">Compare All</option>
                <option value="FCFS">FCFS (First-Come, First-Served)</option>
                <option value="SSTF">SSTF (Shortest Seek Time First)</option>
                <option value="SCAN">SCAN (Elevator)</option>
                <option value="C-SCAN">C-SCAN (Circular SCAN)</option>
                <option value="LOOK">LOOK</option>
                <option value="C-LOOK">C-LOOK</option>
              </select>
            </div>

            {/* Direction Toggle matching index.html radio buttons */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Head Direction</label>
              <div className="flex gap-4 bg-slate-900 p-2 rounded-lg border border-slate-700">
                <label className="flex items-center gap-2 text-xs cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="direction"
                    value="left"
                    checked={direction === 'left'}
                    onChange={() => setDirection('left')}
                    className="accent-indigo-500"
                  />
                  <span>Left (Towards 0)</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="direction"
                    value="right"
                    checked={direction === 'right'}
                    onChange={() => setDirection('right')}
                    className="accent-indigo-500"
                  />
                  <span>Right (Towards High)</span>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition shadow-md flex items-center justify-center gap-2 text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Simulation</span>
            </button>
          </form>

          {/* Animation Controls matching index.html */}
          <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-400">Animation Controls</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="Reset animation"
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded-lg text-xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handlePlayToggle}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs transition flex items-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right: Visualization Display Area (Canvas + Metrics Cards) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Trajectory Canvas matching index.html */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg flex flex-col flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Head Movement Trajectory</span>
              </h3>
              <span className="text-xs text-indigo-400 font-mono bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-800">
                Active: {activeAlgo}
              </span>
            </div>

            <div className="relative w-full h-[340px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
          </div>

          {/* Algorithm Metrics Container matching app.js updateMetricsUI() */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedAlgos.map((algoKey) => {
              const data = allResults[algoKey];
              if (!data) return null;
              const isSelected = algoKey === activeAlgo;

              return (
                <div
                  key={algoKey}
                  onClick={() => {
                    setActiveAlgo(algoKey);
                    setProgress(1.0);
                    setIsPlaying(false);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-sm text-slate-200">{algoKey}</h4>
                      {isSelected && (
                        <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs space-y-1 text-slate-400">
                      <p>
                        Total Seek:{' '}
                        <span className="text-slate-100 font-semibold">{data.total_seek}</span> cyl
                      </p>
                      <p>
                        Avg Seek:{' '}
                        <span className="text-slate-100 font-semibold">{data.average_seek}</span> cyl
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/50 text-[10px] text-slate-500 font-mono truncate">
                    Seq: [{data.sequence.join(', ')}]
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recharts Performance Comparison Chart */}
          <div className="pt-4">
            <AlgorithmPerformanceCharts
              queue={parsedRequests}
              initialHead={initialHead}
              diskSize={diskSize}
              direction={direction === 'right' ? 'Right' : 'Left'}
              mode="interactive"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
