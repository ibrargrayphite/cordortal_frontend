import styles from "./PriceCard.module.css"; 
import CustomButton from "../CustomButton";
import Link from "next/link";

const PriceCard = ({ Package = false, data }) => {
  const handleBooking = (src) => {
    window.open(src, "_blank");
  };

  return (
    <div className="container lg:max-w-[960px] xxl:max-w-[1320px] mx-auto">
      {/* Bootstrap row mimic: flex-wrap + negative margins for gutters */}
      <div className="flex flex-wrap justify-center">
        {data.map((item, index) => (
          <div
            key={index}
            // Bootstrap Col: sm=7, lg=3 with gutter padding
            className="w-full sm:w-7/12 lg:w-3/12 px-2 flex"
          >
            {/* Card */}
            <div className={`${styles.cardParent} flex flex-col flex-grow`}>
              {/* Inner content wrapper */}
              <div className="flex flex-col flex-grow container">
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
