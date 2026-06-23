import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTheme } from '@mui/material/styles';
import { MathConceptIllustration } from './MathConceptIllustration';
import { ProfileAvatar } from './ProfileAvatar';
import { IconBtn } from '../input/IconBtn';

/**
 * ConceptGameCard
 *
 * 수학 개념 게임 카드.
 * - 카드 배경: 흰색
 * - 썸네일: 카테고리 컬러 bg + nearBlack 보더 + 개념별 실생활 일러스트 (center)
 * - 플레이 상태에 따라 하단 섹션이 명확하게 다름:
 *     isPlayed=false: 참여자 아바타 스택 + "N명 플레이" (사회적 증거)
 *     isPlayed=true:  내 아바타 + @나 + 플레이 시각 (개인화된 기록)
 * - 메타: views(작게) + likes(크게, IconBtn)
 *
 * Props:
 * @param {string} conceptKey - 개념 키 [Required]
 * @param {string} category - 카테고리 ('arithmetic'|'function'|'geometry'|'statistics') [Optional, 기본값: 'arithmetic']
 * @param {string} conceptTitle - 개념 이름 [Required]
 * @param {string} difficulty - 난이도 ('easy'|'medium'|'hard') [Optional, 기본값: 'easy']
 * @param {string} description - 게임 한줄 설명 [Optional]
 * @param {number} views - 누적 조회수 [Optional, 기본값: 0]
 * @param {number} likes - 좋아요 수 [Optional, 기본값: 0]
 * @param {boolean} isLiked - 좋아요 토글 상태 [Optional, 기본값: false]
 * @param {function} onLike - 좋아요 클릭 핸들러 [Optional]
 * @param {string} lastPlayedAt - ISO 날짜. 마지막 플레이 시각 [Optional]
 * @param {boolean} isPlayed - 참여 여부 [Optional, 기본값: false]
 * @param {string} userAvatarVariant - 유저 PeepsAvatar variant [Optional, 기본값: 'curious']
 * @param {string} userId - 표시할 유저 아이디 [Optional]
 * @param {boolean} isFeatured - 대형 피처드 카드 모드 [Optional, 기본값: false]
 * @param {function} onClick - 카드 클릭 핸들러 [Optional]
 * @param {object} sx - MUI sx prop 오버라이드 [Optional]
 *
 * Example usage:
 * // 미플레이
 * <ConceptGameCard conceptKey="triangle-area" category="geometry" conceptTitle="삼각형의 넓이" views={970} likes={61} />
 * // 플레이 후
 * <ConceptGameCard conceptKey="triangle-area" isPlayed userId="수학천재" userAvatarVariant="confident" lastPlayedAt={iso} />
 */

// ─── 유틸 ────────────────────────────────────────
function formatCount(n) {
  if (!n) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function formatLastPlayed(iso) {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}분 전`;
  if (hours < 24) {
    const t = new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `오늘 ${t}`;
  }
  if (days === 1) return '어제';
  return `${days}일 전`;
}

// ─── 미플레이: 참여자 아바타 스택 ─────────────────
// 사회적 증거 — "다른 사람들이 이미 플레이했어요"
const PARTICIPANT_VARIANTS = ['confident', 'focused', 'celebrating'];

function ParticipantStack({ views }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* 겹친 ProfileAvatar 3개 */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {PARTICIPANT_VARIANTS.map((variant, i) => (
          <ProfileAvatar
            key={variant}
            variant={variant}
            size={24}
            sx={{
              ml: i === 0 ? 0 : '-8px',
              border: '2px solid',
              borderColor: 'background.paper',
              zIndex: 3 - i,
            }}
          />
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
        {formatCount(views)}명 플레이
      </Typography>
    </Box>
  );
}

// ─── 플레이 후: 내 아바타 + 이름 + 시각 ────────────
// 개인화된 기록 — 강조 표시로 미플레이와 명확히 구분
function PlayedBadge({ userAvatarVariant, userId, lastPlayedAt, primaryColor }) {
  const relTime = formatLastPlayed(lastPlayedAt);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: `${primaryColor}12`,
        border: `1px solid ${primaryColor}33`,
        borderRadius: '8px',
        px: 1,
        py: 0.5,
      }}
    >
      {/* 내 아바타 — ProfileAvatar + primary 링 */}
      <ProfileAvatar
        variant={userAvatarVariant}
        size={28}
        ringColor={primaryColor}
        ringWidth={2}
      />

      {/* 이름 + 시각 */}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, color: 'text.primary', display: 'block', lineHeight: 1.3 }}
        >
          @{userId || '나'}
        </Typography>
        {relTime && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <AccessTimeOutlinedIcon sx={{ fontSize: 10, color: 'text.disabled' }} />
            <Typography variant="caption" sx={{ fontSize: '0.62rem', color: 'text.disabled' }}>
              {relTime}
            </Typography>
          </Box>
        )}
      </Box>

      {/* 완료 체크 */}
      <CheckCircleOutlineIcon sx={{ fontSize: 14, color: primaryColor, ml: 'auto', flexShrink: 0 }} />
    </Box>
  );
}

// ─── 하단 메타 행: views(작게) + heart ──────
function MetaRow({ views, likes, isLiked, onLike }) {
  const theme = useTheme();
  const brand = theme.palette.primary.main;  // #FF5533

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1 }}>
      {/* 조회수 — 작게 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.35 }}>
        <VisibilityOutlinedIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.62rem', fontWeight: 600 }}>
          {formatCount(views)}
        </Typography>
      </Box>

      {/* 좋아요 — 선택 시 브랜드 컬러 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: '0.72rem', fontWeight: 700, color: isLiked ? brand : 'text.secondary' }}
        >
          {formatCount(likes)}
        </Typography>
        <IconBtn
          size="sm"
          onClick={(e) => { e.stopPropagation(); onLike?.(); }}
        >
          {isLiked
            ? <FavoriteIcon sx={{ color: brand }} />
            : <FavoriteBorderIcon />}
        </IconBtn>
      </Box>
    </Box>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────
function ConceptGameCard({
  conceptKey,
  category = 'arithmetic',
  categoryLabel,
  conceptTitle = '개념명',
  difficulty = 'easy',
  description,
  views = 0,
  likes = 0,
  isLiked = false,
  onLike,
  lastPlayedAt,
  isPlayed = false,
  userAvatarVariant = 'curious',
  userId,
  isFeatured = false,
  onClick,
  sx = {},
}) {
  const theme = useTheme();
  const { zmath } = theme.palette;

  const CATEGORY_CONFIG = {
    arithmetic:   { label: '수와 연산', color: zmath.categoryColors.arithmetic,   illustrationColor: zmath.accent.yellow,           decoColor: zmath.offWhite  },
    function:     { label: '함수',      color: zmath.categoryColors.function,     illustrationColor: zmath.categoryColors.geometry, decoColor: zmath.offWhite  },
    geometry:     { label: '도형',      color: zmath.categoryColors.geometry,     illustrationColor: zmath.categoryColors.function, decoColor: zmath.nearBlack },
    statistics:   { label: '확률·통계', color: zmath.categoryColors.statistics,   illustrationColor: zmath.categoryColors.function, decoColor: zmath.nearBlack },
    columbiaBlue: { label: '확률·통계', color: zmath.categoryColors.columbiaBlue, illustrationColor: zmath.categoryColors.function,   decoColor: zmath.nearBlack },
    yellow:       { label: '확률·통계', color: zmath.accent.yellow,               illustrationColor: zmath.categoryColors.function, decoColor: zmath.nearBlack },
  };

  const DIFFICULTY_CONFIG = {
    easy:   { label: 'Easy',   bg: `${zmath.accent.yellow}CC`, color: zmath.nearBlack },
    medium: { label: 'Medium', bg: `${zmath.accent.orange}CC`, color: zmath.offWhite },
    hard:   { label: 'Hard',   bg: `${zmath.nearBlack}CC`,    color: zmath.offWhite },
  };

  const cat = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.arithmetic;
  const diff = DIFFICULTY_CONFIG[difficulty] ?? DIFFICULTY_CONFIG.easy;

  const thumbHeight = isFeatured ? 200 : 150;
  const illustrationSize = isFeatured ? 150 : 116;

  return (
    <Card
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: 'background.paper',
        ...(!onClick && { '&:hover': { transform: 'none', boxShadow: 'none' } }),
        ...sx,
      }}
    >
      {/* ── 썸네일 ── */}
      <Box sx={{ p: 1.5, pb: 0 }}>
        <Box
          sx={{
            height: thumbHeight,
            backgroundColor: cat.color,
            border: `1.5px solid ${zmath.nearBlack}`,
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MathConceptIllustration
            conceptKey={conceptKey}
            category={category}
            strokeColor={cat.illustrationColor}
            decoColor={cat.decoColor}
            shadowColor={zmath.darkGreen}
            size={illustrationSize}
          />
        </Box>
      </Box>

      {/* ── 콘텐츠 ── */}
      <Box sx={{ p: 2, pt: 1.5, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>

        {/* 카테고리 · 난이도 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.04em' }}>
            {categoryLabel ?? cat.label}
          </Typography>
          <Chip
            label={diff.label}
            size="small"
            sx={{
              backgroundColor: diff.bg,
              color: diff.color,
              fontWeight: 700,
              fontSize: '0.65rem',
              letterSpacing: '0.04em',
              height: 18,
              border: 'none',
            }}
          />
        </Box>

        {/* 개념 제목 */}
        <Typography variant={isFeatured ? 'h2' : 'h3'} sx={{ lineHeight: 1.25, wordBreak: 'keep-all' }}>
          {conceptTitle}
        </Typography>

        {/* 설명 */}
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.55,
              wordBreak: 'keep-all',
            }}
          >
            {description}
          </Typography>
        )}

        {/* ── 참여 상태 섹션 — 플레이 여부에 따라 명확히 다름 ── */}
        <Box sx={{ mt: 'auto', pt: 0.5 }}>
          {isPlayed ? (
            /* 플레이 후: 내 아바타 + 이름 + 시각 + 체크 */
            <PlayedBadge
              userAvatarVariant={userAvatarVariant}
              userId={userId}
              lastPlayedAt={lastPlayedAt}
              primaryColor={theme.palette.primary.main}
            />
          ) : (
            /* 미플레이: 참여자 버블 스택 + 인원수 */
            <ParticipantStack views={views} />
          )}
        </Box>

        {/* ── 하단 메타: views(작게) + heart(크게) ── */}
        <MetaRow
          views={views}
          likes={likes}
          isLiked={isLiked}
          onLike={onLike}
        />
      </Box>
    </Card>
  );
}

export default ConceptGameCard;
