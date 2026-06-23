import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ProfileAvatar from '../game/ProfileAvatar';

/**
 * ZmathLogo
 *
 * Props:
 * @param {function} onClick - 로고 클릭 핸들러 [Optional]
 *
 * Example usage:
 * <ZmathLogo onClick={() => navigate('home')} />
 */
export function ZmathLogo({ onClick }) {
  return (
    <Typography
      variant="h2"
      onClick={ onClick }
      sx={{
        fontWeight: 900,
        letterSpacing: '-0.04em',
        color: 'text.primary',
        lineHeight: 1,
        userSelect: 'none',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      z<Box component="span" sx={{ color: 'primary.main' }}>Math</Box>
    </Typography>
  );
}

const NAV_ITEMS = ['홈', '초등5', '초등6'];

/**
 * ZmathNavLinks
 *
 * Props:
 * @param {string}   active          - 활성 텍스트 네비 항목 ('홈' | '초등5' | '초등6' | '') [Optional]
 * @param {function} onNavClick      - 텍스트 버튼 클릭 시 label 전달 [Optional]
 * @param {function} onElementary6   - 초등6 전용 핸들러 (onNavClick 대신 사용) [Optional]
 * @param {string}   avatarVariant   - ProfileAvatar variant [Optional, 기본값: 'confident']
 * @param {boolean}  isProfileActive - 아바타 선택 상태 [Optional, 기본값: false]
 * @param {function} onProfileClick  - 아바타 클릭 핸들러 [Optional]
 *
 * Example usage:
 * <ZmathNavLinks active="홈" avatarVariant="confident" isProfileActive={false} onProfileClick={() => navigate('profile')} />
 */
export function ZmathNavLinks({
  active = '',
  onNavClick,
  onElementary6,
  avatarVariant = 'confident',
  isProfileActive = false,
  onProfileClick,
}) {
  const theme = useTheme();

  const handleClick = (label) => {
    if (label === '초등6' && onElementary6) {
      onElementary6();
      return;
    }
    onNavClick?.(label);
  };

  return (
    <Stack direction="row" spacing={ 1 } sx={{ alignItems: 'center' }}>
      { NAV_ITEMS.map((label) => (
        <Button
          key={ label }
          variant={ active === label ? 'contained' : 'text' }
          color="primary"
          size="small"
          onClick={ () => handleClick(label) }
          sx={ active !== label ? {
            boxShadow: 'none',
            border: 'none',
            '&:hover': { boxShadow: 'none', transform: 'none', backgroundColor: 'action.hover' },
          } : {} }
        >
          { label }
        </Button>
      )) }
      <Box
        onClick={ onProfileClick }
        sx={{
          cursor: onProfileClick ? 'pointer' : 'default',
          borderRadius: '50%',
          border: `2.5px solid ${isProfileActive ? theme.palette.primary.main : 'transparent'}`,
          p: '2px',
          transition: 'border-color 0.15s',
        }}
      >
        <ProfileAvatar variant={ avatarVariant } size={ 28 } />
      </Box>
    </Stack>
  );
}
