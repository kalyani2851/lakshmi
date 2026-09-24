export interface DocPage {
  pageNumber: number;
  sectionNumber: string;
  sectionTitle: string;
  subTitle?: string;
  contentHtml?: string;
  type: 'title' | 'content' | 'code' | 'figures' | 'tests';
}

export const DOCUMENT_METADATA = {
  projectTitle: "DISK SCHEDULING SIMULATOR",
  subTitle: "A Simulation and Comparative Visualization Suite for Disk Scheduling Algorithms",
  course: "Operating Systems Laboratory (CS-312P)",
  degree: "Bachelor of Technology in Computer Science & Engineering",
  department: "Department of Computer Science & Engineering",
  session: "Academic Year 2025-2026",
  totalPages: 24,
  technologies: "Python, FastAPI, Uvicorn, HTML5, HTML5 Canvas, JavaScript ES6+, Fetch API, Tailwind CSS"
};

export const TABLE_OF_CONTENTS = [
  { id: "toc", num: "TOC", title: "Table of Contents", page: 2 },
  { id: "sec1", num: "1", title: "Problem Statement", page: 3 },
  { id: "sec2", num: "2", title: "Objective", page: 5 },
  { id: "sec3", num: "3", title: "Tools Used", page: 6 },
  { id: "sec4", num: "4", title: "Theory / Description about the Project", page: 8 },
  { id: "sec5", num: "5", title: "Functionality / Explanation", page: 12 },
  { id: "sec6", num: "6", title: "Procedure", page: 14 },
  { id: "sec7", num: "7", title: "Source Code", page: 16 },
  { id: "sec8", num: "8", title: "Output Screenshots (Colour Print)", page: 19 },
  { id: "sec9", num: "9", title: "Test Results / Discussion", page: 21 },
  { id: "sec10", num: "10", title: "Future Scope", page: 23 },
  { id: "sec11", num: "11", title: "Conclusion & References", page: 24 },
];
