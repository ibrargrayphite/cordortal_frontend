import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  

  return {
    rules: {
      userAgent: '*',
      // allow: '/', // Allow crawling for all user agents
      allow: ['/about-us', '/team', '/testimonials', '/services', '/blogs', '/information'], // Add more routes as needed
      disallow: [
        // Add disallow rules if needed
      ],
    },
    host: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`, // Append sitemap path to the siteUrl
  };
}
