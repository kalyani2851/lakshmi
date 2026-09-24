import React from 'react';
import type { PageData } from '../data/pages1to6';
import { allPages as defaultAllPages } from '../data/allDocumentationPages';
import { DOCUMENT_METADATA } from '../data/docSections';
import { main1PyCode, indexHtmlCode, styleCssCode, appJsCode } from '../data/sourceCodeFiles';
import { OutputScreenshotsSection } from './OutputScreenshotsSection';
import { TableOfContentsPageView } from './TableOfContentsPageView';

interface A4PageViewProps {
  page: PageData;
  totalPages: number;
  allPages?: PageData[];
  onNavigateToPage?: (pageNum: number) => void;
}

export const A4PageView: React.FC<A4PageViewProps> = ({
  page,
  totalPages,
  allPages = defaultAllPages,
  onNavigateToPage,
}) => {
  const isTitlePage = page.pageNumber === 1;
  const isTableOfContentsPage = page.pageNumber === 2 || page.sectionId === 'toc';
  const isCodeBackend = page.pageNumber === 16;
  const isCodeFrontend = page.pageNumber === 17;
  const isCodeStyles = page.pageNumber === 18;
  const isScreenshotsPage = page.pageNumber === 19 || page.pageNumber === 20;

  return (
    <article
      id={`page-${page.pageNumber}`}
      className="a4-page relative mx-auto bg-white text-slate-900 shadow-2xl transition-all duration-200 print:shadow-none print:m-0 print:border-none flex flex-col justify-between"
      style={{
        width: '100%',
        maxWidth: '820px',
        minHeight: '1140px',
        padding: '52px 64px 44px 64px',
        boxSizing: 'border-box',
        pageBreakAfter: 'always',
        breakAfter: 'page',
      }}
    >
      {/* Running Header (Pages 2-24) */}
      {!isTitlePage && (
        <header className="border-b border-slate-300 pb-2 mb-6 flex items-center justify-between text-[11px] text-slate-500 font-sans tracking-wide">
          <span className="font-semibold uppercase text-slate-700">
            {DOCUMENT_METADATA.department}
          </span>
          <span className="italic">{page.headerTitle}</span>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 space-y-4">
        
        {/* Cover Page Special Layout */}
        {isTitlePage ? (
          <div className="text-center py-6 flex flex-col justify-between h-full space-y-8">
            <div className="border-b-2 border-indigo-900 pb-6">
              <span className="text-xs uppercase tracking-widest text-slate-600 block font-semibold mb-2">
                PROJECT DOCUMENTATION REPORT
              </span>
              <h1 className="text-3xl font-extrabold text-indigo-950 tracking-tight leading-tight">
                {DOCUMENT_METADATA.projectTitle}
              </h1>
              <p className="text-sm font-medium text-slate-700 mt-3 max-w-xl mx-auto italic">
                {DOCUMENT_METADATA.subTitle}
              </p>
            </div>

            {/* University Crest / Seal Mock */}
            <div className="my-6 flex justify-center">
              <div className="w-28 h-28 rounded-full border-4 border-indigo-900 flex flex-col items-center justify-center p-2 bg-indigo-50/60 shadow-inner">
                <span className="text-[10px] font-bold text-indigo-950 tracking-tighter uppercase">CSE DEPT</span>
                <span className="text-2xl font-black text-indigo-900 my-0.5">OS</span>
                <span className="text-[9px] font-semibold text-slate-600">LAB RECORD</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p className="font-semibold uppercase tracking-wider text-slate-900">
                Submitted in Partial Fulfillment of the Requirements for the Degree of
              </p>
              <p className="font-bold text-sm text-indigo-950">
                {DOCUMENT_METADATA.degree}
              </p>
              <p className="text-slate-600">
                Course: {DOCUMENT_METADATA.course}
              </p>
              <p className="text-slate-600 font-medium">
                {DOCUMENT_METADATA.session}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-left border-t border-slate-300 pt-6 mt-8 text-xs">
              <div className="bg-slate-50 p-4 rounded border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Submitted By:
                </span>
                <p className="font-bold text-slate-900 text-sm">Undergraduate Scholar</p>
                <p className="text-slate-600">B.Tech Computer Science & Engg.</p>
                <p className="text-slate-600 font-mono text-[11px] mt-1">Roll No: 22CSE-DS-108</p>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Supervised By:
                </span>
                <p className="font-bold text-slate-900 text-sm">Department of CSE</p>
                <p className="text-slate-600">Faculty of Engineering & Technology</p>
                <p className="text-slate-600 italic text-[11px] mt-1">Operating Systems Division</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-3">
              One-Side Printing Format &bull; Standard A4 Documentation &bull; 20–25 Pages Submission
            </div>
          </div>
        ) : (
          <>
            {/* Page Header */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug border-b-2 border-slate-200 pb-1.5 flex items-center justify-between">
                <span>{page.title}</span>
                {isTableOfContentsPage && (
                  <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                    10 Required Sections Complete
                  </span>
                )}
              </h2>
              {page.subTitle && (
                <p className="text-xs font-medium text-indigo-900 mt-1 italic">
                  {page.subTitle}
                </p>
              )}
            </div>

            {/* Dynamic Table of Contents Page View on Page 2 */}
            {isTableOfContentsPage && (
              <div className="mt-3">
                <TableOfContentsPageView
                  allPages={allPages}
                  onNavigateToPage={onNavigateToPage}
                />
              </div>
            )}

            {/* Paragraphs */}
            {!isTableOfContentsPage && page.paragraphs && page.paragraphs.length > 0 && (
              <div className="space-y-2.5 text-xs text-slate-800 leading-relaxed text-justify">
                {page.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            )}

            {/* Embedded Source Code Views on Pages 16, 17, 18 */}
            {isCodeBackend && (
              <div className="mt-3">
                <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-3 py-1.5 rounded-t text-[11px] font-mono font-semibold">
                  <span>main1.py (FastAPI Backend Server & Algorithmic Engine)</span>
                  <span className="text-[10px] text-slate-400">Python 3.10+</span>
                </div>
                <pre className="bg-slate-950 text-slate-200 p-3 rounded-b text-[10px] font-mono leading-tight overflow-x-auto max-h-[580px] border border-slate-800">
                  <code>{main1PyCode.trim()}</code>
                </pre>
              </div>
            )}

            {isCodeFrontend && (
              <div className="mt-3">
                <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-3 py-1.5 rounded-t text-[11px] font-mono font-semibold">
                  <span>index.html (Semantic Interface & HTML5 Canvas Viewport)</span>
                  <span className="text-[10px] text-slate-400">HTML5 + Tailwind CSS</span>
                </div>
                <pre className="bg-slate-950 text-slate-200 p-3 rounded-b text-[10px] font-mono leading-tight overflow-x-auto max-h-[580px] border border-slate-800">
                  <code>{indexHtmlCode.trim()}</code>
                </pre>
              </div>
            )}

            {isCodeStyles && (
              <div className="mt-3 space-y-4">
                <div>
                  <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-3 py-1.5 rounded-t text-[11px] font-mono font-semibold">
                    <span>style.css (Styling & Print Rules)</span>
                    <span className="text-[10px] text-slate-400">CSS3</span>
                  </div>
                  <pre className="bg-slate-950 text-slate-200 p-3 rounded-b text-[10px] font-mono leading-tight overflow-x-auto max-h-[160px] border border-slate-800">
                    <code>{styleCssCode.trim()}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-3 py-1.5 rounded-t text-[11px] font-mono font-semibold">
                    <span>app.js (Frontend Controller & Canvas Renderer)</span>
                    <span className="text-[10px] text-slate-400">JavaScript ES6+</span>
                  </div>
                  <pre className="bg-slate-950 text-slate-200 p-3 rounded-b text-[10px] font-mono leading-tight overflow-x-auto max-h-[360px] border border-slate-800">
                    <code>{appJsCode.trim()}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Embedded Visual Screenshots on Pages 19 and 20 */}
            {isScreenshotsPage && (
              <div className="mt-4">
                <OutputScreenshotsSection />
              </div>
            )}

            {/* Subsections */}
            {page.subsections && page.subsections.length > 0 && !isScreenshotsPage && !isTableOfContentsPage && (
              <div className="space-y-4 mt-3">
                {page.subsections.map((sub, sIdx) => (
                  <section key={sIdx} className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center space-x-1.5">
                      <span className="text-indigo-800">{sub.num}</span>
                      <span>{sub.title}</span>
                    </h3>

                    <div className="space-y-1 text-xs text-slate-800 leading-relaxed text-justify">
                      {sub.content.map((c, cIdx) => (
                        <p key={cIdx}>{c}</p>
                      ))}
                    </div>

                    {/* Tables */}
                    {sub.table && (
                      <div className="mt-2.5 overflow-x-auto border border-slate-300 rounded">
                        <table className="w-full text-[11px] text-left border-collapse">
                          <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                            <tr>
                              {sub.table.headers.map((h, hIdx) => (
                                <th key={hIdx} className="p-2 border-r last:border-r-0 border-slate-300">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 font-sans">
                            {sub.table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                {row.map((cell, cellIdx) => (
                                  <td
                                    key={cellIdx}
                                    className={`p-2 border-r last:border-r-0 border-slate-200 ${
                                      cell === 'Passed' ? 'text-emerald-700 font-bold' : ''
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {/* Running Footer */}
      <footer className="border-t border-slate-300 pt-2.5 mt-6 flex items-center justify-between text-[11px] text-slate-500 font-sans">
        <span>Department of Computer Science & Engineering</span>
        <span className="font-semibold text-slate-800">
          Page {page.pageNumber} of {totalPages}
        </span>
        <span>A4 Single-Side Submission</span>
      </footer>
    </article>
  );
};
