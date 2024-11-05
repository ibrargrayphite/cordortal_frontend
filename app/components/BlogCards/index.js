"use client";
import { Row, Col, Card, Container } from "react-bootstrap";
import styles from "./BlogCards.module.css"; // Update with your actual styles file
import { useRouter } from "next/navigation"; // Use Next.js router instead of react-router

const BlogCards = ({ blogs, posts, showPosts = false }) => {
  const router = useRouter(); // Use the useNavigate hook for navigation

  const handleNavigation = (slug) => {
    // Concatenate the slug with the blogs path without extra slashes
    router.push(`/blogs${slug}`);
  };


  return (
    <Container>
      <Row className={styles.blogContainer}>
        <Col lg={8}>
          <Row>
            {blogs.map((blog, index) => (
              <Col lg={6} key={index} className="mb-4">
                {" "}
                {/* 6 columns for 2 cards per row */}
                <Card
                  style={{ border: "none", cursor: "pointer" }}
                  onClick={() => handleNavigation(blog.slug)}
                >
                  <Card.Img variant="top" src={blog.image.src} alt={blog.title} />
                  <div className={styles.dateContainer}>
                    <p className={styles.date}>{blog.date}</p>
                    <p className={styles.date}>by {blog.author}</p>
                  </div>
                  <p className={styles.title}>{blog.title}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        {showPosts && (
          <Col lg={4}>
            <div style={{ marginTop: 35 }}>
              <p className={styles.heading2}>Latest Posts</p>
            </div>
            {posts.map((post, index) => (
              <div key={index}>
                <div className={styles.dateContainer}>
                  <p className={styles.date}>{post.date}</p>
                  <p className={styles.date}>by {post.author}</p>
                </div>
                <p className={styles.descr}>{post.title}</p>
              </div>
            ))}
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default BlogCards;
