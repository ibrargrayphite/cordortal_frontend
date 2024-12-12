import styles from "./blogDetail.module.css";
import { Col, Container, Row } from "react-bootstrap";
import HtmlContent from "../../components/HtmlContent";
import { fetchPagesData } from "../../utils/fetchPagesData";
import { generateCustomMetadata } from "../../utils/metadataHelper";
import dynamic from 'next/dynamic';
const ScrollHandler = dynamic(() => import("../../components/ScrollHandler"));

// This function is responsible for generating static paths for each blog
export async function generateStaticParams() {
  const pageName = "blogs";
  const data = await fetchPagesData();
  const filteredLocations = filterByPage(data, pageName);

  const contentArray = filteredLocations.length > 0 ? filteredLocations[0].content : [];
  const blogData = contentArray.find((block) => block.component === "BlogCards") || { blogs: [] };

  const allBlogs = blogData.blogs.length > 0 
    ? blogData.blogs 
    : [
        { slug: "blog-1" },
        { slug: "blog-2" },
        { slug: "blog-3" },
      ];

  return allBlogs.map((blog) => ({
    blogName: blog.slug.replace(/^\/+/, ""),
  }));
}

// Set revalidation interval for ISR
export const revalidate = 60;

// Generate dynamic metadata based on blog slug
export async function generateMetadata({ params }) {
  const { blogName } = params; // Extract the blogName parameter directly from params
  const currentPage = `/${blogName}`;
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

const BlogDetail = async ({ params }) => {
  const { blogName } = params; // Extract blogName from params

  const pageName = "blogs";
  const data = await fetchPagesData();
  const filteredLocations = filterByPage(data, pageName);
  const contentArray = filteredLocations.length > 0 ? filteredLocations[0].content : [];
  const blogData = contentArray.find((block) => block.component === "BlogCards") || { blogs: [] };
  const allBlogs = blogData.blogs || [];
  const specificBlog = allBlogs.find((blog) => blog.slug.replace(/^\/+/, "") === blogName);

  if (!specificBlog) {
    return <div>Blog not found.</div>;
  }

  return (
    <Container>
      <ScrollHandler sectionScroll={null} scrollToCenter={true} />
      <Row className={styles.customMargin}>
        <Col lg={8}>
          <HtmlContent htmlContent={specificBlog.htmlContent} />
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
