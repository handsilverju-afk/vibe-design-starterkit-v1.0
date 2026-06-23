/**
 * zMath Theme — Friendly Colorful UI
 *
 * 레퍼런스(docs/reference/neo-brutalism.jpeg) 기반.
 * Aggressive Neo-Brutalism이 아닌 Friendly Soft variant:
 * - 오프화이트 배경 + 화이트 카드
 * - 비비드 컬러 블록 (주요 카드에 한정)
 * - Pill 버튼 (999px borderRadius)
 * - Neo-Brutalism offset shadow (카드·버튼 공통) — 3px 3px 0 #1A1A1A
 * - 16px 카드 radius (레퍼런스 기반)
 */

import { createTheme } from '@mui/material/styles';
import {
  palette as defaultPalette,
  typography as defaultTypography,
  spacing,
  breakpoints,
  zIndex,
  transitions,
} from './default.js';

// ── 레퍼런스 팔레트 (docs/reference/color.jpg) ──────
const NEAR_BLACK  = '#0E0F0F';   // 텍스트·보더·섀도우 전용 — 거의 검정
const DARK_GREEN  = '#004638';   // 카테고리 색상 전용 (arithmetic) — 딥 그린
const OFF_WHITE   = '#FAFAF9';
const COLUMBIA_BLUE  = '#C7DDDB';
const PALE_VIOLET    = '#D199FA';
const MAGIC_MINT     = '#B6FCBE';
const MAX_GREEN_YLW  = '#DDED59';
const PORTLAND_ORANGE = '#FC5B31';

// 버튼용 offset shadow — Near Black
const btnShadow = (offset = 2) =>
  `${offset}px ${offset}px 0 0 ${NEAR_BLACK}`;

// 카드용 neo-brutalism offset shadow — Near Black
const cardShadow = `3px 3px 0 0 ${NEAR_BLACK}`;
const cardShadowHover = `4px 4px 0 0 ${NEAR_BLACK}`;

const zmathTheme = createTheme({
  spacing,
  breakpoints,
  zIndex,
  transitions,

  // ──────────────────────────────────────────────
  // 1. Palette
  // ──────────────────────────────────────────────
  palette: {
    ...defaultPalette,
    primary: {
      light: '#FD7A5A',
      main: PORTLAND_ORANGE,   // #FC5B31
      dark: '#D43D14',
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: '#E8F598',
      main: MAX_GREEN_YLW,     // #DDED59
      dark: '#C4D636',
      contrastText: NEAR_BLACK,
    },
    background: {
      default: '#FAFAF9',      // 라이트 레몬 — DCED59의 극연한 틴트
      paper: '#FFFFFF',
    },
    text: {
      primary: NEAR_BLACK,
      secondary: `${NEAR_BLACK}99`,
      disabled: `${NEAR_BLACK}55`,
    },
    success: {
      light: MAGIC_MINT,
      main: '#00C853',
      dark: '#007A30',
      contrastText: NEAR_BLACK,
    },
    divider: `${NEAR_BLACK}18`,

    zmath: {
      nearBlack: NEAR_BLACK,
      darkGreen: DARK_GREEN,
      offWhite: OFF_WHITE,
      columbiaBlue: COLUMBIA_BLUE,
      surfaceAlt: `${COLUMBIA_BLUE}44`,  // Columbia Blue 틴트
      accent: {
        orange: PORTLAND_ORANGE,   // #FC5B31
        yellow: MAX_GREEN_YLW,     // #DDED59
        violet: PALE_VIOLET,       // #D199FA
      },
      categoryColors: {
        arithmetic:   DARK_GREEN,              // #004638 딥그린 (수와 연산)
        function:     PALE_VIOLET,             // #D199FA 퍼플 (함수)
        geometry:     MAGIC_MINT,             // #B6FCBE 형광 민트그린 (도형)
        statistics:   `${COLUMBIA_BLUE}44`,   // #C7DDDB44 틴트 (확률·통계)
        columbiaBlue: COLUMBIA_BLUE,          // #C7DDDB 풀 컬러
      },
      // 챌린지 카드 상태별 배경
      challengeSurface: {
        default: '#FFFFFF',
        solved:  `${PORTLAND_ORANGE}18`,
        failed:  `${MAGIC_MINT}30`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 2. Shape — 16px (레퍼런스 기반)
  // ──────────────────────────────────────────────
  shape: {
    borderRadius: 16,
  },

  // ──────────────────────────────────────────────
  // 3. Typography
  // ──────────────────────────────────────────────
  typography: {
    ...defaultTypography,
    h1: {
      ...defaultTypography.h1,
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 900,
      lineHeight: 1.1,
    },
    h2: {
      ...defaultTypography.h2,
      fontWeight: 800,
      lineHeight: 1.15,
    },
    h3: {
      ...defaultTypography.h3,
      fontWeight: 700,
      fontSize: '1.25rem',
    },
    // 버튼: Sentence case (레퍼런스 기반 수정)
    button: {
      ...defaultTypography.button,
      fontWeight: 600,
      letterSpacing: '0.01em',
      textTransform: 'none',   // Sentence case
    },
    caption: {
      ...defaultTypography.caption,
      fontWeight: 600,
      fontSize: '0.75rem',
      letterSpacing: '0.02em',
    },
    overline: {
      ...defaultTypography.overline,
      fontWeight: 700,
      letterSpacing: '0.08em',
    },
  },

  // ──────────────────────────────────────────────
  // 4. Component 오버라이드
  // ──────────────────────────────────────────────
  components: {

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FAFAF9',
          color: NEAR_BLACK,
          scrollbarWidth: 'thin',
        },
      },
    },

    // Paper — neo-brutalism offset shadow
    MuiPaper: {
      styleOverrides: {
        root: {
          border: `1.5px solid ${NEAR_BLACK}`,
          boxShadow: cardShadow,
          transition: 'box-shadow 0.1s ease, transform 0.1s ease',
          '&:hover': {
            boxShadow: cardShadowHover,
            transform: 'translate(-1px, -1px)',
          },
        },
        elevation0: {
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            transform: 'none',
          },
        },
      },
    },

    // Card — 16px radius + neo-brutalism offset shadow
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1.5px solid ${NEAR_BLACK}`,
          boxShadow: cardShadow,
          transition: 'box-shadow 0.1s ease, transform 0.1s ease',
          '&:hover': {
            boxShadow: cardShadowHover,
            transform: 'translate(-1px, -1px)',
          },
        },
      },
    },

    // Button — pill 형태 + 경량 offset (레퍼런스 기반)
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,                          // pill
          border: `1.5px solid ${NEAR_BLACK}`,
          boxShadow: btnShadow(2),
          fontWeight: 600,
          textTransform: 'none',
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          transition: 'box-shadow 0.1s ease, transform 0.1s ease',
          '&:hover': {
            boxShadow: btnShadow(3),
            transform: 'translate(-1px, -1px)',
          },
          '&:active': {
            boxShadow: 'none',
            transform: 'translate(2px, 2px)',
          },
        },
        containedSecondary: {
          color: NEAR_BLACK,
        },
        // text variant — border 없는 pill
        text: {
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            transform: 'none',
          },
        },
        // outlined — border 유지, shadow 없음
        outlined: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            transform: 'none',
          },
        },
      },
    },

    // Chip — pill 형태 (레퍼런스 태그 스타일)
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          border: '1px solid rgba(26, 26, 26, 0.2)',
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },

    // TextField — 12px radius
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },

    // LinearProgress — 챌린지 진행률
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: 'rgba(26, 26, 26, 0.1)',
          height: 10,
        },
        bar: {
          borderRadius: 999,
        },
      },
    },
  },
});

// 커스텀 shadow 유틸리티 (컴포넌트에서 직접 사용)
zmathTheme.customShadows = {
  none: 'none',
  card: cardShadow,
  cardHover: cardShadowHover,
  btn: btnShadow(2),
  btnHover: btnShadow(3),
};

export default zmathTheme;

export { NEAR_BLACK, OFF_WHITE, btnShadow, cardShadow };
