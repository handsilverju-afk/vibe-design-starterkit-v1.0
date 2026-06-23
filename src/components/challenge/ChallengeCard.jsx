import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { ProfileAvatar } from '../game/ProfileAvatar';

/**
 * ChallengeCard 컴포넌트
 *
 * "내게 맞는 챌린지" 섹션. 게임 던전 스타일 UI.
 * 난이도: 불꽃 아이콘(🔥) 1–3개 + nearBlack 보더 + offset shadow
 * 도전 결과: CLEAR!(골드) / FAILED(다크) 뱃지
 *
 * Props:
 * @param {string} title - 챌린지 제목 [Required]
 * @param {string} level - 난이도 ('easy'|'medium'|'hard') [Optional, 기본값: 'medium']
 * @param {number} participants - 참여자 수 [Optional, 기본값: 0]
 * @param {number} correctRate - 정답률 0–100 [Optional]
 * @param {boolean} isAttempted - 내가 도전했는지 [Optional, 기본값: false]
 * @param {boolean} isCorrect - 내가 맞혔는지 [Optional, 기본값: false]
 * @param {string} cardVariant - 카드 배경 테마 ('default'|'solved'|'failed'). 미지정 시 isAttempted+isCorrect에서 자동 파생 [Optional]
 * @param {string} hostName - 방장 이름 [Optional, 기본값: '방장']
 * @param {string} hostVariant - 방장 PeepsAvatar variant [Optional, 기본값: 'focused']
 * @param {string} problem - 문제/질문 [Optional]
 * @param {function} onClick - 카드 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 */

// 불꽃 4개, 난이도에 따라 앞쪽부터 컬러 채움. 텍스트 없음. 버튼 스타일 없음.
const TOTAL_FLAMES = 4;
const FLAME_FILLED_COUNT = { easy: 1, medium: 2, hard: 4 };
// 채워진 불꽃: 레몬 → 퍼플 → 오렌지 → 딥그린 (강도 순)
const FLAME_COLORS = ['#DDED59', '#D199FA', '#FC5B31', '#004638'];
const FLAME_EMPTY_COLOR = 'rgba(0,70,56,0.12)';

function DungeonDifficultyBadge({ level }) {
  const filledCount = FLAME_FILLED_COUNT[level] ?? 2;

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, userSelect: 'none' }}>
      {Array.from({ length: TOTAL_FLAMES }).map((_, i) => (
        <WhatshotIcon
          key={i}
          sx={{
            fontSize: 20,
            color: i < filledCount ? FLAME_COLORS[i] : FLAME_EMPTY_COLOR,
          }}
        />
      ))}
    </Box>
  );
}

// 버튼 아님 — bg만 있고 border/shadow 없음.
function GameResultBadge({ isCorrect }) {
  if (isCorrect) {
    return (
      // 성공: 형광민트(#B6FCBE) bg + 딥그린 텍스트 — 오렌지는 버튼 전용이므로 사용 안 함
      <Box sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.75,
        px: 1.25, py: 0.5, borderRadius: '8px',
        backgroundColor: '#B6FCBE',
        userSelect: 'none',
      }}>
        <Typography sx={{ fontSize: '1.4rem', lineHeight: 1, filter: 'brightness(1.1)' }}>🏆</Typography>
        <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#004638', letterSpacing: '0.04em' }}>
          성공
        </Typography>
      </Box>
    );
  }

  return (
    // 실패: 딥그린(#004638) bg + 형광레몬 텍스트
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.75,
      px: 1.25, py: 0.5, borderRadius: '8px',
      backgroundColor: '#004638',
      userSelect: 'none',
    }}>
      <CloseIcon sx={{ fontSize: 26, color: '#DDED59' }} />
      <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#DDED59', letterSpacing: '0.04em' }}>
        실패
      </Typography>
    </Box>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────
const ChallengeCard = forwardRef(function ChallengeCard({
  title = '챌린지 제목',
  level = 'medium',
  participants = 0,
  correctRate,
  isAttempted = false,
  isCorrect = false,
  cardVariant,
  hostName = '방장',
  hostVariant = 'focused',
  problem,
  onClick,
  sx,
  ...props
}, ref) {
  const theme = useTheme();
  const { zmath } = theme.palette;

  // cardVariant 미지정 시 isAttempted + isCorrect에서 자동 파생
  const resolvedVariant = cardVariant
    ?? (isAttempted ? (isCorrect ? 'solved' : 'failed') : 'default');

  const bgColor = zmath.challengeSurface[resolvedVariant]
    ?? zmath.challengeSurface.default;

  const correctRateData = (() => {
    if (correctRate === undefined || correctRate === null || !participants) return null;
    const solved = Math.round(participants * correctRate / 100);
    return { total: participants.toLocaleString(), solved: solved.toLocaleString() };
  })();

  return (
    <Card
      ref={ref}
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: bgColor,
        cursor: onClick ? 'pointer' : 'default',
        ...(!onClick && { '&:hover': { transform: 'none', boxShadow: 'none' } }),
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>

        {/* ── 난이도(좌) + 결과(우) 한 행 ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DungeonDifficultyBadge level={level} />
          {isAttempted && <GameResultBadge isCorrect={isCorrect} />}
        </Box>

        {/* ── 문제 ── */}
        {problem && (
          <Typography variant="h3" sx={{ lineHeight: 1.4, wordBreak: 'keep-all' }}>
            {problem}
          </Typography>
        )}

        {/* ── 방장 — 아바타 + 이름 ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <ProfileAvatar variant={hostVariant} size={22} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            {hostName}
          </Typography>
        </Box>

        <Divider />

        {/* ── 정답률 — 숫자 강조색 ── */}
        {correctRateData && (
          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
            <Box component="span" sx={{ fontWeight: 900, color: 'primary.main', fontSize: '1rem' }}>
              {correctRateData.total}명
            </Box>
            <Box component="span" color="text.secondary"> 중 </Box>
            <Box component="span" sx={{ fontWeight: 900, color: 'primary.main', fontSize: '1rem' }}>
              {correctRateData.solved}명
            </Box>
            <Box component="span" color="text.secondary">만 맞혔어요</Box>
          </Typography>
        )}


      </Box>
    </Card>
  );
});

export { ChallengeCard };
export default ChallengeCard;
