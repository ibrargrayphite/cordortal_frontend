import { Row, Col, Card, Container } from "react-bootstrap";
import styles from "./PriceCard.module.css"; 
import CustomButton from "../CustomButton";
import Link from "next/link";

const PriceCard = ({ Package = false, data }) => {
  const handleBooking = (src) => {
    window.open(src, "_blank");
  };

  return (
    <Container>
      <Row className="d-flex justify-content-center">
        {data.map((item, index) => (
          <Col key={index} sm={7} lg={3} className="d-flex">
            {" "}
            {/* Added d-flex for flex behavior */}
            <Card
              className={`${styles.cardParent} d-flex flex-column flex-grow-1`}
            >
              {" "}
              {/* flex-grow-1 ensures equal height */}
              <Container className="d-flex flex-column flex-grow-1">
                {" "}
                {/* Vertically align content */}
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
                      <>
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
                     </>
                    ))}
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
              </Container>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PriceCard;
