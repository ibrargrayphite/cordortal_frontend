"use client";

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTheme } from "../../../context/ThemeContext";
import styles from "./SimpleFooter.module.css"

const SimpleFooter = ({footerRights,data}) => {
    const theme = useTheme();

  return (
    <>
     <Container
        fluid
        style={{
          backgroundColor: theme.bgColor,
          padding: "50px 0",
          marginTop:80
        }}
      >
        <Container>
          <Row>
            {/* Services Section */}
            <Col>
              <h5 className={styles.sectionHeading}>{data.sections.services.heading}</h5>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {data.sections.services.items.map((service, index) => (
                  <li key={index} className={styles.listItem}>{service}</li>
                ))}
              </ul>
            </Col>

            {/* Information Section */}
            <Col>
              <h5 className={styles.sectionHeading}>{data.sections.information.heading}</h5>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {data.sections.information.items.map((info, index) => (
                  <li key={index} className={styles.listItem}>{info}</li>
                ))}
              </ul>
            </Col>

            {/* Company Section */}
            <Col>
              <h5 className={styles.sectionHeading}>{data.sections.company.heading}</h5>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {data.sections.company.items.map((company, index) => (
                  <li key={index} className={styles.listItem}>{company}</li>
                ))}
              </ul>
            </Col>

            {/* About Us Section */}
            <Col>
              <h5 className={styles.sectionHeading}>{data.sections.aboutUs.heading}</h5>
              <p className={styles.listItem}>{data.sections.aboutUs.description}</p>
              <p className={styles.listItem}>
                <strong>Email:</strong> {data.sections.aboutUs.contact.email}
              </p>
              <p className={styles.listItem}>
                <strong>Phone:</strong> {data.sections.aboutUs.contact.phone}
              </p>
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
