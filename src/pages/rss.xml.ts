// News RSS 2.0 feed — News collection을 frontmatter (headline + summary) 기반으로 export
// pubDate는 frontmatter date를 그대로 사용 — 최신 날짜 내림차순 정렬
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const items = (await getCollection('news'))
    .map((e) => e.data)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return rss({
    title: 'SKKU-STEM Lab — News',
    description:
      'Lab news from the SKKU-STEM Laboratory at Sungkyunkwan University — papers, awards, talks, member milestones, and events.',
    site: context.site!,
    // anchor 뒤에 trailing slash 붙는 것 방지 — 모든 link는 직접 작성한 형식 그대로
    trailingSlash: false,
    items: items.map((it) => ({
      title: it.headline,
      description: it.summary ?? '',
      pubDate: it.date,
      link: `/news/#news-${it.slug}`,
      categories: [it.category],
    })),
    customData: '<language>en-us</language>',
  });
}
