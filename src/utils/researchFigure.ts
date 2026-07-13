// research-highlights 이미지 파일명을 빌드타임 최적화 이미지(ImageMetadata)로 해석하는 공용 유틸
import type { ImageMetadata } from 'astro';

// src/assets/research/* 의 모든 figure 파일을 build-time에 eager-load
const figureModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/research/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

// 맨 파일명('2026-foo.png')이든 접두 경로('/research/2026-foo.png')든 basename으로 해석한다.
export const getResearchFigure = (path?: string): ImageMetadata | null => {
  if (!path) return null;
  const base = path.split('/').pop();
  if (!base) return null;
  return figureModules[`/src/assets/research/${base}`]?.default ?? null;
};
