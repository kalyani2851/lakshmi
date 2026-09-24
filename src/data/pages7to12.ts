import type { PageData } from './pages1to6';

export const pages7to12: PageData[] = [
  {
    pageNumber: 7,
    sectionId: "sec3_cont",
    sectionNumber: "3",
    headerTitle: "3. Tools Used (Continued)",
    title: "3. TOOLS AND TECHNOLOGIES USED (CONTD.)",
    subTitle: "Client-Side Graphics, Networking & Architectural Summary",
    paragraphs: [
      "The client-side architecture leverages modern browser primitives to deliver fluid 60 FPS graphical rendering and asynchronous network dispatch without third-party chart dependencies."
    ],
    subsections: [
      {
        num: "3.5",
        title: "HTML5 Canvas (2D Rendering Context)",
        content: [
          "• What it is: The HTML5 <canvas> element provides an immediate-mode 2D pixel-level raster surface scriptable via JavaScript.",
          "• Why it is used: Unlike SVG or CSS DOM elements that degrade when animating multiple lines and nodes, Canvas provides hardware-accelerated, flicker-free rendering of continuous geometric trajectories and coordinate grids.",
          "• Contribution to project: Visualizes the disk head path across cylinders (X-axis) and sequence steps (Y-axis), supporting high-DPI (Retina) scaling via window.devicePixelRatio."
        ]
      },
      {
        num: "3.6",
        title: "JavaScript ES6+ (Client Application Controller)",
        content: [
          "• What it is: Modern ECMAScript 6+ standard offering async/await syntax, arrow functions, modules, and DOM APIs.",
          "• Why it is used: Provides interactive DOM manipulation, handles user input parsing, coordinates the animation frame loop, and calculates canvas coordinate mapping.",
          "• Contribution to project: Implemented in app.js, serving as the bridge between user events, backend HTTP calls, and the Canvas rendering engine."
        ]
      },
      {
        num: "3.7",
        title: "Fetch API (Native Asynchronous HTTP Client)",
        content: [
          "• What it is: A native browser promise-based interface for fetching network resources across the web.",
          "• Why it is used: Eliminates the need for bloated external libraries like Axios, providing clean, asynchronous POST requests with native JSON serialization.",
          "• Contribution to project: Dispatches simulation requests from app.js to http://127.0.0.1:8000/simulate and streams back parsed response objects."
        ]
      },
      {
        num: "3.8",
        title: "Tailwind CSS (Utility-First Styling Framework)",
        content: [
          "• What it is: A utility-first CSS framework providing composable utility classes for building modern, responsive user interfaces directly in markup.",
          "• Why it is used: Enables clean dark-mode interfaces, rapid layout prototyping with CSS Grid and Flexbox, and standardized typography with minimal stylesheet bloat.",
          "• Contribution to project: Styles all input controls, cards, metric badges, responsive breakpoints, and custom print rules."
        ]
      },
      {
        num: "3.9",
        title: "Pydantic (Data Validation & Modeling)",
        content: [
          "• What it is: Python's standard data parsing and validation library using type annotations.",
          "• Why it is used: Enforces strict data types, bounds checking (e.g., initial head >= 0), and automatic deserialization of client payloads.",
          "• Contribution to project: Defines SimulationRequest and SimulationResponse schemas in main1.py, rejecting malformed queues with explicit 400 errors."
        ]
      },
      {
        num: "3.10",
        title: "Development Environment & VS Code",
        content: [
          "• Visual Studio Code was used as the integrated development environment, providing Python virtual environment management, TypeScript intellisense, and live server previews."
        ]
      }
    ]
  },
  {
    pageNumber: 8,
    sectionId: "sec4",
    sectionNumber: "4",
    headerTitle: "4. Theory / Description",
    title: "4. THEORY / DESCRIPTION ABOUT THE PROJECT",
    subTitle: "Disk Geometry, Seek Mechanics, and Mathematical Foundation",
    paragraphs: [
      "To rigorously analyze disk scheduling, one must understand physical disk geometry. A hard disk contains circular platters coated with magnetic material. Platters are divided into concentric rings called tracks. A set of matching tracks across all platters vertically aligned is called a cylinder. Each track is partitioned into sectors (typically 512 bytes or 4 KB).",
      "When an I/O request specifies a sector address, the operating system translates the logical block address (LBA) into a physical cylinder, head, and sector (CHS) coordinate. The physical read/write head must mechanically move to that cylinder before any magnetic transfer can occur."
    ],
    subsections: [
      {
        num: "4.0.1",
        title: "Mathematical Formulation of Total Head Movement",
        content: [
          "The primary objective metric evaluated across all disk scheduling algorithms is Total Head Movement (also termed Total Seek Distance, D). It represents the cumulative physical tracks traversed by the read/write head to service an entire queue of requests.",
          "Let T_0 represent the initial head position, and let the ordered sequence of serviced cylinder positions be denoted by:",
          "Sequence = [T_0, T_1, T_2, T_3, ..., T_N]",
          "where N is the total number of serviced requests in the queue.",
          "The Total Head Movement (D) is mathematically defined as:",
          "D = Σ [from i=1 to N] | T_i - T_{i-1} |",
          "Where:",
          "• D: Total Seek Distance (expressed in units of cylinders or tracks).",
          "• T_i: The cylinder/track position serviced at step i.",
          "• T_{i-1}: The cylinder/track position serviced at the immediately preceding step i-1.",
          "• | T_i - T_{i-1} |: The absolute seek distance traversed between consecutive servicing steps.",
          "The Average Seek Length (L_avg) is given by:",
          "L_avg = D / N",
          "Lower values of D and L_avg directly correlate with reduced mechanical wear, lower average I/O latency, and higher disk throughput."
        ]
      },
      {
        num: "4.0.2",
        title: "Overview of Evaluated Algorithms",
        content: [
          "The project comprehensively evaluates six primary disk scheduling algorithms categorized into three algorithmic paradigms:",
          "1. Arrival-Order Schedulers: First-Come, First-Served (FCFS).",
          "2. Greedy Proximity Schedulers: Shortest Seek Time First (SSTF).",
          "3. Sweep & Elevator Schedulers: SCAN, C-SCAN, LOOK, and C-LOOK."
        ]
      }
    ]
  },
  {
    pageNumber: 9,
    sectionId: "sec4_fcfs_sstf",
    sectionNumber: "4",
    headerTitle: "4. Theory: FCFS & SSTF",
    title: "4. THEORY: FCFS AND SSTF ALGORITHMS",
    subTitle: "Arrival-Order and Greedy Proximity Schedulers",
    paragraphs: [
      "This section details the theoretical principles, step-by-step operation, advantages, limitations, and simulator implementation for FCFS and SSTF."
    ],
    subsections: [
      {
        num: "4.1",
        title: "FCFS (First-Come, First-Served)",
        content: [
          "• Definition: FCFS is the simplest disk scheduling algorithm. It services I/O requests strictly in the exact order in which they arrive in the I/O queue.",
          "• Working Principle: Non-preemptive and completely agnostic to the current physical cylinder position of the disk head. Requests form a standard FIFO queue.",
          "• Step-by-Step Working: 1) Head starts at initial position T_0; 2) Read next request T_1 from front of FIFO queue; 3) Move head to T_1 and compute |T_1 - T_0|; 4) Repeat sequentially until queue is exhausted.",
          "• Direction Behavior: Direction changes erratically back and forth with each request.",
          "• Advantages: Complete fairness; zero possibility of process starvation; trivial implementation complexity.",
          "• Limitations: Extremely high total head movement (e.g. 643 tracks on standard queue); prone to severe actuator thrashing; poor average seek length.",
          "• Project Implementation: Implemented in run_fcfs() in main1.py by directly appending the request queue to the initial head position."
        ]
      },
      {
        num: "4.2",
        title: "SSTF (Shortest Seek Time First)",
        content: [
          "• Definition: SSTF selects the pending request that is physically closest to the current head position, minimizing seek time for each immediate step.",
          "• Working Principle: Greedy local optimization. From current cylinder T_curr, it evaluates min(|T_req - T_curr|) across all pending unserviced requests.",
          "• Step-by-Step Working: 1) Initialize head at T_0; 2) Scan all unserviced requests in remaining set; 3) Identify request T_k having minimum |T_k - T_curr|; 4) Move head to T_k, remove T_k from remaining set; 5) Repeat until set is empty.",
          "• Direction Behavior: Dynamically changes direction toward whichever request is physically nearest.",
          "• Advantages: Substantial reduction in total seek distance compared to FCFS (e.g., 236 vs 643 tracks); improves average response time.",
          "• Limitations: Prone to starvation! If requests continuously arrive near the current head position, distant requests on inner or outer cylinders may never be serviced (high response time variance).",
          "• Project Implementation: Implemented in run_sstf() in main1.py using a greedy distance loop over the remaining request list."
        ]
      }
    ]
  },
  {
    pageNumber: 10,
    sectionId: "sec4_scan_cscan",
    sectionNumber: "4",
    headerTitle: "4. Theory: SCAN & C-SCAN",
    title: "4. THEORY: SCAN AND C-SCAN ALGORITHMS",
    subTitle: "Elevator and Circular Boundary-Sweeping Schedulers",
    paragraphs: [
      "To overcome the starvation hazard of SSTF while retaining high throughput, elevator-style algorithms constrain head travel along continuous directional sweeps."
    ],
    subsections: [
      {
        num: "4.3",
        title: "SCAN (Elevator Algorithm)",
        content: [
          "• Definition: The SCAN algorithm moves the disk head in a single chosen direction, servicing all pending requests encountered along the way, until it hits the physical boundary of the disk (track 0 or disk_size - 1). At the boundary, it reverses direction and sweeps back.",
          "• Working Principle: Mirrors a commercial building elevator that travels up to the highest floor servicing passenger requests, then travels downward.",
          "• Step-by-Step Working (Right direction): 1) Partition requests into those >= head and < head; 2) Sort right requests ascending and left requests descending; 3) Service right requests until max track (e.g., 199) is reached; 4) Reverse direction and service descending left requests.",
          "• Direction Behavior: Monotonic sweep up to disk boundary, then monotonic sweep down.",
          "• Advantages: Prevents starvation; provides bounded wait times; significantly lower seek overhead than FCFS.",
          "• Limitations: Requests immediately behind the head must wait for a full sweep up to the boundary and back. Unequal waiting distribution favoring center cylinders.",
          "• Project Implementation: Implemented in run_scan() in main1.py, enforcing boundary traversal to disk_size - 1 or track 0."
        ]
      },
      {
        num: "4.4",
        title: "C-SCAN (Circular SCAN)",
        content: [
          "• Definition: C-SCAN restricts request servicing to a single direction only. When it reaches the disk boundary, it immediately returns to the opposite boundary track without servicing any requests on the return trip, then restarts its sweep.",
          "• Working Principle: Treats cylinder tracks as a circular continuous ribbon. The return trip is an ultra-fast continuous slew.",
          "• Step-by-Step Working (Right direction): 1) Service requests >= head ascending; 2) Reach upper boundary (199); 3) Jump directly to lower boundary (track 0); 4) Resume ascending sweep, servicing requests < head ascending.",
          "• Direction Behavior: Strictly unidirectional servicing with an instantaneous non-servicing reset sweep.",
          "• Advantages: More uniform waiting time distribution than SCAN; eliminates bias toward middle cylinders; prevents new requests from starving older ones.",
          "• Limitations: Incurs additional seek overhead for the long boundary-to-boundary reset jump (0 to 199).",
          "• Project Implementation: Implemented in run_cscan() in main1.py, explicitly recording boundary markers 199 and 0."
        ]
      }
    ]
  },
  {
    pageNumber: 11,
    sectionId: "sec4_look_clook",
    sectionNumber: "4",
    headerTitle: "4. Theory: LOOK & C-LOOK",
    title: "4. THEORY: LOOK AND C-LOOK ALGORITHMS",
    subTitle: "Optimized Edge-Reversal Schedulers",
    paragraphs: [
      "Standard SCAN and C-SCAN suffer from redundant travel because they sweep all the way to the extreme physical disk boundaries (0 and disk_size - 1) even when no pending requests exist at those boundaries. LOOK and C-LOOK optimize this behavior by inspecting ('looking') ahead."
    ],
    subsections: [
      {
        num: "4.5",
        title: "LOOK Algorithm",
        content: [
          "• Definition: Practical version of SCAN that reverses direction immediately after servicing the furthest pending request in the current direction, without traveling to the unrequested disk boundary.",
          "• Working Principle: The head looks ahead in the current travel vector; if no further requests exist ahead, it reverses immediately.",
          "• Step-by-Step Working (Right direction): 1) Head at initial position (e.g. 50); 2) Service requests >= 50 ascending up to the highest pending cylinder (e.g. 183 instead of 199); 3) Reverse direction at 183; 4) Service requests < 50 descending.",
          "• Direction Behavior: Sweeps outward to max requested cylinder, reverses, sweeps inward to min requested cylinder.",
          "• Advantages: Eliminates wasted cylinder travel to empty edges (e.g., saves 16 tracks between 183 and 199); produces lower seek distance than SCAN (291 vs 334 tracks).",
          "• Limitations: Slightly more complex bookkeeping to monitor pending request extremes.",
          "• Project Implementation: Implemented in run_look() in main1.py without injecting boundary values."
        ]
      },
      {
        num: "4.6",
        title: "C-LOOK (Circular LOOK)",
        content: [
          "• Definition: Practical version of C-SCAN that only travels as far as the highest pending request in the servicing direction, then jumps directly to the lowest pending request on the disk without touching boundary tracks 0 or 199.",
          "• Working Principle: Combines the uniform waiting time advantage of circular scanning with the edge-optimization of LOOK.",
          "• Step-by-Step Working (Right direction): 1) Service requests >= head ascending to max request (183); 2) Jump directly to minimum pending request (14); 3) Service remaining requests between 14 and initial head ascending (37).",
          "• Direction Behavior: Unidirectional servicing from min request to max request, with an optimized circular jump from max to min.",
          "• Advantages: Highly uniform response times; substantially lower seek than C-SCAN (322 vs 385 tracks); industry standard in modern storage controllers.",
          "• Limitations: Requires real-time sorting and indexing of queue extremes.",
          "• Project Implementation: Implemented in run_clook() in main1.py."
        ]
      }
    ]
  },
  {
    pageNumber: 12,
    sectionId: "sec5",
    sectionNumber: "5",
    headerTitle: "5. Functionality / Explanation",
    title: "5. FUNCTIONALITY / EXPLANATION",
    subTitle: "System Modules, Architectural Workflow, and Communication",
    paragraphs: [
      "The Disk Scheduling Simulator is structured into decoupled functional modules designed around a robust client-server paradigm. The architecture separates input gathering and visual rendering (frontend) from algorithmic validation and mathematical evaluation (backend).",
      "The following subsections explain each functional module in detail."
    ],
    subsections: [
      {
        num: "5.1",
        title: "Input Module",
        content: [
          "Located on the frontend panel, this module collects and sanitizes five critical parameters:",
          "1. Request Queue: Comma-delimited list of integer cylinder requests (e.g., 98, 183, 37, 122, 14, 124, 65, 67).",
          "2. Initial Head: Non-negative integer representing starting cylinder position (e.g., 50).",
          "3. Disk Size: Total cylinders on the virtual drive (e.g., 200, representing cylinders 0 through 199).",
          "4. Algorithm Selector: Dropdown allowing selection between FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK.",
          "5. Direction Selector: Radio options to set initial traversal vector to Right (High) or Left (Low)."
        ]
      },
      {
        num: "5.2",
        title: "Algorithm Execution Module",
        content: [
          "Hosted within main1.py, this module receives the validated request payload and executes the chosen mathematical algorithm. It computes the exact sequence order, records every transitional seek distance, and outputs the completed trajectory list."
        ]
      },
      {
        num: "5.3",
        title: "Backend Processing Module (FastAPI REST)",
        content: [
          "• Endpoint: POST /simulate",
          "• Validation: Checks that initial_head < disk_size and that all request cylinders lie strictly within [0, disk_size - 1].",
          "• Calculation: Runs compute_total_seek() to calculate D = Σ |T_i - T_{i-1}| and L_avg = D / N.",
          "• Response: Returns a structured JSON payload containing the ordered sequence, total seek distance, average seek length, and step-by-step breakdown."
        ]
      },
      {
        num: "5.4",
        title: "Frontend Module & Fetch Dispatcher",
        content: [
          "Constructed with HTML5, Tailwind CSS, and ES6 JavaScript. The handleRunSimulation() function asynchronously dispatches JSON payloads to the FastAPI endpoint, handles network errors gracefully, and unpacks the returned metrics to update the user interface."
        ]
      }
    ]
  }
];
