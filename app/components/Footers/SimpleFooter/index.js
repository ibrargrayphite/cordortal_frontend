"use client";

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTheme } from "../../../context/ThemeContext";
import footer1 from "../../../../public/assets/images/footer/footer1.png";
import footer2 from "../../../../public/assets/images/footer/footer2.png";
import footer3 from "../../../../public/assets/images/footer/footer3.png";
import footer4 from "../../../../public/assets/images/footer/footer4.png";
// import footer1 from '../../../../public/assets/images/footer/footer1.png'
import styles from "./SimpleFooter.module.css";
import Image from "next/image";

const SimpleFooter = ({ footerRights, data }) => {
  const theme = useTheme();

  return (
    <>
      <Container
        fluid
        style={{
          backgroundColor: theme.bgColor,
          padding: "50px 0",
          marginTop: 80,
        }}
      >
        <Container>
          <Row>
            {/* Services Section */}
            <Col>
              <h5 className={styles.sectionHeading}>
                {data.sections.services.heading}
              </h5>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {data.sections.services.items.map((service, index) => (
                  <li key={index} className={styles.listItem}>
                    {service}
                  </li>
                ))}
              </ul>
            </Col>

            {/* Information Section */}
            <Col>
              <h5 className={styles.sectionHeading}>
                {data.sections.information.heading}
              </h5>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {data.sections.information.items.map((info, index) => (
                  <li key={index} className={styles.listItem}>
                    {info}
                  </li>
                ))}
              </ul>
            </Col>

            {/* Company Section */}
            <Col>
              <h5 className={styles.sectionHeading}>
                {data.sections.company.heading}
              </h5>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {data.sections.company.items.map((company, index) => (
                  <li key={index} className={styles.listItem}>
                    {company}
                  </li>
                ))}
              </ul>
            </Col>

            {/* About Us Section */}
            <Col>
              <h5 className={styles.sectionHeading}>
                {data.sections.aboutUs.heading}
              </h5>
              <p className={styles.listItem}>
                {data.sections.aboutUs.description}
              </p>
              <p className={styles.listItem}>
                <strong>Email:</strong> {data.sections.aboutUs.contact.email}
              </p>
              <p className={styles.listItem}>
                <strong>Phone:</strong> {data.sections.aboutUs.contact.phone}
              </p>
            </Col>
          </Row>
          <Row className="items-end">
            <Col>
              <div style={{height:'70px',width: '70px'}}>
                <Image
                  // height={70}
                  // width={70}
                  // style={{ cursor: "pointer", marginTop: 20 }}
                  className="w-full h-full"
                  src={footer1}
                  alt="Certified by the General Dental Council"
                  onClick={() =>
                    window.open("https://www.gdc-uk.org/", "_blank")
                  }
                />
              </div>
            </Col>
            <Col>
              <div style={{height:'70px',width: '70px'}}>
                <Image
                  // height={70}
                  // width={70}
                  // style={{ cursor: "pointer", marginTop: 20 }}
                  className="w-full h-full"
                  src={footer2}
                  alt="Certified by the General Dental Council"
                  onClick={() =>
                    window.open("https://www.gdc-uk.org/", "_blank")
                  }
                />
              </div>
            </Col>
            <Col>
              <div style={{height:'70px',width: '70px'}}>
                <Image
                  // height={70}
                  // width={70}
                  // style={{ cursor: "pointer", marginTop: 20 }}
                  className="w-full h-full"
                  src={footer3}
                  alt="Certified by the General Dental Council"
                  onClick={() =>
                    window.open("https://www.gdc-uk.org/", "_blank")
                  }
                />
              </div>
            </Col>
            <Col>
              <div style={{height:'70px',width: '70px'}}>
                <Image
                  // height={70}
                  // width={70}
                  // style={{ cursor: "pointer", marginTop: 20 }}
                  className="w-full h-full"
                  src={footer1}
                  alt="Certified by the General Dental Council"
                  onClick={() =>
                    window.open("https://www.gdc-uk.org/", "_blank")
                  }
                />
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
      <Row className="mt-4 text-center">
        <Col>
          <p>&copy; {footerRights}</p>
        </Col>
      </Row>
    </>
  );
};

export default SimpleFooter;
