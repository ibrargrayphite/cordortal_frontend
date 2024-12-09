"use client";
import Star from "../../../public/assets/images/testimonialStar.svg";
import styles from "./UserReviews.module.css";
import { Col, Row } from "react-bootstrap";
import Image from 'next/image';
import defaultMedia from "../../../public/assets/images/solutions/implants.png";


const UserReviews = ({ userReviews }) => {
  return (
    <Row>
      {userReviews &&
        userReviews.map((review) => (
          <Col
            lg={4}
            sm={12}
            key={review.id}
            style={{ marginTop: 30, marginBottom: 30 }}
          >
            <div className={styles.desktopStar}>
              {Array(review.stars)
                .fill()
                .map((_, i) => (
                  <Star src={Star} width={30} height={30} alt="star" key={i} />
                ))}
            </div>
            <p className={styles.title}>{review.title}</p>
            <p className={styles.desc}>{review.description}</p>
            <div className={styles.reviewStarparent}>
              <div>
                <Image src={review.reviewerImage && review.reviewerImage?.startsWith('https') ? review.reviewerImage : defaultMedia.src} width={50} height={50} alt="Learn more about our patients' experiences with our dental services" />
              </div>
              <div>
                <p className={styles.name}>{review.reviewerName}</p>
                <div className={styles.mobileStar}>
                  {Array(review.stars)
                    .fill()
                    .map((_, i) => (
                      <Star src={Star} width={30} height={30} alt="Explore more reviews to understand our dental care quality" key={i} />
                    ))}
                </div>
              </div>
            </div>
          </Col>
        ))}
    </Row>
  );
};

export default UserReviews;
