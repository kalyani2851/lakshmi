import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList,
  ReferenceLine,
  LineChart,
  Line,
} from 'recharts';
import { runFCFS, runSSTF, runSCAN, runCSCAN, runLOOK, runCLOOK } from '../utils/diskAlgorithms';
import { BarChart3, LineChart as LineChartIcon, Award, TrendingDown, ArrowUpDown, Sliders } from 'lucide-react';

export interface PerformanceChartsProps {
  queue?: number[];
  initialHead?: number;
  diskSize?: number;
  direction?: 'Right' | 'Left';
  mode?: 'document' | 'interactive'; // 'document' is tailored for A4 print/reading; 'interactive' offers controls & tabs
  showTrajectoryLine?: boolean;
}

const DEFAULT_BENCHMARK = [98, 183, 37, 122, 14, 124, 65, 67];
const DEFAULT_HEAD = 50;
const DEFAULT_DISK_SIZE = 200;
const DEFAULT_DIRECTION: 'Right' | 'Left' = 'Right';

// Algorithmic palette matching documentation color coding
const ALGO_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  SSTF: { fill: '#10b981', stroke: '#059669', text: 'text-emerald-700' },
  LOOK: { fill: '#f59e0b', stroke: '#d97706', text: 'text-amber-700' },
  'C-LOOK': { fill: '#ec4899', stroke: '#db2777', text: 'text-pink-700' },
  SCAN: { fill: '#0ea5e9', stroke: '#0284c7', text: 'text-sky-700' },
  'C-SCAN': { fill: '#8b5cf6', stroke: '#7c3aed', text: 'text-purple-700' },
  FCFS: { fill: '#f43f5e', stroke: '#e11d48', text: 'text-rose-700' },
};

export const AlgorithmPerformanceCharts: React.FC<PerformanceChartsProps> = ({
  queue = DEFAULT_BENCHMARK,
  initialHead = DEFAULT_HEAD,
  diskSize = DEFAULT_DISK_SIZE,
  direction = DEFAULT_DIRECTION,
  mode = 'document',
}) => {
  const [activeMetric, setActiveMetric] = useState<'seek' | 'average' | 'reduction' | 'trajectory'>('seek');
  const [selectedPreset, setSelectedPreset] = useState<string>('benchmark');
  const [customQueue, setCustomQueue] = useState<number[]>(queue);
  const [customHead, setCustomHead] = useState<number>(initialHead);

  // Handle Preset Selection in interactive mode
  const handleSelectPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey === 'benchmark') {
      setCustomQueue([98, 183, 37, 122, 14, 124, 65, 67]);
      setCustomHead(50);
    } else if (presetKey === 'clustered') {
      setCustomQueue([45, 52, 55, 48, 170, 175, 180]);
      setCustomHead(50);
    } else if (presetKey === 'extreme') {
      setCustomQueue([10, 190, 15, 185, 20, 180]);
      setCustomHead(100);
    } else if (presetKey === 'sequential') {
      setCustomQueue([20, 40, 60, 80, 100, 120, 140, 160]);
      setCustomHead(10);
    }
  };

  const activeQ = mode === 'interactive' ? customQueue : queue;
  const activeH = mode === 'interactive' ? customHead : initialHead;

  // Run all algorithms
  const results = useMemo(() => {
    return {
      FCFS: runFCFS(activeQ, activeH),
      SSTF: runSSTF(activeQ, activeH),
      SCAN: runSCAN(activeQ, activeH, diskSize, direction),
      'C-SCAN': runCSCAN(activeQ, activeH, diskSize, direction),
      LOOK: runLOOK(activeQ, activeH, diskSize, direction),
      'C-LOOK': runCLOOK(activeQ, activeH, diskSize, direction),
    };
  }, [activeQ, activeH, diskSize, direction]);

  const fcfsBaseline = results.FCFS.total_seek || 1;

  // Bar chart dataset sorted by efficiency (lowest seek distance first)
  const chartData = useMemo(() => {
    const list = [
      { name: 'SSTF', result: results.SSTF, type: 'Greedy' },
      { name: 'LOOK', result: results.LOOK, type: 'Directional' },
      { name: 'C-LOOK', result: results['C-LOOK'], type: 'Circular' },
      { name: 'SCAN', result: results.SCAN, type: 'Elevator' },
      { name: 'C-SCAN', result: results['C-SCAN'], type: 'Circular' },
      { name: 'FCFS', result: results.FCFS, type: 'First-Come' },
    ];

    return list.map((item) => {
      const totalSeek = item.result.total_seek;
      const avgSeek = item.result.average_seek;
      const reduction = Number((((fcfsBaseline - totalSeek) / fcfsBaseline) * 100).toFixed(1));
      const relativePct = Number(((totalSeek / fcfsBaseline) * 100).toFixed(1));

      return {
        name: item.name,
        totalSeek,
        avgSeek,
        reduction: Math.max(0, reduction),
        relativePct,
        type: item.type,
        fill: ALGO_COLORS[item.name]?.fill || '#6366f1',
      };
    });
  }, [results, fcfsBaseline]);

  // Step-by-step trajectory dataset for LineChart comparison
  const trajectoryData = useMemo(() => {
    const maxSteps = Math.max(
      results.FCFS.sequence.length,
      results.SSTF.sequence.length,
      results.SCAN.sequence.length,
      results['C-SCAN'].sequence.length,
      results.LOOK.sequence.length,
      results['C-LOOK'].sequence.length
    );

    const steps = [];
    for (let i = 0; i < maxSteps; i++) {
      steps.push({
        step: `Step ${i}`,
        FCFS: results.FCFS.sequence[i] ?? null,
        SSTF: results.SSTF.sequence[i] ?? null,
        SCAN: results.SCAN.sequence[i] ?? null,
        'C-SCAN': results['C-SCAN'].sequence[i] ?? null,
        LOOK: results.LOOK.sequence[i] ?? null,
        'C-LOOK': results['C-LOOK'].sequence[i] ?? null,
      });
    }
    return steps;
  }, [results]);

  const bestAlgo = chartData[0]; // Lowest seek

  return (
    <div className={`algorithm-performance-charts ${mode === 'document' ? 'space-y-4' : 'space-y-6'}`}>
      
      {/* Interactive Controls Bar (Only in interactive mode) */}
      {mode === 'interactive' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Metric Mode Tabs */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setActiveMetric('seek')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${
                  activeMetric === 'seek'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Total Head Movement</span>
              </button>
              <button
                onClick={() => setActiveMetric('average')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${
                  activeMetric === 'average'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Average Seek (L_avg)</span>
              </button>
              <button
                onClick={() => setActiveMetric('reduction')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${
                  activeMetric === 'reduction'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Seek Reduction vs FCFS</span>
              </button>
              <button
                onClick={() => setActiveMetric('trajectory')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${
                  activeMetric === 'trajectory'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LineChartIcon className="w-3.5 h-3.5" />
                <span>Trajectory Overlay</span>
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Sliders className="w-3 h-3 text-indigo-400" /> Workload:
              </span>
              {[
                { id: 'benchmark', label: 'Standard Lab' },
                { id: 'clustered', label: 'Clustered' },
                { id: 'extreme', label: 'Extremes' },
                { id: 'sequential', label: 'Sequential' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition border ${
                    selectedPreset === p.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Main Chart Box */}
      <div className={`rounded-xl border ${
        mode === 'document' 
          ? 'bg-white border-slate-300 p-4 shadow-sm' 
          : 'bg-slate-900 border-slate-800 p-5 shadow-xl'
      }`}>
        
        {/* Header Summary Strip */}
        <div className={`flex flex-wrap items-center justify-between pb-3 mb-3 border-b ${
          mode === 'document' ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className={`text-sm font-bold tracking-tight ${
                mode === 'document' ? 'text-slate-900' : 'text-white'
              }`}>
                {activeMetric === 'trajectory' 
                  ? 'Head Trajectory Progression Across Cylinders (0 to 199)' 
                  : activeMetric === 'average'
                  ? 'Average Seek Distance per Request (L_avg in Tracks)'
                  : activeMetric === 'reduction'
                  ? 'Seek Reduction Efficiency Compared to FCFS Baseline (%)'
                  : 'Total Disk Head Movement Comparison (D in Cylinders)'}
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                mode === 'document' 
                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-200' 
                  : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
              }`}>
                Recharts Visual Engine
              </span>
            </div>
            <p className={`text-[11px] mt-0.5 ${mode === 'document' ? 'text-slate-500' : 'text-slate-400'}`}>
              Benchmark Workload: Queue = [{activeQ.join(', ')}] &bull; Head = {activeH} &bull; Disk = {diskSize} Tracks &bull; Direction = {direction}
            </p>
          </div>

          {/* Winner Badge */}
          <div className="flex items-center space-x-1.5 text-xs font-mono">
            <span className={`px-2 py-1 rounded flex items-center gap-1 font-bold ${
              mode === 'document'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Optimal: {bestAlgo.name} ({bestAlgo.totalSeek} cyl)</span>
            </span>
          </div>
        </div>

        {/* Chart Rendering Container */}
        <div className="w-full" style={{ height: mode === 'document' ? 240 : 320 }}>
          {activeMetric === 'trajectory' ? (
            /* Multi-Line Trajectory Overlay */
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={mode === 'document' ? '#e2e8f0' : '#334155'} />
                <XAxis 
                  dataKey="step" 
                  tick={{ fontSize: 10, fill: mode === 'document' ? '#64748b' : '#94a3b8' }} 
                />
                <YAxis 
                  domain={[0, diskSize]} 
                  tick={{ fontSize: 10, fill: mode === 'document' ? '#64748b' : '#94a3b8' }} 
                  label={{ 
                    value: 'Cylinder Track (0-199)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    fontSize: 10, 
                    fill: mode === 'document' ? '#64748b' : '#94a3b8' 
                  }} 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: mode === 'document' ? '#ffffff' : '#0f172a',
                    borderColor: mode === 'document' ? '#cbd5e1' : '#334155',
                    fontSize: '11px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
                />
                <Line type="monotone" dataKey="FCFS" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="SSTF" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="SCAN" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="C-SCAN" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="LOOK" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="C-LOOK" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            /* Bar Chart for Seek, Average, or Reduction */
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 18, right: 20, left: -5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={mode === 'document' ? '#e2e8f0' : '#334155'} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fontWeight: 'bold', fill: mode === 'document' ? '#334155' : '#cbd5e1' }} 
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: mode === 'document' ? '#64748b' : '#94a3b8' }} 
                />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    if (name === 'totalSeek') return [`${value} cylinders`, 'Total Head Movement (D)'];
                    if (name === 'avgSeek') return [`${value} tracks/request`, 'Average Seek (L_avg)'];
                    if (name === 'reduction') return [`${value}% reduction`, 'Seek Reduction vs FCFS'];
                    return [value, name];
                  }}
                  contentStyle={{
                    backgroundColor: mode === 'document' ? '#ffffff' : '#0f172a',
                    borderColor: mode === 'document' ? '#cbd5e1' : '#334155',
                    fontSize: '11px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                
                {/* Baseline Reference Line for FCFS */}
                {activeMetric === 'seek' && (
                  <ReferenceLine
                    y={fcfsBaseline}
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    label={{
                      value: `FCFS Baseline: ${fcfsBaseline} cyl`,
                      position: 'top',
                      fill: '#e11d48',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  />
                )}

                <Bar
                  dataKey={
                    activeMetric === 'average'
                      ? 'avgSeek'
                      : activeMetric === 'reduction'
                      ? 'reduction'
                      : 'totalSeek'
                  }
                  radius={[4, 4, 0, 0]}
                  barSize={mode === 'document' ? 44 : 52}
                >
                  <LabelList
                    dataKey={
                      activeMetric === 'average'
                        ? 'avgSeek'
                        : activeMetric === 'reduction'
                        ? 'reduction'
                        : 'totalSeek'
                    }
                    position="top"
                    formatter={(val: any) => 
                      activeMetric === 'average' 
                        ? `${val} cyl` 
                        : activeMetric === 'reduction' 
                        ? `${val}%` 
                        : `${val} cyl`
                    }
                    style={{
                      fontSize: '10px',
                      fontWeight: 'bold',
                      fill: mode === 'document' ? '#1e293b' : '#f8fafc',
                    }}
                  />
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend / Metrics Grid Breakdown */}
        <div className={`grid grid-cols-3 sm:grid-cols-6 gap-2 pt-3 mt-3 border-t text-[11px] font-mono text-center ${
          mode === 'document' ? 'border-slate-200' : 'border-slate-800'
        }`}>
          {chartData.map((item) => (
            <div
              key={item.name}
              className={`p-2 rounded border ${
                mode === 'document'
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 mb-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: item.fill }}
                />
                <span className={`font-bold ${mode === 'document' ? 'text-slate-900' : 'text-slate-100'}`}>
                  {item.name}
                </span>
              </div>
              <span className={`font-bold text-xs block ${
                item.name === bestAlgo.name ? 'text-emerald-600' : mode === 'document' ? 'text-slate-800' : 'text-slate-200'
              }`}>
                {item.totalSeek} cyl
              </span>
              <span className="text-[10px] text-slate-500 block">
                Avg: {item.avgSeek} cyl
              </span>
              <span className={`text-[9px] font-bold block ${
                item.reduction > 0 ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                {item.reduction > 0 ? `-${item.reduction}%` : 'Baseline'}
              </span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
