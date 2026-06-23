import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { IconBtn } from './IconBtn';

export default {
  title: 'Component/7. Input & Control/IconBtn',
  component: IconBtn,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'error'],
      description: '색상',
    },
    isActive: { control: 'boolean', description: '활성 상태 (배경 채움)' },
    onClick:  { action: 'clicked' },
  },
};

/** 기본 */
export const Default = {
  args: { size: 'md', color: 'default', isActive: false },
  render: (args) => (
    <IconBtn { ...args }><FavoriteBorderIcon /></IconBtn>
  ),
};

/** 사이즈 3종 */
export const Sizes = {
  render: () => (
    <Stack direction="row" spacing={ 2 } alignItems="center">
      <IconBtn size="sm"><BookmarkBorderIcon /></IconBtn>
      <IconBtn size="md"><BookmarkBorderIcon /></IconBtn>
      <IconBtn size="lg"><BookmarkBorderIcon /></IconBtn>
    </Stack>
  ),
};

/** 색상 + 활성 상태 */
export const Colors = {
  render: () => (
    <Stack spacing={ 2 }>
      <Stack direction="row" spacing={ 2 } alignItems="center">
        <IconBtn color="default"><ShareOutlinedIcon /></IconBtn>
        <IconBtn color="default" isActive><ShareOutlinedIcon /></IconBtn>
      </Stack>
      <Stack direction="row" spacing={ 2 } alignItems="center">
        <IconBtn color="primary"><FavoriteBorderIcon /></IconBtn>
        <IconBtn color="primary" isActive><FavoriteIcon /></IconBtn>
      </Stack>
      <Stack direction="row" spacing={ 2 } alignItems="center">
        <IconBtn color="error"><DeleteOutlineIcon /></IconBtn>
        <IconBtn color="error" isActive><DeleteOutlineIcon /></IconBtn>
      </Stack>
    </Stack>
  ),
};

/** 실사용 패턴 — 카드 액션 툴바 */
export const CardActions = {
  render: () => (
    <Box
      sx={{
        display: 'inline-flex',
        gap: 1,
        p: 1.5,
        border: '1.5px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <IconBtn size="sm"><EditOutlinedIcon /></IconBtn>
      <IconBtn size="sm"><ShareOutlinedIcon /></IconBtn>
      <IconBtn size="sm" color="error"><DeleteOutlineIcon /></IconBtn>
    </Box>
  ),
};
