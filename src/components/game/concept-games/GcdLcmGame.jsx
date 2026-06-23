import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useTheme } from '@mui/material/styles';

/**
 * GcdLcmGame — 약수와 배수 개념 게임
 *
 * N개의 원을 보여주고 스텝을 조절하며 "몇씩 세어야 딱 떨어지나" 탐색.
 * 스텝이 N을 나누어 떨어지면 약수 발견. 모든 약수 발견 시 완료.
 *
 * Props:
 * @param {number} number - 탐색할 수 [Optional, 기본값: 18]
 * @param {function} onComplete - 모든 약수 발견 시 콜백 [Optional]
 */
function GcdLcmGame({ number = 18, onComplete }) {
  const theme = useTheme();
  const { zmath } = theme.palette;
  const accentColor = zmath.categoryColors.arithmetic; // orange

  const [step, setStep] = useState(1);
  const [foundDivisors, setFoundDivisors] = useState(new Set([1])); // 1은 항상 약수
  const [checkResult, setCheckResult] = useState(null); // null | 'yes' | 'no'
  const [justFound, setJustFound] = useState(null);

  const allDivisors = Array.from({ length: number }, (_, i) => i + 1)
    .filter((n) => number % n === 0);

  const isDivisor = number % step === 0;
  const isAlreadyFound = foundDivisors.has(step);
  const isComplete = foundDivisors.size === allDivisors.length;

  // 스텝 변경 시 확인 결과 리셋
  useEffect(() => {
    setCheckResult(null);
    setJustFound(null);
  }, [step]);

  useEffect(() => {
    if (isComplete && onComplete) onComplete();
  }, [isComplete]);

  const handleCheck = () => {
    if (isAlreadyFound) return;
    setCheckResult(isDivisor ? 'yes' : 'no');
    if (isDivisor) {
      setJustFound(step);
      setFoundDivisors((prev) => new Set([...prev, step]));
    }
  };

  // 하이라이트: 스텝의 배수 위치
  const highlighted = Array.from({ length: number }, (_, i) => (i + 1) % step === 0);
  const remainder = number % step;
  const groupCount = Math.floor(number / step);

  const changeStep = (delta) => {
    setStep((s) => Math.max(1, Math.min(number, s + delta)));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* ── 발견한 약수 + 진행 ── */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            {number}의 약수
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: accentColor, fontFamily: '"Outfit", sans-serif' }}
          >
            {foundDivisors.size} / {allDivisors.length} 발견
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {allDivisors.map((d) => {
            const found = foundDivisors.has(d);
            const isNew = justFound === d;
            return (
              <Box
                key={d}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  border: `1.5px solid ${found ? zmath.nearBlack : 'rgba(26,26,26,0.15)'}`,
                  backgroundColor: found ? accentColor : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  transform: isNew ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    color: found ? zmath.offWhite : 'rgba(26,26,26,0.2)',
                    fontFamily: '"Outfit", sans-serif',
                  }}
                >
                  {found ? d : '?'}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ── 원 격자 ── */}
      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(9, number)}, 1fr)`,
            gap: 0.75,
          }}
        >
          {Array.from({ length: number }).map((_, i) => {
            const isHigh = highlighted[i];
            const isRemainder = i >= groupCount * step;
            return (
              <Box
                key={i}
                sx={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  backgroundColor: isHigh
                    ? accentColor
                    : isRemainder
                    ? '#D199FA88'  // 나머지 = 연한 살몬
                    : 'rgba(26,26,26,0.08)',
                  border: `1.5px solid ${isHigh ? zmath.nearBlack : 'rgba(26,26,26,0.15)'}`,
                  transition: 'all 0.2s ease',
                }}
              />
            );
          })}
        </Box>

        {/* 스텝 설명 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
          <Box
            sx={{
              width: 16, height: 16, borderRadius: '50%',
              backgroundColor: accentColor, border: `1px solid ${zmath.nearBlack}`,
              flexShrink: 0,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {step}씩 세기 → {groupCount}그룹
            {remainder > 0 && (
              <Box component="span" sx={{ color: '#D199FA', fontWeight: 700 }}>
                {' '}+ 나머지 {remainder}개
              </Box>
            )}
          </Typography>
        </Box>
      </Box>

      {/* ── 스텝 컨트롤 ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          px: 3,
          py: 2,
          backgroundColor: 'background.paper',
          border: `1.5px solid ${zmath.nearBlack}`,
          borderRadius: '12px',
          boxShadow: `3px 3px 0 ${zmath.nearBlack}`,
        }}
      >
        <IconButton
          size="small"
          onClick={() => changeStep(-1)}
          disabled={step <= 1}
          sx={{
            border: `1.5px solid ${zmath.nearBlack}`,
            borderRadius: '8px',
            width: 36, height: 36,
          }}
        >
          <RemoveIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <Box sx={{ textAlign: 'center', minWidth: 80 }}>
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 900,
              fontSize: '2rem',
              lineHeight: 1,
              color: 'text.primary',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {step}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            씩 세기
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={() => changeStep(1)}
          disabled={step >= number}
          sx={{
            border: `1.5px solid ${zmath.nearBlack}`,
            borderRadius: '8px',
            width: 36, height: 36,
          }}
        >
          <AddIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* ── 확인 버튼 + 결과 ── */}
      {!isAlreadyFound && !isComplete && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box
            component="button"
            onClick={handleCheck}
            sx={{
              width: '100%',
              py: 1.5,
              backgroundColor: accentColor,
              border: `1.5px solid ${zmath.nearBlack}`,
              borderRadius: '12px',
              boxShadow: `3px 3px 0 ${zmath.nearBlack}`,
              cursor: 'pointer',
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              color: zmath.offWhite,
              letterSpacing: '0.02em',
              transition: 'transform 0.1s ease, box-shadow 0.1s ease',
              '&:hover': {
                transform: 'translate(-1px, -1px)',
                boxShadow: `4px 4px 0 ${zmath.nearBlack}`,
              },
              '&:active': {
                transform: 'translate(2px, 2px)',
                boxShadow: 'none',
              },
            }}
          >
            {step}은 {number}의 약수일까?
          </Box>

          {checkResult && (
            <Box
              sx={{
                px: 2, py: 1.5, borderRadius: '10px',
                backgroundColor: checkResult === 'yes' ? '#E8F5E9' : '#FFF3E0',
                border: `1px solid ${checkResult === 'yes' ? '#00C853' : '#FF6D00'}`,
              }}
            >
              <Typography sx={{ fontWeight: 700, color: checkResult === 'yes' ? '#2E7D32' : '#E65100' }}>
                {checkResult === 'yes'
                  ? `✅ ${step}은 ${number}의 약수예요! ${number}÷${step}=${number / step}`
                  : `❌ ${step}씩 세면 나머지 ${remainder}개가 남아요`}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* ── 완료 ── */}
      {isComplete && (
        <Box
          sx={{
            px: 2.5, py: 2, borderRadius: '12px',
            backgroundColor: accentColor,
            border: `1.5px solid ${zmath.nearBlack}`,
            boxShadow: `3px 3px 0 ${zmath.nearBlack}`,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>🎉</Typography>
          <Typography sx={{ fontWeight: 900, color: zmath.offWhite, fontSize: '1rem' }}>
            {number}의 약수 {allDivisors.length}개를 모두 찾았어요!
          </Typography>
          <Typography variant="caption" sx={{ color: zmath.offWhite, opacity: 0.8 }}>
            {allDivisors.join(' · ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export { GcdLcmGame };
export default GcdLcmGame;
