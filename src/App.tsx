import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Mail,
  Phone,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  Rocket,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  Terminal,
  Smartphone,
  Server,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDown,
  X,
  ShieldCheck,
  HeartHandshake,
  Eye,
  GitBranch
} from 'lucide-react';

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

// Types
interface ProjectItem {
  id: string;
  category: 'work' | 'side';
  categoryLabel: string;
  title: string;
  subtitle: string;
  period: string;
  role: string;
  tech: string[];
  summary: string;
  details: string[];
  metrics?: string[];
  features?: string[];
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'hi-me',
    category: 'work',
    categoryLabel: '실무 프로젝트',
    title: 'Hi-Me (맞춤 운동 챌린지 서비스)',
    subtitle: '개인 맞춤형 건강 관리 & 챌린지 웹뷰 서비스',
    period: '2024.12 ~ 2025.04',
    role: '프론트엔드 개발 (웹뷰 퍼블리싱 & 기능 구현)',
    tech: ['React', 'Tailwind CSS', 'React Query', 'TypeScript', 'Webview Bridge'],
    summary: '사용자 맞춤형 건강 관리 및 운동 챌린지를 제공하는 서비스로, 모바일 앱 내 하이브리드 웹뷰 화면과 미션 수행 기능을 주도적으로 개발했습니다.',
    details: [
      '미션 기능 웹뷰 화면 전체 퍼블리싱 및 반응형 UI/UX 구축',
      'React Query를 도입하여 서버 데이터 캐싱 및 미션 상태 실시간 동기화',
      '네이티브 앱과의 안정적인 통신을 위한 Webview Bridge 연동 프로토콜 구성',
      '다양한 모바일 해상도 및 OS별 렌더링 오차를 고려한 크로스 브라우징 대응'
    ],
    metrics: ['앱 내 미션 참여율 증대', '서버 데이터 재요청 최적화', '네이티브-웹뷰 통신 안정화']
  },
  {
    id: 'valuelink',
    category: 'work',
    categoryLabel: '실무 프로젝트',
    title: 'ValueLink / CPLink',
    subtitle: 'CSO 계약 & 실적 관리 엔터프라이즈 플랫폼',
    period: '2024.09 ~ 2025.03',
    role: '풀스택 개발자 (책임) · 인프라 구축 & 기능 개발',
    tech: ['Next.js', 'FastAPI', 'NCP', 'Docker', 'GitHub Actions', 'Recoil', 'AWS S3'],
    summary: '제약 CSO 업계의 복잡한 전자계약 및 대용량 실적 데이터를 효율적으로 정산·관리하는 B2B 플랫폼으로, 온프레미스/클라우드 인프라 구축부터 백엔드 API, 프론트엔드까지 전 과정을 책임 개발했습니다.',
    details: [
      '로컬 파일 저장 구조의 병목 문제를 해결하기 위해 AWS S3 객체 스토리지 기반으로 시스템 아키텍처 전면 개편',
      'On-Premise 및 NCP 운영 서버 환경 Docker 컨테이너화 및 GitHub Actions CI/CD 파이프라인 구축',
      '전자계약 체결 워크플로우 및 대규모 실적 데이터 집계/조회 기능 개발',
      'FastAPI 비동기 쿼리 최적화로 복잡한 정산 데이터 조회 속도 대폭 개선'
    ],
    metrics: ['파일 저장 및 다운로드 안정성 100% 확보', '배포 프로세스 자동화 (CI/CD)', '실적 쿼리 응답 속도 최적화']
  },
  {
    id: 'dearmyhome',
    category: 'work',
    categoryLabel: '실무 프로젝트',
    title: 'DearMyHome',
    subtitle: 'B2B 인테리어 쇼핑몰 & 전사 어드민 관리 시스템',
    period: '2022.12 ~ 2024.06',
    role: '프론트엔드 책임 개발 · 유저/어드민/앱 출시',
    tech: ['React', 'Next.js', 'Redux Toolkit', 'Toss Payments', 'React Native', 'AWS'],
    summary: '인테리어 자재 B2B 이커머스 서비스로, 일반 고객용 웹 플랫폼(CRA)과 내부 운영자를 위한 통합 어드민(Next.js), 그리고 양대 마켓 모바일 앱(React Native WebView)을 모두 단독 및 리드로 구축했습니다.',
    details: [
      '프로젝트 초기 아키텍처 설계 (CRA 유저 쇼핑몰 & Next.js 관리자 전용 대시보드 분리 구축)',
      '토스 페이먼츠(Toss Payments) PG 연동을 통한 결제, 취소, 부분 환불 결제 플로우 완성',
      '네이버, 구글, 애플, 카카오 4대 소셜 로그인 OAuth2 통합 연동',
      '주문/배송/상품/정산/회원 관리를 위한 대규모 관리자 시스템 풀스택 구현',
      'React Native WebView 래핑을 통한 iOS App Store 및 Google Play Store 정식 앱 출시 및 심사 통과'
    ],
    metrics: ['양대 앱 마켓 정식 런칭', '결제 및 소셜 로그인 통합 연동', 'B2B 운영 효율성 향상']
  },
  {
    id: 'pome',
    category: 'side',
    categoryLabel: '사이드 프로젝트',
    title: 'POME (맞춤 운동 영상 서비스)',
    subtitle: 'MUX 스트리밍 & Supabase 기반 크로스플랫폼 운동 앱',
    period: '개인 사이드 프로젝트',
    role: '기획 · 디자인 · Full-Stack 개발 (1인 개발)',
    tech: ['Flutter', 'FastAPI', 'AWS S3', 'MUX Video', 'Supabase'],
    summary: '개인 맞춤형 운동 영상을 고화질로 스트리밍하고 운동 루틴을 기록할 수 있는 모바일 서비스로, 서비스 기획부터 API, 비디오 인코딩 파이프라인, Flutter 앱까지 1인 풀스택으로 완성했습니다.',
    details: [
      'MUX Video API를 연동하여 네트워크 대역폭에 따른 적응형 HLS 스트리밍 환경 구현',
      'FastAPI 기반 RESTful 백엔드 구축 및 AWS S3 비디오 원본 스토리지 연동',
      'Supabase를 활용한 실시간 데이터베이스 및 인증(Auth) 시스템 구축',
      'Flutter를 통한 유려한 마이크로 인터랙션과 반응형 모바일 UI 구현'
    ],
    metrics: ['적응형 스트리밍 구현', '1인 풀사이클 개발 완성', '크로스플랫폼 모바일 앱']
  }
];

export default function App() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'work' | 'side'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
              PS
            </div>
            <span className="font-bold tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors text-sm md:text-base">
              박수봉 <span className="text-blue-600 font-mono text-xs">.dev</span>
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
              <span>{copiedEmail ? '복사됨!' : '이메일 복사'}</span>
            </button>
            <a
              href="#contact"
              className="text-xs font-bold px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-95"
            >
              연락하기
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
                <span>Open for Opportunities & Collaboration</span>
                <span className="text-slate-300">|</span>
                <span className="text-blue-600 font-bold">새로운 기회를 찾고 있습니다</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={fadeInUp} className="space-y-3 mb-6">
              <p className="text-lg md:text-2xl text-slate-500 font-semibold tracking-tight">
                디테일한 UI/UX와 생동감 있는 인터랙션을 만드는
              </p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] text-slate-900">
                <span>프론트엔드 개발자 </span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  박수봉
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="max-w-2xl text-base md:text-xl text-slate-600 leading-relaxed font-normal mb-10 break-keep"
            >
              퍼블리싱 기반의 섬세한 UI 감각과 클라우드·백엔드 인프라 이해도를 바탕으로,
              <br className="hidden sm:inline" />
              인터랙션의 완성도부터 서비스 전체 생명주기까지 주도적으로 완성합니다.
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
                  desc: '퍼블리셔에서 프론트·풀스택으로 확장된 탄탄한 기본기',
                  color: 'from-blue-50/90 to-white',
                  borderColor: 'border-blue-100',
                  accent: 'text-blue-600'
                },
                {
                  icon: Rocket,
                  title: 'Full Lifecycle Ownership',
                  desc: '인프라 구축, 백엔드 API, 웹뷰 및 양대 앱 스토어 출시 경험',
                  color: 'from-indigo-50/90 to-white',
                  borderColor: 'border-indigo-100',
                  accent: 'text-indigo-600'
                },
                {
                  icon: Sparkles,
                  title: 'UI/UX & Interactions',
                  desc: '모션 라이브러리와 마이크로 인터랙션 중심의 탁월한 사용자 경험',
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
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="flex items-center gap-3 mb-10 border-b border-slate-200 pb-4">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Rocket size={22} />
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
                  "퍼블리싱 기반의 높은 UI/UX 이해도로,<br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    인터랙션부터 클라우드 배포까지
                  </span> 책임집니다."
                </h3>
                <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed break-keep">
                  <p>
                    웹 퍼블리셔로 시작하여 웹 표준과 마이크로 인터랙션의 가치를 깊이 체감했습니다. 사용자가 마주하는 첫 찰나의 사용성과 부드러운 반응성이 서비스 신뢰도를 결정한다고 믿습니다.
                  </p>
                  <p>
                    단순히 기획서에 명시된 화면만을 찍어내는 것을 넘어, 비즈니스 목표를 온전히 구현하기 위해 On-Premise 및 NCP/AWS 인프라, Docker 환경 세팅, FastAPI 백엔드 개발, 그리고 하이브리드 앱 배포까지 프로젝트 전체 생명주기를 아우르는 시야를 갖추었습니다.
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
                  <Sparkles size={18} className="text-blue-600" />
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
                    <span className="font-bold text-blue-600">Frontend / Fullstack</span>
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
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">철저한 리스크 관리</h4>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed break-keep">
                신중하고 꼼꼼한 성향으로 잠재적 예외 케이스와 네트워크 에러, 엣지 케이스를 사전에 시뮬레이션하고 방어하여 서비스의 신뢰성을 보장합니다.
              </p>
            </motion.div>

            {/* Sub Bento Card 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 rounded-3xl border border-slate-200/80 bg-white"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mb-4">
                <HeartHandshake size={20} />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">투명하고 능동적인 협업</h4>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed break-keep">
                문서화와 기술 싱크를 체계화하여 기획자, 디자이너, 백엔드 개발자와의 오해 없는 소통을 주도하고 프로젝트의 안정적인 마일스톤을 달성합니다.
              </p>
            </motion.div>

            {/* Sub Bento Card 3 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 rounded-3xl border border-slate-200/80 bg-white"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">살아 숨쉬는 인터랙션</h4>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed break-keep">
                Framer Motion을 활용한 마이크로 애니메이션, 시각적 피드백, 반응형 전환 효과를 통해 유저가 서비스를 직관적이고 즐겁게 탐색하도록 설계합니다.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Section: Core Skills Matrix */}
        <motion.section
          id="skills"
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
                  { name: 'React', desc: '함수형 컴포넌트, 커스텀 훅, 상태 관리 및 최적화' },
                  { name: 'Next.js', desc: 'App/Pages Router, SSR/SSG, SEO 최적화 및 관리자 구축' },
                  { name: 'TypeScript', desc: '엄격한 타입 안전성 확보 및 유지보수성 향상' },
                  { name: 'Tailwind CSS', desc: '유틸리티 우선 CSS 및 최신 v4 아키텍처 실무 적용' },
                  { name: 'Framer Motion', desc: '풍부한 마이크로 인터랙션, 페이지 전환, 스프링 모션' },
                  { name: 'React Query / Recoil', desc: '서버 상태 캐싱 및 전역 클라이언트 상태 설계' }
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
                  { name: 'Toss Payments', desc: '토스페이먼츠 PG 연동, 결제/취소/부분환불 프로세스' },
                  { name: 'MUX Video Streaming', desc: '적응형 비디오 스트리밍 API 연동 및 플레이어' },
                  { name: 'OAuth2 Social Login', desc: '카카오, 네이버, 구글, 애플 4종 소셜 로그인' },
                  { name: 'Vite / Webpack / CRA', desc: '번들러 최적화 및 신규 프로젝트 보일러플레이트 세팅' }
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
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <Award size={22} />
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
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    activeFilter === tab.id ? 'text-white' : 'text-slate-600 hover:text-slate-900'
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
                      <span className={`text-[11px] font-bold font-mono uppercase px-3 py-1 rounded-full border ${
                        prj.category === 'work'
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
                    <p className="text-xs md:text-sm text-blue-600 font-semibold mb-4">
                      {prj.subtitle}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6 break-keep line-clamp-3">
                      {prj.summary}
                    </p>

                    {/* Highlights Preview */}
                    <div className="space-y-2 mb-6">
                      {prj.details.slice(0, 2).map((d, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                          <ChevronRight size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{d}</span>
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
                desc: '신규 모바일 앱 서비스를 홍보하는 반응형 인터랙티브 랜딩 페이지를 기획/제작하여 사용자 전환율을 향상시켰습니다.',
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
                    className={`glass-card p-4 rounded-2xl border ${
                      cert.highlight
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
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="relative"
        >
          <div className="glass-card p-8 md:p-14 rounded-3xl border border-slate-200/90 relative overflow-hidden text-center bg-gradient-to-b from-blue-50/70 via-white to-slate-50 shadow-xl shadow-slate-200/50">
            {/* Ambient Lighting */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold mb-4 border border-blue-200">
                Let's Build Something Great Together
              </span>

              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight break-keep">
                함께 성장하고 멋진 서비스를 만들 동료를 찾으시나요?
              </h2>

              <p className="text-sm md:text-base text-slate-600 mb-10 leading-relaxed break-keep">
                사용자 중심의 인터랙션과 안정적인 인프라를 바탕으로 팀의 비전을 기술로 완성해내겠습니다.
                채용 문의나 프로젝트 제안 등 언제든 편하게 연락해 주세요!
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-2xl z-10 text-slate-900"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                aria-label="모달 닫기"
              >
                <X size={18} />
              </button>

              <div className="mb-4">
                <span className={`text-[11px] font-mono uppercase px-3 py-1 rounded-full border ${
                  selectedProject.category === 'work'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  {selectedProject.categoryLabel}
                </span>
                <span className="ml-3 text-xs font-mono text-slate-500 font-semibold">{selectedProject.period}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                {selectedProject.title}
              </h3>
              <p className="text-blue-600 font-bold text-sm mb-6">
                역할: {selectedProject.role}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 font-bold">프로젝트 개요</h4>
                <p className="text-sm text-slate-700 leading-relaxed break-keep">
                  {selectedProject.summary}
                </p>
              </div>

              {selectedProject.metrics && (
                <div className="mb-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 font-bold">핵심 성과 & 임팩트</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {selectedProject.metrics.map((m, i) => (
                      <div key={i} className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 text-center">
                        <CheckCircle2 size={16} className="text-blue-600 mx-auto mb-1.5" />
                        <span className="text-xs font-bold text-slate-800">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 font-bold">상세 개발 내용</h4>
                <div className="space-y-2.5">
                  {selectedProject.details.map((d, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                      <ChevronRight size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="break-keep leading-relaxed">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 font-bold">사용 기술 스택</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map(t => (
                    <span key={t} className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-blue-700 font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  닫기
                </button>
              </div>
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
