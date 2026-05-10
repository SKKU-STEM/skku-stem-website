// src/data/*.ts 데이터를 Astro Content Collections(src/content/*)로 이전하는 일회성 스크립트.
// 실행: npx tsx scripts/migrate-to-content.ts (저장소 루트에서)
//
// 산출:
//   src/content/publications/{skku,before-skku,non-sci-patents,pi-selected}.json
//   src/content/news/<slug>.md
//   src/content/research-highlights/<slug>.md
//   src/content/facilities/<slug>.md
//   src/content/gallery-events/<slug>.md
//   src/content/members/<id>.md
//
// 멤버 데이터는 현재 src/pages/people/index.astro 안에 인라인되어 있어 import할 수 없으므로
// 본 스크립트에 직접 복제했다. 마이그레이션 후 .astro의 인라인 데이터는 제거된다.

import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { skkuPublications } from '../src/data/publications-skku.ts';
import { preSkkuPublications } from '../src/data/publications-pre-skku.ts';
import { nonSciAndPatents } from '../src/data/publications-non-sci-patents.ts';
import {
  microscopyMaterialsScience,
  aiMicroscopy,
} from '../src/data/pi-publications.ts';
import { newsEntries } from '../src/data/news.ts';
import { highlights as researchHighlights } from '../src/data/research-highlights.ts';
import { facilityEquipment } from '../src/data/facilities.ts';
import { galleryEvents } from '../src/data/gallery-events.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'src', 'content');

// ─────────────── helpers ───────────────

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const yaml = (value: unknown, indent = 0): string => {
  const pad = ' '.repeat(indent);
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') {
    if (
      value === '' ||
      /[:#\-?&*!|>'"%@`,\[\]\{\}\n]/.test(value) ||
      /^\s|\s$/.test(value) ||
      /^[\d.+-]/.test(value) ||
      ['true', 'false', 'null', 'yes', 'no'].includes(value.toLowerCase())
    ) {
      // quote with double quotes; escape \ and "
      return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    }
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return (
      '\n' +
      value
        .map((item) => {
          if (
            item !== null &&
            typeof item === 'object' &&
            !Array.isArray(item)
          ) {
            const entries = Object.entries(item as unknown as Record<string, unknown>);
            const first = entries[0];
            const rest = entries.slice(1);
            const firstLine = `${pad}- ${first[0]}: ${yaml(first[1], indent + 2)}`;
            const restLines = rest
              .map((e) => `${pad}  ${e[0]}: ${yaml(e[1], indent + 2)}`)
              .join('\n');
            return restLines ? `${firstLine}\n${restLines}` : firstLine;
          }
          return `${pad}- ${yaml(item, indent + 2)}`;
        })
        .join('\n')
    );
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as unknown as Record<string, unknown>).filter(
      ([, v]) => v !== undefined
    );
    if (entries.length === 0) return '{}';
    return (
      '\n' +
      entries
        .map(([k, v]) => `${pad}${k}: ${yaml(v, indent + 2)}`)
        .join('\n')
    );
  }
  return String(value);
};

const frontmatter = (data: Record<string, unknown>, body = ''): string => {
  const cleaned = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  const lines: string[] = ['---'];
  for (const [k, v] of Object.entries(cleaned)) {
    lines.push(`${k}: ${yaml(v, 2)}`);
  }
  lines.push('---', '');
  if (body) {
    lines.push(body.trim(), '');
  }
  return lines.join('\n');
};

const writeMd = async (
  dir: string,
  filename: string,
  data: Record<string, unknown>,
  body = ''
): Promise<void> => {
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${filename}.md`), frontmatter(data, body), 'utf8');
};

const writeJson = async (
  dir: string,
  filename: string,
  data: unknown
): Promise<void> => {
  await mkdir(dir, { recursive: true });
  await writeFile(
    join(dir, `${filename}.json`),
    JSON.stringify(data, null, 2) + '\n',
    'utf8'
  );
};

// ─────────────── members 데이터 (people/index.astro에서 복제) ───────────────

interface CurrentMember {
  nameKo: string;
  nameEn: string;
  position?: string;
  program: string;
  yearRange: string;
  email: string;
  orcid: string;
  kri?: string;
  coAdvisor?: string;
  portrait?: string;
  photoPath?: string;
}

interface AlumniMember {
  nameKo: string;
  nameEn: string;
  role: string;
  currentAffiliation?: string;
  email?: string;
  orcid?: string;
  portrait?: string;
  photoPath?: string;
}

const postdocs: CurrentMember[] = [
  {
    nameKo: '정민형',
    nameEn: 'Min-Hyoung Jung, Ph.D.',
    position: 'Postdoctoral researcher',
    program: 'Integrated course',
    yearRange: '2019–2025',
    email: 'jmh78989@g.skku.edu',
    orcid: '0000-0001-5227-8571',
    kri: '11907132',
    photoPath: '/members/MHJ.png',
  },
  {
    nameKo: '양대희',
    nameEn: 'Daehee Yang, Ph.D.',
    position: 'Postdoctoral researcher',
    program: 'Ph.D. course',
    yearRange: '2020–2026',
    email: 'daeheeyang@skku.edu',
    orcid: '0000-0002-0289-2458',
    kri: '11674426',
    photoPath: '/members/DY.jpg',
  },
];

const phdCandidates: CurrentMember[] = [
  {
    nameKo: '박은별',
    nameEn: 'Eun-Byeol Park',
    program: 'Integrated course',
    yearRange: '2021–present',
    email: 'peb0331@g.skku.edu',
    orcid: '0000-0002-1230-2570',
    kri: '12556811',
    photoPath: '/members/EBP.jpg',
  },
  {
    nameKo: '전예린',
    nameEn: 'Yerin Jeon',
    program: 'Integrated course',
    yearRange: '2023–present',
    email: 'rb4738@g.skku.edu',
    orcid: '0000-0001-9736-6460',
    kri: '12929522',
    photoPath: '/members/YRJ.jpg',
  },
  {
    nameKo: '최다혜',
    nameEn: 'Dahye Choi',
    program: 'Ph.D. course',
    yearRange: '2025–present',
    email: 'chlekgp0424@skku.edu',
    orcid: '0009-0007-8582-3768',
    kri: '12422800',
    photoPath: '/members/DHC.jpg',
  },
  {
    nameKo: '김항식',
    nameEn: 'Hang Sik Kim',
    program: 'Integrated course',
    yearRange: '2023–present',
    email: 'khs2565@skku.edu',
    orcid: '0000-0002-6659-3043',
    kri: '13012245',
    coAdvisor: 'Prof. Ki Kang Kim (SKKU)',
    photoPath: '/members/HSK.jpg',
  },
  {
    nameKo: '이하승',
    nameEn: 'Ha-Seung Lee',
    program: 'Integrated course',
    yearRange: '2025–present',
    email: 'hasgav9802@g.skku.edu',
    orcid: '0009-0009-4758-2080',
    kri: '13156595',
    photoPath: '/members/HSL.jpg',
  },
  {
    nameKo: '이왕빈',
    nameEn: 'Wang Been Lee',
    program: 'Integrated course',
    yearRange: '2025–present',
    email: 'lwb0908@g.skku.edu',
    orcid: '0009-0002-9934-4550',
    kri: '13169535',
    photoPath: '/members/WBL.jpg',
  },
  {
    nameKo: '김태준',
    nameEn: 'Taejoon Kim',
    program: 'Integrated course',
    yearRange: '2025–present',
    email: 'todoltj@g.skku.edu',
    orcid: '0009-0001-5615-7563',
    kri: '13256416',
    photoPath: '/members/TJK.jpg',
  },
  {
    nameKo: '노서정',
    nameEn: 'Seo jeong Ro',
    program: 'Integrated course',
    yearRange: '2026–present',
    email: 'ssojoya0630@g.skku.edu',
    orcid: '0009-0005-9326-2206',
    kri: '13282282',
    photoPath: '/members/SJR.jpg',
  },
  {
    nameKo: '박진우',
    nameEn: 'Jinwoo Park',
    program: 'Integrated course',
    yearRange: '2026–present',
    email: 'astin2001@g.skku.edu',
    orcid: '0009-0009-5456-4171',
    kri: '13354374',
    photoPath: '/members/JWP.jpg',
  },
  {
    nameKo: '윤주성',
    nameEn: 'Jooseong Yoon',
    program: 'Integrated course',
    yearRange: '2026–present',
    email: 'joosungyun@skku.edu',
    orcid: '0009-0002-7476-2625',
    kri: '13367526',
    photoPath: '/members/JSY.jpg',
  },
  {
    nameKo: '박준상',
    nameEn: 'Junsang Park',
    program: 'Integrated course',
    yearRange: '2026–present',
    email: 'wnstkd1347@g.skku.edu',
    orcid: '0009-0007-7805-135X',
    kri: '13232671',
    photoPath: '/members/JSP.jpg',
  },
  {
    nameKo: '정호현',
    nameEn: 'Hohyeon Jung',
    program: 'MS course',
    yearRange: '2026–present',
    email: 'police0830@naver.com',
    orcid: '0009-0004-9116-7021',
    kri: '13488154',
    photoPath: '/members/HHJ.jpg',
  },
];

const undergrads: CurrentMember[] = [
  {
    nameKo: '오윤기',
    nameEn: 'Yoonki Oh',
    program: 'Undergraduate researcher',
    yearRange: '2026–present',
    email: 'dhdbsrk@gmail.com',
    orcid: '0009-0009-9912-644X',
    kri: '13188125',
    photoPath: '/members/YKO.jpg',
  },
];

const alumni: AlumniMember[] = [
  {
    nameKo: '김선제 박사',
    nameEn: 'Seon Je Kim, Ph.D.',
    role: 'Integrated course · 2020–2026',
    currentAffiliation: 'Lam Research (2026–present)',
    email: 'muytjswp@skku.edu',
    orcid: '0000-0002-7756-5312',
  },
  {
    nameKo: '양상혁 박사',
    nameEn: 'Sang-Hyeok Yang, Ph.D.',
    role: 'Integrated course · 2019–2025',
    currentAffiliation:
      'Korea Research Institute of Standards and Science (KRISS, 2026–present)',
    email: '0412ysh@skku.edu',
    orcid: '0000-0002-6287-7612',
  },
  {
    nameKo: '이희범 박사',
    nameEn: 'Heebeom Lee, Ph.D.',
    role: 'Ph.D. course · 2020–2025',
    currentAffiliation: 'Lam Research (2025–present)',
    email: 'heebeom.lee@skku.edu',
    orcid: '0000-0002-5922-2076',
  },
  {
    nameKo: '주현아 박사',
    nameEn: 'Hyeon-Ah Ju, Ph.D.',
    role: 'Integrated course · 2019–2025',
    currentAffiliation: 'KAIST (2025–present)',
    email: 'hyeonah.ju@g.skku.edu',
    orcid: '0000-0002-5887-1162',
  },
  {
    nameKo: '이양진 박사',
    nameEn: 'Yangjin Lee, Ph.D.',
    role: 'Research Professor · 2024',
    currentAffiliation:
      'Korea Institute of Science and Technology (KIST, 2025–present)',
    email: 'moyh1331@gmail.com',
    orcid: '0000-0001-7336-1198',
  },
  {
    nameKo: '허유성',
    nameEn: 'Yuseong Heo',
    role: "Master's degree · 2023–2026",
    email: 'ysh7742@g.skku.edu',
    orcid: '0000-0003-2825-315X',
  },
  {
    nameKo: '최민영',
    nameEn: 'Min-Yeong Choi',
    role: "Master's degree · 2023–2025",
    currentAffiliation: 'National Nanofab Center (NNFC, 2026–present)',
    email: 'minzero@g.skku.edu',
    orcid: '0000-0002-3044-3860',
  },
  {
    nameKo: '최우선 박사',
    nameEn: 'Wooseon Choi, Ph.D.',
    role: 'MS-PhD Integrated course · 2017–2024',
    currentAffiliation: 'Samsung Electronics (2024–present)',
    email: 'wooseon@skku.edu',
    orcid: '0000-0001-8115-1596',
  },
  {
    nameKo: '김용인',
    nameEn: 'Yong In Kim',
    role: 'Researcher · 2018–2024',
    currentAffiliation: 'ENF Technology (2024–present)',
    email: 'panzeri@skku.edu',
  },
  {
    nameKo: '김영훈 박사',
    nameEn: 'Young-Hoon Kim, Ph.D.',
    role: 'MS-PhD Integrated course · 2018–2024',
    currentAffiliation: 'Oak Ridge National Laboratory, USA (2024–present)',
    email: 'di1147@skku.edu',
    orcid: '0000-0001-7343-1512',
  },
  {
    nameKo: '장우성 박사',
    nameEn: 'Woo-Sung Jang, Ph.D.',
    role: 'MS-PhD Integrated course · 2017–2023',
    currentAffiliation: 'Samsung Electronics (2023–present)',
    email: 'wsjang@skku.edu',
    orcid: '0000-0002-4209-6819',
  },
  {
    nameKo: '민태원 박사',
    nameEn: 'Taewon Min, Ph.D.',
    role: 'Postdoctoral researcher · 2021–2022',
    currentAffiliation: 'SK Hynix (2022–present)',
    email: 'teawon_min@pusan.ac.kr',
  },
  {
    nameKo: '홍정아',
    nameEn: 'Jung A. Hong',
    role: "Master's degree · 2020–2022",
    currentAffiliation: 'LG Energy Solution (2022–present)',
    email: 'junga4540@naver.com',
  },
  {
    nameKo: '한경탁',
    nameEn: 'Gyeongtak Han',
    role: "Master's degree · 2018–2020",
    currentAffiliation:
      'LG Energy Solution (2024–present); Samsung Electronics (2020–2023)',
    email: 'hantak666@gmail.com',
  },
  {
    nameKo: '심재현 교수',
    nameEn: 'Jae-Hyun Shim, Ph.D.',
    role: 'Research Professor · 2017',
    currentAffiliation:
      'Dong-shin University, Assistant Professor (2018–present)',
    email: 'jayonn.shim@gmail.com',
  },
];

// ─────────────── id 생성 ───────────────

const memberIdFromPhoto = (m: { photoPath?: string; nameEn: string }): string => {
  if (m.photoPath) {
    const base = m.photoPath.split('/').pop() ?? '';
    return base.replace(/\.[^.]+$/, '');
  }
  // fallback: nameEn 첫 글자들로 이니셜 + slug
  return slugify(m.nameEn);
};

// ─────────────── 변환 작업 ───────────────

const main = async (): Promise<void> => {
  // 기존 src/content 디렉토리(빈 placeholder) 정리
  for (const sub of [
    'publications',
    'news',
    'members',
    'research-highlights',
    'facilities',
    'gallery-events',
  ]) {
    const p = join(CONTENT, sub);
    if (existsSync(p)) {
      await rm(p, { recursive: true, force: true });
    }
  }

  // ─── Publications: SKKU SCI ───
  await writeJson(
    join(CONTENT, 'publications'),
    'skku',
    skkuPublications.map((p) => ({ id: String(p.number), ...p }))
  );

  // ─── Publications: Pre-SKKU SCI ───
  await writeJson(
    join(CONTENT, 'publications'),
    'before-skku',
    preSkkuPublications.map((p) => ({ id: String(p.number), ...p }))
  );

  // ─── Publications: Non-SCI / Patents / Books ───
  await writeJson(
    join(CONTENT, 'publications'),
    'non-sci-patents',
    nonSciAndPatents.map((p) => ({ id: String(p.number), ...p }))
  );

  // ─── Publications: PI Selected ───
  const piSelected = [
    ...microscopyMaterialsScience.map((p, i) => ({
      id: `microscopy-${String(i + 1).padStart(3, '0')}-${slugify(p.title).slice(0, 40)}`,
      category: 'microscopy' as const,
      order: i,
      ...p,
    })),
    ...aiMicroscopy.map((p, i) => ({
      id: `ai-${String(i + 1).padStart(3, '0')}-${slugify(p.title).slice(0, 40)}`,
      category: 'ai' as const,
      order: i,
      ...p,
    })),
  ];
  await writeJson(join(CONTENT, 'publications'), 'pi-selected', piSelected);

  // ─── News ───
  // body는 frontmatter 필드로 유지(짧은 단락이라 간단한 string 처리가 페이지 코드 단순)
  for (let i = 0; i < newsEntries.length; i++) {
    const n = newsEntries[i];
    await writeMd(
      join(CONTENT, 'news'),
      n.slug,
      { order: i, ...(n as unknown as Record<string, unknown>) },
      ''
    );
  }

  // ─── Research highlights ───
  for (let i = 0; i < researchHighlights.length; i++) {
    const h = researchHighlights[i];
    const slug = `${h.year}-${slugify(h.title).slice(0, 60)}`;
    await writeMd(
      join(CONTENT, 'research-highlights'),
      slug,
      { order: i, ...(h as unknown as Record<string, unknown>) },
      ''
    );
  }

  // ─── Facilities ───
  for (let i = 0; i < facilityEquipment.length; i++) {
    const f = facilityEquipment[i];
    await writeMd(
      join(CONTENT, 'facilities'),
      f.slug,
      { order: i, ...(f as unknown as Record<string, unknown>) },
      ''
    );
  }

  // ─── Gallery events ───
  for (let i = 0; i < galleryEvents.length; i++) {
    const g = galleryEvents[i];
    await writeMd(
      join(CONTENT, 'gallery-events'),
      g.slug,
      { order: i, ...(g as unknown as Record<string, unknown>) },
      ''
    );
  }

  // ─── Members ───
  const sections: Array<[string, CurrentMember[] | AlumniMember[]]> = [
    ['postdoc', postdocs],
    ['phd', phdCandidates],
    ['undergrad', undergrads],
    ['alumni', alumni],
  ];
  let memberOrder = 0;
  for (const [section, list] of sections) {
    for (let i = 0; i < list.length; i++) {
      const m = list[i];
      const id = memberIdFromPhoto(m as { photoPath?: string; nameEn: string });
      await writeMd(
        join(CONTENT, 'members'),
        id,
        {
          section,
          order: memberOrder++,
          ...(m as unknown as Record<string, unknown>),
        },
        ''
      );
    }
  }

  // 요약
  const counts = {
    'publications/skku.json': skkuPublications.length,
    'publications/before-skku.json': preSkkuPublications.length,
    'publications/non-sci-patents.json': nonSciAndPatents.length,
    'publications/pi-selected.json':
      microscopyMaterialsScience.length + aiMicroscopy.length,
    'news/*.md': newsEntries.length,
    'research-highlights/*.md': researchHighlights.length,
    'facilities/*.md': facilityEquipment.length,
    'gallery-events/*.md': galleryEvents.length,
    'members/*.md':
      postdocs.length + phdCandidates.length + undergrads.length + alumni.length,
  };
  console.log('Migration complete:');
  for (const [k, v] of Object.entries(counts)) {
    console.log(`  ${k}: ${v}`);
  }
};

await main();
