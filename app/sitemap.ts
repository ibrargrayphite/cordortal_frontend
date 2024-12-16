import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
const currentDomain = process.env.NEXT_PUBLIC_DOMAIN;

async function fetchSlugs() {

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/template/page/slugs?domain=${currentDomain}`
  );
  const data = await response.json();
  return data.slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await fetchSlugs();


  const pages = slugs.map((slug) => {
    // Remove extra slash for the root slug
    const path = slug === '/' ? '' : `/${slug}`;
    return {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    };
  });

  return pages;
}
