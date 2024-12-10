import { generateCustomMetadata } from "../utils/metadataHelper";
import AboutUs from "../components/AboutUsPage"; // Import the client-side component

export async function generateMetadata() {
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
