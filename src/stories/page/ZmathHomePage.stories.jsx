import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import { AppShell } from '../../components/layout/AppShell';
import { PageContainer } from '../../components/layout/PageContainer';
import { CategoryTab } from '../../components/in-page-navigation/CategoryTab';
import ConceptGameCard from '../../components/game/ConceptGameCard';
import PeepsAvatar from '../../components/game/PeepsAvatar';
import ProfileAvatar from '../../components/game/ProfileAvatar';
import { ZmathProfilePage } from './ZmathProfilePage.stories';
import { ZmathFractionGamePage } from './ZmathFractionGamePage.stories';
import { ZmathLogo, ZmathNavLinks } from '../../components/navigation/ZmathGNB';
import { ProfileCard } from '../../components/game/ProfileCard';
import { resolveIpProfile } from '../../utils/ipProfile';

const COLUMBIA_BLUE = '#C7DDDB';

// ─────────────────────────────────
// 샘플 데이터
// ─────────────────────────────────
const ELEM5_CATEGORIES = [
  { id: 'all',        label: '전체' },
  { id: 'arithmetic', label: '수와 연산' },
  { id: 'geometry',   label: '도형' },
  { id: 'statistics', label: '확률·통계' },
];

const GAMES = [
  { id: 'gcd-lcm',        subject: 'arithmetic', conceptKey: 'gcd-lcm',        category: 'arithmetic', categoryLabel: '수와 연산', conceptTitle: '약수와 배수',   difficulty: 'easy',   description: '공약수·공배수를 드래그로 탐색하세요.',       views: 1240, likes: 87 },
  { id: 'fraction-add',   subject: 'arithmetic', conceptKey: 'fraction-add',   category: 'arithmetic', categoryLabel: '수와 연산', conceptTitle: '분수의 덧셈',   difficulty: 'medium', description: '분모를 맞추어 분수를 더해 보세요.',          views: 830,  likes: 54 },
  { id: 'fraction-sub',   subject: 'arithmetic', conceptKey: 'fraction-sub',   category: 'columbiaBlue', categoryLabel: '수와 연산', conceptTitle: '분수의 뺄셈',   difficulty: 'medium', description: '분모를 맞추어 분수를 빼 보세요.',            views: 720,  likes: 48 },
  { id: 'fraction-multi', subject: 'arithmetic', conceptKey: 'fraction-multi', category: 'arithmetic', categoryLabel: '수와 연산', conceptTitle: '분수의 곱셈',   difficulty: 'medium', description: '분수 곱셈의 원리를 직접 확인하세요.',         views: 610,  likes: 41 },
  { id: 'fraction-div',   subject: 'arithmetic', conceptKey: 'fraction-div',   category: 'statistics', categoryLabel: '수와 연산', conceptTitle: '분수의 나눗셈', difficulty: 'hard',   description: '역수를 이용한 나눗셈 원리를 탐색하세요.',     views: 490,  likes: 32 },
  { id: 'triangle-area', subject: 'geometry', conceptKey: 'triangle-area', category: 'function',  categoryLabel: '도형', conceptTitle: '삼각형의 넓이', difficulty: 'easy', description: '밑변과 높이로 넓이 공식을 확인하세요.',       views: 970, likes: 61 },
  { id: 'congruence',    subject: 'geometry', conceptKey: 'congruence',    category: 'geometry', categoryLabel: '도형', conceptTitle: '합동과 대칭',   difficulty: 'easy', description: '도형을 뒤집고 돌려 합동·대칭을 발견하세요.', views: 720, likes: 48 },
  { id: 'mean',       subject: 'statistics', conceptKey: 'mean',       category: 'columbiaBlue', categoryLabel: '확률·통계', conceptTitle: '평균과 가능성', difficulty: 'easy', description: '데이터를 넣고 빼며 평균이 변하는 걸 확인하세요.', views: 720, likes: 43 },
  { id: 'likelihood', subject: 'statistics', conceptKey: 'likelihood', category: 'yellow',       categoryLabel: '확률·통계', conceptTitle: '경우의 수',     difficulty: 'easy', description: '일어날 수 있는 경우를 모두 세어 보세요.',        views: 580, likes: 37 },
];

// ─── 문제 풀이 기반 랭킹 데이터 ───────────────────────
const DIFFICULTY_SCORE = { easy: 10, medium: 20, hard: 30 };
const CONCEPT_DIFFICULTY = Object.fromEntries(GAMES.map(g => [g.conceptKey, g.difficulty]));
const P = (conceptTitle, conceptKey, category, progress, lastOX) =>
  ({ conceptTitle, conceptKey, category, difficulty: CONCEPT_DIFFICULTY[conceptKey] ?? 'easy', progress, lastOX });

const RANKING = [
  { rank: 1,  nickname: '수학천재',   avatarVariant: 'celebrating', lastAccess: '방금 전',  solvedProblems: [
    P('분수의 덧셈',   'fraction-add',   'arithmetic',   100, 'O'),
    P('약수와 배수',   'gcd-lcm',         'arithmetic',   100, 'O'),
    P('삼각형의 넓이', 'triangle-area',   'function',     95,  'O'),
    P('분수의 곱셈',   'fraction-multi',  'arithmetic',   80,  'X'),
    P('경우의 수',     'likelihood',      'yellow',       70,  'O'),
    P('합동과 대칭',   'congruence',      'geometry',     60,  'O'),
    P('분수의 뺄셈',   'fraction-sub',    'columbiaBlue', 50,  'X'),
    P('평균과 가능성', 'mean',            'columbiaBlue', 40,  'O'),
  ] },
  { rank: 2,  nickname: '도형마스터', avatarVariant: 'confident',   lastAccess: '5분 전',   solvedProblems: [
    P('삼각형의 넓이', 'triangle-area',   'function',     100, 'O'),
    P('합동과 대칭',   'congruence',      'geometry',     100, 'O'),
    P('분수의 덧셈',   'fraction-add',    'arithmetic',   90,  'O'),
    P('약수와 배수',   'gcd-lcm',         'arithmetic',   75,  'X'),
    P('경우의 수',     'likelihood',      'yellow',       60,  'O'),
    P('분수의 곱셈',   'fraction-multi',  'arithmetic',   45,  'X'),
    P('분수의 뺄셈',   'fraction-sub',    'columbiaBlue', 30,  'O'),
  ] },
  { rank: 3,  nickname: '함수왕',     avatarVariant: 'focused',     lastAccess: '22분 전',  solvedProblems: [
    P('분수의 덧셈',   'fraction-add',    'arithmetic',   100, 'O'),
    P('분수의 뺄셈',   'fraction-sub',    'columbiaBlue', 100, 'O'),
    P('분수의 곱셈',   'fraction-multi',  'arithmetic',   85,  'O'),
    P('약수와 배수',   'gcd-lcm',         'arithmetic',   70,  'X'),
    P('삼각형의 넓이', 'triangle-area',   'function',     55,  'O'),
    P('경우의 수',     'likelihood',      'yellow',       40,  'X'),
  ] },
  { rank: 4,  nickname: 'π는맛있어', avatarVariant: 'curious',     lastAccess: '1시간 전', solvedProblems: [
    P('약수와 배수',   'gcd-lcm',         'arithmetic',   100, 'O'),
    P('분수의 덧셈',   'fraction-add',    'arithmetic',   80,  'O'),
    P('합동과 대칭',   'congruence',      'geometry',     65,  'O'),
    P('평균과 가능성', 'mean',            'columbiaBlue', 50,  'X'),
    P('경우의 수',     'likelihood',      'yellow',       35,  'O'),
  ] },
  { rank: 5,  nickname: '미분적분충', avatarVariant: 'celebrating', lastAccess: '2시간 전', solvedProblems: [
    P('분수의 곱셈',   'fraction-multi',  'arithmetic',   100, 'O'),
    P('분수의 덧셈',   'fraction-add',    'arithmetic',   90,  'O'),
    P('약수와 배수',   'gcd-lcm',         'arithmetic',   75,  'X'),
    P('경우의 수',     'likelihood',      'yellow',       60,  'O'),
  ] },
  { rank: 6,  nickname: '삼각형사랑', avatarVariant: 'confident',   lastAccess: '어제',     solvedProblems: [
    P('삼각형의 넓이', 'triangle-area',   'function',     100, 'O'),
    P('합동과 대칭',   'congruence',      'geometry',     80,  'O'),
    P('분수의 덧셈',   'fraction-add',    'arithmetic',   60,  'X'),
  ] },
  { rank: 7,  nickname: '확률천재',   avatarVariant: 'focused',     lastAccess: '어제',     solvedProblems: [
    P('경우의 수',     'likelihood',      'yellow',       100, 'O'),
    P('평균과 가능성', 'mean',            'columbiaBlue', 85,  'O'),
    P('분수의 덧셈',   'fraction-add',    'arithmetic',   40,  'X'),
  ] },
  { rank: 8,  nickname: '좌표야놀자', avatarVariant: 'curious',     lastAccess: '2일 전',   solvedProblems: [
    P('분수의 덧셈',   'fraction-add',    'arithmetic',   75,  'O'),
    P('약수와 배수',   'gcd-lcm',         'arithmetic',   50,  'X'),
    P('경우의 수',     'likelihood',      'yellow',       30,  'O'),
  ] },
  { rank: 9,  nickname: '소인수분해', avatarVariant: 'celebrating', lastAccess: '3일 전',   solvedProblems: [
    P('약수와 배수',   'gcd-lcm',         'arithmetic',   100, 'O'),
    P('분수의 덧셈',   'fraction-add',    'arithmetic',   60,  'O'),
  ] },
  { rank: 10, nickname: '직각삼각형', avatarVariant: 'confident',   lastAccess: '3일 전',   solvedProblems: [
    P('삼각형의 넓이', 'triangle-area',   'function',     90,  'O'),
    P('합동과 대칭',   'congruence',      'geometry',     45,  'X'),
  ] },
  { rank: 11, nickname: '벡터마스터', avatarVariant: 'focused',     lastAccess: '4일 전',   solvedProblems: [
    P('분수의 뺄셈',   'fraction-sub',    'columbiaBlue', 80,  'O'),
    P('분수의 덧셈',   'fraction-add',    'arithmetic',   30,  'X'),
  ] },
  { rank: 12, nickname: '행렬의신',   avatarVariant: 'curious',     lastAccess: '5일 전',   solvedProblems: [
    P('분수의 곱셈',   'fraction-multi',  'arithmetic',   65,  'O'),
    P('약수와 배수',   'gcd-lcm',         'arithmetic',   20,  'X'),
  ] },
  { rank: 13, nickname: '극한도전자', avatarVariant: 'celebrating', lastAccess: '일주일 전', solvedProblems: [
    P('분수의 덧셈',   'fraction-add',    'arithmetic',   100, 'O'),
  ] },
  { rank: 14, nickname: '미적분러버', avatarVariant: 'confident',   lastAccess: '일주일 전', solvedProblems: [
    P('삼각형의 넓이', 'triangle-area',   'function',     55,  'X'),
  ] },
  { rank: 15, nickname: '수학왕초보', avatarVariant: 'curious',     lastAccess: '2주 전',   solvedProblems: [
    P('분수의 덧셈',   'fraction-add',    'arithmetic',   20,  'X'),
  ] },
].map((e) => ({
  ...e,
  playCount: e.solvedProblems.length,
  score: e.solvedProblems.reduce((sum, p) => {
    if (p.progress !== 100 || p.lastOX !== 'O') return sum;
    return sum + (DIFFICULTY_SCORE[p.difficulty] ?? 10);
  }, 0),
}))
  .sort((a, b) => b.score - a.score)
  .map((e, i) => ({ ...e, rank: i + 1 }));

const NAV_ACTIVE = { home: '홈', elementary5: '초등5', elementary6: '초등6' };

const AVATAR_VARIANTS = ['confident', 'celebrating', 'curious', 'focused'];

// ─────────────────────────────────
// 히어로 일러스트레이션 — 수학 원 + Notionists 아바타 + 장식 도형
// ─────────────────────────────────

// 테마 nearBlack (#004638) 직접 참조
const HERO_INK = '#0D1714';
const HS = { stroke: HERO_INK, strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

// ── 수학 원 컨텐츠 SVG ──────────────────────────

// 함수 그래프 원 (y=sin(x) + 좌표축)
function FunctionCircleSvg({ bg = '#DDED59' }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48" fill={ bg } stroke={ HERO_INK } strokeWidth="2.5" />
      <line x1="14" y1="50" x2="86" y2="50" { ...HS } strokeWidth="1.5" />
      <polyline points="82,46 86,50 82,54" { ...HS } strokeWidth="1.5" />
      <line x1="50" y1="16" x2="50" y2="84" { ...HS } strokeWidth="1.5" />
      <polyline points="46,20 50,16 54,20" { ...HS } strokeWidth="1.5" />
      <path d="M 14 50 C 22 28, 34 28, 42 50 S 58 72, 66 50 S 74 28, 86 50"
        stroke={ HERO_INK } strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Σ 기호 원 — 수학적 합산 기호
function FractionCircleSvg({ bg = COLUMBIA_BLUE }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48" fill={ bg } stroke={ HERO_INK } strokeWidth="2.5" />
      <polyline
        points="70,22 30,22 54,50 30,78 70,78"
        fill="none" stroke={ HERO_INK } strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

// 삼각형 원 — 밑변(b) · 높이(h) 표기한 넓이 개념 도형
function TriangleCircleSvg({ bg = '#D199FA' }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48" fill={ bg } stroke={ HERO_INK } strokeWidth="2.5" />
      {/* 이등변 삼각형 */}
      <polygon points="50,16 80,78 20,78"
        fill="white" stroke={ HERO_INK } strokeWidth="2.5" strokeLinejoin="round" />
      {/* 수선(높이) 점선 */}
      <line x1="50" y1="16" x2="50" y2="78"
        stroke={ HERO_INK } strokeWidth="1.5" strokeDasharray="3,2" />
      {/* 직각 표시 */}
      <rect x="50" y="72" width="6" height="6" fill="none" stroke={ HERO_INK } strokeWidth="1.5" />
      {/* 레이블 */}
      <text x="50" y="91" textAnchor="middle" fontSize="11" fontWeight="800"
        fill={ HERO_INK } fontFamily="Outfit, sans-serif" style={{ userSelect: 'none' }}>b</text>
      <text x="56" y="50" textAnchor="start" fontSize="11" fontWeight="800"
        fill={ HERO_INK } fontFamily="Outfit, sans-serif" style={{ userSelect: 'none' }}>h</text>
    </svg>
  );
}

// ── Notionists 스타일 장식 도형 SVG ─────────────

// 4점 별 (fat star)
function StarShape({ size = 48, color = '#FC5B31' }) {
  return (
    <svg width={ size } height={ size } viewBox="0 0 48 48" fill="none">
      <path d="M24 4 C24 4, 22 16, 24 24 S24 44, 24 44 C24 44, 26 32, 24 24 S24 4, 24 4Z"
        fill={ color } stroke={ HERO_INK } strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 24 C4 24, 16 22, 24 24 S44 24, 44 24 C44 24, 32 26, 24 24 S4 24, 4 24Z"
        fill={ color } stroke={ HERO_INK } strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

// 태양 (circle + 삼각 빔 8개)
function SunShape({ size = 52, color = '#DDED59' }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const cx = 26, cy = 26, r1 = 14, r2 = 24;
    const x1 = cx + r1 * Math.cos(angle), y1 = cy + r1 * Math.sin(angle);
    const x2 = cx + r2 * Math.cos(angle - 0.2), y2 = cy + r2 * Math.sin(angle - 0.2);
    const x3 = cx + r2 * Math.cos(angle + 0.2), y3 = cy + r2 * Math.sin(angle + 0.2);
    return `M${x1},${y1} L${x2},${y2} L${x3},${y3}Z`;
  });
  return (
    <svg width={ size } height={ size } viewBox="0 0 52 52" fill="none">
      { rays.map((d, i) => <path key={ i } d={ d } fill={ color } stroke={ HERO_INK } strokeWidth="1.5" strokeLinejoin="round" />) }
      <circle cx="26" cy="26" r="12" fill={ color } stroke={ HERO_INK } strokeWidth="2.5" />
    </svg>
  );
}

// 겹쳐진 원 (Venn diagram)
function VennShape({ size = 56, color1 = COLUMBIA_BLUE, color2 = '#D199FA' }) {
  return (
    <svg width={ size } height={ size } viewBox="0 0 56 56" fill="none">
      <circle cx="20" cy="28" r="18" fill={ color1 } stroke={ HERO_INK } strokeWidth="2.5" fillOpacity="0.85" />
      <circle cx="36" cy="28" r="18" fill={ color2 } stroke={ HERO_INK } strokeWidth="2.5" fillOpacity="0.85" />
    </svg>
  );
}

const FLOAT_KF = {
  '@keyframes floatMath': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
  },
};

function FloatObj({ children, top, left, right, bottom, rotation = 0, delay = '0s', zIndex = 2 }) {
  return (
    <Box sx={{ position: 'absolute', top, left, right, bottom, zIndex, ...FLOAT_KF, animation: `floatMath 3.4s ease-in-out ${ delay } infinite` }}>
      <Box sx={{ transform: `rotate(${ rotation }deg)` }}>{ children }</Box>
    </Box>
  );
}

// ── 수학 원 컴포넌트 ──────────────────────────────
function MathCircle({ children, size, bg, rotate, style = {} }) {
  return (
    <Box sx={{
      width: size, height: size, borderRadius: '50%',
      border: `2.5px solid ${HERO_INK}`,
      boxShadow: `4px 4px 0 ${HERO_INK}`,
      transform: `rotate(${rotate}deg)`,
      overflow: 'hidden',
      backgroundColor: bg,
      ...style,
    }}>
      { children }
    </Box>
  );
}

// HeroIllustration: 컬러 fill 박스 3개 + 아바타 + 머리 위 수학 도형
// mode='overlay': 데스크탑 전용 절대 위치 (텍스트 우측)
// mode='inline': 모바일 텍스트 아래 인라인 배치
function HeroIllustration({ mode = 'overlay' }) {
  const theme = useTheme();
  const { zmath } = theme.palette;

  const float = (delay) => ({
    ...FLOAT_KF,
    animation: `floatMath 2.8s ease-in-out ${delay} infinite`,
  });

  const CARDS = [
    { bg: zmath.accent.yellow, avatarVariant: 'curious',     Shape: TriangleCircleSvg, shapeBg: '#D199FA', boxH: '60%', delay: '0s'   },
    { bg: zmath.columbiaBlue,  avatarVariant: 'celebrating', Shape: FractionCircleSvg, shapeBg: zmath.columbiaBlue, boxH: '72%', delay: '0.4s' },
    { bg: zmath.accent.violet, avatarVariant: 'confident',   Shape: FunctionCircleSvg, shapeBg: '#DDED59', boxH: '52%', delay: '0.2s' },
  ];

  const cards = CARDS.map(({ bg, avatarVariant, Shape, shapeBg, boxH, delay }, i) => (
    <Box key={ i } sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
      <Box sx={{ width: 'clamp(44px, 5.5vw, 80px)', height: 'clamp(44px, 5.5vw, 80px)', mb: 1.5, flexShrink: 0, ...float(delay) }}>
        <Shape bg={ shapeBg } />
      </Box>
      <Box sx={{
        width: '100%',
        height: mode === 'inline' ? '100%' : boxH,
        minHeight: mode === 'inline' ? 130 : 'clamp(140px, 22vh, 320px)',
        backgroundColor: bg,
        border: `2.5px solid ${HERO_INK}`,
        boxShadow: `4px 4px 0 ${HERO_INK}`,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <Box sx={{ width: '88%', '& svg': { width: '100%', height: '100%' }, transform: 'scale(1.35)', transformOrigin: 'bottom center' }}>
          <PeepsAvatar variant={ avatarVariant } size={ 120 } />
        </Box>
      </Box>
    </Box>
  ));

  if (mode === 'inline') {
    return (
      <Box sx={{ width: '100%', height: 240, userSelect: 'none', pointerEvents: 'none', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: '100%', pb: 2, pt: 1 }}>
          { cards }
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'absolute', inset: 0, userSelect: 'none', pointerEvents: 'none', overflow: 'hidden' }}>
      <Box sx={{ position: 'relative', maxWidth: { xs: '100%', lg: 'min(68.33vw, 1200px)' }, mx: 'auto', px: { xs: 2, md: 4 }, height: '100%' }}>
        <Box sx={{
          position: 'absolute',
          left: '450px',
          right: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 2,
          px: 2.5,
          pb: '6%',
          pt: '8%',
          transformOrigin: 'right bottom',
        }}>
          { cards }
        </Box>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────
// 섹션 헤더
// ─────────────────────────────────
function SectionHeader({ title, subtitle, ctaLabel, onCta }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 3 }}>
      <Box>
        <Typography variant="h2" sx={{ mb: 0.25 }}>{ title }</Typography>
        { subtitle && (
          <Typography variant="body1" color="text.secondary">{ subtitle }</Typography>
        ) }
      </Box>
      { ctaLabel && (
        <Button variant="outlined" size="small" onClick={ onCta } sx={{ flexShrink: 0 }}>
          { ctaLabel }
        </Button>
      ) }
    </Box>
  );
}

// ─────────────────────────────────
// Hero 섹션 — full-bleed 비대칭 레이아웃
// ─────────────────────────────────
function HeroSection({ onStartNow }) {

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: { xs: 'auto', md: 500 },
      }}
    >
      {/* ── 데스크탑 전용: 절대 위치 배경 일러스트레이션 ── */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <HeroIllustration mode="overlay" />
      </Box>

      {/* ── 텍스트 콘텐츠 ── */}
      <PageContainer
        maxWidth={false}
        sx={{ position: 'relative', zIndex: 5, maxWidth: { xs: '100%', lg: 'min(68.33vw, 1200px)' }, px: { xs: 2, md: 4 } }}
      >
        <Box
          sx={{
            pt: { xs: 5, md: 7 },
            pb: { xs: 6, md: 10 },
            maxWidth: { md: 550 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
        <Typography
          variant="overline"
          sx={{ display: 'block', color: 'primary.main', fontWeight: 700, letterSpacing: '0.08em', mb: 1.5 }}
        >
          수학 개념 게임 플랫폼
        </Typography>

        <Typography variant="h1" sx={{ mb: 2.5, lineHeight: 1.08 }}>
          수학 개념을<br />
          <Box component="span" sx={{ color: 'primary.main' }}>게임</Box>
          처럼 배워요.
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 420, lineHeight: 1.7 }}>
          어렵고 딱딱한 공식 대신<br />
          직접 움직이며 이해하는 인터랙티브 학습.
        </Typography>

        <Stack direction="row" spacing={ 1.5 } flexWrap="wrap" useFlexGap sx={{ mb: 5 }}>
          <Button variant="contained" color="primary" size="large" onClick={ onStartNow }>지금 시작하기</Button>
        </Stack>

        <Stack direction="row" spacing={ 6 }>
          { [
            { value: '초4-6', label: '권장 학년' },
            { value: '9개', label: '개념 게임' },
            { value: '5분', label: '학습 시간' },
          ].map((stat) => (
            <Box key={ stat.label }>
              <Typography
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  lineHeight: 1,
                  mb: 0.25,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                { stat.value }
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                { stat.label }
              </Typography>
            </Box>
          )) }
        </Stack>
        </Box>
      </PageContainer>

      {/* ── 모바일 전용: 텍스트 아래 인라인 일러스트레이션 ── */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <HeroIllustration mode="inline" />
      </Box>
    </Box>
  );
}

// ─────────────────────────────────
// 게임 목록 + 랭킹 섹션
// ─────────────────────────────────
function ConceptGameRankingSection({ likedIds = new Set(), onLike, onGameClick }) {
  const theme = useTheme();
  const { zmath } = theme.palette;
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleRankingClick = (user) => {
    setSelectedUser(user);
    setProfileOpen(true);
  };

  const handleProblemClick = (problem) => {
    setProfileOpen(false);
    const game = GAMES.find((g) => g.conceptKey === problem.conceptKey);
    if (game) onGameClick?.(game);
  };

  const MEDAL_BG = {
    1: `${zmath.accent.violet}28`,   // 바이올렛
    2: '#FFF9C444',                   // 라이트 옐로우
    3: '#FFF9C444',                   // 라이트 옐로우
  };
  const MEDAL_ICON = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const HOME_IDS = ['gcd-lcm', 'fraction-add', 'triangle-area', 'likelihood'];
  const gameList = HOME_IDS.map((id) => GAMES.find((g) => g.id === id)).filter(Boolean);

  const gamesPanel = (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <SectionHeader title="인기 게임" />
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        gap: 4,
        overflow: 'visible',
      }}>
        { gameList.map((game) => (
          <ConceptGameCard
            key={ game.id }
            conceptKey={ game.conceptKey }
            category={ game.category }
            categoryLabel={ game.categoryLabel }
            conceptTitle={ game.conceptTitle }
            difficulty={ game.difficulty }
            description={ game.description }
            views={ game.views }
            likes={ game.likes + (likedIds.has(game.id) ? 1 : 0) }
            isLiked={ likedIds.has(game.id) }
            onLike={ () => onLike?.(game.id) }
            onClick={ () => onGameClick?.(game) }
            sx={{ height: 'auto' }}
          />
        )) }
      </Box>
    </Box>
  );

  const rankingPanel = (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <SectionHeader title="랭킹" />
      <Card sx={{ overflow: 'hidden' }}>
        { RANKING.slice(0, 15).map((entry, index) => (
          <Box key={ entry.rank }>
            { index > 0 && <Divider /> }
            <Box
              onClick={ () => handleRankingClick(entry) }
              sx={{
                display: 'flex', alignItems: 'center',
                px: 2, py: 1.25, gap: 1.5,
                backgroundColor: entry.rank <= 8 ? (entry.rank === 1 ? MEDAL_BG[1] : MEDAL_BG[2]) : 'transparent',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <Typography sx={{
                fontFamily: '"Outfit", sans-serif', fontWeight: 900,
                fontSize: entry.rank <= 3 ? '1rem' : '0.85rem',
                color: 'text.primary', fontVariantNumeric: 'tabular-nums',
                width: 20, textAlign: 'center', flexShrink: 0,
              }}>
                { entry.rank }
              </Typography>
              <ProfileAvatar variant={ entry.avatarVariant ?? 'curious' } size={ 26 } />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: entry.rank <= 3 ? 700 : 500 }} noWrap>
                  { entry.nickname }
                </Typography>
                { entry.rank <= 3 && (
                  <Box component="span" sx={{ fontSize: 14, lineHeight: 1, userSelect: 'none' }}>
                    { MEDAL_ICON[entry.rank] }
                  </Box>
                ) }
              </Box>
              <Typography sx={{
                fontFamily: '"Outfit", sans-serif', fontWeight: 700,
                fontSize: '0.85rem', color: 'text.primary',
                fontVariantNumeric: 'tabular-nums', flexShrink: 0,
              }}>
                { entry.score.toLocaleString() }
              </Typography>
            </Box>
          </Box>
        )) }
      </Card>
    </Box>
  );

  return (
    <Box component="section" sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 6, md: 8 } }}>
      <Grid container spacing={ 5.5 } alignItems="flex-start">
        <Grid size={ { xs: 12, md: 8.5 } }>{ gamesPanel }</Grid>
        <Grid size={ { xs: 12, md: 3.5 } }>{ rankingPanel }</Grid>
      </Grid>
      <ProfileCard
        open={ profileOpen }
        user={ selectedUser }
        onClose={ () => setProfileOpen(false) }
        onGameClick={ handleProblemClick }
      />
    </Box>
  );
}

// ─────────────────────────────────
// 초등5 게임 페이지 (탭 필터 포함)
// ─────────────────────────────────
function Elementary5Page({ likedIds = new Set(), onLike, onGameClick, activeTab = 'all', onTabChange }) {
  const filtered = activeTab === 'all' ? GAMES : GAMES.filter((g) => g.subject === activeTab);

  return (
    <PageContainer maxWidth={false} sx={{ maxWidth: { xs: '100%', lg: 'min(68.33vw, 1200px)' }, px: { xs: 2, md: 4 }, pt: { xs: 4, md: 6 }, pb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ mb: 0.5 }}>초등 5학년</Typography>
        <Typography variant="body1" color="text.secondary">
          초등 5학년 수학 개념을 직접 조작하며 익히는 인터랙티브 게임
        </Typography>
      </Box>
      <CategoryTab categories={ ELEM5_CATEGORIES } selected={ activeTab } onChange={ onTabChange } sx={{ mb: 4 }} />
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 4,
        overflow: 'visible',
      }}>
        { filtered.map((game) => (
          <ConceptGameCard
            key={ game.id }
            conceptKey={ game.conceptKey }
            category={ game.category }
            categoryLabel={ game.categoryLabel }
            conceptTitle={ game.conceptTitle }
            difficulty={ game.difficulty }
            description={ game.description }
            views={ game.views }
            likes={ game.likes + (likedIds.has(game.id) ? 1 : 0) }
            isLiked={ likedIds.has(game.id) }
            onLike={ () => onLike?.(game.id) }
            onClick={ () => onGameClick?.(game) }
            sx={{ height: 'auto' }}
          />
        )) }
      </Box>
    </PageContainer>
  );
}

// ─────────────────────────────────
// 홈 페이지 조립
// ─────────────────────────────────
/**
 * ZmathHomePage
 *
 * Props:
 * @param {function} onGoProfile - 프로필 페이지로 이동 [Optional, 없으면 내부 state 사용]
 * @param {function} onGameClick - 게임 상세로 이동 (game: object) => void [Optional, 없으면 내부 state 사용]
 * @param {function} onGoGames  - 초등5 게임 목록 페이지로 이동 [Optional, 없으면 내부 state 사용]
 */
export function ZmathHomePage({ onGoProfile, onGameClick, onGoGames }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [likedIds, setLikedIds] = useState(new Set());
  const [elem6Open, setElem6Open] = useState(false);
  const [avatarVariant, setAvatarVariant] = useState('confident');
  const [elem5Category, setElem5Category] = useState('all');

  useEffect(() => {
    resolveIpProfile().then((p) => { if (p) setAvatarVariant(p.avatarVariant); });
  }, []);
  const isHome = currentPage === 'home';
  const isElementary5 = currentPage === 'elementary5';

  const toggleLike = (id) =>
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const [selectedGame, setSelectedGame] = useState(null);

  const handleGoGames = () => {
    if (onGoGames) { onGoGames(); return; }
    setCurrentPage('elementary5');
  };
  const handleStartNow = handleGoGames;
  const handleGameClick = (game) => {
    if (onGameClick) { onGameClick(game); return; }
    setSelectedGame(game);
    setCurrentPage('game-detail');
  };
  const handleGoProfile = () => {
    if (onGoProfile) { onGoProfile(); return; }
    setCurrentPage('profile');
  };

  if (currentPage === 'profile') {
    return (
      <>
        <ZmathProfilePage
          onNavigate={ setCurrentPage }
          onGameClick={ (key) => {
            const game = GAMES.find((g) => g.conceptKey === key) ?? { conceptKey: key, subject: 'arithmetic' };
            handleGameClick(game);
          } }
          onElementary6={ () => setElem6Open(true) }
        />
        <Dialog open={ elem6Open } onClose={ () => setElem6Open(false) }>
          <DialogTitle>초등 6학년</DialogTitle>
          <DialogContent>
            <DialogContentText>초등 6학년 콘텐츠는 현재 준비중입니다.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => setElem6Open(false) } variant="contained">확인</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  if (currentPage === 'game-detail') {
    const backHandler = (catId) => {
      if (catId) setElem5Category(catId);
      setCurrentPage('elementary5');
    };
    const homeHandler = () => setCurrentPage('home');
    const gradesHandler = () => { setElem5Category('all'); setCurrentPage('elementary5'); };

    const profileHandler = () => setCurrentPage('profile');
    const elem6Handler = () => setElem6Open(true);

    const gameEl = (
      <ZmathFractionGamePage
        categoryId={ selectedGame?.subject }
        onBack={ backHandler }
        onGoHome={ homeHandler }
        onGoGrades={ gradesHandler }
        onGoProfile={ profileHandler }
        onElementary6={ elem6Handler }
      />
    );

    return (
      <>
        { gameEl }
        <Dialog open={ elem6Open } onClose={ () => setElem6Open(false) }>
          <DialogTitle>초등 6학년</DialogTitle>
          <DialogContent>
            <DialogContentText>초등 6학년 콘텐츠는 현재 준비중입니다.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => setElem6Open(false) } variant="contained">확인</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <AppShell
      logo={ <ZmathLogo onClick={ () => setCurrentPage('home') } /> }
      headerCollapsible={
        <ZmathNavLinks
          active={ NAV_ACTIVE[currentPage] ?? '' }
          onNavClick={ (label) => {
            if (label === '초등5') { handleGoGames(); return; }
            const id = Object.keys(NAV_ACTIVE).find((k) => NAV_ACTIVE[k] === label);
            if (id) setCurrentPage(id);
          }}
          onElementary6={ () => setElem6Open(true) }
          avatarVariant={ avatarVariant }
          isProfileActive={ false }
          onProfileClick={ handleGoProfile }
        />
      }
      headerPersistent={ null }
      hasHeaderBorder
      headerHeight={ 72 }
      sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}
    >
      { isHome && (
        <>
          <HeroSection onStartNow={ handleStartNow } />
          <Box id="game-section">
            <PageContainer maxWidth={false} sx={{ maxWidth: { xs: '100%', lg: 'min(68.33vw, 1200px)' }, px: { xs: 2, md: 4 }, pt: { xs: 1, md: 2 }, pb: 8 }}>
              <ConceptGameRankingSection likedIds={ likedIds } onLike={ toggleLike } onGameClick={ handleGameClick } />
            </PageContainer>
          </Box>
        </>
      ) }
      { isElementary5 && (
        <Elementary5Page
          likedIds={ likedIds }
          onLike={ toggleLike }
          onGameClick={ handleGameClick }
          activeTab={ elem5Category }
          onTabChange={ setElem5Category }
        />
      ) }
      <Dialog open={ elem6Open } onClose={ () => setElem6Open(false) }>
        <DialogTitle>초등 6학년</DialogTitle>
        <DialogContent>
          <DialogContentText>초등 6학년 콘텐츠는 현재 준비중입니다.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ () => setElem6Open(false) } variant="contained">확인</Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}

// ─────────────────────────────────
// 스토리 메타
// ─────────────────────────────────
export default {
  title: 'Page/zMath Home',
  parameters: {
    layout: 'fullscreen',
  },
  includeStories: ['Default'],
};

export const Default = {
  render: () => <ZmathHomePage />,
};
