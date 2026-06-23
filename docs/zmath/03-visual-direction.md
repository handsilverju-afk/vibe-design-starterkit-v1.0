# zMath — Visual Direction

## 톤앤매너

- **키워드**: 친근 / 생동감 / 직관적 / 게임적 / 따뜻함
- **설명**: 레퍼런스(`docs/reference/neo-brutalism.jpeg`)의 실제 느낌은 "aggressive Neo-Brutalism"이 아닌 **Friendly Colorful UI** — 둥글고 생동감 있는 비비드 컬러, Open Peeps 캐릭터, 깔끔한 화이트 카드가 베이스다. 두꺼운 offset shadow나 heavy border 대신, 오프화이트 배경 위에 pill 버튼·컬러 블록 카드·캐릭터 일러스트로 Gen-Z의 감각을 구현한다.
- **참조 사조**: Friendly Neo-Brutalism (Soft variant)
  - 비비드 컬러 블록 + 캐릭터 일러스트 = Neo-Brutalism 핵심 DNA 유지
  - 두꺼운 border / heavy offset shadow 제거 → 부드럽고 접근 가능한 느낌
- **레퍼런스**: `docs/reference/neo-brutalism.jpeg`

---

## 컬러 방향

### 기본 원칙

- **순수 #000000 금지** → near-black `#004638`
- **순수 #FFFFFF 금지** → off-white `#FAFAF5`
- flat fill 원칙 유지 (그라데이션 금지)
- 배경은 오프화이트(`#FAFAF5`) — 핑크/살몬 금지

### 팔레트

| 용도 | 토큰 | 값 | 비고 |
|------|------|----|------|
| Primary | `primary.main` | `#FC5B31` | 브랜드 오렌지 — CTA, 버튼, 포커스 링 |
| Near-black | `palette.zmath.nearBlack` | `#004638` | 텍스트·아이콘 전용 |
| Off-white | `palette.zmath.offWhite` | `#FAFAF5` | 반전 텍스트·버튼 레이블 |
| Background | `background.default` | `#FAFAF5` | 오프화이트 — 핑크 아님 |
| Paper | `background.paper` | `#FFFFFF` | 카드 배경 (화이트) |
| Surface Alt | `palette.zmath.surfaceAlt` | `#FFE8EE` | 포커스 카드·패널 배경 |
| Accent Orange | `palette.zmath.accent.orange` | `#FC5B31` | 수와 연산 카드, 챌린지 CTA |
| Accent Yellow | `palette.zmath.accent.yellow` | `#DDED59` | 함수 카드, 랭킹·성공 강조 |
| Accent Mint | `palette.zmath.accent.mint` | `#B6FCBE` | 도형 카드, 정답 피드백 |
| Accent Salmon | `palette.zmath.accent.salmon` | `#D199FA` | 확률·통계 카드, 보조 강조 |
| Success | `success.main` | `#00C853` | 정답 즉각 피드백 |
| Error | `error.main` | MUI 기본 | 오답 피드백 |

### 게임 카테고리 컬러 블록 배정

| 카테고리 | 배경 컬러 | 텍스트 컬러 |
|---------|----------|------------|
| 수와 연산 | `#FC5B31` | `#FAFAF5` (off-white) |
| 함수 | `#DDED59` | `#FAFAF5` (off-white) |
| 도형 | `#B6FCBE` | `#FAFAF5` (off-white) |
| 확률·통계 | `#D199FA` | `#FAFAF5` (off-white) |

> 배경색이 하이라이트(카테고리 컬러)일 때 텍스트는 항상 `offWhite(#FAFAF5)` — 컬러 무관 일관 적용

---

## 타이포그래피 방향

### 서체 역할 분리

| 역할 | 서체 | 용도 |
|------|------|------|
| Display | Outfit 900 | 히어로 타이틀 (단 1개) |
| Headline | Outfit 800 | 카드 제목, 섹션 헤더 |
| UI Label | Outfit 600 | 버튼, 태그 — Sentence case 기본, ALL CAPS는 badge만 |
| Body | Pretendard 400 | 개념 설명, 문제 본문 |
| Body Strong | Pretendard 700 | 강조 본문, 정답 힌트 |
| Score / Number | Outfit 900 + tabular-nums | 점수, 랭킹, 카운터 |

> ALL CAPS는 난이도 뱃지(EASY/HARD)에만 제한. 버튼은 Sentence case 사용 (레퍼런스 참조).

### 크기 스케일

| 토큰 | 크기 | weight | 용도 |
|------|------|--------|------|
| `h1` | `clamp(2rem, 5vw, 3.5rem)` | 900 | 페이지 타이틀 |
| `h2` | `1.75rem` | 800 | 섹션 헤더 |
| `h3` | `1.25rem` | 700 | 카드 타이틀 |
| `body1` | `1rem / lh 1.7` | 400 | 본문 |
| `body2` | `0.875rem` | 400 | 부가 텍스트 |
| `caption` | `0.75rem` | 600 | 태그·뱃지 레이블 |
| `button` | `0.875rem` | 600 | 버튼 — Sentence case |
| Score | `clamp(2.5rem, 6vw, 4rem)` | 900 | 점수 숫자 |

### 타이포그래피 처리 규칙

```
ALL CAPS 허용 위치 (제한적)
  ├── 난이도 뱃지: EASY / MEDIUM / HARD
  └── 카테고리 overline 레이블

letter-spacing
  ├── ALL CAPS 항목: 0.06em
  └── 일반 텍스트: 0 (건드리지 않음)

텍스트 컬러
  ├── 기본: #004638
  ├── Orange(#FC5B31) 배경 위: #FAFAF5 (명도 대비 확보)
  └── Yellow(#DDED59) / Mint(#B6FCBE) / Salmon(#D199FA) 위: #004638
```

---

## ConceptGameCard 디자인 스펙

### 카드 인터랙션 원칙

- **카드 자체가 CTA** — 텍스트 버튼(Play, 참여하기 등) 없음. 카드 전체 클릭으로 진입
- **좋아요 아이콘 버튼만 허용** — Heart 아이콘 토글. `onLike` + `e.stopPropagation()`으로 카드 클릭과 분리

### 메타데이터 행 (공통)

카드 하단에 3가지 인게이지먼트 데이터를 표시:

| 항목 | 아이콘 | 포맷 |
|------|--------|------|
| 조회수 | 👁 (VisibilityOutlined) | `1.2k` |
| 좋아요 | ♥ (FavoriteBorder / Favorite) | `48` |
| 마지막 플레이 | 🕐 (AccessTimeOutlined) | `오늘 14:30` / `어제` / `N일 전` |

### 카드 구조 (단일 타입)

```
카드 배경: background.paper (흰색)

┌─────────────────────────────┐  ← 흰색 카드 (nearBlack 1.5px 보더, 3px offset shadow)
│ ┌── 썸네일 (inset, p:2) ──┐ │
│ │  bg: 카테고리 컬러       │ │  ← nearBlack 1.5px 보더, 12px radius
│ │  좌측: 개념 일러스트     │ │
│ │  우측: PeepsAvatar      │ │
│ └──────────────────────────┘ │
│                               │
│ 카테고리   난이도 Chip        │
│ 개념 제목 (h3)                │
│ 설명 (body2, 2줄)             │
│ ───────────────────────────  │
│ [아바타] @userId    (참여 시) │
│ 👁 views  ♥ likes  🕐 time  │
└─────────────────────────────┘
```

### PeepsAvatar 사용 범위

- **유저 프로필 전용** — `isPlayed` 섹션에만 사용 (size 22–28)
- **개념 썸네일 사용 금지** — 사람 캐릭터는 수학 개념 시각화에 부적합

### 썸네일 일러스트 매핑 (conceptKey 기준)

카테고리가 아닌 **개념(conceptKey)** 단위 1:1 매핑.
수학 그래프/공식이 아닌 **실생활 오브젝트** — 개념을 일상 경험으로 먼저 이해시키는 이미지.

| conceptKey | 실생활 오브젝트 | 개념 연결 | 카테고리 |
|---|---|---|---|
| `gcd-lcm` | 초콜릿 바 (4×3 격자) | 약수 = 조각 나누기 방법 수 | arithmetic |
| `fraction-add` | 피자 (6등분 원, 일부 슬라이스 강조) | 분수 = 전체 중 몇 조각 | arithmetic |
| `linear-fn` | 계단 (일정한 rise/run 반복) | 기울기 = 일정한 오르막 비율 | function |
| `quadratic-fn` | 농구공 던지기 (공 + 포물선 궤적 + 골대) | 포물선 = 공이 그리는 곡선 | function |
| `triangle-area` | 집 지붕 (삼각형 지붕 + 직사각형 벽) | 삼각형 = 지붕 단면 | geometry |
| `mean` | 시소 (균형 잡힌 받침점 + 양쪽 무게) | 평균 = 균형점 | statistics |

없는 key → 카테고리 fallback 일러스트.

일러스트 스타일 원칙 (PeepsAvatar 동일 톤)
  - **실사 아님** — 현실 오브젝트를 기하학적으로 단순화한 flat 선화
  - stroke: 2–2.5px, nearBlack(#004638) 고정 — 배경색 무관
  - fill: 반투명 1–2색 (outline 색 + 15~30% opacity)
  - 크기: 썸네일 중앙 70–80% 차지, flexbox center 배치

### 유저 참여 표시

`isPlayed = true`일 때 콘텐츠 영역 하단에 조건부 렌더:

```
[PeepsAvatar size=22]  @userId     (userAvatarVariant, userId props)
```

---

## 그래픽 스타일

### 1. Shadow & Border 시스템

레퍼런스 이미지 분석 결과: heavy offset shadow가 아닌 **subtle elevation + 가벼운 border**.

```
카드 기본
  border: 1.5px solid #004638
  box-shadow: 3px 3px 0 #004638  ← neo-brutalism offset

카드 hover
  box-shadow: 4px 4px 0 #004638
  transform: translate(-1px, -1px)

버튼 기본 (pill 형태)
  border: 1.5px solid #004638
  box-shadow: 2px 2px 0 #004638  ← offset은 버튼에만 적용

버튼 hover
  box-shadow: 3px 3px 0 #004638
  transform: translate(-1px, -1px)

버튼 active/pressed
  box-shadow: none
  transform: translate(2px, 2px)
```

> 카드는 subtle elevation, 버튼에만 경량 offset shadow 적용.

### 2. Border Radius

| 영역 | 값 | 근거 |
|------|-----|------|
| 카드 (기본) | `16px` | 레퍼런스 이미지 측정값 |
| 버튼 | `999px` (pill) | 레퍼런스 "Follow" / "Love button" 캡슐형 |
| Input, Select | `12px` | |
| 뱃지·태그 | `999px` (pill) | 레퍼런스 chip/tag 형태 |
| 게임 인터랙션 요소 | `8px` | 조작 요소는 약간 날카롭게 |

### 3. Open Peeps 일러스트 시스템

```
패키지: @dicebear/core + @dicebear/open-peeps (설치 완료)
컴포넌트: PeepsAvatar (components/game/PeepsAvatar.jsx)

배경 처리
  └── SVG 내 white rect를 transparent로 교체 → 카드 배경색 위에 자연스럽게 표시

배치 규칙
  ├── 카드 우하단: position absolute, bottom/right 고정
  ├── 카드 높이의 60–75% 크기
  ├── overflow visible 허용 (카드 경계 밖으로 일부 삐져나오기)
  └── 카드 텍스트 영역과 겹치지 않도록 분리

variant 매핑
  ├── curious    → 게임 카드 (호기심·가리키기)
  ├── focused    → 챌린지 카드 (집중·생각)
  ├── celebrating → 클리어 피드백 (환호)
  └── confident  → 랭킹 1위 (자신감)
```

### 4. 수학 개념 시각화 그래픽 스타일

```
선 처리
  ├── 기본 선: 2px stroke, #004638
  └── 보조선: 1px dashed, rgba(26,26,26,0.4)

면 처리
  ├── 도형 면: 카테고리 컬러 flat fill
  └── 강조 면: #DDED59

좌표계·수직선
  ├── 축: 2px solid #004638
  ├── 눈금: 1px / Outfit 700 레이블
  └── 원점·교점: r=5px fill #FAFAF5, stroke 2px #004638

인터랙션 요소 (드래그·클릭)
  ├── 기본: 카테고리 컬러 fill + 1px border + 2px 2px 0 #004638
  └── pressed: translateY(2px) 피드백
```

### 5. 아이콘

| 항목 | 규칙 |
|------|------|
| 우선 사용 | pixelarticons (stroke 기반) |
| 크기 | 일반 20–24px / 카드 강조 28px |
| 컬러 | `#004638` 기본 / 비비드 배경 위 `#FAFAF5` |

---

## 레트로 인쇄 텍스처

| 레이어 | 방식 | opacity | 위치 |
|--------|------|---------|------|
| Paper Grain | SVG feTurbulence 노이즈 | 0.03 | 전체 화면 fixed 오버레이 |
| Color Offset | text-shadow 1–2px 컬러 오프셋 | — | 히어로 타이틀에만 |

---

## 확정 토큰 목록

| 토큰 경로 | 값 | 적용 대상 |
|-----------|-----|----------|
| `background.default` | `#FAFAF5` | 전체 배경 (오프화이트) |
| `background.paper` | `#FFFFFF` | 카드 배경 |
| `palette.zmath.nearBlack` | `#004638` | 텍스트·border·shadow |
| `palette.zmath.offWhite` | `#FAFAF5` | 반전 영역 |
| `palette.zmath.surfaceAlt` | `#FFE8EE` | 포커스 패널 |
| `palette.zmath.accent.orange` | `#FC5B31` | 수와 연산 카드, 챌린지 CTA |
| `palette.zmath.accent.yellow` | `#DDED59` | 함수 카드, 성공·랭킹 |
| `palette.zmath.accent.mint` | `#B6FCBE` | 도형 카드, 정답 피드백 |
| `palette.zmath.accent.salmon` | `#D199FA` | 확률·통계 카드 |
| `palette.success.main` | `#00C853` | 정답 피드백 |
| `palette.primary.main` | `#FC5B31` | 브랜드 오렌지 |
| `shape.borderRadius` | `16` | 카드 기본 radius |
| `MuiButton.borderRadius` | `999` | pill 버튼 |
| `MuiButton.boxShadow` | `2px 2px 0 #004638` | 버튼 경량 offset |
| `MuiCard.boxShadow` | `0 2px 8px rgba(26,26,26,0.08)` | 카드 subtle elevation |
| `MuiCard.border` | `1px solid rgba(26,26,26,0.1)` | 카드 연한 테두리 |
| `typography.button.textTransform` | `none` | Sentence case |
