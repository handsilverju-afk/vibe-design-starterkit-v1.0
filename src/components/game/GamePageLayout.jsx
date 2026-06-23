import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const NK = '#0E0F0F';

/**
 * GameBreadcrumb
 *
 * Props:
 * @param {string}   category   - 카테고리명 [Optional, 기본값: '수와 연산']
 * @param {string}   title      - 현재 게임 제목 [Required]
 * @param {function} onBack     - 목록으로 돌아가기 콜백 [Optional]
 * @param {function} onGoHome   - 홈으로 이동 콜백 [Optional]
 * @param {function} onGoGrades - 학년 목록 이동 콜백 [Optional]
 *
 * Example usage:
 * <GameBreadcrumb category="수와 연산" title="분수의 덧셈" onBack={handleBack} />
 */
export function GameBreadcrumb({ category = '수와 연산', title, onBack, onGoHome, onGoGrades }) {
  const crumbs = ['홈', '초등5', category, title];
  const handlers = [onGoHome, onGoGrades, onBack, null];
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      px: { xs: 2, md: 4 }, py: 1.25,
      borderBottom: `1px solid ${NK}18`,
      backgroundColor: 'background.paper',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
        { crumbs.map((crumb, i) => (
          <Box key={ crumb } sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="caption"
              onClick={ handlers[i] ?? undefined }
              sx={{
                fontWeight: i === crumbs.length - 1 ? 700 : 500,
                color: i === crumbs.length - 1 ? 'text.primary' : 'text.secondary',
                cursor: handlers[i] ? 'pointer' : 'default',
                '&:hover': handlers[i] ? { color: 'primary.main' } : {},
                transition: 'color 0.15s',
              }}
            >
              { crumb }
            </Typography>
            { i < crumbs.length - 1 && (
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>›</Typography>
            ) }
          </Box>
        )) }
      </Box>
      <Button
        variant="outlined"
        size="small"
        onClick={ onBack }
        sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap', flexShrink: 0, ml: 2 }}
      >
        ← 목록으로
      </Button>
    </Box>
  );
}

/**
 * PhaseBar
 *
 * Props:
 * @param {number}   phase  - 현재 단계 인덱스 [Required]
 * @param {string[]} labels - 단계 레이블 배열 [Required]
 *
 * Example usage:
 * <PhaseBar phase={2} labels={['분수', '통분', '분수 덧셈', '연습', '문제 풀기']} />
 */
export function PhaseBar({ phase, labels }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', px: 2, py: 1.25, flexWrap: 'wrap' }}>
      { labels.map((label, i) => (
        <Box key={ label } sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{
            px: 1.25, py: 0.25, borderRadius: 999,
            backgroundColor: i === phase ? 'primary.main' : i < phase ? `${NK}18` : 'rgba(26,26,26,0.06)',
            border: `1.5px solid ${ i <= phase ? NK : 'rgba(26,26,26,0.12)' }`,
            transition: 'all 0.3s',
          }}>
            <Typography sx={{
              fontSize: '0.6rem', fontWeight: 900,
              color: i === phase ? '#FAFAF9' : i < phase ? 'text.secondary' : 'text.disabled',
            }}>
              { label }
            </Typography>
          </Box>
          { i < labels.length - 1 && (
            <Box sx={{
              width: 10, height: 2,
              backgroundColor: i < phase ? NK : 'rgba(26,26,26,0.1)',
              borderRadius: 1, transition: 'all 0.3s',
            }} />
          ) }
        </Box>
      )) }
    </Box>
  );
}

/**
 * InfoBox — 설명 및 피드백 텍스트 컨테이너
 *
 * Example usage:
 * <InfoBox><Typography>설명 텍스트</Typography></InfoBox>
 */
export function InfoBox({ children }) {
  return (
    <Box sx={{
      p: 2.5, borderRadius: 2,
      border: `1.5px solid ${NK}`, boxShadow: `3px 3px 0 ${NK}`,
      backgroundColor: 'background.paper',
      display: 'flex', flexDirection: 'column', gap: 0.75,
    }}>
      { children }
    </Box>
  );
}

/**
 * CtaRow — 하단 이전/다음 버튼
 *
 * Props:
 * @param {function} onBack        - 이전 화면 콜백 [Optional]
 * @param {function} onNext        - 다음 화면 콜백 [Required]
 * @param {string}   nextLabel     - 다음 버튼 레이블 [Optional, 기본값: '다음으로 →']
 * @param {boolean}  nextDisabled  - 다음 버튼 비활성화 [Optional]
 * @param {string}   disabledLabel - 비활성화 시 표시 레이블 [Optional]
 *
 * Example usage:
 * <CtaRow onBack={handleBack} onNext={handleNext} nextLabel="다음으로 →" />
 */
export function CtaRow({ onBack, onNext, nextLabel = '다음으로 →', nextDisabled = false, disabledLabel }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      <Button
        variant="outlined" color="primary" size="large"
        onClick={ onBack || undefined }
        disabled={ !onBack }
        sx={{ minWidth: 90, flexShrink: 0 }}
      >
        ← 이전
      </Button>
      <Button
        variant="contained" color="primary" size="large"
        onClick={ !nextDisabled ? onNext : undefined }
        disabled={ nextDisabled }
        sx={{ flex: 1 }}
      >
        { nextDisabled && disabledLabel ? disabledLabel : nextLabel }
      </Button>
    </Box>
  );
}
