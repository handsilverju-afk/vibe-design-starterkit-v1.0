import { forwardRef } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import { useTheme } from '@mui/material/styles';

/**
 * IconBtn 컴포넌트
 *
 * 아웃라인 + 아이콘만 있는 버튼.
 * pill 버튼과 달리 정사각형 + 8px radius.
 * zMath neo-brutalism: nearBlack 1.5px 보더 + offset shadow.
 *
 * Props:
 * @param {node} children - 아이콘 노드 [Required]
 * @param {string} size - 버튼 크기 ('sm'|'md'|'lg') [Optional, 기본값: 'md']
 * @param {string} color - 색상 ('default'|'primary'|'error') [Optional, 기본값: 'default']
 * @param {boolean} isActive - 활성 상태 (배경 채움) [Optional, 기본값: false]
 * @param {string} activeColor - 활성 시 배경색 [Optional]
 * @param {function} onClick - 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <IconBtn><FavoriteBorderIcon /></IconBtn>
 * <IconBtn size="sm" color="error" isActive><FavoriteIcon /></IconBtn>
 */
const IconBtn = forwardRef(function IconBtn({
  children,
  size = 'md',
  color = 'default',
  isActive = false,
  activeColor,
  onClick,
  sx,
  ...props
}, ref) {
  const theme = useTheme();
  const { zmath } = theme.palette;

  const SIZE_MAP = {
    sm: { box: 28, iconFontSize: '1rem',    radius: 999 },
    md: { box: 36, iconFontSize: '1.25rem', radius: 999 },
    lg: { box: 44, iconFontSize: '1.5rem',  radius: 999 },
  };

  const COLOR_MAP = {
    default: { border: zmath.nearBlack, icon: zmath.nearBlack, activeBg: `${zmath.nearBlack}18` },
    primary: { border: theme.palette.primary.main, icon: theme.palette.primary.main, activeBg: `${theme.palette.primary.main}18` },
    error:   { border: theme.palette.error.main,   icon: theme.palette.error.main,   activeBg: `${theme.palette.error.main}18` },
  };

  const s = SIZE_MAP[size] ?? SIZE_MAP.md;
  const c = COLOR_MAP[color] ?? COLOR_MAP.default;
  const bg = isActive ? (activeColor ?? c.activeBg) : 'transparent';

  return (
    <ButtonBase
      ref={ref}
      onClick={onClick}
      sx={{
        width: s.box,
        height: s.box,
        borderRadius: `${s.radius}px`,
        border: `1.5px solid ${c.border}`,
        boxShadow: `2px 2px 0 0 ${zmath.nearBlack}`,
        backgroundColor: bg,
        color: isActive ? c.icon : c.icon,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
        '& svg': { fontSize: s.iconFontSize },
        '&:hover': {
          boxShadow: `3px 3px 0 0 ${zmath.nearBlack}`,
          transform: 'translate(-1px, -1px)',
          backgroundColor: c.activeBg,
        },
        '&:active': {
          boxShadow: 'none',
          transform: 'translate(2px, 2px)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </ButtonBase>
  );
});

export { IconBtn };
export default IconBtn;
