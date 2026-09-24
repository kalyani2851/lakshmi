import React, { useState, useMemo } from 'react';
import { allPages } from '../data/allDocumentationPages';
import { TABLE_OF_CONTENTS, DOCUMENT_METADATA } from '../data/docSections';
import { generateTableOfContents } from '../utils/generateToc';
import { A4PageView } from './A4PageView';
import { InteractiveSimulator } from './InteractiveSimulator';
import { AlgorithmPerformanceCharts } from './AlgorithmPerformanceCharts';
import { main1PyCode, indexHtmlCode, styleCssCode, appJsCode } from '../data/sourceCodeFiles';
import {
  Printer,
  Copy,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  LayoutTemplate,
  Search,
  Check,
  Code2,
  Cpu,
  Layers,
  FileText,
  List,
  BarChart3
} from 'lucide-react';

export const DocumentViewer: React.FC = () => {
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'paged' | 'continuous' | 'charts' | 'simulator' | 'code'>('paged');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [selectedCodeFile, setSelectedCodeFile] = useState<'main1' | 'index' | 'style' | 'app'>('main1');

  const totalPages = allPages.length; // 24 pages

  // Dynamically compute the Table of Contents from allPages
  const dynamicToc = useMemo(() => generateTableOfContents(allPages), []);

  // Current page for paged mode
  const activePage = useMemo(() => {
    return allPages.find((p) => p.pageNumber === currentPageNum) || allPages[0];
  }, [currentPageNum]);

  // Filtered pages for search
  const searchResultsCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const q = searchQuery.toLowerCase();
    return allPages.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSub = p.subTitle?.toLowerCase().includes(q);
      const matchPara = p.paragraphs.some((para) => para.toLowerCase().includes(q));
      return matchTitle || matchSub || matchPara;
    }).length;
  }, [searchQuery]);

  // Trigger Print to PDF
  const handlePrint = () => {
    // If in simulator tab, temporarily switch to paged or continuous for print
    if (activeTab === 'simulator' || activeTab === 'code') {
      setActiveTab('continuous');
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  };

  // Copy Full Markdown/Word Report to Clipboard
  const handleCopyReport = () => {
    let fullText = `# ${DOCUMENT_METADATA.projectTitle}\n`;
    fullText += `## ${DOCUMENT_METADATA.subTitle}\n\n`;
    fullText += `Degree: ${DOCUMENT_METADATA.degree}\n`;
    fullText += `Department: ${DOCUMENT_METADATA.department}\n`;
    fullText += `Session: ${DOCUMENT_METADATA.session}\n\n`;
    fullText += `========================================================================\n\n`;

    allPages.forEach((p) => {
      fullText += `\n--- PAGE ${p.pageNumber} OF ${totalPages} ---\n`;
      fullText += `## ${p.title}\n`;
      if (p.subTitle) fullText += `*${p.subTitle}*\n\n`;

      if (p.pageNumber === 2 || p.sectionId === 'toc') {
        fullText += `CERTIFICATE OF BONAFIDE RECORD\nThis certifies that the project documentation reflects all 10 mandatory laboratory sections.\n\n`;
        fullText += `### TABLE OF CONTENTS (10 REQUIRED SECTIONS)\n`;
        dynamicToc.forEach((sec) => {
          fullText += `${sec.sectionNumber.padStart(2, ' ')}. ${sec.title.padEnd(46, '.')} ${sec.pageRangeStr}\n`;
          if (sec.description) fullText += `    Description: ${sec.description}\n`;
        });
        fullText += `\n`;
      } else {
        p.paragraphs.forEach((para) => {
          fullText += `${para}\n\n`;
        });
        if (p.subsections) {
          p.subsections.forEach((sub) => {
            fullText += `### ${sub.num} ${sub.title}\n`;
            sub.content.forEach((line) => {
              fullText += `${line}\n`;
            });
            if (sub.table) {
              fullText += `\n| ${sub.table.headers.join(' | ')} |\n`;
              fullText += `| ${sub.table.headers.map(() => '---').join(' | ')} |\n`;
              sub.table.rows.forEach((r) => {
                fullText += `| ${r.join(' | ')} |\n`;
              });
              fullText += `\n`;
            }
            fullText += `\n`;
          });
        }
      }
    });

    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    });
  };

  const jumpToPage = (pgNum: number) => {
    setCurrentPageNum(pgNum);
    if (activeTab !== 'paged' && activeTab !== 'continuous') {
      setActiveTab('paged');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Application Bar (Hidden on print) */}
      <nav className="print:hidden border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Project Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
              A4
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  Disk Scheduling Simulator
                </span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                  B.Tech CSE Project (24 Pages)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                AISP Format &bull; 1-Side A4 &bull; FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK
              </p>
            </div>
          </div>

          {/* Center Tabs: Paged vs Continuous vs Simulator vs Code */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('paged')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${
                activeTab === 'paged'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>A4 Paged View ({totalPages})</span>
            </button>
            <button
              onClick={() => setActiveTab('continuous')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${
                activeTab === 'continuous'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Continuous Scroll</span>
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Live Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${
                activeTab === 'charts'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Performance Charts</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Source Files</span>
            </button>
          </div>

          {/* Action Tools: Print to PDF & Copy for Word */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyReport}
              className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 transition"
              title="Copy entire 24-page report text for Microsoft Word or Google Docs"
            >
              {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedToast ? 'Copied Report!' : 'Copy for Word'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium shadow-md transition"
              title="Print directly to standard A4 sheets or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 / PDF</span>
            </button>
          </div>

        </div>

        {/* Secondary Sub-Bar: Search & Table of Contents Dropdown */}
        <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 py-1.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Quick Table of Contents Jump Button & Section Dropdown */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => jumpToPage(2)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition text-xs font-medium border ${
                  currentPageNum === 2 && activeTab === 'paged'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="View dynamically generated Table of Contents (Page 2)"
              >
                <List className="w-3.5 h-3.5 text-indigo-400" />
                <span>Table of Contents (Page 2)</span>
              </button>

              <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-800">
                <span className="text-slate-400 flex items-center gap-1 font-medium hidden sm:inline-flex">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" /> Jump to:
                </span>
                <select
                  value={activePage.sectionNumber}
                  onChange={(e) => {
                    if (e.target.value === 'TOC') {
                      jumpToPage(2);
                      return;
                    }
                    const found = dynamicToc.find((t) => t.sectionNumber === e.target.value);
                    if (found) jumpToPage(found.startPage);
                  }}
                  className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 max-w-xs"
                >
                  <option value="TOC">Table of Contents (Page 2)</option>
                  {dynamicToc.map((t) => (
                    <option key={t.id} value={t.sectionNumber}>
                      Section {t.sectionNumber}: {t.title} ({t.pageRangeStr})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Paged Navigation Stepper (When activeTab is 'paged') */}
            {activeTab === 'paged' && (
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPageNum <= 1}
                  onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-slate-300 font-semibold px-2">
                  Page {currentPageNum} of {totalPages}
                </span>
                <button
                  disabled={currentPageNum >= totalPages}
                  onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Document Search Field */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search report (e.g. seek time, SSTF)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-full pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-56"
              />
              {searchQuery && (
                <span className="text-[10px] text-indigo-400 ml-2 font-mono">
                  {searchResultsCount} pages
                </span>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 flex justify-center">
        
        {/* Tab 1: Paged A4 View */}
        {activeTab === 'paged' && (
          <div className="w-full flex flex-col items-center space-y-6">
            <div className="w-full max-w-[840px] flex items-center justify-between text-xs text-slate-400 px-2 print:hidden">
              <span>A4 One-Side Preview &bull; Page {currentPageNum} of {totalPages}</span>
              <span>210mm &times; 297mm Standard Academic Format</span>
            </div>

            {/* Single A4 Page Display */}
            <A4PageView
              page={activePage}
              totalPages={totalPages}
              allPages={allPages}
              onNavigateToPage={jumpToPage}
            />

            {/* Bottom Stepper */}
            <div className="flex items-center space-x-3 pt-4 print:hidden">
              <button
                disabled={currentPageNum <= 1}
                onClick={() => {
                  setCurrentPageNum((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center space-x-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 rounded text-xs font-medium border border-slate-700 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>

              <span className="font-mono text-sm text-slate-300 font-bold px-4">
                Page {currentPageNum} of {totalPages}
              </span>

              <button
                disabled={currentPageNum >= totalPages}
                onClick={() => {
                  setCurrentPageNum((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center space-x-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 rounded text-xs font-medium border border-slate-700 transition"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Continuous Scroll Mode (All 24 Pages Rendered Sequentially) */}
        {activeTab === 'continuous' && (
          <div className="w-full max-w-[840px] space-y-10">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 flex items-center justify-between print:hidden">
              <span>Continuous Reading Mode: Displaying all 24 pages with authentic A4 page boundaries.</span>
              <button
                onClick={handlePrint}
                className="text-indigo-400 hover:underline font-medium"
              >
                Print All 24 Pages
              </button>
            </div>

            {allPages.map((page) => (
              <div key={page.pageNumber} className="relative">
                <div className="text-[11px] font-mono text-slate-500 mb-2 px-2 print:hidden flex justify-between">
                  <span>Page {page.pageNumber} of {totalPages}</span>
                  <span>{page.headerTitle}</span>
                </div>
                <A4PageView
                  page={page}
                  totalPages={totalPages}
                  allPages={allPages}
                  onNavigateToPage={(pg) => {
                    const el = document.getElementById(`page-${pg}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      jumpToPage(pg);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Interactive Simulator Tab */}
        {activeTab === 'simulator' && (
          <div className="w-full max-w-5xl space-y-6">
            <InteractiveSimulator />
          </div>
        )}

        {/* Tab 4: Performance Comparison Charts Module (Recharts) */}
        {activeTab === 'charts' && (
          <div className="w-full max-w-5xl space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    <span>Algorithmic Performance Comparison Module</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Engineered with Recharts to deliver academic visualizations of Total Head Movement, Average Seek Distance, and Trajectory progression across FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950 border border-indigo-800 px-2.5 py-1 rounded">
                    Documentation Sections 8 & 9
                  </span>
                </div>
              </div>

              <AlgorithmPerformanceCharts mode="interactive" />
            </div>
          </div>
        )}

        {/* Tab 5: Source Code Files Tab */}
        {activeTab === 'code' && (
          <div className="w-full max-w-5xl space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-semibold text-white">Project Source Code Repository</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Authentic implementations of backend FastAPI services, semantic HTML5, styling, and JS controller
                  </p>
                </div>

                {/* File Switcher */}
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                  {[
                    { id: 'main1', name: 'main1.py', lang: 'Python' },
                    { id: 'index', name: 'index.html', lang: 'HTML' },
                    { id: 'style', name: 'style.css', lang: 'CSS' },
                    { id: 'app', name: 'app.js', lang: 'JavaScript' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedCodeFile(f.id as any)}
                      className={`px-3 py-1.5 rounded transition ${
                        selectedCodeFile === f.id
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Viewer */}
              <div className="relative">
                <button
                  onClick={() => {
                    const code =
                      selectedCodeFile === 'main1'
                        ? main1PyCode
                        : selectedCodeFile === 'index'
                        ? indexHtmlCode
                        : selectedCodeFile === 'style'
                        ? styleCssCode
                        : appJsCode;
                    navigator.clipboard.writeText(code);
                    alert(`Copied ${selectedCodeFile} code to clipboard!`);
                  }}
                  className="absolute top-3 right-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-sans flex items-center space-x-1 border border-slate-700 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </button>

                <pre className="bg-slate-950 text-slate-200 p-5 rounded-lg text-xs font-mono leading-relaxed overflow-x-auto border border-slate-800 max-h-[680px]">
                  <code>
                    {selectedCodeFile === 'main1' && main1PyCode.trim()}
                    {selectedCodeFile === 'index' && indexHtmlCode.trim()}
                    {selectedCodeFile === 'style' && styleCssCode.trim()}
                    {selectedCodeFile === 'app' && appJsCode.trim()}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="print:hidden border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>Bachelor of Technology in Computer Science & Engineering</span>
          <span>Operating Systems Laboratory Project Record &bull; A4 Single-Side Format</span>
          <span>FastAPI + HTML5 Canvas Simulator</span>
        </div>
      </footer>

    </div>
  );
};
