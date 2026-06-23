import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { zmathTheme as theme } from './styles/themes';
import { ZmathHomePage } from './stories/page/ZmathHomePage.stories';
import { ZmathGamesPage } from './stories/page/ZmathGamesPage.stories';
import { ZmathProfilePage } from './stories/page/ZmathProfilePage.stories';
import { ZmathFractionGamePage } from './stories/page/ZmathFractionGamePage.stories';
import { ZmathLogo } from './components/navigation/ZmathGNB';
import ProfileAvatar from './components/game/ProfileAvatar';
import { resolveIpProfile } from './utils/ipProfile';

// ─── 모바일/태블릿 대체 화면 ───────────────────────────
// position: fixed → body min-width 제약 우회, 실제 뷰포트 전체 차지
function MobileFallback() {
  const { zmath } = useTheme().palette;
  const [avatarVariant, setAvatarVariant] = useState('confident');

  useEffect(() => {
    resolveIpProfile().then((p) => { if (p) setAvatarVariant(p.avatarVariant); });
  }, []);

  return (
    <Box sx={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      backgroundColor: 'background.default',
      px: 4,
    }}>
      <ZmathLogo />
      <ProfileAvatar variant={ avatarVariant } size={ 96 } />
      <Typography
        variant="body1"
        sx={{
          fontWeight: 700,
          color: zmath?.nearBlack ?? 'text.primary',
          textAlign: 'center',
          wordBreak: 'keep-all',
        }}
      >
        PC웹만 지원합니다.
      </Typography>
    </Box>
  );
}

// ─── 홈 라우트: 모바일이면 대체 화면 ──────────────────
function HomeRoute() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 1279px)');
  if (isMobile) return <MobileFallback />;
  return (
    <ZmathHomePage
      onGoProfile={ () => navigate('/profile') }
      onGoGames={ () => navigate('/games') }
      onGameClick={ (game) => navigate(`/game/${game.conceptKey}`) }
    />
  );
}

// /games?cat=arithmetic 형태로 카테고리를 URL에 유지
function GamesRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') ?? 'all';
  return (
    <ZmathGamesPage
      initialCategory={ initialCategory }
      onGoHome={ () => navigate('/') }
      onGameClick={ (game) => navigate(`/game/${game.conceptKey}`) }
      onCategoryChange={ (cat) => navigate(`/games${cat !== 'all' ? `?cat=${cat}` : ''}`, { replace: true }) }
    />
  );
}

// /profile?tab=liked 형태로 탭 상태를 URL에 유지
function ProfileRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') ?? 'solved';
  return (
    <ZmathProfilePage
      initialTab={ initialTab }
      onTabChange={ (tab) => navigate(`/profile?tab=${tab}`, { replace: true }) }
      onNavigate={ (page) => navigate(page === 'home' ? '/' : `/${page}`) }
      onGameClick={ (key) => navigate(`/game/${key}`) }
      onElementary6={ () => window.alert('초등 6학년 콘텐츠는 준비중입니다.') }
    />
  );
}

function FractionGameRoute() {
  const navigate = useNavigate();
  return (
    <ZmathFractionGamePage
      onGoHome={ () => navigate('/') }
      onGoGrades={ () => navigate('/games') }
      onBack={ (catId) => navigate(`/games${catId ? `?cat=${catId}` : ''}`) }
      onGoProfile={ () => navigate('/profile') }
      onElementary6={ () => window.alert('초등 6학년 콘텐츠는 준비중입니다.') }
    />
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route index element={<HomeRoute />} />
      <Route path="/games" element={<GamesRoute />} />
      <Route path="/profile" element={<ProfileRoute />} />
      <Route path="/game/fraction-add" element={<FractionGameRoute />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* 1280px 미만 → 가로 스크롤 (홈은 MobileFallback이 position:fixed로 오버라이드) */}
      <GlobalStyles styles={{
        'html': { overflowX: 'auto' },
        'body': { minWidth: 1280 },
      }} />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
