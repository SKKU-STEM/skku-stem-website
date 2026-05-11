// Research theme 분류기 — paper title/journal 키워드 매칭으로 빌드 시 자동 분류.
// 새 lead-author 논문이 publications-skku에 추가되면 다음 빌드에서 자동으로 분류됨.
// 키워드로 잡히지 않거나 잘못 분류되는 경우는 paperOverrides에 수동 등록.
//
// 사용 위치: src/pages/research.astro — 6개 테마 모달의 paper list 자동 산출.

import type { CollectionEntry } from 'astro:content';

type SkkuPaper = CollectionEntry<'publications-skku'>['data'];

// 테마 슬러그 — src/content/research-themes/*.md 의 slug 필드와 일치해야 함
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
 * - paperOverrides에 등록된 number는 override를 그대로 반환 (자동 분류 우회).
 * - 그 외에는 themeKeywords 정규식 매칭 결과 (0~N개 슬러그).
 */
export function classifyPaper(paper: SkkuPaper): ThemeSlug[] {
  if (paperOverrides[paper.number]) return paperOverrides[paper.number];
  const text = `${paper.title} ${paper.journal}`;
  return THEME_SLUGS.filter((slug) => themeKeywords[slug].test(text));
}

/**
 * 전체 lead-author paper(2016+ filter는 호출자가 처리) 중 특정 테마에 속하는 것만 추려 number desc로 정렬.
 */
export function papersForTheme(
  themeSlug: ThemeSlug,
  papers: SkkuPaper[],
): SkkuPaper[] {
  return papers
    .filter((p) => classifyPaper(p).includes(themeSlug))
    .sort((a, b) => b.number - a.number);
}
