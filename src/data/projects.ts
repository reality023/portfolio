
import type { ComponentType } from 'react';
import HiMeContent from './../content/projects/hi-me.mdx';
import ValueLinkContent from './../content/projects/valuelink.mdx';
import DearMyHomeContent from './../content/projects/dearmyhome.mdx';
import PomeContent from './../content/projects/pome.mdx';

export interface ProjectScreenshot {
    src: string;
    caption?: string;
    alt?: string;
}

export interface ProjectItem {
    id: string;
    category: 'work' | 'side';
    categoryLabel: string;
    title: string;
    subtitle: string;
    period: string;
    role: string;
    platform?: string;
    team?: string;
    teamMembers?: string;
    tech: string[];
    summary: string;
    details: string[];
    metrics?: string[];
    features?: string[];
    screenshots?: Array<ProjectScreenshot | string>;
    content?: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
    markdown?: string;
    links?: {
        appStore?: string;
        playStore?: string;
        web?: string;
        github?: string;
    };
}

export const PROJECTS_DATA: ProjectItem[] = [
    {
        id: 'hi-me',
        category: 'work',
        categoryLabel: '실무 프로젝트',
        title: '하이미 (Hi-Me)',
        subtitle: '건강검진 및 건강관리 서비스',
        period: '2025.12 ~ 2026.05',
        role: '프론트엔드 개발 (웹뷰 퍼블리싱 & 기능 구현) / 프리랜서',
        platform: '모바일 하이브리드 웹뷰 (iOS / Android)',
        team: '프론트엔드 개발 (10%)',
        teamMembers: '프론트엔드 4명, 백엔드 및 앱, 디자인 등 외부 회사와 협업',
        tech: ['React', 'Tailwind CSS', 'Tanstack Query', 'TypeScript', 'Zustand'],
        summary: '건강검진 결과 리포트와 맞춤형 건강관리 콘텐츠 및 챌린지를 제공하는 서비스로, 모바일 앱 내에서 동작하는 웹뷰 내 미션 기능(설문 및 설문결과에 따른 맞춤 미션 수행)을 담당했습니다.',
        links: {
            appStore: 'https://apps.apple.com/kr/app/%ED%95%98%EC%9D%B4%EB%AF%B8-hi-me-%EA%B1%B4%EA%B0%95%EA%B2%80%EC%A7%84-%EB%B0%8F-%EA%B1%B4%EA%B0%95%EA%B4%80%EB%A6%AC-eap%EC%84%9C%EB%B9%84%EC%8A%A4/id6762238425',
            playStore: 'https://play.google.com/store/apps/details?id=com.mediplussolution.hime'
        },
        details: [
            '미션 및 챌린지 기능 웹뷰 화면 전체 퍼블리싱',
            '미션 및 마이페이지 API 데이터 연동',
            'Tanstack Query를 사용하여 서버 데이터 캐싱 및 미션 상태 실시간 동기화',
            '미션, 챌린지, 마이페이지 기능 네이티브 테스트 및 디버깅'
        ],
        metrics: [
            '네이티브 브릿지 연동을 통한 사진 업로드, 권한 요청 기능 작업',
            'React Query 캐싱 적용으로 불필요한 API 호출 제거',
            '모바일 기기에서의 UI 오류 및 기능 오류 수정'
        ],
        content: HiMeContent
    },
    {
        id: 'valuelink',
        category: 'work',
        categoryLabel: '실무 프로젝트',
        title: 'ValueLink / CPLink',
        subtitle: 'CSO 계약 & 실적 관리 엔터프라이즈 플랫폼',
        period: '2024.09 ~ 2025.03',
        role: '풀스택 개발자 (책임) · 인프라 구축 & 기능 개발',
        platform: 'B2B 엔터프라이즈 웹 & 온프레미스/NCP 인프라',
        team: '풀스택 개발 (인프라 / 백엔드 / 프론트엔드 전 과정) (80%)',
        teamMembers: '풀스택 1명 (본인), 백엔드 1명, AI 개발 2명',
        tech: ['Next.js', 'FastAPI', 'NCP', 'Docker', 'GitHub Actions', 'Jotai', 'Tanstack Query', 'NCP Object Storage'],
        summary: '제약 CSO 업계의 복잡한 전자계약 및 대용량 실적 데이터를 효율적으로 정산·관리하는 B2B 플랫폼으로, 온프레미스/클라우드 인프라 구축부터 백엔드 API, 프론트엔드까지 전 과정을 주도적으로 구축 및 개발했습니다.',
        details: [
            '서버 스토리지 의존성을 분리하여 NCP Object Storage 기반 아키텍처 개편 및 권한 기반 파일 접근 제어 구현',
            'On-Premise 개발 서버 및 NCP 운영 서버 환경 Docker 컨테이너화 및 GitHub Actions CI/CD 파이프라인 구축',
            '전자계약 체결 및 다단계 승인 워크플로우 핵심 비즈니스 로직 풀스택 구현'
        ],
        metrics: [
            '서버 스토리지 의존성 분리 및 권한 기반 안전한 파일 다운로드 체계 구축',
            '전자계약 체결 및 다단계 승인 워크플로우 핵심 비즈니스 로직 구축',
            'Docker & GitHub Actions 기반 빌드·배포 파이프라인 자동화'
        ],
        content: ValueLinkContent
    },
    {
        id: 'dearmyhome',
        category: 'work',
        categoryLabel: '실무 프로젝트',
        title: 'DearMyHome',
        subtitle: 'B2B 인테리어 쇼핑몰 & 전사 어드민 관리 시스템',
        period: '2022.12 ~ 2024.06',
        role: '프론트엔드 개발 · 유저/어드민/앱 출시',
        platform: '유저 쇼핑몰(CRA) + 통합 어드민(Next.js) + 모바일 앱(RN WebView)',
        team: '프론트엔드 개발',
        teamMembers: '프론트엔드 1명, 백엔드 1명, 디자이너 1명, 기획자 1명',
        tech: ['React', 'Next.js', 'Redux Toolkit', 'Toss Payments', 'React Native', 'AWS', 'React Query', 'TailwindCSS'],
        summary: '인테리어 자재 B2B 쇼핑몰 서비스로, 일반 고객용 웹 플랫폼(CRA)과 내부 운영자를 위한 통합 어드민(Next.js), 그리고 양대 마켓 모바일 앱(React Native WebView)을 모두 단독으로 작업하였습니다.',
        links: {
            web: "https://www.dearmyhome.co.kr/",
            appStore: "https://apps.apple.com/kr/app/%EB%94%94%EC%96%B4%EB%A7%88%EC%9D%B4%ED%99%88-%ED%95%84%EC%9A%94%ED%95%9C-%EA%B3%B3%EB%A7%8C-%EA%B3%A0%EC%B3%90-%EC%82%B4%EB%9E%98%EC%9A%94/id6739512849",
        },
        details: [
            '일반 사용자용 웹 서비스와 고도화된 백오피스 관리자 페이지(Next.js)의 독립적인 프론트엔드 아키텍처 구성',
            '장바구니, 주문/결제 인터페이스, 4대 소셜 로그인 및 공정별 시공 일정 관리를 위한 풀 캘린더 UI/UX 기능 구현',
            'Toss Payments SDK 연동을 통한 주문/결제 유저 플로우 및 결제 예외 처리 구현',
            'React Native 웹뷰 아키텍처 설계를 통한 웹-네이티브 브릿지 인터페이스 구현 및 App Store, Play Store 정식 배포'
        ],
        metrics: [
            'React Native WebView 래핑 기반 iOS & Google Play 양대 마켓 정식 출시',
            'Toss Payments 연동을 통한 주문/결제 라이프사이클 및 결제 안정성 확보',
            '일반 웹과 Next.js 백오피스 독립 아키텍처 분리 및 시공 일정 풀 캘린더 UI/UX 구축'
        ],
        content: DearMyHomeContent
    },
    {
        id: 'pome',
        category: 'side',
        categoryLabel: '사이드 프로젝트',
        title: 'POME (체형 분석 맞춤 운동 서비스)',
        subtitle: '체형 분석 기반 일일 맞춤 운동 영상 제공 크로스플랫폼 앱',
        period: '개인 사이드 프로젝트',
        role: '풀스택 개발',
        platform: '모바일 앱 (Flutter iOS/Android) & 관리자 웹',
        team: '풀스택 개발',
        teamMembers: '기획 1명, UI 디자인 1명, 풀스택 1명',
        tech: ['Flutter', 'FastAPI', 'Supabase', 'Docker', 'AWS EC2'],
        summary: '이용자가 정면·측면·후면 체형 사진을 제출하면 간단한 체형 분석과 함께 하루 1분 맞춤 운동 영상 3개를 제공하는 크로스플랫폼 모바일 앱입니다. Flutter 기반 iOS/Android 동시 개발, Supabase 및 FastAPI 기반 관리자 백엔드, Docker 기반 AWS EC2 배포, 개발·운영 환경 분리까지 풀스택으로 개발했습니다.',
        details: [
            'Flutter 단일 코드베이스 기반 iOS/Android 크로스플랫폼 앱 및 관리자 웹 개발',
            '정면·측면·후면 사진 제출 기반 체형 분석 및 하루 1분 맞춤 운동 영상(3편) 제공 기능 구현',
            'Supabase(메인 DB/인증) 및 유연한 관리를 위한 FastAPI + Supabase Admin SDK 관리자 API 구축',
            'FastAPI 백엔드 및 관리자 페이지 Docker 컨테이너화 후 AWS EC2 인프라 배포',
            '로컬 PC 개발 서버 세팅 및 Flutter 앱 개발/운영 빌드 분기를 통한 안정적인 테스트 환경 구축'
        ],
        metrics: [
            'Flutter 기반 단일 코드베이스로 iOS/Android 양대 모바일 앱 및 관리자 페이지 구축',
            'Supabase + FastAPI Admin SDK를 결합하여 유연하고 확장성 높은 데이터 관리 체계 확립',
            'Docker 컨테이너화 및 Dev/Prod 환경 분리를 통한 안정적인 배포 파이프라인 완성'
        ],
        screenshots: [
            {
                src: './images/projects/pome/image01.png',
                caption: '소셜 로그인'
            },
            {
                src: './images/projects/pome/image02.png',
                caption: '홈화면 3종 탭'
            },
            {
                src: './images/projects/pome/image03.png',
                caption: '홈화면 3종 탭'
            },
            {
                src: './images/projects/pome/image04.png',
                caption: '홈화면 3종 탭'
            },
            {
                src: './images/projects/pome/image05.png',
                caption: '정밀 체형 분석'
            },
            {
                src: './images/projects/pome/image06.png',
                caption: '정밀 체형 분석'
            },
            {
                src: './images/projects/pome/image07.png',
                caption: '정밀 체형 분석'
            },
            {
                src: './images/projects/pome/image08.png',
                caption: '정밀 체형 분석'
            },
            {
                src: './images/projects/pome/image09.png',
                caption: '정밀 체형 분석'
            },
            {
                src: './images/projects/pome/image10.png',
                caption: '정밀 체형 분석'
            },
            {
                src: './images/projects/pome/image11.png',
                caption: '간단 체형 분석'
            },
            {
                src: './images/projects/pome/image12.png',
                caption: '간단 체형 분석'
            },
            {
                src: './images/projects/pome/image13.png',
                caption: '간단 체형 분석'
            },
            {
                src: './images/projects/pome/image14.png',
                caption: '맞춤 운동'
            },
            {
                src: './images/projects/pome/image15.png',
                caption: '맞춤 운동'
            },
            {
                src: './images/projects/pome/image16.png',
                caption: '맞춤 운동'
            },
            {
                src: './images/projects/pome/image17.png',
                caption: '맞춤 운동'
            },
            {
                src: './images/projects/pome/image18.png',
                caption: '맞춤 운동'
            },
            {
                src: './images/projects/pome/admin01.png',
                caption: '관리자페이지'
            },
            {
                src: './images/projects/pome/admin02.png',
                caption: '관리자페이지'
            },
            {
                src: './images/projects/pome/admin03.png',
                caption: '관리자페이지'
            },
            {
                src: './images/projects/pome/admin04.png',
                caption: '관리자페이지'
            },
            {
                src: './images/projects/pome/admin05.png',
                caption: '관리자페이지'
            },
            {
                src: './images/projects/pome/admin06.png',
                caption: '관리자페이지'
            },
            {
                src: './images/projects/pome/admin07.png',
                caption: '관리자페이지'
            },
            {
                src: './images/projects/pome/admin08.png',
                caption: '관리자페이지'
            },
        ],
        content: PomeContent
    }
];