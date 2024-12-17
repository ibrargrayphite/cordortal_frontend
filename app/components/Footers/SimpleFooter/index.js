"use client";

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTheme } from "../../../context/ThemeContext";
import styles from "./SimpleFooter.module.css";
import Image from "next/image";
import defaultMedia from "../../../../public/assets/images/solutions/implants.png";

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
            <Col>
  <div className="flex flex-wrap justify-center gap-4">
    {data.media.map((image, index) => (
      <div 
        key={index} 
        className="w-20 h-20 flex items-center justify-center  overflow-hidden cursor-pointer"
        onClick={() => window.open(image.link, "_blank")}
      >
        <Image 
        loading="lazy"
          src={image && image.url?.startsWith('https') ? image.url : defaultMedia.src}
          alt="Certified by the General Dental Council"
          width={70}
          height={70}
          className="object-cover"
        />
      </div>
    ))}
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
