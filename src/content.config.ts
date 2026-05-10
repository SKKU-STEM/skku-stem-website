// Astro Content Collections — Decap CMS 도입을 위해 src/data/*.ts 데이터를 이전한 결과 스키마.
// 각 페이지는 getCollection('<name>')으로 entry[]를 받아 entry.data를 사용한다.
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// ─────────── Publications: SKKU 시기 SCI 논문 ───────────
const publicationsSkku = defineCollection({
  loader: file('src/content/publications/skku.json'),
  schema: z.object({
    number: z.number(),
    year: z.number(),
    authors: z.string(),
    title: z.string(),
    journal: z.string(),
    volumePages: z.string().optional(),
    doi: z.string().url().optional(),
    lead: z.boolean(),
  }),
});

// ─────────── Publications: Pre-SKKU SCI 논문 ───────────
const publicationsBeforeSkku = defineCollection({
  loader: file('src/content/publications/before-skku.json'),
  schema: z.object({
    number: z.number(),
    year: z.number(),
    authors: z.string(),
    title: z.string(),
    journal: z.string(),
    volumePages: z.string().optional(),
    doi: z.string().url().optional(),
    lead: z.boolean(),
  }),
});

// ─────────── Publications: Non-SCI / 특허 / 단행본 ───────────
const publicationsNonSciPatents = defineCollection({
  loader: file('src/content/publications/non-sci-patents.json'),
  schema: z.object({
    number: z.number(),
    year: z.number(),
    kind: z.enum(['non-sci', 'patent', 'book']),
    title: z.string(),
    titleEn: z.string().optional(),
    link: z.string().url().optional(),
    // patent 전용
    region: z.enum(['Korea', 'USA']).optional(),
    inventors: z.string().optional(),
    patentNo: z.string().optional(),
    applicationNo: z.string().optional(),
    applicationDate: z.string().optional(),
    registrationNo: z.string().optional(),
    registrationDate: z.string().optional(),
    status: z.enum(['Granted', 'Applied']).optional(),
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
  loader: file('src/content/publications/pi-selected.json'),
  schema: z.object({
    category: z.enum(['microscopy', 'ai']),
    order: z.number(), // 표시 순서 (작은 값이 위)
    authors: z.string(),
    title: z.string(),
    journal: z.string(),
    year: z.number(),
    volumePages: z.string().optional(),
    doi: z.string().url().optional(),
  }),
});

// ─────────── News ───────────
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    order: z.number(),
    slug: z.string(),
    year: z.number(),
    date: z.string(),
    category: z.enum(['paper', 'award', 'media', 'member', 'event', 'grant', 'lab']),
    headline: z.string(),
    body: z.string().optional(),
    links: z
      .array(
        z.object({
          href: z.string().url(),
          label: z.string(),
        })
      )
      .optional(),
    photoCount: z.number().optional(),
    featured: z.boolean().optional(),
  }),
});

// ─────────── Members (현 멤버 + Alumni 통합) ───────────
const members = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/members' }),
  schema: z.object({
    section: z.enum(['postdoc', 'phd', 'undergrad', 'alumni']),
    order: z.number(),
    nameKo: z.string(),
    nameEn: z.string(),
    // 현 멤버
    position: z.string().optional(),
    program: z.string().optional(),
    yearRange: z.string().optional(),
    email: z.string().optional(),
    orcid: z.string().optional(),
    kri: z.string().optional(),
    coAdvisor: z.string().optional(),
    portrait: z.string().optional(),
    photoPath: z.string().optional(),
    // Alumni 전용
    role: z.string().optional(),
    currentAffiliation: z.string().optional(),
  }),
});

// ─────────── Research Highlights ───────────
const researchHighlights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research-highlights' }),
  schema: z.object({
    order: z.number(),
    year: z.number(),
    title: z.string(),
    summary: z.string(),
    journal: z.string(),
    volumePages: z.string(),
    doi: z.string().url(),
    codeUrl: z.string().url().optional(),
    mention: z.string().optional(),
    mentionUrl: z.string().url().optional(),
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
    order: z.number(),
    slug: z.string(),
    year: z.number(),
    date: z.string(),
    title: z.string(),
    titleEn: z.string().optional(),
    location: z.string().optional(),
    participants: z.string().optional(),
    awards: z.string().optional(),
    photoCount: z.number(),
  }),
});

export const collections = {
  'publications-skku': publicationsSkku,
  'publications-before-skku': publicationsBeforeSkku,
  'publications-non-sci-patents': publicationsNonSciPatents,
  'publications-pi-selected': publicationsPiSelected,
  news,
  members,
  'research-highlights': researchHighlights,
  facilities,
  'gallery-events': galleryEvents,
};
