const VARIANTS = ['confident', 'celebrating', 'curious', 'focused'];
const PREFIXES = ['수학탐험가', '계산왕', '도형마스터', '함수맛집', '확률러버', '분수킬러'];
const CACHE_KEY = 'zmath_ip_profile_v1';

function fnv32a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * IP를 조회해 결정적(deterministic) 프로필을 반환한다.
 * 세션 동안 sessionStorage에 캐시해 API 중복 호출을 방지한다.
 * @returns {{ avatarVariant: string, userId: string } | null}
 */
export async function resolveIpProfile() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
    const { ip } = await fetch('https://api.ipify.org?format=json').then((r) => r.json());
    const h = fnv32a(ip);
    const profile = {
      avatarVariant: VARIANTS[h % VARIANTS.length],
      userId: `${PREFIXES[(h >> 8) % PREFIXES.length]}${String((h >> 4) % 9000 + 1000)}`,
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(profile));
    return profile;
  } catch {
    return null;
  }
}
