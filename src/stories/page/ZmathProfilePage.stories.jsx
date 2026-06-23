import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { AppShell } from '../../components/layout/AppShell';
import { PageContainer } from '../../components/layout/PageContainer';
import ProfileAvatar from '../../components/game/ProfileAvatar';
import { MathConceptIllustration } from '../../components/game/MathConceptIllustration';
import ConceptGameCard from '../../components/game/ConceptGameCard';
import { ZmathLogo, ZmathNavLinks } from '../../components/navigation/ZmathGNB';
import { resolveIpProfile } from '../../utils/ipProfile';

const DIFFICULTY_SCORE = { easy: 10, medium: 20, hard: 30 };

const LIKED_PROBLEMS = [
  { id: 'fraction-add',  conceptKey: 'fraction-add',  category: 'arithmetic',   categoryLabel: '수와 연산', conceptTitle: '분수의 덧셈',   difficulty: 'medium', description: '분모를 맞추어 분수를 더해 보세요.',          views: 830, likes: 55, isLiked: true },
  { id: 'triangle-area', conceptKey: 'triangle-area', category: 'function',     categoryLabel: '도형',      conceptTitle: '삼각형의 넓이', difficulty: 'easy',   description: '밑변과 높이로 넓이 공식을 확인하세요.',       views: 970, likes: 62, isLiked: true },
  { id: 'congruence',    conceptKey: 'congruence',    category: 'geometry',     categoryLabel: '도형',      conceptTitle: '합동과 대칭',   difficulty: 'easy',   description: '도형을 뒤집고 돌려 합동·대칭을 발견하세요.', views: 720, likes: 49, isLiked: true },
  { id: 'fraction-sub',  conceptKey: 'fraction-sub',  category: 'columbiaBlue', categoryLabel: '수와 연산', conceptTitle: '분수의 뺄셈',   difficulty: 'medium', description: '분모를 맞추어 분수를 빼 보세요.',            views: 720, likes: 48, isLiked: true },
];

const SOLVED_PROBLEMS = [
  { conceptTitle: '분수의 덧셈',   conceptKey: 'fraction-add',  category: 'arithmetic', difficulty: 'medium', progress: 85  },
  { conceptTitle: '약수와 배수',   conceptKey: 'gcd-lcm',        category: 'arithmetic', difficulty: 'easy',   progress: 60  },
  { conceptTitle: '삼각형의 넓이', conceptKey: 'triangle-area', category: 'function',   difficulty: 'easy',   progress: 100, lastOX: 'O' },
  { conceptTitle: '분수의 곱셈',   conceptKey: 'fraction-multi', category: 'arithmetic', difficulty: 'medium', progress: 100, lastOX: 'X' },
  { conceptTitle: '경우의 수',     conceptKey: 'likelihood',      category: 'yellow',     difficulty: 'easy',   progress: 40  },
];

// ─────────────────────────────────
// 풀기 문제 리스트 아이템
// ─────────────────────────────────
function SolvedProblemRow({ conceptTitle, conceptKey, category, difficulty, progress, lastOX, onClick }) {
  const theme = useTheme();
  const { zmath } = theme.palette;

  const CATEGORY_BG = {
    arithmetic:   zmath.categoryColors.arithmetic,
    function:     zmath.categoryColors.function,
    geometry:     zmath.categoryColors.geometry,
    statistics:   zmath.categoryColors.statistics,
    columbiaBlue: zmath.categoryColors.columbiaBlue,
    yellow:       zmath.accent.yellow,
  };

  const thumbBg = CATEGORY_BG[category] ?? zmath.categoryColors.arithmetic;

  return (
    <Box
      onClick={ onClick }
      sx={{
        display: 'flex', alignItems: 'center', gap: 2, py: 1.5, px: 2,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background-color 0.15s',
        '&:hover': onClick ? { backgroundColor: 'action.hover' } : {},
      }}
    >
      {/* 미니 썸네일 */}
      <Box sx={{
        width: 52, height: 52, flexShrink: 0,
        backgroundColor: thumbBg,
        border: `1.5px solid ${zmath.nearBlack}`,
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <MathConceptIllustration conceptKey={ conceptKey } category={ category } size={ 40 } />
      </Box>

      {/* 제목 + 진행률 바 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.75 }} noWrap>{ conceptTitle }</Typography>
        <LinearProgress
          variant="determinate"
          value={ progress }
          sx={{
            height: 6, borderRadius: 3,
            backgroundColor: `${zmath.nearBlack}15`,
            '& .MuiLinearProgress-bar': {
              backgroundColor: progress === 100 ? zmath.categoryColors.geometry : theme.palette.primary.main,
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* O/X — 100% 완료한 경우에만 표시, 항상 같은 너비 확보 */}
      <Box sx={{ width: 28, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        { progress === 100 && lastOX && (
          <Chip
            label={ lastOX }
            size="small"
            sx={{
              backgroundColor: lastOX === 'O' ? `${zmath.categoryColors.geometry}CC` : `${theme.palette.primary.main}22`,
              color: lastOX === 'O' ? zmath.nearBlack : theme.palette.primary.main,
              fontWeight: 700, fontSize: '0.75rem', height: 22,
            }}
          />
        ) }
      </Box>

      {/* 진행률 % */}
      <Typography sx={{
        fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '0.8rem',
        color: progress === 100 ? zmath.darkGreen : 'text.secondary',
        flexShrink: 0, width: 36, textAlign: 'right',
      }}>
        { progress }%
      </Typography>
    </Box>
  );
}

// ─────────────────────────────────
// 프로필 페이지
// ─────────────────────────────────

/**
 * ZmathProfilePage
 *
 * Props:
 * @param {function} onNavigate   - 페이지 이동 핸들러 ('home' | 'profile') [Optional]
 * @param {function} onGameClick  - 게임 상세 이동 핸들러 (conceptKey: string) => void [Optional]
 * @param {function} onElementary6 - 초등6 콘텐츠 클릭 핸들러 [Optional]
 * @param {string}   initialTab   - 초기 탭 ('solved' | 'liked') [Optional, 기본값: 'solved']
 * @param {function} onTabChange  - 탭 변경 핸들러 (tab: string) => void [Optional]
 *
 * Example usage:
 * <ZmathProfilePage onNavigate={(page) => setCurrentPage(page)} onGameClick={(key) => navigate(`/game/${key}`)} />
 */
export function ZmathProfilePage({ onNavigate, onGameClick, onElementary6, initialTab = 'solved', onTabChange }) {
  const theme = useTheme();
  const { zmath } = theme.palette;
  const [avatarVariant, setAvatarVariant] = useState('confident');
  const [userId, setUserId] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    resolveIpProfile().then((p) => {
      if (p) {
        setAvatarVariant(p.avatarVariant);
        setUserId(p.userId);
      }
    });
  }, []);

  const totalScore = SOLVED_PROBLEMS.reduce((s, p) => {
    if (p.progress !== 100 || !p.lastOX) return s;
    return s + (p.lastOX === 'O' ? (DIFFICULTY_SCORE[p.difficulty] ?? 10) : 0);
  }, 0);
  const avgProgress = Math.round(SOLVED_PROBLEMS.reduce((s, p) => s + p.progress, 0) / SOLVED_PROBLEMS.length);

  return (
    <AppShell
      logo={ <ZmathLogo onClick={ () => onNavigate?.('home') } /> }
      headerCollapsible={
        <ZmathNavLinks
          active=""
          avatarVariant={ avatarVariant }
          isProfileActive={ true }
          onProfileClick={ () => onNavigate?.('profile') }
          onElementary6={ onElementary6 }
          onNavClick={ (label) => {
            if (label === '홈') onNavigate?.('home');
            else if (label === '초등5') onNavigate?.('elementary5');
          }}
        />
      }
      headerPersistent={ null }
      hasHeaderBorder
      headerHeight={ 72 }
      sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}
    >
      <PageContainer maxWidth={false} sx={{ maxWidth: 600, py: 5, px: { xs: 2, md: 4 } }}>

        {/* ── 프로필 헤더 ── */}
        <Card sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <ProfileAvatar variant={ avatarVariant } size={ 80 } />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h2" sx={{ fontWeight: 900 }}>{ userId }</Typography>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>방금 전 접속</Typography>
            </Box>
            {/* 통계 */}
            <Stack direction="row" spacing={ 4 } sx={{ flexShrink: 0 }}>
              { [
                { value: SOLVED_PROBLEMS.length, label: '푼 문제' },
                { value: `${avgProgress}%`, label: '평균 진행률' },
                { value: totalScore, label: '점수' },
              ].map((stat) => (
                <Box key={ stat.label } sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1, mb: 0.25 }}>
                    { stat.value }
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{ stat.label }</Typography>
                </Box>
              )) }
            </Stack>
          </Box>
        </Card>

        {/* ── 탭 ── */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={ activeTab }
            onChange={ (_, v) => { setActiveTab(v); onTabChange?.(v); } }
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, minWidth: 'auto', mr: 1 },
            }}
          >
            <Tab label={ `내가 푼 문제 ${SOLVED_PROBLEMS.length}` } value="solved" />
            <Tab label={ `찜한 문제 ${LIKED_PROBLEMS.length}` } value="liked" />
          </Tabs>
        </Box>

        {/* ── 탭 콘텐츠 ── */}
        { activeTab === 'solved' && (
          <Card sx={{ overflow: 'hidden' }}>
            { SOLVED_PROBLEMS.map((problem, index) => (
              <Box key={ problem.conceptKey }>
                { index > 0 && <Divider /> }
                <SolvedProblemRow
                  { ...problem }
                  onClick={ onGameClick ? () => onGameClick(problem.conceptKey) : undefined }
                />
              </Box>
            )) }
          </Card>
        ) }

        { activeTab === 'liked' && (
          <Grid container spacing={ 2 }>
            { LIKED_PROBLEMS.map((problem) => (
              <Grid key={ problem.id } size={{ xs: 6 }}>
                <ConceptGameCard
                  { ...problem }
                  userAvatarVariant={ avatarVariant }
                  userId={ userId }
                  onClick={ onGameClick ? () => onGameClick(problem.conceptKey) : undefined }
                />
              </Grid>
            )) }
          </Grid>
        ) }

      </PageContainer>
    </AppShell>
  );
}

// ─────────────────────────────────
// 스토리 메타
// ─────────────────────────────────
export default {
  title: 'Page/zMath Profile',
  parameters: { layout: 'fullscreen' },
  includeStories: ['Default'],
};

export const Default = {
  name: '프로필',
  render: () => <ZmathProfilePage />,
};
