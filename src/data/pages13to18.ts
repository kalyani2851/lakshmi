import type { PageData } from './pages1to6';

export const pages13to18: PageData[] = [
  {
    pageNumber: 13,
    sectionId: "sec5_cont",
    sectionNumber: "5",
    headerTitle: "5. Functionality (Continued)",
    title: "5. FUNCTIONALITY / EXPLANATION (CONTD.)",
    subTitle: "Visualization Engine, Metrics Cards, and Client-Server Decoupled Flow",
    paragraphs: [
      "The client-side rendering pipeline delivers real-time pedagogical feedback by converting raw cylinder integers into an interactive 2D trajectory animation alongside responsive metric cards."
    ],
    subsections: [
      {
        num: "5.5",
        title: "Visualization Module (HTML5 Canvas 2D in app.js)",
        content: [
          "• Dynamic Scaling & High-DPI Adaptation: resizeCanvas() computes rect = canvas.parentElement.getBoundingClientRect() and sets canvas.width = rect.width * window.devicePixelRatio, scaling the 2D context to guarantee crisp vector sharpness on Retina and high-resolution displays.",
          "• Platter Cylinder Mapping: Tracks are mapped along the horizontal axis X from 0 to disk_size - 1 across drawWidth = width - 2 * padding. Vertical axis Y plots sequential servicing steps from top (0) to bottom (seq.length - 1).",
          "• Background Grid Divisions: Vertical dashed guide lines are drawn across 5 equal divisions with track values (0, 40, 80, 120, 160, 199 for diskSize=200).",
          "• Polyline Trajectory: Drawn with ctx.strokeStyle = '#6366f1' and lineWidth = 2.5. Interpolation segment uses segmentProgress = (progress * totalSegments) - currentSegment for smooth head motion.",
          "• Trajectory Nodes: Initial head cylinder (index 0) is emphasized with color #f43f5e (rose); subsequent serviced cylinder requests are highlighted in #38bdf8 (sky blue)."
        ]
      },
      {
        num: "5.6",
        title: "Metrics Container Module (updateMetricsUI in app.js)",
        content: [
          "• Dynamic Grid of Metric Cards: For each algorithm returned by the backend, an interactive card is injected into #metricsContainer displaying Algorithm Name, Total Seek Distance (cyl), Average Seek Length (cyl), and full Serviced Trajectory Sequence.",
          "• Interactive Selection: Clicking any algorithm card activates it (selectedAlgo = key), highlighting its card border with indigo glow (border-indigo-500 shadow-lg) and instantly updating the canvas trajectory.",
          "• Active Algorithm Label: Synchronizes #activeAlgoLabel with the active algorithm identifier."
        ]
      },
      {
        num: "5.7",
        title: "Animation & Timeline Controls (playBtn & resetBtn)",
        content: [
          "• Play/Pause Toggle (#playBtn): Managed via requestAnimationFrame(step). Toggles between play and pause icons (<i class='fa-solid fa-play'></i> and <i class='fa-solid fa-pause'></i>). Advances progress by 0.005 per tick.",
          "• Reset Control (#resetBtn): Halts active animation loop, resets progress = 0, reverts icon to play, and redraws the initial trajectory state.",
          "• Replay on Completion: When progress reaches 1.0, animation cleanly stops; pressing Play restarts smoothly from progress = 0."
        ]
      }
    ]
  },
  {
    pageNumber: 14,
    sectionId: "sec6",
    sectionNumber: "6",
    headerTitle: "6. Procedure",
    title: "6. PROCEDURE",
    subTitle: "Step-by-Step Execution Workflow (Steps 1 to 8)",
    paragraphs: [
      "The following standardized laboratory procedure guides students and evaluators through running simulations on the project codebase.",
      "The standardized benchmark configuration: Request Queue = [98, 183, 37, 122, 14, 124, 65, 67], Initial Head Position = 50, Disk Size = 200 (cylinders 0–199), Direction = right (Towards High)."
    ],
    subsections: [
      {
        num: "6.1",
        title: "Initial Setup and Parameter Entry (Steps 1 to 8)",
        content: [
          "Step 1: Launch Backend Server: Open terminal in the project directory containing main1.py. Execute: 'uvicorn main1:app --host 127.0.0.1 --port 8000 --reload'. Ensure status outputs Application startup complete at http://127.0.0.1:8000.",
          "Step 2: Launch Frontend Application: Open index.html in Google Chrome, Mozilla Firefox, or Microsoft Edge. Verify the top header displays 'Disk Scheduling Visualizer' with badge 'FastAPI Connected'.",
          "Step 3: Enter Request Queue: In the input field (id='requests'), enter comma-separated track integers: '98, 183, 37, 122, 14, 124, 65, 67'. Spaces around commas are cleanly parsed by app.js.",
          "Step 4: Enter Initial Head Cylinder: In input field (id='head'), enter '50'.",
          "Step 5: Enter Disk Capacity: In input field (id='diskSize'), enter '200', establishing cylinder boundaries from 0 to 199.",
          "Step 6: Select Algorithm Option: From the dropdown (id='algorithm'), choose 'ALL' (Compare All) to evaluate all six algorithms simultaneously, or select an individual algorithm (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK).",
          "Step 7: Choose Head Movement Direction: Under 'Head Direction', select radio button 'right' (Towards High) or 'left' (Towards 0).",
          "Step 8: Trigger Execution: Click the primary button 'Run Simulation' (type='submit'). This dispatches form submit event listener in app.js."
        ]
      }
    ]
  },
  {
    pageNumber: 15,
    sectionId: "sec6_cont",
    sectionNumber: "6",
    headerTitle: "6. Procedure (Continued)",
    title: "6. PROCEDURE (CONTD.)",
    subTitle: "Backend Evaluation & System Architecture (Steps 9 to 16)",
    paragraphs: [
      "Upon form submission, execution flows across the asynchronous HTTP boundary, executes validation, evaluates scheduling algorithms, and returns computed metrics to the visualization engine."
    ],
    subsections: [
      {
        num: "6.2",
        title: "Execution, Calculation & Visualization Steps (Steps 9 to 16)",
        content: [
          "Step 9: Network Dispatch via Fetch API: app.js captures submit event, extracts values, builds JSON payload { algorithm, requests, head, disk_size, direction }, and calls fetch('http://127.0.0.1:8000/simulate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).",
          "Step 10: Server-Side Validation: FastAPI parses payload into SimulationRequest Pydantic model. Validates non-empty queue, head within [0, disk_size-1], and all request cylinders within [0, disk_size-1]. Returns HTTP 400 with descriptive detail if invalid.",
          "Step 11: Algorithm Computation: Server iterates through target algorithms. Invokes run_fcfs, run_sstf, run_scan, run_cscan, run_look, or run_clook, determining exact head trajectory sequence.",
          "Step 12: Metric Derivation: Server invokes compute_total_seek(seq), computing total seek distance D and average seek length L_avg = round(total_seek / len(requests), 2).",
          "Step 13: JSON Response Delivery: Server returns dictionary results[algo] with sequence, total_seek, and avg_seek.",
          "Step 14: Dynamic Card Construction: app.js unpacks JSON, clears #metricsContainer, and generates cards for all computed algorithms.",
          "Step 15: Canvas Animation Trigger: selectedAlgo is set, progress is initialized to 0, isPlaying is set to true, and startAnimation() initiates requestAnimationFrame() loop.",
          "Step 16: Interactive Inspection: User clicks alternate algorithm cards to compare trajectories or uses Play/Pause/Reset buttons to observe head motion step-by-step."
        ]
      },
      {
        num: "6.3",
        title: "Complete Client-Server Architecture Diagram",
        content: [
          "+-------------------------------------------------------------------------+",
          "|                         CLIENT BROWSER (index.html)                     |",
          "|  [simForm Inputs] -> requests: [98, 183..], head: 50, diskSize: 200     |",
          "|  [DOM Event]      -> simForm.addEventListener('submit')                 |",
          "+-----------------------------------+-------------------------------------+",
          "                                    | HTTP POST http://127.0.0.1:8000/simulate",
          "                                    v",
          "+-------------------------------------------------------------------------+",
          "|                      FASTAPI SERVER (main1.py:8000)                     |",
          "|  1. SimulationRequest Validation (Pydantic BaseModel)                   |",
          "|  2. Algorithm Execution: run_fcfs, run_sstf, run_scan, run_look...     |",
          "|  3. Seek Calculations: D = Sum(|seq[i+1]-seq[i]|), avg_seek=D/N         |",
          "|  4. Response: { [algo]: { sequence, total_seek, avg_seek } }           |",
          "+-----------------------------------+-------------------------------------+",
          "                                    | HTTP 200 JSON Response",
          "                                    v",
          "+-------------------------------------------------------------------------+",
          "|                   CLIENT VISUALIZATION ENGINE (app.js)                  |",
          "|  1. updateMetricsUI() -> Injects interactive cards in #metricsContainer |",
          "|  2. renderChart()     -> Draws High-DPI 2D Trajectory on #diskCanvas    |",
          "|  3. startAnimation()  -> Smooth 60 FPS interpolation with Play/Pause    |",
          "+-------------------------------------------------------------------------+"
        ]
      }
    ]
  },
  {
    pageNumber: 16,
    sectionId: "sec7_backend",
    sectionNumber: "7",
    headerTitle: "7. Source Code: Backend",
    title: "7. SOURCE CODE: 7.1 BACKEND ENGINE (main1.py)",
    subTitle: "FastAPI REST Server, Pydantic Request Models & Algorithmic Routines",
    paragraphs: [
      "The complete, authentic backend service implemented in main1.py using Python 3, FastAPI, and Pydantic. It provides strict input validation and mathematically models all six disk scheduling algorithms."
    ],
    subsections: [
      {
        num: "7.1",
        title: "Core Modules in main1.py",
        content: [
          "• FastAPI Initialization & CORS: Enables CORSMiddleware to allow cross-origin communication from local and remote client frontends.",
          "• SimulationRequest Schema: Pydantic model enforcing typing for algorithm (Literal['ALL', 'FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK']), requests (List[int]), head (int), disk_size (int), and direction (Literal['left', 'right']).",
          "• Seek Time Computation: compute_total_seek(seq) computes D = sum(abs(seq[i+1] - seq[i]) for i in range(len(seq)-1)).",
          "• Scheduling Implementations: run_fcfs(), run_sstf(), run_scan(), run_cscan(), run_look(), and run_clook().",
          "• POST /simulate Endpoint: Orchestrates validation, executes algorithms, calculates avg_seek = round(total_seek / len(requests), 2), and returns dictionary."
        ]
      }
    ]
  },
  {
    pageNumber: 17,
    sectionId: "sec7_frontend",
    sectionNumber: "7",
    headerTitle: "7. Source Code: Frontend",
    title: "7. SOURCE CODE: 7.2 CLIENT INTERFACE (index.html)",
    subTitle: "Semantic Markup, Responsive Tailwind Grid & Canvas Viewport",
    paragraphs: [
      "The client interface is implemented in index.html utilizing semantic HTML5 and Tailwind CSS. The responsive layout organizes user input controls into a dedicated sidebar and dedicates the primary workspace to the trajectory canvas and metrics grid."
    ],
    subsections: [
      {
        num: "7.2",
        title: "Layout Structure in index.html",
        content: [
          "• Header: Brand header featuring disk drive icon (<i class='fa-solid fa-hard-drive'></i>) and 'FastAPI Connected' badge.",
          "• Sidebar Form (simForm): Input fields for requests, head, diskSize, algorithm dropdown (with 'Compare All' mode), and left/right direction radio toggles.",
          "• Submit & Animation Controls: 'Run Simulation' button and Play/Pause (#playBtn) and Reset (#resetBtn) control buttons.",
          "• Visualizer Section: High-DPI trajectory viewport housing <canvas id='diskCanvas'> with active algorithm indicator (#activeAlgoLabel).",
          "• Metrics Container (#metricsContainer): Responsive grid displaying multi-algorithm comparison cards with total seek, average seek, and traversal sequences."
        ]
      }
    ]
  },
  {
    pageNumber: 18,
    sectionId: "sec7_controller",
    sectionNumber: "7",
    headerTitle: "7. Source Code: Styles & Controller",
    title: "7. SOURCE CODE: 7.3 STYLESHEET (styles.css) & 7.4 CONTROLLER (app.js)",
    subTitle: "Canvas Display Rules, Asynchronous Network Dispatch & 60 FPS Trajectory Loop",
    paragraphs: [
      "styles.css enforces responsive canvas constraints and sleek scrollbar aesthetics. app.js handles asynchronous communication with FastAPI, updates dynamic DOM cards, and executes the 60 FPS trajectory interpolation loop."
    ],
    subsections: [
      {
        num: "7.3",
        title: "Styling Highlights in styles.css",
        content: [
          "• Canvas Display: Full 100% width and height constraints ensuring proper bounding box calculations during canvas resizing.",
          "• Custom Scrollbar: Custom Webkit scrollbar rules (#metricsContainer::-webkit-scrollbar) ensuring seamless scrolling on high-density metric comparisons."
        ]
      },
      {
        num: "7.4",
        title: "Key Functions in app.js",
        content: [
          "• resizeCanvas(): Dynamically matches canvas resolution to device pixel density (window.devicePixelRatio) to avoid raster blur.",
          "• simForm Submit Handler: Extracts input values, validates numbers, and executes fetch('http://127.0.0.1:8000/simulate').",
          "• updateMetricsUI(): Dynamically renders metric cards for all returned algorithms with active selection click handlers.",
          "• renderChart(): Clears canvas, renders vertical dashed gridlines, constructs trajectory polylines (#6366f1), and draws color-coded nodes (#f43f5e for head, #38bdf8 for requests).",
          "• startAnimation() & step(): Drives recursive requestAnimationFrame() advancing progress by 0.005 for smooth interpolation."
        ]
      }
    ]
  }
];
