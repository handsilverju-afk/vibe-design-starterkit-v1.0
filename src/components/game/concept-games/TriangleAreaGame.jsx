import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const NK = '#004638';

function TriangleSVG({ base, height, color, size = 240 }) {
  const pad = 32;
  const maxB = 10, maxH = 10;
  const scaleX = (size - pad * 2) / maxB;
  const scaleY = (size - pad * 2) / maxH;

  const bx = base * scaleX;
  const hy = height * scaleY;
  const ox = pad, oy = size - pad;

  // 삼각형: 밑변은 하단, 꼭짓점은 위
  const p1 = [ox, oy];
  const p2 = [ox + bx, oy];
  const p3 = [ox + bx * 0.4, oy - hy]; // 꼭짓점 (살짝 오프셋)

  // 높이선 좌표: p3에서 밑변에 수직
  const hFoot = [p3[0], oy];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      {/* 그리드 */}
      {Array.from({ length: 11 }, (_, i) => i).map(i => (
        <g key={i}>
          <line x1={pad + i * scaleX} y1={pad} x2={pad + i * scaleX} y2={size - pad}
            stroke="rgba(26,26,26,0.07)" strokeWidth="1" />
          <line x1={pad} y1={size - pad - i * scaleY} x2={size - pad} y2={size - pad - i * scaleY}
            stroke="rgba(26,26,26,0.07)" strokeWidth="1" />
        </g>
      ))}

      {/* 삼각형 면 */}
      <polygon points={`${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`}
        fill={`${color}25`} />
      {/* 삼각형 윤곽 */}
      <polygon points={`${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`}
        fill="none" stroke={NK} strokeWidth="2.5" strokeLinejoin="round" />

      {/* 높이선 (점선) */}
      <line x1={p3[0]} y1={p3[1]} x2={hFoot[0]} y2={hFoot[1]}
        stroke={color} strokeWidth="2" strokeDasharray="5,3" />
      {/* 직각 마크 */}
      <rect x={hFoot[0]} y={hFoot[1] - 10} width={10} height={10}
        fill="none" stroke={color} strokeWidth="1.5" />

      {/* 레이블: 밑변 */}
      <text x={(p1[0] + p2[0]) / 2} y={oy + 18}
        textAnchor="middle" fontSize="13" fontWeight="900" fill={NK}>
        밑변 = {base}
      </text>

      {/* 레이블: 높이 */}
      <text x={hFoot[0] - 10} y={(p3[1] + hFoot[1]) / 2}
        textAnchor="end" fontSize="13" fontWeight="900" fill={color}>
        높이 = {height}
      </text>

      {/* 꼭짓점 점 */}
      <circle cx={p3[0]} cy={p3[1]} r={5} fill={color} stroke={NK} strokeWidth="1.5" />
    </svg>
  );
}

const TASKS = [
  { targetArea: 6,  hint: '밑변 × 높이 = 12 가 되는 조합을 찾아봐요' },
  { targetArea: 10, hint: '밑변 × 높이 = 20 이어야 해요' },
  { targetArea: 15, hint: '밑변 × 높이 = 30 이 필요해요' },
];

export function TriangleAreaGame({ onComplete }) {
  const theme = useTheme();
  const color = theme.palette.zmath.categoryColors.geometry;

  const [taskIdx, setTaskIdx] = useState(0);
  const [base, setBase] = useState(4);
  const [height, setHeight] = useState(3);
  const [confirmed, setConfirmed] = useState(false);

  const task = TASKS[taskIdx];
  const area = (base * height) / 2;
  const isCorrect = area === task.targetArea;

  const next = () => {
    if (taskIdx < TASKS.length - 1) {
      setTaskIdx(i => i + 1);
      setBase(4); setHeight(3); setConfirmed(false);
    } else {
      onComplete?.();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 0.5 }}>
          넓이가 <Box component="span" sx={{ color, fontWeight: 900 }}>{task.targetArea}</Box>인 삼각형을 만들어봐요
        </Typography>
        <Typography variant="body2" color="text.secondary">
          슬라이더로 밑변과 높이를 조절해봐요
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <TriangleSVG base={base} height={height} color={color} size={240} />
      </Box>

      {/* 공식 */}
      <Box sx={{
        textAlign: 'center', p: 2, borderRadius: 2,
        backgroundColor: `${color}15`, border: `1px solid ${color}30`,
      }}>
        <Typography sx={{ fontFamily: '"Outfit"', fontWeight: 900, fontSize: '1.3rem', color }}>
          ½ × {base} × {height} = {area}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          넓이 공식: ½ × 밑변 × 높이
        </Typography>
      </Box>

      {/* 슬라이더 */}
      <Box sx={{ px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 44 }}>밑변</Typography>
          <Slider value={base} min={1} max={10} step={1}
            onChange={(_, v) => { setBase(v); setConfirmed(false); }}
            marks disabled={confirmed}
            sx={{ color }} />
          <Typography sx={{ fontFamily: '"Outfit"', fontWeight: 900, minWidth: 20, color }}>{base}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 44 }}>높이</Typography>
          <Slider value={height} min={1} max={10} step={1}
            onChange={(_, v) => { setHeight(v); setConfirmed(false); }}
            marks disabled={confirmed}
            sx={{ color }} />
          <Typography sx={{ fontFamily: '"Outfit"', fontWeight: 900, minWidth: 20, color }}>{height}</Typography>
        </Box>
      </Box>

      {!confirmed ? (
        <Button variant="contained" color="primary" size="large"
          onClick={() => setConfirmed(true)}>
          넓이 {area} — 확인하기 →
        </Button>
      ) : isCorrect ? (
        <>
          <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#00C85318', border: '1px solid #00C853', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700, color: '#00A040' }}>
              🎉 정답! ½ × {base} × {height} = {area}
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
              아쉬워요! 현재 넓이는 {area}이에요. {task.hint}
            </Typography>
          </Box>
          <Button variant="outlined" color="primary" size="large"
            onClick={() => setConfirmed(false)}>
            다시 시도 ↺
          </Button>
        </>
      )}
    </Box>
  );
}

export default TriangleAreaGame;
