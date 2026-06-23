import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import { useTheme, alpha } from '@mui/material/styles';

/**
 * CardContainer 컴포넌트
 *
 * 자주 사용되는 카드 스타일을 미리 정의한 래퍼 컴포넌트.
 * outlined, elevation, ghost, filled 변형을 지원한다.
 * 기본 border, shadow, borderRadius는 MuiCard 테마 오버라이드가 처리한다.
 *
 * Props:
 * @param {string} variant - 카드 스타일 ('outlined' | 'elevation' | 'ghost' | 'filled') [Optional, 기본값: 'outlined']
 * @param {string} padding - 내부 패딩 ('none' | 'sm' | 'md' | 'lg') [Optional, 기본값: 'md']
 * @param {boolean} isInteractive - 호버 효과 활성화 [Optional, 기본값: false]
 * @param {boolean} isSelected - 선택 상태 표시 [Optional, 기본값: false]
 * @param {function} onClick - 클릭 핸들러 [Optional]
 * @param {node} children - 카드 내용 [Required]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <CardContainer variant="elevation" padding="lg" isInteractive>
 *   <Typography>Card Content</Typography>
 * </CardContainer>
 */
const CardContainer = forwardRef(function CardContainer({
  variant = 'outlined',
  padding = 'md',
  isInteractive = false,
  isSelected = false,
  onClick,
  children,
  sx,
  ...props
}, ref) {
  const theme = useTheme();

  const paddingMap = {
    none: 0,
    sm: 2,
    md: 3,
    lg: 4,
  };

  // ghost, filled는 MuiCard 오버라이드를 sx로 덮어씀
  const getVariantStyles = () => {
    switch (variant) {
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none', transform: 'none' },
        };
      case 'filled':
        return {
          backgroundColor: 'grey.100',
          border: 'none',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none', transform: 'none' },
        };
      default:
        return {};
    }
  };

  const getInteractiveStyles = () => {
    if (!isInteractive && !onClick) return {};
    return {
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        borderColor: 'primary.main',
        boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    };
  };

  const getSelectedStyles = () => {
    if (!isSelected) return {};
    return {
      borderColor: 'primary.main',
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.3)}`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: theme.palette.primary.main,
      },
    };
  };

  return (
    <Card
      ref={ref}
      variant={variant === 'elevation' ? 'elevation' : 'outlined'}
      onClick={onClick}
      sx={{
        p: paddingMap[padding] ?? paddingMap.md,
        ...getVariantStyles(),
        ...getInteractiveStyles(),
        ...getSelectedStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
});

export { CardContainer };
