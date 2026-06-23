import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ConceptGameCard from './ConceptGameCard';

export default {
  title: 'Component/16. Game/ConceptGameCard',
  component: ConceptGameCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    conceptKey: {
      control: 'select',
      options: ['gcd-lcm', 'fraction-add', 'linear-fn', 'quadratic-fn', 'triangle-area', 'mean'],
      description: '개념 키 — 썸네일 일러스트 결정',
    },
    category: {
      control: 'select',
      options: ['arithmetic', 'function', 'geometry', 'statistics'],
      description: '카테고리 (썸네일 배경색·아바타 결정)',
    },
    difficulty: {
      control: 'select',
      options: ['easy', 'medium', 'hard'],
      description: '난이도',
    },
    conceptTitle:      { control: 'text',    description: '개념 제목' },
    description:       { control: 'text',    description: '한줄 설명' },
    views:             { control: { type: 'number', min: 0 }, description: '조회수' },
    likes:             { control: { type: 'number', min: 0 }, description: '좋아요 수' },
    isLiked:           { control: 'boolean', description: '좋아요 활성 여부' },
    lastPlayedAt:      { control: 'text',    description: 'ISO 날짜 (마지막 플레이)' },
    isPlayed:          { control: 'boolean', description: '참여 여부 — true면 유저 아바타·아이디 표시' },
    userId:            { control: 'text',    description: '유저 아이디' },
    userAvatarVariant: {
      control: 'select',
      options: ['curious', 'focused', 'celebrating', 'confident'],
      description: '유저 PeepsAvatar variant',
    },
    isFeatured:        { control: 'boolean', description: '피처드 카드 (썸네일·글씨 크게)' },
    onClick:           { action: 'clicked' },
    onLike:            { action: 'liked' },
  },
};

/** 기본 카드 */
export const Default = {
  args: {
    conceptKey: 'triangle-area',
    category: 'geometry',
    conceptTitle: '삼각형의 넓이',
    difficulty: 'easy',
    description: '밑변과 높이를 바꿔가며 넓이 공식이 왜 성립하는지 확인하세요.',
    views: 970,
    likes: 61,
    isLiked: false,
    isPlayed: false,
    isFeatured: false,
  },
  render: (args) => <ConceptGameCard { ...args } sx={ { maxWidth: 280 } } />,
};

/** 참여 후 — 유저 아바타·아이디 표시 */
export const Played = {
  args: {
    conceptKey: 'triangle-area',
    category: 'geometry',
    conceptTitle: '삼각형의 넓이',
    difficulty: 'easy',
    description: '밑변과 높이를 바꿔가며 넓이 공식이 왜 성립하는지 확인하세요.',
    views: 971,
    likes: 62,
    isLiked: true,
    isPlayed: true,
    userId: '수학천재',
    userAvatarVariant: 'confident',
    lastPlayedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    isFeatured: false,
  },
  render: (args) => <ConceptGameCard { ...args } sx={ { maxWidth: 280 } } />,
};

/** 피처드 카드 (2×2 BentoGrid 스팬) */
export const Featured = {
  args: {
    conceptKey: 'gcd-lcm',
    category: 'arithmetic',
    conceptTitle: '약수와 배수',
    difficulty: 'easy',
    description: '숫자들의 관계를 드래그로 탐색하세요. 약수·공약수가 왜 그렇게 불리는지 직접 느껴보세요.',
    views: 1240,
    likes: 87,
    isFeatured: true,
    isPlayed: false,
  },
  render: (args) => <ConceptGameCard { ...args } sx={ { maxWidth: 360 } } />,
};

/** 카드 BG 3종 — 연한 핑크 캔버스 위 */
export const CardBgOnPink = {
  name: 'Card BG 3종 (핑크 캔버스)',
  render: () => {
    const CARD_BG = [
      { bg: '#FFFFFF',  label: 'White',        hex: '#FFFFFF'  },
      { bg: '#FFFDE7',  label: 'Light Yellow', hex: '#FFFDE7'  },
    ];
    const GAMES = [
      { conceptKey: 'gcd-lcm',       category: 'arithmetic', conceptTitle: '약수와 배수',   difficulty: 'easy',   views: 1240, likes: 87  },
      { conceptKey: 'triangle-area', category: 'geometry',   conceptTitle: '삼각형의 넓이', difficulty: 'easy',   views: 970,  likes: 61  },
      { conceptKey: 'linear-fn',     category: 'function',   conceptTitle: '1차 함수',      difficulty: 'medium', views: 1560, likes: 112 },
    ];

    return (
      <Box sx={{ backgroundColor: '#FFF5F7', p: 4, borderRadius: 3 }}>
        {CARD_BG.map(({ bg, label, hex }) => (
          <Box key={bg} sx={{ mb: 5 }}>
            {/* 섹션 레이블 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 14, height: 14, backgroundColor: bg, border: '1px solid rgba(0,0,0,0.12)', borderRadius: '3px', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#1A1A1A' }}>{label}</Typography>
              <Typography variant="caption" sx={{ color: '#1A1A1A', opacity: 0.4, fontFamily: 'monospace' }}>{hex}</Typography>
            </Box>

            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              {GAMES.map((game) => (
                <Box key={game.conceptKey} sx={{ width: 220 }}>
                  <ConceptGameCard {...game} sx={{ backgroundColor: bg }} onClick={() => {}} />
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
    );
  },
};

/** 개념별 일러스트 6종 비교 */
export const AllConcepts = {
  render: () => (
    <Grid container spacing={ 2 }>
      { [
        { conceptKey: 'gcd-lcm',       category: 'arithmetic', conceptTitle: '약수와 배수',  difficulty: 'easy',   views: 1240, likes: 87  },
        { conceptKey: 'fraction-add',  category: 'arithmetic', conceptTitle: '분수의 덧셈',  difficulty: 'medium', views: 830,  likes: 54  },
        { conceptKey: 'linear-fn',     category: 'function',   conceptTitle: '1차 함수',     difficulty: 'medium', views: 1560, likes: 112 },
        { conceptKey: 'quadratic-fn',  category: 'function',   conceptTitle: '2차 함수',     difficulty: 'hard',   views: 2100, likes: 198 },
        { conceptKey: 'triangle-area', category: 'geometry',   conceptTitle: '삼각형의 넓이',difficulty: 'easy',   views: 970,  likes: 61  },
        { conceptKey: 'mean',          category: 'statistics', conceptTitle: '평균 구하기',  difficulty: 'easy',   views: 720,  likes: 43  },
      ].map((game) => (
        <Grid key={ game.conceptKey } size={ { xs: 12, sm: 6, md: 4 } }>
          <ConceptGameCard { ...game } onClick={ () => {} } />
        </Grid>
      )) }
    </Grid>
  ),
};
