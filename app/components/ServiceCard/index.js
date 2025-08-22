"use client";

import styles from "./ServiceCard.module.css"; 
import { useRouter } from "next/navigation";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const ServiceCard = ({
  services,
  noBgColor = true,
  noClickableCard = true,
}) => {
  const router = useRouter();

  return (
    <div className={noBgColor ? styles.noBgColor : styles.solutionsContainer0}>
      <div className={`${styles.servicesParent} container mx-auto`}>
        <div className={styles.cardGrid}>
          {services &&
            services.map((service, index) => (
              <div
                key={index}
                className={styles.cardGap}
                onClick={() => {
                  if (!noClickableCard) {
                    router.push(`/services/${service?.slug}`);
                  }
                }}
              >
                <div className={styles.card}>
                  <Image
                    priority={true}
                    width={100}
                    height={116}
                    src={service.media && service.media?.startsWith('https') ? service.media : defaultMedia.src}
                    className={styles.imageSize}
                    alt={`${service.headline}`}
                  />
                  <div className="container">
                    <h3
                      className={styles.title}
                      dangerouslySetInnerHTML={{ __html: service.headline }}
                    />
                    <h4 className={styles.subtitle}>
                      <ul className={styles.noBullets}>
                        {service?.bullets?.map((bullet, bulletIndex) => (
                          <li key={bulletIndex}>{bullet}</li>
                        ))}
                      </ul>
                    </h4>
                    <h5 className={styles.description}>
                      {service.description}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
