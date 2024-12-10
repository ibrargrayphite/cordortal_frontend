import { generateCustomMetadata } from "./utils/metadataHelper";
import Home from "./components/HomePage"; // Import the client-side component

export async function generateMetadata() {
  // Fetch data for metadata generation
  const currentPage = '/';
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

// Export the Home component as the default export
export default function Page() {
  return <Home />;
}
