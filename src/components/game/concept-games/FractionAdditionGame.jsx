import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// ─── 수학 유틸 ───────────────────────────────────
function gcd(a, b) { return b ? gcd(b, a % b) : a; }
function lcm(a, b) { return (a * b) / gcd(a, b); }

// ─── SVG 피자 ────────────────────────────────────
const NK = '#0E0F0F';

function polarToCart(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function wedge(cx, cy, r, s, e) {
  const a = polarToCart(cx, cy, r, s);
  const b = polarToCart(cx, cy, r, e);
  return `M ${cx} ${cy} L ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)} Z`;
}

/**
 * PizzaSVG
 * @param {number} denominator
 * @param {Array} sliceColors - 슬라이스별 색상
 * @param {number} size
 * @param {function} onClick - 피자 전체 클릭 (통분 단계)
 * @param {function} onSliceClick - 개별 슬라이스 클릭 (i) => void (합산 단계)
 * @param {boolean} clickable - 전체 클릭 커서
 * @param {boolean} pop - 클릭 애니메이션
 */
function PizzaSVG({ denominator, sliceColors = [], size = 200, onClick, onSliceClick, clickable = false, pop = false }) {
  const cx = size / 2, cy = size / 2;
  const cr = size / 2 - 4, fr = cr - 6;
  const step = 360 / denominator;
  const hasSliceClick = !!onSliceClick;

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      onClick={hasSliceClick ? undefined : onClick}
      style={{
        display: 'block',
        cursor: clickable && !hasSliceClick ? 'pointer' : 'default',
        overflow: 'visible',
        transform: pop ? 'scale(0.92)' : 'scale(1)',
        transition: 'transform 0.12s ease',
        userSelect: 'none',
      }}
    >
      {/* 크러스트 */}
      <circle cx={cx} cy={cy} r={cr} fill="#FFF3CD" stroke={NK} strokeWidth="2.5" />

      {/* 슬라이스 — onSliceClick 있으면 개별 클릭 처리 */}
      {Array.from({ length: denominator }).map((_, i) => {
        const color = sliceColors[i];
        return (
          <path key={i}
            d={wedge(cx, cy, fr, i * step, (i + 1) * step)}
            fill={color || '#FFFBF0'}
            stroke={NK}
            strokeWidth={denominator > 9 ? '1' : '1.5'}
            strokeLinejoin="round"
            style={{
              transition: 'fill 0.2s ease',
              cursor: hasSliceClick ? 'pointer' : 'inherit',
            }}
            onClick={hasSliceClick ? (e) => { e.stopPropagation(); onSliceClick(i); } : undefined}
            onMouseEnter={hasSliceClick && !color
              ? e => e.currentTarget.setAttribute('fill', '#FFE0B2')
              : undefined}
            onMouseLeave={hasSliceClick && !color
              ? e => e.currentTarget.setAttribute('fill', '#FFFBF0')
              : undefined}
          />
        );
      })}

      {/* 토핑 */}
      {Array.from({ length: denominator }).map((_, i) => {
        if (!sliceColors[i]) return null;
        const tp = polarToCart(cx, cy, fr * 0.58, (i + 0.5) * step);
        return <circle key={`t${i}`} cx={tp.x.toFixed(2)} cy={tp.y.toFixed(2)}
          r={denominator > 9 ? 2.5 : 3.5} fill={NK} opacity={0.22}
          style={{ pointerEvents: 'none' }} />;
      })}

      <circle cx={cx} cy={cy} r={4} fill={NK} style={{ pointerEvents: 'none' }} />

      {/* 클릭 힌트 */}
      {clickable && !hasSliceClick && (
        <text x={cx} y={cy - fr + 16} textAnchor="middle" fontSize="16"
          style={{ pointerEvents: 'none', userSelect: 'none' }}>✂️</text>
      )}
    </svg>
  );
}

// ─── 분수 표기 ───────────────────────────────────
function Frac({ num, den, color = NK, size = '1.75rem', strike = false }) {
  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, userSelect: 'none', position: 'relative' }}>
      <Typography sx={{ fontFamily: '"Outfit"', fontWeight: 900, fontSize: size, color, lineHeight: 1 }}>{num}</Typography>
      <Box sx={{ width: 22, height: 2.5, backgroundColor: NK, my: '4px' }} />
      <Typography sx={{ fontFamily: '"Outfit"', fontWeight: 900, fontSize: size, color: NK, lineHeight: 1 }}>{den}</Typography>
      {strike && <Box sx={{ position: 'absolute', top: '50%', left: -4, right: -4, height: 2, backgroundColor: 'error.main', opacity: 0.6, transform: 'rotate(-8deg)' }} />}
    </Box>
  );
}

// ─── 분수 변화 표시 (탐색 단계용) ───────────────
function FracChange({ prev, curr, den, color, done }) {
  return (
    <Box sx={{ minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
      {prev !== null && (
        <>
          <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', opacity: 0.35 }}>
            <Typography style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1, color: NK }}>
              {prev}
            </Typography>
            <Box style={{ width: 18, height: 2, background: NK, margin: '3px 0' }} />
            <Typography style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1, color: NK }}>
              {den}
            </Typography>
          </Box>
          <Typography style={{ fontWeight: 900, fontSize: '1.1rem', color: '#888' }}>→</Typography>
        </>
      )}
      <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1, color }}>
          {curr}
        </Typography>
        <Box style={{ width: 22, height: 2.5, background: NK, margin: '4px 0' }} />
        <Typography style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1, color: NK }}>
          {den}
        </Typography>
      </Box>
      {done && <Typography style={{ fontSize: '1.1rem', marginLeft: 4 }}>✓</Typography>}
    </Box>
  );
}

// ─── 진행 표시 ──────────────────────────────────
const STAGES = ['탐색', '통분', '합산', '완성'];
function StageBar({ current }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mb: 1 }}>
      {STAGES.map((label, i) => (
        <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{
            px: 1.25, py: 0.3, borderRadius: 999,
            backgroundColor: i <= current ? 'primary.main' : 'rgba(26,26,26,0.08)',
            border: `1.5px solid ${i <= current ? NK : 'rgba(26,26,26,0.15)'}`,
            transition: 'all 0.3s',
          }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, color: i <= current ? '#FAFAF5' : 'text.disabled' }}>
              {i + 1}. {label}
            </Typography>
          </Box>
          {i < STAGES.length - 1 && (
            <Box sx={{ width: 12, height: 2, backgroundColor: i < current ? 'primary.main' : 'rgba(26,26,26,0.1)', borderRadius: 1, transition: 'all 0.3s' }} />
          )}
        </Box>
      ))}
    </Box>
  );
}

// ─── 레벨 ────────────────────────────────────────
const DEFAULT_LEVELS = [
  { a: { n: 1, d: 3 }, b: { n: 1, d: 4 } },
  { a: { n: 1, d: 2 }, b: { n: 1, d: 3 } },
  { a: { n: 2, d: 3 }, b: { n: 1, d: 4 } },
];
const MAX_MULT = 6;

// ═══════════════════════════════════════════════
// 메인 게임
// ═══════════════════════════════════════════════

/**
 * FractionAdditionGame
 *
 * Props:
 * @param {function} onComplete - 모든 레벨 완료 시 호출 [Optional]
 * @param {number} initialStage - 시작 단계 (0:탐색, 1:통분, 2:합산, 3:완성) [Optional, 기본값: 0]
 * @param {Array} levels - 플레이할 레벨 배열 [Optional, 기본값: DEFAULT_LEVELS]
 *
 * Example usage:
 * <FractionAdditionGame initialStage={1} levels={[{ a: { n:1, d:3 }, b: { n:1, d:4 } }]} onComplete={next} />
 */
export function FractionAdditionGame({ onComplete, initialStage = 0, levels = DEFAULT_LEVELS }) {
  const theme = useTheme();
  const { zmath } = theme.palette;
  const colorA = zmath.accent.orange;
  const colorB = zmath.categoryColors.geometry;   // #B6FCBE 민트그린

  const [levelIdx, setLevelIdx]   = useState(0);
  const [stage, setStage]         = useState(initialStage);

  // 탐색 단계
  const [exploreA, setExploreA]         = useState(0);
  const [exploreB, setExploreB]         = useState(0);
  const [prevExploreA, setPrevExploreA] = useState(null);
  const [prevExploreB, setPrevExploreB] = useState(null);

  // 통분 단계: 클릭 배수
  const [multA, setMultA]         = useState(1);
  const [multB, setMultB]         = useState(1);
  const [popA, setPopA]           = useState(false);
  const [popB, setPopB]           = useState(false);

  // 합산 단계
  const [filledSlices, setFilledSlices] = useState([]);
  const [fillMsg, setFillMsg]     = useState('');

  const level = levels[levelIdx];
  const { a, b } = level;
  const lcd   = lcm(a.d, b.d);
  const aN    = a.n * (lcd / a.d);
  const bN    = b.n * (lcd / b.d);
  const sumN  = aN + bN;
  const g     = gcd(sumN, lcd);

  const denA  = a.d * multA;
  const denB  = b.d * multB;
  const isMatch = denA === denB;

  const makeColors = (n, d, c) => Array.from({ length: d }, (_, i) => i < n ? c : null);

  // 통분 단계 피자 색상
  const tongbunA = makeColors(a.n * multA, denA, colorA);
  const tongbunB = makeColors(b.n * multB, denB, colorB);

  // 합산 합친 피자
  const combinedColors = Array.from({ length: lcd }, (_, i) =>
    i < aN ? colorA : i < sumN ? colorB : null
  );

  // ── 피자 클릭 (통분) ─────────────────────────
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
  const resetTongbun = () => { setMultA(1); setMultB(1); };

  // ── 합산 클릭 ────────────────────────────────
  const countA = filledSlices.filter(c => c === colorA).length;
  const countB = filledSlices.filter(c => c === colorB).length;
  const fillDone = countA === aN && countB === bN;

  const handleFill = (idx) => {
    setFilledSlices(prev => {
      const next = [...prev];
      if (next[idx]) { next[idx] = null; setFillMsg(''); return next; }
      if (countA < aN) {
        next[idx] = colorA;
        if (countA + 1 === aN) setFillMsg(`✅ ${a.n}/${a.d} = ${aN}/${lcd}`);
      } else if (countB < bN) {
        next[idx] = colorB;
        if (countB + 1 === bN) setFillMsg(`✅ ${b.n}/${b.d} = ${bN}/${lcd}`);
      }
      return next;
    });
  };

  // ── 단계 전환 ────────────────────────────────
  const advance = () => {
    if (stage === 0) {
      resetTongbun(); setStage(1);
    } else if (stage === 1) {
      setFilledSlices(Array(lcd).fill(null)); setFillMsg(''); setStage(2);
    } else if (stage === 2) {
      setStage(3);
    } else {
      if (levelIdx < levels.length - 1) {
        setLevelIdx(l => l + 1); setStage(0);
        setExploreA(0); setExploreB(0);
        setPrevExploreA(null); setPrevExploreB(null);
        setFilledSlices([]); setFillMsg('');
      } else onComplete?.();
    }
  };

  const canAdvance =
    stage === 0 ||
    (stage === 1 && isMatch && multA > 1 && multB > 1) ||
    (stage === 2 && fillDone) ||
    stage === 3;

  // ─────────────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <StageBar current={stage} />

      {/* ══ STAGE 0: 탐색 ══ */}
      {stage === 0 && (
        <>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3">{a.n}/{a.d} + {b.n}/{b.d} = ?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              조각을 클릭해서 분수를 느껴봐요
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>

            {/* 피자 인터랙션 */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 3, sm: 6 } }}>

                {/* 피자 A */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>피자 A</Typography>
                  <PizzaSVG
                    denominator={a.d}
                    sliceColors={makeColors(exploreA + 1, a.d, colorA)}
                    size={150}
                    clickable
                    onClick={() => {
                      setPrevExploreA(exploreA);
                      setExploreA(s => (s + 1) % a.d);
                    }}
                  />
                  <FracChange
                    prev={prevExploreA !== null ? prevExploreA + 1 : null}
                    curr={exploreA + 1}
                    den={a.d}
                    color={colorA}
                    done={exploreA + 1 === a.n}
                  />
                  <Typography variant="caption" color="text.disabled">클릭하면 조각이 바뀌어요</Typography>
                </Box>

                {/* 피자 B */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>피자 B</Typography>
                  <PizzaSVG
                    denominator={b.d}
                    sliceColors={makeColors(exploreB + 1, b.d, colorB)}
                    size={150}
                    clickable
                    onClick={() => {
                      setPrevExploreB(exploreB);
                      setExploreB(s => (s + 1) % b.d);
                    }}
                  />
                  <FracChange
                    prev={prevExploreB !== null ? prevExploreB + 1 : null}
                    curr={exploreB + 1}
                    den={b.d}
                    color={colorB}
                    done={exploreB + 1 === b.n}
                  />
                  <Typography variant="caption" color="text.disabled">클릭하면 조각이 바뀌어요</Typography>
                </Box>

              </Box>

              <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: `${colorA}10`, border: `1px solid ${colorA}30` }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: colorA, textAlign: 'center' }}>
                  💡 분모({a.d}와 {b.d})가 달라서 바로 더할 수 없어요!
                </Typography>
              </Box>
            </Box>

            {/* 우측 설명 박스 */}
            <Box sx={{
              width: { xs: '100%', md: 200 },
              flexShrink: 0,
              borderRadius: 2,
              border: `1.5px solid ${NK}`,
              boxShadow: `3px 3px 0 ${NK}`,
              backgroundColor: 'background.paper',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.75,
            }}>
              <Typography sx={{ fontWeight: 900, fontSize: '0.85rem', letterSpacing: '-0.01em' }}>
                분수란 뭐예요?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                피자를 똑같이 나눈 조각 중 몇 개를 가졌는지 나타내는 숫자예요.
              </Typography>

              <Box sx={{ height: '1px', backgroundColor: `${NK}15` }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { frac: `${a.n}/${a.d}`, desc: `피자를 ${a.d}조각으로 나눈 것 중 ${a.n}개`, color: colorA },
                  { frac: `${b.n}/${b.d}`, desc: `피자를 ${b.d}조각으로 나눈 것 중 ${b.n}개`, color: colorB },
                ].map(({ frac, desc, color }) => (
                  <Box key={frac} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Box sx={{
                      minWidth: 32, height: 20, borderRadius: '4px',
                      backgroundColor: color, border: `1.5px solid ${NK}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Typography sx={{ fontSize: '0.62rem', fontWeight: 900, lineHeight: 1 }}>{frac}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>{desc}</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ height: '1px', backgroundColor: `${NK}15` }} />

              <Typography sx={{ fontWeight: 700, fontSize: '0.78rem' }}>다음에 할 일</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {[
                  { step: '01', text: '피자를 눌러 조각을 바꿔봐요' },
                  { step: '02', text: '두 피자 크기를 같게 맞춰요' },
                  { step: '03', text: '같은 크기 조각끼리 합쳐요' },
                ].map(({ step, text }) => (
                  <Box key={step} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography sx={{
                      fontFamily: '"Outfit"', fontWeight: 900, fontSize: '0.62rem',
                      color: 'primary.main', minWidth: 20,
                    }}>{step}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>{text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

          </Box>
        </>
      )}

      {/* ══ STAGE 1: 통분 — 피자 클릭해서 자르기 ══ */}
      {stage === 1 && (
        <>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3">피자를 클릭해서 잘게 잘라봐요!</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              ✂️ 두 피자 조각 크기가 같아지면 더할 수 있어요
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: { xs: 2, sm: 5 } }}>

            {/* Pizza A */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <PizzaSVG denominator={denA} sliceColors={tongbunA} size={160}
                clickable={multA < MAX_MULT} pop={popA} onClick={clickA} />

              {/* 분수 변환 표시 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Frac num={a.n} den={a.d} color={colorA} size="1.1rem" strike={multA > 1} />
                {multA > 1 && (
                  <>
                    <Typography color="text.secondary" sx={{ fontWeight: 700 }}>→</Typography>
                    <Frac num={a.n * multA} den={denA} color={colorA} size="1.3rem" />
                  </>
                )}
              </Box>

              {/* 조각 수 표시 */}
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 180 }}>
                {Array.from({ length: multA }).map((_, i) => (
                  <Box key={i} sx={{
                    width: 20, height: 20, borderRadius: '4px',
                    backgroundColor: i === multA - 1 ? colorA : `${colorA}40`,
                    border: `1.5px solid ${NK}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    <Typography sx={{ fontSize: '0.55rem', fontWeight: 900, color: '#FAFAF5', lineHeight: 1 }}>
                      ×{i + 1}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: colorA }}>
                {a.d}조각 → {denA}조각
              </Typography>
              {multA >= MAX_MULT && (
                <Button size="small" variant="text" onClick={() => setMultA(1)}
                  sx={{ fontSize: '0.7rem', py: 0.25, color: 'text.secondary' }}>
                  처음으로 ↺
                </Button>
              )}
            </Box>

            {/* 가운데 상태 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, minWidth: 52 }}>
              <Typography variant="h4" sx={{ color: 'text.disabled', fontWeight: 900 }}>vs</Typography>
              <Box sx={{
                px: 1, py: 0.5, borderRadius: '8px', textAlign: 'center',
                backgroundColor: isMatch ? '#00C85318' : multA > 1 && multB > 1 ? '#D199FA18' : 'transparent',
                border: isMatch ? '1px solid #00C853' : multA > 1 && multB > 1 ? '1px solid #D199FA' : 'none',
                transition: 'all 0.3s',
              }}>
                <Typography sx={{ fontFamily: '"Outfit"', fontWeight: 900, fontSize: '1.1rem', color: isMatch ? '#00A040' : '#CC5555' }}>
                  {denA}
                </Typography>
                <Typography sx={{ fontSize: '1rem' }}>
                  {isMatch ? '=' : multA > 1 && multB > 1 ? '≠' : '?'}
                </Typography>
                <Typography sx={{ fontFamily: '"Outfit"', fontWeight: 900, fontSize: '1.1rem', color: isMatch ? '#00A040' : '#CC5555' }}>
                  {denB}
                </Typography>
              </Box>
            </Box>

            {/* Pizza B */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <PizzaSVG denominator={denB} sliceColors={tongbunB} size={160}
                clickable={multB < MAX_MULT} pop={popB} onClick={clickB} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Frac num={b.n} den={b.d} size="1.1rem" strike={multB > 1} />
                {multB > 1 && (
                  <>
                    <Typography color="text.secondary" sx={{ fontWeight: 700 }}>→</Typography>
                    <Frac num={b.n * multB} den={denB} size="1.3rem" />
                  </>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 180 }}>
                {Array.from({ length: multB }).map((_, i) => (
                  <Box key={i} sx={{
                    width: 20, height: 20, borderRadius: '4px',
                    backgroundColor: i === multB - 1 ? colorB : `${colorB}40`,
                    border: `1.5px solid ${NK}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    <Typography sx={{ fontSize: '0.55rem', fontWeight: 900, color: '#FAFAF5', lineHeight: 1 }}>
                      ×{i + 1}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: colorB }}>
                {b.d}조각 → {denB}조각
              </Typography>
              {multB >= MAX_MULT && (
                <Button size="small" variant="text" onClick={() => setMultB(1)}
                  sx={{ fontSize: '0.7rem', py: 0.25, color: 'text.secondary' }}>
                  처음으로 ↺
                </Button>
              )}
            </Box>
          </Box>

          {/* 피드백 */}
          {isMatch && multA > 1 && multB > 1 ? (
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#00C85318', border: '1px solid #00C853', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700, color: '#00A040' }}>
                🎉 둘 다 {denA}조각! 통분 성공!&nbsp;
                {a.n}/{a.d} = {a.n * multA}/{denA},&nbsp;
                {b.n}/{b.d} = {b.n * multB}/{denB}
              </Typography>
            </Box>
          ) : multA > 1 && multB > 1 ? (
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#D199FA18', border: '1px solid #D199FA', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 600, color: '#CC5555', fontSize: '0.9rem' }}>
                A는 {denA}조각, B는 {denB}조각 — 아직 달라요! 계속 잘라봐요 ✂️
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(26,26,26,0.04)', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                각 피자를 클릭하면 조각이 더 잘게 나뉘어요!
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* ══ STAGE 2: 합산 ══ */}
      {stage === 2 && (
        <>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3">이제 합쳐봐요!</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              빈 조각을 클릭해서 채워보세요 — 주황 {aN}칸, 초록 {bN}칸
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {/* 참고: 각 분수 피자 */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              {[
                { colors: makeColors(aN, lcd, colorA), frac: `${aN}/${lcd}`, color: colorA },
                { colors: makeColors(bN, lcd, colorB), frac: `${bN}/${lcd}`, color: colorB },
              ].map(({ colors, frac, color }, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <PizzaSVG denominator={lcd} sliceColors={colors} size={64} />
                  <Typography variant="caption" sx={{ fontWeight: 900, color }}>{frac}</Typography>
                </Box>
              ))}
            </Box>

            {/* 메인 피자 — onSliceClick으로 개별 슬라이스 처리 */}
            <PizzaSVG
              denominator={lcd}
              sliceColors={filledSlices}
              size={220}
              onSliceClick={handleFill}
            />

            {/* 진행 카운터 */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 0.3 }}>
                {Array.from({ length: aN }).map((_, i) => (
                  <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%',
                    backgroundColor: i < countA ? colorA : 'rgba(26,26,26,0.1)',
                    border: `1.5px solid ${i < countA ? NK : 'rgba(26,26,26,0.2)'}`,
                    transition: 'all 0.2s' }} />
                ))}
              </Box>
              <Typography variant="caption" color="text.disabled">+</Typography>
              <Box sx={{ display: 'flex', gap: 0.3 }}>
                {Array.from({ length: bN }).map((_, i) => (
                  <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%',
                    backgroundColor: i < countB ? colorB : 'rgba(26,26,26,0.1)',
                    border: `1.5px solid ${i < countB ? NK : 'rgba(26,26,26,0.2)'}`,
                    transition: 'all 0.2s' }} />
                ))}
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>= {countA + countB}/{lcd}</Typography>
            </Box>
          </Box>

          {fillMsg && (
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#00C85318', border: '1px solid #00C853', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700, color: '#00A040' }}>{fillMsg}</Typography>
            </Box>
          )}
          {fillDone && (
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#00C85318', border: '1px solid #00C853', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700, color: '#00A040' }}>
                🎉 완성! {sumN}/{lcd}{g > 1 ? ` = ${sumN / g}/${lcd / g}` : ''}
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* ══ STAGE 3: 완성 ══ */}
      {stage === 3 && (
        <>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3">정답이에요! 🍕</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <PizzaSVG denominator={lcd} sliceColors={combinedColors} size={220} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: colorA, border: `1.5px solid ${NK}` }} />
                <Frac num={aN} den={lcd} color={colorA} size="1.25rem" />
              </Box>
              <Typography variant="h6" color="text.secondary">+</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: colorB, border: `1.5px solid ${NK}` }} />
                <Frac num={bN} den={lcd} size="1.25rem" />
              </Box>
              <Typography variant="h6" color="text.secondary">=</Typography>
              <Frac num={sumN} den={lcd} size="1.5rem" />
              {g > 1 && <>
                <Typography variant="h6" color="text.secondary">=</Typography>
                <Frac num={sumN / g} den={lcd / g} color={colorA} size="1.5rem" />
              </>}
            </Box>
            <Box sx={{
              p: 2.5, borderRadius: 2, width: '100%', textAlign: 'center',
              border: `1.5px solid ${NK}`, boxShadow: `3px 3px 0 ${NK}`,
              background: `linear-gradient(135deg, ${colorA}15, ${colorB}15)`,
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {a.n}/{a.d} + {b.n}/{b.d}
              </Typography>
              <Typography sx={{ fontFamily: '"Outfit"', fontWeight: 900, fontSize: '2rem', color: 'primary.main' }}>
                = {sumN}/{lcd}{g > 1 ? ` = ${sumN / g}/${lcd / g}` : ''}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                레벨 {levelIdx + 1} / {LEVELS.length} 완료
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {/* CTA */}
      <Button variant="contained" color="primary" size="large"
        onClick={advance} disabled={!canAdvance}
        sx={{ alignSelf: 'stretch', opacity: canAdvance ? 1 : 0.5 }}>
        {stage === 0
          ? '통분 시작 →'
          : stage === 1
          ? (isMatch && multA > 1 && multB > 1 ? '합산하기 →' : '피자를 잘라봐요 ✂️')
          : stage === 2
          ? (fillDone ? '결과 보기 →' : `채우는 중 (${countA + countB}/${sumN})`)
          : levelIdx < LEVELS.length - 1 ? '다음 문제 →' : '게임 완료! 🎉'}
      </Button>
    </Box>
  );
}

export default FractionAdditionGame;
