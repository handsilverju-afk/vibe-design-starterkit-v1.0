import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloseIcon from '@mui/icons-material/Close';

/**
 * GameFeedback
 *
 * 게임 완료 전체 화면 피드백.
 * 전체 문제 완료 후 오버레이로 표시.
 * CLEAR(전체 정답) 또는 점수 기반 성공/실패 판정.
 *
 * Props:
 * @param {number} score - 맞힌 문제 수 [Required]
 * @param {number} total - 전체 문제 수 [Required]
 * @param {function} onRetry - 다시 도전 핸들러 [Optional]
 * @param {function} onHome - 홈으로 핸들러 [Optional]
 */
function GameFeedback({ score, total, onRetry, onHome }) {
  const passed = score >= Math.ceil(total * 0.6); // 60% 이상 성공
  const perfect = score === total;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(26,26,26,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        px: 3,
      }}
    >
      <Box
        sx={{
          backgroundColor: passed ? '#FF5533' : '#00C9A7',
          border: '1.5px solid #1A1A1A',
          borderRadius: '20px',
          boxShadow: '4px 4px 0 #1A1A1A',
          px: 4,
          py: 5,
          textAlign: 'center',
          maxWidth: 360,
          width: '100%',
        }}
      >
        {/* 아이콘 */}
        {passed ? (
          <Typography sx={{ fontSize: '4rem', lineHeight: 1, mb: 1.5, filter: 'brightness(1.5)' }}>🏆</Typography>
        ) : (
          <CloseIcon sx={{ fontSize: 64, color: '#FAFAF5', mb: 1.5 }} />
        )}

        {/* 타이틀 */}
        <Typography
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 900,
            fontSize: '2rem',
            color: '#FAFAF5',
            letterSpacing: '0.04em',
            mb: 1,
          }}
        >
          {perfect ? 'PERFECT!' : passed ? 'CLEAR!' : 'FAILED'}
        </Typography>

        {/* 점수 */}
        <Typography
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 900,
            fontSize: '3rem',
            color: '#FAFAF5',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            mb: 0.5,
          }}
        >
          {score}
          <Box component="span" sx={{ fontSize: '1.5rem', opacity: 0.7 }}>
            {' '}/ {total}
          </Box>
        </Typography>

        <Typography variant="body2" sx={{ color: '#FAFAF5', opacity: 0.8, mb: 4 }}>
          {perfect ? '모든 문제를 맞혔어요!' : passed ? `${score}문제 정답` : '다시 한번 도전해보세요'}
        </Typography>

        {/* 버튼 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={onRetry}
            sx={{
              backgroundColor: '#1A1A1A',
              color: '#FAFAF5',
              fontWeight: 700,
              '&:hover': { backgroundColor: '#333' },
            }}
          >
            다시 도전
          </Button>
          <Button
            variant="text"
            fullWidth
            onClick={onHome}
            sx={{ color: '#FAFAF5', opacity: 0.8, fontWeight: 600 }}
          >
            홈으로
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export { GameFeedback };
export default GameFeedback;
