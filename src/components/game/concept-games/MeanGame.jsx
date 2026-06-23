import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const NK = '#004638';
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function SeesawSVG({ mean, color, size = 280 }) {
  const W = size, H = 140;
  const PAD = 24;
  const cx = W / 2;
  // 균형점 = 평균값의 위치
  const scaleX = (W - PAD * 2) / 9; // 1~10: 9칸
  const pivot = PAD + (mean - 1) * scaleX;

  // 시소 판자 기울기: 평균 5가 중심. 왼쪽 합 > 오른쪽 합 시 왼쪽이 낮음
  // 여기서는 시각적으로 mean 위치에 받침점 표시만
  const tiltAngle = 0; // 항상 수평 (균형 시소)

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* 숫자 눈금 */}
      {NUMBERS.map(n => {
        const x = PAD + (n - 1) * scaleX;
        return (
          <g key={n}>
            <line x1={x} y1={70} x2={x} y2={78} stroke={NK} strokeWidth="1.5" />
            <text x={x} y={92} textAnchor="middle" fontSize="12" fontWeight="600" fill="rgba(26,26,26,0.5)">{n}</text>
          </g>
        );
      })}

      {/* 시소 판자 */}
      <rect x={PAD - 4} y={64} width={W - PAD * 2 + 8} height={6} rx="3"
        fill="#FFF3CD" stroke={NK} strokeWidth="1.5" />

      {/* 받침대 (평균 위치) */}
      <polygon
        points={`${pivot},70 ${pivot - 12},100 ${pivot + 12},100`}
        fill={color} stroke={NK} strokeWidth="1.5"
        style={{ transition: 'all 0.4s ease' }}
      />
      <line x1={pivot - 18} y1={100} x2={pivot + 18} y2={100}
        stroke={NK} strokeWidth="2" strokeLinecap="round" />

      {/* 평균 표시 */}
      <text x={pivot} y={116} textAnchor="middle" fontSize="12" fontWeight="900" fill={color}
        style={{ transition: 'all 0.4s ease' }}>
        평균 = {isNaN(mean) ? '-' : mean.toFixed(1)}
      </text>
    </svg>
  );
}

const TASKS = [
  { target: 5, label: '평균이 5가 되도록 숫자를 선택해봐요', minCount: 2 },
  { target: 4, label: '평균이 4가 되도록 선택해봐요', minCount: 3 },
  { target: 6, label: '평균이 6이 되도록 선택해봐요', minCount: 4 },
];

export function MeanGame({ onComplete }) {
  const theme = useTheme();
  const color = theme.palette.zmath.categoryColors.statistics;

  const [taskIdx, setTaskIdx] = useState(0);
  const [selected, setSelected] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const task = TASKS[taskIdx];
  const sum = selected.reduce((a, b) => a + b, 0);
  const mean = selected.length > 0 ? sum / selected.length : NaN;
  const isCorrect = selected.length >= task.minCount && Math.abs(mean - task.target) < 0.01;

  const toggle = (n) => {
    if (confirmed) return;
    setSelected(prev =>
      prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]
    );
  };

  const next = () => {
    if (taskIdx < TASKS.length - 1) {
      setTaskIdx(i => i + 1);
      setSelected([]); setConfirmed(false);
    } else {
      onComplete?.();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 0.5 }}>
          평균이 <Box component="span" sx={{ color, fontWeight: 900 }}>{task.target}</Box>이 되도록 숫자를 골라봐요
        </Typography>
        <Typography variant="body2" color="text.secondary">{task.label}</Typography>
      </Box>

      {/* 숫자 선택 버튼 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        {NUMBERS.map(n => {
          const isOn = selected.includes(n);
          return (
            <Box
              key={n}
              component="button"
              onClick={() => toggle(n)}
              sx={{
                width: 44, height: 44,
                borderRadius: '10px',
                border: `1.5px solid ${isOn ? NK : 'rgba(26,26,26,0.2)'}`,
                backgroundColor: isOn ? color : 'background.paper',
                cursor: confirmed ? 'default' : 'pointer',
                boxShadow: isOn ? `2px 2px 0 ${NK}` : 'none',
                transition: 'all 0.15s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                '&:hover': !confirmed ? {
                  transform: 'translate(-1px, -1px)',
                  boxShadow: `2px 2px 0 ${NK}`,
                } : {},
                '&:active': !confirmed ? { transform: 'translate(1px, 1px)', boxShadow: 'none' } : {},
              }}
            >
              <Typography sx={{
                fontFamily: '"Outfit"', fontWeight: 900, fontSize: '1rem',
                color: isOn ? '#FAFAF5' : NK,
              }}>
                {n}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* 시소 시각화 */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <SeesawSVG mean={isNaN(mean) ? 5.5 : mean} color={color} size={280} />
      </Box>

      {/* 계산 표시 */}
      <Box sx={{
        p: 1.5, borderRadius: 2,
        backgroundColor: `${color}12`, border: `1px solid ${color}30`,
        textAlign: 'center',
      }}>
        {selected.length === 0 ? (
          <Typography variant="body2" color="text.secondary">숫자를 선택하면 평균이 계산돼요</Typography>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary">
              ({selected.sort((a, b) => a - b).join(' + ')}) ÷ {selected.length}
            </Typography>
            <Typography sx={{ fontFamily: '"Outfit"', fontWeight: 900, fontSize: '1.5rem', color }}>
              = {sum} ÷ {selected.length} = {mean.toFixed(1)}
            </Typography>
          </>
        )}
      </Box>

      {/* CTA */}
      {!confirmed ? (
        <Button
          variant="contained" color="primary" size="large"
          disabled={selected.length < task.minCount}
          onClick={() => setConfirmed(true)}
        >
          {selected.length < task.minCount
            ? `${task.minCount}개 이상 선택해봐요 (현재 ${selected.length}개)`
            : `평균 ${mean.toFixed(1)} — 확인하기 →`}
        </Button>
      ) : isCorrect ? (
        <>
          <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#00C85318', border: '1px solid #00C853', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700, color: '#00A040' }}>
              🎉 정답! 선택한 숫자들의 평균이 {task.target}이에요!
            </Typography>
          </Box>
          <Button variant="contained" color="primary" size="large" onClick={next}>
            {taskIdx < TASKS.length - 1 ? '다음 문제 →' : '완료! 🎉'}
          </Button>
        </>
      ) : (
        <>
          <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#D199FA18', border: '1px solid #D199FA', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: '#CC5555' }}>
              평균이 {mean.toFixed(1)}이에요. 목표는 {task.target}! 다른 숫자를 골라봐요
            </Typography>
          </Box>
          <Button variant="outlined" color="primary" size="large"
            onClick={() => { setSelected([]); setConfirmed(false); }}>
            다시 선택 ↺
          </Button>
        </>
      )}
    </Box>
  );
}

export default MeanGame;
