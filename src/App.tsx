import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import type { Variants } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Mail,
  Phone,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Layers,
  Terminal,
  Smartphone,
  Server,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDown,
  X,
  Eye,
  GitBranch,
  AlertTriangle,
  GitPullRequest,
  MousePointerClick,
  Workflow,
  User,
  Fingerprint,
  FolderGit2,
  Calendar,
  FileText,
  ExternalLink,
  Users,
  ZoomIn
} from 'lucide-react';
import { PROJECTS_DATA, type ProjectItem, type ProjectScreenshot } from './data/projects';
import { ContributionGauge, Callout, StatCard, Grid, ProjectImage, ImageGrid } from './components/mdx';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const resolveAssetUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const cleanPath = url.replace(/^\.?\//, '');
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};

const getScreenshotData = (item: ProjectScreenshot | string, index: number) => {
  if (typeof item === 'string') {
    return {
      src: resolveAssetUrl(item),
      caption: undefined,
      alt: `스크린샷 미리보기 ${index + 1}`
    };
  }
  return {
    src: resolveAssetUrl(item.src),
    caption: item.caption,
    alt: item.alt || item.caption || `스크린샷 미리보기 ${index + 1}`
  };
};

const mdxComponents: Record<string, any> = {
  h1: ({ ...props }: any) => <h1 className="text-xl font-black text-slate-900 mt-7 mb-3.5 pb-2 border-b border-slate-200" {...props} />,
  h2: ({ ...props }: any) => <h2 className="text-lg font-bold text-slate-900 mt-7 mb-3 flex items-center gap-2" {...props} />,
  h3: ({ children, ...props }: any) => {
    const str = String(children);
    const isDev = str.includes('개발') || str.includes('아키텍처');
    const isTroubleshoot = str.includes('트러블슈팅') || str.includes('배운 점');

    return (
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/90 mt-8 mb-4 first:mt-1">
        <div className={`p-1.5 rounded-xl border ${isTroubleshoot
          ? 'bg-amber-50 text-amber-600 border-amber-200'
          : isDev
            ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
            : 'bg-blue-50 text-blue-600 border-blue-200'
          }`}>
          {isTroubleshoot ? (
            <AlertTriangle size={17} />
          ) : isDev ? (
            <Workflow size={17} />
          ) : (
            <FileText size={17} />
          )}
        </div>
        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight" {...props}>
          {children}
        </h3>
      </div>
    );
  },
  h4: ({ children, ...props }: any) => (
    <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-6 mb-2.5 flex items-center gap-2 border-l-4 border-blue-600 pl-3 py-0.5 tracking-tight" {...props}>
      {children}
    </h4>
  ),
  p: ({ ...props }: any) => <p className="text-sm text-slate-600 leading-relaxed mb-3.5 break-keep" {...props} />,
  ul: ({ ...props }: any) => <ul className="space-y-2 text-sm text-slate-600 mb-5 pl-1" {...props} />,
  ol: ({ ...props }: any) => <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 mb-5 pl-1" {...props} />,
  li: ({ children, ...props }: any) => (
    <li className="flex items-start gap-2.5 leading-relaxed text-slate-600 text-sm" {...props}>
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
      <span className="flex-1 break-keep">{children}</span>
    </li>
  ),
  strong: ({ children, ...props }: any) => {
    const str = String(children);
    if (str.includes('이슈')) {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-xs mr-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {children}
        </span>
      );
    }
    if (str.includes('원인')) {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs mr-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          {children}
        </span>
      );
    }
    if (str.includes('해결')) {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs mr-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {children}
        </span>
      );
    }
    return (
      <strong className="font-bold text-blue-900 bg-blue-50/90 px-1.5 py-0.5 rounded border border-blue-200/60" {...props}>
        {children}
      </strong>
    );
  },
  blockquote: ({ children, ...props }: any) => (
    <div className="my-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 border border-amber-200/90 p-5 sm:p-6 shadow-xs max-w-full overflow-hidden">
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-amber-200/70">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900">
          <AlertTriangle size={15} className="text-amber-600" />
          <span>TROUBLESHOOTING & DECISION RECORD</span>
        </div>
        <span className="text-[11px] font-mono font-semibold text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
          문제 해결 회고
        </span>
      </div>
      <blockquote className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2.5 not-italic" {...props}>
        {children}
      </blockquote>
    </div>
  ),
  pre: ({ children }: any) => (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-lg max-w-full my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-[10px] text-slate-500 font-mono">code preview</span>
      </div>
      <div className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-w-full [&_code]:!bg-transparent [&_code]:!text-slate-200 [&_code]:!p-0 [&_code]:!border-0 [&_code]:!font-mono">
        <pre className="font-mono text-xs leading-relaxed">
          {children}
        </pre>
      </div>
    </div>
  ),
  code: ({ className, children, ...props }: any) => {
    const isBlock = Boolean(className?.includes('language-')) || String(children).includes('\n');
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-100 text-blue-700 font-mono text-xs border border-slate-200 font-semibold inline align-baseline"
        {...props}
      >
        {children}
      </code>
    );
  },
  table: ({ ...props }: any) => (
    <div className="overflow-x-auto my-5 rounded-xl border border-slate-200 shadow-xs max-w-full">
      <table className="min-w-full text-xs text-left border-collapse" {...props} />
    </div>
  ),
  th: ({ ...props }: any) => <th className="bg-slate-100 p-3 font-bold text-slate-800 border-b border-slate-200" {...props} />,
  td: ({ ...props }: any) => <td className="p-3 border-b border-slate-100 text-slate-700" {...props} />,
  a: ({ ...props }: any) => <a className="text-blue-600 font-semibold underline hover:text-blue-700 transition-colors" target="_blank" rel="noreferrer" {...props} />,
  hr: () => (
    <div className="relative my-7">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-slate-400 text-xs font-mono">✦ ✦ ✦</span>
      </div>
    </div>
  ),
  img: ({ src, alt, ...props }: any) => (
    <figure className="my-5 flex flex-col items-center text-center">
      <img
        src={src}
        alt={alt || ''}
        className="rounded-2xl border border-slate-200/90 shadow-sm max-w-full h-auto max-h-[500px]"
        loading="lazy"
        {...props}
      />
      {alt && (
        <figcaption className="mt-2 text-xs text-slate-500 font-medium">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
  // Built-in components available directly in MDX:
  ContributionGauge,
  Callout,
  StatCard,
  Grid,
  ProjectImage,
  ImageGrid
};

export default function App() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'work' | 'side'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Current project navigation index inside modal
  const currentIndex = selectedProject ? PROJECTS_DATA.findIndex(p => p.id === selectedProject.id) : -1;
  const prevProject = currentIndex > 0 ? PROJECTS_DATA[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < PROJECTS_DATA.length - 1 ? PROJECTS_DATA[currentIndex + 1] : null;

  // Screenshot gallery scroll & drag state
  const galleryRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragDistance = useRef(0);

  const checkGalleryScroll = () => {
    if (galleryRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkGalleryScroll, 80);
    const el = galleryRef.current;
    if (el) {
      el.addEventListener('scroll', checkGalleryScroll, { passive: true });
      window.addEventListener('resize', checkGalleryScroll);
      return () => {
        clearTimeout(timer);
        el.removeEventListener('scroll', checkGalleryScroll);
        window.removeEventListener('resize', checkGalleryScroll);
      };
    }
    return () => clearTimeout(timer);
  }, [selectedProject]);

  const handleGalleryScroll = (direction: 'left' | 'right') => {
    if (galleryRef.current) {
      const amount = galleryRef.current.clientWidth * 0.75;
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  };

  const handleGalleryMouseDown = (e: React.MouseEvent) => {
    if (!galleryRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - galleryRef.current.offsetLeft;
    scrollLeftStart.current = galleryRef.current.scrollLeft;
    dragDistance.current = 0;
  };

  const handleGalleryMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !galleryRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    const diff = x - startX.current;
    dragDistance.current = Math.abs(diff);
    galleryRef.current.scrollLeft = scrollLeftStart.current - diff;
  };

  const handleGalleryMouseUp = () => {
    isDragging.current = false;
  };

  // Reset selected image when project modal changes or closes
  useEffect(() => {
    setSelectedImageIndex(null);
  }, [selectedProject]);

  // Keyboard navigation & body scroll lock for modal and lightbox
  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If Lightbox is active, prioritize lightbox navigation
      if (selectedImageIndex !== null && selectedProject.screenshots && selectedProject.screenshots.length > 0) {
        const count = selectedProject.screenshots.length;
        if (e.key === 'Escape') {
          setSelectedImageIndex(null);
        } else if (e.key === 'ArrowLeft') {
          setSelectedImageIndex(prev => (prev !== null && prev > 0 ? prev - 1 : count - 1));
        } else if (e.key === 'ArrowRight') {
          setSelectedImageIndex(prev => (prev !== null && prev < count - 1 ? prev + 1 : 0));
        }
        return;
      }

      if (e.key === 'Escape') {
        setSelectedProject(null);
      } else if (e.key === 'ArrowLeft') {
        const idx = PROJECTS_DATA.findIndex(p => p.id === selectedProject.id);
        if (idx > 0) setSelectedProject(PROJECTS_DATA[idx - 1]);
      } else if (e.key === 'ArrowRight') {
        const idx = PROJECTS_DATA.findIndex(p => p.id === selectedProject.id);
        if (idx < PROJECTS_DATA.length - 1) setSelectedProject(PROJECTS_DATA[idx + 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedProject, selectedImageIndex]);

  // Scroll Progress
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowScrollTop(latest > 400);
    });
  }, [scrollY]);

  // URL Hash Navigation (e.g. http://localhost:5173/#projects)
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = decodeURIComponent(hash.slice(1));
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Initial mount scroll after DOM elements are ready
    const timer = setTimeout(scrollToHash, 150);
    window.addEventListener('hashchange', scrollToHash);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('tnqhd1139@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProjects = PROJECTS_DATA.filter(project => {
    if (activeFilter === 'all') return true;
    return project.category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative selection:bg-blue-100 selection:text-blue-900">
      {/* Top Scroll Reading Progress */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 origin-left z-50 shadow-[0_0_12px_rgba(37,99,235,0.5)]"
      />

      {/* Floating Modern Header / Navbar */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-4xl">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-nav rounded-full px-5 py-3 flex items-center justify-between shadow-xl shadow-slate-200/60 border border-slate-200/90"
        >
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              FE
            </div>
            <span className="font-bold tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors text-sm md:text-base">
              Subong Park
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#about" className="hover:text-blue-600 transition-colors">소개</a>
            <a href="#skills" className="hover:text-blue-600 transition-colors">기술 스택</a>
            <a href="#projects" className="hover:text-blue-600 transition-colors">프로젝트</a>
            <a href="#experience" className="hover:text-blue-600 transition-colors">경력</a>
            <a href="#education" className="hover:text-blue-600 transition-colors">학력 및 자격</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition-all active:scale-95"
            >
              {copiedEmail ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-blue-600" />}
              <span>{copiedEmail ? 'COPIED!' : 'E-MAIL'}</span>
            </button>
            <a
              href="#contact"
              className="text-xs font-bold px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-95"
            >
              CONTACT
            </a>
          </div>
        </motion.nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 bg-grid-pattern">
        {/* Ambient Glowing Orbs (Soft Pastels for Light Theme) */}
        <div className="absolute top-1/4 -left-20 w-[30rem] h-[30rem] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-[28rem] h-[28rem] bg-indigo-300/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-cyan-200/25 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 max-w-5xl text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Status Pill Badge */}
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-slate-700 text-xs md:text-sm font-medium backdrop-blur-md shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Available for Work</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={fadeInUp} className="space-y-3 mb-6">
              <p className="text-lg md:text-2xl text-slate-500 font-semibold tracking-tight">
                디자인부터 백엔드까지, 서비스의 전 과정을 이해하고 개발하는
              </p>
              <div className="text-3xl md:text-5xl lg:text-6xl text-slate-900">
                프론트엔드 개발자
              </div>
              <h1 className="mt-[-12px] text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-slate-900">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent font-black">
                  박수봉
                </span>
                <span className="inline-block pl-4 text-slate-700 font-semibold tracking-tight">입니다.</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="max-w-4xl text-base md:text-xl text-slate-600 leading-relaxed font-normal mb-10 break-keep"
            >
              탄탄한 퍼블리싱 기본기, 백엔드 인프라 이해도를 갖춘 프론트엔드 개발자입니다.
              <br className="hidden sm:inline" />
              단순히 화면 구현에만 머무르지 않고, 서비스가 사용자에게 안정적으로 닿는 전 과정을 오너십을 갖고 만듭니다.
            </motion.p>

            {/* Quick Contact & Action Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-3.5 mb-14"
            >
              <a
                href="#projects"
                className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95"
              >
                <span>프로젝트 살펴보기</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold transition-all active:scale-95 shadow-sm"
              >
                {copiedEmail ? (
                  <>
                    <Check size={18} className="text-emerald-600" />
                    <span className="text-emerald-600 font-bold">복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Mail size={18} className="text-blue-600" />
                    <span>tnqhd1139@gmail.com</span>
                    <Copy size={15} className="text-slate-400 ml-1" />
                  </>
                )}
              </button>

              <a
                href="https://github.com/reality023"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold transition-all active:scale-95 shadow-sm group"
              >
                <GitBranch size={18} className="text-indigo-600 group-hover:rotate-12 transition-transform" />
                <span>GitHub</span>
                <ArrowUpRight size={15} className="text-slate-400" />
              </a>

              <a
                href="tel:010-2379-2622"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold transition-all active:scale-95 shadow-sm"
              >
                <Phone size={18} className="text-emerald-600" />
                <span>010-2379-2622</span>
              </a>
            </motion.div>

            {/* Quick Metrics Cards */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl"
            >
              {[
                {
                  icon: Layers,
                  title: '4+ Years Experience',
                  desc: '퍼블리셔로 다진 웹 표준 기본기 위에 프론트엔드 역량을 더한 4년',
                  color: 'from-blue-50/90 to-white',
                  borderColor: 'border-blue-100',
                  accent: 'text-blue-600'
                },
                {
                  icon: Workflow,
                  title: 'From Code to Deploy',
                  desc: '백엔드 API 연동부터 클라우드 인프라, 앱스토어 배포까지 완주한 경험',
                  color: 'from-indigo-50/90 to-white',
                  borderColor: 'border-indigo-100',
                  accent: 'text-indigo-600'
                },
                {
                  icon: MousePointerClick,
                  title: 'UI/UX & Interaction',
                  desc: '로딩, 에러, 완료 등 사용자의 모든 조작에 명확한 시각적 피드백과 모션 제공',
                  color: 'from-cyan-50/90 to-white',
                  borderColor: 'border-cyan-100',
                  accent: 'text-cyan-600'
                }
              ].map((card, idx) => (
                <div
                  key={idx}
                  className={`glass-card p-5 rounded-2xl text-left bg-gradient-to-br ${card.color} border ${card.borderColor} hover:border-blue-300 transition-all group`}
                >
                  <card.icon className={`w-6 h-6 ${card.accent} mb-3 group-hover:scale-110 transition-transform`} />
                  <h3 className="font-bold text-slate-900 text-base mb-1">{card.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed break-keep">{card.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 cursor-pointer pointer-events-auto"
          onClick={() => {
            const el = document.getElementById('about');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-[11px] font-mono tracking-widest uppercase">Scroll Down</span>
          <ArrowDown size={16} className="text-blue-600" />
        </motion.div>
      </section>

      {/* Main Content Container */}
      <main className="container mx-auto px-6 py-20 max-w-5xl space-y-32">
        {/* Section: About Me (Bento Grid) */}
        <motion.section
          id="about"
          className="scroll-mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="flex items-center gap-3 mb-10 border-b border-slate-200 pb-4">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <User size={22} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-bold">About Me</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">소개 및 개발 철학</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Primary Bento Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="md:col-span-2 glass-card p-8 rounded-3xl relative overflow-hidden border border-slate-200/80 bg-white"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold mb-4 border border-blue-200">
                  Core Mindset
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-snug break-keep">
                  "UI 인터랙션의 완성도에서 시작해,<br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    서비스가 동작하는 전 과정
                  </span>을 책임집니다."
                </h3>
                <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed break-keep">
                  <p>
                    웹 퍼블리셔로 개발을 시작하며 웹 표준과 마크업의 중요성을 배웠고, 매끄러운 반응성과 모션이 사용자 경험에 얼마나 큰 차이를 만드는지 경험했습니다.
                  </p>
                  <p>
                    하지만 화면 구현만으로는 좋은 서비스를 완성할 수 없다는 것을 느꼈습니다. 병목 없는 데이터 처리와 안정적인 배포 환경을 만들기 위해 On-Premise/NCP 인프라, Docker, FastAPI 백엔드, 앱스토어 배포까지 직접 부딪히며 서비스 전체의 흐름을 꿰뚫는 개발자로 성장해 왔습니다.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Profile Info Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 rounded-3xl flex flex-col justify-between border border-slate-200/80 bg-white"
            >
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <Fingerprint size={18} className="text-blue-600" />
                  프로필 요약
                </h4>
                <div className="space-y-3.5 text-sm">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <span className="text-slate-500">이름</span>
                    <span className="font-bold text-slate-900">박수봉 (Park Subong)</span>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <span className="text-slate-500">생년월일</span>
                    <span className="font-semibold text-slate-700">1997. 01. 28</span>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <span className="text-slate-500">전문 분야</span>
                    <span className="font-bold text-blue-600">Frontend</span>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <span className="text-slate-500">연락처</span>
                    <a href="tel:010-2379-2622" className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                      010-2379-2622
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">이메일</span>
                    <span className="font-mono text-xs text-slate-700">tnqhd1139@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <a
                  href="https://github.com/reality023"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 transition-colors shadow-sm"
                >
                  <GitBranch size={16} className="text-blue-600" />
                  GitHub 저장소 방문하기
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>

            {/* Sub Bento Card 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 rounded-3xl border border-slate-200/80 bg-white"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4">
                <AlertTriangle size={20} />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">예외 케이스를 먼저 챙기는 방어 코딩</h4>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed break-keep">
                네트워크 지연, 빈 데이터(Empty State), 서버 에러 등 시안에 없는 엣지 케이스를 먼저 시뮬레이션하고 방어 코드를 작성합니다.
              </p>
            </motion.div>

            {/* Sub Bento Card 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 rounded-3xl border border-slate-200/80 bg-white"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mb-4">
                <GitPullRequest size={20} />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">소통 비용을 낮추는 유연한 협업</h4>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed break-keep">
                디자이너와는 UI 디테일을 싱크하고 백엔드와는 API 스펙을 명확히 조율하여 재작업과 커뮤니케이션 비용을 최소화합니다.
              </p>
            </motion.div>

            {/* Sub Bento Card 3 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 rounded-3xl border border-slate-200/80 bg-white"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-4">
                <MousePointerClick size={20} />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">목적과 흐름이 있는 마이크로 인터랙션</h4>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed break-keep">
                과한 연출은 지양하고, Motion 라이브러리 등을 활용해 사용자의 집중을 방해하지 않는 자연스러운 화면 전환과 피드백을 설계합니다.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Section: Core Skills Matrix */}
        <motion.section
          id="skills"
          className="scroll-mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="flex items-center gap-3 mb-10 border-b border-slate-200 pb-4">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Code2 size={22} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-bold">Core Stack</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">기술 스택 & 핵심 역량</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                category: 'Frontend Development',
                icon: Layers,
                accent: 'text-blue-600',
                borderColor: 'border-blue-200',
                bgBadge: 'bg-blue-50',
                skills: [
                  { name: 'React', desc: '커스텀 훅을 통한 비즈니스 로직 분리 및 컴포넌트 최적화' },
                  { name: 'Next.js', desc: 'App Router, SSR/SSG, SEO 최적화 및 관리자 구축' },
                  { name: 'TypeScript', desc: 'API 응답 및 Props 인터페이스 정의로 런타임 타입 에러 차단' },
                  { name: 'Storybook', desc: '컴포넌트 문서화 및 스타일 가이드 작성' },
                  { name: 'Tailwind CSS', desc: '유틸리티 우선 CSS 실무 적용' },
                  { name: 'Framer Motion', desc: '자연스러운 화면 전환과 제스처/스프링 마이크로 인터랙션 구현' },
                  { name: 'React Query', desc: '서버 상태 캐싱 및 불필요한 재요청 방지' },
                  { name: 'Recoil / Zustand / Jotai', desc: '전역 클라이언트 상태 설계 및 효율적인 데이터 흐름 관리' }
                ]
              },
              {
                category: 'Backend & Cloud Infrastructure',
                icon: Server,
                accent: 'text-indigo-600',
                borderColor: 'border-indigo-200',
                bgBadge: 'bg-indigo-50',
                skills: [
                  { name: 'Python FastAPI / Flask', desc: '비동기 RESTful API 설계 및 데이터베이스 연동' },
                  { name: 'Docker & Docker Compose', desc: '개발 및 운영 서버 환경 격리 및 컨테이너화' },
                  { name: 'NCP / AWS (S3, EC2)', desc: '클라우드 인프라 세팅 및 S3 객체 스토리지 이관' },
                  { name: 'GitHub Actions', desc: 'CI/CD 빌드·테스트·배포 자동화 파이프라인 구축' },
                  { name: 'Supabase', desc: '실시간 DB, Storage, Auth 통합 백엔드 구성' }
                ]
              },
              {
                category: 'Mobile & Hybrid App',
                icon: Smartphone,
                accent: 'text-emerald-600',
                borderColor: 'border-emerald-200',
                bgBadge: 'bg-emerald-50',
                skills: [
                  { name: 'React Native (WebView)', desc: '네이티브 래핑 웹뷰 앱 개발 및 스토어 정식 배포' },
                  { name: 'Flutter', desc: '크로스플랫폼 모바일 앱 기획 및 인터랙티브 UI 개발' },
                  { name: 'Webview Bridge', desc: '앱-웹 간 양방향 이벤트 통신 및 네이티브 기능 제어' },
                  { name: 'Appstore / Playstore', desc: '앱스토어 & 구글플레이 심사 대응 및 출시 경험' }
                ]
              },
              {
                category: 'Integration & Ecosystem',
                icon: Terminal,
                accent: 'text-amber-600',
                borderColor: 'border-amber-200',
                bgBadge: 'bg-amber-50',
                skills: [
                  { name: 'Toss Payments', desc: '토스페이먼츠 PG 연동 (프론트엔드)' },
                  { name: 'MUX Video Streaming', desc: '적응형 비디오 스트리밍 API 연동 및 플레이어' },
                  { name: 'OAuth2 Social Login', desc: '카카오, 네이버, 구글, 애플 4종 소셜 로그인' },
                  { name: 'Vite / Webpack / CRA', desc: '프로젝트 보일러플레이트 세팅' }
                ]
              }
            ].map((group, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200/80 bg-white hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2.5 rounded-xl border ${group.borderColor} ${group.bgBadge} ${group.accent}`}>
                      <group.icon size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{group.category}</h3>
                  </div>

                  <div className="space-y-3">
                    {group.skills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-blue-50/40 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 text-sm">{skill.name}</span>
                          <CheckCircle2 size={15} className={group.accent} />
                        </div>
                        <p className="text-xs text-slate-500">{skill.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section: Projects (Interactive Filter & Cards) */}
        <motion.section
          id="projects"
          className="scroll-mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <FolderGit2 size={22} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 font-bold">Featured Works</span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">주요 프로젝트</h2>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start md:self-auto">
              {[
                { id: 'all', label: '전체 (4)' },
                { id: 'work', label: '실무 프로젝트 (3)' },
                { id: 'side', label: '사이드 프로젝트 (1)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors ${activeFilter === tab.id ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {activeFilter === tab.id && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((prj) => (
                <motion.div
                  key={prj.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedProject(prj)}
                  className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200/80 bg-white hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <span className={`text-[11px] font-bold font-mono uppercase px-3 py-1 rounded-full border ${prj.category === 'work'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                        {prj.categoryLabel}
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-medium">{prj.period}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {prj.title}
                    </h3>
                    <p className="text-xs md:text-sm text-blue-600 font-semibold mb-3">
                      {prj.subtitle}
                    </p>

                    {/* Team Members Tag */}
                    {prj.teamMembers && (
                      <div className="flex items-center gap-1.5 mb-4 text-xs text-slate-600 font-medium">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700">
                          <Users size={13} className="text-violet-600 flex-shrink-0" />
                          <span>{prj.teamMembers}</span>
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-slate-600 leading-relaxed mb-6 break-keep line-clamp-3">
                      {prj.summary}
                    </p>

                    {/* Highlights Preview */}
                    <div className="space-y-2 mb-6">
                      {prj.details.map((d, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <ChevronRight size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="break-keep leading-relaxed">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Tech Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {prj.tech.map(t => (
                        <span
                          key={t}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Action Link */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                      <span className="flex items-center gap-1.5">
                        <Eye size={15} />
                        자세한 성과 및 기술 보기
                      </span>
                      <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Section: Work Experience Timeline */}
        <motion.section
          id="experience"
          className="scroll-mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="flex items-center gap-3 mb-10 border-b border-slate-200 pb-4">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Briefcase size={22} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 font-bold">Career History</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">경력 사항</h2>
            </div>
          </div>

          <div className="relative pl-6 md:pl-10 space-y-10 border-l-2 border-slate-200">
            {[
              {
                period: '2024.09 ~ 2025.03',
                company: '주식회사 소프트스퀘어드',
                role: '프론트엔드 개발자 (프리랜서)',
                desc: '개인 맞춤형 건강 관리 및 챌린지 서비스인 Hi-ME의 프론트엔드 웹뷰 개발을 전담하였습니다. React와 React Query 기반으로 서버 상태를 최적화하고 모바일 앱 연동 웹뷰 인터랙션을 완성했습니다.',
                tags: ['React', 'Tailwind CSS', 'React Query', 'TypeScript', 'Webview Bridge']
              },
              {
                period: '2024.09 ~ 2025.03',
                company: '(주) 에코트로닉스',
                role: '풀스택 개발자 (책임)',
                desc: 'CSO 계약 & 실적 관리 플랫폼 ValueLink 및 CPLink 개발을 주도하였습니다. 온프레미스 및 NCP 클라우드 인프라(Docker, GitHub Actions)를 구축하고 FastAPI 백엔드 및 Next.js 프론트엔드 전체 파이프라인을 구축했습니다.',
                tags: ['Next.js', 'FastAPI', 'NCP', 'Docker', 'GitHub Actions', 'AWS S3', 'Recoil']
              },
              {
                period: '2022.12 ~ 2024.06',
                company: '(주) 라우드',
                role: '프론트엔드 개발자 (책임)',
                desc: 'B2B 인테리어 쇼핑몰 DearMyHome의 유저 플랫폼(CRA)과 통합 관리자 대시보드(Next.js)를 구축했습니다. 토스페이먼츠 PG 결제 연동, 소셜 로그인 4종 연동, 그리고 React Native WebView 기반 iOS/Android 양대 마켓 앱을 출시했습니다.',
                tags: ['React', 'Next.js', 'Redux Toolkit', 'Toss Payments', 'React Native WebView', 'AWS']
              },
              {
                period: '2022.09 ~ 2022.12',
                company: '(주) 앤코어스',
                role: '프론트엔드 개발자',
                desc: '신규 모바일 앱 서비스를 홍보하는 반응형 인터랙티브 랜딩 페이지를 제작하였습니다.',
                tags: ['React', 'JavaScript', 'HTML5/CSS3', 'Responsive Web']
              },
              {
                period: '2020.05 ~ 2021.07',
                company: '(주) 아가도스',
                role: '웹 퍼블리셔 (주임)',
                desc: 'AGADOS 노코드 플랫폼의 핵심 UI 컴포넌트 제작 및 크로스 브라우징 웹 표준 퍼블리싱 업무를 수행하며 UI 기본기를 확립했습니다.',
                tags: ['HTML5', 'CSS3', 'JavaScript', 'Cross-Browsing', 'Web Standards']
              }
            ].map((exp, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Node */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-600 group-hover:scale-125 group-hover:bg-blue-600 transition-all duration-300 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />

                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200/80 bg-white hover:border-blue-300 transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs text-blue-600 font-bold">{exp.period}</span>
                    <span className="inline-block self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {exp.role}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                    {exp.company}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed break-keep mb-5">
                    {exp.desc}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map(t => (
                      <span key={t} className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        #{t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section: Education & Certifications (Bento Grid) */}
        <motion.section
          id="education"
          className="scroll-mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education Card */}
            <div>
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
                  <GraduationCap size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">교육 및 학력</h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: '오산대학교 컴퓨터 정보과 졸업',
                    date: '2015.03 ~ 2017.02',
                    note: '학점 4.03 / 4.50'
                  },
                  {
                    title: '스파르타 코딩클럽 앱 개발 수료',
                    date: '2025.05 ~ 2025.10',
                    note: 'Flutter & 모바일 앱 풀사이클 개발'
                  },
                  {
                    title: '스파르타 코딩클럽 항해99 수료',
                    date: '2022.05 ~ 2022.08',
                    note: 'React 심화 및 실전 팀 프로젝트'
                  },
                  {
                    title: '더조은컴퓨터아트학원 UI/UX 과정',
                    date: '2019.01 ~ 2019.08',
                    note: '웹 퍼블리싱 및 UI/UX 디자인 기초'
                  }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -3 }}
                    className="glass-card p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-300 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                      <span className="text-xs font-mono text-slate-500 whitespace-nowrap">{item.date}</span>
                    </div>
                    <p className="text-xs font-semibold text-purple-600">{item.note}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications Card */}
            <div>
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                  <Award size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">보유 자격증</h3>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {[
                  { name: '정보처리 산업기사', org: '한국산업인력공단', highlight: true },
                  { name: 'JLPT N3', org: '일본어 능력 시험', highlight: false },
                  { name: '컴퓨터 그래픽스 운용 기능사', org: '한국산업인력공단', highlight: false },
                  { name: 'GTQ 포토샵 1급', org: '한국생산성본부', highlight: false },
                  { name: '웹 디자인 기능사', org: '한국산업인력공단', highlight: false }
                ].map((cert, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -3 }}
                    className={`glass-card p-4 rounded-2xl border ${cert.highlight
                      ? 'border-amber-300 bg-amber-50/50'
                      : 'border-slate-200/80 bg-white'
                      } flex items-center justify-between transition-all shadow-sm`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${cert.highlight ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]' : 'bg-slate-400'}`} />
                      <span className="font-bold text-slate-800 text-sm">{cert.name}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{cert.org}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section: Contact & CTA */}
        <motion.section
          id="contact"
          className="scroll-mt-28 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="glass-card p-8 md:p-14 rounded-3xl border border-slate-200/90 relative overflow-hidden text-center bg-gradient-to-b from-blue-50/70 via-white to-slate-50 shadow-xl shadow-slate-200/50">
            {/* Ambient Lighting */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold mb-4 border border-blue-200">
                Get in Touch
              </span>

              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight break-keep">
                사용자 경험에 진심이고, 주도적으로 문제를 해결하는 개발자를 찾으시나요?
              </h2>

              <p className="text-sm md:text-base text-slate-600 mb-10 leading-relaxed break-keep">
                섬세한 UI 디테일부터 안정적인 배포 파이프라인까지, 오너십을 갖고 서비스를 완성해 나갑니다.
                <br className="hidden sm:inline" />
                프론트엔드 포지션 채용이나 협업 제안, 커피챗 등 언제든 편하게 연락해 주세요!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:tnqhd1139@gmail.com"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                >
                  <Mail size={18} />
                  <span>이메일 보내기</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold transition-all active:scale-95 shadow-sm"
                >
                  {copiedEmail ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} className="text-blue-600" />}
                  <span>{copiedEmail ? '클립보드 복사됨!' : '이메일 주소 복사'}</span>
                </button>

                <a
                  href="tel:010-2379-2622"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold transition-all active:scale-95 shadow-sm"
                >
                  <Phone size={18} className="text-emerald-600" />
                  <span>010-2379-2622</span>
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 mt-20">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-800">박수봉 (Park Subong) · Portfolio</p>
            <p className="mt-1 text-slate-500">Designed & Built with React, Tailwind CSS v4 & Framer Motion.</p>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="https://github.com/reality023" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
              GitHub
            </a>
            <a href="mailto:tnqhd1139@gmail.com" className="hover:text-blue-600 transition-colors">
              Email
            </a>
            <a href="tel:010-2379-2622" className="hover:text-blue-600 transition-colors">
              Phone
            </a>
            <button onClick={scrollToTop} className="hover:text-blue-600 transition-colors flex items-center gap-1">
              Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white text-blue-600 border border-slate-200 shadow-xl shadow-slate-300/60 hover:bg-slate-50 transition-colors active:scale-90"
            aria-label="맨 위로 이동"
          >
            <ArrowUpRight size={20} className="-rotate-45" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Interactive Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200/90 bg-white shadow-2xl z-10 text-slate-900 overflow-hidden"
            >
              {/* Modal Top Sticky Header Bar */}
              <div className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${selectedProject.category === 'work'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                    {selectedProject.categoryLabel}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    PROJECT · 0{currentIndex + 1} / 0{PROJECTS_DATA.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Prev / Next Quick Nav Controls */}
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-0.5 text-slate-600">
                    <button
                      onClick={() => prevProject && setSelectedProject(prevProject)}
                      disabled={!prevProject}
                      className="p-1.5 rounded-lg hover:bg-white hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                      title={prevProject ? `이전: ${prevProject.title}` : '첫 번째 프로젝트입니다'}
                      aria-label="이전 프로젝트"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div className="w-px h-3.5 bg-slate-200 mx-0.5" />
                    <button
                      onClick={() => nextProject && setSelectedProject(nextProject)}
                      disabled={!nextProject}
                      className="p-1.5 rounded-lg hover:bg-white hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                      title={nextProject ? `다음: ${nextProject.title}` : '마지막 프로젝트입니다'}
                      aria-label="다음 프로젝트"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 border border-slate-200/80 transition-all hover:rotate-90 active:scale-95 ml-1 cursor-pointer"
                    aria-label="모달 닫기"
                    title="닫기 (ESC)"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Scrollable Modal Body */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 sm:px-10 py-6 sm:py-8 space-y-6 sm:space-y-7 relative">
                {/* Ambient Glows inside modal (clipped to avoid horizontal scrollbar) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -mr-10 -mt-10" />
                  <div className="absolute top-1/2 left-0 w-80 h-80 bg-indigo-50/40 rounded-full blur-3xl -ml-10" />
                </div>

                {/* Hero Header & Overview Area */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono text-slate-400">
                    <span className="text-blue-600 font-bold uppercase tracking-wider">PROJECT DEEP-DIVE</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      {selectedProject.period}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-500 font-semibold mb-4 leading-normal">
                    {selectedProject.subtitle}
                  </p>

                  {/* Simple Screenshots Preview Gallery */}
                  {selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between gap-2 mb-2.5 px-0.5">
                        <div className="flex items-center gap-2">
                        </div>

                        {/* Navigation Scroll Buttons */}
                        {selectedProject.screenshots.length > 1 && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleGalleryScroll('left')}
                              disabled={!canScrollLeft}
                              className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
                              title="이전 화면 보기"
                              aria-label="이전 화면 보기"
                            >
                              <ChevronLeft size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleGalleryScroll('right')}
                              disabled={!canScrollRight}
                              className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
                              title="다음 화면 보기"
                              aria-label="다음 화면 보기"
                            >
                              <ChevronRight size={15} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Horizontal Scroll & Drag Gallery */}
                      <div className="relative">
                        <div
                          ref={galleryRef}
                          onMouseDown={handleGalleryMouseDown}
                          onMouseMove={handleGalleryMouseMove}
                          onMouseUp={handleGalleryMouseUp}
                          onMouseLeave={handleGalleryMouseUp}
                          className="flex gap-3 sm:gap-4 overflow-x-auto -mx-2 sm:-mx-3 px-2 sm:px-3 pt-2 pb-3.5 scroll-smooth select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] scrollbar-thumb-slate-200 scrollbar-track-transparent"
                        >
                          {selectedProject.screenshots.map((item, idx) => {
                            const data = getScreenshotData(item, idx);

                            return (
                              <div
                                key={idx}
                                onClick={() => {
                                  if (dragDistance.current < 6) {
                                    setSelectedImageIndex(idx);
                                  }
                                }}
                                className="group flex-shrink-0 cursor-pointer snap-start relative rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-50 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all duration-200 p-[16px]"
                              >
                                <img
                                  src={data.src}
                                  alt={data.alt}
                                  className="h-56 sm:h-64 md:h-72 w-auto object-contain pointer-events-none transition-transform duration-300 group-hover:scale-[1.02]"
                                  loading="lazy"
                                  draggable={false}
                                />
                                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center pointer-events-none">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-sm">
                                    <ZoomIn size={12} />
                                    <span>확대</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {/* Trailing spacer to prevent shadow clipping at scroll end */}
                          <div className="w-1.5 flex-shrink-0" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vertical Metadata Spec List */}
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5 backdrop-blur-xs mb-3.5">
                    <div className="divide-y divide-slate-200/60">
                      {/* Period */}
                      <div className="py-2 first:pt-0 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 sm:w-36 flex-shrink-0">
                          <Calendar size={14} className="text-blue-600" />
                          진행 기간
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 break-keep">
                          {selectedProject.period}
                        </span>
                      </div>

                      {/* Role */}
                      <div className="py-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 sm:w-36 flex-shrink-0">
                          <User size={14} className="text-indigo-600" />
                          담당 역할
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 break-keep">
                          {selectedProject.role}
                        </span>
                      </div>

                      {/* Team Composition */}
                      {selectedProject.teamMembers && (
                        <div className="py-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 sm:w-36 flex-shrink-0">
                            <Users size={14} className="text-violet-600" />
                            팀 구성
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 break-keep">
                            {selectedProject.teamMembers}
                          </span>
                        </div>
                      )}

                      {/* Platform */}
                      <div className="py-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 sm:w-36 flex-shrink-0">
                          <Smartphone size={14} className="text-cyan-600" />
                          서비스 형태
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 break-keep">
                          {selectedProject.platform || '웹 / 모바일'}
                        </span>
                      </div>

                      {/* Team / Contribution */}
                      <div className="py-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 sm:w-36 flex-shrink-0">
                          <Workflow size={14} className="text-emerald-600" />
                          기여도 & 포지션
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 break-keep">
                          {selectedProject.team || selectedProject.role}
                        </span>
                      </div>

                      {/* Service Links (if any) */}
                      {selectedProject.links && (
                        <div className="py-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 sm:w-36 flex-shrink-0">
                            <ExternalLink size={14} className="text-blue-600" />
                            서비스 링크
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            {selectedProject.links.appStore && (
                              <a
                                href={selectedProject.links.appStore}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold shadow-2xs transition-all active:scale-95 group"
                              >
                                <Smartphone size={12} className="text-blue-400 group-hover:text-white transition-colors" />
                                <span>App Store</span>
                                <ArrowUpRight size={12} className="text-slate-400 group-hover:text-white transition-colors" />
                              </a>
                            )}
                            {selectedProject.links.playStore && (
                              <a
                                href={selectedProject.links.playStore}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200/90 shadow-2xs transition-all active:scale-95 group"
                              >
                                <span>Google Play</span>
                                <ArrowUpRight size={12} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                              </a>
                            )}
                            {selectedProject.links.web && (
                              <a
                                href={selectedProject.links.web}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200/90 shadow-2xs transition-all active:scale-95 group"
                              >
                                <span>웹사이트</span>
                                <ArrowUpRight size={12} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                              </a>
                            )}
                            {selectedProject.links.github && (
                              <a
                                href={selectedProject.links.github}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200/90 shadow-2xs transition-all active:scale-95 group"
                              >
                                <span>GitHub</span>
                                <ArrowUpRight size={12} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tech Stack */}
                      <div className="py-2 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 sm:w-36 flex-shrink-0">
                          <Layers size={14} className="text-purple-600" />
                          주요 기술
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {selectedProject.tech.map(t => (
                            <span
                              key={t}
                              className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-white text-slate-700 font-semibold border border-slate-200/90 shadow-2xs"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Executive Summary Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white border border-blue-100 shadow-xs">
                    <div className="flex items-center gap-2 mb-1.5 text-xs font-mono uppercase tracking-wider text-blue-800 font-bold">
                      <FileText size={15} className="text-blue-600" />
                      <span>프로젝트 개요 (Executive Summary)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-keep font-medium">
                      {selectedProject.summary}
                    </p>
                  </div>
                </div>

                {/* Key Achievements Cards */}
                {selectedProject.metrics && (
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        <span>핵심 기술 성과 및 비즈니스 임팩트</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">3 Key Highlights</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {selectedProject.metrics.map((m, i) => (
                        <div
                          key={i}
                          className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 border border-slate-200/90 hover:border-blue-300 flex flex-col justify-between text-left shadow-xs hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-lg">
                              0{i + 1}
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <CheckCircle2 size={15} />
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug break-keep">
                            {m}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Markdown Section */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3.5 text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                    <Terminal size={15} className="text-indigo-600" />
                    <span>상세 개발 내용 & 트러블슈팅 케이스</span>
                  </div>

                  {selectedProject.content ? (
                    <div className="p-6 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-xs text-slate-800 max-w-full overflow-hidden break-words">
                      <selectedProject.content components={mdxComponents} />
                    </div>
                  ) : selectedProject.markdown ? (
                    <div className="p-6 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-xs text-slate-800 max-w-full overflow-hidden break-words">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={mdxComponents}
                      >
                        {selectedProject.markdown}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedProject.details.map((d, i) => (
                        <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                          <ChevronRight size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="break-keep leading-relaxed">{d}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Sticky Navigation Bar */}
              <div className="sticky bottom-0 z-30 px-5 sm:px-8 py-3.5 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-between gap-3">
                {prevProject ? (
                  <button
                    onClick={() => setSelectedProject(prevProject)}
                    className="group flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors max-w-[35%] truncate cursor-pointer"
                  >
                    <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform flex-shrink-0 text-slate-400 group-hover:text-blue-600" />
                    <span className="truncate">이전: {prevProject.title}</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-300 font-mono">FIRST PROJECT</span>
                )}

                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex-shrink-0 cursor-pointer"
                >
                  목록으로 닫기
                </button>

                {nextProject ? (
                  <button
                    onClick={() => setSelectedProject(nextProject)}
                    className="group flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors max-w-[35%] truncate ml-auto cursor-pointer"
                  >
                    <span className="truncate">다음: {nextProject.title}</span>
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform flex-shrink-0 text-slate-400 group-hover:text-blue-600" />
                  </button>
                ) : (
                  <span className="text-xs text-slate-300 font-mono ml-auto">LAST PROJECT</span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Screenshot Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && selectedProject?.screenshots && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImageIndex(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md cursor-zoom-out"
            />

            {/* Lightbox Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[92vh] w-full flex flex-col bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 text-white"
            >
              {(() => {
                const item = selectedProject.screenshots[selectedImageIndex];
                if (!item) return null;
                const data = getScreenshotData(item, selectedImageIndex);
                const totalCount = selectedProject.screenshots.length;

                return (
                  <>
                    {/* Lightbox Header */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900/95 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                        <span className="font-mono font-bold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800/80 text-[11px]">
                          {selectedImageIndex + 1} / {totalCount}
                        </span>
                        <span className="text-slate-300 font-medium truncate">
                          {data.caption || `${selectedProject.title} 서비스 화면`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {totalCount > 1 && (
                          <div className="flex items-center gap-1 mr-2 border-r border-slate-800 pr-2">
                            <button
                              onClick={() => setSelectedImageIndex(prev => (prev !== null && prev > 0 ? prev - 1 : totalCount - 1))}
                              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                              title="이전 이미지 (←)"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button
                              onClick={() => setSelectedImageIndex(prev => (prev !== null && prev < totalCount - 1 ? prev + 1 : 0))}
                              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                              title="다음 이미지 (→)"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => setSelectedImageIndex(null)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          title="닫기 (ESC)"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Lightbox Image Viewport */}
                    <div className="relative flex-1 p-3 sm:p-6 flex items-center justify-center overflow-auto max-h-[calc(92vh-100px)] bg-slate-950/70">
                      {totalCount > 1 && (
                        <>
                          <button
                            onClick={() => setSelectedImageIndex(prev => (prev !== null && prev > 0 ? prev - 1 : totalCount - 1))}
                            className="absolute left-3 sm:left-5 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 shadow-lg backdrop-blur-xs transition-all cursor-pointer"
                            title="이전 이미지 (←)"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={() => setSelectedImageIndex(prev => (prev !== null && prev < totalCount - 1 ? prev + 1 : 0))}
                            className="absolute right-3 sm:right-5 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 shadow-lg backdrop-blur-xs transition-all cursor-pointer"
                            title="다음 이미지 (→)"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}

                      <img
                        src={data.src}
                        alt={data.alt}
                        className="max-h-[calc(92vh-130px)] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl select-none"
                      />
                    </div>

                    {/* Lightbox Caption Footer */}
                    {data.caption && (
                      <div className="px-5 py-3 bg-slate-900/90 border-t border-slate-800 text-center">
                        <p className="text-xs sm:text-sm text-slate-300 font-medium break-keep">
                          {data.caption}
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email Copied Floating Toast Notification */}
      <AnimatePresence>
        {copiedEmail && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-2xl shadow-slate-900/30 backdrop-blur-xl"
          >
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-xs md:text-sm font-semibold">
              이메일 주소(tnqhd1139@gmail.com)가 복사되었습니다!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
