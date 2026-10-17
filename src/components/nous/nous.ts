// AI 연구보조원 노스의 메타·언어별 영상·원고 데이터와 재생 위치 판정 — 영상을 교체하면 VOICES·PARAGRAPHS만 바꾼다
export const NOUS = {
  nameKo: '노스',
  nameEn: 'Nous',
  roleKo: 'AI 연구보조원',
  roleEn: 'AI Research Assistant',
} as const;

export type Lang = 'ko' | 'en';
export const LANGS: readonly Lang[] = ['ko', 'en'];
export const DEFAULT_LANG: Lang = 'ko';

// 립싱크 영상(Wan 2.7 조각을 이어 붙이고 원본 낭독 트랙을 입힘) — 길이는 낭독 트랙 실측값
export const VOICES: Record<Lang, { src: string; duration: number; label: string; spoken: string }> = {
  ko: { src: '/nous/intro-ko.mp4', duration: 92.24, label: '1:32', spoken: '1분 32초' },
  en: { src: '/nous/intro-en.mp4', duration: 84.08, label: '1:24', spoken: '1분 24초' },
};

// 원고 v2(docs/nous-script-v2.md). start = 낭독 트랙에서 문단이 시작하는 시각(문단별 생성 + 0.8s 쉼으로 이어 붙인 실측값).
// en·ko는 자막 표기(SKKU-STEM, KIST, 메일 주소 등) — 한국어 낭독은 같은 내용을 소리 나는 대로 읽었다.
export const PARAGRAPHS: readonly { start: Record<Lang, number>; en: string; ko: string }[] = [
  {
    start: { ko: 0, en: 0 },
    en: "Hi, I'm Nous — the AI research assistant for the SKKU-STEM Lab.",
    ko: '안녕하세요, 저는 성균관대 STEM 연구실의 AI 연구보조원, 노스입니다.',
  },
  {
    start: { ko: 6.16, en: 5.84 },
    en: "We don't make materials — we explain them. With aberration-corrected scanning transmission electron microscopy, electron spectroscopy, and machine learning, we uncover why a material performs the way it does, atom by atom: in hydrogen fuel cells, catalysts, solar cells, and the new materials behind AI chips.",
    ko: '저희는 소재를 만들지 않습니다. 소재를 설명합니다. 수차보정 주사투과전자현미경과 전자분광법, 그리고 머신러닝으로 소재가 왜 그런 성능을 내는지 원자 하나하나의 수준에서 밝혀냅니다. 수소 연료전지와 촉매, 태양전지, 그리고 AI 칩에 들어가는 신소재까지요.',
  },
  {
    start: { ko: 28.56, en: 27.12 },
    en: 'That skill has never mattered more. As chips shrink to just a few nanometers, a handful of atoms at an interface can decide how a device behaves. The AI semiconductor market is projected to grow about 24% a year through 2028, and the materials driving it, like ferroelectric hafnium oxide and two-dimensional semiconductors, need people who can see, and explain, their atoms.',
    ko: '이 능력이 지금처럼 중요했던 적은 없습니다. 칩이 몇 나노미터 수준까지 작아지면서, 계면에 있는 원자 몇 개가 소자의 동작을 좌우하게 되었습니다. AI 반도체 시장은 2028년까지 해마다 약 24%씩 성장할 것으로 전망됩니다. 그 성장을 이끄는 강유전체 산화하프늄이나 2차원 반도체 같은 소재에는 원자를 보고 설명할 수 있는 사람이 필요합니다.',
  },
  {
    start: { ko: 56.64, en: 52.4 },
    en: "That's why our people are in demand. Our graduates and researchers now work at Samsung Electronics, SK hynix, LG Energy Solution, Lam Research, and SEMES; at KIST, KRISS, and KAIST; and at Oak Ridge National Laboratory in the United States.",
    ko: '그래서 저희 연구실 사람들을 찾습니다. 졸업생과 연구원들은 지금 삼성전자, SK하이닉스, LG에너지솔루션, 램리서치, 세메스, 그리고 KIST, KRISS(한국표준과학연구원), KAIST, 미국 오크리지 국립연구소에서 일하고 있습니다.',
  },
  {
    start: { ko: 76.88, en: 72.56 },
    en: "If you want to learn to read materials at the atomic scale, email Professor Young-Min Kim at youngmk@skku.edu. We'd love to hear from you.",
    ko: '원자 단위에서 소재를 읽는 법을 배우고 싶다면 김영민 교수님께 메일을 보내 주세요. 주소는 youngmk@skku.edu입니다. 여러분의 연락을 기다리겠습니다.',
  },
];

export type GraphicId = 'research' | 'market' | 'careers';

// 그래픽은 해당 문단(인덱스)이 시작될 때 나타나 이후 계속 남는다.
export const GRAPHIC_AT: Record<GraphicId, number> = { research: 1, market: 2, careers: 3 };
const GRAPHIC_ORDER: readonly GraphicId[] = ['research', 'market', 'careers'];

// 음성이 메일 주소를 말하는 문단에서 상담 안내를 펼친다.
export const CTA_AT = 4;

export function activeParagraph(t: number, lang: Lang): number {
  if (!(t > 0)) return 0;
  let i = 0;
  while (i + 1 < PARAGRAPHS.length && t >= PARAGRAPHS[i + 1].start[lang]) i++;
  return i;
}

// 언어를 바꿀 때 같은 문단을 새 언어의 시작부터 이어 듣는다.
export function paragraphStart(p: number, lang: Lang): number {
  return PARAGRAPHS[p]?.start[lang] ?? 0;
}

export function visibleGraphics(t: number, lang: Lang): GraphicId[] {
  const p = activeParagraph(t, lang);
  return GRAPHIC_ORDER.filter((id) => p >= GRAPHIC_AT[id]);
}

export function ctaExpanded(t: number, ended: boolean, lang: Lang): boolean {
  return ended || activeParagraph(t, lang) >= CTA_AT;
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
