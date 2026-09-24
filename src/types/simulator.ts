export type AlgorithmType = 'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN' | 'LOOK' | 'C-LOOK';
export type DirectionType = 'Right' | 'Left';

export interface SimulationRequest {
  requests: number[];
  initial_head: number;
  disk_size: number;
  algorithm: AlgorithmType;
  direction: DirectionType;
}

export interface SimulationStep {
  from: number;
  to: number;
  distance: number;
}

export interface SimulationResult {
  algorithm: AlgorithmType;
  sequence: number[];
  total_seek: number;
  average_seek: number;
  steps: SimulationStep[];
  execution_time_ms?: number;
}

export interface ComparisonResult {
  algorithm: AlgorithmType;
  sequence: number[];
  total_seek: number;
  average_seek: number;
  efficiency_rank: number;
}

export interface TestCase {
  id: string;
  category: string;
  condition: string;
  expectedResult: string;
  actualResult: string;
  status: 'Passed' | 'Verified' | 'To be recorded';
}
