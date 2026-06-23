import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
  TreeNode,
} from '../../components/storybookDocumentation';
import PeepsAvatar from '../../components/game/PeepsAvatar';

export default {
  title: 'Style/zMath Tokens',
  parameters: {
    layout: 'padded',
  },
};

const ColorSwatch = ({ label, value, token, textDark = true }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
    <Box
      sx={{
        width: 100,
        height: 72,
        backgroundColor: value,
        border: '1px solid rgba(26,26,26,0.12)',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(26,26,26,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!textDark && (
        <Typography variant="caption" sx={{ color: '#FAFAF5', fontWeight: 600 }}>
          Aa
        </Typography>
      )}
    </Box>
    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
      {label}
    </Typography>
    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '0.65rem' }}>
      {value}
    </Typography>
    {token && (
      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.disabled', fontSize: '0.6rem' }}>
        {token}
      </Typography>
    )}
  </Box>
);

export const Default = {
  render: () => {
    const theme = useTheme();

    const tokenTree = {
      'background.default': theme.palette.background.default,
      'background.paper': theme.palette.background.paper,
      'palette.zmath': theme.palette.zmath,
      'palette.primary.main': theme.palette.primary.main,
      'palette.success.main': theme.palette.success.main,
      'shape.borderRadius': theme.shape.borderRadius,
    };

    return (
      <>
        <DocumentTitle
          title="zMath Design Tokens"
          status="Available"
          note="Friendly Colorful UI — based on neo-brutalism.jpeg reference"
          brandName="zMath"
          systemName="Design System"
          version="2.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            zMath 디자인 토큰
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            레퍼런스 이미지 기반 Friendly Colorful UI 토큰 시스템입니다.
            오프화이트 배경, pill 버튼, 16px 카드 radius, 비비드 컬러 블록이 핵심입니다.
          </Typography>

          {/* ─── 토큰 구조 ─── */}
          <SectionTitle title="토큰 구조" description="theme 계층 구조" />
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 6 }}>
            {Object.entries(tokenTree).map(([key, value]) => (
              <TreeNode key={key} keyName={key} value={value} />
            ))}
          </Box>

          {/* ─── 컬러 시스템 ─── */}
          <SectionTitle title="컬러 시스템" description="배경·카드·비비드 Accent 팔레트" />

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, mt: 3 }}>
            배경 & 기본
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <ColorSwatch label="background.default" value="#FAFAF5" token="off-white" />
            <ColorSwatch label="background.paper" value="#FFFFFF" token="카드 배경" />
            <ColorSwatch label="surfaceAlt" value="#FFE8EE" token="포커스 패널" />
            <ColorSwatch label="nearBlack" value="#1A1A1A" token="텍스트·아이콘" textDark={false} />
            <ColorSwatch label="offWhite" value="#FAFAF5" token="반전 텍스트" />
            <ColorSwatch label="primary.main" value="#0000FF" token="CTA 블루" textDark={false} />
            <ColorSwatch label="success.main" value="#00C853" token="정답 피드백" />
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            카테고리 Accent 컬러
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
            <ColorSwatch label="수와 연산" value="#FF5533" token="accent.orange" textDark={false} />
            <ColorSwatch label="함수" value="#FFE000" token="accent.yellow" />
          </Box>

          {/* ─── 토큰 값 테이블 ─── */}
          <SectionTitle title="토큰 값" description="전체 토큰 경로·값·용도" />
          <TableContainer sx={{ mb: 6 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Token</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>용도</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  ['background.default', '#FAFAF9', '전체 배경 — off-white (레퍼런스 기반)'],
                  ['background.paper', '#FFFFFF', '카드 배경 화이트'],
                  ['palette.zmath.surfaceAlt', '#C7DDDB44', '포커스 카드·패널 배경'],
                  ['palette.zmath.columbiaBlue', '#C7DDDB', '카드 bg 풀 컬러 (분수의 뺄셈 등)'],
                  ['palette.zmath.categoryColors.columbiaBlue', '#C7DDDB', '카테고리 bg — columbiaBlue 풀 컬러'],
                  ['palette.zmath.categoryColors.statistics', '#C7DDDB44', '카테고리 bg — statistics 틴트'],
                  ['palette.zmath.categoryColors.arithmetic', '#004638', '카테고리 bg — 수와 연산 (다크 그린)'],
                  ['palette.zmath.categoryColors.geometry', '#B6FCBE', '카테고리 bg — 도형 (매직 민트)'],
                  ['palette.zmath.categoryColors.function', '#D199FA', '카테고리 bg — 함수 (페일 바이올렛)'],
                  ['palette.zmath.nearBlack', '#0E0F0F', '텍스트·아이콘 (pure #000 금지)'],
                  ['palette.zmath.offWhite', '#FAFAF9', '반전 텍스트 (pure #FFF 금지)'],
                  ['palette.primary.main', '#0000FF', '브랜드 블루 CTA'],
                  ['palette.zmath.accent.orange', '#FF5533', '수와 연산 — 비비드 블록'],
                  ['palette.zmath.accent.yellow', '#FFE000', '함수 — 비비드 블록'],
                  ['palette.success.main', '#00C853', '정답 즉각 피드백'],
                  ['shape.borderRadius', '16', '카드 기본 radius (px)'],
                  ['MuiButton.borderRadius', '999', 'pill 형태'],
                  ['MuiCard.boxShadow', '0 2px 8px rgba()', 'subtle elevation (offset 아님)'],
                ].map(([token, value, desc]) => (
                  <TableRow key={token}>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{token}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 14,
                            height: 14,
                            backgroundColor: value.startsWith('#') ? value : 'transparent',
                            border: '1px solid rgba(0,0,0,0.15)',
                            borderRadius: '3px',
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{value}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ─── Shadow 시스템 ─── */}
          <SectionTitle title="Shadow 시스템" description="카드 = subtle elevation / 버튼 = 경량 offset" />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 5, mb: 6 }}>
            {[
              { label: '카드 기본', shadow: '0 2px 8px rgba(26,26,26,0.08)', bg: '#FFFFFF' },
              { label: '카드 hover', shadow: '0 4px 16px rgba(26,26,26,0.12)', bg: '#FFFFFF' },
              { label: '버튼 기본', shadow: '2px 2px 0 0 #1A1A1A', bg: '#0000FF' },
              { label: '버튼 hover', shadow: '3px 3px 0 0 #1A1A1A', bg: '#0000FF' },
            ].map(({ label, shadow, bg }) => (
              <Box key={label} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 56,
                    backgroundColor: bg,
                    border: '1px solid rgba(26,26,26,0.1)',
                    borderRadius: label.startsWith('버튼') ? '999px' : 2,
                    boxShadow: shadow,
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '0.6rem' }}>
                  {shadow.length > 30 ? shadow.slice(0, 30) + '…' : shadow}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* ─── 타이포그래피 스케일 ─── */}
          <SectionTitle title="타이포그래피 스케일" description="Outfit (헤딩·숫자) / Pretendard (한글 본문)" />
          <TableContainer sx={{ mb: 6 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Variant</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Size / Weight</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>용도</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>미리보기</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  ['h1', 'clamp(2–3.5rem) / 900', '페이지 타이틀', 'zMath'],
                  ['h2', '1.75rem / 800', '섹션 헤더', '수와 연산'],
                  ['h3', '1.25rem / 700', '카드 타이틀', '약수와 배수'],
                  ['body1', '1rem / 400 lh1.7', '개념 설명 본문', '수학이 재밌어지는 순간'],
                  ['caption', '0.75rem / 600', '태그·레이블', 'EASY'],
                  ['button', '0.875rem / 600', 'CTA 버튼 (Sentence case)', 'Start Game'],
                ].map(([variant, size, desc, preview]) => (
                  <TableRow key={variant}>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{variant}</TableCell>
                    <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{size}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{desc}</TableCell>
                    <TableCell>
                      <Typography variant={variant}>{preview}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ─── 컴포넌트 미리보기 ─── */}
          <SectionTitle title="컴포넌트 미리보기" description="레퍼런스 기반 실제 렌더링" />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 6 }}>

            {/* 버튼 */}
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Button — pill 형태, Sentence case (레퍼런스: "Follow", "Love button")
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button variant="contained" color="primary">Start Game</Button>
                <Button variant="contained" sx={{ backgroundColor: '#FF5533', '&:hover': { backgroundColor: '#E04A1A' } }}>
                  Challenge
                </Button>
                <Button variant="contained" sx={{ backgroundColor: '#FFE000', color: '#1A1A1A', '&:hover': { backgroundColor: '#E6CE00' } }}>
                  Follow
                </Button>
                <Button variant="outlined" color="primary">자세히 보기</Button>
                <Button variant="contained" sx={{ backgroundColor: '#1A1A1A', color: '#FAFAF5', '&:hover': { backgroundColor: '#333' } }}>
                  Love button
                </Button>
              </Stack>
            </Box>

            {/* Chip */}
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Chip — pill 태그 (레퍼런스 참조)
              </Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <Chip label="Easy" sx={{ backgroundColor: '#FFE000', color: '#1A1A1A' }} />
                <Chip label="Hard" sx={{ backgroundColor: '#FF5533', color: '#FAFAF5' }} />
                <Chip label="도형" sx={{ backgroundColor: '#00C9A7', color: '#1A1A1A' }} />
                <Chip label="랭킹 1위" sx={{ backgroundColor: '#FF8FA3', color: '#1A1A1A' }} />
              </Stack>
            </Box>

            {/* 진행률 */}
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                LinearProgress — 챌린지 진행률
              </Typography>
              <Box sx={{ maxWidth: 400 }}>
                <LinearProgress variant="determinate" value={65} color="primary" sx={{ mb: 1.5 }} />
                <LinearProgress variant="determinate" value={40} sx={{ mb: 1.5, '& .MuiLinearProgress-bar': { backgroundColor: '#FF5533' } }} />
                <LinearProgress variant="determinate" value={90} sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#00C853' } }} />
              </Box>
            </Box>

            {/* 카테고리 카드 블록 */}
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                게임 카드 — 카테고리 컬러 블록 + PeepsAvatar
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {[
                  { label: '수와 연산', bg: '#FF5533', text: '#FAFAF5', variant: 'curious' },
                  { label: '함수', bg: '#FFE000', text: '#1A1A1A', variant: 'focused' },
                  { label: '도형', bg: '#00C9A7', text: '#1A1A1A', variant: 'celebrating' },
                  { label: '확률·통계', bg: '#FF8FA3', text: '#1A1A1A', variant: 'confident' },
                ].map(({ label, bg, text, variant }) => (
                  <Card
                    key={label}
                    sx={{
                      width: 140,
                      height: 140,
                      backgroundColor: bg,
                      position: 'relative',
                      overflow: 'visible',
                      border: '1px solid rgba(26,26,26,0.15)',
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" sx={{ color: text, fontWeight: 700, display: 'block' }}>
                        {label}
                      </Typography>
                    </CardContent>
                    <PeepsAvatar
                      variant={variant}
                      size={90}
                      sx={{
                        position: 'absolute',
                        bottom: -8,
                        right: -8,
                      }}
                    />
                  </Card>
                ))}
              </Stack>
            </Box>
          </Box>

          {/* ─── 사용 예시 ─── */}
          <SectionTitle title="사용 예시" description="MUI sx prop 토큰 활용" />
          <Box
            component="pre"
            sx={{
              backgroundColor: 'grey.100',
              p: 2,
              fontSize: 12,
              fontFamily: 'monospace',
              overflow: 'auto',
              borderRadius: 2,
              mb: 4,
            }}
          >
{`// 1. 카테고리 컬러 블록 카드
<Card sx={{
  backgroundColor: theme.palette.zmath.accent.orange,
  border: '1px solid rgba(26,26,26,0.15)',
  borderRadius: 2,  // theme.shape.borderRadius = 16
}}>

// 2. Pill 버튼 (theme에 이미 적용됨)
<Button variant="contained" color="primary">
  Start Game
</Button>

// 3. 비비드 배경 위 텍스트
<Typography sx={{ color: theme.palette.zmath.offWhite }}>
  수와 연산
</Typography>

// 4. 살몬 배경 Surface
<Box sx={{ backgroundColor: 'background.default' }}>
  // #FFF0EB off-white 배경
</Box>`}
          </Box>

          {/* ─── Vibe Coding Prompt ─── */}
          <SectionTitle
            title="Vibe Coding Prompt"
            description="AI 코딩 도구에서 활용할 수 있는 프롬프트 예시"
          />
          <Box
            component="pre"
            sx={{
              backgroundColor: 'grey.900',
              color: 'grey.100',
              p: 2,
              fontSize: 12,
              fontFamily: 'monospace',
              overflow: 'auto',
              borderRadius: 2,
            }}
          >
{`"zMath Friendly Colorful UI 테마로 게임 카드를 만들어줘.
배경: theme.palette.zmath.accent.orange (#FF5533),
텍스트: theme.palette.zmath.offWhite (#FAFAF5),
border: 1px solid rgba(26,26,26,0.15),
borderRadius: 16,
boxShadow: 0 2px 8px rgba(26,26,26,0.08),
hover 시 boxShadow: 0 4px 16px rgba(26,26,26,0.12) + translateY(-2px),
우하단에 PeepsAvatar variant='curious' size=90 overflow visible 배치."

"버튼은 pill 형태로 borderRadius 999px,
border: 1.5px solid #1A1A1A, boxShadow: 2px 2px 0 #1A1A1A,
Sentence case 텍스트, fontWeight 600으로 만들어줘."`}
          </Box>
        </PageContainer>
      </>
    );
  },
};
