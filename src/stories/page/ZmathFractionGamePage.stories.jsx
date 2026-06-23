import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { AppShell } from '../../components/layout/AppShell';
import { PhiSplit } from '../../components/layout/PhiSplit';
import { PageContainer } from '../../components/layout/PageContainer';
import { GameFeedback } from '../../components/overlay-feedback/GameFeedback';
import { ProfileAvatar } from '../../components/game/ProfileAvatar';
import { ZmathLogo, ZmathNavLinks } from '../../components/navigation/ZmathGNB';
import { GameBreadcrumb, PhaseBar, InfoBox, CtaRow } from '../../components/game/GamePageLayout';
import { resolveIpProfile } from '../../utils/ipProfile';

const NK = '#0E0F0F';

// ─── MiniPizza ───────────────────────────────────────
/**
 * fillAngleDeg 모드: 연속 호(arc)로 색칠 + 칼금 라인으로 조각 표시.
 * 통분 중간 단계에서 분모가 맞지 않아도 색칠 영역(1/2, 1/3)을 정확히 유지.
 * fillAngleDeg가 null이면 기존 wedge 모드.
 */
function MiniPizza({ denominator, filledCount = 1, fillColor = '#FC5B31', size = 130, highlighted = false, fillAngleDeg = null }) {
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 4;
  const segStep = 360 / denominator;

  function polar(deg) {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function wedgePath(start, end) {
    const a = polar(start);
    const b = polar(end);
    const large = (end - start) > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)} Z`;
  }

  // ── 고정 각도 모드 (통분 애니메이션 중) ──
  if (fillAngleDeg !== null) {
    return (
      <svg width={ size } height={ size } viewBox={ `0 0 ${size} ${size}` } style={{ display: 'block', userSelect: 'none' }}>
        { highlighted && <circle cx={ cx } cy={ cy } r={ r + 6 } fill={ fillColor } opacity={ 0.15 } /> }
        <circle cx={ cx } cy={ cy } r={ r } fill="#FFF3CD" />
        { fillAngleDeg > 0 && (
          <path d={ wedgePath(0, fillAngleDeg) } fill={ fillColor } />
        ) }
        { Array.from({ length: denominator }).map((_, i) => {
          const p = polar(i * segStep);
          return (
            <line
              key={ i }
              x1={ cx } y1={ cy }
              x2={ p.x.toFixed(1) } y2={ p.y.toFixed(1) }
              stroke={ NK } strokeWidth="1.5"
            />
          );
        }) }
        <circle cx={ cx } cy={ cy } r={ r } fill="none" stroke={ NK } strokeWidth="2.5" />
        <circle cx={ cx } cy={ cy } r={ 3.5 } fill={ NK } />
      </svg>
    );
  }

  // ── 기본 wedge 모드 ──
  return (
    <svg width={ size } height={ size } viewBox={ `0 0 ${size} ${size}` } style={{ display: 'block', userSelect: 'none' }}>
      { highlighted && <circle cx={ cx } cy={ cy } r={ r + 6 } fill={ fillColor } opacity={ 0.15 } /> }
      <circle cx={ cx } cy={ cy } r={ r } fill="#FFF3CD" stroke={ NK } strokeWidth="2.5" />
      { Array.from({ length: denominator }).map((_, i) => (
        <path
          key={ i }
          d={ wedgePath(i * segStep, (i + 1) * segStep) }
          fill={ i < filledCount ? fillColor : '#FFFBF0' }
          stroke={ NK }
          strokeWidth={ highlighted && i < filledCount ? 2.5 : 1.5 }
          strokeLinejoin="round"
        />
      )) }
      <circle cx={ cx } cy={ cy } r={ 3.5 } fill={ NK } />
    </svg>
  );
}

// ─── ConceptFrac ──────────────────────────────────────
function ConceptFrac({ num, den, color = NK, size = '1.5rem' }) {
  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, userSelect: 'none' }}>
      <Typography sx={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: size, color, lineHeight: 1 }}>{ num }</Typography>
      <Box sx={{ width: 18, height: 2.5, backgroundColor: NK, my: '3px' }} />
      <Typography sx={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: size, color: NK, lineHeight: 1 }}>{ den }</Typography>
    </Box>
  );
}

// ─── ExplainBox / ExplainText ─────────────────────────
function ExplainBox({ heading, headingColor, children }) {
  return (
    <InfoBox>
      { heading && (
        <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.45, wordBreak: 'keep-all', ...(headingColor && { color: headingColor }) }}>
          { heading }
        </Typography>
      ) }
      { children }
    </InfoBox>
  );
}

function ExplainText({ children, bold }) {
  return (
    <Typography variant="body2" sx={{ lineHeight: 1.9, fontSize: '0.9rem', ...(bold && { fontWeight: 700 }) }}>
      { children }
    </Typography>
  );
}

// ─── SpeechBubble ─────────────────────────────────────
function SpeechBubble({ text }) {
  return (
    <Box sx={{
      position: 'relative',
      backgroundColor: '#FAFAF9',
      border: `2px solid ${NK}`,
      borderRadius: 2,
      px: 1.5, py: 0.75,
      boxShadow: `2px 2px 0 ${NK}`,
      '@keyframes bubbleBounce': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-5px)' },
      },
      animation: 'bubbleBounce 1.2s ease-in-out infinite',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-10px', left: '50%',
        transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderTop: `10px solid ${NK}`,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        bottom: '-7px', left: '50%',
        transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '8px solid #FAFAF9',
        zIndex: 1,
      },
    }}>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: NK, whiteSpace: 'nowrap' }}>{ text }</Typography>
    </Box>
  );
}


// ─── ChocolateBar ─────────────────────────────────────
// cols > 0: 그리드 모드 (정사각형 셀 배열)
// cols = 0: 단일 행 모드 (기존 가로 바)
function ChocolateBar({ denominator, filledCount = 0, fillColor = '#FC5B31', height = 52, fillRatio = null, svgWidth = 300, cols = 0 }) {
  const [uid] = useState(() => `cb${Math.random().toString(36).slice(2, 6)}`);
  const n     = Math.max(denominator, 1);
  const VW    = svgWidth;
  const VH    = height;
  const pad   = 5;
  const CREAM = '#EDD9A3';
  const CHOC  = '#3A1500';

  // ── 그리드 모드 ──
  if (cols > 0) {
    const grd     = 4;
    const numCols = cols;
    const numRows = Math.ceil(n / numCols);
    const cellW   = (VW - pad * 2 - grd * (numCols - 1)) / numCols;
    const cellH   = (VH - pad * 2 - grd * (numRows - 1)) / numRows;
    const rx      = Math.min(5, cellW * 0.2, cellH * 0.2);
    const filled  = fillRatio !== null ? Math.round(fillRatio * n) : filledCount;
    return (
      <svg width="100%" height={ height } viewBox={ `0 0 ${VW} ${VH}` } style={{ display: 'block', userSelect: 'none' }}>
        <rect x={ 0 } y={ 0 } width={ VW } height={ VH } rx={ rx + 4 } fill={ CHOC } />
        { Array.from({ length: n }).map((_, i) => {
          const c = i % numCols;
          const r = Math.floor(i / numCols);
          return (
            <rect key={ i }
              x={ pad + c * (cellW + grd) } y={ pad + r * (cellH + grd) }
              width={ cellW } height={ cellH } rx={ rx }
              fill={ i < filled ? fillColor : CREAM }
            />
          );
        }) }
      </svg>
    );
  }

  // ── 단일 행 모드 ──
  const gap  = 5;
  const iW   = VW - pad * 2;
  const iH   = VH - pad * 2;
  const segW = Math.max((iW - gap * (n - 1)) / n, 2);
  const rx   = Math.min(6, segW * 0.38, iH * 0.38);
  const sx   = (i) => pad + i * (segW + gap);

  return (
    <svg
      width="100%"
      height={ height }
      viewBox={ `0 0 ${VW} ${VH}` }
      style={{ display: 'block', userSelect: 'none' }}
    >
      {/* 외곽 초콜릿 보더 */}
      <rect x={ 0 } y={ 0 } width={ VW } height={ VH } rx={ rx + 3 } fill={ CHOC } />

      {/* 세그먼트 배경 */}
      { Array.from({ length: n }).map((_, i) => (
        <rect key={ `b${i}` }
          x={ sx(i) } y={ pad } width={ segW } height={ iH } rx={ rx }
          fill={ fillRatio === null && i < filledCount ? fillColor : CREAM }
        />
      )) }

      {/* fillRatio 모드: 색 오버레이를 세그먼트 영역으로 클리핑 */}
      { fillRatio !== null && fillRatio > 0 && (
        <>
          <defs>
            <clipPath id={ uid }>
              { Array.from({ length: n }).map((_, i) => (
                <rect key={ i } x={ sx(i) } y={ pad } width={ segW } height={ iH } rx={ rx } />
              )) }
            </clipPath>
          </defs>
          <rect
            x={ pad } y={ pad } width={ iW * fillRatio } height={ iH }
            fill={ fillColor } clipPath={ `url(#${uid})` }
          />
        </>
      ) }

      {/* 중앙 스코어링 라인 (초콜릿 홈) */}
      { n <= 16 && Array.from({ length: n }).map((_, i) => (
        <line key={ `l${i}` }
          x1={ sx(i) + segW * 0.12 } y1={ pad + iH / 2 }
          x2={ sx(i) + segW * 0.88 } y2={ pad + iH / 2 }
          stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinecap="round"
        />
      )) }
    </svg>
  );
}

const PHASE_LABELS = ['분수', '통분', '분수 덧셈', '연습', '문제 풀기'];

// ─────────────────────────────────────────────────────
// Screen0 — 분수: "분수는 어떻게 더할까요?"
// 통분하기 → 좌측 피자 클릭(조각 잘라짐) → 우측 피자 클릭 → 덧셈하기 → 결과 피자 색칠
// ─────────────────────────────────────────────────────
function Screen0({ onNext, onPhaseBarChange, children }) {
  const theme = useTheme();
  const { zmath } = theme.palette;
  const colorA = zmath.accent.orange;
  const colorB = zmath.accent.violet;

  // 0: 초기 / 1: 좌측 클릭 중 / 2: 우측 클릭 중 / 3: 완료 / 4: 덧셈 애니메이션
  const [step, setStep]           = useState(0);

  // step → PhaseBar 인덱스: 0="분수", 1~2="통분", 3~4="분수 덧셈"
  useEffect(() => {
    if (!onPhaseBarChange) return;
    if (step === 0) onPhaseBarChange(0);
    else if (step <= 2) onPhaseBarChange(1);
    else onPhaseBarChange(2);
  }, [step]);
  const [leftDenom, setLeftDenom]   = useState(2);
  const [rightDenom, setRightDenom] = useState(3);
  const [leftCutting, setLeftCutting]   = useState(false);
  const [rightCutting, setRightCutting] = useState(false);
  const [resultFilled, setResultFilled] = useState(0);

  const TARGET = 6;
  const LEFT_ANGLE  = 180;
  const RIGHT_ANGLE = 120;

  const leftDone  = leftDenom  >= TARGET;
  const rightDone = rightDenom >= TARGET;
  const textVisible = step === 4 && resultFilled >= 5;

  const handleBack = () => {
    if (step === 4) {
      setStep(3);
      setResultFilled(0);
    } else if (step > 0) {
      setStep(0);
      setLeftDenom(2);
      setRightDenom(3);
      setLeftCutting(false);
      setRightCutting(false);
    }
  };

  const handleLeftClick = () => {
    if (step !== 1 || leftDone || leftCutting) return;
    const next = leftDenom + 1;
    setLeftDenom(next);
    setLeftCutting(true);
    setTimeout(() => {
      setLeftCutting(false);
      if (next >= TARGET) setTimeout(() => setStep(2), 260);
    }, 320);
  };

  const handleRightClick = () => {
    if (step !== 2 || rightDone || rightCutting) return;
    const next = rightDenom + 1;
    setRightDenom(next);
    setRightCutting(true);
    setTimeout(() => {
      setRightCutting(false);
      if (next >= TARGET) setTimeout(() => setStep(3), 260);
    }, 320);
  };

  const handleResultClick = () => {
    if (resultFilled >= 5) return;
    setResultFilled(f => f + 1);
  };

  const title = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h2" sx={{ fontWeight: 900 }}>분수는 어떻게 더할까요?</Typography>
    </Box>
  );

  const body = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* ── 피자 영역 ── */}
      { step < 4 ? (
        /* 통분 단계: 피자 두 개 */
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: { xs: 6, sm: 10 } }}>

          {/* 왼쪽 피자 1/2 → 3/6 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ height: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', mb: 0.25 }}>
              { step === 1 && !leftDone && <SpeechBubble text="클릭해서 조각을 나눠보세요" /> }
              { leftDone && <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#2E7D32' }}>통분 완료! ✓</Typography> }
            </Box>
            <Box
              onClick={ handleLeftClick }
              sx={{
                cursor: step === 1 && !leftDone ? 'pointer' : 'default',
                opacity: step === 2 && !leftDone ? 0.6 : 1,
                transform: leftCutting ? 'scale(1.06)' : 'scale(1)',
                filter: leftCutting ? `drop-shadow(0 0 12px ${colorA})` : 'none',
                transitionProperty: 'transform, filter, opacity',
                transitionDuration: leftCutting ? '0.1s, 0.1s, 0.3s' : '0.22s, 0.22s, 0.3s',
                transitionTimingFunction: 'ease',
              }}
            >
              <MiniPizza
                denominator={ leftDenom }
                filledCount={ leftDone ? 3 : 1 }
                fillColor={ colorA }
                size={ 185 }
                highlighted={ step === 1 && !leftDone }
                fillAngleDeg={ leftDone ? null : LEFT_ANGLE }
              />
            </Box>
            <ConceptFrac num={ Math.floor(leftDenom / 2) } den={ leftDenom } color={ colorA } size="1.4rem" />
          </Box>

          {/* 오른쪽 피자 1/3 → 2/6 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ height: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', mb: 0.25 }}>
              { step === 2 && !rightDone && <SpeechBubble text="클릭해서 조각을 나눠보세요" /> }
              { rightDone && <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#2E7D32' }}>통분 완료! ✓</Typography> }
            </Box>
            <Box
              onClick={ handleRightClick }
              sx={{
                cursor: step === 2 && !rightDone ? 'pointer' : 'default',
                opacity: step === 1 ? 0.5 : 1,
                transform: rightCutting ? 'scale(1.06)' : 'scale(1)',
                filter: rightCutting ? `drop-shadow(0 0 12px ${colorB})` : 'none',
                transitionProperty: 'transform, filter, opacity',
                transitionDuration: rightCutting ? '0.1s, 0.1s, 0.3s' : '0.22s, 0.22s, 0.3s',
                transitionTimingFunction: 'ease',
              }}
            >
              <MiniPizza
                denominator={ rightDenom }
                filledCount={ rightDone ? 2 : 1 }
                fillColor={ colorB }
                size={ 185 }
                highlighted={ step === 2 && !rightDone }
                fillAngleDeg={ rightDone ? null : RIGHT_ANGLE }
              />
            </Box>
            <ConceptFrac num={ Math.floor(rightDenom / 3) } den={ rightDenom } color={ colorB } size="1.4rem" />
          </Box>
        </Box>
      ) : (
        /* 덧셈 단계 (step 4): 소스 피자 좌이동 + 결과 피자 페이드인 */
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>

          {/* 소스 피자 그룹 — 좌측으로 슬라이드 */}
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2,
            '@keyframes slideToLeft': {
              from: { transform: 'translateX(44px)' },
              to:   { transform: 'translateX(0)' },
            },
            animation: 'slideToLeft 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <MiniPizza denominator={ 6 } filledCount={ 3 } fillColor={ colorA } size={ 170 } />
              <ConceptFrac num={ 3 } den={ 6 } color={ colorA } size="0.95rem" />
            </Box>
            <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', lineHeight: 1, color: 'text.disabled' }}>+</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
              <MiniPizza denominator={ 6 } filledCount={ 2 } fillColor={ colorB } size={ 170 } />
              <ConceptFrac num={ 2 } den={ 6 } color={ colorB } size="0.95rem" />
            </Box>
          </Box>

          {/* 결과 그룹 — 우측에서 페이드인 */}
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2,
            '@keyframes fadeSlideIn': {
              from: { opacity: 0, transform: 'translateX(30px)' },
              to:   { opacity: 1, transform: 'translateX(0)' },
            },
            animation: 'fadeSlideIn 0.4s ease 0.28s both',
          }}>
            <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', lineHeight: 1, color: 'text.disabled' }}>=</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: -34, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                { resultFilled < 5
                  ? <SpeechBubble text="색을 칠해보세요" />
                  : <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#2E7D32' }}>완성! ✓</Typography>
                }
              </Box>
              <Box
                onClick={ handleResultClick }
                sx={{
                  cursor: resultFilled < 5 ? 'pointer' : 'default',
                  transition: 'transform 0.15s',
                  '&:hover': resultFilled < 5 ? { transform: 'scale(1.04)' } : {},
                  '&:active': resultFilled < 5 ? { transform: 'scale(0.96)' } : {},
                }}
              >
                <MiniPizza
                  denominator={ 6 }
                  filledCount={ resultFilled }
                  fillColor="#C850A0"
                  size={ 170 }
                  highlighted={ resultFilled < 5 }
                />
              </Box>
              <ConceptFrac num={ resultFilled } den={ 6 } size="0.95rem" />
            </Box>
          </Box>
        </Box>
      ) }
    </Box>
  );

  const content = (
    <InfoBox>
      { step < 4 ? (
        <>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.25 }}>
            { step < 3
              ? '둘 다 1조각이지만, 크기가 달라요.'
              : '이제 분모가 같아졌어요. 색칠된 조각을 더할 수 있어요!'
            }
          </Typography>
          { step < 3 ? (
            <>
              <Typography variant="body2" sx={{ lineHeight: 1.85, fontSize: '0.9rem' }}>
                2조각으로 나눈 피자의 1조각과, 3조각으로 나눈 피자의 1조각은 크기가 달라요.
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.85 }}>
                그래서 분수를 더하려면, 먼저 조각 크기를 같게 만들어야 해요.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body2" sx={{ lineHeight: 1.85, fontSize: '0.9rem' }}>
                1/2을 3/6으로, 1/3을 2/6으로 바꿨어요.
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.85 }}>
                이렇게 분모를 같게 만드는 것을 <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>통분</Box>이라고 해요.
              </Typography>
            </>
          ) }
        </>
      ) : (
        <>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.25 }}>
            분모가 같아지면 <Box component="span" sx={{ color: 'primary.main' }}>분자</Box>를 더할 수 있어요.
          </Typography>
          { textVisible && (
            <>
              <Typography variant="body2" sx={{ lineHeight: 1.85, fontSize: '0.9rem' }}>
                색칠된 조각이 3개 + 2개 = <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>5개</Box>! 그래서 <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>5/6</Box>이에요.
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.85 }}>
                분수 덧셈은 분모를 같게 만든 후, 분자를 더해주면 돼요.
              </Typography>
            </>
          ) }
        </>
      ) }
    </InfoBox>
  );

  const cta = (
    <>
      { step === 0 && <CtaRow onBack={ null } onNext={ () => setStep(1) } nextLabel="통분하기 →" /> }
      { step === 1 && <CtaRow onBack={ handleBack } onNext={ () => {} } nextDisabled disabledLabel="왼쪽 피자를 클릭해봐요" /> }
      { step === 2 && <CtaRow onBack={ handleBack } onNext={ () => {} } nextDisabled disabledLabel="오른쪽 피자를 클릭해봐요" /> }
      { step === 3 && <CtaRow onBack={ handleBack } onNext={ () => setStep(4) } nextLabel="덧셈하기 →" /> }
      { step === 4 && (
        <CtaRow
          onBack={ handleBack }
          onNext={ onNext }
          nextLabel="연습 해보기 →"
          nextDisabled={ !textVisible }
          disabledLabel="피자에 색을 칠해봐요"
        />
      ) }
    </>
  );

  return children({ title, body, content, cta });
}

// ─────────────────────────────────────────────────────
// Screen3 — 연습: "연습 해볼까요?"
// 2/3 + 1/4 = 11/12 (LCM=12) — Screen4와 동일한 UX 패턴
// ─────────────────────────────────────────────────────
function Screen3({ onNext, onBack, children }) {
  const theme = useTheme();
  const { zmath } = theme.palette;
  const colorA = zmath.accent.orange;
  const colorB = zmath.accent.violet;

  const [answerPhase, setAnswerPhase] = useState('tongbun');
  const [blankSegs, setBlankSegs]     = useState(1);
  const [blankFilled, setBlankFilled] = useState(0);
  const [result, setResult]           = useState(null);

  // 정답: 2/3 + 1/4 = 8/12 + 3/12 = 11/12
  const isCorrect = blankFilled > 0 && (blankFilled * 12 === blankSegs * 11);
  const denomOk   = blankSegs > 0 && blankSegs % 12 === 0;

  // 좌측 피자: 선 개수는 항상 blankSegs, 색칠은 호(arc)로 고정 비율 유지
  const ARC_A = (2 / 3) * 360; // 2/3 = 240°
  const ARC_B = (1 / 4) * 360; // 1/4 = 90°

  const handlePizzaClick = () => {
    if (answerPhase === 'tongbun') setBlankSegs(s => s + 1);
    else if (answerPhase === 'fill') setBlankFilled(f => Math.min(f + 1, blankSegs));
  };

  const handleReduce = () => {
    if (answerPhase === 'tongbun') setBlankSegs(s => Math.max(s - 1, 1));
    else if (answerPhase === 'fill') setBlankFilled(f => Math.max(f - 1, 0));
  };

  const handleCheck = () => {
    setResult(isCorrect ? 'correct' : 'wrong');
    setAnswerPhase('result');
  };

  const handleRetry = () => {
    setAnswerPhase('tongbun');
    setBlankSegs(1);
    setBlankFilled(0);
    setResult(null);
  };

  const title = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h2" sx={{ fontWeight: 900 }}>연습 해볼까요?</Typography>
    </Box>
  );

  const body = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 피자 비교 줄 — speech bubble은 absolute라 레이아웃 높이에 영향 없음 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>

        {/* 소스 피자 A — 선 개수=blankSegs, 색칠=호(arc) 2/3 고정 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <MiniPizza denominator={ blankSegs } filledCount={ 0 } fillAngleDeg={ ARC_A } fillColor={ colorA } size={ 170 } />
          <ConceptFrac num={ 2 } den={ 3 } color={ colorA } size="0.95rem" />
        </Box>

        <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', lineHeight: 1, color: 'text.disabled' }}>+</Typography>

        {/* 소스 피자 B — 선 개수=blankSegs, 색칠=호(arc) 1/4 고정 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <MiniPizza denominator={ blankSegs } filledCount={ 0 } fillAngleDeg={ ARC_B } fillColor={ colorB } size={ 170 } />
          <ConceptFrac num={ 1 } den={ 4 } color={ colorB } size="0.95rem" />
        </Box>

        <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', lineHeight: 1, color: 'text.disabled' }}>=</Typography>

        {/* 답 피자 — speech bubble은 absolute */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: -34, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
            { answerPhase === 'tongbun' && <SpeechBubble text="클릭해서 나눠봐요" /> }
            { answerPhase === 'fill' && blankFilled < blankSegs && <SpeechBubble text="클릭해서 색칠해요" /> }
            { answerPhase === 'fill' && blankFilled === blankSegs && (
              <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#B36200' }}>정답 확인 버튼을 눌러봐요!</Typography>
            ) }
          </Box>
          <Box
            onClick={ answerPhase !== 'result' ? handlePizzaClick : undefined }
            sx={{
              cursor: answerPhase !== 'result' ? 'pointer' : 'default',
              transition: 'transform 0.15s',
              '&:active': answerPhase !== 'result' ? { transform: 'scale(0.96)' } : {},
            }}
          >
            <MiniPizza
              denominator={ blankSegs }
              filledCount={ answerPhase !== 'tongbun' ? blankFilled : 0 }
              fillColor="#C850A0"
              size={ 170 }
              highlighted={ answerPhase !== 'result' }
            />
          </Box>
          {/* [−] 레이블 [+] */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={ handleReduce }
              disabled={
                answerPhase === 'result' ||
                (answerPhase === 'tongbun' ? blankSegs <= 1 : blankFilled === 0)
              }
              sx={{ width: 36, height: 36, minWidth: 'unset', borderRadius: '50%', p: 0, fontSize: '1.1rem', fontWeight: 900 }}
            >
              −
            </Button>
            <Box sx={{ minWidth: 60, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              { answerPhase === 'tongbun'
                ? <Typography sx={{ fontSize: '0.95rem', color: 'text.secondary', fontWeight: 700 }}>{ blankSegs }조각</Typography>
                : <ConceptFrac num={ blankFilled } den={ blankSegs } size="0.95rem" />
              }
            </Box>
            <Button
              variant="outlined"
              onClick={ answerPhase !== 'result' ? handlePizzaClick : undefined }
              disabled={
                answerPhase === 'result' ||
                (answerPhase === 'fill' && blankFilled >= blankSegs)
              }
              sx={{ width: 36, height: 36, minWidth: 'unset', borderRadius: '50%', p: 0, fontSize: '1.1rem', fontWeight: 900 }}
            >
              ＋
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const content = answerPhase !== 'result' ? (
    <ExplainBox heading="3과 4를 모두 똑같이 나눌 수 있는 수를 찾아요.">
      { answerPhase === 'fill' && (
        <>
          <ExplainText>
            3의 배수이면서 4의 배수인 수는 <Box component="span" sx={{ fontWeight: 900 }}>12</Box>예요. 그래서 분모를 <Box component="span" sx={{ fontWeight: 900 }}>12</Box>로 맞춰요.
          </ExplainText>
          <ExplainText>
            2/3는 <Box component="span" sx={{ fontWeight: 900 }}>8/12</Box>, 1/4은 <Box component="span" sx={{ fontWeight: 900 }}>3/12</Box>가 돼요.
          </ExplainText>
          <ExplainText>이제 분모가 같으니까 분자끼리 더하면 돼요.</ExplainText>
        </>
      ) }
    </ExplainBox>
  ) : result === 'correct' ? (
    <ExplainBox heading="정답이에요! 🎉">
      <ExplainText>
        2/3 + 1/4 = 8/12 + 3/12 = <Box component="span" sx={{ fontWeight: 900, color: 'primary.main' }}>11/12</Box>
      </ExplainText>
      <ExplainText bold>잘했어요!</ExplainText>
    </ExplainBox>
  ) : (
    <ExplainBox heading="아직 아니에요. 다시 생각해봐요!" headingColor="#C62828">
      <ExplainText>
        { !denomOk
          ? '분모가 맞지 않아요. 3과 4의 공배수로 나눠야 해요.'
          : '분모는 맞아요! 색칠한 조각 수를 다시 세어보세요.'
        }
      </ExplainText>
    </ExplainBox>
  );

  const cta = (
    <>
      { answerPhase === 'tongbun' && (
        <CtaRow
          onBack={ onBack }
          onNext={ () => { setBlankFilled(0); setAnswerPhase('fill'); } }
          nextLabel="색칠 시작 →"
          nextDisabled={ blankSegs < 2 }
          disabledLabel="조각을 나눠봐요"
        />
      ) }
      { answerPhase === 'fill' && (
        <CtaRow
          onBack={ () => setAnswerPhase('tongbun') }
          onNext={ handleCheck }
          nextLabel="정답 확인"
        />
      ) }
      { answerPhase === 'result' && result === 'correct' && (
        <CtaRow onBack={ handleRetry } onNext={ onNext } nextLabel="문제 풀기 →" />
      ) }
      { answerPhase === 'result' && result === 'wrong' && (
        <CtaRow onBack={ () => setAnswerPhase('tongbun') } onNext={ handleRetry } nextLabel="다시 시도" />
      ) }
    </>
  );

  return children({ title, body, content, cta });
}

// ─────────────────────────────────────────────────────
// Screen4 — 문제 풀기: "문제를 풀어볼까요?"
// 1/2 + 1/4 = 3/4 (LCM=4)
// 좌: 소스 바 (빈 바 클릭 시 자동 통분 시각화)  =  우: 빈 답 바
// 단계: 'tongbun'(분모 설정) → 'fill'(색칠) → 'result'
// ─────────────────────────────────────────────────────
function Screen4({ onComplete, onBack, children }) {
  const CHOC_FILL = '#7B3F00';

  const [answerPhase, setAnswerPhase] = useState('tongbun');
  const [blankSegs, setBlankSegs]     = useState(1);
  const [blankFilled, setBlankFilled] = useState(0);
  const [result, setResult]           = useState(null);

  // 정답: blankFilled / blankSegs = 3/4 (분모 무관)
  const isCorrect = blankFilled > 0 && (blankFilled * 4 === blankSegs * 3);
  const denomOk   = blankSegs > 0 && blankSegs % 4 === 0;

  const handleBarClick = () => {
    if (answerPhase === 'tongbun') setBlankSegs(s => s + 1);
    else if (answerPhase === 'fill') setBlankFilled(f => Math.min(f + 1, blankSegs));
  };

  const handleReduce = () => {
    if (answerPhase === 'tongbun') setBlankSegs(s => Math.max(s - 1, 1));
    else if (answerPhase === 'fill') setBlankFilled(f => Math.max(f - 1, 0));
  };

  const handleCheck = () => {
    setResult(isCorrect ? 'correct' : 'wrong');
    setAnswerPhase('result');
  };

  const handleRetry = () => {
    setAnswerPhase('tongbun');
    setBlankSegs(1);
    setBlankFilled(0);
    setResult(null);
  };

  const title = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h2" sx={{ fontWeight: 900 }}>1/2 + 1/4는?</Typography>
    </Box>
  );

  const body = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* ── CSS Grid: 3개 초콜릿 같은 크기, +/= 세로 가운데 ── */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '130px auto 130px auto 130px',
        gridTemplateRows: '130px auto',
        columnGap: 2,
        rowGap: 1,
        alignItems: 'center',
      }}>
        {/* ── Row 1: 초콜릿 바 + 기호 ── */}

        {/* Bar A: 1/2 (좌우 2칸) */}
        <ChocolateBar denominator={ 2 } fillColor={ CHOC_FILL } height={ 130 } filledCount={ 1 } svgWidth={ 130 } cols={ 2 } />

        {/* + */}
        <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: 'text.disabled', textAlign: 'center' }}>+</Typography>

        {/* Bar B: 1/4 (2×2) */}
        <ChocolateBar denominator={ 4 } fillColor={ CHOC_FILL } height={ 130 } filledCount={ 1 } svgWidth={ 130 } cols={ 2 } />

        {/* = */}
        <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: 'text.disabled', textAlign: 'center' }}>=</Typography>

        {/* 답 바 — 클릭 가능, 말풍선 absolute */}
        <Box sx={{ position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: -36, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
            { answerPhase === 'tongbun' && <SpeechBubble text="클릭해서 나눠봐요" /> }
            { answerPhase === 'fill' && blankFilled < blankSegs && <SpeechBubble text="클릭해서 색칠해요" /> }
            { answerPhase === 'fill' && blankFilled === blankSegs && (
              <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#B36200' }}>정답 확인!</Typography>
            ) }
          </Box>
          <Box
            onClick={ answerPhase !== 'result' ? handleBarClick : undefined }
            sx={{
              cursor: answerPhase !== 'result' ? 'pointer' : 'default',
              transition: 'transform 0.12s',
              '&:active': answerPhase !== 'result' ? { transform: 'scale(0.97)' } : {},
            }}
          >
            <ChocolateBar
              denominator={ blankSegs }
              filledCount={ answerPhase !== 'tongbun' ? blankFilled : 0 }
              fillColor={ CHOC_FILL }
              height={ 130 }
              svgWidth={ 130 }
              cols={ 2 }
            />
          </Box>
        </Box>

        {/* ── Row 2: 라벨 + 빈 칸 + 컨트롤 ── */}

        {/* Bar A 라벨 */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ConceptFrac num={ 1 } den={ 2 } size="0.9rem" />
        </Box>

        {/* + 자리 (빈 칸) */}
        <Box />

        {/* Bar B 라벨 */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ConceptFrac num={ 1 } den={ 4 } size="0.9rem" />
        </Box>

        {/* = 자리 (빈 칸) */}
        <Box />

        {/* 컨트롤 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
          <Button
            variant="outlined"
            onClick={ handleReduce }
            disabled={
              answerPhase === 'result' ||
              (answerPhase === 'tongbun' ? blankSegs <= 1 : blankFilled === 0)
            }
            sx={{ width: 30, height: 30, minWidth: 'unset', borderRadius: '50%', p: 0, fontSize: '1rem', fontWeight: 900, flexShrink: 0 }}
          >
            −
          </Button>
          <Box sx={{ minWidth: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            { answerPhase === 'tongbun'
              ? <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', fontWeight: 700 }}>{ blankSegs }조각</Typography>
              : <ConceptFrac num={ blankFilled } den={ blankSegs } size="0.85rem" />
            }
          </Box>
          <Button
            variant="outlined"
            onClick={ answerPhase !== 'result' ? handleBarClick : undefined }
            disabled={
              answerPhase === 'result' ||
              (answerPhase === 'fill' && blankFilled >= blankSegs)
            }
            sx={{ width: 30, height: 30, minWidth: 'unset', borderRadius: '50%', p: 0, fontSize: '1rem', fontWeight: 900, flexShrink: 0 }}
          >
            ＋
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const content = answerPhase !== 'result' ? (
    <ExplainBox heading="문제를 풀어볼까요?">
      <ExplainText>그림을 보면서 상상해보세요.</ExplainText>
    </ExplainBox>
  ) : result === 'correct' ? (
    <ExplainBox heading="정답이에요! 🎉">
      <ExplainText>1/2 = 2/4이고, 2/4 + 1/4 = <Box component="span" sx={{ fontWeight: 900, color: 'primary.main' }}>3/4</Box>이에요.</ExplainText>
      <ExplainText bold>잘했어요!</ExplainText>
    </ExplainBox>
  ) : (
    <ExplainBox heading="아직 아니에요. 다시 생각해봐요!" headingColor="#C62828">
      <ExplainText>
        { !denomOk
          ? '분모가 맞지 않아요. 2와 4의 공배수로 나눠야 해요.'
          : '분모는 맞아요! 색칠한 조각 수를 다시 세어보세요.'
        }
      </ExplainText>
    </ExplainBox>
  );

  const cta = (
    <>
      { answerPhase === 'tongbun' && (
        <CtaRow
          onBack={ onBack }
          onNext={ () => { setBlankFilled(0); setAnswerPhase('fill'); } }
          nextLabel="색칠 시작 →"
          nextDisabled={ blankSegs < 2 }
          disabledLabel="조각을 나눠봐요"
        />
      ) }
      { answerPhase === 'fill' && (
        <CtaRow
          onBack={ () => setAnswerPhase('tongbun') }
          onNext={ handleCheck }
          nextLabel="정답 확인"
        />
      ) }
      { answerPhase === 'result' && result === 'correct' && (
        <CtaRow onBack={ handleRetry } onNext={ onComplete } nextLabel="모두 완료! 🎉" />
      ) }
      { answerPhase === 'result' && result === 'wrong' && (
        <CtaRow onBack={ onBack } onNext={ handleRetry } nextLabel="다시 풀기 →" />
      ) }
    </>
  );

  return children({ title, body, content, cta });
}

// ─── 페이지 컨트롤러 ──────────────────────────────────
// phase: 0=분수 개념(Screen0), 3=연습(Screen3), 4=문제 풀기(Screen4)
// phases 1,2는 Screen0 내부 step으로 통합되어 별도 화면 없음
/**
 * @param {function} onBack - 카테고리 목록으로 돌아가기 콜백, categoryId를 인자로 전달 [Optional]
 * @param {string} categoryId - 이 게임이 속한 카테고리 ID [Optional, 기본값: 'arithmetic']
 * @param {function} onGoHome - 홈으로 이동 콜백 [Optional]
 * @param {function} onGoGrades - 학년 전체 목록으로 이동 콜백 [Optional]
 * @param {function} onElementary6 - 초등6 버튼 클릭 콜백 [Optional]
 */
export function ZmathFractionGamePage({ onBack, categoryId = 'arithmetic', onGoHome, onGoGrades, onGoProfile, onElementary6 }) {
  const [phase, setPhase]               = useState(0);
  const [displayPhase, setDisplayPhase] = useState(0); // PhaseBar 표시용 (0~4)
  const [gameKey, setGameKey]           = useState(0);
  const [complete, setComplete]         = useState(false);
  const [avatarVariant, setAvatarVariant] = useState('confident');

  useEffect(() => {
    resolveIpProfile().then((p) => { if (p) setAvatarVariant(p.avatarVariant); });
  }, []);

  const handleBackToCategory = () => onBack?.(categoryId);

  const handleRetry = () => {
    setPhase(0);
    setDisplayPhase(0);
    setComplete(false);
    setGameKey(k => k + 1);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppShell
        logo={ <ZmathLogo onClick={ onGoHome } /> }
        headerCollapsible={
          <ZmathNavLinks
            active="초등5"
            avatarVariant={ avatarVariant }
            isProfileActive={ false }
            onProfileClick={ onGoProfile }
            onElementary6={ onElementary6 }
            onNavClick={ (label) => {
              if (label === '홈') onGoHome?.();
              else if (label === '초등5') onGoGrades?.();
            }}
          />
        }
        headerPersistent={ null }
        hasHeaderBorder
        headerHeight={ 72 }
        sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}
      >
        <GameBreadcrumb
          category="수와 연산"
          title="분수의 덧셈"
          onBack={ handleBackToCategory }
          onGoHome={ onGoHome }
          onGoGrades={ onGoGrades }
        />

        <PageContainer maxWidth={false} sx={{ maxWidth: { xs: '100%', lg: 'min(68.33vw, 1200px)' }, px: { xs: 2, md: 4 }, py: 4 }}>
          { phase === 0 && (
            <Screen0
              key={ `s0-${gameKey}` }
              onNext={ () => { setPhase(3); setDisplayPhase(3); } }
              onPhaseBarChange={ setDisplayPhase }
            >
              { ({ title, body, content, cta }) => (
                <PhiSplit
                  gap={ 5.5 }
                  stackAt="sm"
                  sx={{ alignItems: 'flex-start' }}
                  primarySx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: { xs: '0 0 auto', sm: '0 0 auto', md: '0 0 68%' }, minHeight: 480 }}
                  secondarySx={{ flex: { xs: '0 0 auto', sm: '0 0 auto', md: '0 0 32%' } }}
                  primary={
                    <>
                      <PhaseBar phase={ displayPhase } labels={ PHASE_LABELS } />
                      { title }
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{ body }</Box>
                      { cta }
                    </>
                  }
                  secondary={ content }
                />
              ) }
            </Screen0>
          ) }
          { phase === 3 && (
            <Screen3
              key={ `s3-${gameKey}` }
              onNext={ () => { setPhase(4); setDisplayPhase(4); } }
              onBack={ () => { setPhase(0); setDisplayPhase(0); } }
            >
              { ({ title, body, content, cta }) => (
                <PhiSplit
                  gap={ 5.5 }
                  stackAt="sm"
                  sx={{ alignItems: 'flex-start' }}
                  primarySx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: { xs: '0 0 auto', sm: '0 0 auto', md: '0 0 68%' }, minHeight: 480 }}
                  secondarySx={{ flex: { xs: '0 0 auto', sm: '0 0 auto', md: '0 0 32%' } }}
                  primary={
                    <>
                      <PhaseBar phase={ displayPhase } labels={ PHASE_LABELS } />
                      { title }
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{ body }</Box>
                      { cta }
                    </>
                  }
                  secondary={ content }
                />
              ) }
            </Screen3>
          ) }
          { phase === 4 && (
            <Screen4
              key={ `s4-${gameKey}` }
              onComplete={ () => setComplete(true) }
              onBack={ () => { setPhase(3); setDisplayPhase(3); } }
            >
              { ({ title, body, content, cta }) => (
                <PhiSplit
                  gap={ 5.5 }
                  stackAt="sm"
                  sx={{ alignItems: 'flex-start' }}
                  primarySx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: { xs: '0 0 auto', sm: '0 0 auto', md: '0 0 68%' }, minHeight: 480 }}
                  secondarySx={{ flex: { xs: '0 0 auto', sm: '0 0 auto', md: '0 0 32%' } }}
                  primary={
                    <>
                      <PhaseBar phase={ displayPhase } labels={ PHASE_LABELS } />
                      { title }
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{ body }</Box>
                      { cta }
                    </>
                  }
                  secondary={ content }
                />
              ) }
            </Screen4>
          ) }
        </PageContainer>

        { complete && (
          <GameFeedback
            score={ 5 }
            total={ 5 }
            onRetry={ handleRetry }
            onHome={ onGoHome ?? handleBackToCategory }
          />
        ) }
      </AppShell>
    </Box>
  );
}

// ─── 스토리 ───────────────────────────────────────────
export default {
  title: 'Page/zMath Fraction Game',
  parameters: { layout: 'fullscreen' },
  includeStories: ['Default'],
};

const NAV_STUBS = {
  onGoHome:      () => window.alert('→ 홈'),
  onGoGrades:    () => window.alert('→ 초등5 목록'),
  onBack:        (catId) => window.alert(`→ 목록 (${catId ?? 'all'})`),
  onGoProfile:   () => window.alert('→ 프로필'),
  onElementary6: () => window.alert('초등 6학년 콘텐츠는 준비중입니다.'),
};

export const Default = {
  name: '분수의 덧셈 — 전체 플로우',
  render: () => <ZmathFractionGamePage { ...NAV_STUBS } />,
};

