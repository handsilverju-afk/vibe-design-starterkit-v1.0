import { useMemo } from 'react';
import { Box } from '@mui/material';
import { createAvatar } from '@dicebear/core';
import * as notionists from '@dicebear/notionists';

/**
 * PeepsAvatar 컴포넌트 (Notionists 스타일)
 *
 * Notionists 스타일 캐릭터 일러스트레이션.
 * SVG를 data URI로 변환해서 img 태그로 렌더링.
 *
 * Props:
 * @param {string} variant - 캐릭터 프리셋 [Optional, 기본값: 'curious']
 *   'curious' | 'focused' | 'celebrating' | 'confident' | 커스텀 seed 문자열
 * @param {number} size - 이미지 크기 (px) [Optional, 기본값: 120]
 * @param {object} sx - MUI sx prop [Optional]
 *
 * Example usage:
 * <PeepsAvatar variant="celebrating" size={160} />
 * <PeepsAvatar variant="confident" sx={{ position: 'absolute', bottom: -8, right: -8 }} />
 */

const VARIANT_SEEDS = {
  curious:     'zmath-notionists-a',
  focused:     'zmath-notionists-b',
  celebrating: 'zmath-notionists-c',
  confident:   'zmath-notionists-d',
};

function PeepsAvatar({
  variant = 'curious',
  size = 120,
  sx = {},
}) {
  const src = useMemo(() => {
    const seed = VARIANT_SEEDS[variant] ?? variant;
    const avatar = createAvatar(notionists, { seed, size });
    return avatar.toDataUri();
  }, [variant, size]);

  return (
    <Box
      component="img"
      src={ src }
      alt={ `${variant} character` }
      width={ size }
      height={ size }
      sx={{
        display: 'block',
        flexShrink: 0,
        ...sx,
      }}
    />
  );
}

export default PeepsAvatar;
