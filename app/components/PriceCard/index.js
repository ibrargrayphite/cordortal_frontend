import styles from "./PriceCard.module.css"; 
import CustomButton from "../CustomButton";
import Link from "next/link";

const PriceCard = ({ Package = false, data }) => {
  const handleBooking = (src) => {
    window.open(src, "_blank");
  };

  return (
    <div className="container lg:max-w-[960px] xxl:max-w-[1320px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col"
          >
            {/* Card */}
            <div className={`${styles.cardParent} flex flex-col flex-grow`}>
              {/* Inner content wrapper */}
              <div className="flex flex-col flex-grow container p-4">
                <p className={styles.cardHeading}>{item.headline}</p>
                {/* Conditionally show cardPricing when Package is true */}
                {Package && (
                  <p className={styles.cardPricing}>{item.packagePrice}</p>
                )}
                <p className={styles.cardDescription}>{item.description}</p>
                {/* Conditionally show service details when Package is true */}
                {Package && (
                  <p className={styles.packageDetail}>{item.packageDetail}</p>
                )}
                {/* Conditionally show servicePriceCard and Get Started button when Package is false */}
                {!Package && item.services && (
                  <>
                    {item.services.map((service, i) => (
                      <div key={i} className={styles.servicePriceCard}>
                        <p className={styles.serviceDetail}>
                          <span dangerouslySetInnerHTML={{ __html: service.serviceName }}/>
                          <span dangerouslySetInnerHTML={{ __html: service.servicePrice?": ":"" }}/>
                          {/* {service.serviceName}{`${service.servicePrice?": ":""}`} */}
                          <span className={styles.servicePricing}>
                            {service.servicePrice}
                          </span>{" "}
                          {service.serviceFor && (
                            <span>{service.serviceFor}</span>
                          )}
                        </p>
                      </div>
                    ))}

                    {/* Button aligned bottom */}
                    <div className="mt-auto">
                      <Link href={item.src} target="_blank">
                        <CustomButton
                          headline="Get Started"
                          //  onClick={() => handleBooking(item.src)}
                          className={styles.customButton}
                        />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceCard;
