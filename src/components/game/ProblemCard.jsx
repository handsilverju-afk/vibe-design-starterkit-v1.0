import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

/**
 * ProblemCard
 *
 * 문제 텍스트 카드. 카테고리 컬러 좌측 보더로 개념 소속 표시.
 *
 * Props:
 * @param {string} problem - 문제 텍스트 [Required]
 * @param {string} category - 카테고리 (좌측 보더 컬러 결정) [Optional, 기본값: 'arithmetic']
 * @param {number} questionNumber - 문제 번호 [Optional]
 */
function ProblemCard({ problem, category = 'arithmetic', questionNumber }) {
  const theme = useTheme();
  const { zmath } = theme.palette;

  const CATEGORY_COLOR = {
    arithmetic: zmath.categoryColors.arithmetic,
    function:   zmath.categoryColors.function,
    geometry:   zmath.categoryColors.geometry,
    statistics: zmath.categoryColors.statistics,
  };
  const accentColor = CATEGORY_COLOR[category] ?? CATEGORY_COLOR.arithmetic;

  return (
    <Card
      sx={{
        borderLeft: `5px solid ${accentColor}`,
        borderRadius: '0 12px 12px 0',
        px: 2.5,
        py: 2,
        boxShadow: 'none',
        border: `1.5px solid ${theme.palette.zmath.nearBlack}`,
        borderLeft: `5px solid ${accentColor}`,
        '&:hover': { transform: 'none', boxShadow: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {questionNumber && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 900,
              color: accentColor,
              fontFamily: '"Outfit", sans-serif',
              fontSize: '0.75rem',
              letterSpacing: '0.04em',
            }}
          >
            Q{questionNumber}
          </Typography>
        )}
        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>
          문제
        </Typography>
      </Box>
      <Typography
        variant="h3"
        sx={{ lineHeight: 1.5, wordBreak: 'keep-all', fontWeight: 700 }}
      >
        {problem}
      </Typography>
    </Card>
  );
}

export { ProblemCard };
export default ProblemCard;
