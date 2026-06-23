import Box from '@mui/material/Box';
import PeepsAvatar from './PeepsAvatar';

/**
 * ProfileAvatar 컴포넌트
 *
 * 원형 클립된 PeepsAvatar 프로필 이미지.
 * 유저 프로필 표시 전용 — 게임 캐릭터 썸네일과 구분.
 *
 * Props:
 * @param {string} variant - PeepsAvatar variant ('curious'|'focused'|'celebrating'|'confident') [Optional, 기본값: 'curious']
 * @param {number} size - 지름(px) [Optional, 기본값: 36]
 * @param {string} ringColor - 외곽 링 색상 (hex/css) [Optional]
 * @param {number} ringWidth - 링 두께(px) [Optional, 기본값: 2]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <ProfileAvatar variant="confident" size={28} ringColor="#FF5533" />
 * <ProfileAvatar variant="curious" size={40} />
 */
function ProfileAvatar({
  variant = 'curious',
  size = 36,
  ringColor,
  ringWidth = 2,
  sx = {},
}) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        border: ringColor ? `${ringWidth}px solid ${ringColor}` : 'none',
        backgroundColor: 'grey.100',
        ...sx,
      }}
    >
      <PeepsAvatar variant={variant} size={size} />
    </Box>
  );
}

export { ProfileAvatar };
export default ProfileAvatar;
