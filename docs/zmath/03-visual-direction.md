# zMath — Visual Direction

## 톤앤매너

- **키워드**: 대담 / 직관적 / 게임적 / 에너지 / 친근
- **설명**: "수학 교과서"의 딱딱함을 버리고, 게임 UI에 가까운 고대비·고채도의 직접적인 비주얼. Gen-Z에게 익숙한 Neo-Brutalism 감각을 베이스로, 과도한 장식 없이 개념과 인터랙션이 주인공이 되도록 한다.
- **참조 사조**: Neo-Brutalism + Flat Design 혼합
  - Neo-Brutalism: 굵은 offset shadow, 명시적 border, vivid flat 컬러 블록, 캐릭터 일러스트
  - Flat: 복잡한 레이어·그림자 없이 빠르고 명확한 정보 전달
- **레퍼런스**: `docs/reference/neo-brutalism.jpeg`

---

## 컬러 방향

### 기본 원칙

- **순수 #000000 금지** → near-black `#1A1A1A` 사용
- **순수 #FFFFFF 금지** → off-white `#FAFAF5` 사용
- 모든 컬러는 flat fill, 그라데이션 금지

### 팔레트

| 용도 | 토큰 | 값 | 비고 |
|------|------|----|------|
| Primary | `primary.main` | `#0000FF` | 유지 — 강렬한 블루 포인트 |
| Near-black | `palette.nearBlack` | `#1A1A1A` | 텍스트·border·shadow 전용 |
| Off-white | `palette.offWhite` | `#FAFAF5` | 반전 영역 텍스트·배경 |
| Paper | `background.default` | `#FEF3E2` | 크림 — 인쇄 매체 기반 느낌 |
| Surface | `background.paper` | `#F5EDD8` | 카드·패널 배경 |
| Accent Orange | `palette.accent.orange` | `#FF5C2B` | 수와 연산 카테고리, 챌린지 CTA |
| Accent Yellow | `palette.accent.yellow` | `#FFE500` | 함수 카테고리, 랭킹·성공 강조 |
| Accent Mint | `palette.accent.mint` | `#00D4AA` | 도형 카테고리, 정답 피드백 |
| Accent Salmon | `palette.accent.salmon` | `#FF8FA3` | 확률·통계 카테고리, 보조 강조 |
| Success | `success.main` | `#00C853` | 정답 즉각 피드백 |
| Error | `error.main` | MUI 기본 유지 | 오답 피드백 |

### 게임 카테고리 컬러 블록 배정

| 카테고리 | 배경 컬러 | 텍스트 컬러 |
|---------|----------|------------|
| 수와 연산 | `#FF5C2B` | `#1A1A1A` |
| 함수 | `#FFE500` | `#1A1A1A` |
| 도형 | `#00D4AA` | `#1A1A1A` |
| 확률·통계 | `#FF8FA3` | `#1A1A1A` |

> 카드 배경이 vivid 컬러 블록 자체 — 흰 배경 위에 컬러 요소가 아님

---

## 타이포그래피 방향

### 서체 역할 분리

| 역할 | 서체 | 용도 |
|------|------|------|
| Display | Outfit 900 | 히어로 타이틀, 게임 카테고리 대형 레이블 |
| Headline | Outfit 800 | 카드 제목, 섹션 헤더 |
| UI Label | Outfit 700 | 버튼, 태그, 뱃지 — ALL CAPS 전용 |
| Body | Pretendard 400 | 개념 설명, 문제 본문 (한글 전용) |
| Body Strong | Pretendard 700 | 강조 본문, 정답 힌트 |
| Score / Number | Outfit 900 + tabular-nums | 점수, 랭킹 순위, 카운터 |

> **원칙**: Outfit = 숫자·영문·레이블 / Pretendard = 한글 본문. 역할 혼용 금지.

### 크기 스케일 (극단적 대비가 핵심)

| 토큰 | 크기 | weight | 용도 |
|------|------|--------|------|
| `typography.display` | `clamp(3rem, 8vw, 6rem)` | 900 | 히어로 단 1개 |
| `typography.h1` | `clamp(2rem, 5vw, 3.5rem)` | 900 | 페이지 타이틀 |
| `typography.h2` | `1.75rem` | 800 | 섹션 헤더 |
| `typography.h3` | `1.25rem` | 700 | 카드 타이틀 |
| `typography.label` | `0.75rem` | 700 | 태그·뱃지·카테고리 — ALL CAPS |
| `typography.body1` | `1rem` | 400 | 개념 설명, lh 1.7 |
| `typography.body2` | `0.875rem` | 400 | 부가 텍스트 |
| `typography.score` | `clamp(2.5rem, 6vw, 4rem)` | 900 | 점수 숫자 |

> Display ↔ Label 간 8–10배 크기 차이 의도적 유지 — 레퍼런스의 "FREE" vs 체크리스트 텍스트 대비 재현

### 타이포그래피 처리 규칙

```
ALL CAPS 사용처
  ├── 카테고리 탭 레이블
  ├── 난이도 뱃지 (EASY / HARD)
  ├── 버튼 텍스트 (START / RETRY)
  └── 게임 타이틀 이니셜

letter-spacing
  ├── ALL CAPS 텍스트: 0.08em–0.12em
  └── 일반 본문: 0 (건드리지 않음)

텍스트 컬러 규칙
  ├── 기본: #1A1A1A (pure black 금지)
  └── vivid 배경 위: #FAFAF5 (명도 대비 4.5:1 이상 확인)

Offset 인쇄 느낌 (강조 타이틀에만 제한 사용)
  방식: text-shadow로 1–2px 컬러 오프셋
  예: text-shadow: 2px 2px 0 #FF5C2B
  역할: 2도 인쇄물 색판 어긋남 느낌
```

---

## 그래픽 스타일

### 1. Shadow & Border 시스템 (Neo-Brutalism 핵심)

```
카드·버튼 기본
  border: 1.5px solid #1A1A1A
  box-shadow: 4px 4px 0 #1A1A1A

hover 상태
  box-shadow: 6px 6px 0 #1A1A1A
  transform: translate(-1px, -1px)

active/pressed 상태
  box-shadow: 2px 2px 0 #1A1A1A
  transform: translate(2px, 2px)  ← "눌리는 느낌"
```

> MUI elevation shadows 전면 비활성화 후 위 방식으로 대체

### 2. 레트로 인쇄 텍스처 — 3레이어

| 레이어 | 방식 | opacity | 적용 위치 |
|--------|------|---------|----------|
| A — Paper Grain | SVG feTurbulence → CSS background-image | 0.04 | 전체 화면 position: fixed 오버레이 |
| B — Halftone Dot | radial-gradient 반복 패턴 (3px dot / 8px 간격) | 0.05 | 카드 vivid 컬러 블록 내부 |
| C — Color Offset | text-shadow 컬러 오프셋 1–2px | — | 히어로·게임 타이틀에만 제한 사용 |

> 컴포넌트화: `NoiseOverlay` (`components/dynamic-color/NoiseOverlay.jsx`)

### 3. Open Peeps 일러스트 시스템

```
패키지: npm 설치 전 패키지명 확인 필요

스타일 규칙
  ├── stroke: 2px, #1A1A1A
  ├── fill: 카테고리 컬러 또는 #FAFAF5 (2색 제한)
  └── 배경: 항상 투명

배치 규칙
  ├── 위치: 카드 우하단 고정
  ├── 크기: 카드 높이의 70–80%
  ├── overflow: visible 허용 — 카드 경계 밖으로 삐져나오게
  └── 중앙 배치 금지 (텍스트 영역과 분리)

상황별 포즈 매핑
  ├── 게임 카드: 호기심 포즈 (가리키기, 손짓)
  ├── 챌린지 카드: 집중 포즈 (노트, 생각)
  ├── 챌린지 클리어: 환호 포즈 (두 손 들기)
  └── 랭킹 1위: 자신감 포즈 (팔짱)
```

> 컴포넌트화: `PeepsAvatar` (`components/game/PeepsAvatar.jsx`)

### 4. 수학 개념 시각화 그래픽 스타일

교과서 다이어그램을 Neo-Brutalism으로 리디자인하는 원칙.

```
선 처리
  ├── 기본 선: 2–3px stroke, #1A1A1A
  └── 보조선: 1px dashed, #8A8A8A

면 처리
  ├── 도형 면: 카테고리 컬러 flat fill (그라데이션 금지)
  └── 강조 면: #FFE500

좌표계·수직선
  ├── 축: 2.5px solid #1A1A1A, 화살표 캡
  ├── 눈금: 1.5px / 레이블 Outfit 700
  └── 원점·교점: r=5px, fill #FAFAF5, stroke 2px #1A1A1A

인터랙션 대상 요소 (드래그·클릭 가능한 것)
  ├── 기본: 카테고리 컬러 fill + 1.5px border + 4px 4px 0 #1A1A1A shadow
  └── pressed: shadow 2px 2px + translate(2px, 2px) — 눌리는 피드백
```

### 5. 아이콘 스타일

| 항목 | 규칙 |
|------|------|
| 우선 사용 | pixelarticons (stroke 기반, Neo-Brutalism과 자연스럽게 매칭) |
| MUI icons | filled 스타일 가급적 배제 |
| 크기 | 일반 UI 20–24px / 카드 강조 32px / 게임 컨트롤 28px |
| 컬러 | 기본 `#1A1A1A` / vivid 배경 위 `#FAFAF5` |

---

## 간격 및 레이아웃

- **spacing 기본 단위**: 8px (MUI 기본 유지)
- **주요 레이아웃 패턴**:
  - 홈: Single Column + BentoGrid (게임 카드 그리드)
  - 게임 플레이: Full-bleed 게임 캔버스 + 하단 컨트롤 바
  - 챌린지: Single Column + 상단 진행률 고정
  - 랭킹: Single Column + 테이블
- **반응형 전략**:
  - Mobile First, 터치 타겟 min 44px
  - 브레이크포인트: MUI 기본 (xs/sm/md/lg)
  - 게임 캔버스: `aspect-ratio: 4/3` 고정, 모바일 `1/1` 전환

---

## Border Radius 방향

| 영역 | 값 | 근거 |
|------|-----|------|
| 기본 (shape) | `8px` | 레퍼런스 이미지 수준의 캐주얼 rounding |
| 게임 인터랙션 요소 | `8px` | 조작 대상임을 인지 |
| 버튼 | `6px` | 살짝 더 날카롭게 |
| 달성 뱃지·태그 | `999px` (pill) | 제한적으로만 허용 |

> 현재 테마 `borderRadius: 0`에서 `8`로 변경 필요

---

## 변경 필요 토큰 요약

| 토큰 경로 | 현재값 | 변경값 | 적용 대상 |
|-----------|--------|--------|----------|
| `palette.primary.main` | `#0000FF` | 유지 | — |
| `palette.secondary.main` | `#263238` | 유지 | — |
| `palette.nearBlack` | 없음 | `#1A1A1A` 신규 | 텍스트·border·shadow |
| `palette.offWhite` | 없음 | `#FAFAF5` 신규 | 반전 영역 |
| `palette.accent.orange` | 없음 | `#FF5C2B` 신규 | 수와 연산 카드, 챌린지 CTA |
| `palette.accent.yellow` | 없음 | `#FFE500` 신규 | 함수 카드, 성공·랭킹 |
| `palette.accent.mint` | 없음 | `#00D4AA` 신규 | 도형 카드, 정답 피드백 |
| `palette.accent.salmon` | 없음 | `#FF8FA3` 신규 | 확률·통계 카드 |
| `palette.success.main` | MUI 기본 | `#00C853` | 정답 피드백 |
| `background.default` | `#FFFFFF` | `#FEF3E2` | 전체 배경 (크림) |
| `background.paper` | `#FFFFFF` | `#F5EDD8` | 카드·패널 |
| `shape.borderRadius` | `0` | `8` | 전체 컴포넌트 |
| `typography.h1.fontSize` | 고정값 | `clamp(2rem, 5vw, 3.5rem)` | 페이지 타이틀 |
| `typography.h2.fontWeight` | 기본 | `800` | 섹션 헤더 |
| `typography.caption.fontWeight` | 기본 | `700` | 태그·레이블 |
| shadows (전체) | 기본 MUI | `4px 4px 0 #1A1A1A` 방식으로 교체 | 카드·버튼 |
