// Astro Content Collections — Decap CMS 도입을 위해 src/data/*.ts 데이터를 이전한 결과 스키마.
// 각 페이지는 getCollection('<name>')으로 entry[]를 받아 entry.data를 사용한다.
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// JSON 파일은 { "items": [...] } 래퍼 형식 (Sveltia/Decap file collection이 객체 루트를 요구).
// Astro에 array를 돌려주기 위해 parser로 items를 풀어준다.
const itemsParser = (text: string) => JSON.parse(text).items;

// Sveltia CMS는 빈 optional URL 필드를 ''로 저장하므로 .url() 검증 전 undefined로 정규화한다.
const optionalUrl = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.string().url().optional(),
);

// Sveltia CMS는 빈 optional enum 필드도 ''로 저장하므로 enum 검증 전 undefined로 정규화한다.
const optionalEnum = <T extends [string, ...string[]]>(values: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), z.enum(values).optional());

// ─────────── Publications: SKKU 시기 SCI 논문 ───────────
const publicationsSkku = defineCollection({
  loader: file('src/content/publications/skku.json', { parser: itemsParser }),
  schema: z.object({
    number: z.number(),
    year: z.number(),
    authors: z.string(),
    title: z.string(),
    journal: z.string(),
    volumePages: z.string().optional(),
    doi: optionalUrl,
    lead: z.boolean(),
  }),
});

// ─────────── Publications: Pre-SKKU SCI 논문 ───────────
const publicationsBeforeSkku = defineCollection({
  loader: file('src/content/publications/before-skku.json', { parser: itemsParser }),
  schema: z.object({
    number: z.number(),
    year: z.number(),
    authors: z.string(),
    title: z.string(),
    journal: z.string(),
    volumePages: z.string().optional(),
    doi: optionalUrl,
    lead: z.boolean(),
  }),
});

// ─────────── Publications: Non-SCI / 특허 / 단행본 ───────────
const publicationsNonSciPatents = defineCollection({
  loader: file('src/content/publications/non-sci-patents.json', { parser: itemsParser }),
  schema: z.object({
    number: z.number(),
    year: z.number(),
    kind: z.enum(['non-sci', 'patent', 'book']),
    title: z.string(),
    titleEn: z.string().optional(),
    link: optionalUrl,
    // patent 전용
    region: optionalEnum(['Korea', 'USA']),
    inventors: z.string().optional(),
    patentNo: z.string().optional(),
    applicationNo: z.string().optional(),
    applicationDate: z.string().optional(),
    registrationNo: z.string().optional(),
    registrationDate: z.string().optional(),
    status: optionalEnum(['Granted', 'Applied']),
    // non-sci / book 전용
    authors: z.string().optional(),
    journal: z.string().optional(),
    volumePages: z.string().optional(),
    publisher: z.string().optional(),
    isbn: z.string().optional(),
    publicationDate: z.string().optional(),
  }),
});

// ─────────── Publications: PI Selected (CV 페이지 노출) ───────────
const publicationsPiSelected = defineCollection({
  loader: file('src/content/publications/pi-selected.json', { parser: itemsParser }),
  schema: z.object({
    category: z.enum(['microscopy', 'ai']),
    order: z.number(), // 표시 순서 (작은 값이 위)
    authors: z.string(),
    title: z.string(),
    journal: z.string(),
    year: z.number(),
    volumePages: z.string().optional(),
    doi: optionalUrl,
  }),
});

// ─────────── News ───────────
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    slug: z.string(),
    // 정렬 키 — CMS datetime 위젯이 'YYYY-MM-DD'로 저장한다. 페이지는 이 값으로 최신 날짜 내림차순 자동 정렬하고, year는 여기서 파생한다.
    date: z.coerce.date(),
    // 표시용 라벨(선택) — 기간("June 4–16, 2025")이나 월만("February 2025") 표기가 필요할 때 date 포맷을 덮어쓴다.
    dateLabel: z.string().optional(),
    category: z.enum(['paper', 'award', 'media', 'member', 'event', 'grant', 'lab']),
    headline: z.string(),
    // 'body'는 Sveltia/Decap이 markdown body로 예약한 이름이라 'summary'로 둔다.
    summary: z.string().optional(),
    links: z
      .array(
        z.object({
          href: z.string().url(),
          label: z.string(),
        })
      )
      .optional(),
    // 이미지/GIF/YouTube 혼합 미디어 (MediaCarousel). image는 public 경로(/news-media/...), youtube는 URL/ID.
    media: z
      .array(
        z.object({
          image: z.string().optional(),
          youtube: z.string().optional(),
          alt: z.string().optional(),
        })
      )
      .optional(),
    featured: z.boolean().optional(),
  }),
});

// ─────────── Members (현 멤버 + Alumni 통합) ───────────
const members = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/members' }),
  schema: z.object({
    section: z.enum(['postdoc', 'phd', 'undergrad', 'alumni']),
    // 현 멤버 입학 연·월 — 섹션 내 정렬 키이자 연차/기수 자동 계산 기준. alumni는 비우고 role의 종료연도로 정렬한다.
    startDate: z.coerce.date().optional(),
    nameKo: z.string(),
    nameEn: z.string(),
    // 현 멤버
    position: z.string().optional(),
    program: z.string().optional(),
    // Postdoc 등 종료 연도가 있는 경우만 사용. 학생은 startDate에서 "입학연도–present"를 자동 표시한다.
    yearRange: z.string().optional(),
    email: z.string().optional(),
    orcid: z.string().optional(),
    kri: z.string().optional(),
    coAdvisor: z.string().optional(),
    photoPath: z.string().optional(),
    // Alumni 전용
    role: z.string().optional(),
    currentAffiliation: z.string().optional(),
  }),
});

// ─────────── Research Themes (그룹 thrust 5개) ───────────
const researchThemes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research-themes' }),
  schema: z.object({
    order: z.number(),
    slug: z.string(),
    title: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    // 관련 highlights 슬러그 배열 — 페이지 렌더 시 timeline의 가장 최신 연도를 anchor로 사용
    relatedHighlights: z.array(z.string()),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

// ─────────── Research Highlights ───────────
const researchHighlights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research-highlights' }),
  schema: z.object({
    // 발행 연·월 — 최신 날짜 내림차순 자동 정렬 키. year는 여기서 파생한다. (월·일은 카드에 표시하지 않음)
    date: z.coerce.date(),
    title: z.string(),
    summary: z.string(),
    journal: z.string(),
    volumePages: z.string(),
    doi: z.string().url(),
    // Sveltia CMS는 빈 optional URL 필드를 ''로 저장 → preprocess로 undefined 정규화 후 URL 검증.
    codeUrl: z.preprocess((v) => (v === '' ? undefined : v), z.string().url().optional()),
    mention: z.string().optional(),
    mentionUrl: z.preprocess((v) => (v === '' ? undefined : v), z.string().url().optional()),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

// ─────────── Facilities ───────────
const facilities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/facilities' }),
  schema: z.object({
    order: z.number(),
    slug: z.string(),
    title: z.string(),
    model: z.string(),
    description: z.string(),
    highlights: z.array(z.string()).optional(),
    location: z.string().optional(),
    photoCount: z.number(),
  }),
});

// ─────────── Gallery Events ───────────
const galleryEvents = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery-events' }),
  schema: z.object({
    slug: z.string(),
    // 정렬 키 — CMS datetime 위젯이 'YYYY-MM-DD'로 저장한다. 페이지는 이 값으로 최신 날짜 내림차순 자동 정렬하고, year는 여기서 파생한다.
    date: z.coerce.date(),
    // 표시용 라벨(선택) — 연도/월만 표기나 기간("Nov. 3–5, 2021") 등 자유 표기가 필요할 때 date 포맷을 덮어쓴다.
    dateLabel: z.string().optional(),
    title: z.string(),
    titleEn: z.string().optional(),
    location: z.string().optional(),
    participants: z.string().optional(),
    awards: z.string().optional(),
    // 이미지/GIF/YouTube 혼합 미디어 (MediaCarousel). image는 public 경로(/gallery-media/...).
    media: z
      .array(
        z.object({
          image: z.string().optional(),
          youtube: z.string().optional(),
          alt: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const collections = {
  'publications-skku': publicationsSkku,
  'publications-before-skku': publicationsBeforeSkku,
  'publications-non-sci-patents': publicationsNonSciPatents,
  'publications-pi-selected': publicationsPiSelected,
  news,
  members,
  'research-themes': researchThemes,
  'research-highlights': researchHighlights,
  facilities,
  'gallery-events': galleryEvents,
};
