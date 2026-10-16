// AI 연구보조원 노스의 메타·음성·원고 데이터와 재생 위치 판정 — 음성을 교체하면 VOICE·PARAGRAPHS만 바꾼다
export const NOUS = {
  nameKo: '노스',
  nameEn: 'Nous',
  roleKo: 'AI 연구보조원',
  roleEn: 'AI Research Assistant',
} as const;

// v1 음성: 원본 79.2s 컷 + 앞 0.3s 무음 + −19 LUFS 정규화 (context-notes 참고)
export const VOICE = {
  src: '/nous/intro.mp3',
  duration: 79.5,
  label: '1:19',
  spokenKo: '1분 19초',
  spokenEn: '1 min 19 s',
} as const;

// start = 받아쓰기 구간 시작 + 0.3s 패딩. en은 음성과 같은 단어(구두점만 다듬음), ko는 자막용 번역.
export const PARAGRAPHS: readonly { start: number; en: string; ko: string }[] = [
  {
    start: 0,
    en: "Hi, I'm Nous — the AI research assistant for the SKKU-STEM Lab.",
    ko: '안녕하세요, 저는 SKKU-STEM 연구실의 AI 연구보조원 노스입니다.',
  },
  {
    start: 6.7,
    en: 'Our lab combines aberration-corrected scanning transmission electron microscopy and electron spectroscopy with machine learning to study energy materials at the atomic scale. From hydrogen fuel-cell catalysts and next-generation solar materials to the rapidly growing field of nanoscale analysis for AI semiconductors and logic devices, we look closely at structure and chemistry to uncover the secrets behind performance.',
    ko: '저희 연구실은 수차보정 주사투과전자현미경과 전자분광법을 머신러닝과 결합해 에너지 소재를 원자 단위에서 연구합니다. 수소 연료전지 촉매와 차세대 태양전지 소재부터 빠르게 성장하는 AI 반도체·로직 소자의 나노 분석까지, 구조와 화학을 면밀히 들여다보며 성능의 비밀을 밝혀냅니다.',
  },
  {
    start: 34.8,
    en: 'As semiconductor processes shrink below the nanometer scale, atomic-level analysis techniques are becoming more critical than ever. The AI semiconductor market is now growing at over 20% annually, and with it, the demand for precise nanoscale analysis keeps rising.',
    ko: '반도체 공정이 나노미터 수준으로 미세해지면서 원자 단위 분석 기술이 그 어느 때보다 중요해졌습니다. AI 반도체 시장은 해마다 20% 넘게 성장하고 있고, 정밀한 나노 분석 수요도 함께 늘고 있습니다.',
  },
  {
    start: 52.0,
    en: 'Our alumni have gone on to work at leading companies like Samsung Electronics, LG Energy Solution, and SK hynix, as well as national research institutes like KIST and KRISS, international labs such as Oak Ridge National Laboratory, and global equipment companies like Lam Research.',
    ko: '졸업생들은 삼성전자, LG에너지솔루션, SK하이닉스 같은 선도 기업과 KIST, KRISS 같은 국가 연구기관, 미국 오크리지 국립연구소 같은 해외 연구소, 램리서치 같은 글로벌 장비 기업으로 진출했습니다.',
  },
  {
    start: 69.3,
    en: "If you're interested in joining our lab, feel free to reach out to Professor Young-Min Kim directly for a consultation, at youngmk@skku.edu. We'd love to hear from you.",
    ko: '연구실 합류에 관심이 있다면 김영민 교수님(youngmk@skku.edu)께 편하게 상담을 요청해 주세요. 여러분의 연락을 기다립니다.',
  },
];

export type GraphicId = 'research' | 'market' | 'careers';

// 그래픽은 해당 문단(인덱스)이 시작될 때 나타나 이후 계속 남는다.
export const GRAPHIC_AT: Record<GraphicId, number> = { research: 1, market: 2, careers: 3 };
const GRAPHIC_ORDER: readonly GraphicId[] = ['research', 'market', 'careers'];

// 음성이 메일 주소를 말하는 문단에서 상담 안내를 펼친다.
export const CTA_AT = 4;

const STARTS = PARAGRAPHS.map((p) => p.start);

export function activeParagraph(t: number, starts: readonly number[] = STARTS): number {
  if (!(t > 0)) return 0;
  let i = 0;
  while (i + 1 < starts.length && t >= starts[i + 1]) i++;
  return i;
}

export function visibleGraphics(t: number): GraphicId[] {
  const p = activeParagraph(t);
  return GRAPHIC_ORDER.filter((id) => p >= GRAPHIC_AT[id]);
}

export function ctaExpanded(t: number, ended: boolean): boolean {
  return ended || activeParagraph(t) >= CTA_AT;
}

const split = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  return [Math.floor(s / 60), s % 60] as const;
};

export function formatClock(sec: number): string {
  const [m, s] = split(sec);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatSpoken(sec: number): string {
  const [m, s] = split(sec);
  return `${m}분 ${s}초`;
}

// 엔벌로프 문자열('0'–'9', fps칸/초)에서 t초의 진폭을 0–1로 읽는다. 범위 밖은 0.
export function ampAt(levels: string, fps: number, t: number): number {
  if (!(t >= 0)) return 0;
  const ch = levels[Math.floor(t * fps)];
  return ch === undefined ? 0 : Number(ch) / 9;
}

const MAIL_SUBJECT = '[SKKU-STEM 연구실 문의] 이름 / 학과 / 학년';
const MAIL_BODY = [
  '교수님 안녕하세요.',
  '',
  '이름:',
  '소속(학과·학년):',
  '관심 과정(학부연구생 / 석박통합 / 석사 / 박사):',
  '관심 연구 주제:',
  '궁금한 점:',
  '',
].join('\n');

export function mailtoHref(): string {
  return `mailto:youngmk@skku.edu?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`;
}
