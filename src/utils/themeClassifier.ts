// Research theme 분류기 — paper의 themes 선택을 1순위로, 없으면 title/journal 키워드/override로 분류.
// 분류 우선순위: ① CMS에서 tick한 themes 필드 → ② paperOverrides(number 기준) → ③ themeKeywords 정규식.
// 권장 흐름은 Publications 입력 시 themes를 직접 tick하는 것이고, 비워두면 키워드로 자동 폴백한다.
// 키워드 방식은 표기 변형(하이픈·풀어쓰기)에 취약하므로 누락되면 themes를 tick하면 된다.
//
// 사용 위치: src/pages/research.astro — 6개 테마 모달의 paper list 자동 산출.

import type { CollectionEntry } from 'astro:content';

type SkkuPaper = CollectionEntry<'publications-skku'>['data'];

// 키워드 폴백용 테마 슬러그 — 초기 6개 분야. 분야의 source of truth는 research-themes/*.md 이고
// 새 분야는 CMS tick(paper.themes)으로 배정한다. 이 목록은 themeKeywords 자동 폴백 대상에만 쓰인다.
export const THEME_SLUGS = [
  'spectroscopic-imaging',
  '4d-stem-crystallography',
  'electron-tomography',
  'machine-learning-em',
  'thin-film-growth',
  '2d-materials-vdw',
] as const;

export type ThemeSlug = (typeof THEME_SLUGS)[number];

// 키워드 매칭 — 한 paper가 여러 테마에 매칭되면 모든 테마의 모달에 노출됨 (의도된 동작)
const themeKeywords: Record<ThemeSlug, RegExp> = {
  'spectroscopic-imaging':
    /eels|edx|eds[^a-z]|chemical mapping|oxygen vacancy|valence mapping|dopant|doping|defect chem|cation vacanc|stoichiom|spectrosc|cathode|electrolyte|oxide catal|nanoparticle.*(stem|spectro)|perovskite catal|electronic structure|in situ.*tem|redox.*tem|photocataly|hafnia|hydrogen evolution.*atom|2d dual atom|atomic.*resolution.*chemical|atom.*counting|abf|annular.*bright|gan.*(atom|adlayer|interface)|elemental map|sb-rich|electron energy loss/i,

  '4d-stem-crystallography':
    /4d[\s-]?stem|cbed|nbed|lattice strain|domain mapping|domain analy|ferroelectric|polarization (?!.*degenerate)|crystallograph|picoscale|hfo2|hzo|polymorph|strain relax|magnetic anisotropy|anomalous hall|oxygen octahedra|polar distortion|octahedra/i,

  'electron-tomography':
    /tomograph|3d structural|three[\s-]?dimensional reconstr|tilt series|3d.*porous/i,

  'machine-learning-em':
    /deep learning|machine learning|neural network|u-net|attention|automated.*(quantif|analys|detect)|cnn |artificial intelligence|ai-driven|ai-based/i,

  'thin-film-growth':
    /single[\s-]?crystal cu|single[\s-]?crystal ag|cu\(111\)|ag.*thin film|ultraflat|oxidation resistance|monoatomic step|step[\s-]?level|grain[\s-]?boundary[\s-]?free|epitaxial.*growth|growth mechanism|wafer[\s-]?scale|self-oxidation|atomic sputter|reversible zinc.*anode|interfacial layer.*anode/i,

  '2d-materials-vdw':
    /mos2|wse2|res2|tmd[s]?[^a-z]|transition[\s-]?metal[\s-]?dichalcogen|2d material|2d[\s-]?dual[\s-]?atom|van[\s-]?der[\s-]?waals|vdw[^a-z]?|monolayer|chalcogen vacancy|twisted[\s-]?bilayer|interlayer coupling|2d[\s-]?hetero|lateral hetero/i,
};

// 키워드로 자동 분류가 어색한 paper의 수동 override.
// 키: publications-skku의 number 필드 (정수). 값: 강제 할당할 테마 slug 배열 (자동 분류 결과를 완전히 대체).
const paperOverrides: Record<number, ThemeSlug[]> = {
  // unassigned 였던 항목 (수동 분류)
  214: ['spectroscopic-imaging'],
  210: ['4d-stem-crystallography', '2d-materials-vdw'],
  209: ['spectroscopic-imaging'],
  195: ['4d-stem-crystallography', 'spectroscopic-imaging'],
  193: ['4d-stem-crystallography'],
  189: ['spectroscopic-imaging', '2d-materials-vdw'],
  178: ['spectroscopic-imaging', '2d-materials-vdw'],
  169: ['spectroscopic-imaging', '2d-materials-vdw'],
  146: ['thin-film-growth'],
  133: ['spectroscopic-imaging'],
  125: ['spectroscopic-imaging', '4d-stem-crystallography'],
  91: ['spectroscopic-imaging'],
  68: ['spectroscopic-imaging'],
  66: ['spectroscopic-imaging'],
  65: ['spectroscopic-imaging'],
  222: ['spectroscopic-imaging', 'thin-film-growth'],
  200: ['spectroscopic-imaging'],
  197: ['4d-stem-crystallography', 'thin-film-growth'],
  188: ['thin-film-growth', '2d-materials-vdw'],
  181: ['spectroscopic-imaging', '2d-materials-vdw'],
  161: ['spectroscopic-imaging', 'thin-film-growth'],
  139: ['spectroscopic-imaging', '2d-materials-vdw'],
  105: ['spectroscopic-imaging', '2d-materials-vdw'],
  80: ['4d-stem-crystallography', 'thin-film-growth'],
  78: ['spectroscopic-imaging', '2d-materials-vdw'],
  62: ['spectroscopic-imaging'],
};

/**
 * Paper 한 편을 테마 슬러그 배열로 분류한다.
 * - paper.themes가 비어있지 않으면 그 선택을 그대로 반환 (CMS tick 1순위, 자동 분류 우회).
 * - paperOverrides에 등록된 number는 override를 그대로 반환 (자동 분류 우회).
 * - 그 외에는 themeKeywords 정규식 매칭 결과 (0~N개 슬러그).
 */
export function classifyPaper(paper: SkkuPaper): string[] {
  if (paper.themes && paper.themes.length) return paper.themes;
  if (paperOverrides[paper.number]) return paperOverrides[paper.number];
  const text = `${paper.title} ${paper.journal}`;
  return THEME_SLUGS.filter((slug) => themeKeywords[slug].test(text));
}

/**
 * 전체 lead-author paper(2016+ filter는 호출자가 처리) 중 특정 테마에 속하는 것만 추려 number desc로 정렬.
 * themeSlug는 research-themes/*.md 의 slug라면 무엇이든 받는다(새로 추가된 분야 포함).
 * 키워드 폴백은 기존 6개 THEME_SLUGS에만 작동하므로, 새 분야는 paper.themes tick으로만 배정된다.
 */
export function papersForTheme(
  themeSlug: string,
  papers: SkkuPaper[],
): SkkuPaper[] {
  return papers
    .filter((p) => classifyPaper(p).includes(themeSlug))
    .sort((a, b) => b.number - a.number);
}
