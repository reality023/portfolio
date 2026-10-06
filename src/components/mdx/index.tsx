import React from 'react';
import { AlertCircle, CheckCircle2, Info, Lightbulb } from 'lucide-react';

// 1. 기여도 게이지 바 컴포넌트
interface ContributionGaugeProps {
  label: string;
  percent: number;
  color?: 'blue' | 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose';
  description?: string;
}

const colorMap = {
  blue: { bg: 'bg-blue-500', track: 'bg-blue-100', text: 'text-blue-700' },
  indigo: { bg: 'bg-indigo-500', track: 'bg-indigo-100', text: 'text-indigo-700' },
  emerald: { bg: 'bg-emerald-500', track: 'bg-emerald-100', text: 'text-emerald-700' },
  violet: { bg: 'bg-violet-500', track: 'bg-violet-100', text: 'text-violet-700' },
  amber: { bg: 'bg-amber-500', track: 'bg-amber-100', text: 'text-amber-700' },
  rose: { bg: 'bg-rose-500', track: 'bg-rose-100', text: 'text-rose-700' },
};

export const ContributionGauge: React.FC<ContributionGaugeProps> = ({
  label,
  percent,
  color = 'blue',
  description
}) => {
  const c = colorMap[color] || colorMap.blue;
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="my-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
          {/* <Sparkles size={14} className={c.text} /> */}
          {label}
        </span>
        <span className={`text-xs sm:text-sm font-mono font-black ${c.text}`}>
          {clampedPercent}%
        </span>
      </div>
      <div className={`w-full h-2.5 rounded-full ${c.track} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${c.bg} transition-all duration-500`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      {description && (
        <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{description}</p>
      )}
    </div>
  );
};

// 2. Callout (안내 / 강조 박스)
interface CalloutProps {
  type?: 'info' | 'tip' | 'warning' | 'success';
  title?: string;
  children: React.ReactNode;
}

const calloutStyles = {
  info: {
    container: 'bg-blue-50/70 border-blue-200 text-blue-900',
    icon: <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />,
    badge: 'bg-blue-100 text-blue-800'
  },
  tip: {
    container: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
    icon: <Lightbulb size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />,
    badge: 'bg-emerald-100 text-emerald-800'
  },
  warning: {
    container: 'bg-amber-50/70 border-amber-200 text-amber-900',
    icon: <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />,
    badge: 'bg-amber-100 text-amber-800'
  },
  success: {
    container: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
    icon: <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />,
    badge: 'bg-emerald-100 text-emerald-800'
  }
};

export const Callout: React.FC<CalloutProps> = ({ type = 'info', title, children }) => {
  const style = calloutStyles[type] || calloutStyles.info;

  return (
    <div className={`my-4 p-4 rounded-2xl border ${style.container} text-xs sm:text-sm leading-relaxed shadow-2xs`}>
      <div className="flex items-start gap-2.5">
        {style.icon}
        <div className="flex-1">
          {title && <h5 className="font-bold mb-1 tracking-tight">{title}</h5>}
          <div className="[&>p]:mb-0">{children}</div>
        </div>
      </div>
    </div>
  );
};

// 3. Stat Card (지표 카드)
interface StatCardProps {
  title: string;
  value: string;
  desc?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, desc }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center flex flex-col justify-center">
      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
        {title}
      </span>
      <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight my-0.5 text-blue-600">
        {value}
      </span>
      {desc && <span className="text-xs text-slate-500">{desc}</span>}
    </div>
  );
};

// 4. Grid 컨테이너
interface GridProps {
  cols?: 2 | 3 | 4;
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({ cols = 2, children }) => {
  const colClass = cols === 3 ? 'sm:grid-cols-3' : cols === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-2';
  return (
    <div className={`grid grid-cols-1 ${colClass} gap-3 my-4`}>
      {children}
    </div>
  );
};

// 5. 이미지 및 스크린샷 뷰어
interface ProjectImageProps {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
}

export const ProjectImage: React.FC<ProjectImageProps> = ({
  src,
  alt = '',
  caption,
  className = ''
}) => {
  return (
    <figure className={`my-4 flex flex-col items-center text-center ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm bg-slate-50 transition-all hover:shadow-md">
        <img
          src={src}
          alt={alt || caption || ''}
          className="w-full h-auto object-cover max-h-[480px]"
          loading="lazy"
        />
      </div>
      {(caption || alt) && (
        <figcaption className="mt-2 text-xs text-slate-500 font-medium">
          {caption || alt}
        </figcaption>
      )}
    </figure>
  );
};

// 6. 이미지 그리드 (모바일 화면 2~3열 나란히 배치용)
interface ImageGridProps {
  cols?: 2 | 3;
  children: React.ReactNode;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ cols = 2, children }) => {
  const colClass = cols === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';
  return (
    <div className={`my-5 grid ${colClass} gap-3 sm:gap-4 items-start`}>
      {children}
    </div>
  );
};
