import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Placeholder, { placeholderSvg } from '../../common/ui/Placeholder';

export default {
  title: 'Component/3. Card/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {},
  },
  argTypes: {
    elevation: {
      control: { type: 'range', min: 0, max: 24 },
      description: '카드의 그림자 깊이를 설정합니다.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    variant: {
      control: 'select',
      options: ['elevation', 'outlined'],
      description: '카드의 스타일 변형을 설정합니다.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'elevation' },
      },
    },
  },
};

/** 기본 카드 */
export const Default = {
  args: {
    elevation: 1,
    variant: 'elevation',
  },
  render: (args) => (
    <Card sx={ { maxWidth: 345 } } elevation={ args.elevation } variant={ args.variant }>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          카드 제목
        </Typography>
        <Typography variant="body2" color="text.secondary">
          카드는 관련된 콘텐츠를 그룹화하여 표시하는 컴포넌트입니다.
          다양한 정보를 구조화된 형태로 보여줄 수 있습니다.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">더 보기</Button>
        <Button size="small">공유</Button>
      </CardActions>
    </Card>
  ),
};

/** 이미지가 있는 카드 */
export const WithMedia = {
  render: () => (
    <Card sx={ { maxWidth: 345 } }>
      <CardMedia
        component="img"
        height="140"
        image={ placeholderSvg(345, 140) }
        alt="카드 이미지"
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          이미지 카드
        </Typography>
        <Typography variant="body2" color="text.secondary">
          CardMedia 컴포넌트를 사용하여 이미지를 표시할 수 있습니다.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          자세히 보기
        </Button>
      </CardActions>
    </Card>
  ),
};

/** 헤더가 있는 카드 */
export const WithHeader = {
  render: () => (
    <Card sx={ { maxWidth: 345 } }>
      <CardHeader
        avatar={
          <Avatar sx={ { bgcolor: 'primary.main' } }>
            K
          </Avatar>
        }
        action={
          <IconButton>
            <Box component="span" sx={ { fontSize: 20 } }>⋮</Box>
          </IconButton>
        }
        title="김철수"
        subheader="2024년 1월 15일"
      />
      <CardMedia
        component="img"
        height="194"
        image={ placeholderSvg(345, 194) }
        alt="게시물 이미지"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          오늘 멋진 경험을 했습니다. 새로운 프로젝트를 시작하게 되어 정말 기쁩니다.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton>
          <Box component="span" sx={ { fontSize: 20 } }>♡</Box>
        </IconButton>
        <IconButton>
          <Box component="span" sx={ { fontSize: 20 } }>💬</Box>
        </IconButton>
        <IconButton>
          <Box component="span" sx={ { fontSize: 20 } }>↗</Box>
        </IconButton>
      </CardActions>
    </Card>
  ),
};

/** Outlined 카드 */
export const Outlined = {
  render: () => (
    <Card variant="outlined" sx={ { maxWidth: 345 } }>
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          OUTLINED
        </Typography>
        <Typography variant="h5" component="div" sx={ { mb: 1.5 } }>
          Outlined 카드
        </Typography>
        <Typography variant="body2" color="text.secondary">
          variant="outlined"를 사용하면 테두리만 있는 카드를 만들 수 있습니다.
          그림자 대신 보더로 영역을 구분합니다.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">확인</Button>
      </CardActions>
    </Card>
  ),
};

/** Elevation 비교 */
export const Elevations = {
  render: () => (
    <Stack direction="row" spacing={ 2 } flexWrap="wrap" useFlexGap>
      { [0, 1, 2, 3, 4].map((elevation) => (
        <Card key={ elevation } elevation={ elevation } sx={ { width: 120, height: 80 } }>
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              elevation
            </Typography>
            <Typography variant="h6">{ elevation }</Typography>
          </CardContent>
        </Card>
      )) }
    </Stack>
  ),
};

/** 상품 카드 */
export const ProductCard = {
  render: () => (
    <Card sx={ { maxWidth: 280 } }>
      <CardMedia
        component="img"
        height="200"
        image={ placeholderSvg(280, 200) }
        alt="상품 이미지"
      />
      <CardContent>
        <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 } }>
          <Typography variant="subtitle1" sx={ { fontWeight: 600 } }>
            프리미엄 무선 이어폰
          </Typography>
          <Chip label="NEW" size="small" color="primary" />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
          고품질 사운드와 편안한 착용감
        </Typography>
        <Box sx={ { display: 'flex', alignItems: 'baseline', gap: 1 } }>
          <Typography variant="h6" color="primary" sx={ { fontWeight: 700 } }>
            ₩89,000
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={ { textDecoration: 'line-through' } }
          >
            ₩120,000
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button variant="contained" fullWidth>
          장바구니 담기
        </Button>
      </CardActions>
    </Card>
  ),
};

/** 블로그 포스트 카드 */
export const BlogPostCard = {
  render: () => (
    <Card sx={ { maxWidth: 400 } }>
      <CardMedia
        component="img"
        height="180"
        image={ placeholderSvg(400, 180) }
        alt="블로그 썸네일"
      />
      <CardContent>
        <Stack direction="row" spacing={ 1 } sx={ { mb: 1 } }>
          <Chip label="React" size="small" variant="outlined" />
          <Chip label="TypeScript" size="small" variant="outlined" />
        </Stack>
        <Typography variant="h6" gutterBottom sx={ { fontWeight: 600 } }>
          React 19의 새로운 기능 살펴보기
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
          React 19에서 추가된 새로운 기능들과 성능 개선 사항에 대해 알아봅니다.
          Actions, use(), 그리고 새로운 훅들...
        </Typography>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: 2 } }>
          <Avatar sx={ { width: 32, height: 32, bgcolor: 'secondary.main' } }>D</Avatar>
          <Box>
            <Typography variant="caption" sx={ { fontWeight: 500 } }>
              개발자 김
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              2024.01.15 · 5분 읽기
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  ),
};

/** 프로필 카드 */
export const ProfileCard = {
  render: () => (
    <Card sx={ { maxWidth: 300, textAlign: 'center' } }>
      <Box sx={ { pt: 3 } }>
        <Avatar
          sx={ {
            width: 80,
            height: 80,
            mx: 'auto',
            bgcolor: 'primary.main',
            fontSize: '2rem',
          } }
        >
          JS
        </Avatar>
      </Box>
      <CardContent>
        <Typography variant="h6" sx={ { fontWeight: 600 } }>
          정수민
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Frontend Developer
        </Typography>
        <Stack direction="row" spacing={ 1 } justifyContent="center" sx={ { mt: 2 } }>
          <Chip label="React" size="small" />
          <Chip label="TypeScript" size="small" />
          <Chip label="MUI" size="small" />
        </Stack>
      </CardContent>
      <CardActions sx={ { justifyContent: 'center', pb: 2 } }>
        <Button variant="outlined" size="small">
          프로필 보기
        </Button>
        <Button variant="contained" size="small">
          팔로우
        </Button>
      </CardActions>
    </Card>
  ),
};

/** 통계 카드 */
export const StatCard = {
  render: () => (
    <Stack direction="row" spacing={ 2 }>
      <Card sx={ { minWidth: 180 } }>
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            총 방문자
          </Typography>
          <Typography variant="h4" sx={ { fontWeight: 700 } }>
            12,543
          </Typography>
          <Typography variant="caption" color="success.main">
            +12.5% 지난 주 대비
          </Typography>
        </CardContent>
      </Card>
      <Card sx={ { minWidth: 180 } }>
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            신규 가입
          </Typography>
          <Typography variant="h4" sx={ { fontWeight: 700 } }>
            847
          </Typography>
          <Typography variant="caption" color="error.main">
            -3.2% 지난 주 대비
          </Typography>
        </CardContent>
      </Card>
      <Card sx={ { minWidth: 180 } }>
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            전환율
          </Typography>
          <Typography variant="h4" sx={ { fontWeight: 700 } }>
            4.8%
          </Typography>
          <Typography variant="caption" color="success.main">
            +0.8% 지난 주 대비
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  ),
};

/** 카드 그리드 */
export const CardGrid = {
  render: () => (
    <Box sx={ { width: 800 } }>
      <Grid container spacing={ 3 }>
        { [1, 2, 3, 4, 5, 6].map((item) => (
          <Grid size={ { xs: 12, sm: 6, md: 4 } } key={ item }>
            <Card>
              <CardMedia
                component="img"
                height="120"
                image={ placeholderSvg(300, 120) }
                alt={ `이미지 ${item}` }
              />
              <CardContent>
                <Typography variant="subtitle1" sx={ { fontWeight: 600 } }>
                  카드 제목 { item }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  카드 설명 텍스트입니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )) }
      </Grid>
    </Box>
  ),
};
