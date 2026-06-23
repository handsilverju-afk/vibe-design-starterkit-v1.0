import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// ─── 수학 유틸 ───────────────────────────────────
function gcd(a, b) { return b ? gcd(b, a % b) : a; }
function lcm(a, b) { return (a * b) / gcd(a, b); }

const NK = '#0E0F0F';
const CHOCO_OUTER = '#5C3010';
const CHOCO_EMPTY = '#8B5A2B';

// ─── 초콜릿 바 SVG ───────────────────────────────
function ChocolateBarSVG({ denominator, sliceColors = [], onSliceClick, clickable = false, width = 300, height = 64 }) {
  const segW = width / denominator;
  const GAP = 3;

  return (
    <svg
      width={ width } height={ height }
      viewBox={ `0 0 ${width} ${height}` }
      style={{ display: 'block', overflow: 'visible', userSelect: 'none' }}
    >
      <rect width={ width } height={ height } rx={ 10 } fill={ CHOCO_OUTER } stroke={ NK } strokeWidth={ 2 } />
      { Array.from({ length: denominator }).map((_, i) => {
        const x = i * segW + GAP;
        const y = GAP;
        const w = segW - GAP * 2;
        const h = height - GAP * 2;
        const color = sliceColors[i];
        return (
          <g key={ i }
            onClick={ onSliceClick ? (e) => { e.stopPropagation(); onSliceClick(i); } : undefined }
            style={{ cursor: onSliceClick ? 'pointer' : clickable ? 'pointer' : 'default' }}
          >
            <rect x={ x } y={ y } width={ w } height={ h } rx={ 5 }
              fill={ color || CHOCO_EMPTY }
              stroke={ NK } strokeWidth={ 1.5 }
              style={{ transition: 'fill 0.18s ease' }}
            />
            <rect x={ x + 3 } y={ y + 3 } width={ Math.max(w - 6, 4) } height={ 5 } rx={ 2 }
              fill="rgba(255,255,255,0.12)"
              style={{ pointerEvents: 'none' }}
            />
          </g>
        );
      }) }
    </svg>
  );
}

// ─── 분수 표기 ───────────────────────────────────
function Frac({ num, den, color = NK, size = '1.6rem', strike = false }) {
  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, position: 'relative', userSelect: 'none' }}>
      <Typography sx={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: size, color, lineHeight: 1 }}>{ num }</Typography>
      <Box sx={{ width: 20, height: 2.5, backgroundColor: NK, my: '3px' }} />
      <Typography sx={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: size, color: NK, lineHeight: 1 }}>{ den }</Typography>
      { strike && <Box sx={{ position: 'absolute', top: '50%', left: -4, right: -4, height: 2, backgroundColor: 'error.main', opacity: 0.6, transform: 'rotate(-8deg)' }} /> }
    </Box>
  );
}

// ─── 단계 바 ────────────────────────────────────
const STAGES = ['통분', '합산', '완성'];

function StageBar({ current }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mb: 1 }}>
      { STAGES.map((label, i) => (
        <Box key={ label } sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{
            px: 1.25, py: 0.3, borderRadius: 999,
            backgroundColor: i <= current ? 'primary.main' : 'rgba(26,26,26,0.08)',
            border: `1.5px solid ${ i <= current ? NK : 'rgba(26,26,26,0.15)' }`,
            transition: 'all 0.3s',
          }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, color: i <= current ? '#FAFAF9' : 'text.disabled' }}>
              { i + 1 }. { label }
            </Typography>
          </Box>
          { i < STAGES.length - 1 && (
            <Box sx={{ width: 12, height: 2, backgroundColor: i < current ? 'primary.main' : 'rgba(26,26,26,0.1)', borderRadius: 1, transition: 'all 0.3s' }} />
          ) }
        </Box>
      )) }
    </Box>
  );
}

// ─── 문제 고정 ───────────────────────────────────
const PROBLEM = { a: { n: 2, d: 3 }, b: { n: 1, d: 4 } };
const MAX_MULT = 5;
const BAR_W = 300;

// ═══════════════════════════════════════════════
// 메인 게임
// ═══════════════════════════════════════════════

/**
 * ChocolateBarGame — 초콜릿 바로 분수 덧셈 (2/3 + 1/4 = 11/12)
 *
 * Props:
 * @param {function} onComplete - 완료 시 호출 [Optional]
 *
 * Example usage:
 * <ChocolateBarGame onComplete={handleNext} />
 */
export function ChocolateBarGame({ onComplete }) {
  const theme = useTheme();
  const { zmath } = theme.palette;
  const colorA = zmath.accent.orange;
  const colorB = zmath.accent.violet;

  const { a, b } = PROBLEM;
  const lcd  = lcm(a.d, b.d);       // 12
  const aN   = a.n * (lcd / a.d);   // 8
  const bN   = b.n * (lcd / b.d);   // 3
  const sumN = aN + bN;              // 11
  const g    = gcd(sumN, lcd);       // 1

  const [stage, setStage]               = useState(0);
  const [multA, setMultA]               = useState(1);
  const [multB, setMultB]               = useState(1);
  const [popA, setPopA]                 = useState(false);
  const [popB, setPopB]                 = useState(false);
  const [filledSlices, setFilledSlices] = useState([]);
  const [fillMsg, setFillMsg]           = useState('');

  const denA    = a.d * multA;
  const denB    = b.d * multB;
  const isMatch = denA === denB;

  const makeColors = (n, d, c) => Array.from({ length: d }, (_, i) => i < n ? c : null);
  const slicesA = makeColors(a.n * multA, denA, colorA);
  const slicesB = makeColors(b.n * multB, denB, colorB);

  const countA  = filledSlices.filter(c => c === colorA).length;
  const countB  = filledSlices.filter(c => c === colorB).length;
  const fillDone = countA === aN && countB === bN;

  const clickA = () => {
    if (multA >= MAX_MULT) return;
    setMultA(m => m + 1);
    setPopA(true);
    setTimeout(() => setPopA(false), 120);
  };
  const clickB = () => {
    if (multB >= MAX_MULT) return;
    setMultB(m => m + 1);
    setPopB(true);
    setTimeout(() => setPopB(false), 120);
  };

  const handleFill = (idx) => {
    setFilledSlices(prev => {
      const next = [...prev];
      if (next[idx]) { next[idx] = null; setFillMsg(''); return next; }
      const cA = next.filter(c => c === colorA).length;
      const cB = next.filter(c => c === colorB).length;
      if (cA < aN) {
        next[idx] = colorA;
        if (cA + 1 === aN) setFillMsg(`✅ ${a.n}/${a.d} = ${aN}/${lcd}`);
      } else if (cB < bN) {
        next[idx] = colorB;
        if (cB + 1 === bN) setFillMsg(`✅ ${b.n}/${b.d} = ${bN}/${lcd}`);
      }
      return next;
    });
  };

  const advance = () => {
    if (stage === 0) {
      setFilledSlices(Array(lcd).fill(null)); setFillMsg(''); setStage(1);
    } else if (stage === 1) {
      setStage(2);
    } else {
      onComplete?.();
    }
  };

  const canAdvance =
    (stage === 0 && isMatch && multA > 1 && multB > 1) ||
    (stage === 1 && fillDone) ||
    stage === 2;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <StageBar current={ stage } />

      {/* ══ STAGE 0: 통분 ══ */}
      { stage === 0 && (
        <>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3">초콜릿으로 통분해봐요! 🍫</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              각 바를 클릭해서 칸을 늘려봐요
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
            {/* Bar A */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Frac num={ a.n } den={ a.d } color={ colorA } size="1.2rem" strike={ multA > 1 } />
                { multA > 1 && (
                  <>
                    <Typography color="text.secondary" sx={{ fontWeight: 700 }}>→</Typography>
                    <Frac num={ a.n * multA } den={ denA } color={ colorA } size="1.4rem" />
                  </>
                ) }
              </Box>
              <Box
                onClick={ clickA }
                sx={{ cursor: multA < MAX_MULT ? 'pointer' : 'default', transform: popA ? 'scale(0.96)' : 'scale(1)', transition: 'transform 0.12s' }}
              >
                <ChocolateBarSVG denominator={ denA } sliceColors={ slicesA } width={ BAR_W } />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: colorA }}>
                { a.d }칸 → { denA }칸{ multA < MAX_MULT ? ' (클릭해서 더 나누기)' : '' }
              </Typography>
            </Box>

            {/* 비교 표시 */}
            <Box sx={{
              px: 2.5, py: 0.75, borderRadius: 2,
              backgroundColor: isMatch && multA > 1 && multB > 1 ? '#00C85318' : 'rgba(26,26,26,0.04)',
              border: `1px solid ${ isMatch && multA > 1 && multB > 1 ? '#00C853' : 'rgba(26,26,26,0.1)' }`,
              transition: 'all 0.3s',
            }}>
              <Typography sx={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1rem',
                color: isMatch && multA > 1 && multB > 1 ? '#00A040' : multA > 1 && multB > 1 ? '#CC5555' : 'text.disabled' }}>
                { denA } { isMatch && multA > 1 && multB > 1 ? '= ✓' : multA > 1 || multB > 1 ? '≠' : '?' } { denB }
              </Typography>
            </Box>

            {/* Bar B */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Frac num={ b.n } den={ b.d } color={ colorB } size="1.2rem" strike={ multB > 1 } />
                { multB > 1 && (
                  <>
                    <Typography color="text.secondary" sx={{ fontWeight: 700 }}>→</Typography>
                    <Frac num={ b.n * multB } den={ denB } color={ colorB } size="1.4rem" />
                  </>
                ) }
              </Box>
              <Box
                onClick={ clickB }
                sx={{ cursor: multB < MAX_MULT ? 'pointer' : 'default', transform: popB ? 'scale(0.96)' : 'scale(1)', transition: 'transform 0.12s' }}
              >
                <ChocolateBarSVG denominator={ denB } sliceColors={ slicesB } width={ BAR_W } />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: colorB }}>
                { b.d }칸 → { denB }칸{ multB < MAX_MULT ? ' (클릭해서 더 나누기)' : '' }
              </Typography>
            </Box>
          </Box>

          { isMatch && multA > 1 && multB > 1 ? (
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#00C85318', border: '1px solid #00C853', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700, color: '#00A040' }}>
                🎉 둘 다 { lcd }칸! 통분 성공! &nbsp;
                { a.n }/{ a.d } = { aN }/{ lcd },&nbsp;
                { b.n }/{ b.d } = { bN }/{ lcd }
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(26,26,26,0.04)', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                두 바의 칸 수가 같아질 때까지 클릭하세요!
              </Typography>
            </Box>
          ) }
        </>
      ) }

      {/* ══ STAGE 1: 합산 ══ */}
      { stage === 1 && (
        <>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3">이제 합쳐봐요! 🍫</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              빈 칸을 클릭해서 채워요 — 주황 { aN }칸, 보라 { bN }칸
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
            {/* 참고 미니 바 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              { [
                { colors: makeColors(aN, lcd, colorA), frac: `${aN}/${lcd}`, color: colorA },
                { colors: makeColors(bN, lcd, colorB), frac: `${bN}/${lcd}`, color: colorB },
              ].map(({ colors, frac, color }, i) => (
                <Box key={ i } sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ChocolateBarSVG denominator={ lcd } sliceColors={ colors } width={ 140 } height={ 40 } />
                  <Typography variant="caption" sx={{ fontWeight: 900, color }}>{ frac }</Typography>
                </Box>
              )) }
            </Box>

            {/* 메인 바 */}
            <ChocolateBarSVG denominator={ lcd } sliceColors={ filledSlices } width={ BAR_W } onSliceClick={ handleFill } />

            {/* 진행 카운터 */}
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 0.3 }}>
                { Array.from({ length: aN }).map((_, i) => (
                  <Box key={ i } sx={{ width: 10, height: 10, borderRadius: 1,
                    backgroundColor: i < countA ? colorA : 'rgba(26,26,26,0.1)',
                    border: `1px solid ${ i < countA ? NK : 'rgba(26,26,26,0.2)' }`,
                    transition: 'all 0.2s' }} />
                )) }
              </Box>
              <Typography variant="caption" color="text.disabled">+</Typography>
              <Box sx={{ display: 'flex', gap: 0.3 }}>
                { Array.from({ length: bN }).map((_, i) => (
                  <Box key={ i } sx={{ width: 10, height: 10, borderRadius: 1,
                    backgroundColor: i < countB ? colorB : 'rgba(26,26,26,0.1)',
                    border: `1px solid ${ i < countB ? NK : 'rgba(26,26,26,0.2)' }`,
                    transition: 'all 0.2s' }} />
                )) }
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>= { countA + countB }/{ lcd }</Typography>
            </Box>
          </Box>

          { fillMsg && (
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#00C85318', border: '1px solid #00C853', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700, color: '#00A040' }}>{ fillMsg }</Typography>
            </Box>
          ) }
          { fillDone && (
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#00C85318', border: '1px solid #00C853', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700, color: '#00A040' }}>
                🎉 완성! { sumN }/{ lcd }{ g > 1 ? ` = ${sumN / g}/${lcd / g}` : '' }
              </Typography>
            </Box>
          ) }
        </>
      ) }

      {/* ══ STAGE 2: 완성 ══ */}
      { stage === 2 && (
        <>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3">정답! 🍫✨</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
            <ChocolateBarSVG
              denominator={ lcd }
              sliceColors={ Array.from({ length: lcd }, (_, i) => i < aN ? colorA : i < sumN ? colorB : null) }
              width={ BAR_W }
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Frac num={ aN } den={ lcd } color={ colorA } size="1.25rem" />
              <Typography variant="h6" color="text.secondary">+</Typography>
              <Frac num={ bN } den={ lcd } color={ colorB } size="1.25rem" />
              <Typography variant="h6" color="text.secondary">=</Typography>
              <Frac num={ sumN } den={ lcd } size="1.5rem" />
              { g > 1 && (
                <>
                  <Typography variant="h6" color="text.secondary">=</Typography>
                  <Frac num={ sumN / g } den={ lcd / g } color={ colorA } size="1.5rem" />
                </>
              ) }
            </Box>
            <Box sx={{
              p: 2.5, borderRadius: 2, width: '100%', textAlign: 'center',
              border: `1.5px solid ${ NK }`, boxShadow: `3px 3px 0 ${ NK }`,
              backgroundColor: 'background.paper',
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                { a.n }/{ a.d } + { b.n }/{ b.d }
              </Typography>
              <Typography sx={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', color: 'primary.main' }}>
                = { sumN }/{ lcd }{ g > 1 ? ` = ${sumN / g}/${lcd / g}` : '' }
              </Typography>
            </Box>
          </Box>
        </>
      ) }

      {/* CTA */}
      <Button
        variant="contained" color="primary" size="large"
        onClick={ advance } disabled={ !canAdvance }
        sx={{ alignSelf: 'stretch', opacity: canAdvance ? 1 : 0.5 }}
      >
        { stage === 0
          ? (isMatch && multA > 1 && multB > 1 ? '합산하기 →' : '바를 클릭해서 나눠요 🍫')
          : stage === 1
          ? (fillDone ? '결과 보기 →' : `채우는 중 (${ countA + countB }/${ sumN })`)
          : '게임 완료! 🎉' }
      </Button>
    </Box>
  );
}

export default ChocolateBarGame;
