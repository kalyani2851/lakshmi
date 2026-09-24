import { AlgorithmType, DirectionType, SimulationResult, SimulationStep } from '../types/simulator';

export function computeTotalSeek(
  sequence: number[],
  numRequests: number
): { total: number; steps: SimulationStep[]; average: number } {
  if (sequence.length <= 1) {
    return { total: 0, steps: [], average: 0 };
  }

  let total = 0;
  const steps: SimulationStep[] = [];

  for (let i = 1; i < sequence.length; i++) {
    const from = sequence[i - 1];
    const to = sequence[i];
    const distance = Math.abs(to - from);
    total += distance;
    steps.push({ from, to, distance });
  }

  const count = numRequests > 0 ? numRequests : (sequence.length - 1);
  const average = Number((total / count).toFixed(2));

  return { total, steps, average };
}

export function runFCFS(requests: number[], initialHead: number): SimulationResult {
  const sequence = [initialHead, ...requests];
  const { total, steps, average } = computeTotalSeek(sequence, requests.length);
  return {
    algorithm: 'FCFS',
    sequence,
    total_seek: total,
    average_seek: average,
    steps,
  };
}

export function runSSTF(requests: number[], initialHead: number): SimulationResult {
  const remaining = [...requests];
  const sequence = [initialHead];
  let current = initialHead;

  while (remaining.length > 0) {
    let closestIndex = 0;
    let minDistance = Math.abs(remaining[0] - current);

    for (let i = 1; i < remaining.length; i++) {
      const dist = Math.abs(remaining[i] - current);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    current = remaining.splice(closestIndex, 1)[0];
    sequence.push(current);
  }

  const { total, steps, average } = computeTotalSeek(sequence, requests.length);
  return {
    algorithm: 'SSTF',
    sequence,
    total_seek: total,
    average_seek: average,
    steps,
  };
}

export function runSCAN(
  requests: number[],
  initialHead: number,
  diskSize: number,
  direction: DirectionType = 'Right'
): SimulationResult {
  const dirStr = direction.toLowerCase();
  const sequence = [initialHead];
  const left = requests.filter((r) => r < initialHead).sort((a, b) => a - b);
  const right = requests.filter((r) => r >= initialHead).sort((a, b) => a - b);

  if (dirStr === 'right') {
    sequence.push(...right);
    if (left.length > 0) {
      sequence.push(diskSize - 1);
      sequence.push(...[...left].reverse());
    }
  } else {
    sequence.push(...[...left].reverse());
    if (right.length > 0) {
      sequence.push(0);
      sequence.push(...right);
    }
  }

  const { total, steps, average } = computeTotalSeek(sequence, requests.length);
  return {
    algorithm: 'SCAN',
    sequence,
    total_seek: total,
    average_seek: average,
    steps,
  };
}

export function runCSCAN(
  requests: number[],
  initialHead: number,
  diskSize: number,
  direction: DirectionType = 'Right'
): SimulationResult {
  const dirStr = direction.toLowerCase();
  const sequence = [initialHead];
  const left = requests.filter((r) => r < initialHead).sort((a, b) => a - b);
  const right = requests.filter((r) => r >= initialHead).sort((a, b) => a - b);

  if (dirStr === 'right') {
    sequence.push(...right);
    if (left.length > 0) {
      sequence.push(diskSize - 1);
      sequence.push(0);
      sequence.push(...left);
    }
  } else {
    sequence.push(...[...left].reverse());
    if (right.length > 0) {
      sequence.push(0);
      sequence.push(diskSize - 1);
      sequence.push(...[...right].reverse());
    }
  }

  const { total, steps, average } = computeTotalSeek(sequence, requests.length);
  return {
    algorithm: 'C-SCAN',
    sequence,
    total_seek: total,
    average_seek: average,
    steps,
  };
}

export function runLOOK(
  requests: number[],
  initialHead: number,
  _diskSize: number,
  direction: DirectionType = 'Right'
): SimulationResult {
  const dirStr = direction.toLowerCase();
  const sequence = [initialHead];
  const left = requests.filter((r) => r < initialHead).sort((a, b) => a - b);
  const right = requests.filter((r) => r >= initialHead).sort((a, b) => a - b);

  if (dirStr === 'right') {
    sequence.push(...right);
    sequence.push(...[...left].reverse());
  } else {
    sequence.push(...[...left].reverse());
    sequence.push(...right);
  }

  const { total, steps, average } = computeTotalSeek(sequence, requests.length);
  return {
    algorithm: 'LOOK',
    sequence,
    total_seek: total,
    average_seek: average,
    steps,
  };
}

export function runCLOOK(
  requests: number[],
  initialHead: number,
  _diskSize: number,
  direction: DirectionType = 'Right'
): SimulationResult {
  const dirStr = direction.toLowerCase();
  const sequence = [initialHead];
  const left = requests.filter((r) => r < initialHead).sort((a, b) => a - b);
  const right = requests.filter((r) => r >= initialHead).sort((a, b) => a - b);

  if (dirStr === 'right') {
    sequence.push(...right);
    sequence.push(...left);
  } else {
    sequence.push(...[...left].reverse());
    sequence.push(...[...right].reverse());
  }

  const { total, steps, average } = computeTotalSeek(sequence, requests.length);
  return {
    algorithm: 'C-LOOK',
    sequence,
    total_seek: total,
    average_seek: average,
    steps,
  };
}

export function runSimulation(
  algo: AlgorithmType,
  requests: number[],
  head: number,
  diskSize: number,
  direction: DirectionType = 'Right'
): SimulationResult {
  switch (algo) {
    case 'FCFS':
      return runFCFS(requests, head);
    case 'SSTF':
      return runSSTF(requests, head);
    case 'SCAN':
      return runSCAN(requests, head, diskSize, direction);
    case 'C-SCAN':
      return runCSCAN(requests, head, diskSize, direction);
    case 'LOOK':
      return runLOOK(requests, head, diskSize, direction);
    case 'C-LOOK':
      return runCLOOK(requests, head, diskSize, direction);
    default:
      return runFCFS(requests, head);
  }
}
