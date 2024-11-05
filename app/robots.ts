import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const domainMap = {
    bailiffbridgedental: 'https://bailiffbridgedental.netlify.app/',
    oaklandsdentalhudds: 'https://oaklandsdentalhudds.co.uk/',
    lahoreclinic:'https://clinicbuilder-next.netlify.app/'
  };

  const currentDomain = process.env.NEXT_PUBLIC_DOMAIN; // Assuming this is set to the appropriate domain
  const siteUrl = domainMap[currentDomain]; // Fallback to grayphite if currentDomain is not in domainMap

  return {
    rules: {
      userAgent: '*',
      // allow: '/', // Allow crawling for all user agents
      allow: ['/about-us', '/team', '/testimonials', '/services', '/blogs', '/information'], // Add more routes as needed
      disallow: [
        // Add disallow rules if needed
      ],
    },
    host: siteUrl.replace(/^https?:\/\//, ''),
    sitemap: `${siteUrl}sitemap.xml`, // Append sitemap path to the siteUrl
  };
}
