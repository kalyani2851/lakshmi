import type { PageData } from '../data/pages1to6';

export interface TocSubsection {
  num: string;
  title: string;
}

export interface TocSectionItem {
  id: string;
  sectionNumber: string;
  title: string;
  startPage: number;
  endPage: number;
  pageRangeStr: string;
  description: string;
  subsections: TocSubsection[];
  isRequired: boolean;
  colourPrintRequired?: boolean;
}

export const REQUIRED_10_SECTIONS_SPEC = [
  {
    num: "1",
    id: "sec1",
    title: "Problem Statement",
    description: "Mechanical disk physics, latency components, seek time bottleneck & request starvation",
  },
  {
    num: "2",
    id: "sec2",
    title: "Objective",
    description: "Core simulation goals, performance metrics (D, L_avg) & comparative analysis methodology",
  },
  {
    num: "3",
    id: "sec3",
    title: "Tools Used",
    description: "Python 3.10+, FastAPI REST, Uvicorn, Pydantic, HTML5 Canvas 2D, JS ES6+, Tailwind CSS",
  },
  {
    num: "4",
    id: "sec4",
    title: "Theory / Description about the Project",
    description: "In-depth theoretical & mathematical formulation of FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK",
  },
  {
    num: "5",
    id: "sec5",
    title: "Functionality / Explanation",
    description: "Client-server architecture, input parsing, simulation endpoint, coordinate mapping & metrics",
  },
  {
    num: "6",
    id: "sec6",
    title: "Procedure",
    description: "16-step standardized laboratory execution workflow & client-server communication flow",
  },
  {
    num: "7",
    id: "sec7",
    title: "Source Code",
    description: "Full production implementations of main1.py, index.html, styles.css, and app.js",
  },
  {
    num: "8",
    id: "sec8",
    title: "Output Screenshots (Colour Print)",
    description: "High-resolution trajectories and comparative performance chart (Figures 8.1 - 8.7)",
    colourPrintRequired: true,
  },
  {
    num: "9",
    id: "sec9",
    title: "Test Results / Discussion",
    description: "Benchmark test cases, metric comparison table, variance analysis & algorithmic trade-offs",
  },
  {
    num: "10",
    id: "sec10",
    title: "Future Scope",
    description: "Dual-head seek optimization, SATF/SLTF rotational latency modeling, WebGL 3D disk",
  },
];

/**
 * Dynamically computes and resolves the Table of Contents by scanning all documentation pages.
 * Resolves exact startPage, endPage, page ranges, and aggregated subsections.
 */
export function generateTableOfContents(pages: PageData[]): TocSectionItem[] {
  // Dynamically resolve the 10 required sections
  const items: TocSectionItem[] = REQUIRED_10_SECTIONS_SPEC.map((spec) => {
    // Find all pages matching this section number
    const matchingPages = pages.filter((p) => p.sectionNumber === spec.num);

    const startPage =
      matchingPages.length > 0 ? Math.min(...matchingPages.map((p) => p.pageNumber)) : 1;
    const endPage =
      matchingPages.length > 0 ? Math.max(...matchingPages.map((p) => p.pageNumber)) : startPage;
    const pageRangeStr =
      startPage === endPage ? `Page ${startPage}` : `Pages ${startPage}–${endPage}`;

    // Collect subsections defined across the matching pages
    const rawSubs: TocSubsection[] = [];
    matchingPages.forEach((p) => {
      if (p.subsections) {
        p.subsections.forEach((s) => {
          rawSubs.push({ num: s.num, title: s.title });
        });
      }
    });

    return {
      id: spec.id,
      sectionNumber: spec.num,
      title: spec.title,
      startPage,
      endPage,
      pageRangeStr,
      description: spec.description,
      subsections: rawSubs,
      isRequired: true,
      colourPrintRequired: spec.colourPrintRequired || false,
    };
  });

  // Dynamically discover Conclusion / References (Page 24)
  const conclusionPages = pages.filter(
    (p) =>
      p.sectionNumber === "11" ||
      p.sectionId.includes("concl") ||
      p.title.toLowerCase().includes("conclusion")
  );

  if (conclusionPages.length > 0) {
    const startPage = Math.min(...conclusionPages.map((p) => p.pageNumber));
    const endPage = Math.max(...conclusionPages.map((p) => p.pageNumber));
    const rawSubs: TocSubsection[] = [];
    conclusionPages.forEach((p) => {
      if (p.subsections) {
        p.subsections.forEach((s) => {
          rawSubs.push({ num: s.num, title: s.title });
        });
      }
    });

    items.push({
      id: "sec11",
      sectionNumber: "11",
      title: "Conclusion & References",
      startPage,
      endPage,
      pageRangeStr:
        startPage === endPage ? `Page ${startPage}` : `Pages ${startPage}–${endPage}`,
      description: "Summary of findings, algorithmic recommendations & standard academic citations",
      subsections: rawSubs,
      isRequired: false,
    });
  }

  return items;
}
