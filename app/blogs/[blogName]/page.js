import styles from "./BlogDetail.module.css"; // Ensure proper casing for CSS module
import currentLocation from "../../data"; // Your data source
import { Col, Container, Row } from "react-bootstrap";
import HtmlContent from "../../components/HtmlContent";

// Generates static paths for each blog
export async function generateStaticParams() {
  // Check if you have filteredLocations data
  const pageName = "blogs";
  const filteredLocations = filterByPage(currentLocation, pageName);

  // If no data is available, fallback to hardcoded data
  const contentArray = filteredLocations.length > 0 ? filteredLocations[0].content : [];

  // If you still don't have any blog data, use hardcoded data
  const blogData = contentArray.find((block) => block.component === "BlogCards") || { blogs: [] };

  const allBlogs = blogData.blogs.length > 0 
    ? blogData.blogs 
    : [
        { slug: "blog-1" },
        { slug: "blog-2" },
        { slug: "blog-3" },
        // Add more hardcoded blog slugs here as needed
      ];

  // Return the blog slugs
  return allBlogs.map((blog) => ({
    blogName: blog.slug.replace(/^\/+/, ""), // Remove leading slash if any
  }));
}


// Set revalidation interval for ISR
export const revalidate = 60; // Revalidate every 60 seconds

// SEO configuration
const SEO_CONFIG = currentLocation.SEO_CONFIG || {};
// const currentSeo = SEO_CONFIG['/services'];

// export async function generateMetadata({params}) {
//   const { blogName } = params;
//   const currentSeo = SEO_CONFIG[`/${blogName}`] || {};

//   return {
//     title: currentSeo.title,
//     description: currentSeo.description,
//     keywords: currentSeo.keywords,
//     image: "https://example.com/images/services.png", // Update with a relevant image
//     url: currentSeo.canonical,
//   };
// }
export async function generateMetadata({params}) {
    const { blogName } = params;
  const currentSeo = SEO_CONFIG[`/${blogName}`] || {};
  const fav = currentLocation?.favIcon.src

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": currentSeo.title,
    "description": currentSeo.description,
    "url": currentSeo.url,
    "image": currentLocation.media?.headerLogo,
  };

  return {
    title: currentSeo?.title ?? 'need seo title',
    description: currentSeo?.description ?? "need seo description",
    keywords: currentSeo?.keywords ?? "need seo keywords",
    viewport: "width=device-width, initial-scale=1",
    robots: "index, follow",
    openGraph: {
      title: currentSeo?.title ?? 'need seo title',
      description: currentSeo?.description ?? "need seo description",
      url: currentSeo?.url ?? "need seo url",
      type: "website",
      images: [
        {
          url: currentLocation?.media?.headerLogo ?? "https://example.com/images/fallback.png",
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentSeo?.title ?? 'need seo title',
      description: currentSeo?.description ?? "need seo description",
      images: [currentLocation?.media?.headerLogo ?? "https://example.com/images/fallback.png"],
    },
    alternates: {
      canonical: currentSeo?.canonical ?? "https://yourwebsite.com",
      languages: {
        "en": "https://yourwebsite.com/en/page",
        "es": "https://yourwebsite.com/es/page",
      },
    },
    verification: {
      google: "your-google-site-verification-code",
      bing: "your-bing-site-verification-code",
    },
    icons: {
      icon: fav ?? "https://example.com/favicon.ico",
    },
    structuredData: JSON.stringify(structuredData),
  };
}

const BlogDetail = async ({ params }) => {
  const { blogName } = params;

  const pageName = "blogs";
  const filteredLocations = filterByPage(currentLocation, pageName);
  const contentArray = filteredLocations.length > 0 ? filteredLocations[0].content : [];
  const blogData = contentArray.find((block) => block.component === "BlogCards");
  const allBlogs = blogData?.blogs || [];
  const specificBlog = allBlogs.find((blog) => blog.slug.replace(/^\/+/, "") === blogName);

  if (!specificBlog) {
    return <div>Blog not found.</div>;
  }

  return (
    <Container>
      <Row className={styles.customMargin}>
        <Col lg={8}>
          <HtmlContent htmlContent={specificBlog.description} />
        </Col>
        <Col lg={4}>
          <h5 className={styles.heading}>Category</h5>
          <div style={{ marginBottom: "20px" }}>
            <p className={styles.listing}>{specificBlog.category.name}</p>
          </div>
          <h5 className={styles.heading}>Tags</h5>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {specificBlog.tags.map((tag, index) => (
              <div key={index} className={styles.listing}>{tag.name}</div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

// Helper function to filter data
function filterByPage(locationData, pageName) {
  const { pages } = locationData;
  if (!Array.isArray(pages)) return [];
  return pages.filter((page) => page.pageName === pageName).map((page) => ({
    ...page,
    content: page.content || [],
  }));
}

export default BlogDetail;
