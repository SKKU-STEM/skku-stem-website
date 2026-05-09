// 연구실 News 게시판 — /news 페이지가 import해 렌더링
/**
 * 새 소식 추가 절차:
 *   1. 배열 맨 위(index 0)에 entry 한 개 추가 — 역연대기 순서.
 *   2. 필수 필드: slug / year / date / category / headline.
 *   3. 선택 필드:
 *      - body: 본문 1~3 문장 (없으면 헤드라인만 표시)
 *      - links: 외부 링크 배열 (DOI / 보도자료 / 공지 등)
 *      - photoCount: 0~3. >0이면 src/assets/news/<slug>-<i>.{jpg,jpeg,png,webp}로 사진 업로드.
 *      - featured: true면 좌측 코랄 보더 + cream-200 배경으로 강조 (월에 1~2건만 권장).
 *   4. category는 paper / award / media / member / event / grant / lab 중 선택.
 *      기존 카테고리에 없는 게 필요하면 src/pages/news.astro의 CATEGORY_LABELS에 추가.
 *
 * 사진 업로드: src/assets/news/README.md 참고.
 */

export type NewsCategory =
  | 'paper'
  | 'award'
  | 'media'
  | 'member'
  | 'event'
  | 'grant'
  | 'lab';

export interface NewsEntry {
  slug: string;          // src/assets/news/<slug>-<i> + anchor #news-<slug>
  year: number;
  date: string;          // 화면 표기 (verbatim) — 'Feb 19, 2025' / 'February 2026' 자유
  category: NewsCategory;
  headline: string;
  body?: string;
  links?: Array<{ href: string; label: string }>;
  photoCount?: number;
  featured?: boolean;
}

export const newsEntries: NewsEntry[] = [
  // ─────────────── 2026 ───────────────
  {
    slug: '2026-rpp-silver-films',
    year: 2026,
    date: 'February 2026',
    category: 'paper',
    headline:
      'Reports on Progress in Physics features our work on grain-boundary-free silver thin films',
    body: 'Our paper on homoepitaxy-like heteroepitaxy via monolayer interface — enabling wafer-scale, atomically flat, grain-boundary-free silver films on Cu buffers — appears in Reports on Progress in Physics, with coverage in Physics World.',
    links: [
      {
        href: 'https://iopscience.iop.org/article/10.1088/1361-6633/ae3e3d',
        label: 'IOP',
      },
      {
        href: 'https://physicsworld.com/a/strain-engineered-single-crystal-silver-films/',
        label: 'Physics World',
      },
    ],
    photoCount: 0,
    featured: true,
  },
  {
    slug: '2026-eels-school-graz',
    year: 2026,
    date: 'February 10–13, 2026',
    category: 'event',
    headline: 'Eun-Byeol and Yerin attend the European EELS & EFTEM School',
    body: 'Eun-Byeol Park and Yerin Jeon represent the lab at the European EELS & EFTEM School at TU Graz, Austria — a week of hands-on training in electron energy-loss spectroscopy.',
    photoCount: 1,
  },
  {
    slug: '2026-bk-thesis-awards',
    year: 2026,
    date: 'January 15, 2026',
    category: 'award',
    headline: 'Two awards at the 11th BK DOES Thesis Competition',
    body: 'Yerin Jeon received the Excellence Award (oral) and Eun-Byeol Park received the Encouragement Award (poster) at the 11th BK Department of Energy Science Thesis Competition in Suwon.',
    photoCount: 2,
  },

  // ─────────────── 2025 ───────────────
  {
    slug: '2025-natcomm-cu-monolayer',
    year: 2025,
    date: 'February 2025',
    category: 'paper',
    headline:
      'Nature Communications: an impermeable copper surface monolayer with high-temperature oxidation resistance',
    body: 'Our latest collaboration on copper surface chemistry is published in Nature Communications — an impermeable copper monolayer that resists oxidation up to high temperatures.',
    links: [
      {
        href: 'https://www.nature.com/articles/s41467-025-56709-w',
        label: 'Nature',
      },
    ],
    featured: true,
  },
  {
    slug: '2025-fellowship',
    year: 2025,
    date: 'February 19, 2025',
    category: 'award',
    headline: 'Prof. Young-Min Kim selected as 2024 SKKU Fellowship',
    body: 'Prof. Young-Min Kim was named a 2024 SKKU Fellowship recipient — a university-level recognition of research excellence at Sungkyunkwan University.',
    photoCount: 1,
  },
  {
    slug: '2025-cnms-ornl',
    year: 2025,
    date: 'June 4–16, 2025',
    category: 'event',
    headline:
      'Lab visits Oak Ridge National Laboratory for a CNMS user project',
    body: 'Sang-Hyeok Yang, Min-Hyoung Jung, Eun-Byeol Park, and Yerin Jeon spent two weeks at Oak Ridge National Laboratory through the Center for Nanophase Materials Sciences (CNMS) user program.',
    photoCount: 1,
  },
  {
    slug: '2025-mm-salt-lake',
    year: 2025,
    date: 'July 27–31, 2025',
    category: 'event',
    headline: 'Lab presents at M&M 2025 in Salt Lake City',
    body: 'Min-Hyoung Jung gave an oral presentation and Sang-Hyeok Yang presented a poster at Microscopy & Microanalysis 2025.',
    photoCount: 0,
  },
  {
    slug: '2025-graduations',
    year: 2025,
    date: 'February 2025',
    category: 'member',
    headline: 'Congratulations to our 2025 graduates',
    body: 'Sang-Hyeok Yang, Hee-Beom Lee, and Hyeon-Ah Ju completed their doctoral studies in early 2025 — best wishes for the next chapter at KRISS, Lam Research, and KAIST.',
    photoCount: 3,
  },
];
