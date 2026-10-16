// People Alumni의 현재 소속을 진로 범주로 나눠 학위 졸업 / 연구직 인원을 집계 — 노스 모달 진로 그래픽용
export type CareerId = 'maker' | 'equipment' | 'institute' | 'academia' | 'overseas' | 'other';

// 판정은 이 표 순서대로 첫 매칭. 약칭은 단어 경계로 매칭해 KIST가 KAIST에 걸리지 않게 한다.
export const CAREER_CATEGORIES: readonly {
  id: CareerId;
  label: string;
  examples: string;
  patterns: readonly RegExp[];
}[] = [
  {
    id: 'maker',
    label: '반도체·배터리 제조사',
    examples: '삼성전자 · SK하이닉스 · LG에너지솔루션',
    patterns: [/\bSamsung\b/i, /\bSK ?Hynix\b/i, /\bLG Energy Solution\b/i],
  },
  {
    id: 'equipment',
    label: '반도체 장비·소재 기업',
    examples: '램리서치 · 세메스 · 이엔에프테크놀로지',
    patterns: [/\bLam Research\b/i, /\bSEMES\b/i, /\bENF\b/i],
  },
  {
    id: 'institute',
    label: '국내 연구기관',
    examples: 'KIST · KRISS · NNFC',
    patterns: [/\bKIST\b/i, /\bKRISS\b/i, /\bNNFC\b/i, /National Nanofab/i],
  },
  {
    id: 'academia',
    label: '대학',
    examples: 'KAIST · 동신대학교',
    patterns: [/\bKAIST\b/i, /Universit/i],
  },
  {
    id: 'overseas',
    label: '해외 연구기관',
    examples: '미국 오크리지 국립연구소(ORNL)',
    patterns: [/Oak Ridge/i, /\bORNL\b/i],
  },
  { id: 'other', label: '기타', examples: '', patterns: [] },
];

export function currentOf(affiliation: string): string {
  return affiliation.split(';')[0].trim();
}

export function classifyAffiliation(affiliation: string): CareerId {
  const current = currentOf(affiliation);
  return CAREER_CATEGORIES.find((c) => c.patterns.some((re) => re.test(current)))?.id ?? 'other';
}

export function isStaffRole(role: string): boolean {
  return /Research Professor|Postdoc|Researcher/i.test(role);
}

export function yearSpan(roles: string[]): { min: number; max: number } | null {
  const years = roles.flatMap((r) => (r.match(/\d{4}/g) ?? []).map(Number));
  return years.length ? { min: Math.min(...years), max: Math.max(...years) } : null;
}

export function tallyCareers(people: { role?: string; currentAffiliation?: string }[]) {
  const counted = people.filter((p) => p.currentAffiliation?.trim());
  const bars = CAREER_CATEGORIES.map(({ id, label, examples }) => {
    const inCat = counted.filter((p) => classifyAffiliation(p.currentAffiliation!) === id);
    const staff = inCat.filter((p) => isStaffRole(p.role ?? '')).length;
    return { id, label, examples, degree: inCat.length - staff, staff };
  }).filter((b) => b.degree + b.staff > 0);
  const staff = bars.reduce((n, b) => n + b.staff, 0);
  return {
    total: counted.length,
    degree: counted.length - staff,
    staff,
    bars,
    span: yearSpan(counted.map((p) => p.role ?? '')),
  };
}
