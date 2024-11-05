import type { MetadataRoute } from 'next';
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // single page 
    {
      url: 'https://clinicbuilder-next.netlify.app/',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/about-us',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/team',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/emergency',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // dynamic page services , blogs , information
    // services
    {
      url: 'https://clinicbuilder-next.netlify.app/services',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },


    {
      url: 'https://clinicbuilder-next.netlify.app/services/implants',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/services/smile',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/services/clear-aligners',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/services/composite-bonding',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/services/teeth-whitening',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/services/restorative-dentistry',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/services/family-care',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/services/minor-oral-surgery',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/services/sedation',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // information
    {
      url: 'https://clinicbuilder-next.netlify.app/information',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/information/pricing',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/information/nhs',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/information/tabeo',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/information/finance',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/information/forpatient',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // blogs
    {
      url: 'https://clinicbuilder-next.netlify.app/blogs',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/blogs/oral-health-care',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/blogs/preventive-dentistry',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/blogs/oral-hygiene-tips',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/blogs/orthodontics',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/blogs/post-orthodontic-care',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/blogs/dental-health-awareness',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://clinicbuilder-next.netlify.app/blogs/pediatric-dentistry',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    
  ];
}
