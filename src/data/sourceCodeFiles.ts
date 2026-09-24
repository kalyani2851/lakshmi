export const main1PyCode = `from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Literal

app = FastAPI(title="Disk Scheduling API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulationRequest(BaseModel):
    algorithm: Literal["ALL", "FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"]
    requests: List[int] = Field(..., example=[98, 183, 37, 122, 14, 124, 65, 67])
    head: int = Field(..., example=50)
    disk_size: int = Field(..., example=200)
    direction: Literal["left", "right"] = Field(..., example="right")

def compute_total_seek(seq: List[int]) -> int:
    return sum(abs(seq[i + 1] - seq[i]) for i in range(len(seq) - 1))

def run_fcfs(requests: List[int], head: int) -> List[int]:
    return [head] + requests

def run_sstf(requests: List[int], head: int) -> List[int]:
    seq = [head]
    reqs = list(requests)
    curr = head
    while reqs:
        closest = min(reqs, key=lambda x: abs(x - curr))
        seq.append(closest)
        curr = closest
        reqs.remove(closest)
    return seq

def run_scan(requests: List[int], head: int, disk_size: int, direction: str) -> List[int]:
    seq = [head]
    left = sorted([r for r in requests if r < head])
    right = sorted([r for r in requests if r >= head])

    if direction == "right":
        seq.extend(right)
        if left:
            seq.append(disk_size - 1)
            seq.extend(reversed(left))
    else:
        seq.extend(reversed(left))
        if right:
            seq.append(0)
            seq.extend(right)
    return seq

def run_cscan(requests: List[int], head: int, disk_size: int, direction: str) -> List[int]:
    seq = [head]
    left = sorted([r for r in requests if r < head])
    right = sorted([r for r in requests if r >= head])

    if direction == "right":
        seq.extend(right)
        if left:
            seq.append(disk_size - 1)
            seq.append(0)
            seq.extend(left)
    else:
        seq.extend(reversed(left))
        if right:
            seq.append(0)
            seq.append(disk_size - 1)
            seq.extend(reversed(right))
    return seq

def run_look(requests: List[int], head: int, direction: str) -> List[int]:
    seq = [head]
    left = sorted([r for r in requests if r < head])
    right = sorted([r for r in requests if r >= head])

    if direction == "right":
        seq.extend(right)
        seq.extend(reversed(left))
    else:
        seq.extend(reversed(left))
        seq.extend(right)
    return seq

def run_clook(requests: List[int], head: int, direction: str) -> List[int]:
    seq = [head]
    left = sorted([r for r in requests if r < head])
    right = sorted([r for r in requests if r >= head])

    if direction == "right":
        seq.extend(right)
        seq.extend(left)
    else:
        seq.extend(reversed(left))
        seq.extend(reversed(right))
    return seq

@app.post("/simulate")
def simulate(data: SimulationRequest) -> Dict[str, Any]:
    # Validations
    if not data.requests:
        raise HTTPException(status_code=400, detail="Request queue cannot be empty.")
    if data.head < 0 or data.head >= data.disk_size:
        raise HTTPException(status_code=400, detail=f"Head position must be between 0 and {data.disk_size - 1}.")
    if any(r < 0 or r >= data.disk_size for r in data.requests):
        raise HTTPException(status_code=400, detail=f"Requests must be within range 0 to {data.disk_size - 1}.")

    algos = ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"] if data.algorithm == "ALL" else [data.algorithm]
    results = {}

    for algo in algos:
        if algo == "FCFS":
            seq = run_fcfs(data.requests, data.head)
        elif algo == "SSTF":
            seq = run_sstf(data.requests, data.head)
        elif algo == "SCAN":
            seq = run_scan(data.requests, data.head, data.disk_size, data.direction)
        elif algo == "C-SCAN":
            seq = run_cscan(data.requests, data.head, data.disk_size, data.direction)
        elif algo == "LOOK":
            seq = run_look(data.requests, data.head, data.direction)
        elif algo == "C-LOOK":
            seq = run_clook(data.requests, data.head, data.direction)

        total_seek = compute_total_seek(seq)
        results[algo] = {
            "sequence": seq,
            "total_seek": total_seek,
            "avg_seek": round(total_seek / len(data.requests), 2)
        }

    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
`;

export const indexHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Disk Scheduling Simulator</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome Icons CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Custom External CSS -->
    <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col font-sans">

    <!-- Header Navigation -->
    <header class="bg-slate-800 border-b border-slate-700 py-4 px-6 shadow-md">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <h1 class="text-xl font-bold tracking-wide text-indigo-400 flex items-center gap-2">
                <i class="fa-solid fa-hard-drive"></i> Disk Scheduling Visualizer
            </h1>
            <span class="text-xs bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-3 py-1 rounded-full">
                FastAPI Connected
            </span>
        </div>
    </header>

    <!-- Main Workspace -->
    <main class="max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        <!-- Simulation Control Sidebar -->
        <section class="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <form id="simForm" class="space-y-4">
                <h2 class="text-lg font-semibold border-b border-slate-700 pb-2 text-slate-200">Simulation Parameters</h2>
                
                <!-- Status Alert Box -->
                <div id="statusAlert" class="hidden bg-rose-900/50 border border-rose-500 text-rose-200 text-xs p-3 rounded-lg"></div>

                <!-- Input Queue -->
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1" for="requests">Request Queue (comma-separated)</label>
                    <input type="text" id="requests" value="98, 183, 37, 122, 14, 124, 65, 67" required
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition">
                </div>

                <!-- Initial Head & Disk Capacity -->
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1" for="head">Initial Head</label>
                        <input type="number" id="head" value="50" min="0" required
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1" for="diskSize">Disk Size</label>
                        <input type="number" id="diskSize" value="200" min="1" required
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition">
                    </div>
                </div>

                <!-- Algorithm Selector -->
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1" for="algorithm">Algorithm</label>
                    <select id="algorithm" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition">
                        <option value="ALL">Compare All</option>
                        <option value="FCFS">FCFS (First-Come, First-Served)</option>
                        <option value="SSTF">SSTF (Shortest Seek Time First)</option>
                        <option value="SCAN">SCAN (Elevator)</option>
                        <option value="C-SCAN">C-SCAN (Circular SCAN)</option>
                        <option value="LOOK">LOOK</option>
                        <option value="C-LOOK">C-LOOK</option>
                    </select>
                </div>

                <!-- Direction Toggle -->
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Head Direction</label>
                    <div class="flex gap-4 bg-slate-900 p-2 rounded-lg border border-slate-700">
                        <label class="flex items-center gap-2 text-xs cursor-pointer">
                            <input type="radio" name="direction" value="left" class="accent-indigo-500"> Left (Towards 0)
                        </label>
                        <label class="flex items-center gap-2 text-xs cursor-pointer">
                            <input type="radio" name="direction" value="right" checked class="accent-indigo-500"> Right (Towards High)
                        </label>
                    </div>
                </div>

                <!-- Submit Action -->
                <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition shadow-md flex items-center justify-center gap-2 text-sm">
                    <i class="fa-solid fa-play"></i> Run Simulation
                </button>
            </form>

            <!-- Animation Controls -->
            <div class="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
                <span class="text-xs text-slate-400">Animation Controls</span>
                <div class="flex items-center gap-2">
                    <button id="resetBtn" class="bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded-lg text-xs transition">
                        <i class="fa-solid fa-rotate-left"></i>
                    </button>
                    <button id="playBtn" class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs transition">
                        <i class="fa-solid fa-pause"></i>
                    </button>
                </div>
            </div>
        </section>

        <!-- Visualization Display Area -->
        <section class="lg:col-span-2 flex flex-col gap-6">
            
            <!-- Trajectory Canvas -->
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg flex flex-col flex-1">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-sm font-semibold text-slate-300">Head Movement Trajectory</h3>
                    <span id="activeAlgoLabel" class="text-xs text-indigo-400 font-mono">--</span>
                </div>
                <div class="relative flex-1 w-full min-h-[320px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                    <canvas id="diskCanvas" class="w-full h-full block"></canvas>
                </div>
            </div>

            <!-- Algorithm Metrics Container -->
            <div id="metricsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
        </section>
    </main>

    <!-- External Client Logic -->
    <script src="app.js"></script>
</body>
</html>
`;

export const styleCssCode = `/* Canvas Constraint Styles */
canvas {
    display: block;
    width: 100%;
    height: 100%;
}

/* Metric Container Scrollbar Customization */
#metricsContainer::-webkit-scrollbar {
    width: 6px;
}
#metricsContainer::-webkit-scrollbar-track {
    background: #0f172a;
}
#metricsContainer::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
}
`;

export const appJsCode = `document.addEventListener("DOMContentLoaded", () => {
    const simForm = document.getElementById("simForm");
    const statusAlert = document.getElementById("statusAlert");
    const playBtn = document.getElementById("playBtn");
    const resetBtn = document.getElementById("resetBtn");
    const canvas = document.getElementById("diskCanvas");
    const ctx = canvas.getContext("2d");
    const metricsContainer = document.getElementById("metricsContainer");
    const activeAlgoLabel = document.getElementById("activeAlgoLabel");

    let currentResults = null;
    let animationFrameId = null;
    let progress = 0;
    let isPlaying = false;
    let selectedAlgo = null;

    // Maintain crisp high-DPI Canvas Rendering
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        if (currentResults) renderChart();
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // API Dispatch Handler
    simForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        statusAlert.classList.add("hidden");

        const rawReqs = document.getElementById("requests").value;
        const requests = rawReqs.split(",").map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        const head = parseInt(document.getElementById("head").value);
        const diskSize = parseInt(document.getElementById("diskSize").value);
        const algorithm = document.getElementById("algorithm").value;
        const direction = document.querySelector('input[name="direction"]:checked').value;

        const payload = {
            algorithm: algorithm,
            requests: requests,
            head: head,
            disk_size: diskSize,
            direction: direction
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/simulate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "An error occurred while computing.");
            }

            currentResults = await response.json();
            selectedAlgo = algorithm === "ALL" ? Object.keys(currentResults)[0] : algorithm;
            
            progress = 0;
            isPlaying = true;
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';

            updateMetricsUI();
            startAnimation();
        } catch (err) {
            statusAlert.textContent = err.message;
            statusAlert.classList.remove("hidden");
        }
    });

    // Update Metrics Display Cards
    function updateMetricsUI() {
        metricsContainer.innerHTML = "";
        const keys = Object.keys(currentResults);

        keys.forEach((key) => {
            const data = currentResults[key];
            const isSelected = key === selectedAlgo;

            const card = document.createElement("div");
            card.className = \`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between \${
                isSelected 
                ? "bg-indigo-950/40 border-indigo-500 shadow-lg" 
                : "bg-slate-800 border-slate-700 hover:border-slate-500"
            }\`;

            card.innerHTML = \`
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-bold text-sm text-slate-200">\${key}</h4>
                        \${isSelected ? '<span class="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded">Active</span>' : ''}
                    </div>
                    <div class="text-xs space-y-1 text-slate-400">
                        <p>Total Seek: <span class="text-slate-100 font-semibold">\${data.total_seek}</span> cyl</p>
                        <p>Avg Seek: <span class="text-slate-100 font-semibold">\${data.avg_seek}</span> cyl</p>
                    </div>
                </div>
                <div class="mt-3 pt-2 border-t border-slate-700/50 text-[10px] text-slate-500 font-mono truncate">
                    Seq: [\${data.sequence.join(", ")}]
                </div>
            \`;

            card.addEventListener("click", () => {
                selectedAlgo = key;
                updateMetricsUI();
                renderChart();
            });

            metricsContainer.appendChild(card);
        });

        activeAlgoLabel.textContent = selectedAlgo;
    }

    // Canvas Trajectory Renderer
    function renderChart() {
        if (!currentResults || !selectedAlgo) return;

        const seq = currentResults[selectedAlgo].sequence;
        const diskSize = parseInt(document.getElementById("diskSize").value);
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;

        const padding = 40;
        const drawWidth = width - padding * 2;
        const drawHeight = height - padding * 2;

        ctx.clearRect(0, 0, width, height);

        // Grid background lines
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= 5; i++) {
            const x = padding + (drawWidth / 5) * i;
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
        }
        ctx.stroke();

        const getX = (val) => padding + (val / (diskSize - 1)) * drawWidth;
        const getY = (idx) => padding + (idx / (seq.length - 1 || 1)) * drawHeight;

        // Path construction
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        const totalSegments = seq.length - 1;
        const currentSegment = Math.floor(progress * totalSegments);
        const segmentProgress = (progress * totalSegments) - currentSegment;

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

        // Trajectory Nodes
        for (let i = 0; i <= currentSegment && i < seq.length; i++) {
            ctx.fillStyle = i === 0 ? "#f43f5e" : "#38bdf8";
            ctx.beginPath();
            ctx.arc(getX(seq[i]), getY(i), 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Animation Loop Step
    function startAnimation() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        function step() {
            if (isPlaying && progress < 1) {
                progress += 0.005;
                if (progress > 1) progress = 1;
                renderChart();
                animationFrameId = requestAnimationFrame(step);
            } else if (progress >= 1) {
                isPlaying = false;
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            }
        }
        step();
    }

    // Playback Actions
    playBtn.addEventListener("click", () => {
        if (!currentResults) return;
        isPlaying = !isPlaying;
        playBtn.innerHTML = isPlaying 
            ? '<i class="fa-solid fa-pause"></i>' 
            : '<i class="fa-solid fa-play"></i>';
        
        if (isPlaying) {
            if (progress >= 1) progress = 0;
            startAnimation();
        }
    });

    resetBtn.addEventListener("click", () => {
        if (!currentResults) return;
        progress = 0;
        isPlaying = false;
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        renderChart();
    });
});
`;
