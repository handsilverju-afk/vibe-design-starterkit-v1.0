import Box from '@mui/material/Box';
import PeepsAvatar from './PeepsAvatar';

/**
 * FullBodyAvatar 컴포넌트
 *
 * Open Peeps 아바타(상반신) 아래에 동일 스타일의 다리+신발 SVG를 이어 붙여
 * 전신 캐릭터처럼 보이게 한다.
 * 다리·신발은 Open Peeps 아트 스타일(2.5px nearBlack 아웃라인, 플랫 컬러)을 따른다.
 *
 * Props:
 * @param {string} variant - PeepsAvatar variant ('curious'|'focused'|'celebrating'|'confident') [Optional, 기본값: 'curious']
 * @param {number} size - 상반신 아바타 크기(px). 다리 크기는 자동 비례 [Optional, 기본값: 200]
 * @param {string} pantColor - 바지 색상 [Optional, 기본값: '#2D3748']
 * @param {string} shoeColor - 신발 색상 [Optional, 기본값: '#1A1A1A']
 * @param {object} sx - 래퍼 Box sx prop [Optional]
 *
 * Example usage:
 * <FullBodyAvatar variant="celebrating" size={320} />
 * <FullBodyAvatar variant="confident" size={260} pantColor="#C0392B" shoeColor="#FFE000" />
 */

const NEAR_BLACK = '#1A1A1A';

// variant별 바지 컬러 기본값 — 캐릭터 개성 부여
const DEFAULT_PANT_COLORS = {
  curious:     '#2D3748',  // 네이비
  focused:     '#8B1A1A',  // 다크레드
  celebrating: '#1A4A2E',  // 다크그린
  confident:   '#1A1A4A',  // 다크퍼플
};

/**
 * Open Peeps 스타일 다리+신발 SVG
 * width는 아바타 size와 동일, height는 size * 0.36 수준
 */
function LegsSvg({ size, pantColor, shoeColor }) {
  const w = size;
  // 비례값
  const legW  = Math.round(size * 0.135);  // 다리 너비
  const legH  = Math.round(size * 0.22);   // 다리 높이
  const gap   = Math.round(size * 0.055);  // 두 다리 사이 간격
  const cx    = w / 2;
  const shoeW = Math.round(legW * 1.55);   // 신발 너비 (앞쪽으로 튀어나옴)
  const shoeH = Math.round(size * 0.07);   // 신발 높이
  const svgH  = legH + shoeH + 2;

  const lx = cx - gap / 2 - legW;  // 왼쪽 다리 x
  const rx = cx + gap / 2;          // 오른쪽 다리 x

  const s = { stroke: NEAR_BLACK, strokeWidth: 2.5, strokeLinejoin: 'round' };

  return (
    <svg
      width={ w }
      height={ svgH }
      viewBox={ `0 0 ${w} ${svgH}` }
      fill="none"
      style={{ display: 'block' }}
    >
      {/* 왼쪽 다리 */}
      <rect
        x={ lx } y={ 0 }
        width={ legW } height={ legH }
        rx="5"
        fill={ pantColor }
        { ...s }
      />
      {/* 오른쪽 다리 */}
      <rect
        x={ rx } y={ 0 }
        width={ legW } height={ legH }
        rx="5"
        fill={ pantColor }
        { ...s }
      />
      {/* 왼쪽 신발 — 왼쪽으로 살짝 튀어나옴 */}
      <rect
        x={ lx - Math.round(legW * 0.28) }
        y={ legH - 3 }
        width={ shoeW }
        height={ shoeH }
        rx="7"
        fill={ shoeColor }
        stroke={ NEAR_BLACK }
        strokeWidth="2"
      />
      {/* 오른쪽 신발 — 오른쪽으로 살짝 튀어나옴 */}
      <rect
        x={ rx - Math.round(legW * 0.28) }
        y={ legH - 3 }
        width={ shoeW }
        height={ shoeH }
        rx="7"
        fill={ shoeColor }
        stroke={ NEAR_BLACK }
        strokeWidth="2"
      />
    </svg>
  );
}

function FullBodyAvatar({
  variant = 'curious',
  size = 200,
  pantColor,
  shoeColor = NEAR_BLACK,
  sx = {},
}) {
  const resolvedPantColor = pantColor ?? DEFAULT_PANT_COLORS[variant] ?? '#2D3748';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
        ...sx,
      }}
    >
      <PeepsAvatar variant={ variant } size={ size } />
      <LegsSvg
        size={ size }
        pantColor={ resolvedPantColor }
        shoeColor={ shoeColor }
      />
    </Box>
  );
}

export { FullBodyAvatar };
export default FullBodyAvatar;
