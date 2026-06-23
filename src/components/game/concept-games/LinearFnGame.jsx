import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const NK = '#004638';
const W = 260, H = 260, PAD = 30, SCALE = 20;
const CX = W / 2, CY = H / 2;

function toSvgX(x) { return CX + x * SCALE; }
function toSvgY(y) { return CY - y * SCALE; }

function CoordGrid({ slope, intercept, targetSlope, targetIntercept, showTarget, color }) {
  const ticks = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];

  // 현재 함수 직선 두 점
  const x1 = -PAD / SCALE - (W - PAD * 2) / 2 / SCALE;
  const x2 = (W - PAD * 2) / 2 / SCALE;
  const lineX1 = PAD, lineY1 = toSvgY(slope * (PAD - CX) / SCALE + intercept);
  const lineX2 = W - PAD, lineY2 = toSvgY(slope * (W - PAD - CX) / SCALE + intercept);

  // 목표 직선
  const tLineY1 = toSvgY(targetSlope * (PAD - CX) / SCALE + targetIntercept);
  const tLineY2 = toSvgY(targetSlope * (W - PAD - CX) / SCALE + targetIntercept);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'hidden' }}>
      {/* 격자 */}
      {ticks.map(t => (
        <g key={t}>
          <line x1={toSvgX(t)} y1={PAD} x2={toSvgX(t)} y2={H - PAD}
            stroke="rgba(26,26,26,0.08)" strokeWidth="1" />
          <line x1={PAD} y1={toSvgY(t)} x2={W - PAD} y2={toSvgY(t)}
            stroke="rgba(26,26,26,0.08)" strokeWidth="1" />
          <text x={toSvgX(t)} y={CY + 14} textAnchor="middle"
            fontSize="9" fill="rgba(26,26,26,0.4)">{t}</text>
          <text x={CX + 6} y={toSvgY(t) + 4} fontSize="9"
            fill="rgba(26,26,26,0.4)">{t}</text>
        </g>
      ))}

      {/* 축 */}
      <line x1={PAD} y1={CY} x2={W - PAD} y2={CY} stroke={NK} strokeWidth="1.5" />
      <line x1={CX} y1={PAD} x2={CX} y2={H - PAD} stroke={NK} strokeWidth="1.5" />
      <text x={W - PAD + 4} y={CY + 4} fontSize="11" fontWeight="700" fill={NK}>x</text>
      <text x={CX + 4} y={PAD - 4} fontSize="11" fontWeight="700" fill={NK}>y</text>

      {/* 목표 직선 (점선) */}
      {showTarget && (
        <line x1={PAD} y1={tLineY1} x2={W - PAD} y2={tLineY2}
          stroke="rgba(26,26,26,0.25)" strokeWidth="2"
          strokeDasharray="6,4" />
      )}

      {/* 현재 직선 */}
      <line x1={PAD} y1={lineY1} x2={W - PAD} y2={lineY2}
        stroke={color} strokeWidth="2.5" strokeLinecap="round" />

      {/* y절편 점 */}
      <circle cx={CX} cy={toSvgY(intercept)} r={5}
        fill={color} stroke={NK} strokeWidth="1.5" />

      {/* x=1 점 */}
      {Math.abs(toSvgY(slope + intercept)) >= PAD && Math.abs(toSvgY(slope + intercept)) <= H - PAD && (
        <circle cx={toSvgX(1)} cy={toSvgY(slope + intercept)} r={4}
          fill="white" stroke={color} strokeWidth="2" />
      )}
    </svg>
  );
}

const TASKS = [
  { slope: 2, intercept: 1, hint: '기울기가 양수이면 오른쪽 위로 올라가요' },
  { slope: -1, intercept: 3, hint: '기울기가 음수이면 오른쪽 아래로 내려가요' },
  { slope: 3, intercept: -2, hint: '가파를수록 기울기가 커요' },
];

export function LinearFnGame({ onComplete }) {
  const theme = useTheme();
  const color = theme.palette.zmath.categoryColors.function;

  const [taskIdx, setTaskIdx] = useState(0);
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);
  const [showTarget, setShowTarget] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const task = TASKS[taskIdx];
  const isCorrect = slope === task.slope && intercept === task.intercept;

  const handleConfirm = () => {
    setConfirmed(true);
    if (!isCorrect) setShowTarget(true);
  };

  const next = () => {
    if (taskIdx < TASKS.length - 1) {
      setTaskIdx(i => i + 1);
      setSlope(1); setIntercept(0);
      setShowTarget(false); setConfirmed(false);
    } else {
      onComplete?.();
    }
  };

  const slopeLabel = slope >= 0 ? `${slope}` : `${slope}`;
  const bLabel = intercept >= 0 ? `+ ${intercept}` : `- ${Math.abs(intercept)}`;
  const eq = `y = ${slopeLabel}x ${intercept !== 0 ? bLabel : ''}`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 0.5 }}>y = {task.slope}x {task.intercept !== 0 ? (task.intercept > 0 ? `+ ${task.intercept}` : `- ${Math.abs(task.intercept)}`) : ''} 를 만들어봐요</Typography>
        <Typography variant="body2" color="text.secondary">슬라이더를 움직여 직선을 맞춰보세요</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CoordGrid slope={slope} intercept={intercept}
          targetSlope={task.slope} targetIntercept={task.intercept}
          showTarget={showTarget} color={color} />
      </Box>

      {/* 현재 함수식 */}
      <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
        <Typography sx={{ fontFamily: '"Outfit"', fontWeight: 900, fontSize: '1.5rem', color }}>
          {eq}
        </Typography>
      </Box>

      {/* 슬라이더 */}
      <Box sx={{ px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 60 }}>기울기 a</Typography>
          <Slider value={slope} min={-5} max={5} step={1}
            onChange={(_, v) => { setSlope(v); setConfirmed(false); setShowTarget(false); }}
            marks disabled={confirmed}
            sx={{ color, '& .MuiSlider-markLabel': { fontSize: '0.65rem' } }} />
          <Typography sx={{ fontFamily: '"Outfit"', fontWeight: 900, minWidth: 24, textAlign: 'right', color }}>{slope}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 60 }}>y절편 b</Typography>
          <Slider value={intercept} min={-5} max={5} step={1}
            onChange={(_, v) => { setIntercept(v); setConfirmed(false); setShowTarget(false); }}
            marks disabled={confirmed}
            sx={{ color }} />
          <Typography sx={{ fontFamily: '"Outfit"', fontWeight: 900, minWidth: 24, textAlign: 'right', color }}>{intercept}</Typography>
        </Box>
      </Box>

      {!confirmed ? (
        <Button variant="contained" color="primary" size="large" onClick={handleConfirm}>
          확인하기 →
        </Button>
      ) : isCorrect ? (
        <>
          <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#00C85318', border: '1px solid #00C853', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700, color: '#00A040' }}>🎉 정답! 기울기 {task.slope}, y절편 {task.intercept}</Typography>
          </Box>
          <Button variant="contained" color="primary" size="large" onClick={next}>
            {taskIdx < TASKS.length - 1 ? '다음 문제 →' : '완료! 🎉'}
          </Button>
        </>
      ) : (
        <>
          <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#D199FA18', border: '1px solid #D199FA', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: '#CC5555' }}>
              아쉬워요! 점선이 목표 직선이에요. {task.hint}
            </Typography>
          </Box>
          <Button variant="outlined" color="primary" size="large"
            onClick={() => { setSlope(1); setIntercept(0); setConfirmed(false); setShowTarget(false); }}>
            다시 시도 ↺
          </Button>
        </>
      )}
    </Box>
  );
}

export default LinearFnGame;
