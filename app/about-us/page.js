import dynamic from 'next/dynamic';
const AboutUs = dynamic(() => import("../components/AboutUsPage"));

export async function generateMetadata() {
  const { generateCustomMetadata } = await import("../utils/metadataHelper");

  // Fetch data for metadata generation
  const currentPage = "/about-us";
  const meta = await generateCustomMetadata(currentPage);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    robots: meta.robots,
    openGraph: meta.openGraph,
    twitter: meta.twitter,
    alternates: meta.alternates,
    verification: meta.verification,
    icons: meta.icons,
    structuredData: meta.structuredData,
  };
}

// Export the AboutUs component as the default export
export default function Page() {
  return <AboutUs />;
}
