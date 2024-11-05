import styles from "./ImageWithDescription.module.css";
import { Container } from "react-bootstrap";
const ImageWithDescription = ({ media, description, noBgColor }) => {
  return (
    <div className={noBgColor ? styles.noBgColor : styles.solutionsContainer0}>
      <Container>
        <div>
          <div style={{ paddingTop: 78 }}>
            <div className={styles.logo}>
              {typeof media === "string" ? (
                <img src={media} alt={`Top-Rated Dental Service`} />
              ) : (
                media
              )}
            </div>
            <p className={styles.financeDesc}>{description}</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ImageWithDescription;
