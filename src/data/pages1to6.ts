export interface PageData {
  pageNumber: number;
  sectionId: string;
  sectionNumber: string;
  headerTitle: string;
  title: string;
  subTitle?: string;
  paragraphs: string[];
  subsections?: {
    num: string;
    title: string;
    content: string[];
    table?: { headers: string[]; rows: string[][] };
    boxCallout?: string;
  }[];
}

export const pages1to6: PageData[] = [
  {
    pageNumber: 1,
    sectionId: "cover",
    sectionNumber: "",
    headerTitle: "B.Tech CSE Project Documentation",
    title: "DISK SCHEDULING SIMULATOR",
    subTitle: "A Simulation and Comparative Visualization Suite for Hard Disk Secondary Storage Schedulers",
    paragraphs: [
      "A PROJECT REPORT SUBMITTED IN PARTIAL FULFILLMENT OF THE REQUIREMENTS FOR THE DEGREE OF",
      "BACHELOR OF TECHNOLOGY IN COMPUTER SCIENCE & ENGINEERING",
      "Department of Computer Science & Engineering",
      "Faculty of Engineering & Technology",
      "Academic Year: 2025 – 2026"
    ],
    subsections: [
      {
        num: "AUTHORS & SUBMISSION",
        title: "Project Credentials",
        content: [
          "Candidate Name: B.Tech CSE Student (Undergraduate Scholar)",
          "Roll Number / Registration ID: 22CSE-DS-108",
          "Course: Operating Systems Laboratory & Systems Engineering",
          "Supervisor / Project Guide: Head of Department, Computer Science & Engineering",
          "Date of Submission: September 2026",
          "Technologies: Python 3.10+, FastAPI, Uvicorn, HTML5, HTML5 Canvas 2D, JavaScript ES6+, Fetch API, Tailwind CSS"
        ]
      }
    ]
  },
  {
    pageNumber: 2,
    sectionId: "toc",
    sectionNumber: "TOC",
    headerTitle: "Table of Contents",
    title: "TABLE OF CONTENTS",
    subTitle: "Academic Project Report Concordance — 10 Required Coursework Sections",
    paragraphs: [
      "This is to certify that the project documentation titled 'DISK SCHEDULING SIMULATOR' submitted by the student in partial fulfillment of the requirements for the award of Bachelor of Technology in Computer Science and Engineering is a bonafide record of work carried out under academic supervision.",
      "The following dynamically generated Table of Contents outlines the complete 24-page report across all 10 mandatory technical sections, benchmarking evaluations, and laboratory findings."
    ],
    subsections: [
      {
        num: "TOC",
        title: "Table of Contents",
        content: [
          "1. Problem Statement ............................................................................ Pages 3–4",
          "2. Objective .................................................................................... Page 5",
          "3. Tools Used ................................................................................... Pages 6–7",
          "4. Theory / Description about the Project ........................................................ Pages 8–11",
          "5. Functionality / Explanation ................................................................. Pages 12–13",
          "6. Procedure ................................................................................... Pages 14–15",
          "7. Source Code ................................................................................. Pages 16–18",
          "8. Output Screenshots (Colour Print) ............................................................ Pages 19–20",
          "9. Test Results / Discussion ................................................................... Pages 21–22",
          "10. Future Scope ............................................................................... Page 23",
          "11. Conclusion & References .................................................................... Page 24"
        ]
      }
    ]
  },
  {
    pageNumber: 3,
    sectionId: "sec1",
    sectionNumber: "1",
    headerTitle: "1. Problem Statement",
    title: "1. PROBLEM STATEMENT",
    subTitle: "Secondary Storage Mechanical Bottlenecks and I/O Request Ordering",
    paragraphs: [
      "In modern computer systems, secondary storage devices such as Hard Disk Drives (HDDs) provide massive non-volatile capacity but remain several orders of magnitude slower than electronic semiconductor memory (SRAM caches and DRAM main memory). While CPU computational cycles are executed on the nanosecond scale (10^-9 seconds), mechanical disk input/output operations occur on the millisecond scale (10^-3 seconds), establishing a severe five-to-six order of magnitude latency disparity known in operating systems literature as the 'I/O Von Neumann Bottleneck'.",
      "A conventional Hard Disk Drive consists of one or more rotating magnetic platters mounted on a common spindle, spinning at constant angular velocities (typically 5,400 to 15,000 RPM). Data blocks are formatted into concentric tracks or cylinders. Read and write operations require an electromagnetic read/write head assembly attached to an actuator arm to mechanically sweep radially across the spinning platter to locate the specific track containing requested data blocks.",
      "The total disk access time required to fulfill any read or write request is governed by three primary physical components:",
      "Total Access Time = Seek Time (Ts) + Rotational Latency (Tr) + Transfer Time (Tt)"
    ],
    subsections: [
      {
        num: "1.1",
        title: "Components of Hard Disk Access Latency",
        content: [
          "• Seek Time (Ts): The time required for the mechanical actuator arm to accelerate, travel, and settle the read/write head directly over the destination track or cylinder. Seek time typically ranges between 3 ms to 15 ms and constitutes the single largest mechanical delay component in disk I/O.",
          "• Rotational Latency (Tr): The time elapsed waiting for the requested sector on the rotating platter to spin directly beneath the settled read/write head. For a disk spinning at 7,200 RPM, average rotational latency is approximately 4.17 ms.",
          "• Transfer Time (Tt): The electrical transmission time required to stream the raw magnetic bits from the platter into the disk controller buffer, governed by data density and spindle speed."
        ]
      },
      {
        num: "1.2",
        title: "I/O Request Queues & Inefficient Ordering Problems",
        content: [
          "In multitasking operating systems, multiple concurrent threads and processes generate asynchronous read/write requests to various sectors spread across the entire physical disk geometry. When these requests arrive faster than the disk can mechanically service them, an I/O request queue forms inside the operating system disk subsystem.",
          "If the operating system processes this queue naively—such as in First-Come, First-Served order without considering the current physical cylinder position of the disk head—the actuator arm is forced to continuously oscillate back and forth across distant tracks.",
          "This inefficient request ordering causes severe system penalties:",
          "1. Excessive Head Movement: Severe mechanical actuator oscillation leading to extreme physical travel distance and component wear.",
          "2. High Latency: I/O operations stall in the queue for tens or hundreds of milliseconds, starving pending processes.",
          "3. Degraded System Throughput: Overall system I/O throughput (megabytes per second or IOPS) collapses, causing severe system freezes and CPU wait states."
        ]
      }
    ]
  },
  {
    pageNumber: 4,
    sectionId: "sec1_cont",
    sectionNumber: "1",
    headerTitle: "1. Problem Statement (Continued)",
    title: "1. PROBLEM STATEMENT (CONTD.)",
    subTitle: "Mitigation through Disk Scheduling Simulation & Visualization",
    paragraphs: [
      "To mitigate the mechanical latency bottleneck, Operating Systems implement Disk Scheduling Algorithms. The primary responsibility of a disk scheduler is to dynamically reorder pending cylinder requests in the I/O queue so that total physical head travel (seek distance) is minimized while maintaining reasonable fairness and preventing indefinite starvation.",
      "However, understanding, evaluating, and selecting appropriate disk scheduling algorithms in computer science curricula poses significant pedagogical challenges. Students and engineers struggle to visualize how different scheduling strategies—such as greedy proximity (SSTF) versus directional sweeps (SCAN/LOOK) versus unidirectional sweeps (C-SCAN/C-LOOK)—behave under identical request patterns."
    ],
    subsections: [
      {
        num: "1.3",
        title: "How This Project Addresses the Problem",
        content: [
          "This project addresses these critical challenges by engineering an interactive, full-stack Disk Scheduling Simulator and Comparative Visualization Suite. The software system provides:",
          "1. Algorithmic Simulation: Accurate execution of the six fundamental disk scheduling algorithms: FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK.",
          "2. Quantitative Metrics: Precise mathematical calculation of Total Head Movement (Total Seek Distance, D) and Average Seek Length (D / N).",
          "3. High-Fidelity 2D Trajectory Visualization: A dedicated HTML5 Canvas engine rendering the exact spatial-temporal trajectory of the disk head across track numbers and servicing steps.",
          "4. Interactive Experimentation: Full control over request queues, initial head positions, disk capacities (e.g., 200 tracks), and movement directions (Right/High or Left/Low), complemented by real-time Play, Pause, and Reset animation controls.",
          "5. Decoupled Client-Server Architecture: A high-performance Python FastAPI REST backend delivering deterministic computations coupled with an agile JavaScript/Tailwind CSS frontend."
        ]
      },
      {
        num: "1.4",
        title: "Comparative Summary of Mechanical Overhead",
        content: [
          "The table below contrasts the mechanical implications of unscheduled versus scheduled disk operations:"
        ],
        table: {
          headers: ["Attribute", "Unscheduled / Naive (FCFS)", "Optimized Disk Schedulers"],
          rows: [
            ["Actuator Travel", "Random, oscillatory sweeps", "Optimized, monotonic or directional sweeps"],
            ["Total Seek Distance", "High (e.g., 640+ tracks on sample queue)", "Significantly reduced (230 - 380 tracks)"],
            ["Throughput (IOPS)", "Low (heavily seek-bound)", "Significantly higher sustained IOPS"],
            ["Process Wait Time", "Long, unpredictable stalls", "Bounded and predictable response times"]
          ]
        }
      }
    ]
  },
  {
    pageNumber: 5,
    sectionId: "sec2",
    sectionNumber: "2",
    headerTitle: "2. Objective",
    title: "2. OBJECTIVE",
    subTitle: "Scope, Architectural Goals, and Functional Deliverables",
    paragraphs: [
      "The primary objective of this project is to develop an interactive, academically rigorous, and computationally accurate Disk Scheduling Simulator that bridges the gap between theoretical operating system concepts and real-world mechanical storage behavior.",
      "The specific technical and educational objectives of the project are enumerated below:"
    ],
    subsections: [
      {
        num: "2.1",
        title: "Detailed Project Objectives",
        content: [
          "• Objective 1 - Algorithmic Simulation of Core Schedulers: To simulate and analyze the execution mechanics of the six primary disk scheduling algorithms: First-Come, First-Served (FCFS), Shortest Seek Time First (SSTF), SCAN (Elevator Algorithm), Circular SCAN (C-SCAN), LOOK, and Circular LOOK (C-LOOK).",
          "• Objective 2 - Quantitative Metric Evaluation: To compute exact mathematical performance metrics for each simulation run, specifically Total Head Movement (Total Seek Distance, D) and Average Seek Length per request, enabling objective comparisons.",
          "• Objective 3 - Trajectory Graph Visualization: To provide a high-resolution 2D graphical representation of disk head displacement over discrete service steps using HTML5 Canvas, visually exposing direction switches, boundary sweeps, and circular jumps.",
          "• Objective 4 - Interactive Simulation Interface: To develop a modern, user-friendly interface using HTML5 and Tailwind CSS allowing users to dynamically input custom track queues, adjust initial head positions, configure disk sizes, and select initial head directions.",
          "• Objective 5 - Play/Pause and Step Animation Controls: To implement interactive timeline controls enabling users to pause execution mid-stream, step through head movements frame-by-frame, and reset state for comprehensive visual analysis.",
          "• Objective 6 - Robust Client-Server Separation: To connect an agile JavaScript ES6+ frontend with a high-performance Python FastAPI backend via standard RESTful JSON contracts over POST /simulate, adhering to modern software engineering standards."
        ]
      },
      {
        num: "2.2",
        title: "Target Performance Benchmarks",
        content: [
          "The simulator is designed to process request queues of varying lengths (from 1 to 500+ requests) across configurable disk geometries (50 to 10,000 cylinders) with sub-10 millisecond calculation response times from the FastAPI backend."
        ]
      }
    ]
  },
  {
    pageNumber: 6,
    sectionId: "sec3",
    sectionNumber: "3",
    headerTitle: "3. Tools Used",
    title: "3. TOOLS AND TECHNOLOGIES USED",
    subTitle: "Comprehensive Technology Stack Breakdown",
    paragraphs: [
      "The Disk Scheduling Simulator is architected using a decoupled client-server technology stack. Every tool and library in the stack was intentionally selected to deliver computational accuracy, developer productivity, responsive interactivity, and clear visualization.",
      "The following subsections explain each tool in detail, including its role, justification, and contribution to the project."
    ],
    subsections: [
      {
        num: "3.1",
        title: "Python (Backend Programming Language)",
        content: [
          "• What it is: Python is a modern, high-level, interpreted programming language renowned for its expressive syntax, comprehensive standard libraries, and mathematical efficiency.",
          "• Why it is used: Python provides native arbitrary-precision integers, clean list manipulation, and intuitive sorting primitives that make implementing complex scheduling algorithms straightforward and bug-free.",
          "• Contribution to project: Houses the core algorithmic logic for FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK in main1.py, computing track sequences and seek metrics with high precision."
        ]
      },
      {
        num: "3.2",
        title: "FastAPI (Modern Python Web Framework)",
        content: [
          "• What it is: FastAPI is a modern, high-performance web framework for building RESTful APIs with Python 3.8+ based on standard Python type hints and ASGI standards.",
          "• Why it is used: It delivers execution performance on par with NodeJS and Go, offers native automatic OpenAPI/Swagger documentation, and integrates seamlessly with Pydantic for request validation.",
          "• Contribution to project: Exposes the primary POST /simulate endpoint, validates incoming JSON simulation payloads, coordinates algorithm dispatch, and returns structured metric responses."
        ]
      },
      {
        num: "3.3",
        title: "Uvicorn (Lightning-Fast ASGI Web Server)",
        content: [
          "• What it is: Uvicorn is a high-performance ASGI (Asynchronous Server Gateway Interface) web server implementation for Python, powered by uvloop and httptools.",
          "• Why it is used: It serves FastAPI applications asynchronously on localhost (port 8000), handling concurrent HTTP network connections without blocking.",
          "• Contribution to project: Hosts the main1.py application server with live reload capabilities during testing and deployment."
        ]
      },
      {
        num: "3.4",
        title: "HTML5 (Semantic Markup Language)",
        content: [
          "• What it is: HTML5 is the standard markup language for structuring web applications, offering rich input controls, semantic container elements, and native canvas graphics.",
          "• Why it is used: Provides accessible, standards-compliant input fields for queue inputs, radio selectors for direction, and structural layout containers.",
          "• Contribution to project: Defines the user interface layout in index.html, structuring input cards, metric display badges, and the graphic visualization viewport."
        ]
      }
    ]
  }
];
