import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import ProfileAvatar from './ProfileAvatar';
import { MathConceptIllustration } from './MathConceptIllustration';

/**
 * ProfileCard
 *
 * Props:
 * @param {boolean} open - Dialog 열림 여부 [Required]
 * @param {object|null} user - 사용자 데이터 [Required]
 *   @param {string} user.nickname - 닉네임 [Required]
 *   @param {string} user.avatarVariant - ProfileAvatar variant [Optional, 기본값: 'curious']
 *   @param {number} user.score - 총 문제 풀이 횟수 [Optional]
 *   @param {string} user.lastAccess - 마지막 접속 시간 문자열 [Optional]
 *   @param {Array}  user.solvedProblems - 풀었던 문제 목록 [Optional]
 *     @param {string} .conceptTitle - 문제 제목
 *     @param {string} .conceptKey - 문제 키 (MathConceptIllustration)
 *     @param {string} .category - 카테고리 키 (썸네일 배경색)
 *     @param {string} .difficulty - 난이도 ('easy'|'medium'|'hard')
 *     @param {number} .progress - 진행률 0~100
 *     @param {'O'|'X'} .lastOX - 마지막 정답 여부 (progress===100일 때만 유효)
 * @param {function} onClose - 닫기 콜백 [Required]
 * @param {function} onGameClick - 문제 행 클릭 시 problem 객체 전달 [Optional]
 *
 * Example usage:
 * <ProfileCard open={open} user={selectedUser} onClose={() => setOpen(false)} onGameClick={handleGameClick} />
 */
export function ProfileCard({ open, user, onClose, onGameClick }) {
  const theme = useTheme();
  const { zmath } = theme.palette;

  if (!user) return null;

  const { nickname, avatarVariant = 'curious', score = 0, lastAccess = '', solvedProblems = [] } = user;
  const playCount = solvedProblems.length;

  const CATEGORY_BG = {
    arithmetic:   zmath.categoryColors.arithmetic,
    function:     zmath.categoryColors.function,
    geometry:     zmath.categoryColors.geometry,
    statistics:   zmath.categoryColors.statistics,
    columbiaBlue: zmath.categoryColors.columbiaBlue,
    yellow:       zmath.accent.yellow,
  };

  return (
    <Dialog
      open={ open }
      onClose={ onClose }
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `2px solid ${zmath.nearBlack}`,
          boxShadow: `6px 6px 0 ${zmath.nearBlack}`,
        },
      }}
    >
      {/* ── 프로필 헤더 ── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', px: 2.5, pt: 2.5, pb: 0 }}>
        <Stack direction="row" spacing={ 1.5 } alignItems="center">
          <ProfileAvatar variant={ avatarVariant } size={ 52 } />
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.15 }}>{ nickname }</Typography>
            { lastAccess && (
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>{ lastAccess } 접속</Typography>
            ) }
          </Box>
        </Stack>
        <IconButton size="small" onClick={ onClose } sx={{ mt: -0.5, mr: -0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ── 풀이 횟수 + 점수 ── */}
      <Stack direction="row" spacing={ 1 } sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
        <Chip
          label={ `문제 풀이 ${playCount}회` }
          size="small"
          sx={{ fontWeight: 700, fontSize: '0.72rem', backgroundColor: `${zmath.nearBlack}10` }}
        />
        <Chip
          label={ `${score}점` }
          size="small"
          sx={{
            fontWeight: 700, fontSize: '0.72rem',
            backgroundColor: score > 0 ? `${zmath.categoryColors.geometry}33` : `${zmath.nearBlack}10`,
            color: score > 0 ? zmath.nearBlack : 'text.secondary',
          }}
        />
      </Stack>

      {/* ── 문제 목록 ── */}
      <DialogContent sx={{ px: 1.5, pt: 0, pb: 1.5 }}>
        { solvedProblems.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            아직 푼 문제가 없어요.
          </Typography>
        ) : (
          solvedProblems.map((problem, idx) => {
            const thumbBg = CATEGORY_BG[problem.category] ?? zmath.categoryColors.arithmetic;
            const isCorrect = problem.lastOX === 'O';
            return (
              <Box key={ idx }>
                { idx > 0 && <Divider /> }
                <Box
                  onClick={ () => onGameClick?.(problem) }
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.25,
                    px: 1, py: 1,
                    borderRadius: 1.5,
                    cursor: onGameClick ? 'pointer' : 'default',
                    transition: 'background-color 0.15s',
                    '&:hover': onGameClick ? { backgroundColor: 'action.hover' } : {},
                  }}
                >
                  {/* 썸네일 */}
                  <Box sx={{
                    width: 40, height: 40, flexShrink: 0,
                    backgroundColor: thumbBg,
                    border: `1.5px solid ${zmath.nearBlack}`,
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    <MathConceptIllustration conceptKey={ problem.conceptKey } category={ problem.category } size={ 30 } />
                  </Box>

                  {/* 제목 + 진행률 바 */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }} noWrap>{ problem.conceptTitle }</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={ problem.progress }
                      sx={{
                        height: 4, borderRadius: 2,
                        backgroundColor: `${zmath.nearBlack}15`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: problem.progress === 100 ? zmath.categoryColors.geometry : theme.palette.primary.main,
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>

                  {/* O/X + 진행률 % */}
                  <Stack direction="row" spacing={ 0.5 } alignItems="center" sx={{ flexShrink: 0 }}>
                    <Box sx={{ width: 22, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                      { problem.progress === 100 && problem.lastOX && (
                        <Chip
                          label={ isCorrect ? '✓' : '✗' }
                          size="small"
                          sx={{
                            width: 22, height: 20, fontSize: '0.68rem', fontWeight: 900,
                            backgroundColor: isCorrect
                              ? `${zmath.categoryColors.geometry}CC`
                              : `${theme.palette.primary.main}CC`,
                            color: isCorrect ? zmath.nearBlack : zmath.offWhite,
                            '& .MuiChip-label': { px: 0 },
                          }}
                        />
                      ) }
                    </Box>
                    <Typography sx={{
                      fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '0.72rem',
                      color: problem.progress === 100 ? zmath.darkGreen : 'text.secondary',
                      width: 30, textAlign: 'right', flexShrink: 0,
                    }}>
                      { problem.progress }%
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            );
          })
        ) }
      </DialogContent>
    </Dialog>
  );
}

export default ProfileCard;
