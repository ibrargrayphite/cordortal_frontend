import { generateCustomMetadata } from "../utils/metadataHelper";
import Pricing from "../components/InformationPage"; // Import the client-side component

export async function generateMetadata() {
  const currentPage = "/information";
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
  return <Pricing />;
}
