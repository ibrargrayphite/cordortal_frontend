import styles from "./ImageWithDescription.module.css";
import { Container } from "react-bootstrap";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const ImageWithDescription = ({ media, description, noBgColor }) => {
  const mediaSource = media && media?.startsWith('https') ? media : defaultMedia.src;

  return (
    <div className={noBgColor ? styles.noBgColor : styles.solutionsContainer0}>
      <Container>
        <div>
          <div style={{ paddingTop: 78 }}>
            <div className={styles.logo}>
              {typeof media === "string" ? (
                <Image width={100} height={100} src={mediaSource} alt={`Top-Rated Dental Service`} />
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
