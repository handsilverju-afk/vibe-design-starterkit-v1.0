/**
 * MathConceptIllustration — Fill + 블랙 라인 일러스트
 *
 * strokeColor: 주 도형 fill
 * decoColor:   보조 도형 fill
 * shadowColor: 그림자와 동일한 블랙계열 라인 색상 (기본 #004638)
 */
export function MathConceptIllustration({
  conceptKey,
  strokeColor = '#C7DDDB',
  decoColor = '#FAFAF5',
  shadowColor = '#004638',
  size = 100,
  category = 'arithmetic',
}) {
  const c  = strokeColor;
  const d  = decoColor;
  const s  = shadowColor;
  const sw = 2;
  const sw2 = 1.5;

  const ILLUSTRATIONS = {

    // ── 레고 쌓기 (약수와 배수) ─────────────────────
    'gcd-lcm': (
      <svg width={size} height={size} viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
        {/* 지면 플레이트 */}
        <rect x="4" y="84" width="112" height="9" rx="4" fill={d} stroke={s} strokeWidth={sw} />
        {[14,28,42,56,70,84,98,110].map(cx => (
          <ellipse key={cx} cx={cx} cy="84" rx="3.8" ry="2.4" fill={d} stroke={s} strokeWidth={1.2} />
        ))}
        {/* Tower A — 3브릭 */}
        {[0,1,2].map(i => {
          const by = 80 - i * 16;
          const f = i % 2 === 0 ? '#B6FCBE' : d;
          return (
            <g key={`a${i}`}>
              <rect x="8" y={by} width="30" height="13" rx="3" fill={f} stroke={s} strokeWidth={sw} />
              {[19, 30].map(cx => (
                <ellipse key={cx} cx={cx} cy={by} rx="3.5" ry="2.2" fill={f} stroke={s} strokeWidth={1.2} />
              ))}
            </g>
          );
        })}
        {/* Tower B — 5브릭 */}
        {[0,1,2,3,4].map(i => {
          const by = 80 - i * 14;
          const f = i % 2 === 0 ? d : '#B6FCBE';
          return (
            <g key={`b${i}`}>
              <rect x="46" y={by} width="28" height="11" rx="3" fill={f} stroke={s} strokeWidth={sw} />
              {[57, 67].map(cx => (
                <ellipse key={cx} cx={cx} cy={by} rx="3" ry="2" fill={f} stroke={s} strokeWidth={1.2} />
              ))}
            </g>
          );
        })}
        {/* Tower C — 4브릭 */}
        {[0,1,2,3].map(i => {
          const by = 80 - i * 16;
          const f = i % 2 === 0 ? '#B6FCBE' : d;
          return (
            <g key={`c${i}`}>
              <rect x="82" y={by} width="30" height="13" rx="3" fill={f} stroke={s} strokeWidth={sw} />
              {[93, 104].map(cx => (
                <ellipse key={cx} cx={cx} cy={by} rx="3.5" ry="2.2" fill={f} stroke={s} strokeWidth={1.2} />
              ))}
            </g>
          );
        })}
      </svg>
    ),

    // ── 피자 (분수의 덧셈) ──────────────────────────
    'fraction-add': (
      <svg width={size} height={size} viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
        <circle cx="60" cy="50" r="42" fill={d} stroke={s} strokeWidth={sw} />
        <path d="M 60 50 L 102 50 A 42 42 0 0 1 81 86.4 Z"
          fill={c} stroke={s} strokeWidth={sw2} strokeLinejoin="round" />
        <path d="M 60 50 L 81 86.4 A 42 42 0 0 1 39 86.4 Z"
          fill={c} stroke={s} strokeWidth={sw2} strokeLinejoin="round" />
        {[0, 60, 120, 180, 240, 300].map(deg => {
          const rad = (deg * Math.PI) / 180;
          const x2 = (60 + 42 * Math.cos(rad)).toFixed(1);
          const y2 = (50 + 42 * Math.sin(rad)).toFixed(1);
          return <line key={deg} x1="60" y1="50" x2={x2} y2={y2} stroke={s} strokeWidth={sw2} />;
        })}
        <circle cx="77" cy="63" r="4" fill="#B6FCBE" stroke={s} strokeWidth={sw2} />
        <circle cx="62" cy="74" r="4" fill="#B6FCBE" stroke={s} strokeWidth={sw2} />
        <circle cx="50" cy="65" r="3.5" fill="#B6FCBE" stroke={s} strokeWidth={sw2} />
        <circle cx="60" cy="50" r="6" fill={d} stroke={s} strokeWidth={sw2} />
      </svg>
    ),

    // ── 초콜릿 바 (분수의 뺄셈) ────────────────────
    'fraction-sub': (
      <svg width={size} height={size} viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
        {/* 남은 초콜릿 판 (3×2) */}
        <rect x="6" y="18" width="72" height="60" rx="9" fill={d} stroke={s} strokeWidth={sw} />
        {[12,34,56].map(x => (
          <rect key={x} x={x} y="24" width="20" height="20" rx="4" fill="#FC5B31" stroke={s} strokeWidth={sw2} />
        ))}
        {[12,34,56].map(x => (
          <rect key={`r2-${x}`} x={x} y="49" width="20" height="17" rx="4" fill="#FC5B31" stroke={s} strokeWidth={sw2} opacity="0.6" />
        ))}
        <line x1="32" y1="20" x2="32" y2="76" stroke={s} strokeWidth={sw2} />
        <line x1="54" y1="20" x2="54" y2="76" stroke={s} strokeWidth={sw2} />
        <line x1="8" y1="46" x2="76" y2="46" stroke={s} strokeWidth={sw2} />
        {/* 분리된 조각 (d 컬러 — 뺄셈으로 제거된 부분) */}
        <rect x="88" y="28" width="22" height="18" rx="4" fill={d} stroke={s} strokeWidth={sw}
          transform="rotate(16, 99, 37)" />
        <rect x="90" y="56" width="20" height="16" rx="4" fill={d} stroke={s} strokeWidth={sw} opacity="0.85"
          transform="rotate(-12, 100, 64)" />
      </svg>
    ),

    // ── 스티커 blob (분수의 곱셈) — sticker.png 형태 참조 ──
    'fraction-multi': (
      <svg width={size} height={size} viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
        {/* Blob 1 — top left */}
        <path d="M 10 14 C 2 16, 2 32, 12 38 S 34 40, 36 28 S 28 8, 10 14 Z"
          fill="#C7DDDB" stroke={s} strokeWidth={sw} />
        <circle cx="17" cy="25" r="2.2" fill={s} />
        <circle cx="26" cy="23" r="2.2" fill={s} />
        <path d="M 15 31 Q 20 36, 25 31" stroke={s} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {/* Blob 2 — top right */}
        <path d="M 84 8 C 70 6, 66 20, 74 32 S 96 38, 104 28 S 106 8, 84 8 Z"
          fill={d} stroke={s} strokeWidth={sw} />
        <circle cx="79" cy="21" r="2.2" fill={s} />
        <circle cx="89" cy="19" r="2.2" fill={s} />
        <path d="M 77 27 Q 82 32, 88 27" stroke={s} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {/* Blob 3 — bottom left */}
        <path d="M 8 60 C 0 64, 2 82, 14 86 S 38 86, 40 72 S 22 56, 8 60 Z"
          fill={d} stroke={s} strokeWidth={sw} />
        <circle cx="16" cy="72" r="2.2" fill={s} />
        <circle cx="26" cy="70" r="2.2" fill={s} />
        <path d="M 14 78 Q 19 83, 24 78" stroke={s} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {/* Blob 4 — bottom right */}
        <path d="M 80 60 C 70 56, 64 70, 72 80 S 92 88, 102 78 S 102 58, 80 60 Z"
          fill="#C7DDDB" stroke={s} strokeWidth={sw} />
        <circle cx="79" cy="70" r="2.2" fill={s} />
        <circle cx="89" cy="68" r="2.2" fill={s} />
        <path d="M 77 76 Q 82 81, 87 76" stroke={s} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {/* Center star sticker */}
        <path d="M60,38 L63,47 L72,47 L65,53 L67,63 L60,57 L53,63 L55,53 L48,47 L57,47Z"
          fill="#DDED59" stroke={s} strokeWidth={sw2} />
      </svg>
    ),

    // ── 에너지 게이지 (분수의 나눗셈) — energy.png 형태 참조 ──
    'fraction-div': (
      <svg width={size} height={size} viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
        {/* 외곽 프레임 */}
        <rect x="4" y="30" width="112" height="40" rx="10" fill={d} stroke={s} strokeWidth={sw} />
        {/* 하트 아이콘 (좌) */}
        <path d="M 20 47 C 20 42, 13 40, 12 45 S 13 54, 20 59 C 27 54, 28 45, 27 45 S 20 42, 20 47 Z"
          fill={c} stroke={s} strokeWidth={sw2} />
        {/* 게이지 세그먼트 8칸 — 5칸 채움 */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <rect key={i} x={33+i*9} y={36} width="7" height="28" rx="2.5"
            fill={i < 5 ? c : d} stroke={s} strokeWidth={1.2}
            opacity={i < 5 ? 1 - i * 0.08 : 0.25} />
        ))}
        {/* 캐릭터 얼굴 (우) */}
        <circle cx="105" cy="50" r="13" fill={c} stroke={s} strokeWidth={sw} />
        <circle cx="100" cy="47" r="2.2" fill={s} />
        <circle cx="110" cy="47" r="2.2" fill={s} />
        <path d="M 99 55 Q 105 60, 111 55" stroke={s} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      </svg>
    ),

    // ── 텐트 (삼각형의 넓이) ────────────────────────
    'triangle-area': (
      <svg width={size} height={size} viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
        {/* 지면 */}
        <rect x="4" y="84" width="112" height="7" rx="3" fill={d} stroke={s} strokeWidth={sw} />
        {/* 텐트 삼각형 */}
        <polygon points="60,8 110,84 10,84"
          fill={c} stroke={s} strokeWidth={sw} strokeLinejoin="round" />
        {/* 입구 아치 */}
        <path d="M 42 84 L 42 57 Q 60 44 78 57 L 78 84 Z"
          fill={d} stroke={s} strokeWidth={sw2} />
        {/* 높이 점선 */}
        <line x1="60" y1="8" x2="60" y2="84"
          stroke={s} strokeWidth={sw2} strokeDasharray="5,3" opacity="0.4" />
        {/* 텐트 로프 */}
        <line x1="28" y1="46" x2="10" y2="72" stroke={s} strokeWidth={sw2} strokeDasharray="3,2" opacity="0.55" />
        <line x1="92" y1="46" x2="110" y2="72" stroke={s} strokeWidth={sw2} strokeDasharray="3,2" opacity="0.55" />
      </svg>
    ),

    // ── 나비 날개 (합동과 대칭) ─────────────────────
    'congruence': (
      <svg width={size} height={size} viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
        {/* 대칭축 */}
        <line x1="60" y1="6" x2="60" y2="96" stroke={s} strokeWidth={1.5} strokeDasharray="5,3" opacity="0.4" />
        {/* 위 날개 — 왼쪽 */}
        <path d="M 58 46 C 52 22, 18 6, 6 22 S 8 56, 26 62 S 52 58, 58 50 Z"
          fill={c} stroke={s} strokeWidth={sw} />
        <path d="M 58 46 C 54 30, 26 18, 16 30 S 16 52, 32 56 S 54 52, 58 50 Z"
          fill={d} stroke={s} strokeWidth={sw2} opacity="0.6" />
        {/* 위 날개 — 오른쪽 */}
        <path d="M 62 46 C 68 22, 102 6, 114 22 S 112 56, 94 62 S 68 58, 62 50 Z"
          fill={c} stroke={s} strokeWidth={sw} />
        <path d="M 62 46 C 66 30, 94 18, 104 30 S 104 52, 88 56 S 66 52, 62 50 Z"
          fill={d} stroke={s} strokeWidth={sw2} opacity="0.6" />
        {/* 아래 날개 — 왼쪽 */}
        <path d="M 56 54 C 42 60, 16 72, 16 86 S 34 96, 50 86 S 58 66, 56 54 Z"
          fill={c} stroke={s} strokeWidth={sw} />
        {/* 아래 날개 — 오른쪽 */}
        <path d="M 64 54 C 78 60, 104 72, 104 86 S 86 96, 70 86 S 62 66, 64 54 Z"
          fill={c} stroke={s} strokeWidth={sw} />
        {/* 몸통 */}
        <ellipse cx="60" cy="56" rx="4" ry="20" fill={d} stroke={s} strokeWidth={sw} />
        {/* 머리 */}
        <circle cx="60" cy="34" r="5" fill={d} stroke={s} strokeWidth={sw} />
        {/* 더듬이 */}
        <path d="M 57 30 C 50 18, 46 10, 42 8" stroke={s} strokeWidth={sw2} fill="none" strokeLinecap="round" />
        <path d="M 63 30 C 70 18, 74 10, 78 8" stroke={s} strokeWidth={sw2} fill="none" strokeLinecap="round" />
        <circle cx="42" cy="8" r="2.5" fill={c} stroke={s} strokeWidth={sw2} />
        <circle cx="78" cy="8" r="2.5" fill={c} stroke={s} strokeWidth={sw2} />
        {/* 날개 점 */}
        <circle cx="24" cy="36" r="5" fill={d} stroke={s} strokeWidth={sw2} />
        <circle cx="96" cy="36" r="5" fill={d} stroke={s} strokeWidth={sw2} />
      </svg>
    ),

    // ── 뽑기 집게 인형 (평균과 가능성) ─────────────
    'mean': (
      <svg width={size} height={size} viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
        {/* 상단 레일 */}
        <rect x="8" y="6" width="104" height="8" rx="4" fill={d} stroke={s} strokeWidth={sw} />
        {/* 케이블 */}
        <line x1="60" y1="14" x2="60" y2="28" stroke={s} strokeWidth={sw} strokeLinecap="round" />
        {/* 집게 몸체 */}
        <rect x="48" y="28" width="24" height="10" rx="5" fill={d} stroke={s} strokeWidth={sw} />
        {/* 집게 팔 왼쪽 */}
        <path d="M 53 38 C 44 48, 42 56, 48 63" stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round" />
        {/* 집게 팔 중간 */}
        <line x1="60" y1="38" x2="60" y2="63" stroke={s} strokeWidth={sw} strokeLinecap="round" />
        {/* 집게 팔 오른쪽 */}
        <path d="M 67 38 C 76 48, 78 56, 72 63" stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round" />
        {/* 인형 귀 (토끼) */}
        <ellipse cx="50" cy="60" rx="4.5" ry="7" fill="#DDED59" stroke={s} strokeWidth={sw} />
        <ellipse cx="70" cy="60" rx="4.5" ry="7" fill="#DDED59" stroke={s} strokeWidth={sw} />
        <ellipse cx="50" cy="60" rx="2.5" ry="4.5" fill={d} stroke="none" opacity="0.4" />
        <ellipse cx="70" cy="60" rx="2.5" ry="4.5" fill={d} stroke="none" opacity="0.4" />
        {/* 인형 머리 */}
        <circle cx="60" cy="73" r="14" fill="#DDED59" stroke={s} strokeWidth={sw} />
        {/* 인형 눈 */}
        <circle cx="55" cy="71" r="2.5" fill={s} />
        <circle cx="65" cy="71" r="2.5" fill={s} />
        <circle cx="56.5" cy="70" r="0.9" fill={d} />
        <circle cx="66.5" cy="70" r="0.9" fill={d} />
        {/* 인형 볼 */}
        <circle cx="52" cy="76" r="3.5" fill={d} opacity="0.4" />
        <circle cx="68" cy="76" r="3.5" fill={d} opacity="0.4" />
        {/* 인형 입 */}
        <path d="M 56 77 Q 60 81, 64 77" stroke={s} strokeWidth={sw2} fill="none" strokeLinecap="round" />
        {/* 인형 몸 */}
        <ellipse cx="60" cy="91" rx="11" ry="9" fill="#DDED59" stroke={s} strokeWidth={sw} />
        {/* 배 별 */}
        <path d="M60,87 L61.5,91 L65.5,91 L62,93.5 L63.5,97.5 L60,95 L56.5,97.5 L58,93.5 L54.5,91 L58.5,91Z"
          fill={d} stroke={s} strokeWidth={1} />
      </svg>
    ),

    // ── 변장 키트 (경우의 수) — 모자/안경/코/콧수염 ──
    'likelihood': (
      <svg width={size} height={size} viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
        {/* 격자 구분선 */}
        <line x1="60" y1="4" x2="60" y2="96" stroke={s} strokeWidth={1} strokeDasharray="3,3" opacity="0.18" />
        <line x1="4" y1="50" x2="116" y2="50" stroke={s} strokeWidth={1} strokeDasharray="3,3" opacity="0.18" />
        {/* 모자 (top hat) — 좌상 */}
        <rect x="14" y="10" width="32" height="24" rx="3" fill={c} stroke={s} strokeWidth={sw} />
        <rect x="7" y="32" width="46" height="7" rx="3.5" fill={d} stroke={s} strokeWidth={sw} />
        <rect x="14" y="28" width="32" height="6" fill={d} stroke={s} strokeWidth={1.5} />
        {/* 안경 (glasses) — 우상 */}
        <circle cx="78" cy="26" r="11" fill={c} stroke={s} strokeWidth={sw} />
        <circle cx="102" cy="26" r="11" fill={c} stroke={s} strokeWidth={sw} />
        <line x1="89" y1="26" x2="91" y2="26" stroke={s} strokeWidth={sw} />
        <line x1="67" y1="22" x2="61" y2="18" stroke={s} strokeWidth={sw} strokeLinecap="round" />
        <line x1="113" y1="22" x2="116" y2="18" stroke={s} strokeWidth={sw} strokeLinecap="round" />
        {/* 코모양 공 — 좌하 */}
        <circle cx="30" cy="74" r="17" fill={c} stroke={s} strokeWidth={sw} />
        <ellipse cx="24" cy="77" rx="4.5" ry="3" fill={d} opacity="0.28" stroke="none" />
        <ellipse cx="36" cy="77" rx="4.5" ry="3" fill={d} opacity="0.28" stroke="none" />
        {/* 콧수염 — 우하 */}
        <path d="M 66 74 C 64 62, 80 56, 87 66 C 94 56, 110 62, 108 74 C 102 82, 94 74, 87 70 C 80 74, 72 82, 66 74 Z"
          fill={d} stroke={s} strokeWidth={sw} />
      </svg>
    ),

    // ── 계단 (1차 함수) ─────────────────────────────
    'linear-fn': (
      <svg width={size} height={size} viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
        <rect x="8" y="8" width="104" height="84" rx="8" fill={d} stroke={s} strokeWidth={sw} />
        <polygon points="14,90 14,72 34,72 34,54 54,54 54,36 74,36 74,18 106,18 106,90"
          fill={c} stroke={s} strokeWidth={sw} strokeLinejoin="round" />
        {[[34,72],[54,54],[74,36],[106,18]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="5" fill={d} stroke={s} strokeWidth={sw2} />
        ))}
      </svg>
    ),

    // ── 농구공 (2차 함수) ───────────────────────────
    'quadratic-fn': (
      <svg width={size} height={size} viewBox="0 0 120 100" style={{ overflow: 'visible' }}>
        <rect x="4" y="4" width="112" height="92" rx="8" fill={d} stroke={s} strokeWidth={sw} />
        <path d="M 20 82 Q 58 6 98 42" stroke={c} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M 20 82 Q 58 6 98 42" stroke={s} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="7,4" />
        <circle cx="20" cy="82" r="14" fill={c} stroke={s} strokeWidth={sw} />
        <path d="M 20 69 Q 28 76 20 96" stroke={s} strokeWidth={sw2} fill="none" />
        <path d="M 9 82 Q 20 74 31 82" stroke={s} strokeWidth={sw2} fill="none" />
        <rect x="96" y="34" width="14" height="20" rx="2" fill={c} stroke={s} strokeWidth={sw2} />
        <rect x="80" y="54" width="28" height="5" rx="2.5" fill={d} stroke={s} strokeWidth={sw2} />
      </svg>
    ),
  };

  const FALLBACK = {
    arithmetic: 'gcd-lcm',
    function:   'linear-fn',
    geometry:   'triangle-area',
    statistics: 'mean',
    columbiaBlue: 'mean',
    yellow:       'likelihood',
  };

  const key = ILLUSTRATIONS[conceptKey] ? conceptKey : (FALLBACK[category] ?? 'gcd-lcm');
  return ILLUSTRATIONS[key];
}

export default MathConceptIllustration;
