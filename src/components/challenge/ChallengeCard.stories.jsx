import Grid from '@mui/material/Grid';
import { ChallengeCard } from './ChallengeCard';

export default {
  title: 'Component/3. Card/ChallengeCard',
  component: ChallengeCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    title:           { control: 'text',    description: '챌린지 제목' },
    level:        { control: 'select', options: ['easy', 'medium', 'hard'], description: '난이도 (불꽃 1–3개)' },
    participants: { control: { type: 'number', min: 0 }, description: '참여자 수' },
    correctRate:  { control: { type: 'range', min: 0, max: 100 }, description: '정답률 (0–100)' },
    isAttempted:  { control: 'boolean', description: '내가 도전했는지' },
    isCorrect:    { control: 'boolean', description: '내가 맞혔는지 (CLEAR! / FAILED)' },
    hostName:     { control: 'text',    description: '방장 이름' },
    problem:         { control: 'text',    description: '문제/질문' },
    onClick:         { action: 'clicked' },
  },
};

/** 기본 — 미도전 */
export const Default = {
  args: {
    title: '방정식 마스터 챌린지',
    level: 'medium',
    period: 'D-7 · 6.15–6.22',
    participants: 847,
    correctRate: 23,
    isAttempted: false,
    hostName: '김수학',
    problem: '3x + 5 = 14, x를 구할 수 있나요?',
  },
  render: (args) => <ChallengeCard { ...args } sx={ { maxWidth: 320 } } />,
};

/** 도전 후 — 정답 */
export const Correct = {
  args: {
    ...Default.args,
    isAttempted: true,
    isCorrect: true,
  },
  render: (args) => <ChallengeCard { ...args } sx={ { maxWidth: 320 } } />,
};

/** 도전 후 — 오답 */
export const Attempted = {
  args: {
    ...Default.args,
    isAttempted: true,
    isCorrect: false,
  },
  render: (args) => <ChallengeCard { ...args } sx={ { maxWidth: 320 } } />,
};

/** 난이도별 + 정답률 비교 */
export const Levels = {
  render: () => (
    <Grid container spacing={ 2 }>
      { [
        {
          level: 'easy',
          title: '도형 탐험대',
          period: 'D-3 · 6.19–6.22',
          participants: 1240,
          correctRate: 68,
          hostName: '이도형',
          problem: '삼각형의 세 각의 합은 몇 도일까요?',
          isAttempted: true,
          isCorrect: true,
        },
        {
          level: 'medium',
          title: '방정식 마스터',
          period: 'D-7 · 6.15–6.22',
          participants: 847,
          correctRate: 23,
          hostName: '김수학',
          problem: '3x + 5 = 14, x를 구할 수 있나요?',
          isAttempted: false,
        },
        {
          level: 'hard',
          title: '확률 게임의 신',
          period: 'D-14 · 6.22–7.6',
          participants: 312,
          correctRate: 8,
          hostName: '박확률',
          problem: '동전 3개를 던질 때 모두 앞면일 확률은?',
          isAttempted: false,
        },
      ].map((item) => (
        <Grid key={ item.level } size={ { xs: 12, sm: 4 } }>
          <ChallengeCard { ...item } onClick={ () => {} } />
        </Grid>
      )) }
    </Grid>
  ),
};
