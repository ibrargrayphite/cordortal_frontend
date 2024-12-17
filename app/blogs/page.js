import dynamic from 'next/dynamic';
const Blogs = dynamic(() => import("../components/BlogPage"));

export async function generateMetadata() {
  const { generateCustomMetadata } = await import("../utils/metadataHelper");

  const currentPage = "/blogs";
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

export default function Page() {
  return <Blogs />;
}
