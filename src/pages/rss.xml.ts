// News RSS 2.0 feed — News collection을 frontmatter (headline + summary) 기반으로 export
// pubDate는 (year, order)로 합성: order=1이 가장 최신 → year-12-28, 이후 하루씩 과거로
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

function synthPubDate(year: number, order: number): Date {
  const d = new Date(Date.UTC(year, 11, 28));
  d.setUTCDate(d.getUTCDate() - (order - 1));
  return d;
}

export async function GET(context: APIContext) {
  const items = (await getCollection('news'))
    .map((e) => e.data)
    .sort((a, b) => a.order - b.order);

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
      pubDate: synthPubDate(it.year, it.order),
      link: `/news/#news-${it.slug}`,
      categories: [it.category],
    })),
    customData: '<language>en-us</language>',
  });
}
