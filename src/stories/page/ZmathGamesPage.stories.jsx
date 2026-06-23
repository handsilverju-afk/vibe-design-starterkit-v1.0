import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AppShell } from '../../components/layout/AppShell';
import { CategoryTab } from '../../components/in-page-navigation/CategoryTab';
import { PageContainer } from '../../components/layout/PageContainer';
import ConceptGameCard from '../../components/game/ConceptGameCard';
import { ZmathLogo, ZmathNavLinks } from '../../components/navigation/ZmathGNB';
import { ZmathFractionGamePage } from './ZmathFractionGamePage.stories';
import { ZmathProfilePage } from './ZmathProfilePage.stories';

// ─────────────────────────────────
// 샘플 데이터
// ─────────────────────────────────
const CATEGORIES = [
  { id: 'all',        label: '전체' },
  { id: 'arithmetic', label: '수와 연산' },
  { id: 'geometry',   label: '도형' },
  { id: 'statistics', label: '확률·통계' },
];

const GAMES = [
  { id: 'gcd-lcm',        subject: 'arithmetic', conceptKey: 'gcd-lcm',        category: 'arithmetic', categoryLabel: '수와 연산',  conceptTitle: '약수와 배수',   difficulty: 'easy',   description: '공약수·공배수를 드래그로 탐색하세요.',       views: 1240, likes: 87 },
  { id: 'fraction-add',   subject: 'arithmetic', conceptKey: 'fraction-add',   category: 'arithmetic', categoryLabel: '수와 연산',  conceptTitle: '분수의 덧셈',   difficulty: 'medium', description: '분모를 맞추어 분수를 더해 보세요.',          views: 830,  likes: 54 },
  { id: 'fraction-sub',   subject: 'arithmetic', conceptKey: 'fraction-sub',   category: 'columbiaBlue', categoryLabel: '수와 연산',  conceptTitle: '분수의 뺄셈',   difficulty: 'medium', description: '분모를 맞추어 분수를 빼 보세요.',            views: 720,  likes: 48 },
  { id: 'fraction-multi', subject: 'arithmetic', conceptKey: 'fraction-multi', category: 'arithmetic', categoryLabel: '수와 연산',  conceptTitle: '분수의 곱셈',   difficulty: 'medium', description: '분수 곱셈의 원리를 직접 확인하세요.',         views: 610,  likes: 41 },
  { id: 'fraction-div',   subject: 'arithmetic', conceptKey: 'fraction-div',   category: 'statistics', categoryLabel: '수와 연산',  conceptTitle: '분수의 나눗셈', difficulty: 'hard',   description: '역수를 이용한 나눗셈 원리를 탐색하세요.',     views: 490,  likes: 32 },
  { id: 'triangle-area', subject: 'geometry', conceptKey: 'triangle-area', category: 'function',  categoryLabel: '도형', conceptTitle: '삼각형의 넓이', difficulty: 'easy', description: '밑변과 높이로 넓이 공식을 확인하세요.',       views: 970, likes: 61 },
  { id: 'congruence',    subject: 'geometry', conceptKey: 'congruence',    category: 'geometry', categoryLabel: '도형', conceptTitle: '합동과 대칭',   difficulty: 'easy', description: '도형을 뒤집고 돌려 합동·대칭을 발견하세요.', views: 720, likes: 48 },
  { id: 'mean',       subject: 'statistics', conceptKey: 'mean',       category: 'columbiaBlue', categoryLabel: '확률·통계', conceptTitle: '평균과 가능성', difficulty: 'easy', description: '데이터를 넣고 빼며 평균이 변하는 걸 확인하세요.', views: 720, likes: 43 },
  { id: 'likelihood', subject: 'statistics', conceptKey: 'likelihood', category: 'yellow',       categoryLabel: '확률·통계', conceptTitle: '경우의 수',     difficulty: 'easy', description: '일어날 수 있는 경우를 모두 세어 보세요.',        views: 580, likes: 37 },
];

const SUB_COPY = '초등 5학년 수학 개념을 직접 조작하며 익히는 인터랙티브 게임';

// ─────────────────────────────────

// ─────────────────────────────────
// 게임 카드 그리드 (공통)
// ─────────────────────────────────
function GameGrid({ games, likedIds = new Set(), onLike, onGameClick }) {
  return (
    <Box sx={{ overflow: 'visible' }}>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 4,
      }}>
        { games.map((game) => (
          <ConceptGameCard
            key={ game.id }
            conceptKey={ game.conceptKey }
            category={ game.category }
            categoryLabel={ game.categoryLabel }
            conceptTitle={ game.conceptTitle }
            difficulty={ game.difficulty }
            description={ game.description }
            views={ game.views }
            likes={ game.likes + (likedIds.has(game.id) ? 1 : 0) }
            isLiked={ likedIds.has(game.id) }
            onLike={ () => onLike?.(game.id) }
            onClick={ () => onGameClick?.(game) }
            sx={{ height: 'auto' }}
          />
        )) }
      </Box>
    </Box>
  );
}

// ─────────────────────────────────
// 전체 게임 페이지 (CategoryTab 포함)
// ─────────────────────────────────
/**
 * ZmathGamesPage
 *
 * Props:
 * @param {string}   initialCategory  - 초기 탭 카테고리 [Optional, 기본값: 'all']
 * @param {function} onGoHome         - 홈으로 이동 [Optional]
 * @param {function} onGoProfile      - 프로필 페이지로 이동 [Optional, 없으면 내부 state 사용]
 * @param {function} onGameClick      - 게임 상세로 이동 (game: object) => void [Optional, 없으면 내부 state 사용]
 * @param {function} onCategoryChange - 카테고리 탭 변경 (cat: string) => void [Optional]
 */
export function ZmathGamesPage({ initialCategory = 'all', onGoHome, onGoProfile, onGameClick, onCategoryChange }) {
  const [activeTab, setActiveTab] = useState(initialCategory);
  const [likedIds, setLikedIds] = useState(new Set());
  const [selectedGame, setSelectedGame] = useState(null);
  const [elem6Open, setElem6Open] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleLike = (id) =>
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleGoHome = () => onGoHome?.();
  const handleGoProfile = () => {
    if (onGoProfile) { onGoProfile(); return; }
    setShowProfile(true);
  };
  const handleElem6 = () => setElem6Open(true);

  const handleGameClick = (game) => {
    if (onGameClick) { onGameClick(game); return; }
    setSelectedGame(game);
  };

  const filtered = activeTab === 'all'
    ? GAMES
    : GAMES.filter((g) => g.subject === activeTab);

  const Elem6Dialog = (
    <Dialog open={ elem6Open } onClose={ () => setElem6Open(false) }>
      <DialogTitle>초등 6학년</DialogTitle>
      <DialogContent>
        <DialogContentText>초등 6학년 콘텐츠는 현재 준비중입니다.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={ () => setElem6Open(false) } variant="contained">확인</Button>
      </DialogActions>
    </Dialog>
  );

  if (showProfile) {
    return (
      <>
        <ZmathProfilePage
          onNavigate={ (page) => {
            if (page === 'home') { handleGoHome(); return; }
            setShowProfile(false);
          } }
          onGameClick={ (key) => {
            const game = GAMES.find((g) => g.conceptKey === key) ?? { conceptKey: key, subject: 'arithmetic' };
            setShowProfile(false);
            setSelectedGame(game);
          } }
          onElementary6={ handleElem6 }
        />
        { Elem6Dialog }
      </>
    );
  }

  if (selectedGame) {
    const backHandler = (catId) => { setSelectedGame(null); if (catId) setActiveTab(catId); };
    const gradesHandler = () => { setSelectedGame(null); setActiveTab('all'); };

    return (
      <>
        <ZmathFractionGamePage
          categoryId={ selectedGame.subject }
          onBack={ backHandler }
          onGoGrades={ gradesHandler }
          onGoHome={ handleGoHome }
          onGoProfile={ handleGoProfile }
          onElementary6={ handleElem6 }
        />
        { Elem6Dialog }
      </>
    );
  }

  return (
    <>
      <AppShell
        logo={ <ZmathLogo onClick={ handleGoHome } /> }
        headerCollapsible={
          <ZmathNavLinks
            active="초등5"
            onNavClick={ (label) => { if (label === '홈') handleGoHome(); } }
            onElementary6={ handleElem6 }
            onProfileClick={ handleGoProfile }
          />
        }
        headerPersistent={ null }
        hasHeaderBorder
        headerHeight={ 72 }
        sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}
      >
        <PageContainer maxWidth={false} sx={{ maxWidth: { xs: '100%', lg: 'min(68.33vw, 1200px)' }, py: 5, px: { xs: 2, md: 4 } }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h2" sx={{ mb: 0.5 }}>초등 5학년</Typography>
            <Typography variant="body1" color="text.secondary">
              { SUB_COPY }
            </Typography>
          </Box>
          <CategoryTab categories={ CATEGORIES } selected={ activeTab } onChange={ (cat) => { setActiveTab(cat); onCategoryChange?.(cat); } } sx={{ mb: 4 }} />
          <GameGrid games={ filtered } likedIds={ likedIds } onLike={ toggleLike } onGameClick={ handleGameClick } />
        </PageContainer>
      </AppShell>
      { Elem6Dialog }
    </>
  );
}

// ─────────────────────────────────
// 스토리 메타
// ─────────────────────────────────
export default {
  title: 'Page/zMath Games',
  parameters: { layout: 'fullscreen' },
  includeStories: ['Default'],
};

export const Default = {
  name: '초등 5학년',
  render: () => <ZmathGamesPage />,
};
