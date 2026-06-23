import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

/**
 * AnswerChoices
 *
 * 객관식 4지 선택 컴포넌트. 게임 버튼 스타일 — 2×2 그리드.
 * 선택 전: 흰색 카드 with nearBlack 보더 + offset shadow
 * 선택 후(정답): 초록 bg
 * 선택 후(오답): 연한 레드 bg, 정답은 초록
 *
 * Props:
 * @param {string[]} choices - 선택지 배열 (4개) [Required]
 * @param {string|null} selectedAnswer - 사용자가 선택한 답 [Required]
 * @param {string} correctAnswer - 정답 [Required]
 * @param {boolean} isAnswered - 답 선택 후 여부 [Optional, 기본값: false]
 * @param {function} onSelect - 선택지 클릭 핸들러 [Optional]
 * @param {string} category - 카테고리 (선택 활성 컬러 결정) [Optional]
 */
function AnswerChoices({ choices, selectedAnswer, correctAnswer, isAnswered = false, onSelect, category = 'arithmetic' }) {
  const theme = useTheme();
  const { zmath } = theme.palette;

  const CATEGORY_COLOR = {
    arithmetic: zmath.categoryColors.arithmetic,
    function:   zmath.categoryColors.function,
    geometry:   zmath.categoryColors.geometry,
    statistics: zmath.categoryColors.statistics,
  };
  const accentColor = CATEGORY_COLOR[category] ?? CATEGORY_COLOR.arithmetic;

  const getStyle = (choice) => {
    if (!isAnswered) {
      const isSelected = selectedAnswer === choice;
      return {
        bg: isSelected ? accentColor : 'background.paper',
        color: isSelected ? zmath.offWhite : 'text.primary',
        border: `1.5px solid ${zmath.nearBlack}`,
        shadow: `3px 3px 0 ${zmath.nearBlack}`,
        opacity: 1,
      };
    }
    const isCorrect = choice === correctAnswer;
    const isWrongSelected = selectedAnswer === choice && choice !== correctAnswer;
    if (isCorrect) return { bg: '#00C853', color: '#FFFFFF', border: `1.5px solid ${zmath.nearBlack}`, shadow: `3px 3px 0 ${zmath.nearBlack}`, opacity: 1 };
    if (isWrongSelected) return { bg: '#FF8FA3', color: zmath.nearBlack, border: `1.5px solid ${zmath.nearBlack}`, shadow: 'none', opacity: 1 };
    return { bg: 'background.paper', color: 'text.disabled', border: `1.5px solid rgba(26,26,26,0.2)`, shadow: 'none', opacity: 0.5 };
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 1.5,
      }}
    >
      {choices.map((choice) => {
        const s = getStyle(choice);
        return (
          <ButtonBase
            key={choice}
            onClick={() => !isAnswered && onSelect?.(choice)}
            disabled={isAnswered}
            sx={{
              width: '100%',
              minHeight: 56,
              px: 2,
              py: 1.5,
              backgroundColor: s.bg,
              border: s.border,
              borderRadius: '12px',
              boxShadow: s.shadow,
              opacity: s.opacity,
              transition: 'transform 0.1s ease, box-shadow 0.1s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isAnswered ? 'default' : 'pointer',
              '&:hover:not(:disabled)': {
                transform: 'translate(-1px, -1px)',
                boxShadow: `4px 4px 0 ${zmath.nearBlack}`,
              },
              '&:active:not(:disabled)': {
                transform: 'translate(2px, 2px)',
                boxShadow: 'none',
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                color: s.color,
                fontFamily: '"Outfit", sans-serif',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {choice}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

export { AnswerChoices };
export default AnswerChoices;
