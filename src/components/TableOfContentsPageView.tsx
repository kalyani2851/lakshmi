import React from 'react';
import type { PageData } from '../data/pages1to6';
import { generateTableOfContents, TocSectionItem } from '../utils/generateToc';
import { BookOpen, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface TableOfContentsPageViewProps {
  allPages: PageData[];
  onNavigateToPage?: (pageNum: number) => void;
}

export const TableOfContentsPageView: React.FC<TableOfContentsPageViewProps> = ({
  allPages,
  onNavigateToPage,
}) => {
  // Dynamically generate the TOC from the full list of pages
  const tocSections: TocSectionItem[] = React.useMemo(() => {
    return generateTableOfContents(allPages);
  }, [allPages]);

  return (
    <div className="space-y-4 text-slate-800 font-sans">
      
      {/* Certification of Bonafide Record Strip */}
      <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 text-[11px] text-slate-700 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700" />
            <span>Certificate of Bonafide Record & Curriculum Alignment</span>
          </span>
          <span className="font-mono text-[10px] bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
            B.Tech CSE &bull; OS Laboratory
          </span>
        </div>
        <p className="leading-relaxed text-justify text-[11px]">
          This documentation is certified as a bonafide record of work carried out for the project titled{' '}
          <strong className="text-slate-900">&quot;DISK SCHEDULING SIMULATOR&quot;</strong>. The report is organized into the{' '}
          <span className="font-semibold text-indigo-950">10 mandatory sections</span> prescribed for academic evaluation, covering theoretical disk mechanics, algorithmic formulations, FastAPI REST backend implementation, HTML5 Canvas visualization, and empirical benchmarking.
        </p>
      </div>

      {/* Dynamic Table of Contents List */}
      <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
        
        {/* Table Header */}
        <div className="bg-slate-100 border-b border-slate-300 px-3.5 py-2 flex items-center justify-between text-xs font-bold text-slate-800">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-800" />
            <span className="uppercase tracking-wider">Required Laboratory Section</span>
          </div>
          <span className="uppercase tracking-wider font-mono text-[11px]">Page Allocation</span>
        </div>

        {/* Dynamic Section Items */}
        <div className="divide-y divide-slate-200">
          {tocSections.map((sec) => {
            const isClickable = Boolean(onNavigateToPage);

            return (
              <div
                key={sec.id}
                onClick={() => onNavigateToPage?.(sec.startPage)}
                className={`px-3.5 py-2 transition group flex flex-col justify-center ${
                  isClickable ? 'hover:bg-indigo-50/60 cursor-pointer' : ''
                }`}
                title={`Jump to Section ${sec.sectionNumber}: ${sec.title} (${sec.pageRangeStr})`}
              >
                {/* Main Line: Number Badge + Title + Leader Dots + Page Range */}
                <div className="flex items-baseline justify-between w-full">
                  
                  {/* Left: Badge + Section Title */}
                  <div className="flex items-center space-x-2 min-w-0 pr-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 group-hover:bg-indigo-600 group-hover:text-white transition whitespace-nowrap">
                      {sec.sectionNumber.padStart(2, '0')}
                    </span>
                    <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-950 transition truncate">
                      {sec.title}
                    </span>
                    {sec.colourPrintRequired && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded border border-rose-300 font-bold uppercase tracking-tight">
                        <AlertCircle className="w-2.5 h-2.5" />
                        <span>Colour Print</span>
                      </span>
                    )}
                  </div>

                  {/* Dot Leader Fill */}
                  <div className="flex-1 mx-2 border-b border-dotted border-slate-300 relative -top-1" />

                  {/* Right: Page Range Pill & Jump Icon */}
                  <div className="flex items-center space-x-1.5 pl-2 flex-shrink-0">
                    <span className="font-mono text-xs font-semibold text-slate-800 group-hover:text-indigo-700 transition">
                      {sec.pageRangeStr}
                    </span>
                    {isClickable && (
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition group-hover:translate-x-0.5" />
                    )}
                  </div>

                </div>

                {/* Subtitle / Description & Subsections */}
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-500 pl-7">
                  <span className="text-slate-600 italic">{sec.description}</span>
                  {sec.subsections.length > 0 && (
                    <span className="text-slate-400 hidden md:inline">
                      &bull;{' '}
                      {sec.subsections
                        .slice(0, 4)
                        .map((s) => `${s.num} ${s.title}`)
                        .join(' | ')}
                      {sec.subsections.length > 4 ? ` (+${sec.subsections.length - 4} more)` : ''}
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Summary Footer Box */}
      <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 text-[10px] text-slate-600 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
        <div className="border-r last:border-r-0 border-slate-300 pr-2">
          <span className="text-slate-400 block text-[9px]">TOTAL SECTIONS</span>
          <span className="font-bold text-slate-900 text-xs">10 Required + Conclusion</span>
        </div>
        <div className="border-r last:border-r-0 border-slate-300 pr-2">
          <span className="text-slate-400 block text-[9px]">REPORT LENGTH</span>
          <span className="font-bold text-slate-900 text-xs">24 Standard A4 Pages</span>
        </div>
        <div className="border-r last:border-r-0 border-slate-300 pr-2">
          <span className="text-slate-400 block text-[9px]">PRINT SPECIFICATION</span>
          <span className="font-bold text-slate-900 text-xs">Single-Sided (1-Side)</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[9px]">SECTION 8 REQUIREMENT</span>
          <span className="font-bold text-rose-700 text-xs">Mandatory Colour Print</span>
        </div>
      </div>

    </div>
  );
};
