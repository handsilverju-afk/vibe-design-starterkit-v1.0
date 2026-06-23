import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { useTheme } from '@mui/material/styles';

/**
 * GameHeader
 *
 * 문제 풀이 페이지 상단. 뒤로 / 개념명 / 난이도 불꽃 / N/M 진행.
 * 하단에 LinearProgress로 전체 진행률 표시.
 *
 * Props:
 * @param {string} conceptTitle - 개념 이름 [Required]
 * @param {string} difficulty - 난이도 ('easy'|'medium'|'hard') [Optional, 기본값: 'medium']
 * @param {number} current - 현재 문제 번호 (1-based) [Required]
 * @param {number} total - 총 문제 수 [Required]
 * @param {function} onBack - 뒤로 핸들러 [Optional]
 */
const FLAME_FILLED = { easy: 1, medium: 2, hard: 4 };
const FLAME_COLORS = ['#FFB300', '#FF6D00', '#DD2C00', '#B71C1C'];
const EMPTY_COLOR = 'rgba(26,26,26,0.12)';

function GameHeader({ conceptTitle, difficulty = 'medium', current, total, onBack }) {
  const theme = useTheme();
  const filledCount = FLAME_FILLED[difficulty] ?? 2;
  const progress = ((current - 1) / total) * 100;

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: `1.5px solid ${theme.palette.zmath.nearBlack}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 1, gap: 1 }}>
        {/* 뒤로 */}
        <IconButton
          size="small"
          onClick={onBack}
          sx={{ flexShrink: 0, color: 'text.primary' }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
        </IconButton>

        {/* 개념명 */}
        <Typography
          variant="h6"
          sx={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}
        >
          {conceptTitle}
        </Typography>

        {/* 난이도 불꽃 + 진행 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <WhatshotIcon
                key={i}
                sx={{ fontSize: 15, color: i < filledCount ? FLAME_COLORS[i] : EMPTY_COLOR }}
              />
            ))}
          </Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}
          >
            {current} / {total}
          </Typography>
        </Box>
      </Box>

      {/* 진행률 바 */}
      <LinearProgress
        variant="determinate"
        value={progress}
        color="primary"
        sx={{ height: 3, borderRadius: 0 }}
      />
    </Box>
  );
}

export { GameHeader };
export default GameHeader;
