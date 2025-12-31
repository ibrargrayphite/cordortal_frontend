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
      <div className={`pt-4 md:pt-2 lg:pt-5 container w-full lg:max-w-[960px] xxl:max-w-[1320px] mx-auto`}>
        <div className={`${styles.cardGrid} gap-0`}>
          {services &&
            services.map((service, index) => (
              <div
                key={index}
                className="m-2 md:m-3 lg:m-4"
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
                    <h5 className={styles.description} dangerouslySetInnerHTML={{__html: service.description}} />
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
