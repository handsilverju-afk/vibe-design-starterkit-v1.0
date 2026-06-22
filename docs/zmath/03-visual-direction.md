# zMath — Visual Direction

## 톤앤매너

- **키워드**: 대담 / 직관적 / 게임적 / 에너지 / 친근
- **설명**: "수학 교과서"의 딱딱함을 버리고, 게임 UI에 가까운 고대비·고채도의 직접적인 비주얼. Gen-Z에게 익숙한 Neubrutalism 감각을 베이스로, 과도한 장식 없이 개념과 인터랙션이 주인공이 되도록 한다.
- **참조 사조**: Neubrutalism + Flat Design 혼합
  - Neubrutalism: 굵은 stroke, 강한 대비, 즉각적 피드백감
  - Flat: 복잡한 레이어·그림자 없이 빠르고 명확한 정보 전달

---

## 컬러 방향

| 용도 | 현재 토큰 | 현재값 | 변경 방향 | 근거 |
|------|----------|--------|----------|------|
| Primary | `primary.main` | `#0000FF` | **유지** | 강렬한 블루 = 수학의 확신감, Gen-Z 직관적 포인트 컬러 |
| Secondary | `secondary.main` | `#263238` (blueGrey[900]) | **유지** | 진한 중성 = 배경 텍스트·UI 구조에 안정감 |
| Accent (신규) | `palette.accent.main` | — | `#FFE500` (선명 노랑) | 게임 성공 피드백, 챌린지 클리어, 랭킹 1위 강조 |
| Background | `background.default` | `#FFFFFF` | **유지** | 게임 인터랙션 요소가 배경 위에서 명확히 보임 |
| Surface | `background.paper` | — | `#F5F5F5` (grey[100]) | 카드·게임 패널 영역 구분 |
| Success | `success.main` | MUI 기본 | `#00C853` (Green A700) | 정답 피드백 — 즉각적이고 선명하게 |
| Error | `error.main` | MUI 기본 | **유지** | 오답 피드백 — MUI 기본으로 충분 |

> **Accent 토큰 추가 방법**: `createTheme`의 `palette`에 custom 키로 추가하고 MUI 타입 augmentation 적용

---

## 타이포그래피 방향

| 요소 | 현재 설정 | 변경 방향 | 근거 |
|------|----------|----------|------|
| h1 | Outfit 900 | **유지** + `fontSize: clamp(2.5rem, 6vw, 5rem)` | 히어로 타이틀 — 크고 대담하게, 반응형 조정 |
| h2 | Outfit | **유지** + `fontWeight: 800` | 섹션 헤더 충분한 존재감 |
| h3 | Outfit | **유지** | 카드 타이틀 |
| body1 | Pretendard Variable | **유지** | 개념 설명·문제 본문 — 가독성 우선 |
| body2 | Pretendard Variable | **유지** | 부가 설명·레이블 |
| caption | Pretendard Variable | `fontWeight: 600` | 난이도·카테고리 태그 — 선명하게 |
| **게임 숫자 (신규)** | — | Outfit + `fontVariantNumeric: 'tabular-nums'` | 점수·랭킹 숫자 정렬 일관성 |

---

## 간격 및 레이아웃

- **spacing 기본 단위**: 8px (MUI 기본, 유지)
- **주요 레이아웃 패턴**:
  - 홈: Single Column + BentoGrid (게임 카드 그리드)
  - 게임 플레이: Full-bleed 게임 캔버스 + 하단 컨트롤 바
  - 챌린지: Single Column + 상단 진행률 고정
  - 랭킹: Single Column + 테이블
- **반응형 전략**:
  - Mobile First: 게임 인터랙션은 터치 기준으로 설계 (버튼 min 44px)
  - 브레이크포인트: MUI 기본 (xs/sm/md/lg) 사용
  - 게임 캔버스: `aspect-ratio: 4/3` 고정, 모바일에서 `1/1`로 전환

---

## Border Radius 방향

| 영역 | 현재값 | 변경값 | 근거 |
|------|--------|--------|------|
| 기본 (shape) | `0` | **유지** | Neubrutalism 날카로움 유지 |
| 게임 인터랙션 요소 | — | `borderRadius: 4px` | 드래그·클릭 대상은 소프트하게 — 조작 대상임을 인지 |
| 챌린지 피드백 뱃지 | — | `borderRadius: 999px` (pill) | 달성 뱃지·태그에만 제한적으로 허용 |

---

## 레퍼런스

| # | 레퍼런스 | 참고 포인트 |
|---|---------|------------|
| 1 | *(사용자 제공 예정)* | — |

> 레퍼런스 이미지/사이트는 사용자가 제공하면 추가합니다.

---

## 변경 필요 토큰 요약

| 토큰 경로 | 현재값 | 변경값 | 적용 대상 |
|-----------|--------|--------|----------|
| `palette.primary.main` | `#0000FF` | **유지** | 전체 primary 요소 |
| `palette.secondary.main` | `#263238` | **유지** | 텍스트·구조 요소 |
| `palette.accent.main` | 없음 | `#FFE500` | 신규 추가 — 게임 성공·챌린지 클리어·랭킹 1위 |
| `palette.background.paper` | `#FFFFFF` | `#F5F5F5` | 카드·게임 패널 배경 |
| `palette.success.main` | MUI 기본 | `#00C853` | 정답 피드백 |
| `typography.h1.fontSize` | 고정값 | `clamp(2.5rem, 6vw, 5rem)` | 히어로 반응형 타이틀 |
| `typography.h2.fontWeight` | 기본 | `800` | 섹션 헤더 |
| `typography.caption.fontWeight` | 기본 | `600` | 태그·레이블 |
