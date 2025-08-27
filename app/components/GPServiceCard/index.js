"use client";

import styles from "./ServiceCard.module.css"; // Assuming you have styles for your component
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
      <div className={`container lg:max-w-[960px] xxl:max-w-[1320px] mx-auto ${styles.servicesParent}`}>
        {/* Bootstrap Row replacement: gutters + flex wrap */}
        <div className="flex flex-wrap">
          {services &&
            services.map((service, index) => (
              <div
                key={index}
                className={`px-3 w-full lg:w-1/3 ${
                  noClickableCard ? "" : styles.solutionsCol
                }`}
                onClick={() => {
                  if (!noClickableCard) {
                    router.push(`/gp-services/${service?.slug}`);
                  }
                }}
              >
                <div className={styles.solutionIcons}>
                  <Image
                    priority={true}
                    width={100}
                    height={116}
                    src={
                      service.media && service.media?.startsWith("https")
                        ? service.media
                        : defaultMedia.src
                    }
                    className={styles.imageSize}
                    alt={`${service.headline}`}
                  />
                </div>
                <div className="container mx-auto px-4">
                  <h3
                    className={styles.solutionsTitle}
                    dangerouslySetInnerHTML={{ __html: service.headline }}
                  />
                  <h4 className={styles.sectionText}>
                    <ul className={styles.noBullets}>
                      {service?.bullets?.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  </h4>
                  <h5 className={styles.sectionDescription}>
                    {service.description}
                  </h5>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
