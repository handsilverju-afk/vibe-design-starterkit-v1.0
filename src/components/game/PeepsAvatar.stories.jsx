import { Box, Stack, Typography } from '@mui/material';
import PeepsAvatar from './PeepsAvatar';

export default {
  title: 'Custom Component/PeepsAvatar',
  component: PeepsAvatar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['curious', 'focused', 'celebrating', 'confident'],
      description: '캐릭터 상황 프리셋 (또는 커스텀 seed 문자열)',
    },
    size: {
      control: { type: 'number', min: 40, max: 300 },
      description: 'SVG 크기 (px)',
    },
    backgroundColor: {
      control: 'color',
      description: '배경 hex 색상 (#제외 또는 포함 모두 허용)',
    },
  },
};

export const Default = {
  args: {
    variant: 'curious',
    size: 120,
  },
};

export const Variants = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="flex-end">
      {[
        { variant: 'curious', label: '호기심 — 게임 카드' },
        { variant: 'focused', label: '집중 — 챌린지 카드' },
        { variant: 'celebrating', label: '환호 — 클리어 피드백' },
        { variant: 'confident', label: '자신감 — 랭킹 1위' },
      ].map(({ variant, label }) => (
        <Box key={variant} sx={{ textAlign: 'center' }}>
          <PeepsAvatar variant={variant} size={120} />
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {label}
          </Typography>
        </Box>
      ))}
    </Stack>
  ),
};

export const WithBackground = {
  render: () => (
    <Stack direction="row" spacing={3}>
      {[
        { variant: 'curious', bg: 'FF5C2B', label: '수와 연산' },
        { variant: 'focused', bg: 'FFE500', label: '함수' },
        { variant: 'celebrating', bg: '00D4AA', label: '도형' },
        { variant: 'confident', bg: 'FF8FA3', label: '확률·통계' },
      ].map(({ variant, bg, label }) => (
        <Box key={variant} sx={{ textAlign: 'center' }}>
          <PeepsAvatar
            variant={variant}
            size={120}
            backgroundColor={bg}
          />
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {label}
          </Typography>
        </Box>
      ))}
    </Stack>
  ),
};

export const CardOverflow = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {['curious', 'celebrating'].map((variant) => (
        <Box
          key={variant}
          sx={{
            width: 200,
            height: 180,
            backgroundColor: '#FF5533',
            border: '1.5px solid #1A1A1A',
            boxShadow: '4px 4px 0 0 #1A1A1A',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: '#1A1A1A', fontWeight: 800 }}>
            수와 연산
          </Typography>
          <PeepsAvatar
            variant={variant}
            size={140}
            sx={{
              position: 'absolute',
              bottom: -10,
              right: -10,
              overflow: 'visible',
            }}
          />
        </Box>
      ))}
    </Box>
  ),
};
